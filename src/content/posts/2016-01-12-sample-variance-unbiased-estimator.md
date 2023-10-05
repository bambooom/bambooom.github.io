---
isPublish: true
title: NOTE4-sample variance, why n-1
publishedAt: 2016-01-12 20:55:42
disqus: y
---

前两天, 谢辉童鞋问我, 为什么样本方差要除以`n-1`? 嗯哼, 这实在是个太经典的统计学问题.
重新翻了一下[wiki](https://en.wikipedia.org/wiki/Variance#Sample_variance)还有知乎上的[一个问题](https://www.zhihu.com/question/20099757). 遂随便写点回忆一下.

其实他没问我之前, 我都忘记该怎么回答了. 只隐约记得比较容易理解的角度应该是自由度, degree of freedom.
也就是说在计算sample variance时, 需要用到sample mean. 而sample mean是由n个sample的值相加除以n.
那么在sample variance中, sample mean已知的情况下, 其余n个数, 只有n-1个数是可以自由变动的.
因为这n-1个数确定了之后, 那么第n个数根据sample mean就可以计算出来. 也就是说`df = n-1`.

真正除以`n-1`是为了得到一个无偏差估计, unbiased estimate.
unbiased estimate 的定义是指一个estimator的期望等于它去估计的变量(parameter)的真实值.

这里, 需要把sample mean和sample variance理解为随机变量. 因为同一个整体(population), 抽样的随机性非常大. 所以可以以多次抽样的结果来推测总体值.
因为多次抽样的话, 每次抽样得到的mean, 和variance都不一样. 那么这些mean和variance序列也就形成了所谓的样本分布(sample distribution).
sample mean和sample variance 是作为总体的estimator去估测总体的mean和variance的.

其实wiki中的推导式已经非常清晰说明, 如果按照除以`n`来计算sample variance这个分布的期望的话, 就会变成一个较真实总体variance偏小的biased estimator.
只有除以`n-1`后, 可以将sample variance修正为unbiased estimator.

---

虽然自己的笔记发出来, 可能对他人并无意义, 但还是想对自己所思所想一个整理.
