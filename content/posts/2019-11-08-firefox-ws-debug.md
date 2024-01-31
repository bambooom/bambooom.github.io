---
draft: false
title: 记一次 Firefox WebSocket debug
date: 2019-11-08 15:27:42
comments: true
isCJKLanguage: true
---

我司经常会通过 WebSocket 来向前端实时传递大量信息，之前同事一直说 Firefox 下 WebSocket 传送的数据有丢失，
造成渲染有问题，而 Chrome 没问题。
同事一直没有能完全解决，一个是不确定如何稳定复现，另一个是因为 Firefox （最新的 70）中的 WebSocket
每次传输的 frame message 在 DevTools 里是看不到的。

Firefox 71 [终于要可以看到 WebSocket messages 数据了](https://hacks.mozilla.org/2019/10/firefoxs-new-websocket-inspector/)。
现在可以先使用 Firefox Developer 版本试用了。

我在另一个项目里也遇到类似问题，但是我用打 log 的方式发现 frame message 并没有丢失，但是顺序错了。
所以下载更新了 Firefox Developer 版本后，即可查看并判断是从后端接收的数据顺序就是错的，还是前端的代码造成的。

有了这个 WS inspector 之后就一眼看得出来后端传输没有问题，那只能是前端代码有问题了。（其实想想 Chrome 也并没有问题，的确不可能是后端的锅...😅）

回到代码本身，我发现了一个值得怀疑的点，就是在 WS 的 `onmessage` event 中，第一步需要对获取的数据进行类型转换。

```js
if (data instanceof Blob) {
  data = await new Response(data).arrayBuffer();
}
data = new TextDecoder('utf-8').decode(data);
```

首先前提是服务器返回的是二进制数据。然后在 WS 中可能获取到的是 `Blob` 和 `ArrayBuffer`。
所以如果获取的 data 是 `Blob`, 先转换成 `ArrayBuffer`，再统一转化成 `String`。

也没有啥其他办法，只是多打几次 log 看输出的 pattern 后，我基本确认就是 `Response.arrayBuffer` 这一步骤出现问题。
这个函数本身返回的是 Promise，即使 await 后，会出现后一帧的数据比前一帧的数据提前完成返回的情况，并继续进行后续的数据处理所以导致渲染失败。
现在想想这个相当于异步操作，的确本来也不能保证顺序是对的。这个代码本来就写的不太对呢。

那么怎么 fix 呢？我重新去翻了下有关 WS 的文档，以及搜了下 `Blob` 转成 `ArrayBuffer` 有什么别的方法么，能保证顺序的。
我发现以前漏掉的 WS 的一个细节是 [`WebSocket.binaryType`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/binaryType)。

也就是设置 WS 中以哪种类型返回二进制数据。原来默认是 `Blob`，可以直接设置成 `ArrayBuffer`。
也就是说，这一步转换其实应该让浏览器帮我直接完成，我可以预期我获得的 data 一定是 `ArrayBuffer`。

在创建 WS 的时候加上这个设置，并去掉前面 `Response.arrayBuffer` 的调用后，在 Firefox 70 和 Firefox Developer 下都尝试了很多次，终于再也没有出现数据顺序错位的问题了。

至于为什么在 Chrome 下一直稳定没有问题，那大概就是他们各自内部对这个函数的实现细节上的差异，而我暂时并不知道这个细节差异是什么了。
