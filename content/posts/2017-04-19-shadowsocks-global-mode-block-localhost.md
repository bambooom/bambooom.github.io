---
draft: false
title: shadowsocks 全局模式下屏蔽 localhost
date: 2017-04-19 22:42:31
comments: true
isCJKLanguage: true
---

## 起因
- ss 是前年开始买的, 安装 mac 客户端
- 从去年开始做前端 dev 开始, 就发现:
  + **如果开着全局模式 (Global Mode), 浏览器就打不开 localhost**
- 然而 localhost 是开发必备, 虽然可以通过使用自动代理模式( Auto Proxy Mode), 但还是觉得很烦
- 并且可能一下子没反应过来需要修改这个设置....

可是....

**居然一直没有想要去解决它!!!!!!**
还以为是我个人的问题....

今天发现同事也有相同问题 -> 才突然惊觉搜索是否有解决办法

## 过程
- keywords: `shadowsocks global mode localhost`
- 没想到第一条结果就是曾经 shadowsocks の wiki:
  + [Block Connection to localhost · shadowsocks/shadowsocks Wiki](https://github.com/shadowsocks/shadowsocks/wiki/Block-Connection-to-localhost)
  + 其中明确说明了: 从 2.6.3 版本开始, 默认屏蔽 localhost/127.0.0.1
  + 想要修改设置可以使用一条命令

```sh
ssserver -c /etc/shadowsocks.json --forbidden-ip=""
```

  + 然而, 由于众所周知の原因, 源代码已经被作者删了
    * 并没有办法获取这个 `ssserver` 命令了
    * 也并不理解这行命令实际起的作用是啥
- 再看其他搜索结果, 明显只是 ss の教程 -> 不知道怎么办了
- 询问了一位很会折腾工具の同事
  - 他表示遇到过, 但也以为是默认的, 不能改
  - 我表示因为 wiki 上说过, 所以一定是可以改的, 只是我不知道要怎么改了...
  - 同事在我先干别的事的时候, 突然跑来告诉我, 找到方法了, 解决了!

## 如何设置呢
- Open Network Preferences
- Advanced
- Proxies
- 勾选 SOCKS Proxy
- 右边填写 Server: 127.0.0.1:1080
  + shadowsocks 默认端口
- Bypass proxy settings for these Hosts & Domains:
  - 填写: `localhost, 127.0.0.1`

**DONE!**

- 这样在全局模式下也可以打开 localhost 了~
- *问题* : 在一段时间之后, 发现 Network Preferences 里的这个设置被清空了...
  + 暂时没明白是什么条件下清空
  + 也不知道是否有很大影响
- 后来用中文搜索反而搜到了[旧的 issue](https://github.com/shadowsocks/shadowsocks-windows/issues/385)上有人最近给出的这个解决方法


> TimeLog: 35 mins 🖖
