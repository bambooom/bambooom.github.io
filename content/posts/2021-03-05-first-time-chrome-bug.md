---
draft: false
title: 第一次发现了 Chrome 的 bug
date: 2021-03-05
categories: Tech
comments: true
isCJKLanguage: true
---

[bug issue](https://bugs.chromium.org/p/chromium/issues/detail?id=1154551)

嘛，这个 bug 完全不影响正常使用，是只会影响开发体验的 devtools 的 bug。

简单来说，就是 websocket 传输的 binary message，本来应该是可以选择转换成三种模式查看：Base64, Hex, UTF-8。
devtools 这里会有个 converter tool 来自由切换。
然而这个 converter tool 从某个版本开始突然不见了，所有的 binary 只能显示成 Hex。
debug 内容渲染问题的时候就必须换成 Firefox 去看看内容。

去提 issue 之前，很怕是自己电脑或者版本的问题，找同事的 Chrome、Edge 确认了一圈，才终于在 12 月2 号去给 Chromium 提了 issue，很紧脏地我发现自己还是写了些语法不对的东西，然而提交了之后就不能修改了😅。

没想到回复来得还挺快，第二天开始就有 Project Member 开始行动了，观察 issue 回复和 label，可以大概知道他们是怎么工作的。
大概先是有人贴上 label 需要 bisect testing，然后有人（或者应该有自动化测试的东西？）测试过后，确认问题出在哪个 build 上，然后定位哪个 commit change。
定位到 commit 就直接找相关负责的人改代码修 bug 了吧，然后 review 代码。
最后有人来 verify bug fixed, issue closed.

整个 bug 修复过程大概 8-9 天。最后的回复是说在 89.0.4350.4 上已验证修复。
然而当时 stable version 才 87，直到今天我才更新上 89.0.4389.72。也就是说一个很不重要的 bug 修复，基本上要等上 3 个月才会上到 stable release。
