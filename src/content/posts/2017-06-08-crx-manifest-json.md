---
isPublish: true
title: chrome 插件中的 manifest.json 是啥
publishedAt: 2017-06-08 00:42:31
comment: y
---

花了两天晚上, 把 chrome 插件开发的 manifest.json 的文档翻了一下, 总算把所有 field 大概是啥意思搞清楚了

-> [主文档](https://developer.chrome.com/extensions/manifest), 每个配置都有 link 说明是什么意思以及相关 API

chrome 提供的 API 实在不少, 怪不得觉得插件开发有意思~

顺便, 上周末无聊做了一个小插件, [rain-it ✨](https://github.com/bambooom/rain-it), 无聊的时候可以戳一下, 随机下 emoji 雨玩玩 (yes, 没什么卵用🌚)

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
