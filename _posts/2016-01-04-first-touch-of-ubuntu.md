---
layout: post
title: First touch of ubuntu
date: 2016-01-04 23:56:42
disqus: y
---

一篇简短的文, 第一次接触linux系统, 其实也就是一个命令行.

## 阿里云
感谢sunoonlee同学给我分了个阿里云主机玩耍, 也算是最小成本接触Linux系统. 
使用[putty连接远程主机](https://help.aliyun.com/knowledge_detail/5974573.html), so easy!  
阿里云主机系统是Ubuntu 14.04.2, 内置python是python 2.7.6
目的是安装mysql学习一下基本知识, 于是就顺便先学了一丢丢Linux系统.

## 安装mysql
所有的教程最开始就是 `sudo apt-get install mysql-server`  

照着打再回车, 一开始就出问题= =||| 先是提示我不是`sudoer`, 这个好办, 通知sunoonlee同学给咱加个权限.  
但是`sudo`到底是个啥意思呢? 虽然不是第一次见, 但因为自己一直是破win, 没有去查过. 趁这个机会就查下吧!

### `sudo : superuser do`
> 是一种权限运行程序.  
> 使一般用户不需要知道超级用户的密码即可获得权限.  
> 首先超级用户将普通用户的名字, 可以执行的特定明令, 按照哪种用户组身份执行等信息, 登记在特殊的文件中 (通常是`/etc/sudoers`), 即完成对该用户的授权.  
> 此时该用户就被称为`sudoer`  

以上抄自wiki, 基本概念有了, `sudo`就是一个权限管理机制. 有了它, 我也可以使用一些超级用户的才能使用的权限.

更多有关 `sudo` 说明以及配置可参考:  
+ [sudo命令详解](http://www.linux178.com/linux/sudo.html)  
+ [sudo 指令使用說明](http://note.drx.tw/2008/01/linuxsudo.html)  

### `apt = Advanced Package Tool`
接下来查了下 `apt-get`是一个包管理工具, 方便安装/升级软件包. 除了`apt-get`还有`apt-cache` 也很有用. 
可以参考 [25 Useful Basic Commands of APT-GET and APT-CACHE for Package Management](http://www.tecmint.com/useful-basic-commands-of-apt-get-and-apt-cache-for-package-management/)

前面解决了`sudo`问题后, 再次运行`sudo apt-get install mysql-server`出现了另一个问题

```
...
E: Failed to fetch http://mirrors.aliyun.com/ubuntu/pool/main/m/mysql-5.5/mysql-server-core-5.5_5.5.41-0ubuntu0.14.04.1_i386.deb  404  Not Found [IP: 112.124.140.210 80]

E: Failed to fetch http://mirrors.aliyun.com/ubuntu/pool/main/m/mysql-5.5/mysql-server-5.5_5.5.41-0ubuntu0.14.04.1_i386.deb  404  Not Found [IP: 112.124.140.210 80]

E: Failed to fetch http://mirrors.aliyun.com/ubuntu/pool/main/m/mysql-5.5/mysql-server_5.5.41-0ubuntu0.14.04.1_all.deb  404  Not Found [IP: 112.124.140.210 80]
```

出现了类似以上的错误... 还好有另外的提示说 `Try apt-get update or --fix-missing`  

当我直接 `$ apt-get update`时, 出来的是:

```
E: Could not open lock file /var/lib/apt/lists/lock - open (13: Permission denied)
E: Unable to lock directory /var/lib/apt/lists/
E: Could not open lock file /var/lib/dpkg/lock - open (13: Permission denied)
E: Unable to lock the administration directory (/var/lib/dpkg/), are you root?
```

因为权限问题, 不能成功这个我可以理解. 
但也让我一度以为root用户才能使用 `update`这个选项. 
遂尝试另外一个 `--fix-missing`选择, 但到底在什么后面加, 我尝试了几次也不太明白. 
最后回头想既然直接用 `$ apt-get update`不成功, 那应该试试`$ sudo apt-get update`. 然后就成功了!
update之后再一次 `sudo apt-get install mysql-server` 终于把mysql安装成功

回头想想 `update`到底是更新了什么?  
前面那篇25个基础命令中以及ubuntu[官方manpage](http://manpages.ubuntu.com/manpages/jaunty/man8/apt-get.8.html)都有提到:

> update is used to resynchronize the package index files from their sources. 
> The indexes of available packages are fetched from the location(s) specified in `/etc/apt/sources.list`.  

也就是说之前出现错误是因为阿里云默认的apt中的source链接都已失效, `update`选项更新了package的source链接.

