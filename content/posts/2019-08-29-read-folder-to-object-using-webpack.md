---
draft: false
title: read folder to object using webpack
date: 2019-08-29 23:42:31
categories: Tech
comments: true
isCJKLanguage: true
---


一个小需求, 把某一个文件夹中的所有文件在 Vue 组件里读为 string, 保持文件夹的层级顺序.
根据同事提醒的方法, 稍微淆习了一下, 用 [raw-loader](https://webpack.js.org/loaders/raw-loader/) 以及 [`require.context`](https://webpack.js.org/guides/dependency-management/#requirecontext)

假设有一个文件夹 `test` 里的层级是这个样子, 几个 txt 都是一些简单的文本:

```
test
|____t2
| |____ee.txt
| |____dd.txt
|____t1
| |____hehe.txt
| |____other
| | |____cc.txt
| |____some
| | |____aa.txt
| | |____bb.txt
```

## 配置 webpack

将文件读入成 string, 不需要做其他操作, 使用 raw-loader 简单配置一下就好:

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ],
  },
};
```

## helper function

在 `test` 文件夹相同层级加个 `index.js` 写个 helper 函数:

```js
// index.js

function readAll(context, cache) {
  context.keys().forEach(key => {
    // key example: "./t1/other/cc.txt"
    const path = key.split('/'); // eg: [".", "t1", "other", "cc.txt"]
    let index = 1;
    let sub = cache;

    while (index < path.length) {
      const f = path[index]; // folder or file name
      if (index == path.length - 1) { // last one is file name
        sub[f] = context(key).default; // get content of the file as string
      } else {
        if (!(f in sub)) {
          sub[f] = {};
        }
        sub = sub[f];
      }
      index++;
    }
  });
}

const test = {};
readAll(require.context('./test', true, /\.txt$/), test);

export {test};

// console.log(test);
// output:
// {
//   "t1": {
//     "hehe.txt": "test hehe.txt\n\nhehehehehehehehe\n",
//     "other": {
//       "cc.txt": "test cc.txt\nhello cc\n"
//     },
//     "some": {
//       "aa.txt": "test aa.txt\nhello aa\n",
//       "bb.txt": "test bb.txt\nhello bb\n"
//     }
//   },
//   "t2": {
//     "dd.txt": "test dd.txt\nhello dd\n",
//     "ee.txt": "test ee.txt\nhello world\n"
//   }
// }
```

这样在其他 `.vue` 或者其他 `.js` 文件里都可以直接 `import` 即可得到与文件夹层级对应的 object, 以及文件对应的文件名和内容.
`test` 中的文件夹或文本文件内容都可以自由更改.

## 简单说明

`require.context` 是 webpack 提供的一个功能, 简单来说就是在编译时让 webpack 动态地加载并 resolve 某些你需要的 modules.

> require.context is a special feature supported by webpack's compiler that allows you to get all matching modules starting from some base directory. The intention is to tell webpack at compile time to transform that expression into a dynamic list of all the possible matching module requests that it can resolve, in turn adding them as build dependencies and allowing you to require them at runtime.

 from [webpack - What is \`require.context\` - Stack Overflow](https://stackoverflow.com/questions/54059179/what-is-require-context)

语法见文档:

```js
require.context(directory, useSubdirectories = false, regExp = /^\.\//);
```

这个函数返回的是 `context`, 它可以像 `require` 一样使用:
- `context.keys()`: 返回一个 array 包括了所有找到的符合 regex 的文件路径
- `context(key)`: like `require("path/to/file")`, 而又因为设置了 raw-loader, 所以它返回的是一个 `Module`, `Module.default` 就得到了文件本身的内容 as string.

最后得到的 object 的结构, 可根据需求调整.
