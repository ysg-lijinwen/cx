---
title: 基于Vue的组件化开发并发布到npm
tags: 
  - 组件库
  - npm
  - Vue
  - vue-cli
date: 2020-09-25
author: 断风尘
location: 昆明
summary: 规范的目的是为了提高效率，包括沟通效率，理解效率和开发效率。
---
在开始之前确保已经具备了Vue的开发环境。

## 创建项目
 基于vue-cli脚手架创建项目。
  
```bash
 vue create le-baby
```

## 调整项目目录结构

   1. 将src目录改为examples，用于组件的测试；

   2. 增加packages目录，统一管理组件代码文件。

   3. 项目结构如下：
![项目结构](/img-1.png)
## 修改打包配置
我们将src重命名为examples，并添加packages目录，用来存放我们的自定义组件。但是cli默认会启动src下的服务，如果目录名变了，我们需要手动修改配置。vue-cli中提供自定义打包配置项目的文件，如果没有，我们只需要手动创建vue.config.js即可。具体修改如下：

```js
module.exports = {
​    pages: {
​      index: {
​        entry: 'examples/main.js',
​        template: 'public/index.html',
​        filename: 'index.html'
​      }
​    },
​    // 扩展 webpack 配置，使 packages 加入编译
​    chainWebpack: config => {
​      config.module
​        .rule('js')
​        .include
​          .add('/packages')
​          .end()
​        .use('babel')
​          .loader('babel-loader')
​    }
}
```
## 编写组件代码
   常规的vue组件封装，此处就不给实例了。

## 编写组件配置文件
假如我们编写一个回到顶部的组件，配置如下：

```js
//导入组件，确保from后路径指向组件源码文件
import LeBackToTop from './src/index'

// 为组件提供 install 安装方法，供按需引入
LeBackToTop.install = function (Vue) {
​    Vue.component(LeBackToTop.name, LeBackToTop)
}

// 导出组件
export default LeBackToTop
```
## 配置组件库入口文件
在packages的入口文件index.js（如果没有则自己创建）中导入组件并安装导出

```js
// 导入组件
import LeBackToTop from './back-to-top'
import LeStickyHeadList from './sticky-head-list'
import LeLogin from './login'
import LeCountDown from './count-down'

// 组件列表
const components = [
    LeBackToTop,
    LeStickyHeadList,
    LeLogin,
    LeCountDown
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，那么所有的组件都会被注册
const install = function (Vue) {
  // 判断是否安装
  if (install.installed) return
  // 遍历注册全局组件
  components.map(component => Vue.component(component.name, component))
}

// 判断是否是直接引入文件
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具有 install，才能被 Vue.use() 方法安装
  install,
  // 以下是具体的组件列表
  LeBackToTop,
  LeStickyHeadList,
  LeLogin,
  LeCountDown
}
```
## 组件测试
 在example下进行组件测试。
1. 导入组件库
   main.js下导入组件库。
```js
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import LeBao from '../packages'

import App from './App.vue'

Vue.use(ElementUI)
Vue.use(LeBao)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
```
tip：
```js
 1. 必须引入Vue，即，`import Vue from 'vue'`
 2. 由于我的登录组件中使用了element-ui，因此此处也引入了；
```
2. 使用组件

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <!-- <le-login></le-login> -->
    <le-count-down ref="cCountDown" :show-day="true" :second="60" @timeup="timeupExe()"
      background-color="#f5f5f5" color="#FFA460" splitor-color="#ffa460"></le-count-down>
    <le-sticky-head-list :list-data='bisData'></le-sticky-head-list>
    <le-back-to-top ref="backToTop"></le-back-to-top>
  </div>
</template>
```

## 发布插件库

在验证组件可用之后，我们要考虑如何发布到npm上了，发布前我们需要先对package.json、.npmignore和README.md进行修改。
### 配置package.json文件
package.json中主要配置了组件库的基本信息和依赖情况。部分字段说明如下：

   > description：组件库的描述文本
   > keywords：组件库的关键词 
   > license：许可协议
   > repository：组件库关联的git仓库地址 
   > homepage：组件库展示的首页地址
   >  main：组件库的主入口地址(在使用组件时引入的地址) 
   > private：声明组件库的私有性
   > scripts：可执行的脚本命令
   > author：作者
   > contributors：贡献者

   完整实例：

```Json
{
  "name": "le-bao",
  "description": "乐宝系列组件",
  "version": "0.0.9",
  "author": "Lele.Lee <jinwen_li2012@163.com>",
  "license": "MIT",
  "private": false,
  "main": "lib/lebao.umd.min.js",
  "scripts": {
    "serve": "vue-cli-service serve --open",
    "build": "vue-cli-service build",
    //lib脚本说明：--target为编译文件输出目录；--name为文件名前缀；--dest lib为组件库代码入口文件；我们在命令行执行yarn lib命令，就会执行编译脚本。
    "lib": "vue-cli-service build --target lib --name lebao --dest lib packages/index.js",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "axios": "^0.19.2",
    "core-js": "^3.6.5",
    "element-ui": "^2.13.2",
    "node-sass": "^4.14.1",
    "sass-loader": "^8.0.2",
    "vue": "^2.6.11"
  },
  "bugs": {
    "url": "https://github.com/ysg-lijinwen/le-baby/issues",
    "email": "jinwen_li2012@163.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ysg-lijinwen/le-baby.git"
  },
  "contributors": [],
  "homepage": "https://github.com/ysg-lijinwen/le-baby.git",
  "keywords": [
    "component",
    "components",
    "乐宝组件",
    "优雅的按钮",
    "vue",
    "vue-component",
    "Button",
    "design"
  ],
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.4.0",
    "@vue/cli-service": "^4.4.0",
    "vue-template-compiler": "^2.6.11"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead"
  ]
}
```
### 关于README.md
用于插件发布是，显示插件信息、使用方法、相关命令等。![REDAME.MD实例](/img-2.png)
5. 关于.npmignore文件
用于忽略不想发布到npm的相关文件/文件夹资源。实例如下：

```bash
.DS_Store
node_modules/
dist/
node_modules/.bin/
build/
config/
static/
.babelrc
.editorconfig
.gitignore
.npmignore
.postcssrc.js
index.html
package-lock.json
npm-debug.log*
yarn-debug.log*
yarn-error.log*

#Editordirectoriesandfiles
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
#忽略目录
examples/
packages/
public/
#忽略指定文件
vue.config.js
babel.config.js
*.map
```
### 发布到npm服务
1. 本地编译组件
发布之前先在本地使用`yarn lib`进行编译，确保能够正常编译组件到lib目录下。
2. 设置目标服务 `npm config set registry https://registry.npmjs.org/`
3. 使用`npm whoami`验证自己是不是已经登录了npm，如果已经登录会返回当前的登陆账号名称。
4. 登录`npm login`
5. 发布组件或组件库：`npm publish` （升级组件库的时候，版本号必须大于上一次的，另外值得注意的是，发布之前请先编译组件库项目，确保发布的是最新编译的结果，避免发布后发现新的改动没有体现在新版的组件库中。）
6. 删除组件或组件库；`npm unpublished`（只能删除发布时长小于24小时的）。
7. 对包进行更新：当对包的代码进行更新之后，需要重新进行发布，这个时候需要进行版本控制，可以手动去包的package.json中进行修改，但是npm也提供了相应的命令执行来进行相应的操作：`npm version major`会更新包的主版本号、`npm version minor`会更新包的次版本号、`npm version patch`会更新包的修订号；更新完版本号之后，再使用`npm publish`命令进行发布便可以实现包的更新。

### 组件库版本号控制
- 版本格式：主版本号.次版本号.修订号；
- 主版本号：新的架构调整；
- 次版本号：新增功能；
- 修订号：修复bug。

### 撤销已经发布的包
1. 撤销包可能会对使用该包作为依赖的项目产生影响，因此npm禁止对发布时间超过24小时的包进行撤销。
2. 对于发布时间没有超过24小时的包，可以执行撤销发布操作，撤销命令为`npm unpublish` 包名称 --force。
3. 不建议使用`npm unpublish`操作，如果包打算废弃，建议使用npm deprecate命令进行代替，该命令并不会在npm 上撤销已经存在的包，但是会在任何人尝试安装这个包的时候，看到发布者的警告提示信息；使用方法：`npm deprecate 包名称[@版本] 提示信息`；这样一来，他人在尝试安装这个包的时候会看到包作者的提示信息。

## 可能的错误提示
### E401错误

```
pm ERR! code E401
npm ERR! 401 Unauthorized - PUT http://registry.npmjs.org/le-plugin - You must be logged in to publish packages.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/lijinwen/.npm/_logs/2020-05-27T03_52_40_487Z-debug.log
```
这是未登录的错误提示，重新执行登录即可。登录及登录成功提示，如下：

```
lddeMacBook-Pro:le-plugin lijinwen$ npm login
Username: leelele
Password: 
Email: (this IS public) jinwen_li2012@163.com
Logged in as leelele on http://registry.npmjs.org/.   //登录成功提示
```
### E402错误

```
402 Payment Required - PUT http://registry.npmjs.org/@le_bao%2fvui - You must sign up for private packages
```
这是因为包名是“@xxx/xxxx”会被npm认为要发布私包，私包需要收费，需将发布命令改成： `npm publish --access public`
### E403错误

```
执行命令npm publish报错：403 Forbidden - PUT https://registry.npmjs.org/kunmomotest2 - You cannot publish over the previously published versions: 0.0.1.
```
这是提示不能发布以前发布过的版本号，所以我们需要升版本号，修改package.json配置文件中的版本号（version），然后重新发布。

```
npm ERR! code E403
npm ERR! 403 403 Forbidden - PUT https://registry.npm.taobao.org/le-plugin - [no_perms] Private mode enable, only admin can publish this module
npm ERR! 403 In most cases, you or one of your dependencies are requesting
npm ERR! 403 a package version that is forbidden by your security policy.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/lijinwen/.npm/_logs/2020-05-27T03_50_52_679Z-debug.log
```
设置了淘宝镜像导致的报错，通过重新设置为官方镜像即可解决。设置命令`npm config set registry http://registry.npmjs.org`
### E404错误
```
npm ERR! code E404
npm ERR! 404 Not Found - PUT http://registry.npmjs.org/@le_bao%2fvui - Scope not found
npm ERR! 404 
npm ERR! 404  '@le_bao/vui@0.0.3' is not in the npm registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404 
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/lijinwen/.npm/_logs/2020-05-27T08_40_37_702Z-debug.log
```
可能是npm版本有些低，使用`npm install npm@latest -g`更新npm就好了。
### 网络问题引起的错误
可能的情况[参考](https://www.cnblogs.com/yalong/p/11495661.html)
