---
title: 搭建npm私服
tags: 
  - npm
  - 私服
date: 2020-09-24
author: 断风尘
location: 昆明
summary: 对于后端开发来说，当某些功能在多个项目中重复出现时，为了避免每次都写重复性的代码或者多次拷贝以及为了便于后期的维护，会将此类功能进行提取，打包成jar包，并发布到maven私服进行版本的管理。对前端项目来说，我们同样可以这么做，不过不是发布到maven私服，而是发布到npm私服，以组件或组件库的方式进行维护。那么，首先我们就的搭建一套属于自己公司的私服，本文就带你一起开启npm私服的搭建。
---
对于后端开发来说，当某些功能在多个项目中重复出现时，为了避免每次都写重复性的代码或者多次拷贝以及为了便于后期的维护，会将此类功能进行提取，打包成jar包，并发布到maven私服进行版本的管理。对前端项目来说，我们同样可以这么做，不过不是发布到maven私服，而是发布到npm私服，以组件或组件库的方式进行维护。那么，首先我们就的搭建一套属于自己公司的私服，本文就带你一起开启npm私服的搭建。
# 采用verdaccio搭建npm私服

> 本文基于Mac Os下的操作结果，Windows系统下的操作可以有所差异。

首先确保已经安装node.js，并已配置npm。可以使用node -v 和 npm -v命令查看，正常返回版本号

## 安装verdaccio

命令行执行`npm install -g verdaccio`

如果出现权限问题可以使用`sudo npm install -g verdaccio`

> <b>什么是verdaccio?</b>
>
> Verdaccio 是一个 Node.js创建的轻量的私有npm proxy registry
>  它forked于sinopia@1.4.0并且100% 向后兼容。
>  Verdaccio 表示意大利中世纪晚期fresco 绘画中流行的一种绿色的意思。
>  sinopia是最初的搭建私有npm的选择，不过已经好多年不维护了，而verdaccio则是从sinopia衍生出来并且一直在维护中的，所以现在看来，verdaccio是一个更好的选择。

## 查看verdaccio

输入verdaccio回车，显示如下信息：

```
lddeMacBook-Pro:verdaccio lijinwen$ verdaccio
warn --- config file - /Users/lijinwen/.config/verdaccio/config.yaml
warn --- Verdaccio started
warn --- Plugin successfully loaded: verdaccio-htpasswd
warn --- Plugin successfully loaded: verdaccio-audit
warn --- http address - http://192.168.2.111:4873/ - verdaccio/4.6.2
fatal--- cannot create server: listen EADDRINUSE: address already in use 192.168.2.111:4873
```

- config file：配置文件，可在其中配置组件库地址、监听的IP和端口以及配置最大文件包限制等配置项。
- http address：仓库地址，在浏览器打开即可，如果还没有在配置文件中配置，那么默认http://localhost:4873/

配置文件实例：

```bash
#
# This is the default config file. It allows all users to do anything,
# so don't use it on production systems.
#
# Look here for more config file examples:
# https://github.com/verdaccio/verdaccio/tree/master/conf
#

# path to a directory with all packages
# 所有包的缓存目录
storage: /carlea/verdaccio/storage
# path to a directory with plugins to include
# 插件目录
plugins: ./plugins

web:
  # 管理后台网站标题
  title: 开利软件
  # comment out to disable gravatar support
  # gravatar: false
  # by default packages are ordercer ascendant (asc|desc)
  # sort_packages: asc
  # convert your UI to the dark side
  # darkMode: true

# translate your registry, api i18n not available yet
# i18n:
# list of the available translations https://github.com/verdaccio/ui/tree/master/i18n/translations
#   web: en-US

# 验证信息
auth:
  htpasswd:
    # 用户信息存储目录
    file: ./htpasswd
    # Maximum amount of users allowed to register, defaults to "+inf".
    # You can set this to -1 to disable registration.
    # max_users: 1000

# a list of other known repositories we can talk to
# 共有仓库配置
uplinks:
  npmjs:
    # 由于国内网络的问题，此处可以设置为国内的镜像，例如：https://registry.npm.taobao.org/，以下设置为官方镜像。
    url: https://registry.npmjs.org/

    packages:
  '@*/*':
    # scoped packages
    access: $all
    publish: $authenticated
    unpublish: $authenticated
    # 代理 表示没有的仓库回去这个npmjs里面找
    # npmjs 指向https://registry.npmjs.org/，就是上面的uplinks配置
    proxy: npmjs

  '**':
    # allow all users (including non-authenticated users) to read and
    # publish all packages
    #
    # you can specify usernames/groupnames (depending on your auth plugin)
    # and three keywords: "$all", "$anonymous", "$authenticated"
    # 三种身份，所有人、匿名用户、认证（登录）用户，关键字：$all、$anonymous、$authenticated
    
    # 是否可以访问所需要的权限
    access: $all

    # allow all known users to publish/publish packages
    # (anyone can register by default, remember?)
    # 发布package的权限
    publish: $authenticated
    # 删除package的权限
    unpublish: $authenticated

    # if package is not available locally, proxy requests to 'npmjs' registry
    # 如果package不存在，就向代理的上游服务发起请求
    proxy: npmjs

# You can specify HTTP/1.1 server keep alive timeout in seconds for incoming connections.
# A value of 0 makes the http server behave similarly to Node.js versions prior to 8.0.0, which did not have a keep-alive timeout.
# WORKAROUND: Through given configuration you can workaround following issue https://github.com/verdaccio/verdaccio/issues/301. Set to 0 in case 60 is not enough.
server:
  keepAliveTimeout: 60

# 中间件
middlewares:
  # 审计
  audit:
    enabled: true

# log settings
logs:
  - { type: stdout, format: pretty, level: http }
  #- {type: file, path: verdaccio.log, level: info}
listen: 192.168.2.111:4873 # 监听IP和端口
max_body_size: 520mb # 设置最大包体积
#experiments:
#  # support for npm token command
#  token: false

# This affect the web and api (not developed yet)
#i18n:
#web: en-US
```

## 安装nrm

命令行执行`npm install -g nrm`

如果出现权限问题可以使用`sudo npm install -g nrm`

查看是否安装成功nrm -V，显示版本号

```
nrm -V
1.2.1
```

> #### 什么是nrm呢？
>
> nrm是npm的镜像源管理工具，有时候国外资源太慢，使用这个就可以快速地在 npm 源间切换。
>  首先全局安装`nrm`：`npm install -g nrm`
>  由于上面是我们自己建立的npm 私有仓库，所以我们得添加一个自己的npm 镜像源，添加方式：
>  `nrm add  http://IP:4873`。add 接收两个变量，分别为`<name>`镜像源名称和`<url>`镜像源url地址，那么如何查看有哪些镜像源呢，请继续浏览下文。

## 安装yarn（非必须）

命令行执行：`npm install -g yarn`

如果出现权限问题可以使用`sudo npm install -g yarn`

查看是否安装成功`yarn -v`，显示版本号。

```
yarn -v
1.22.4
```

> <b>什么是yarn</b>
>
> yarn是facebook发布的一款取代npm的包管理工具。
>
> yarn的特点：
> - 速度超快。
> - Yarn 缓存了每个下载过的包，所以再次使用时无需重复下载。 同时利用并行下载以最大化资源利用率，因此安装速度更快。
> - 超级安全。
>   在执行代码之前，Yarn 会通过算法校验每个安装包的完整性。
> - 超级可靠。
>   使用详细、简洁的锁文件格式和明确的安装算法，Yarn 能够保证在不同系统上无差异的工作。

## nrm添加源

1. 添加

```
nrm add name url
eg：nrm add npm https://registry.npmjs.org/
```

2. 查看源列表`nrm ls`

3. 通常添加如下源：

> npm --- https://registry.npmjs.org/
> npm --- https://registry.npm.taobao.org/
> yarn --- https://registry.yarnpkg.com/
> yarn --- https://registry.npm.taobao.org/
> cnpm --- https://r.cnpmjs.org/
> taobao --- https://registry.npm.taobao.org/
> nj --- https://registry.nodejitsu.com/
> rednpm --- https://registry.mirror.cqupt.edu.cn/
> npmMirror --- https://skimdb.npmjs.com/registry/
> deunpm --- http://registry.enpmjs.org/
> local ------ http://192.168.2.111:4873/

注：Local为私服。

## 切换到私服下：

npm config set registry http://192.168.2.111:4873/

### 切换到淘宝源

npm config set registry https://registry.npm.taobao.org/

查看当前镜像地址：

```
npm config get registry //获取镜像地址
```
### 添加账号及登录

- 添加账号`npm adduser --registry=http://IP:4873`
- 使用npm whoami验证自己是不是已经登录了npm，如果已经登录会返回当前的登陆账号名称。
- 登录`npm login`，回车后输入账号、密码及邮箱。

## 如何启动verdaccio

### 安装pm2守护进程工具

命令行执行`npm install -g pm2`

如果出现权限问题可以使用`sudo npm install -g pm2`

### 启动

然后使用命令 `pm2 start verdaccio`，但是 , 在windows系统下这样是启动不了的，因为在windows系统下verdaccio.cmd它不是有效的，您必须直接运行Node.js命令。<b>所以我们应该修改启动命令为`pm2 start C:\Users\Administrator\AppData\Roaming\npm\node_modules\verdaccio\bin\verdaccio --name verdaccio`</b>。这样就可以正常启动了。

### pm2简述及常用命令

#### 简述

pm2是一个进程管理工具,可以用它来管理你的node进程，并查看node进程的状态，当然也支持性能监控，进程守护，负载均衡等功能

#### 命令

1、 pm2需要全局安装
 `npm install -g pm2`
 2、进入项目根目录

> 2.1. 启动进程/应用           `pm2 start bin/www 或 pm2 start app.js`

> 2.2 重命名进程/应用           `pm2 start app.js --name wb123`

> 2.3 添加进程/应用 watch         `pm2 start bin/www --watch`

> 2.4 结束进程/应用            `pm2 stop www`

> 2.5 结束所有进程/应用           `pm2 stop all`

> 2.6 删除进程/应用            `pm2 delete www`

> 2.7 删除所有进程/应用             `pm2 delete all`

> 2.8 列出所有进程/应用          `pm2 list`

> 2.9 查看某个进程/应用具体情况      `pm2 describe www`

> 2.10 查看进程/应用的资源消耗情况       `pm2 monit`

> 2.11 查看pm2的日志                 `pm2 logs`

> 2.12 若要查看某个进程/应用的日志,使用  `pm2 logs www`

> 2.13 重新启动进程/应用            `pm2 restart www`

> 2.14 重新启动所有进程/应用        `pm2 restart all`