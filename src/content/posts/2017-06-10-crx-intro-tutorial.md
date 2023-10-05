---
isPublish: true
title: chrome 插件开发小教程
publishedAt: 2017-06-10 16:42:31
disqus: y
---

-> [Repo url](https://github.com/bambooom/crx-intro-demo)

# crx-intro-demo
- 大致翻译自 [Getting Started: Building a Chrome Extension - Google Chrome](https://developer.chrome.com/extensions/getstarted)
- 最简单的功能: 点击插件 icon, 会有个小弹窗, 显示当前 tab 的 property
    - PS: 原本官方文档中的 demo 使用的 google image search API 已经停用, 所以去掉了搜索图片的功能

## 目录
```
|____icon.png       # 图标, 显示在 chrome 上可点击按钮
|____manifest.json  # 配置文件, 告诉 chrome 如何使用/加载相关文件
|____popup.html     # 点击 icon 后出现的弹窗, 本质上也是 HTML 页面
|____popup.js       # popup.html 中需要执行的脚本 popup.js
|____README.md
```

## 什么是 `manifest.json`
- 它是 chrome 插件中的一个配置文件
- crx 最重要理解如何配置 `manifest.json`
- 因为这个配置文件告诉了 chrome 如何使用加载你的代码/资源
- [官方文档](https://developer.chrome.com/extensions/manifest)中完整可配置示例
- 阅读文档才能明白 chrome 提供哪些接口, 你可以通过这些接口做什么
- [附录](#%E9%99%84%E5%BD%95-manifestjson-%E8%AF%A6%E8%A7%A3)有详细说明每个可配置项的大致意义, 初次了解可以先跳过

## 创建 `manifest.json`
- 这个小教程中使用的配置文件

```json
{
    "manifest_version": 2,
    "name": "Chrome Extension Getting Started Example",
    "description": "This extension shows the current page info",
    "version": "1.0",
    "browser_action": {
        "default_icon": "icon.png",
        "default_popup": "popup.html"
    },
    "permissions": [
        "activeTab"
    ]
}
```

- 这个小 demo 中使用的是 `browser_action`, 即适用于大部分网页, 不局限于某一部分网页
- `permissions` 中需要声明是插件可以访问到打开的 tab
- 另外, 为 `browser_action` 定义了默认的 icon - icon.png, 以及弹框所需展示的页面 - popup.html

## 创建弹窗页面

```html
<!doctype html>
<!--
 This page is shown when the extension button is clicked, because the
 "browser_action" field in manifest.json contains the "default_popup" key with
 value "popup.html".
 -->
<html>
  <head>
    <title>Getting Started Extension's Popup</title>
    <style>
      body {
        font-family: "Segoe UI", "Lucida Grande", Tahoma, sans-serif;
        font-size: 100%;
      }
      #status {
        /* avoid an excessively wide status text */
        white-space: pre;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 400px;
      }
    </style>

    <!--
      - JavaScript and HTML must be in separate files: see our Content Security
      - Policy documentation[1] for details and explanation.
      -
      - [1]: https://developer.chrome.com/extensions/contentSecurityPolicy
     -->
    <script src="popup.js"></script>
  </head>
  <body>
    <div id="status"></div>
    <ul id="tab-prop"></ul>
  </body>
</html>
```

- 一个非常简单的弹窗页面, 也就是在点击插件 icon 时会跳出来的页面, 是标准 HTML 页面而已
- 当然仔细看的话, 会发现实际 body 中并没有内容, 因为实际逻辑是通过执行 `popup.js` 文件实现的
- `popup.js` 长这样:

```js
// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current active Tab.
 *
 * @param {function(object)} callback - called when the current tab
 *   is found.
 */
function getCurrentTab(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(tab);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * 原 demo 中 google search 的 API 已经关闭
 * 新版的 API 配置更严格, 并不能简单调用, 所以先去掉这个功能啦~
 */
// function getImageUrl(searchTerm, callback, errorCallback) {
// }

function renderTabInfo(tab) {
    var infoHTML = '';
    Object.keys(tab).map(key => {
        infoHTML += `<li> ${key}: ${tab[key]}</li>`;
    });
    document.getElementById('tab-prop').innerHTML = infoHTML;
}

function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

document.addEventListener('DOMContentLoaded', function() {
    getCurrentTab(function(tab) {
        renderStatus('Current tab\'s url is ' + tab.url);
        renderTabInfo(tab);
    });
});

```

- 如果熟悉 JavaScript 的话, 这是非常清晰明了的
- 脚本主要流程是这样的:
    - 在弹窗页面加载 DOM 完成时, 添加事件监听器
    - 这个监听器, 首先获取当前窗口的当前 active 标签页 (`getCurrentTab`)
        - 因为 `chrome.tabs.query` 是一个异步的方法, 所以使用 callback
    - ~~获取到 url 之后, 在 popup 页面上显示当前状态 (`renderStatus`)~~
    - ~~并开始使用 google 图片搜索的 api 搜索图片 (`getImageUrl`)~~
        - ~~当获取到图片信息后, 显示图片 (`image-result`)~~
        - ~~如果获取不到, 则显示错误信息即可~~
    - 上面删掉的部分是原 demo 中的流程, 现在简化为获取当前标签页后, 显示标签对象的属性列表即可 (`renderTabInfo`)


## 加载插件到 Chrome 中
- 准备好了这些文件后, 就是把它们加到 chrome 里测试一下是否能正常运行呢
- 操作很简单:
    - chrome 中打开 `chrome://extensions`, 也就是管理插件的页面, 也可以从最右边的菜单 icon 里点击 More Tools -> Extensions 打开
    - 右上角会有一个 `Developer Mode` 的 checkbox, 一定要勾选
    - 点击 `Load unpacked extension…` 按钮就会出来文件选择的对话框
    - 选择上面创建的文件的目录即可加载
- 加载成功就会在页面上显示这个插件啦~ chrome 右上角也会出现插件的 icon 了~✨
    - 加载不成功的话, chrome 会提示你哪里出了问题, 改一下再重新加载吧
- 现在可以点击一下 icon 来试一试插件是否正常运行了
- 加载之后, 也仍然会经常修改代码看看效果, 此时只需要点击 `Reload (⌘R)` 或者快捷键 F5/Ctrl-R/Command-R 重新加载, 即可使新修改的代码生效

## 如何 Debug Chrome Extension

### 打开 Chrome Dev Tools
- 用惯了 Chrome Dev Tools 的话, 自然也会希望能在插件开发中使用调试代码/样式
- 如果插件有弹窗 popup, 则可以对插件 icon 右键, 选择选项 `Inspect Popup`, 即可以打开对于 `popup.html` 页面的 Dev Tools 面板
- 其他和普通的页面调试一样操作即可, 修改样式/断点调试等
- Dev Tools 面板和弹窗页面是保持同时打开状态, 关闭某一个, 另一个也会关闭
- 如果希望保持打开的状态重新加载插件, 可以在 console 中键入命令 `location.reload(true)` 回车即可

### 另一种 technique
- 前面这种方法适用于有 popup 的插件, 想要和普通网页一样一直打开调试面板, 或者插件并没有 popup, 可以考虑这样做:
- 在 `chrome://extensions` 页面中, 每个插件都有一个唯一的 ID, 从本地加载的也有 ID, 是一个临时的 ID
- 可以直接在地址栏键入 `chrome-extension://<extensionId>/<filename>` 打开你的插件中的任意文件
- 例如上面的例子中, 可以打开 `chrome-extension://<extensionId>/popup.html`, 然后一样右键 `Inspect` 或者 `Command+Shift+I` 打开 Dev Tools 面板即可
- 当然, 因为此 demo 中是想要获取 tab 对象信息, 所以此处打开的 popup 页面永远都是返回相同结果, 意义并不大
- 所以每个不同的插件想要正确调试需要注意不同场景下的使用
- 另外, 也可以利用这个页面来完成插件的某些功能, 例如非常有用的 [OneTab](https://chrome.google.com/webstore/detail/onetab/chphlpgkkbolifaimnlloiipkdnihall?hl=en) 插件,
它就是将所有保存的 tab 展示在了 `chrome-extension://chphlpgkkbolifaimnlloiipkdnihall/onetab.html` 这样一个页面上, 并可对保存的 tab 进行交互操作


## 再进一步的话?
- 尝试多几个 example 了解插件都可以做到什么
    - [官方提供 example](https://developer.chrome.com/extensions/samples)
    - [还找到了一些](https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/extensions/)
- 如果对 Dev Tools 的使用不太熟, 还可以从[这里](https://developers.google.com/web/tools/chrome-devtools/)了解
- 看太多, 不如马上动手开始写, 不会的再继续查文档吧~ 🖖


### 附录: `manifest.json` 详解
```js
{
  // Required 必须要求部分
  "manifest_version": 2,  // manifest 版本从 chrome 18 之后都应该是 2, 此处不需要变化
  "name": "My Extension", // 名字是插件主要的 identifier
  "version": "1.0.3",
    // 插件版本号, string, 最多为4个以 dot 分开的 interger, e.g. "3.1.2.4567"
    // 版本号不能随意乱写, chrome 的自动更新系统会根据版本号判断是否需要将插件更新至新的版本


  // Recommended
  "default_locale": "en",
    // 如果需要指定不同 locale 使用不同的资源文件, 例如在中国显示中文, 在日本显示为日语等
    // 则会在根目录中添加 `_locale` 文件夹;
    // 若没有 `_locale` 文件夹, 则不能出现该项配置
  "description": "A plain text description",
    // 描述插件是干啥的, 描述需要适合在 chrome web store 上显示
  "icons": {
      "16": "icon16.png",
      "48": "icon48.png",
      "128": "icon128.png"
  },
    // 图标可以是1个, 或者多个
    // 一般来说最好的方案是提供3个:
    // - 128x128: 在从 chrome web store 安装的过程中需要使用, Required
    // - 48x48: chrome://extensions 插件管理页面中使用
    // - 16x16: 插件页面当做 favicon 使用


  // Pick one (or none) - browser_action / page_action
  "browser_action": {
      "default_icon": {                    // optional
        "16": "images/icon16.png",           // optional
        "24": "images/icon24.png",           // optional
        "32": "images/icon32.png"            // optional
      },
        // icon 是随意提供多少个, chrome 选取最接近的尺寸, 为了适配不同屏幕, 提供多种尺寸是很实用的
      "default_title": "Google Mail",      // optional; shown in tooltip
        // tooltip, 光标停留在 icon 上时显示
      "default_popup": "popup.html"        // optional
        // 如果有 popup 的页面, 则用户点击图标就会渲染此 HTML 页面
  },
    // 参考 https://developer.chrome.com/extensions/browserAction
    // 如果有 browser_action, 即在 chrome toolbar 的右边添加了一个 icon

  "page_action": {...},
    // 如果并不是对每个网站页面都需要使用插件, 可以使用 page_action 而不是 browser_action
    // browser_action 应用更加广泛
    // 如果 page_action 并不应用在当前页面, 会显示灰色



  // Optional
  "author": ...,
  "automation": ...,
  "background": {
    "scripts": ["background.js"],
    // "page": "background.html", // 如果有必要, 也可以指定 background HTML
    "persistent": false // Recommended
        // 此处设定为 false 为如果这个 process 并没有在运行, 即释放内存和系统资源
  },
    // 参考: https://developer.chrome.com/extensions/background_pages
    // 如字面意思, background 即插件后台 process, 一般不需要 html, 只需要一个 js 文件, 类似一个监听器
    // 如果在 browser_action 或者其他情况下 state 变化, 就会告诉 background 来更新 view
  "background_page": ...,
  "chrome_settings_overrides": {
    "homepage": "http://www.homepage.com",
    "search_provider": {
        "name": "name.__MSG_url_domain__",
        "keyword": "keyword.__MSG_url_domain__",
        "search_url": "http://www.foo.__MSG_url_domain__/s?q={searchTerms}",
        "favicon_url": "http://www.foo.__MSG_url_domain__/favicon.ico",
        "suggest_url": "http://www.foo.__MSG_url_domain__/suggest?q={searchTerms}",
        "instant_url": "http://www.foo.__MSG_url_domain__/instant?q={searchTerms}",
        "image_url": "http://www.foo.__MSG_url_domain__/image?q={searchTerms}",
        "search_url_post_params": "search_lang=__MSG_url_domain__",
        "suggest_url_post_params": "suggest_lang=__MSG_url_domain__",
        "instant_url_post_params": "instant_lang=__MSG_url_domain__",
        "image_url_post_params": "image_lang=__MSG_url_domain__",
        "alternate_urls": [
          "http://www.moo.__MSG_url_domain__/s?q={searchTerms}",
          "http://www.noo.__MSG_url_domain__/s?q={searchTerms}"
        ],
        "encoding": "UTF-8",
        "is_default": true
    },
    "startup_pages": ["http://www.startup.com"]
  }, // 覆盖 chrome 设定, Homepage, Search Provider, and Startup Pages
  "chrome_ui_overrides": {
    "bookmarks_ui": {
      "remove_bookmark_shortcut": true, // 去掉添加书签的快捷键,
      "remove_button": true // 去掉了地址栏右边的 star button, 可以将 browser_action 的 icon 放在此处
    }
  }, // 覆盖 bookmark ui 设置, 需要 Chrome Dev Release, 较新的 api 吧
  "chrome_url_overrides": {
    "pageToOverride": "myPage.html"
      // 替换页面 HTML/CSS/JS, 可以替换的页面:
      // - 书签管理页面 chrome://bookmarks
      // - 浏览历史页: chrome://history
      // - 新标签页: chrome://newtab
  },
  "commands": {
      // commands API 用来添加快捷键
      // 需要在 background page 上添加监听器绑定 handler
    "toggle-feature-foo": {
      "suggested_key": {
        "default": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y"
      },
      "description": "Toggle feature foo",
      "global": true
        // 当 chrome 没有 focus 时也可以生效的快捷键
        // 仅限 Ctrl+Shift+[0..9]
    },
    "_execute_browser_action": {
      "suggested_key": {
        "windows": "Ctrl+Shift+Y",
        "mac": "Command+Shift+Y",
        "chromeos": "Ctrl+Shift+U",
        "linux": "Ctrl+Shift+J"
      }
    },
    "_execute_page_action": {
      "suggested_key": {
        "default": "Ctrl+Shift+E",
        "windows": "Alt+Shift+P",
        "mac": "Alt+Shift+P"
      }
    },
    ...
  },
  "content_capabilities": ...,
    // content_scripts 是在当前网页中插入并执行的脚本, 可以对网页进行各种操作
    // content_scripts 中可以监听插件发来的 message, 并进行某些操作
    // 可以选择是否永远插入, 或者只在一部分网页中 inject
    // content_scripts 执行环境称为 isolated world, 和正常页面中的 JS 不在相同环境中
    //  保证不同 script 不会冲突, 也不会和网页本身冲突
    //  也说明互相无法访问或使用其中的变量或函数
  "content_scripts": [
    {
      "matches": ["http://www.google.com/*"],
        // 指定那些页面需要 inject
      "css": ["mystyles.css"], // 按照顺序 inject
      "js": ["jquery.js", "myscript.js"], // 按照顺序 inject
      "run_at": "document_idle", // 什么时候 inject js,  "document_start", "document_end", or "document_idle".
    }
  ],
  "content_security_policy": "policyString",
    // https://developer.chrome.com/extensions/contentSecurityPolicy
  "converted_from_user_script": ...,
  "current_locale": ...,
  "devtools_page": "devtools.html",
    // 对 DevTools 的扩展, 例如 React, Redux develop tools
  "event_rules": [{...}],
    // 添加规则将某些 JS 事件转为 manifest (?)
  "externally_connectable": {
    // 指定哪些插件/ app/ 网站可以连接到你的插件上
    // 此处 ids 指允许连接的其他插件 id
    // 注意: 如果不写, 则认为所有其他插件都不能连接
    "ids": [
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      ...
      // 使用 wildcard "*" 允许所有其他插件连接
      "*"
    ],
    "matches": ["*://*.example.com/*"]
  },
  "file_browser_handlers": [...], // 仅能在 Chrome OS 上使用, 对文件的操作
  "file_system_provider_capabilities": {
    // 仅能在 Chrome OS 上使用, 对文件的操作
    "configurable": true,
    "multiple_mounts": true,
    "source": "network"
  },
  "homepage_url": "http://path/to/homepage",
  "import": [{"id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"}],
    // 如果有 shared module, 在提供 shared module 的 extension 中则会有 "export" 项
  "incognito": "spanning, split, or not_allowed",
    // 隐身模式下, "spanning" -> chrome app, "split" -> ext
  "input_components": ...,
  "key": "publicKey", // 不怎么需要用到了
  "minimum_chrome_version": "versionString", // 与 version 相同
  "nacl_modules": [{
    "path": "OpenOfficeViewer.nmf",
    "mime_type": "application/vnd.oasis.opendocument.spreadsheet"
  }], // 使用 Native Client Module 对网络上某种 MIME 类似资源进行操作, 但貌似 deprecated 了, 往 WebAssembly发展了
  "oauth2": ...,
  "offline_enabled": true,
  "omnibox": {
    "keyword": "aString"
    // 注册一个 keyword显示在 address bar 的前面
    // 当用户在 address bar 中输入 keyword 后, 用户就是和插件在交互了
  },
  "optional_permissions": ["tabs"], // 其他需要的 permission, 在使用 chrome.permissions API 时用到, 并非安装插件时需要
  "options_page": "options.html",
    // 允许用户进行某些配置来定制插件功能, 并使用 chrome.storage.sync api 来保存设置
  "options_ui": {
    "chrome_style": true, //默认使用 Chrome user agent stylesheet
    "page": "options.html",
    "open_in_tab": false // 不建议打开新 tab, 以后会删除此项
  }, // 新版配置功能 api, 支持 chrome40 以上, 打开 dialogue, 使用 chrome.runtime.openOptionsPage api 打开 option 页面
  "permissions": ["tabs"],
    //-> https://developer.chrome.com/extensions/declare_permissions
    // 有很多选择, 书签/右键菜单/剪贴板/cookie/下载/.... 等
  "platforms": ...,
  "plugins": [...],
  "requirements": {
    "3D": {
      "features": ["webgl"]
    }
  }, // 要求某些可能需要用户安装某些额外的 tech, 例如 webGL
  "sandbox": [...], // chrome 57 以上不再允许外部 web 内容
  "short_name": "Short Name", // 插件名字简写
  "signature": ...,
  "spellcheck": ...,
  "storage": {
    "managed_schema": "schema.json"
  }, //  使用 storage.managed api 的话, 需要一个 schema 文件指定存储字段类型等, 类似定义数据库表的 column
  "system_indicator": ...,
  "tts_engine": {
    "voices": [
      {
        "voice_name": "Alice",
        "lang": "en-US",
        "gender": "female",
        "event_types": ["start", "marker", "end"]
      },
      {
        "voice_name": "Pat",
        "lang": "en-US",
        "event_types": ["end"]
      }
    ]
  }, // text-to-speech(TTS) engine, permission 需要加上 ttsEngine
  "update_url": "http://path/to/updateInfo.xml", // 如果不是通过 chrome web store 自动更新插件
  "version_name": "aString", // 版本号名称, 如 "1.0 beta", 只是为了展示, 更加描述性
  "web_accessible_resources": [...]
    // 提供插件pkg中某些资源是当前 web page 可以使用的
    // 默认插件中的资源对于网页是 blocked, 需要说明哪些是要使用的 图片/图标/css/js 等
}
```
