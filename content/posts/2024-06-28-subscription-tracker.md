---
draft: false
title: 记录一下整理订阅记录 Notion 表格的过程
date: 2024-06-28
categories: Side Project
comments: true
ShowToc: false
isCJKLanguage: true
---

如标题，在 Notion 里整理了大致的订阅记录数据。

1. 搜索了一下，搜出 Notion 的一篇模版介绍：[Top 10 Free Subscription Tracker Templates](https://www.notion.so/templates/collections/top-10-free-subscription-tracker-templates-in-notion)
2. 这 10 个模板里面大致了解或者简单试用了一下之后，比较喜欢[第 6 个模板](https://butternut-canid-9ad.notion.site/Subscription-Tracker-c9f10fdaa62044eda1f75d39a8a484aa)，所以 Duplicate 了它
3. 本以为就继续直接填订阅的服务/内容和价格数字就可以了，结果发现如下问题：
  - 老外做的模板，首先 Currency 显示的都默认是 USD。
    - 这个不是大事，就是得所有和数字相关的地方都得手动修改一下 format 为 yuan。
    - 不过，其实有的服务我支付的其实也是 USD，但全都换算成了 CNY，是为了方便统计。汇率会尽量使用支付的时间点的汇率。
  - 几乎所有的模板都有个通病，默认每年都是一样的价钱。实际上，每年的价钱都可能不一样，遇到优惠活动是会不一样的。
  - 默认一年就是标准的 365 天，今年是 10 月 26 日开始，那么服务截止就是明年的 10 月 26 日。实际上不是每家公司都是这样，有的认为一年是 372 天，有的认为一年是 366 天。还有些会因为优惠活动额外 bonus 一天一周或一月，这些全都会导致服务到期的时间并不是可以简单 formula 计算的。
  - 没考虑过买断制的情况。
4. 爆改模板，主要是改数据库结构
5. 在各个地方找回/搜集订阅的服务的相关数据，填入表格

总的来说，我的思路是，基础的 Database 应该有 4 张表：
- **Payments**
  - 理解成 Order History。实际上我也是自己去到每个我使用的服务，比如网易云音乐里找订单历史，把它们一个个填入表格。
  - 建立 **Payments** 和 **Subscriptions** 的 Relation，这样就知道是什么服务的订单数据。
  - 过往的订单我也全部整理出来了，这样也方便看每年的价钱变更。比如我把百度盘的 SVIP 列出来才发现前年买贵了（¥298），去年只需要 ¥178 的。
  - 另外，服务的截止日期是我手动填的，并非自动让它从起始日期往上添加标准的 365 天。
- **Subscriptions**
  - 每一条就是一个正在使用或者使用过的 App/Service。
  - 名字会被 **Payments** 里引用一次或多次，看你付过多少次钱。
  - 添加一栏用来标识是否是买断的 Lifetime。这样，至少我能一目了然，我买断了，不存在 Next Payment Date 了。
  - 一个服务有过很多次订单的话，可以使用 Rollup 仅获取对应的现在正在使用的订单。也可以将所有过往的订单集中，然后就可以计算至今为止花过的总额了。
- **Categories**
  - 也就是类别，自己做简单的分类，Entertainment，Music，Reading，Education, Health & Fitness 等等。
  - **Subscriptions** 里添加 Category 一栏来建立 Relation，这样又可以计算这个类别的消费总额了。
- **Total Cost**
  - 最简单，就是计算所有订阅服务的总和。

我主要就是加了一个 Payments 的表，然后把很多 Subscriptions 和 Categories 里的 Relation 和 Rollup 调整了一遍，有一些 Formula 也根据自己的需求调整了一下。

第一次用 Notion 表格 Relation 和 Rollup 的功能，挺有意思的，但还是不够灵活，[文档参考](https://www.notion.so/help/relations-and-rollups)。

提供我爆改过后的 Template 供参考，[点击此处](https://bambooo.notion.site/Subscription-Tracker-Template-7fae482b972b499eb5cc0830b353e1e0)。
