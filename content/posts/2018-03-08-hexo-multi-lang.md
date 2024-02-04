---
draft: false
title: hexo 多语言 blog
date: 2018-03-08
categories: Tech
comments: true
isCJKLanguage: true
---

虽然自己是个懒惰的 github pages + jekyll user, 连域名都懒得花钱折腾的那种, 但是其他原因折腾了一下 [hexo](https://hexo.io/), 简单说下我认为比较靠谱的多语言 blog 方案.

## 需求
虽说多语言, 当然先以中英文为例, 主要需求是这样的:
- 目录链接等模板 text 肯定是中英文分开, 这个很容易
- 中英文 posts 分开, 某些文章可能两种语言都有, 某些文章可能只有其中一种
- tag/category/archive 都是分开的
  - 因为一开始还尝试过修改 index render 方法, 在 front-matter 里添加一个 `lang: cn` 然后在 render 的时候 filter 掉
  - 这样 index page 是没有问题, 但是 tag/category/archive 等地方, 一样会混在一起

## 搜索和尝试
一开始搜索一通之后, 发现[这篇](http://kvh.io/cn/hexo-nginx-multi-lingual.html)文章的作者和我的需求比较一致, 也感谢他的折腾, 我节省了尝试 hexo-generator-i18n 和 hexo-multilingual 插件的时间.

但对于[官方国际化机制](https://hexo.io/docs/internationalization.html)也 failed, 我表示有一丝丝怀疑, hexo 自己的网站也是用自己的 dogfood 建出来的, 怎么人家有辣么多种语言呢?

仔细看了下它[自己网站的代码](https://github.com/hexojs/site)和[编译生成的结果](https://github.com/hexojs/hexojs.github.io), 发现它是这样的:
- `source` 文件夹下面, 每种语言一个文件夹
- 这个语言文件夹下, 首先有一个 [`index.jade`](https://github.com/hexojs/site/blob/master/source/zh-cn/index.jade) 页面, 按照它网站的设计, 主页只是一个 landing page, 所以没有什么特别的
- 除此之外就是 [api 和 docs 两个文件夹](https://github.com/hexojs/site/tree/master/source/zh-cn) 放着翻译好的 md 文档
- 按照官网的设计, 只有这两个类别里面的文档需要多语言翻译, 另外三个 menu, 一个是 release news 用的, 一个是展示 plugins 用的, 一个是展示 theme 用的, 都并没有也不需要翻译
- 另外, 官网的文档也并不使用 tag/category/archive, 因为有一个 algolia 搜索

所以结论很明显: 用官方方案的确不能满足需求.

## 所以用 npm script 咯
前面[那篇 post](http://kvh.io/cn/hexo-nginx-multi-lingual.html) 建两个文件夹再加 nginx 代理的方法, 我觉得是靠谱的, 但是一个问题是, 作者是分开两个仓库进行更新的, 那么会导致如果想要改样式和 layout, 那就需要再两个仓库里分别更新, 这个是绝对很蛋疼的.
实际上作者的中英文网站的确在布局上不完全一样.

我一定希望只有一个仓库, 所以自己尝试了以下方法:

### `_config.yml`

```yml
...
url: http://yoursite.com/
root: /en
language: en
public_dir: public/en
...
```

其余的就不说了, 先设置默认的 language 是英文, 生成在 `public/en` 路径下

### `_config.cn.yml`

```yml
language: zh-CN
root: /cn
public_dir: public/cn
```
我另外单独创建了一个中文专用的 config 文件, 她可以只有上面几行.

### 文件夹
在根目录下分别创建 `en` 和 `cn` 目录来分别存放中英文 post

### scripts 上
其实想法非常简单, 每次 build 的时候, 如果是英文 blog, 则将 `en` 下的 posts 复制到 `source/_posts` 下,
也就是正常添加文章的地方, 然后再编译生成.

简单来说就是:
```sh
cp -r en/* source/_posts && hexo generate
```

这样, 在 public 下生成了 `en` 文件夹包含了所有英文 blog.

中文 blog 类似, 不一样的地方是将 `_config.cn.yml` 派上用处咯, 所幸 hexo 提供了一个 [alternate config](https://hexo.io/docs/configuration.html#Using-an-Alternate-Config) 的功能.
也就是说你可以选择当前使用哪一个 config 文件, 或者使用多个 config 文件.
这样就可以用 `hexo server --config _config.yml,_config.cn.yml` 这种命令来打造中文 blog 所需要的 config.
`_config.cn.yml` 放在后面才能覆盖掉英文 blog 的设置.

所以中文 blog 的 build 就是:
```sh
cp -r en/* source/_posts && hexo generate --config _config.yml,_config.cn.yml
```

这样, 在 public 下就会有 en 和 cn 两个样式一致但内容完全分开的 blog, 直接将 public 丢到 github pages 或者 netlify 之类可以 serve 静态网页
或者自己的服务器上跑一下 nginx, 就 over 了.


一个小问题是这样, 如果没有自己的服务器, 就简单丢到 netlify 类型的网站上 serve 的话, 可能必须直接到 `http://yoursite.com/en/` 或者 `http://yoursite.com/cn/` 才能正常访问.
这里一个小小的 hack 是这样, 加一个空白的 `index.html` 在 public 下, 根据浏览器的默认语言选择直接改一下 location redirect 到 `/en/`
或者 `/cn/` 上即可.

最后 npm script 可以设置成这样:
```json
"build:en": "rm -rf source/_posts/* && cp -r en/* source/_posts && hexo generate && rm -rf source/_posts/*",
"build:cn": "rm -rf source/_posts/* && cp -r cn/* source/_posts && hexo generate --config _config.yml,_config.cn.yml && rm -rf source/_posts/*",
"build": "rm -rf public && npm run build:en && npm run build:cn && cp index.html public/"
```

当然不用 npm script, 用 Makefile 也同样可以达到目的.
以及这个方法即使有其他更多语言都可以 hold 住了. 🤟🏻🖖🏻
