---
draft: false
title: NOTE5-some basic stats concepts
date: 2016-01-22 23:57:31
categories: Tech
comments: true
isCJKLanguage: true
---

最近会尽量在地铁上刷`统计学的世界`这本书.
一开始不怎么想看书, 但是开始看了之后就觉得还不错呢, 找点有意思的记一记.

顺便, 想起之前那个很火的`activate-power-mode`的震撼式 atom插件,
于是我用起了 atom.
`activate-power-mode`和`atom-miku`一起, 不要太恶趣味哈哈哈.
大概的效果如下:

![power+miku](https://static.zhuzi.dev/2016/01/apm-miku.gif)

---
好了, 来说点正经的.

![1](https://static.zhuzi.dev/2016/01/basic-stats-note-1.jpg)

第一个例子是有关选举民意调查.

脑子里浮现一堆美剧例子, 比如纸牌屋, 比如黑镜, 比如 newsroom, 噢还有奥巴马...
就我所了解的像美国大选这样的选举, 是非常耗钱的, 除了来来回回在各个 State
做演说做宣传, 每个选举的团队还要养着一个智囊团一样的小组, 这个智囊团里面一般有人研究政治政策,
也有做成功预测的. 有其他很多细节就不算清楚了. 但是对于这个做成功预测的部分就是咱感兴趣的部分.
看这个例子之前, 我并没有想过`选前民意调查`和`出口调查`这样事实上有两种的调查方式.
一直对于, 投票率/支持率也就只是一个百分比数字的概念.
但如果分开这样两种方式而进行的支持率调查, 可以说其实有很多可以深究的地方.

如果选前民意调查就可以轻松预测大选结果, 那么统计学家估计就没饭碗了.
选前的投票支持率, 现在想来可以说是非常随便的, 就和投票我喜欢周星驰, 你喜欢周杰伦一样随便.
我也很愿意做这种投票, 因为我作为一个有权投票的人, 可以说行驶这种权利是非常 easy 没有任何压力和负担的.

> 现在问选民, 未来将要投票给谁

这么做的预测误差可以说应该是非常之大的, 特别涉及到人类这种生物.
再以及, 这也是为什么选前的调查可能和最终结果相去甚远.
我之前听说的是, 候选人的选举团队, 对每个洲的情况都进行不断的跟踪预测.

那么说到`出口调查` 也就是问选民刚刚把票投给了谁, 这是个已成事实的东西.
这样的调查结果在正式结果出来前可以预测是和真实结果比较接近的了, 前提是选民照实回答.

对是否需要选前民意调查就形成了两派对立观点. 如果是我, 我可能也是赞成选前民意调查的.
毕竟我也是推崇信息的公开化的.
但我觉得有意思的是, 选前民意调查的确可能对预测选举结果来说并不可靠, 但是也绝对不是没有关联的.
极有可能, 选前民意调查的结果会影响一部分人的投票选择.
因为选民也都是普通人, 受各方面影响是非常多的.
听说, 牛逼的选举团队是可以根据不断跟踪民意调查调整自己的参选策略.
不一定是提升民意支持率, 某种程度上是操控人心, 以达到操控最终结果的目的.
这大概就是很复杂的模型了~

---

![2](https://static.zhuzi.dev/2016/01/basic-stats-note-2.jpg)

这是个纯笔记, 对于调查研究, 一定要保持怀疑, 因为是很有可能出现人为操纵的统计陷阱.
大致记一下, 至少抱着以下几条问题:

* 谁做的调查?
    * 是一个什么不知名的小公司?
    * 国家统计局?
* 总体是什么?
    * Population, 知道一个大体的 scope
    * 需要清晰的定义
* 样本如何选取?
    * sampling strategy
    * random?
    * 这里是非常可能被人为操控的
* 样本多大?
    * 不够大的样本是不具有代表性的, 并且会增加变异性
* 回应率多少?
    * 有提供到 valid information 的实际上只有有回应的这部分
    * 那么总体或者实际的样本数可能就计算方式不同?
* 用什么方式联络受访者?
    * 形式决定内容
    * 方式不当可能会影响受访者提供真实可靠的数据
* 调查是什么时候做的?
    * 从时间维度考虑的话, 也许有些未知因素影响
* 问题是怎么问的?
    * 语言表述的不清晰也导致问题呗误解

---

![3](https://static.zhuzi.dev/2016/01/basic-stats-note-3.jpg)
![4](https://static.zhuzi.dev/2016/01/basic-stats-note-4.jpg)

**随机化比较实验**
因为比较重要, 所以也单独记下来. 因为只有真正的随机化比较实验才能真正得到明确因果关系.
正好, 这两天也在读`程序员的思维修炼`. 那里面, 作者也有提到人们经常有的一个认知偏见.
也就是 *归因错误*, 误把相关性当成因果关系. 两件事相关, 并不代表这两件事是有因果关系的.
在我的理解, 因果关系这件事, 很多时候是科学研究的根本目的.
开发了新药, 想要知道明确知道是否因为使用了新药, 而使得治愈率提高?
所以, 科学的验证方法就是通过随机化比较实验.

* 随机化方法, 将受试对象分组, 在实验处理之前, 各方面相似.
* *比较*: 在实验组实验处理, 除此之外的其他因素都是同样作用于所有组.
* 由此可得到的结论, 反应变量的差异是由实验处理而导致的

---

![5](https://static.zhuzi.dev/2016/01/basic-stats-note-5.jpg)

这个大鼠/小鼠/兔子的例子很有趣, 单纯想说, 原来动物实验的偏差性如此大,
并且有可能是由一些意想不到的情况导致.
留在这里给自己提个醒, 不要以为动物实验通过了得到的结论是多么有说服力.

---

![6](https://static.zhuzi.dev/2016/01/basic-stats-note-6.jpg)

最后一个问题, 又是在影视剧里见过几次的案例.

> 对于已经濒死的病患, 是否可以铤而走险尝试新式疗法?

很多时候, 无论家属还是病人自己都表示愿意接受冒险治疗. 但是医生出于职业道德, 又觉得不可以.
也有病人自己表示不用冒险, 而家属坚持希望接受.
真的是不同的人站在不同的角度, 有着不同价值观的人的看法都不一样.

**贩卖希望** 这个说法, 我似乎也是第一次听到. 这个说法不无道理, 甚至有点科幻意味.
濒死之人的权利, 对于生命的选择, 这些是值得去考虑的事.
