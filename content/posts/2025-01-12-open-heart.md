---
draft: false
title: <open-heart>❤️</open-heart>
date: 2025-01-12
categories: Tech
comments: true
ShowToc: true
isCJKLanguage: true
---

之前在一个[外国开发者 benji 的博客](https://www.benji.dog/articles/interactions-or-reactions/)里发现文章末有个❤️，随手点了下就 Like 上了，感觉很简洁很可爱，遂打开 devtools 看了下，
发现了这个 `<open-heart>` 元素，具体搜索了一下之后，就想着给自己博客也安上了。
记录一下大概过程，给有想要给自己博客或者其他任何地方用上玩玩的人参考。

基本上需要的东西是：
- cloudflare worker 提供一个 API 来处理用户的 reaction
- cloudflare worker KV，一个简单的 key-value storage，用来存储 reaction 数据
- 在博客模版里添加 `<open-heart>` 组件进行渲染即可

## 创建 cloudflare worker

[参考CF Workers 文档](https://developers.cloudflare.com/workers/get-started/guide/)，直接用 CLI 最方便。

```sh
pnpm create cloudflare@latest <worker-name>
```

其中会有让你选择模板，只需要最简单的 Hello World example 就行，语言的话按自己喜好选，我是用 TypeScript。

这样本地的 worker project 就创建好了。
cd 到这个目录后，用 `npm run dev` 就可以用 [wrangler（Cloudflare 开发 CLI 工具）](https://developers.cloudflare.com/workers/wrangler/) 启动一个本地的 worker 了，然后在浏览器里面访问 `http://localhost:8787/` 就可以看到 Hello World!。

如果不想自己创建维护 worker，也可以直接使用这个 Public API，[https://api.oh.dddddddddzzzz.org/](https://github.com/dddddddddzzzz/api-oh)，但数据就也不是在自己的手里了。


## 创建 KV

[参考 CF Workers KV 文档](https://developers.cloudflare.com/kv/get-started/#2-create-a-kv-namespace)，

```sh
npx wrangler kv namespace create <BINDING_NAME>
```
直接在前面创建的 worker 项目目录下创建。

上面的命令会类似有下面这个提示：

```
🌀 Creating namespace with title "open-heart-worker-example-emoji-kv-example"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
[[kv_namespaces]]
binding = "emoji_kv_example"
id = "cb6c56beba9f4e679aa34f0f21e0af31"
```

在 worker 项目里会有个 `wrangler.toml` 的配置文件，kv_namespaces 的配置在这个文件里能找到例子。
贴上这个 binding name 和 id 的配置就可以了。


## 修改 worker 脚本

worker 怎么处理数据提供 API 的代码可以直接参考 [OpenHeart Protocol 的 Public API 代码](https://github.com/dddddddddzzzz/api-oh/blob/main/src/worker.js)，抄到自己的 worker 项目里的 `src/index.ts` 文件里，改一下 kv namespace 的命名即可。

具体来说，这个 worker 需要处理两个请求：
- `GET /<domain>/<uid>`：获取某个 domain 下某个 uid 的 reaction 数据，一般会是这样的 JSON，`{"❤️": 14,"🫀": 12,"🥨": 22}`
- `POST /<domain>/<uid>`：用户点击某个 emoji 的话，就是用这个来 send，并记录数据

这个是例子里的处理方式，也可以根据自己需要改。

改好后，本地启动 worker `npm run dev`，就可以简单用 curl 来测试一下。

```sh
$ curl -d '😻' -X POST 'http://localhost:8787/example.com/uid'
# 按范例的脚本，此处会有个 recorded 信息返回
$ curl 'http://localhost:8787/example.com/uid'
$ {"😻": 1} # 这样就获取了 emoji count
```

## 发布 worker

上面的步骤完成后，可以用 `npm run deploy` 将 worker 发布到 Cloudflare 上，
然后在浏览器里面访问命令行上提示的 worker URL 就可以看到文字提示了。

## 添加到博客模版

做好了 worker 的准备，接下来只要参考[组件文档里的例子](https://github.com/dddddddddzzzz/open-heart-element)，在博客模版里加上 `<open-heart>` 组件就可以了。
以我现在用的 hugo 为例，我在 partials 文件夹里加了个 [`reaction.html`](https://github.com/bambooom/bambooom.github.io/blob/master/themes/PaperMod/layouts/partials/reaction.html)。

```html
<!-- emoji 也可以设置成别的，也可以设置不止一个 -->
<open-heart href="https://<your-worker.url>/<domain>/{{ .Permalink }}" emoji="❤️">❤️</open-heart>

<!-- load web component -->
<script src="https://unpkg.com/open-heart-element" type="module"></script>
<!-- when the webcomponent loads, fetch the current counts for that page -->
<script>
window.customElements.whenDefined('open-heart').then(() => {
  for (const oh of document.querySelectorAll('open-heart')) {
    oh.getCount()
  }
})
// refresh component after click
window.addEventListener('open-heart', e => {
	e && e.target && e.target.getCount && e.target.getCount()
})
</script>
```

设置好了之后，将这个 partial 放到你想要的地方。比如我放到 [`layouts/_default/single.html`](https://github.com/bambooom/bambooom.github.io/blob/master/themes/PaperMod/layouts/_default/single.html#L56) 里了，在 prev/next navigation 前面的地方。


最后给 `<open-heart>` 加上喜欢的样式就可以了。可以借用 benji 提供的 basic styling：

```css
open-heart {
  border: 1px solid #aaa;
  border-radius: .4em;
  padding: .4em;
}
open-heart:not([disabled]):hover,
open-heart:not([disabled]):focus {
  border-color: #fff;
  cursor: pointer;
}
open-heart[disabled] {
  cursor: not-allowed;
}
open-heart[count]:not([count="0"])::after {
  content: attr(count);
}
```

或者使用组件文档里提供的一些 [demo 样式](https://github.com/dddddddddzzzz/open-heart-element/blob/main/demo.css)([预览](https://element.openheart.fyi/))。

## References

- [Interactions or Reactions | benji](https://www.benji.dog/articles/interactions-or-reactions/)
- [The Open Heart protocol.](https://github.com/dddddddddzzzz/OpenHeart)
  - https://openheart.fyi/
- [Public API for the OpenHeart protocol.](https://github.com/dddddddddzzzz/api-oh)
  - https://api.oh.dddddddddzzzz.org/
- [`<open-heart>` component](https://github.com/dddddddddzzzz/open-heart-element)
  - demo: https://element.openheart.fyi/
- [Get started - CLI · Cloudflare Workers docs](https://developers.cloudflare.com/workers/get-started/guide/)
- [Get started · Cloudflare Workers KV](https://developers.cloudflare.com/kv/get-started/)


可以点⬇️这个试试哦～🥰

⬇️
⬇️
⬇️

👇
👇
👇
