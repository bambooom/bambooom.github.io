---
draft: false
title: Three.js Journey Notes - Basics
date: 2025-02-26
categories: Learning
comments: true
ShowToc: true
isCJKLanguage: true
---

课程链接：[three.js journey](https://threejs-journey.com/)

前年买了一门课，去年断断续续学了一两个月，搁置了5个月，今年继续学。
先复习之前的课记个笔记。

*没有追求写得很通顺，中英胡乱混合ing*

## why use Three.js

> [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) (Web Graphics Library) is a JavaScript API for rendering high-performance interactive 3D and 2D graphics within any compatible web browser without the use of plug-ins.

WebGL 是用的 GPU 来绘制的，GPU 有很多 parallel workers，所以很快。
怎么放置 points 每个 pixel 如何画都是在 shaders 里定义的。(shader 是个挺重要的概念，之后再好好了解)

但是 native WebGL too hard，手写 WebGL 还是比较痛苦比较麻烦的一件事（老师举例，画一个简单的三角形就需要写 100 行代码），
所以 [three.js](https://threejs.org/) 应运而生。


## 4 Basics elements

- A scene that will contain objects, 对应 `THREE.Scene`
- Some objects, can be many things like primitive geometrics, imported models, particles, lights, etc.
  - 常用的 Mesh - combination of a geometry (the shape) and a material (how it looks)
  - threejs 有一系列 Geometry class 对应各种形状，另一系列 Materials 就是对应样子等
- `Camera`
  - camera 不可见，只是一种理论上的 point of view。render 的时候就是从 camera 的视角出发去做
  - 也可以有多台camera，像是拍电影一样，在 cameras 中间切换视角
  - threejs 也有几种不同的 camera 可以选择，basic 选用 `PerspectiveCamera`
  - *field of view*: how large your vision angle is, unit in degrees and corresponds to the vertical vision angle
- `Renderer`，顾名思义就是做渲染工作的，它会将当下的 scene 从 camera 的视角出发，将结果画在一张画布上

```js
import * as THREE from 'three';

// Scene
const scene = new THREE.Scene();
// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1); // cube: width, height, depth
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // red, using hex
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh); // need to add to scene

const sizes = {
  width: 800,
  height: 600,
};
// Camera
// 75 - field of view, 5的角度在实际情况来说可能太大。但对初学者来说，比较合适，不会跟丢 objects。多数 website， around 35
// width / height - aspect ratio，画布的宽高比
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
// camera.position.x = 1
// camera.position.y = 1
camera.position.z = 3; // by default, everything is at the center, so need to move camera backwards to be able to see objects
scene.add(camera);

// Canvas，<canvas class="webgl"></canvas>
const canvas = document.querySelector('canvas.webgl')
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera); // 这一步才会在网页上看到渲染的效果
```

## Animations

前面的例子里 render 只是一个静态的结果，想要让 3D 能动起来，需要使用 `window.requestAnimationFrame` 持续进行 render

fps = frames per seconds

```js
let time = Date.now()

const tick = () => {
	// Time
	const currentTime = Date.now()
	const deltaTime = currentTime - time // around 16-17 milliseconds
	time = currentTime
	// update objects
  // 用 delta 是来fix 时间，rotation 速度就和 frame rate 不相关，在任何 frame rate 都保持相同速度
	mesh.rotation.y += 0.002 * deltaTime // rotate the object
	// render part
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick) // will repeated being called
}

tick()
```

## Camera

- `THREE.Camera` is abstract class, not supposed to being used directly
- `THREE.ArrayCamera` from multiple cameras on a specific areas of render
- `THREE.StereoCamera` render through 2 cameras that mimic eyes to create a parallax effect, 3D VR like
- `THREE.CubeCamera` do 6 renders, surroundings like environment map, reflection or shadow map
- `THREE.OrthographicCamera` render the scene without perspective, RTS game, object size is always the same, no matter far or near
	- parameters: left, right, top, bottom; 像是设置一个 box square，方形前进这样
	- cube looks flat
- `THREE.PerspectiveCamera` 最常用的
	- field of view，实际上人类的视觉角度是 huge，但是在这里不能设置太大。比如设置成 140 degree 的话，objects 会看上去很小，以及 distorted（严重变形）。原因是我们一般在网页里是 render in a rectangle area，会需要将 amplified render squeeze 到一个方形里。老师推荐 45-75 fov
	- aspect ratio，width/height of render
	- near / far: objects closer than near or further than far will not show up，camera can see 的距离区间
		- 如果 far 设置小于 camera 的 distance，objects 就会看不见或者部分看不见
		- 但是不要使用 extreme values like 0.0001 and 9999999 to prevent z-fighting
			- [https://twitter.com/FreyaHolmer/status/799602767081848832](https://twitter.com/FreyaHolmer/status/799602767081848832)
			- [https://twitter.com/Snapman_I_Am/status/800567120765616128](https://twitter.com/Snapman_I_Am/status/800567120765616128)
		- 0.1 可以，具体取决于project


## Geometries

What:
- composed of **vertices** (point coordinates) and **faces** (triangles that join vertices to create surface)
- can be used for meshed and particles
- can store more data than positions

All inherited from `BufferGeometry`.

The [BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) has 6 parameters:
- `width`: The size on the `x` axis
- `height`: The size on the `y` axis
- `depth`: The size on the `z` axis
- `widthSegments`: How many subdivisions in the `x` axis
- `heightSegments`: How many subdivisions in the `y` axis
- `depthSegments`: How many subdivisions in the `z` axis

segments 在需要精细化每个点的时候会用到，设置 material 的时候带上 `wireframe: true` 就可以看到 triangles segments.

### How to create your own buffer geometry

To add vertices to a [BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) you must start with a [Float32Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array).
[Float32Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Float32Array) are native JavaScript typed array. You can only store floats inside, and the length of that array is fixed.

```js
// Create an empty BufferGeometry
const geometry = new THREE.BufferGeometry()
// init Float32Array
const positionsArray = new Float32Array([
    0, 0, 0, // First vertex
    0, 1, 0, // Second vertex
    1, 0, 0  // Third vertex
])
// convert Float32Array to BufferAttribute
// 3 means how much values compose one vertex
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
```

## Textures

mostly used types:
- color
- alpha
	- grayscale image
	- white visible, black not visible
- height (or Displacement) 使表面不平？
	- grayscale image
	- move the vertices to create some relief
	- need enough subdivision
- normal
	- add small details
	- doesn't need subdivision
	- the vertices won't move
	- lure(诱骗诱使) the light about the face orientation
	- better performances than adding a height texture with a lot if subdivision
- ambient occlusion
	- grayscale
	- add fake shadows in crevices
- metalness
	- grayscale
	- white is metallic, black is not
	- mostly for reflection
- roughness
	- grayscale
	- in duo with the metalness
	- white is rough
	- black is smooth
	- mostly for light dissipation

**PBR principle** (especially the metalness and the roughness):
- physical based rendering
- follow real-life directions to get realistic results
- reading:
	- [Basic Theory of Physically-Based Rendering | Marmoset](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
	- [Physically-Based Rendering, And You Can Too! | Marmoset](https://marmoset.co/posts/physically-based-rendering-and-you-can-too/)


filtering and mipmapping: a technique that consists of creating half a smaller version of a texture again and again until you get a 1x1 texture. All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of the texture.
主要是为了处理毛边，blurring


`.jpg` lossy compression but usually lighter
`.png` lossless compression but usually heavier

make texture image as small as possible, GPU need to store it, but it has limitation.
texture resolution better must be a power of 2, 512x512, 1024x1024, 512x2048

where to find textures:
- [poliigon.com](http://poliigon.com/)
- [3dtextures.me](http://3dtextures.me/)
- [arroway-textures.ch](http://arroway-textures.ch/)

## Material

are used to put a color on each visible pixel of the geometries
The algorithms that decide on the color of each pixel are written in programs called **shaders**. Writing shaders is one of the most challenging parts of WebGL and Three.js, but don't worry; Three.js has many built-in materials with pre-made shaders.

Normals material:
"Normals" are information encoded in each vertex that contains the direction of the outside of the face

Huge library of matcap
[GitHub - nidorx/matcaps: Huge library of matcap PNG textures organized by color](https://github.com/nidorx/matcaps)
create matcap online studio
[Matcap Tweaker](https://www.kchapelier.com/matcap-studio/)

Environment map is like an image of what's surrounding the scene.
example picture is found from [Poly Haven](https://polyhaven.com/)

clearcoat, varnish glass effect on the top of the material
