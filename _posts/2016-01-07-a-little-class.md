---
layout: post
title: a little Class
date: 2016-01-07 01:25:42
disqus: y
---

昨天和今天花了一点时间就把coursera上这门[Using Databases with Python](https://www.coursera.org/learn/python-databases)的week1刷完了.  
Week1讲的其实是Class, 所以顺便回顾一下Class. Week2要等下周了.

为什么会需要Class, 回归到最基本的认识, 为了效率, 为了偷懒, 不要重复写相同作用的代码.
一些terminology:  
+ `class`: 相当于一个模板, template/bluprint  
+ `method/message`: class里的function  
+ `field/attribute`: class里的data  
+ `object/instance`: 一个特定的实例, 也就是用class这个模板造出的一个实际物件  


## 一个简单的栗子
{% highlight python %}
class om2pyStudent:
	x = 0   # x也就是一个attribute

	def __init__(self):  # 这个称为constructor, 一般被用来设定变量
		print "I am constructed"

	def task(self):      # task就是一个method,也就是class里的function
		self.x = self.x + 1     # self就是指某一个class实例自己
		print "Complete task", self.x


bambooom = om2pyStudent()  # 定义了bambooom是一个om2pyStudent
bambooom.task()            # 重复了三次 task 这个method
bambooom.task()            # 每次都更新了bambooom里面的x的值
bambooom.task()                       
{% endhighlight %}

结果如下:  
  ```
  I am constructed  
  Complete task 1  
  Complete task 2  
  Complete task 3  
  ```


## 第二个简单的栗子
{% highlight python %}
class om2pyStudent:
	x = 0                             
	name = ""  # 定义了另一个attribute

	def __init__(self, name):  # 这次constructor里面多了一个参数name
		self.name = name      # 将参数name赋值给self.name, 也就是更新前面新定义的name
		print self.name, "constructed"

	def task(self):  # task就是一个method,也就是class里的function
		self.x = self.x + 1   # self就是指某一个class实例自己
		print self.name, "complete task", self.x


b = om2pyStudent("bambooom")  # 定义了b是一个om2pyStudent, 它的名字是bambooom
b.task()     # b做了一次task

j = om2pyStudent("aJiea")    # 定义了j是一个om2pyStudent, 它的名字是aJiea
j.task()     # j做了一次task

b.task()
b.task()     # b又做了两次task
j.task()     # j又做了一次task
{% endhighlight %}

结果如下:
  ```
  bambooom constructed  
  bambooom complete task 1  
  aJiea constructed  
  aJiea complete task 1  
  bambooom complete task 2  
  bambooom complete task 3  
  aJiea complete task 2  
  ```

虽然都是相同的在更新`self.x`, 但self指代不一样, 更新不一样



## 有关inheritance的栗子
从已有的class里创建新的class, 保持所有原有class的特性, 这样新的class就是一个child class, 原来的已有的class叫parent class. (还是为了方便重复使用)

{% highlight python %}
class om2pyStudent:
	x = 0                             
	name = ""  

	def __init__(self, name):  
		self.name = name      
		print self.name, "constructed"

	def task(self): 
		self.x = self.x + 1   
		print self.name, "complete task", self.x

class prdStudent(om2pyStudent): 
# prdStudent是继承om2pyStudent的一个新的class, 有所有om2pyStudent的性质
	times = 0 # 在新的class可以定义新的attribute

	def c2t2(self): # 定义新的method
		self.times = self.times + 1
		self.task() # 仍然可以用继承过来的method
		print self.name, "came C2T2", self.times, "times"

b = om2pyStudent("bambooom")  # 定义了b是一个om2pyStudent
b.task()     # b做了一次task

j = prdStudent("aJiea")    # 定义了j是一个prdStudent, 它的名字是aJiea
j.task()     # j做了一次task
j.c2t2()     # j去了一次C2T2

{% endhighlight %}

结果如下:
  ```
  bambooom constructed  
  bambooom complete task 1  
  aJiea constructed  
  aJiea complete task 1  
  aJiea came C2T2 1 times  
  ```


一个简单的回顾 over.

---

但想起之前在[这个网站](http://www.toptal.com/python/interview-questions)上看过有关继承的一个有趣的python问题.

{% highlight python %}
class Parent(object):
    x = 1

class Child1(Parent):
    pass

class Child2(Parent):
    pass

print Parent.x, Child1.x, Child2.x
Child1.x = 2
print Parent.x, Child1.x, Child2.x
Parent.x = 3
print Parent.x, Child1.x, Child2.x
{% endhighlight %}

这么一小段, 如果一开始看, 猜output大多会觉得是这样的
  ```
  1 1 1  
  1 2 1  
  3 2 1  
  ```

但实际上的结果是这样的
  ```
  1 1 1  
  1 2 1  
  3 2 3  
  ```

问题就出在最后一步, 为什么`Parent.x`变了之后, 会将`Child2.x`也变成了3, 但是同时`Child1.x`却没有变呢?

这个问题的关键是python内部是将class里的变量当做字典来处理, 并且此处涉及到搜索顺序.
当有多重继承时, 如果现在的class里没有定义的, 会从base class里去寻找.   
搜索的顺序被称为`Method Resolution Order (MRO)`, 不仅是method, attribute也同样适用.  
有关MRO还可以看看[Guido老爹写的旧文](http://python-history.blogspot.com.ar/2010/06/method-resolution-order.html), 很有意思, 讲了MRO是如何从传统的逐层递进由左至右的算法演变到现在的算法C3, C3会拒绝出现矛盾顺序的class定义.  

回归到这个栗子本身.  
第一次`print`的时候, `Child1`和`Child2`都没有自己的`x`, 所以根据MRO, 会向它们的base class也就是`Parent`去搜索.  
所以得到第一排结果是`1 1 1`. 这个还是很好理解的.

然后`Child1.x = 2`给`Child1`这个class添加了自己的变量`x`, 并赋值为2.  
第二次`print`的时候, `Child1.x`就会从自己的class里获得刚刚新赋值的`x`(=2), 但`Child2`仍然没有自己的`x`, 还是从`Parent`获取.

最后`Parent.x = 3`, 是直接更改的`Parent`里的x, 赋值为3.
第三次`print`的时候, `Child1.x`先从自己的内部搜索, 发现有之前已经定义过的`x`(=2), 但`Child2`还是没有自己的`x`, 继续从`Parent`获取, 此时`Parent.x`就已经是更新变成了3了. 所以最后打印的结果是`3 2 3`

是不是觉得有点神奇呢?  
反正我是这么觉得的.