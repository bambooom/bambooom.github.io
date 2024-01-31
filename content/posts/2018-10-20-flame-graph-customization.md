---
draft: false
title: 火焰图魔改杂项
date: 2018-10-20
comments: true
isCJKLanguage: true
---

最近帮大佬的[幻灯片](https://openresty.org/slides/nginx-conf-2018/)做了点杂事，乱七八糟的东西总结一下，不过可能也没啥卵用。

## 火焰图
用到了很多个火焰图，所以魔改了一通生成火焰图的 [perl 脚本](https://github.com/bambooom/FlameGraph/blob/animated/flamegraph.pl)。

主要是：
- 从下往上 grow 的动画效果，并且隔 2s 后重复播放动画
- 地图式 zoom 功能，鼠标滚轮
  - zoom 的同时，需要把文字逐步显示出来，像 map 一样
- 本来加了个跟随鼠标的 tooltip，不过后来还是去掉了

### grow 动画
`flamegraph.pl` 实际上是通过读取数据文件来生成一个单独的 svg document。

```bash
$ ./flamegraph.pl data.cbt > output.svg
```

生成的 svg 中主要就是一堆的方块 `<rect>` 和文本 `<text>` 元素的组合，具体怎么计算 rect 的位置大小等都不需要我仔细了解。
但既然每个方块的位置大小都是直接计算出来，那么 grow 动画的逻辑就很简单了：
给每个 rect 加一个简单的 fadeIn animation，但根据方块的高度来决定 `animation-delay`，效果就足够了。

至于隔 2s 后重复播放动画，本来我以为需要用上 `animation-iteration-count: infinite`，
但实际上 infinite 似乎没办法在每两次动画中间加上间隔。所以开始想方法手动 trigger 动画重播。

[SO 上的答案](https://stackoverflow.com/questions/6268508/restart-animation-in-css3-any-better-way-than-removing-the-element):

```js
function reset_animation() {
  var el = document.getElementById('animated');
  el.style.animation = 'none';
  el.offsetHeight; /* trigger reflow */
  el.style.animation = null;
}
```

基本的方法就是先把元素的 animation 值去掉，触发 reflow，再把 animation 值还原回去，让动画重播。
不过在我的实际应用中，答案里的 magic `el.offsetHeight;` 没有起到效果，尝试了多次之后，
我直接在去掉 animation 值之后 `setTimeout` 了一小段时间后再赋值回去也正确触发了 reflow，让动画重播，具体是啥原因呢 🤔

[Demo](../../assets/images/flame-graph-grow.svg)

### zoom 功能
原本的火焰图自带的 zoom 功能是点击之后放大某一个 rect，依次改变其他相关 rect，大佬表示不满意，想要 Google Map 那种地图式的放大，但不改变初始火焰图整体形态。
毫无头绪的搜索了一阵后，用上了 d3.js。直接套用自带 zoom 函数就好（特别 nice：

参考例子：
* [Pan & Zoom III - bl.ocks.org](https://bl.ocks.org/mbostock/4e3925cdc804db257a86fdef3a032a45)
* [Pan & Zoom I - bl.ocks.org](https://bl.ocks.org/mbostock/d1f7b58631e71fbf9c568345ee04a60e)

```html
<script type="text/javascript" xlink:href="https://d3js.org/d3.v4.min.js"></script>
<script type="text/ecmascript">
<![CDATA[
  var outerGroup = d3.select("g.outer_g");
  var rectGroup = d3.select("g.func_g");

  outerGroup
    .call(d3.zoom()
      .scaleExtent([1, 100]) // 最大和最小 scale 的值
      .on("zoom", zooming) // 正在 zoom
      .on("end", zoomed)); // zoom 结束

  function zooming() {
    // 将 transform 的值添加到每一个方块上
    // 比如: transform="translate(126.50096885580297,-50.13540780123475) scale(1.3736362334296233)"
    rectGroup.attr("transform", d3.event.transform);
  }

  function zoomed() {}
]]>
</script>
```

d3 selection 其实完全可以理解为类似 jQuery 的元素选择器 `$('.class-name')` `$('span#id')` 之类的。

还比较 easy 地做到了 zoom 呢~ 然后发现新问题，文字大小也会随着 scale 一起放大...所以文字内容并不会比正常大小的时候变多....emmmmm....

原本的点击 zoom 处理方法是计算 rect 宽度，以及文字所需要的宽度，然后 JS 里计算可以显示多少 substring。
所以还是沿用这个方法，只是在 scale 之后，想要正确计算文字的宽度，
必须改变 `font-size`，否则怎么计算都是和初始一样。
改了下 `zooming` 函数，在 zooming 时改变文字 `font-size`， zoom 结束时计算更新文字应该显示的内容。

```js
var baseFontSize = 12;

function zooming() {
  rectGroup.attr("transform", d3.event.transform);

  var nodeList = rectGroup._groups[0];
  for (var i = 0; i < nodeList.length; i++) {
    var g = nodeList[i];
    var transform = g.attributes["transform"].value;
    // get the scale number
    var scale = parseFloat(transform.match(/scale\\((.*)\\)/)[1]);
    var t = find_child(g, "text");
    if (scale > 1) {
      // lower the font-size by the scale number
      t.attributes['font-size'].value = baseFontSize / scale;
    } else {
      t.attributes['font-size'].value = baseFontSize;
    }
  }
}

function zoomed() {
  var scale;
  var nodeList = rectGroup._groups[0];
  for (var i = 0; i < nodeList.length; i++) {
    var g = nodeList[i];
    var transform = g.attributes["transform"].value;
    update_text(g);
  }
}
```

原本计算如何更新显示的文字的函数长这样：

```js
// avg width relative to fontsize
var fontWidth = 0.59;

function update_text(e) {
  var r = find_child(e, "rect");
  var t = find_child(e, "text");
  var w = parseFloat(r.attributes["width"].value) -3;
  var txt = find_child(e, "title").textContent.replace(/\\([^(]*\\)\$/,"");
  t.attributes["x"].value = parseFloat(r.attributes["x"].value) +3;

  // Smaller than this size won't fit anything
  if (w < 2 * baseFontSize * fontWidth) {
    t.textContent = "";
    return;
  }
  t.textContent = txt;

  // Fit in full text width
  if (/^ *\$/.test(txt) || t.getSubStringLength(0, txt.length) < w)
    return;
  for (var x=txt.length-2; x>0; x--) {
    if (t.getSubStringLength(0, x+2) <= w) {
      t.textContent = txt.substring(0,x) + "..";
      return;
    }
  }

  t.textContent = "";
}
```

原作者定义了一个 `fontWidth` 的常量，按我的理解是一个平均 ratio，也就是平均一个字母的宽度相对于它 font-size 的 ratio。就比如说 `12px font-size` 的字母平均宽度为 `12px * 0.59 = 7.08px`。

这个 ratio 从哪里得来的我没找到。然而这个 ratio 在文字被 scale 放大之后就不太对了。
按照我前面在放大之后将 font-size 改小来希望可以显示出更多文字来看，如果文字是 12px，scale 是 2，那么放大后文字的 size 被缩小设置为 6px，当然实际看上去的大小并不是。
那么平均一个字母的宽度就是 `6px * 0.59 = 3.54px`，单纯比较这个数字和方块的宽度的话，文字一下就变成全部显示出来了，此时看到的结果就是其实文字都超出 rect 的宽度了。

前面的一个错误是字母在设置成 6px 之后，实际上计算宽度时应该将 scale 乘回去，也就是 `6px * 0.59 * 2 = 7.08px`。所以实际上不管如何 scale，都是希望文字的实际宽度没有大的变化的。觉得文字变大变小了，是因为其他图形的 scale 变化而产生的相对的视觉效果。

观察和计算了一下不同 scale 时，字母的平均宽度之后，我保守的直接把 `fontWidth = 6.7` 了，比前面的 7.08 小一丢丢。

```js
// avg character width regardless of font-size and scale
var fontWidth = 6.7;

function update_text(e) {
  var r = find_child(e, "rect");
  var t = find_child(e, "text");
  var transform = e.attributes["transform"].value;
  // get scale number
  var scale = transform ? parseInt(transform.match(/scale\\((.*)\\)/)[1]) : 1;
  var w = parseFloat(r.attributes["width"].value) * scale -3;
  var txt = find_child(e, "title").textContent.replace(/\\([^(]*\\)\$/,"");
  t.attributes["x"].value = parseFloat(r.attributes["x"].value) +3;

  // Smaller than this size won't fit anything
  if (w < 3 * fontWidth) {
    t.textContent = "";
    return;
  }

  t.textContent = txt;

  // Fit in full text width
  if (/^ *\$/.test(txt) || fontWidth * txt.length < w)
    return;

  for (var x=txt.length-2; x>0; x--) {
    if ((x + 2) * fontWidth < w) {
      t.textContent = txt.substring(0,x) + "..";
      return;
    }
  }

  t.textContent = "";
}
```

### tooltip

用 d3 加 tooltip 也是很简单的呢：
* [Simple D3 tooltip - bl.ocks.org](http://bl.ocks.org/biovisualize/1016860)
* [Simple d3.js tooltips - bl.ocks.org](http://bl.ocks.org/d3noob/a22c42db65eb00d4e369)

首先准备一个 tooltip 的 div，可以用 d3 创建，也可以直接在 svg 或 html 里添加好。然后用 d3 监听 mouseover/mousemove/mouseout 事件即可控制 tooltip 的样式及位置来显示内容了。

[Demo](../../assets/images/flame-graph-tooltip.svg)

```js
outerGroup
  .on("mouseover", function () {
    var target = event.target;
    var text = get_text(target);
    // show the tooltip
    tooltip.style("opacity", .9);
    tooltip.select("p").text(text);
  })
  .on("mousemove", function () {
    // tooltip move with the mouse
    tooltip.attr("x", event.pageX - 10)
      .attr("y", event.pageY + 10);
  })
  .on("mouseout", function () {
    // hide the tooltip
    tooltip.style("opacity", 0);
  });
```
