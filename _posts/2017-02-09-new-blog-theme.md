---
layout: post
title: change blog theme
date: 2017-02-09 20:42:31
disqus: y
---

早就想换个模板, 选模板的时间比起改模板来, 耗费太多时间, 选择困难....

不想再拖延了, 选了个 [brume](https://github.com/aigarsdz/brume), 花了两个晚上就改完了.

然后根据之前用的 scribble 模板的一些地方, 修改了几个地方:

+ 把所有 config 都放在同一个文件`_config.yml`里
+ 做了个小小的 favicon
+ 添加 disqus
+ 修改 config 中的 permalink 为`/:year/:month/:day/:title/`, 这是因为 disqus 的 link 里面是之前的 blog link, 要显示正常, 需要设置 permalink, 参考[官方文档 - Permalinks](https://jekyllrb.com/docs/permalinks/)
+ 去掉了首页的 logo, 修改小部分 css 样式
+ 修改以前的 post, 有部分 markdown 渲染和以前不同