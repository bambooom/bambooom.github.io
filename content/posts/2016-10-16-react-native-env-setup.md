---
draft: false
title: react-native env setup
date: 2016-10-16 22:42:31
categories: Diary
comments: true
ShowToc: true
isCJKLanguage: true
---

前两天折腾了 react-native 的环境, 也稍微记一下坑, 以及顺便清理下爬坑时打开的无数个浏览器 tab 😂

不管怎样, 开始肯定是跟着[官方文档](http://facebook.github.io/react-native/docs/getting-started.html)走,
分别说明了 iOS 和 Android 的环境搭建.

## 先说 iOS
需要安装的是 node, watchman, React-native cli tool 以及 Xcode

```shell
# 如果没有安装过 node
brew install node
# watchman 是 fb 开发的一个工具, 可以检测文件变化
brew install watchman
# react-native-cli 就是 react-native 的终端工具
npm install -g react-native-cli
```

xcode 推荐直接 app store 下载.
另外, 我安装这些环境之前, 直接更新了 MAC 系统, 现在是最新的 Sierra, Xcode 版本也是比较新的 Version 8.0.
(据同事说, Xcode 新版和之前的版本也有一些明显区别)

第一次下载 Xcode 的话会很慢, 毕竟它灰常大, 大约12G....🌚
不过估计大部分用 mac 的人很早就会下载 Xcode, 毕竟大部分从网上下载的而非 app store 下载的 app 必须有 Xcode 才能使用.

Xcode 中自带 iOS 的模拟器, 所以不需要另外下载.

新建一个 react-native 小项目来试试手感, 只需要这三步就可以了.

```shell
react-native init AwesomeProject
cd AwesomeProject
react-native run-ios
```

然后会自动开启 Terminal, 开启React packager, 暂时好像无法开启 iTerm2 而不是原生 Terminal.
然后 iOS 模拟器也会自动运行出来.

话说这个 AwesomeProject 文件夹的结构大概是这样的

```shell
.
|____android
| |____...
|____ios
| |____AwesomeProject
| |____AwesomeProject.xcodeproj
| |____AwesomeProjecTests
| |____build
|____node_modules
| |____...
|____index.android.js
|____index.ios.js
|____package.json

```

使用 Xcode 打开的话, 直接打开其中的 ios 文件夹就可以编译了.
而在 `index.ios.js` 中编写 js 就可以在模拟器上 cmd+R 看到效果了.
在模拟器上 cmd + ctrl + z 的快捷键就会有一些供 debug 的选择菜单出现, 比如 show inspector,
就可以像在浏览器上选择网页的某一个元素来选择查看 App 页面元素的相关 style 之类的东西.
另外, 如果打开 remote JS debugging 的选项, 就可以在 chrome 中打开 `http://localhost:8081/debugger-ui`网页
直接使用 chrome 的工具来 debug, 查看 log 或者 js source 之类的.

以上 ios 部分还是比较简单直接的, 我耗费时间更长的是后面安卓的部分.


## 哎...安卓
港真, 我后知后觉才发现安卓的环境应该查看[中文版文档](http://reactnative.cn/docs/0.31/getting-started.html)...🙄
有关安卓部分, 英文版文档说的很简单, 安装node, watchman, react-native-cli 都是一样的, 不一样的是编译环境,
使用的是 [Android Studio](https://developer.android.com/studio/install.html), 如果用过 webstorm, 它们是一家公司出的, UI长得一毛一样. 但是英文版有一个点没有明确提到, 就是必须先安装 Java Development Kit (JDK 1.8), 我这里还先看到 Android Studio 网页上说1.8可能有稳定性问题, 我先装了1.7, 结果不行, 又乖乖卸载1.7, 重新安装1.8.....😂

jdk 在[官网这里](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)下载.
使用 `javac --version` 来查看 jdk 版本, 如果需要卸载旧版本 jdk, 可看[这里](http://docs.oracle.com/javase/8/docs/technotes/guides/install/mac_jdk.html#A1096903)
主要就是到 /Library/Java/JavaVirtualMachines/ 文件夹下, 删除 jdk1.8.0_06.jdk 文件即可.

其他安装 Android Studio 的注意的地方, 中文版文档写的很详细, 后悔没有先看到😔 不过觉得很值得注意的是安卓 Android SDK 的时候, 必须多选择一个`23.0.1`的版本, 不明白为什么.

### Genymotion
Android Studio 也有模拟器, 但一般更推荐使用另外一个叫 [Genymotion](https://www.genymotion.com/) 的模拟器, 反正同事这么推荐的, 具体好在哪里我暂时说不出来....😅
嘛, 就去下载了 Genymotion, 本以为 Genymotion 是收费的, 结果问了之后才知道, 其实只要是个人用户注册就可以用免费版.....它官网哪里都木有写有免费版啊....囧rz

### adb
我天真的以为, 打开着模拟器, 直接` react-native run-android` 可以成功的时候, 每次都报错, `adb command not found`.

adb 是android debug bridge, 是一个命令行工具, 管理模拟器什么的作用. 在命令行 `adb devices` 可以列出所有连接着的虚拟机或真机.
既然找不到, 那我就自己安装一个吧~ 吭哧吭哧自己安装了一个后发现, 仍然 build failed...😞
这次的 error 是 `adb server version (32) doesn't match this client(36)`, 并且 `adb devices`
也没能将 Genymotion 上打开的虚拟机显示出来.

问过同事后, 明白了是因为我的电脑上应该有两个 adb, 一个是我手动安装的, 另一个是 Android Studio 中下载的, 所以会识别不出来.
首先将我自己手动下载的删掉, 然后如中文文档中所说,

```shell
# 将 sdk 的路径加到环境中, 以便可以使用 adb fastboot 之类一些列的工具
export ANDROID_HOME=~/Library/Android/sdk
```

这样在终端 `adb devices` 也可以正常使用.

然后, 可以更改 Genymotion 的设置, 其中 adb 可以选择 custom Android SDK tools, 然后将 Android Studio 中安装的 sdk 的路径贴进去.

话说这里又有个小插曲, 就是我发现在网上找到的一般安装的路径 `/Users/<your name>/Library/Android/sdk` , 我却死也找不到 Library 文件夹. 又搜了一番, 才发现 User 下的 Library 文件夹一般是隐藏的, 在 Finder 设置中选择显示才会显示出来.....😂

这样折腾了一番修改后, 在 Android Studio 中打开 AwesomeProject 中 android 的文件夹进行编译,
直接 Run 的话就可以直接选择 Genymotion 的模拟器作为 Target 进行编译.
另外, 还可以给 Android Studio 安装 Genymotion 的[插件](https://docs.genymotion.com/Content/04_Tools/Genymotion_Plugin_for_Android_Studio/Installing_the_plugin.htm).

### Gradle
gradle 是一个 build tool. 具体是啥, 我也还没摸清楚.

Android Studio 中一个比较坑爹的东西, 好几次也曾报错 `Unsupported major.minor version 52.0`, 这是 Gradle 版本问题造成的.
在 AwesomeProject/android 文件夹下有一个 `build.gradle` 文件, 其中会对 gradle 版本有个设定.
按照现有经验, 2.2 以上的版本似乎都会报错, 所以这里需要手动修改 gradle 版本至较低版本, 比如2.1.3.
但是也必须是已经有的版本, 已有的版本可以在`/Android Studio/Contents/gradle/m2repository/com/android/tools/build/gradle` 文件夹中看到, 应该是在安装 Android Studio 时安装上的, 可以查看它的一些设置.

另外, 中英文文档都有提到可以使用 Gradle Daemon 来提升 java 的编译速度, 否则每次编译 android 都要很慢.
参照[文档](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) 中在命令行中

```shell
touch ~/.gradle/gradle.properties && echo "org.gradle.daemon=true" >> ~/.gradle/gradle.properties
```

港真, 对于 gradle 到底是在做些啥, 依旧茫然中. 但这没关系, 依然可以只写 js 代码来做开发....
当然, 只懂 js 也是不够的...🌝
是时候学一丢丢 java 和 object-c 了 😏

## Last
真应该先看到 react-native 中文文档的, 可以节省好多时间....
