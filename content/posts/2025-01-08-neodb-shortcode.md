---
draft: false
title: NeoDB shortcode 更新
date: 2025-01-08
categories: Tech
comments: true
isCJKLanguage: true
---

突然的，更新了一下本地的 hugo，从 0.12x 一下子更新到了 0.140。
然后本地启动博客 `hugo server` 出现了一堆报错。

Don't Panic❗️

按照报错一条一条解决一下就好啦。主要就是一些 function deprecated，一般会提示用什么替代。
然后发现最大需要改动的是 NeoDB shortcode。

原来广为流传的版本是这个

```html
{{ $dbUrl := .Get 0 }}
{{ $dbApiUrl := "https://neodb.social/api/" }}
{{ $dbType := "" }}

{{ if ( findRE `^.*neodb\.social\/.*` $dbUrl ) }}
    {{ $dbType = replaceRE `.*neodb.social\/(.*\/.*)` "$1" $dbUrl }}
{{ else }}
    {{ $dbType = $dbUrl }}
    {{ $dbApiUrl = "https://neodb.social/api/catalog/fetch?url=" }}
{{ end }}

{{ $dbFetch := getJSON $dbApiUrl $dbType }}

...后面省略
```

其中很重要的用来获取数据的 [`getJSON` Deprecated in v0.123.0](https://gohugo.io/functions/data/getjson/)，不能用了。按照文档里写的需要用 `resources.GetRemote`。

按照文档里的例子，我改成了这个，亲测可用。

```html
{{ $dbUrl := .Get 0 }}
{{ $dbApiUrl := "https://neodb.social/api/" }}
{{ $dbType := "" }}

{{ if ( findRE `^.*neodb\.social\/.*` $dbUrl ) }}
    {{ $dbType = replaceRE `.*neodb.social\/(.*\/.*)` "$1" $dbUrl }}
{{ else }}
    {{ $dbType = $dbUrl }}
    {{ $dbApiUrl = "https://neodb.social/api/catalog/fetch?url=" }}
{{ end }}

{{ $url := printf "%s%s" $dbApiUrl $dbType }}
{{ $data := dict }}

{{ with resources.GetRemote $url }}
    {{ with .Err }}
        {{ errorf "%s" . }}
    {{ else }}
        {{ $data = . | transform.Unmarshal }}
        {{ if $data }}
            {{ $itemRating := 0 }}{{ with $data.rating }}{{ $itemRating = . }}{{ end }}
            <div class="db-card">
                <div class="db-card-subject">
                    <div class="db-card-post"><img loading="lazy" decoding="async" referrerpolicy="no-referrer" src="{{ $data.cover_image_url }}"></div>
                    <div class="db-card-content">
                        <div class="db-card-title"><a href="{{ $dbUrl }}" class="cute" target="_blank" rel="noreferrer">{{ $data.title }}</a></div>
                        <div class="rating"><span class="allstardark"><span class="allstarlight" style="width: {{ mul 10 $itemRating }}%"></span></span><span class="rating_nums">{{ $itemRating }}</span></div>
                        <div class="db-card-abstract">{{ $data.brief }}</div>
                    </div>
                    <div class="db-card-cate">{{ $data.category }}</div>
                </div>
            </div>
        {{ end }}
    {{ end }}
{{ else }}
    <p style="text-align: center;"><small>远程获取内容失败，请检查 API 有效性。</small></p>
    {{ errorf "Unable to get remote resource %q" $url }}
{{ end }}

```


效果和之前一样

{{< neodb "https://neodb.social/tv/season/5XNZfs5lya1GSt5zdRjhzx" >}}
