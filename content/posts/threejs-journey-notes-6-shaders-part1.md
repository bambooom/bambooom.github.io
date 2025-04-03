---
draft: false
title: Three.js Journey Notes 6 - Shaders Part1
date: 2025-04-03
categories: Learning
comments: true
ShowToc: true
isCJKLanguage: false
---


## What is a shader

- one of the main components of WebGL
- a program written in **GLSL**
- sent to GPU
- Position each vertex of a geometry
- Colorize each visible *"pixel"* (accurately should be using term *"fragment"*) of that geometry

> Then we send a lot of data to the shader such as the vertices coordinates, the mesh transformation, information about the camera and its field of view, parameters like the color, the textures, the lights, the fog, etc. The GPU then processes all of this data following the shader instructions, and our geometry appears in the render.

Two types of shaders
- **Vertex shader**
	- position the vertices of the geometry
	- send vertices positions, mesh transformations (its position, rotation, scale), camera information (its position, rotation, and field of view) to GPU
	- GPU use these data to project the vertices on a 2D space aka our canvas
	- data changes between vertices called **attribute**, like vertex position
		- attribute can only be used in vertex shader
	- data doesn't change between vertices called **uniform**, like position of the mesh
		- uniform can be used in both vertex shader and fragment shader
	- vertex shader happens first, and the fragment shader is proceeded
- **Fragment shader**
	- color each visible fragment of the geometry
	- send data like color by using **uniform**, or
	- *send data from vertex shader to fragment shader*, this kind of data is called **varying**
	- 中间状态会 get interpolated，比如三角形每个顶点的 color 不一样的话，中间的点的颜色就会混合三种颜色。也不仅是 color 有这种效果

![[Screenshot 2025-04-03 at 11.00.10.png]]

Why creating our own shaders
- Three.js materials are limited
- shaders can be very simple and performant
- can apply post-process

## `RawShaderMaterial`

```javascript
const material = new THREE.RawShaderMaterial({
    vertexShader: `
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat4 modelMatrix;

        attribute vec3 position;

        void main()
        {
            gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        precision mediump float;

        void main()
        {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `
})
```

inside `vertexShader` and `fragmentShader` is the GLSL code for shaders.

better to use separate GLSL file for this, add plugins like [vite-plugin-glsl](https://www.npmjs.com/package/vite-plugin-glsl) to make the project can import GLSL file

```javascript
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'

const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader
})
```

## GLSL basics

- stands for OpenGL Shading Language
- types language, close to C language
- no way to log values
- indentation not essential
- semicolon is required, forgetting one will probably result in compilation error
- Variable
	- `float` `int` `bool` `vec2` `vec3` `vec4`
- functions
- built-in native functions: as `sin`, `cos`, `max`, `min`, `pow`, `exp`, `mod`, `clamp`, but also very practical functions like `cross`, `dot`, `mix`, `step`, `smoothstep`, `length`, `distance`, `reflect`, `refract`, `normalize`
- Docs:
	- [Shaderific for OpenGL](https://shaderific.com/glsl.html)
	- [OpenGL 4.x Reference Pages](https://registry.khronos.org/OpenGL-Refpages/gl4/html/indexflat.php)
	- [The Book of Shaders](https://thebookofshaders.com/)

```glsl
float a = 1.0;
float b = 2.0;
float c = a * b;

int d = 2;
float e = b * float(d);

bool foo = true;
bool bar = false;

vec2 foo = vec2(1.0, 2.0); // store 2 coordinates x, y
// foo.x = 1.5;
// foo.y = 3.0;
foo *= 2.0; // will get (2.0, 4.0)

vec3 purpleColor = vec3(0.0);
purpleColor.r = 0.5; // can use r, g, b (alias)
purpleColor.b = 1.0;


// create vec3 from vec2
vec2 foo2 = vec2(1.0, 2.0);
vec3 bar = vec3(foo2, 3.0);


// create vec2 from vec3
vec3 foo3 = vec3(1.0, 2.0, 3.0);
vec2 bar2 = foo.xy; // bar2 will be (x,y), order matters

// vec3, xyzw, rgba
vec4 foo4 = vec4(1.0, 2.0, 3.0, 4.0);
float bar3 = foo4.w; // 4th value. same as foo4.a

// functions
float loremIpsum() {
	float a = 1.0;
	float b = 2.0;
	return a + b;
}

// use function
float result = loremIpsum();
```

## Understanding the vertex shader

```glsl
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
attribute vec3 position;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
	// gl_Position.x += 0.5;
	// gl_Position.y += 0.5;
}
```

`main` function will be called automatically.
The goal of the instructions in `main` function is to set `gl_Position` properly. And at the end, it's a `vec4`. We can access its `x` `y` `z` `w` properties.

- First retrieve the vertex `position` with `attribute vec3 position;`
- it can be applied for each vertex as `gl_Position = /* ... */ vec4(position, 1.0);`
- 3 matrices transformations
	- `modelMatrix` apply transformations relative to Mesh. If we scale, rotate or move the Mesh
	- `viewMatrix` apply transformations relative to camera. If we rotate the camera to the left, the vertices should be on the right, if we move the camera in direction of the Mesh, the vertices should get bigger, etc
	- `projectionMatrix` finally transform our coordinations into the final clip space coordinations
	- read more: [LearnOpenGL - Coordinate Systems](https://learnopengl.com/Getting-started/Coordinate-Systems)


Transforming our plane like wave  via using `sin` on `z`
```glsl
void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;

    // ...
}
```
