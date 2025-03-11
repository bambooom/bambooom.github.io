---
draft: false
title: Three.js Journey Notes 3 - Advanced Techniques
date: 2025-03-11
categories: Learning
comments: true
ShowToc: true
isCJKLanguage: false
---

课程链接：[three.js journey](https://threejs-journey.com/)

[Notes 1 - Basics](../threejs-journey-notes-1-basics)
[Notes 2 - Classic Techniques](../threejs-journey-notes-2-classic-techniques)

## Physics

We need to add physics library.
The idea is that we add a physics world which is purely theoretical. We cannot see it.
So when we create a Three.js mesh, we also create a version of that mesh inside physics world, like projected one in physics world.
So on each frame, physics world update itself, we take the coordinates of the projected physics object and then apply them to the corresponding Three.js mesh.

> First, you must decide if you need a 3D library or a 2D library. While you might think it has to be a 3D library because Three.js is all about 3D, you might be wrong. 2D libraries are usually much more performant, and if you can sum up your experience physics up to 2D collisions, you better use a 2D library.

3D Libraries:
- Ammo.js: https://github.com/kripken/ammo.js/
	- physics engine written in C++, a little heavy
	- still updated by community
	- most used library
- Cannon.js: https://github.com/schteppe/cannon.js
	- lighter than Ammo.js
	- more comfortable to implement
	- not updated, but has maintained fork
- Oimo.js: https://github.com/lo-th/Oimo.js
	- lighter than Ammo.js
	- easier to implement
	- not updated
- Rapier: https://github.com/dimforge/rapier
	- similar to Cannon.js
	- good performance
	- still update and maintained
2D Libraries:
- Matter.js: https://github.com/liabru/matter-js
	- still kind of updated
- p2.js: https://github.com/schteppe/p2.js
	- not updated
- https://github.com/piqnt/planck.js
	- still updated
- https://github.com/kripken/box2d.js/
	- not updated
- Rapier: https://github.com/dimforge/rapier
	- same library for 3D

solutions that try to combine Three.js with libraries like [Physijs](https://chandlerprall.github.io/Physijs/), it uses Ammo.js and supports workers natively.

### Base example
code example for the following will use Cannon.js.

```js
import * as CANNON from 'cannon-es';

/**
* Physics world
*/
const world = new CANNON.World(); // empty space, like Scene in Threejs
// add gravity, Vec3, just like Three.js Vector3
world.gravity.set(0, -9.82, 0); // y axis, go down, which is G

// Materials, bouncing and friction behaviour
const concreteMaterial = new CANNON.Material('concrete');
const plasticMaterial = new CANNON.Material('plastic');


// create a Body (which are objects in the physics world that will fall and collide with other bodies)
// Sphere
const sphereShape = new CANNON.Sphere(0.5); // 0.5 is same size as the buffer test sphere
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0), // higher than the floor
  shape: sphereShape,
  material: plasticMaterial,
});
// pushing the sphere to origin
sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(sphereBody); // like add mesh to scene

// Floor phsics, add floor to stop the sphere from falling through
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.material = concreteMaterial;
floorBody.mass = 0; // default mass is 0, it means static, won't move
floorBody.addShape(floorShape);
// since threejs floor is rotated, need to rotate the cannon floor, which is harder than in threejs
floorBody.quaternion.setFromAxisAngle(
  new CANNON.Vec3(-1, 0, 0),
  Math.PI * 0.5
);
world.addBody(floorBody);
```

To make physics world update on frame, we need to update animate `tick()` function:

```js
const tick = () =>
{
    // ...

    // Update physics
    world.step(1 / 60, deltaTime, 3)
}
```

At last, we need to update our Three.js sphere by using `sphereBody` coordinates:

```js
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

// update position from cannon to threejs, you will see the sphere fall down
sphere.position.copy(sphereBody.position) // which just do below copy x, y, z
sphere.position.x = sphereBody.position.x;
sphere.position.y = sphereBody.position.y;
sphere.position.z = sphereBody.position.z;
```

### Contact material

to make ball bounce, we need to add change material.

A material in physics world is just a reference. So name it with reasonable name.

Concate material is the combination of two materials with defined friction coefficient (how much does it rub) and the restitution coefficient (how much does it bounce)—both have default values of 0.3.

```js
const concretePlasticContactMaterial = new CANNON.ContactMaterial(
  concreteMaterial,
  plasticMaterial,
  {
      friction: 0.1,
      restitution: 0.7
  }
)
world.addContactMaterial(concretePlasticContactMaterial)
```

Then the ball will bounce.

### Apply forces

many ways to apply forces to a [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html):

- [applyForce](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyForce) to apply a force to the [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html) from a specified point in space (not necessarily on the [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html)'s surface) like the wind that pushes everything a little all the time, a small but sudden push on a domino or a greater sudden force to make an angry bird jump toward the enemy castle.
- [applyImpulse](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyImpulse) is like [applyForce](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyForce) but instead of adding to the force that will result in velocity changes, it applies directly to the velocity.
- [applyLocalForce](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyLocalForce) is the same as [applyForce](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyForce) but the coordinates are local to the [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html) (meaning that `0, 0, 0` would be the center of the [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html)).
- [applyLocalImpulse](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyLocalImpulse) is the same as [applyImpulse](http://schteppe.github.io/cannon.js/docs/classes/Body.html#method_applyImpulse) but the coordinates are local to the [Body](http://schteppe.github.io/cannon.js/docs/classes/Body.html).

Because using "force" methods will result in velocity changes, let's not use "impulse" methods

### Broadphase

Testing collision between objects are costly in terms of performance.
The broadphase doing a rough sorting of Bodies before testing them.

There are 3 broadphase algorithms available in Cannon.js:

- [NaiveBroadphase](http://schteppe.github.io/cannon.js/docs/classes/NaiveBroadphase.html): Tests every [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html) against every other [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html)
- [GridBroadphase](http://schteppe.github.io/cannon.js/docs/classes/GridBroadphase.html): Quadrilles the world and only tests [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html) against other [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html) in the same grid box or the neighbors' grid boxes.
- [SAPBroadphase](http://schteppe.github.io/cannon.js/docs/classes/SAPBroadphase.html) (Sweep and prune broadphase): Tests [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html) on arbitrary axes during multiples steps.
	- can eventually generate bugs where a collision doesn't occur, but it's rare, and it involves doing things like moving [Bodies](http://schteppe.github.io/cannon.js/docs/classes/Body.html) very fast.

```js
// default is NaiveBoradphase, SAPBoradphase is recommended
world.broadphase = new CANNON.SAPBroadphase(world)
```

### Sleep

set this to be true for far and not moving objects, so no need to be tested.

```js
world.allowSleep = true
```

### Events on Body

 `'collide'`, `'sleep'` or `'wakeup'`.

for example, play a hit sound when collide

```js
/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = () =>
{
    hitSound.play()
}

const createBox = (width, height, depth, position) =>
{
    // ...
    body.addEventListener('collide', playHitSound)
    // ...
}
```

## Imported Models
some of popular 3D model formats:
- OBJ
- FBX
- STL
- PLY
- COLLADA
- 3DS
- GLTF
	- stands for GL Transmission Format, made by the Khronos Group (the guys behind OpenGL, WebGL, Vulkan, Collada and with many members like AMD / ATI, Nvidia, Apple, id Software, Google, Nintendo, etc.)
	- become very popular these past few years
	- supports very different sets of data
	- supports various file formats like json, binary, embed textures
	- has become the standard when it comes to real-time

Find some pre-made models on: [GitHub - KhronosGroup/glTF-Sample-Assets: An assortment of assets that demonstrate features and capabilities of the glTF format](https://github.com/KhronosGroup/glTF-Sample-Assets)

Each model folder contain different GLTF formats, these 4 are most important:
- glTF
	- kind of default format, it's a JSON, can open it in editor
	- contains various information like cameras, lights, scenes, materials, objects transformations,
	- but neither the geometries nor the textures
	- `Duck0.bin` is the file contain geometries and all information associated with the vertices like UV coordinates, normals, vertex colors, etc.
	- `DuckCM.png` is simply the texture of the duck.
	- we only need to load `Duck.gltf`
- glTF-Binary
	- composed of only one file, binary file
	- a little lighter and more comfortable to load
	- but won't be able to alter its data
- glTF-Draco
	- like glTF default one, but the buffer data is compressed using the [Draco algorithm](https://github.com/google/draco)
	- its `.bin` file size is much lighter
- glTF-Embedded
	- like glTF-Binary, with only one file, but actually it's a JSON which you can edit

Choosing which format is based on how you want to handle the assets.

>If you want to be able to alter the textures or the coordinates of the lights after exporting, you better go for the **glTF-default**. It also presents the advantage of loading the different files separately, resulting in a load speed improvement.
>If you want only one file per model and don't care about modifying the assets, you better go for **glTF-Binary**.
>In both cases, you must decide if you want to use the **Draco** compression or not, but we will cover this part later.

### Base Example

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/**
* Models
*/
const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/models/Duck/glTF/Duck.gltf',
    // success loaded callback
    (gltf) =>
    {
        console.log('success')
        console.log(gltf)
        scene.add(gltf.scene.children[0]) // duck
        // if there are multiple parts in this model, we need to add them all like
		//for(const child of gltf.scene.children)
		//{
		//    scene.add(child)
		//}
		// but we cannot use for loop, The problem is that when we add a child from one scene to the other, it gets automatically removed from the first scene. That means that the first scene now has fewer children in it.
		// can use while loop
		while(gltf.scene.children.length)
		{
		    scene.add(gltf.scene.children[0])
		}
    },
    // progress callback, can be omitted
    (progress) =>
    {
        console.log('progress')
        console.log(progress)
    },
    // error callback, can be omitted
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)
```

### Draco compression example

Draco need a decoder, which is located in `/node_modules/three/examples/jsm/libs/`, so need to copy whole folder to be next to model folder

```javascript
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const dracoLoader = new DRACOLoader()

dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)
```

### Animated Model

Some models already contain animation. To activate it, we need [AnimationMixer](https://threejs.org/docs/#api/en/animation/AnimationMixer), it's like a player associated with an object that can contain one or many [AnimationClips](https://threejs.org/docs/#api/en/animation/AnimationClip).

```javascript
let mixer = null

gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) =>
    {
        gltf.scene.scale.set(0.03, 0.03, 0.03)
        scene.add(gltf.scene)

        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(gltf.animations[0])
        action.play()
    }
)
```

and update the mixer in tick function to update it

```javascript
const tick = () =>
{
    // ...

    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // ...
}
```
