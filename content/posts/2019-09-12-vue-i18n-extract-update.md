---
draft: false
title: extract and update messages for vue-i18n
date: 2019-09-12 23:21:42
comments: true
---


搞 Vue i18n 的时候暂时了解有两套方案。一套是主要用 [vue-gettext](https://github.com/Polyconseil/vue-gettext)
以及搭配 GNU gettext utilities 的几个 command (`msgmerge` / `msginit` / `msgattrib`)一起使用，整体工具链用起来并不是很舒服，上手难度并不小。
vue-gettext 本身也有几个 known issue 无法解决。
作为前端，比较希望能完全用 js 解决就好，不需要依赖其他。
然后才开始仔细研究另一种方案，也就是 [vue-i18n](https://github.com/kazupon/vue-i18n)。因为这个库的作者也是 vuejs core team，看着 star 最多，大概也是比较靠谱的。

大致试过之后觉得 vue-i18n 使用起来比 gettext 系列简单轻巧多了，唯一的不足是翻译的 messages 文件需要自己手写。

如果添加了新的页面，有新的 string 需要翻译，或者有些页面文字修改了，翻译也需要同步修改的时候，
vue-i18n 就似乎没有这个 extract & update 的功能。

理想的工作流程是做页面的时候，文字全部都按照默认语言写上并标注（vue-i18n 的情况就是用上 `$t` 或者 `$tc` 等）。页面完成后，启用某个 npm script 即可生成或者更新待翻译的文件。
最不希望的就是在做页面中间或者完成后，还得自己记得维护去更新待翻译的字符串。

今天又搜索了一下能提取 vue-i18n 标注的现成方案，暂时只找到一个比较靠谱的，
[vue-i18n-extract](https://github.com/pixari/vue-i18n-extract/)。

npm install 试了一下之后又仔细看了看文档和 issue，发现 vue-i18n-extract 其实也只做了 extract 部分，更新现有文件部分处于讨论阶段，并没有完成。
但是这个工具的作者做了提取之后也做了一个与现有翻译文件的比较，所以可以输出一个 `report`，
也就是我最想知道的哪些 string 还不在文件里（`missingKeys`），以及哪些已经不存在了（`unusedKeys`）。

`report` 本身就是个 plain object，自己基于这个再加工一下不就可以得到自己想要的东西了嘛！


## Demo

假设现在有这么两个翻译文件

```js
// lang/en_US.js
export default {
  'a-hello': 'Hello World!',
  'b-hello': 'Hello Banana!',
  //'c-hello': 'Hello Catherine!',
}

// lang/zh_CN.js
export default {
  'a-hello': '你好世界！',
  'b-hello': '你好🍌！',
  //'c-hello': '你好凯瑟琳！',
}
```

然后在页面上有一个新的 `c-hello` 需要提取出来进行翻译。
简单写个 helper script:

```js
// extract.js
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const Extract = require('vue-i18n-extract').default;

/* global __dirname */
const readDir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

(async() => {
  let langFiles = await readDir(path.resolve(__dirname, './lang'));
  langFiles = langFiles.map(file => {
    return path.resolve(process.cwd(), file);
  });

  for (let file of langFiles) {
    const langModule = require(file);
    // get the lang messages as an object
    const langObj = (langModule.default) ? langModule.default : langModule;
    // extract .vue/.js files and compare with current lang files
    const report = Extract.createI18NReport('./path/to/vue-files/**/*.?(js|vue)', file);
    // report object has two major parts:
    // - `missingKeys` part are those msgs lack of translations, not in current po file
    // - `unusedKeys` part are those msgs not present in vue/js files
    for (let item of report.missingKeys) {
      langObj[item.path] = item.path; // add missing string, default same as the source
    }
    for (let item of report.unusedKeys) {
      delete langObj[item.path]; // remove unused string
    }

    // langObj had been synced with vue/js files with latest message strings
    // now update the lang files
    const langStr = 'export default ' + JSON.stringify(langObj, null, 2);
    await writeFile(file, langStr, 'utf-8');
  }

  console.log('Updated all lang files');
})();
```

`node extract.js` 之后待翻译文件应该会变成这样：

```js
// lang/en_US.js
export default {
  'a-hello': 'Hello World!',
  'b-hello': 'Hello Banana!',
  'c-hello': 'c-hello',
}

// lang/zh_CN.js
export default {
  'a-hello': '你好世界！',
  'b-hello': '你好🍌！',
  'c-hello': 'c-hello',
}
```

然后再统一进行翻译就可以了。

最后，仔细想了想，我可以比较简单处理 extract 的结果是因为我在 language files 里不使用复杂的嵌套结构，
和传统的 po 文件一致，就是 key：value 的一一对应关系，但很多使用 vue-i18n 的人大概还会利用 js object 嵌套很深，
比如 [vue-i18n-extract 的 demo](https://github.com/pixari/vue-i18n-extract/tree/master/demo) 中给的一个例子就是这个样子：

```js
// de_DE.js
export default {
  header: {
    titles: {
      title_a: 'test',
      title_b: 'test',
      title_c: 'test',
    },
    paragraphs: {
      p_a: 'test',
      p_b: 'test',
    },
  },
};
```

如果是这个情况，更新起来的确费事一些，但根据自己实际情况，应该也还是可以处理的。
