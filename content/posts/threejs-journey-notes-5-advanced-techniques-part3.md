---
draft: false
title: Three.js Journey Notes 5 - Advanced Techniques Part3
date: 2025-03-17
categories: Learning
comments: true
ShowToc: true
isCJKLanguage: false
---

课程链接：[three.js journey](https://threejs-journey.com/)

其他几篇：
- [Notes 1 - Basics](../threejs-journey-notes-1-basics)
- [Notes 2 - Classic Techniques](../threejs-journey-notes-2-classic-techniques)
- [Notes 3 - Advanced Techniques Part1](../threejs-journey-notes-3-advanced-techniques-part1)
- [Notes 4 - Advanced Techniques Part2](../threejs-journey-notes-4-advanced-techniques-part2)


## Realistic Render

### Tone Mapping

intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values.
Tone mapping in Three.js will actually fake the process of converting LDR to HDR even if the colors aren't HDR resulting in a very realistic render.

```javascript
// Tone mapping
renderer.toneMapping = THREE.ACESFilmicToneMapping
// adjust exposure, influencing the amount of light allowed into the scene
// higher make the scene more bright
renderer.toneMappingExposure = 2
```

There are multiple possible values:

- `THREE.NoToneMapping` (default)
- `THREE.LinearToneMapping`
- `THREE.ReinhardToneMapping` (washed-out colors, high level of realism)
- `THREE.CineonToneMapping`
- `THREE.ACESFilmicToneMapping`

### Antialiasing

>We call aliasing an artifact that might appear in some situations where we can see a stair-like effect, usually on the edge of the geometries. (锯齿边缘)

- Easy solution will be increase the renderer's resolution. It's called **super sampling (SSAA)** or fullscreen **sampling (FSAA)**. But it can result in performance issues.
- Other solution: **multi sampling (MSAA)**, render multiple values per pixel (usually 4) only for geometries edges.

```javascript
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true // do this will enable the MSAA
})
```

### Shadows

Environment map is like a light coming from every direct, it can't cast shadows.
We need to add another light which can roughly matched the lighting of environment map and cast the shadows.

```javascript
// Shadows
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// for example add directional light to cast shadow
/**
 * Directional light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 6)
directionalLight.position.set(3, 7, 6)
scene.add(directionalLight)
// enable shadows of directional light
directionalLight.castShadow = true

// Target
directionalLight.target.position.set(0, 4, 0)
directionalLight.target.updateWorldMatrix()
directionalLight.shadow.camera.far = 15

// increase shadow map size to be more realistic and precise shadows
// directionalLight.shadow.mapSize.set(1024, 1024) // shadow will be sharp, can be lower to 5112x512
directionalLight.shadow.mapSize.set(512, 512) // will get more blurry shadow, look better and improve the performance

// activase shadows on all the meshes of the imported modal
const updateAllMaterials = () =>
{
    scene.traverse((child) =>
    {
        if(child.isMesh)
        {
            // ...

            child.castShadow = true
            child.receiveShadow = true
        }
    })
}
```

"Shadow acne"（阴影失真，阴影暗斑） can occur on both smooth and flat surfaces for precision reasons when calculating if the surface is in the shadow or not. Usually caused by not enough resolution. We need to use shadow bias to fix it.

```javascript
// `normalBias` usually helps for rounded surfaces.
directionalLight.shadow.normalBias = 0.027
// `bias` usually helps for flat surfaces.
directionalLight.shadow.bias = - 0.004
```


### Texture, Color space

> The color space is a way to optimise how colors are being stored according to the human eye sensitivity. This mostly concerns textures that are supposed to be seen.

By default, Three.js sets the color space to linear, meaning that we need to change textures which are supposed to be seen by human eye to be `THREE.SRGBColorSpace`.

```javascript
floorColorTexture.colorSpace = THREE.SRGBColorSpace

wallColorTexture.colorSpace = THREE.SRGBColorSpace
```

## Code Structuring for bigger projects

这位老师甚至连 JS 的 class & modules 也顺带讲了一些基础知识 😂🫶

![](https://threejs-journey.com/assets/lessons/42/014.png)

Anyway, skip parts I already know about, the folder structure of the above demo can be organized like:

```bash
.
├── experience
│   ├── Camera.ts               # Camera with orbit control
│   ├── Renderer.ts             # WebGLRenderer
│   ├── index.ts                # Experience class: control all
│   ├── sources.ts              # set images/.. urls
│   ├── utils
│   │   ├── Debug.ts            # 'lil-gui'
│   │   ├── EventEmitter.ts     # event bus, handle events
│   │   ├── Resources.ts        # Resources class: load and handle assets
│   │   ├── Sizes.ts            # handle resize
│   │   └── Time.ts             # handle tick()
│   └── world
│       ├── Environment.ts      # handle scene and environmentMap
│       ├── Floor.ts            # Floor class, to draw specific floor
│       ├── Fox.ts              # import and update Model
│       └── World.ts            # container for this scene
└── index.tsx                   # my page init
```

[demo example project](https://github.com/bambooom/threejs-journey/tree/main/src/course/chapter3-advanced-techniques/26-code-structuring-for-bigger-projects)
