---
isPublish: true
title: GitHub Package Registry 简单试用记录
publishedAt: 2020-05-26
disqus: y
---

> 简单记录下 GitHub Package Registry 怎么用


[Example Repo: gh-pkg-demo](https://github.com/bambooom/gh-pkg-demo)

## How to use GitHub Package Registry

### 1. Generate Personal Access Token

- To download and install packages from GitHub Package Registry, you need a token with `read:packages` and `repo` scopes.
- To upload and publish packages, you need a token with `write:packages` and `repo` scopes.
- To delete a package with specified version, you need a token with `delete:packages` and `repo` scopes

Generate the token according to your need.

### 2. Local config TOKEN

Add the generated token to the local file `~/.npmrc` like:

```
//npm.pkg.github.com/:_authToken=TOKEN
```

Create the file `~/.npmrc` if it doesn't exist. This is the global user config file for npm.

If you don't want to set TOKEN locally, then one should log in by `npm login` command and input the info of your GitHub account with prompt like:

```
$ npm login --registry=https://npm.pkg.github.com
> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC-EMAIL-ADDRESS
```

### 3. Project Config to publish to GitHub

[Edit the `package.json` file to specify the registry as GitHub](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#publishing-a-package-using-publishconfig-in-the-packagejson-file).
And also the package name must be scoped with the onwer, `@OWNER/PKG-NAME`.

```diff
--- "name": "gh-pkg-demo",
+++ "name": "@bambooom/gh-pkg-demo",
+++ "publishConfig": {
+++   "registry": "https://npm.pkg.github.com/"
+++ },
```

Alternative way to config the project is [using local `.npmrc` file](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages#publishing-a-package-using-a-local-npmrc-file).
That is adding a local `.npmrc` under project root, and adding this to the file:

```
registry=https://npm.pkg.github.com/OWNER
```

### 4. Publish packages
To publish the package to GitHub, just use the command:

```
$ npm publish
```

You can see the package on GitHub:

![](../../assets/images/gh-pkg.png)

### 5. Install packages

To install packages from GitHub package registry, need a local `.npmrc` file to set the registry.

```
registry=https://npm.pkg.github.com/OWNER
```

But if only using this setting, all package requests will go through GitHub Packages.

> You also need to add the *.npmrc* file to your project so all requests to install packages will go through GitHub Packages. When you route all package requests through GitHub Packages, you can use both scoped and unscoped packages from *npmjs.com*.

So, the github package requests will do the check whether the package can be found on
github. If not, it will go to *npmjs.com* to search for the packages.

However, I found that the check request will time out randomly (may be due to GFW).
I'd like to skip the check for those packages I want to download from *npmjs.com*.

I try to change the setting in `.npmrc` like this to achive this goal:

```
registry=https://registry.npmjs.org/
@OWNER:registry=https://npm.pkg.github.com
```

With this setting, default registry is *npmjs.com*. Only `@OWNER`'s packages use the GitHub registry.

Then use the command to install:

```
npm install @bambooom/gh-pkg-demo
```

Look inside `package-lock.json`, the package is resolved by GitHub registry like:

```
"@bambooom/gh-pkg-demo": {
  "version": "1.0.0",
  "resolved": "https://npm.pkg.github.com/download/@bambooom/gh-pkg-demo/0.0/0ec13dcce4a2f9510111a8b88957c3436a0e04633d0208aa71dfa5f7804b67ff",
  "integrity": "...."
},
```

## Refs
- [About Tokens](https://help.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens)
- [Configuring npm for use with GitHub Packages](https://help.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages)
