---
draft: false
title: 如何挑芒果
date: 2013-09-25
categories: Memo
comments: true
isCJKLanguage: true
---

original link: https://www.douban.com/note/305510095/

标题大雾。。。。。。。。
鉴于我这个废柴3个星期都没有找到工作，所以就想做点无聊的事排解这无法言说的苦闷~cry~

其实原本只是我在Quora上看到的一个很有意思的答案。\[[Link](http://www.quora.com/Machine-Learning/How-do-you-explain-Machine-Learning-and-Data-Mining-to-non-CS-people/answer/Pararth-Shah?srid=OBeS&share=1)\]

问题是：
How do you explain Machine Learning and Data Mining to non CS people?
如何向非CS专业的民众解释机器学习（Machine Learning）和数据挖掘（Data Mining）？

这位来自印度的Pararth Shah讲了一个很有意思的挑选芒果的故事。
原文如下：

## Mango Shopping

Suppose you go shopping for mangoes one day. The vendor has laid out a cart full of mangoes. You can handpick the mangoes, the vendor will weigh them, and you pay according to a fixed Rs per Kg rate (typical story in India).



Obviously, you want to pick the sweetest, most ripe mangoes for yourself (since you are paying by weight and not by quality). How do you choose the mangoes?

You remember your grandmother saying that bright yellow mangoes are sweeter than pale yellow ones. So you make a simple rule: pick only from the bright yellow mangoes. You check the color of the mangoes, pick the bright yellow ones, pay up, and return home. Happy ending?

Not quite.

Life is complicated

Suppose you go home and taste the mangoes. Some of them are not sweet as you'd like. You are worried. Apparently, your grandmother's wisdom is insufficient. There is more to mangoes than just color.

After a lot of pondering (and tasting different types of mangoes), you conclude that the bigger, bright yellow mangoes are guaranteed to be sweet, while the smaller, bright yellow mangoes are sweet only half the time (i.e. if you buy 100 bright yellow mangoes, out of which 50 are big in size and 50 are small, then the 50 big mangoes will all be sweet, while out of the 50 small ones, on average only 25 mangoes will turn out to be sweet).

You are happy with your findings, and you keep them in mind the next time you go mango shopping. But next time at the market, you see that your favorite vendor has gone out of town. You decide to buy from a different vendor, who supplies mangoes grown from a different part of the country. Now, you realize that the rule which you had learnt (that big, bright yellow mangoes are the sweetest) is no longer applicable. You have to learn from scratch. You taste a mango of each kind from this vendor, and realize that the small, pale yellow ones are in fact the sweetest of all.

Now, a distant cousin visits you from another city. You decide to treat her with mangoes. But she mentions that she doesn't care about the sweetness of a mango, she only wants the most juicy ones. Once again, you run your experiments, tasting all kinds of mangoes, and realizing that the softer ones are more juicy.

Now, you move to a different part of the world. Here, mangoes taste surprisingly different from your home country. You realize that the green mangoes are in fact tastier than the yellow ones.

You marry someone who hates mangoes. She loves apples instead. You go apple shopping. Now, all your accumulated knowledge about mangoes is worthless. You have to learn everything about the correlation between the physical characteristics and the taste of apples, by the same method of experimentation. You do it, because you love her.

Enter computer programs

Now, imagine that all this while, you were writing a computer program to help you choose your mangoes (or apples). You would write rules of the following kind:

if (color is bright yellow and size is big and sold by favorite vendor): mango is sweet.
if (soft): mango is juicy.
etc.

You would use these rules to choose the mangoes. You could even send your younger brother with this list of rules to buy the mangoes, and you would be assured that he will pick only the mangoes of your choice.

But every time you make a new observation from your experiments, you have to manually modify the list of rules. You have to understand the intricate details of all the factors affecting the quality of mangoes. If the problem gets complicated enough, it can get really difficult to make accurate rules by hand that cover all possible types of mangoes. Your research could earn you a PhD in Mango Science (if there is one).

But not everyone has that kind of time.

Enter Machine Learning algorithms

ML algorithms are an evolution over normal algorithms. They make your programs "smarter", by allowing them to automatically learn from the data you provide.

You take a randomly selected specimen of mangoes from the market (training data), make a table of all the physical characteristics of each mango, like color, size, shape, grown in which part of the country, sold by which vendor, etc (features), along with the sweetness, juicyness, ripeness of that mango (output variables). You feed this data to the machine learning algorithm (classification/regression), and it learns a model of the correlation between an average mango's physical characteristics, and its quality.

Next time you go to the market, you measure the characteristics of the mangoes on sale (test data), and feed it to the ML algorithm. It will use the model computed earlier to predict which mangoes are sweet, ripe and/or juicy. The algorithm may internally use rules similar to the rules you manually wrote earlier (for eg, a decision tree), or it may use something more involved, but you don't need to worry about that, to a large extent.

Voila, you can now shop for mangoes with great confidence, without worrying about the details of how to choose the best mangoes. And what's more, you can make your algorithm improve over time (reinforcement learning), so that it will improve its accuracy as it reads more training data, and modifies itself when it makes a wrong prediction. But the best part is, you can use the same algorithm to train different models, one each for predicting the quality of apples, oranges, bananas, grapes, cherries and watermelons, and keep all your loved ones happy :)

And that, is Machine Learning for you. Tell me if it isn't cool.

Machine Learning: Making your algorithms smart, so that you don't need to be. ;)



鄙人渣翻：

## 买芒果

假设有一天小明去买芒果。有个小贩有一车的芒果。小明可以亲自挑选，然后小贩按斤称，你就按每斤多少钱给钱。
当然小明肯定是想选最甜最可口的芒果（因为是按重量给钱不是按质量） 所以小明到底该怎么选芒果呢？
突然小明想起外婆说过黄得明亮些的芒果比浅黄色的腰甜。所以小明做了个简单又机智的决定：只挑黄的明亮些的芒果。于是小明开心的挑选了明亮黄的芒果，付钱回家~Happy Ending？

并不。

生活是复杂的。【= =

小明回家后吃了芒果，发现有些芒果并没有想象中辣么甜。小明不开心了，外婆的智慧是不够的！除了颜色，还有别的什么！

经过一番深思熟虑（以及一些尝试试吃），小明又机智得发现个头大的明亮黄的芒果保证是甜的，而个头小的明亮黄的芒果只有一半的几率是甜的。（也就是说，如果小明买100个明亮黄的芒果，其中50个是个头大的，50个是个头小的；那么所有50个大的芒果都是甜的，而50个小的芒果中，平均只有25个是甜的。）

小明很开心自己如此机智的发现了诀窍，并且记住了诀窍直到下一次去买芒果。但是天不如意，当下一次去买芒果的时候，小明悲桑的发现自己最喜欢的小贩已经离开了城镇，小明只能去别的小贩那里买，别的小贩的芒果当然是从不同的地方运来的。于是小明的诀窍不管用了TvT 他必须重新发现新的诀窍了。当尝过了这个新的小贩手上所有类型的芒果之后，小明发现浅黄小个头的才是嘴甜的。

后来，一个远房表姐来看小明。小明想用芒果招待她。但是表姐说她无所谓芒果甜不甜，她只想要水分最多的。迫于无奈，小明又开始了实验，试吃所有种类的芒果，然后终于发现比较柔软的芒果水分偏多。

再后来，小明移民到了世界的另一个角落。这里卖的芒果和小明家乡的芒果味道相当不一样。他发现这里的芒果绿色的比黄色的好吃。

再再后来，小明和某位很讨厌芒果的人结婚了。老婆喜欢吃的是苹果。于是小明只能开始买苹果了，所有有关芒果的知识全部没有用武之地了。小明必须重新学习有关苹果的外貌特征和味道的关系的知识，还是老办法，试吃呗~小明这般努力，只因为爱老婆~


程序进入

假设现在小明开始写一个程序帮助自己选芒果或者苹果。小明应该会用这样的规则：

```
if (颜色是明亮黄 AND 个头大 AND 是最喜欢的小贩卖的) : 芒果是甜的。
if (软) : 芒果水分多。
etc
```

小明会用这些诀窍挑选芒果，甚至只要把诀窍告诉自己的弟弟，弟弟也可以帮他买芒果了~
但是每次同通过实验得到的新知识，小明都必须手动修改规则列表。小明必须努力去理解所有会影响芒果质量的因素以及内在原理。如果因素越来越多，情况越来越复杂，人手做出正确的判断以考虑到所有情况变得相当有难度。小明如果继续研究下去肯定可以得到芒果科学论的phd（如果存在）。

很不幸的是不是所有人都那么有空。【鄙人就很有空orz

机器学习算法（Machine Learning algorithms）

机器学习算法是普通算法的演变或者进化。它们是你的程序变得“更聪明”，因为它们可以自动地学习只要有data提供给它们。

一开始小明随机抽样选取一部分芒果（训练数据 training data），制作一张表记录每个芒果的所有外貌特征，包括颜色啊，大笑啊，形状啊，在哪里长大的啊，哪个小贩卖的啊 （特征 features）以及甜度啊，水分多少啊，成熟度啊（输出变量 output variables） 然后小明将这些data输入给一哥机器学习的算法 （分类/回归 classification/regression） 于是它会自己学习并建立起一个相关性模型解释芒果的外貌特征和质量的关系。

下一次小明又去买芒果，小明衡量正在卖的芒果 （测试数据 test data）输入进之前机器学习算法建立的模型中。模型会得出结果预测每个芒果是否甜，是否成熟，是否多汁。算法本身内部可能使用的是与小明之前使用的规则类似的规则 （例如决策树 decision tree） 也有可能内部使用了更多更复杂的规则在其中，但是很大程度上来说，小明不用去理解。

好啦~麻麻以后再也不用担心小明如何买芒果了！甚至经过一段时间后，小明还可以使算法变得更好（强化学习 reinforcement learning）因为有更多的data输入，算法的准确率会进一步提高。
其实最棒的部分是小明可以使用相同的算法去训练处不同的模型，灭个不同的模型去预测不同水果的质量，苹果啦，橙子啦，香蕉啦，葡萄啦，车厘子啦，西瓜啦。最终小明让自己的爱人永远happy

嗯，这就是机器学习啦~如果它不cool请告诉我。

最后一句：机器学习使小明的算法规则更聪明，于是小明不用很聪明。



\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*FIN\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*

现在是不是很想吃芒果呢？

![这是原作者附的图，跟俺没关【。](../../assets/images/2013/09/p9771487.jpg)

这是原作者附的图，跟俺没关【。



翻译得很糟糕，请轻拍。【肯定没人想看

不过鄙人想说的是machine learning其实也是Artificial Intelligence （人工智能）的一个很重要的部分，科幻里有智慧的机器人，其学习能力就是必须的。
另外分类 （classification）只是机器学习的其中一个topic，其他还有相当广的范围，鄙人自己也很感兴趣的学习中。例如豆瓣猜其实也算是machine learning的一个应用，笔迹鉴定、情感分析、自然语言处理全部是各方面的应用。
至少我觉得机器学习是很cool的一件事~

想知道更多的自己去wiki，另外coursera上也有stanford的Andrew Ng讲的machine learning，很受欢迎。Andrew Ng也是coursera的联合创始人，总之很厉害。
