---
layout: post
title: using google cloud python API via proxy
date: 2018-10-02
disqus: y
---

想试用 google cloud 的 tts 服务, 跟着[文档](https://cloud.google.com/text-to-speech/docs/quickstart-protocol)先把前期设置搞完了, credential 获取了, 安装了 python API (`pip install google-cloud-texttospeech`), 直接借用[文档](https://cloud.google.com/text-to-speech/docs/create-audio)的 python 例子(`python example.py`)想试试效果, 结果死也出不来结果...

1. 想起 iTerm2 不能像 Dropbox 一样可以设置代理, 所以即使用上全局 ss, 也并无卵用.

```bash
$ curl ip.cn
当前 IP：113.87.xxx.xx 来自：广东省深圳市 电信
```

2. 好吧, 自己之前偷懒并没有特意去找如何让 terminal 上也科学上网. 搜了一下怎么在终端上 proxy,
找了一篇[使用 proxychains-ng 配置](http://www.devmeng.com/2016/04/19/shadowsocks_proxychainsNG_iterms2/),
然而因为 OSX 的系统升级, 启用了 SIP ([System Integrity Protection](https://en.wikipedia.org/wiki/System_Integrity_Protection)),
于是这个 proxychains 的设置只有一部分情况适用, 除非直接把 SIP 禁用 (Run `csrutil disable` in Recovery mode), 具体见[这里](https://github.com/rofl0r/proxychains-ng/issues/78). 赶脚略麻烦, 先放弃之~

3. 更简洁的方式直接设置环境变量, 见[此处](https://github.com/mrdulin/blog/issues/18)

```bash
$ export all_proxy=socks5://127.0.0.1:1087
```

当然是打开 shadowsocks 的情况下, 再试试

```bash
$ curl ip.cn
当前 IP：103.192.xxx.xx 来自：香港特别行政区 xTom
```

well, 这里终端情况下终于走了代理, 现在估计 `brew update` 之类的就会比较顺畅了

4. But, 发现直接跑 python 脚本的话(`python example.py`), 仍然有问题...`_(:з」∠)_`
换了下搜索关键字 -> `google cloud python api via proxy`, 还真的[有人讲过](https://github.com/salrashid123/gcpsamples/tree/master/proxy), 这位好心人还分别对 python 和 java 两种情况研究了下.
简单来说, 就是 google cloud 的 API 有两种传输方式, HTTP and [gRPC](https://grpc.io/), 看具体 product 不同.

- **HTTP**: 使用 HTTP 的 API 的话(authentication 部分就是 HTTP), 设置 `https_proxy`
- **GRPC**: 使用 gRPC 的 API 的话(我想用的 text-to-speech 是用的这个), 需要同时设置 `http_proxy` 和 `https_proxy`

5. 话说我怎么知道 tts 服务是走的 gRPC 的呢, 是因为出错的 backtrace 里有 `.../google/api_core/grpc_helpers.py`

6. 继续前面的设置环境变量, 捣鼓半天还是不行, 明明 `curl ip.cn` 的结果是香港.
最后试了一下把设置的值改了下

```bash
# 之前都写成了 socks5://127.0.0.1:1087
export http_proxy=http://127.0.0.1:1087
export https_proxy=http://127.0.0.1:1087
```

这下终于👌🏻了, `python example.py` 终于把 `output.mp3` 吐了出来✨

虽然把能用的方法试出来了, 并不知具体区别在哪里...求赐教😅

