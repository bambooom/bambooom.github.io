---
isPublish: true
title: elementFromPoint of text element
publishedAt: 2018-04-11
disqus: y
---

捉 bug 记录一个 case


<p data-height="300" data-theme-id="33133" data-slug-hash="aYMYpE" data-default-tab="result" data-user="bambooom" data-embed-version="2" data-pen-title="elementFromPoint with text element" class="codepen">See the Pen <a href="https://codepen.io/bambooom/pen/aYMYpE/">elementFromPoint with text element</a> by bamboo (<a href="https://codepen.io/bambooom">@bambooom</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>


## Question

对于一个 text element, 不仅限 `TEXT_NODE`, 可以是一个仅有 Text 的其他元素, `<p>` `<span>` `<label>` 之类的都可以.
如 codepen 例子中, 文字换了行, 但又只超出一点, 实际的 text element 是浅蓝色背景的部分.

但如果使用 `getBoundingClientRect()` 获取包着 text element 的 box 的话, 实际上是橘色的那个方框. 而这个 box 的中心点 `(x,y)` 就是红色那个点.

再然后用 `elementFromPoint(x,y)` 获取中心那个点的 element 的话, 直觉而言会获得哪个节点呢?

## Answer

答案是外面的 `<p>` 节点, 也就是黑框的部分. 其实看到的时候觉得很明显, 所谓的中心红点其实并不在 text element 里面, 但臆想的时候却以为会是里面的节点.
即使是蓝色背景部分也有部分边缘地带并不属于 text element, 可以试试点击文字, 点击到文字的话会变粉~

另外文字换行就是麻烦, 引发各种头疼问题...
