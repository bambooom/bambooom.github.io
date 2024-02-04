---
draft: false
title: ESLint 简易教程
date: 2017-05-04 23:42:31
categories: Tech
comments: true
isCJKLanguage: true
---

## 简介
- [官网](http://eslint.org/docs/user-guide/getting-started)
- 一些教程:
  * [ESLint 使用入门](https://csspod.com/getting-started-with-eslint/)
  * [Lint 工具 -- JavaScript 标准参考教程（alpha）](http://javascript.ruanyifeng.com/tool/lint.html)

## 安装
```
# 推荐项目本地安装, 而不是全局安装
$ npm install eslint --save-dev

# 列出所有可用命令
$ ls -la node_modules/.bin
# 结果
...
eslint -> ../eslint/bin/eslint.js
...
```

## 使用
### 初始化配置文件
```
$ ./node_modules/.bin/eslint --init
```
- 有三种方式初始化:
  - `Answer questions about your style`
      - 通过几个简单的问题生成配置文件, 主要问题有关 tab/spaces, 是否使用 ES6, 是否使用 React, 是否在浏览器中运行等
      - 生成配置文件较基础,较简单
  - `Use a popular style guide`
      - 可从 [Google](https://google.github.io/styleguide/javascriptguide.xml)/[Airbnb](https://github.com/airbnb/javascript)/[Standard](https://github.com/feross/standard) 中选择其他人的最佳实践
  - `Inspect your JavaScript file(s)`
      - 直接从已有项目代码中检测合适配置
- 个人推荐可以直接使用 [Airbnb style guide](https://github.com/airbnb/javascript)
- 初始化完成后, 会在项目根目录生成配置文件 `.eslintrc.*`, 可选文件类型 JavaScript/JSON/YAML
- 或者可以在 `package.json` 中添加 `eslintConfig` 来配置
- 另外, 可以创建 `.eslintignore` 文件配置需要忽略的文件, 例如:

```
# /node_modules/* and /bower_components/* ignored by default

# Ignore built files except build/index.js
build/*
!build/index.js
```

- 具体每项配置的意思需参考[Configuring ESLint](http://eslint.org/docs/user-guide/configuring)

### 针对某个文件 `file.js` 进行检查

```
$ ./node_modules/.bin/eslint file.js
```
-> 直接在命令行打印出相关 error/warning

```
$ ./node_modules/.bin/eslint file.js --fix
```
-> 使用 `--fix` 选项可以直接自动修正, 主要修正 whitespaces 问题, 其他可修正的问题可参考[官方文档中列出的 rules 中带🔧项](http://eslint.org/docs/rules/)

```
$ ./node_modules/.bin/eslint file.js -o lintResult.html -f html
```
-> 上面命令将检查报告输出为 `lintResult.html` 静态页面, 并将在浏览器中打开此页面, 易于阅读, 其他报告模式可参考[官方文档 - formatter](http://eslint.org/docs/user-guide/formatters/)



对某些需要特殊处理的部分, 可在代码中使用注释更改 eslint 规则, 例如:

```javascript
/* eslint-disable no-alert, no-console */

alert('foo');
console.log('bar');

/* eslint-enable no-alert, no-console */
```

- 其他可使用 CLI 命令参考[Command Line Interface - ESLint](http://eslint.org/docs/user-guide/command-line-interface)


### 针对 React 项目
- 由于一般项目初始化使用 `create-react-app` 作为脚手架, 实际上, 其中已包含 eslint 配置
  - 主要配置已包在 `./node_modules/react/scripts` 中, 具体配置项可参考[create-react-app/index.js](https://github.com/facebookincubator/create-react-app/blob/master/packages/eslint-config-react-app/index.js)
- 仍然可以在根项目初始化配置文件, 并进行代码检查, 但此处的检查并不影响浏览器 console 中打印的 log
