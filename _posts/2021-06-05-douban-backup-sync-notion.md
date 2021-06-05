---
layout: post
title: 豆瓣标记导出到 Notion 并同步
date: 2021-06-05
disqus: y
---

我个人的豆瓣标记条目导出到 Notion 并同步的一套操作和工具，并不适用于所有人。并且可能还有问题没有发现。

## 1. 使用油猴脚本一键导出`看过/读过/听过`的电影、书、音乐条目

脚本 -> [豆瓣读书+电影+音乐导出工具](https://greasyfork.org/en/scripts/420999-%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6-%E7%94%B5%E5%BD%B1-%E9%9F%B3%E4%B9%90%E5%AF%BC%E5%87%BA%E5%B7%A5%E5%85%B7)

是我从另外一个友邻的脚本完善修改的，安装后会在自己的豆瓣页面上看到多出三个链接：

![](/assets/images/douban-backup-monkey-script.png)

分别点击这三个链接就会分别从 `https://movie.douban.com/mine?status=collect`, `https://music.douban.com/mine?status=collect`, `https://book.douban.com/mine?status=collect` 这三个地方自动翻页去获取个人标记数据（包括评分、评分时间以及短评）并最终导出 csv 文件。

因为这三个地方不是具体条目页面，所以页面访问 limit request 并不严格，所以这样跑脚本完全不会被当做机器人而遭到封禁 IP 或要求重新登录之类的处理。
但局限也就是这里无法准确获取更多有关条目本身的信息，比如电影条目的 IMDb 链接、制片国家，也无法精准把导演和演员之类的人名区分开。

## 2. 在 Notion 创建 database 并导入 csv

在 Notion 中新建一个 database，也就是表格。然后给表格设置每一列的 Property 名字和类型，名字需要对应前面导出的 csv 的表头的名字和顺序。

例如我的油猴脚本导出的 csv 是这样的:

| 标题                  | 个人评分 | 打分日期   | 我的短评                                                   | 上映日期   | 制片国家 | 条目链接                                   |
| --------------------- | -------- | ---------- | ---------------------------------------------------------- | ---------- | -------- | ------------------------------------------ |
| 音乐 / 音楽           |          | 2021/05/22 |                                                            | 2019/09/26 | 加拿大   | https://movie.douban.com/subject/34429100/ |
| 王者天下 / キングダム | 2        | 2021/05/19 | 太难看了，真是适合飞机上打发时间，只有麻酱太美太帅了！！！ | 2019/04/19 | 日本     | https://movie.douban.com/subject/27611498/ |

如果不喜欢这个顺序，可以自己用 excel 或类似工具打开调整顺序后再重新导出 csv 文件。

然后在 Notion 页面都右上角菜单打开后选择 Merge with CSV 并选择这个 csv 文件后稍等片刻即可完成导入。

![](/assets/images/douban-backup-notion-merge-csv.png)

导入后大致效果：

![](/assets/images/douban-backup-notion-db.png)


## 3. 使用 GitHub Actions 定时从 RSS 信息将豆瓣标记更新同步到 Notion

虽然尽量把豆瓣标记条目备份导出了，但并没有打算完全不用豆瓣了，毕竟的确没有完美的替代，这里的友邻也都依然是我喜欢和期望看到的。
所以上面两步其实我 4 个月前就做好了的，但对我来说最大的困扰是如何在上面的操作后期继续同步标记呢？
每个条目都手动输入的话可太麻烦了，那每次都从豆瓣重新导出 csv 再将新的条目合并进 Notion 操作起来似乎也很麻烦。

后来我想到的一个方法是通过 RSS，所幸这么多年过去了，google reader 都死掉了，豆瓣的 RSS 依然还保留着。
在个人页面的右下角一直安静地存在着：

![](/assets/images/douban-rss.png)

以[我的账号的 RSS 信息](https://www.douban.com/feed/people/MoNoMilky/interests)为例，
这个 feed 里只有书影音的标记信息，并且想看、在看、看过三类状态的信息也都包括。缺点是仅有保留最新的 10 条信息。

所以我个人的方法是定时读取这个 RSS feed，然后从中将新的标记信息自动更新到 Notion 里去，就很方便了。
这个想法在 4 个月前就基本成型了，但等到 Notion 提供 Public API 之后才终于能够实现了。

完成的脚本 -> [sync-rss](https://github.com/bambooom/douban-backup/blob/main/sync-rss.js) 就是做了上述事项，其中也顺便针对每个新的条目去条目页面截取了更多我想要保留的信息，因为数量很少所以也不会引发被封锁 IP。

最后这个脚本需要定时跑，也就是一个 cron job 而已，又穷又懒的我，发现了 GitHub 近来在推的自家的 Actions 功能是可以做定时任务的，[参考文档](https://docs.github.com/en/actions/reference/events-that-trigger-workflows#scheduled-events)。
免费用户的公开仓库似乎也完全不限制 Actions 的使用（Private repo 是有限制使用分钟数的），所以我在仓库里添加了这个 [workflow 设置文件](https://github.com/bambooom/douban-backup/blob/main/.github/workflows/sync-rss.js.yml)。
我设置的是每 6 个小时跑一次，因为我的标记也没有那么频繁，应该是够用了的。

最终 -> [我的 Notion 书影音 database](https://www.notion.so/f6ff9481e3c044b09d9a46645e92d5b8)
