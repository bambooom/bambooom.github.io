---
draft: false
title: a little node version
date: 2016-10-16 15:42:31
comments: true
---

工作一般使用 shipit 作为自动部署的工具. 但之前一直有个问题不能理解无法解决, 就是自动部署的最后一步
是使用 [pm2](http://pm2.keymetrics.io/) 启动服务.

之前这一步一直无法成功, 每次 shipit 到 `pm2 restart SERVER` 时就会报错说 `pm2 command not found`.
但奇怪的是直接 ssh 登录服务器执行 `pm2 ls` 是完全 ok 的, 可以看到正在跑的服务.
于是之前每次都很蠢的手动执行最后一步.

这两天发现另一个服务器的 node 版本太低, 各种有问题的时候, 于是着手更新 node 版本, 这个过程中忽然理解到之前的问题出在哪里.

## 来来去去的一些乱七八糟的尝试
首先 node 版本管理的工具一般可以用 [`nvm`](https://github.com/creationix/nvm) 和 `n` 这两个. 都可以使用 `npm install -g nvm` 这种形式安装上.

但需要使用 `npm install` 首先需要安装 `npm` 包, npm 本身的版本也有可能太低, 那么就先更新它吧.

查了[官方文档](https://docs.npmjs.com/getting-started/installing-node), 说直接 `npm install npm@latest -g` 即可, 但我发现即使这样执行之后, `npm -v` 仍然是之前较低的版本号.

在各种不能理解后, 我觉得大概还是因为 node 本身版本太低的问题. (妈蛋, 搞得像个死循环🙄🙄🙄)

于是我首先使用服务器上以前安装过的 `nvm` 下载了 v4.6.0 版本的 node, `nvm use 4.6.0`切到4.6.0版本之后, 重新安装 pm2 后, shipit 自动部署仍然会出问题.

然后我又重新研究了一下 shipit 部署时打印的 log, 发现其中执行的命令会log 出 node 版本, 然而 node 版本并不是4.6.0, 而是旧版本.

到这里, 我突然就明白了.

登上服务器仔细看了看pm2究竟装在了哪里.....


## 事实是...

### first, shipit 使用的系统版本的 node....
如果登上服务器, `nvm ls` 的结果大概是长这样的:

```
             v4.6.0
    ->       system
    node -> stable (-> v4.6.0) (default)
    stable -> 4.6 (-> v4.6.0) (default)
    iojs -> iojs- (-> N/A) (default)
```

也就是现在使用的 system 中的 node, `node -v` 就可以直接知道所谓系统版本的node 是很低的,
而如果切换到4.6.0, 安装 pm2 后, pm2 并不会在系统 node 版本中存在, 而是在 `~/.nvm/versions/node/v4.6.0/lib/node_modules`
这样一个文件夹下. 同理, 如果再使用 nvm 安装其他版本的 node, 再次安装其他 package, 那么它们
真正所在的位置应该是 `~/.nvm/versions/node/<version>/lib/node_modules`.

### 而系统 node 版本中安装的包在....
在这个`/usr/local/lib/node_modules`文件夹下.

总的来说, 就是第一次安装的 node 版本就是所谓的系统版本, 毕竟有了第一次安装的 npm, 才会去安装 nvm 之类的工具.
困扰我的问题终于搞清楚了, nvm 其实是无法干涉到系统版本的.

(话说突然想到 pyenv 貌似原理也是类似的?......🤔)

解决最开始的部署问题的话, 其实很简单, 就是在system node中重新安装pm2, `npm install -g pm2` 搞定

## 那怎么更新 system node 版本呢

在我发现了 nvm 和 n 其实都无法管理系统版本后, 我才终于发现其实回到最原始的第一次安装应该怎么安装就再安装一次就好,
它会自动删除旧版本, 是真的删除旧版本....[官方文档](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

```
# 安装 4.x 版本
curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs
```

```
# 安装 6.x 版本
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

这样才能真的更新 system node 版本....😂
更新 node 版本后再更新 npm, 最后可以使用 `npm update` 一键更新所有之前安装的包到最新版本.

哦啊, 前面忘了说, 服务器是 ubuntu.


## Last
版本问题果然会很混乱.....🙃
