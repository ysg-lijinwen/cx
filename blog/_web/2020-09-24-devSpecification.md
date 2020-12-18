---
title: Web端开发规范-初稿
tags: 
  - 开发规范
  - Web
date: 2020-09-24
author: 断风尘
location: 昆明
summary: 规范的目的是为了提高效率，包括沟通效率，理解效率和开发效率。
---

规范的目的是为了提高效率，包括沟通效率，理解效率和开发效率。

- 好的编码规范bai可以尽可能的减少一个软件的维护成本, 并且几乎没有任何一个软件，在其整个生命周期中，均由最初的开发人员来维护；
- 好的编码规范可以改善软件的可读性，可以让开发人员尽快而彻底地理解新的代码；
- 好的编码规范可以最大限度的提高团队开发的合作效率；
- 长期的规范性编码还可以让开发人员养成好的编码习惯，甚至锻炼出更加严谨的思维。

## 强制

### 命名

### 命名总结

1、采用`kebab-case`命名的：

- 文件夹，示例：`components下的todo-list组件目录`

- 组件文件名

  ```
  //components/todo-list/todo-list.vue
  <script>
  export default {
    name: 'TodoList',//组件的name属性
  }
  </script>
  ```

- 组件在html模板中使用

  ```
  <template>
    <div>
       <todo-list></todo-list>
    </div>
  </template>
  <script>
  import todoList from '@/components/todo-list/todo-list.vue'
  export default {
  		components: {
  			todoList
  		},
  }
  </script>
  ```

- 在模板中prop传入属性到子组件（`<my-componnet set-text="hello"/>`）

- 所有事件名（`this.$emit('api-reload')`）

2、采用`PascalCase`命名：

- 组件的name属性（`name: 'TodoList'`）
- 根组件，其实只是一个单词，就用默认的App.vue，无需改为app.vue

3、采用`camelCase` 命名：

- 子组件接收prop属性

  ```
  props: {
      setText: String
  }
  ```

- 所有变量命名`let userName = 'zhangsan'`

- js中components注册组件时`import todoList from '@/components/todo-list/todo-list.vue'`

- js中的方法名称。关于方法名称，可使用单词和数字的组合，但是数字必须是放在两个词之间的。例如，2代表to，4代表for。

### 组件数据

1. 组件的 data 必须是一个函数。
2. 当在组件中使用 data 属性的时候 (除了 new Vue 外的任何地方)，它的值必须是返回一个对象的函数。

正例：

```
// In a .vue file
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
// 在一个 Vue 的根实例上直接使用对象是可以的，
// 因为只存在一个这样的实例。
new Vue({
  data: {
    foo: 'bar'
  }
})
```

反例：

```
export default {
  data: {
    foo: 'bar'
  }
}
```

### 组件通讯

组件通许遵循以下规则：

1. 父组件通过props向子组件传递数据；
2. 子组件通过事件（$emit）向父组件通信
3. 当遇到 props 和 events 难以实现的功能时，通过 this.$refs 来实现
4. 当需要操作 DOM 无法通过指令来做的时候可使用 this..$ref 而不是 JQuery , document.getElement* , document.queryElement

### Prop定义

prop 的定义应该尽量详细，必须指定其类型，最好提供默认值。

正例：

```
props: {
  orderStatus: String
}
// 更好的做法！
props: {
  orderStatus: {
    type: String,
    required: true,
    validator: function (value) {
      return [
        'syncing',
        'synced',
        'version-conflict',
        'error'
      ].indexOf(value) !== -1
    }
  }
}
```

反例：

```
// 这样做只有开发原型系统时可以接受
props: ['orderStatus']
```

### 组件样式选择器

通过使用 BEM 约定规范命名来设置作用域，以组件名称第一个单词开头，多个单词之间用中横线（-）分割，单词均为小写字母。

示例：

```
	.todo-list-item {
		font-size: 32rpx;
		position: relative;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 30rpx;
	}
```

对于某个选择器，当我们需要在特殊条件下表现出不一样的样式，那么可以通过双中横线（--）链接选择器名与条件描述单词。

示例：

```
	.todo-list-item--disabled {
		opacity: 0.3;
	}

	.todo-list-item--hover {
		background-color: #f1f1f1;
	}
```

要体现嵌套层级，可使用“外层选择器名称__子层描述”来命名子层选择器。

示例：

```
	.todo-list-item__content {
		display: flex;
		flex: 1;
		overflow: hidden;
		flex-direction: column;
		color: #3b4144;
	}
	
	.todo-list-item__content-title {
		font-size: 28rpx;
		color: #3b4144;
		overflow: hidden;
	}
```

### 代码检测

使用eslint

### 其它

#### 为v-for设置键值

> 总是用 key 配合 v-for。
> 在组件上_总是_必须用 key 配合 v-for，以便维护内部组件及其子树的状态。甚至在元素上维护可预测的行为，比如动画中的对象固化 (object constancy)，也是一种好的做法。

正例：

```
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```

反例：

```
<ul>
  <li v-for="todo in todos">
    {{ todo.text }}
  </li>
</ul>
```

#### 避免 v-if 和 v-for 用在一起

> 永远不要把 v-if 和 v-for 同时用在同一个元素上。
> 一般我们在两种常见的情况下会倾向于这样做：
>
> - 为了过滤一个列表中的项目 (比如 v-for="user in users" v-if="user.isActive")。在这种情形下，请将 users 替换为一个计算属性 (比如 activeUsers)，让其返回过滤后的列表。
> - 为了避免渲染本应该被隐藏的列表 (比如 v-for="user in users" v-if="shouldShowUsers")。这种情形下，请将 v-if 移动至容器元素上 (比如 ul, ol)。

正例：

```
<ul v-if="shouldShowUsers">
  <li
    v-for="user in users"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

反例：

```
<ul>
  <li
    v-for="user in users"
    v-if="shouldShowUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

## 强烈建议

### 组件文件

只要有能够拼接文件的构建系统，就把每个组件单独分成文件，即每一个组件文件中的功能尽可能单一。
当你需要编辑一个组件或查阅一个组件的用法时，可以更快速的找到它。

正例：

```
//目录components/layout下两个组件文件
aside.vue和aside-menu.vue
```

反例：

```
//一个js文件中定义两个组件
Vue.component('aside', {
  // ...
})

Vue.component('aside-menu', {
  // ...
})
```

### 基础组件

应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) 应该全部以一个特定的前缀开头。在这里我们约定使用`cl-`开头。

正例：

```
components/
|- cl-button.vue
|- cl-table.vue
|- cl-icon.vue
```

反例：

```
components/
|- MyButton.vue
|- my-table.vue
|- vue-icon.vue
```

### 单例组件名

只应该拥有单个活跃实例的组件应该以 the 前缀命名，以示其唯一性。
这不意味着组件只可用于一个单页面，而是每个页面只使用一次。这些组件永远不接受任何 prop，因为它们是为当前应用某个业务定制的，而不是它们在你的应用中的上下文。如果发现有必要添加 prop，那就表明这实际上是一个可复用的组件，只是目前在每个页面里只使用一次。

正例：

```
components/
|- the-heading.vue
|- the-sidebar.vue
```

反例：

```
components/
|- heading.vue
|- my-sidebar.vue
```

### 紧密耦合的组件名

和父组件紧密耦合的子组件应该以父组件名作为前缀命名。
如果一个组件只在某个父组件的场景下有意义，这层关系应该体现在其名字上。因为编辑器通常会按字母顺序组织文件，所以这样做可以把相关联的文件排在一起。其实，类似的组件群，应该使用单独的目录维护起来。

正例：

```
components/todo-list
|- todo-list.vue
|- todo-list-item.vue
|- todo-list-item-button.vue
components/search-sidebar
|- search-sidebar.vue
|- search-sidebar-navigation.vue
```

反例：

```
components/
|- todo-list.vue
|- my-item.vue
|- item-button.vue
|- SearchSidebar.vue
|- NavigationForSearchSidebar.vue
```

### 组件名中的单词顺序

- 组件名应该以高级别的 (通常是一般化描述的) 单词开头，以描述性的修饰词(动词)结尾。

- 如果是基础组件则必须以`cl-`开头，再按上一条规则。

- 推荐组合：业务名称+{控件名+}特定功能描述，例如，搜索组件的确定按钮`search-button-sure.vue`

### 模板中简单的表达式

组件模板应该只包含简单的表达式，复杂的表达式则应该重构为计算属性或方法。
复杂表达式会让你的模板变得不那么声明式。我们应该尽量描述应该出现的是什么，而非如何计算那个值。而且计算属性和方法使得代码可以重用。

正例：

```
<!-- 在模板中 -->
{{ normalizedFullName }}
// 复杂表达式已经移入一个计算属性
computed: {
  normalizedFullName: function () {
    return this.fullName.split(' ').map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    }).join(' ')
  }
}
```

反例：

```
//直接在模版中写复杂的表达式
{{
  fullName.split(' ').map(function (word) {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```

### 简单的计算属性

复杂的计算应该被拆分为多个简单的计算。

正例：

```
//价格计算
computed: {
  //基础价格
  basePrice: function () {
    return this.manufactureCost / (1 - this.profitMargin)
  },
  //折扣
  discount: function () {
    return this.basePrice * (this.discountPercent || 0)
  },
  //最终价格
  finalPrice: function () {
    return this.basePrice - this.discount
  }
}
```

反例：

```
computed: {
  price: function () {
    var basePrice = this.manufactureCost / (1 - this.profitMargin)
    return (
      basePrice - basePrice * (this.discountPercent || 0)
    )
  }
}
```

### 指令缩写

都用指令缩写 (用 : 表示 v-bind: 和用 @ 表示 v-on:)

正例：

```
<input
  @input="onInput"
  @focus="onFocus"
>
```

反例：

```
<input
  v-bind:value="newTodoText"
  :placeholder="newTodoInstructions"
>
```

### 单文件组件的顶级元素的顺序

单文件组件应该总是让`<script>`、`<template>` 和 `<style>` 标签的顺序保持一致。且 `<style>` 要放在最后，因为另外两个标签至少要有一个。

示例：

```
<!-- ComponentA.vue -->
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

### 关于全局状态管理

优先使用Vuex管理全局状态。

### 网络请求loading封装

- 统一管理请求的loading提示，避免一个页面多个请求同时执行时，多次提示loading，造成页面闪烁，影响用户体验。

  示例：

  ```
  //utils/global-loading.js
  import { Loading } from 'element-ui';
  
  let loadingInstance;
  // 声明一个对象用于存储请求个数
  var globalLoadingRequestCount = 0;
  
  function startLoading(text = '加载中,请稍等') {
    loadingInstance = Loading.service({
      lock: true,
      text: text,
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
  }
  
  var GlobalLoading = {
  
    showGlobalLoading: (text) => {
      if (globalLoadingRequestCount === 0) {
        text ? startLoading(text) : startLoading();
      }
      globalLoadingRequestCount++;
    },
  
    hideGlobalLoading: () => {
      if (globalLoadingRequestCount <= 0) return;
      globalLoadingRequestCount--;
      if (globalLoadingRequestCount === 0) {
        loadingInstance.close();
      }
    }
  }
  
  export default GlobalLoading
  ```

  调用时：

  ```
  import globalLoading from "../utils/global-loading";
  
  //显示
  globalLoading.showGlobalLoading();
  或
  globalLoading.showGlobalLoading("自定义提示文字");
  
  //隐藏
  globalLoading.hideGlobalLoading();
  ```

- 建议设置根据情况是否开启(默认关闭)请求加载中的loading，该功能需要设置一个时间(默认800ms)，如果超过此时间，请求尚未返回，则显示一个loading，直至返回后，取消loading。

  > 说明：请求loading超时时间的意义为，一般情况下，请求会在几十毫秒返回，时间极短，无需loading，如果显示loading，会导致 动画一闪而过，体验不好。如果用户网络慢，或者服务器堵塞，可能一个请求需要几秒钟，这时请求达到设定时间(800ms)， 就会显示loading，几秒钟后请求返回，loading消失。

### 预处理语言

优先使用stylus

### UI框架选择

优先使用element-ui

### 文件格式

使用UTF-8

## 谨慎

### 没有在 v-if/v-if-else/v-else 中使用 key

如果一组 v-if + v-else 的元素类型相同，最好使用 `key` (比如两个 `<div>` 元素)。

正例：


```
<div
  v-if="error"
  key="search-status"
>
  错误：{{ error }}
</div>
<div
  v-else
  key="search-results"
>
  {{ results }}
</div>
```

反例：

```
<div v-if="error">
  错误：{{ error }}
</div>
<div v-else>
  {{ results }}
</div>
```

### scoped 中的元素选择器

元素选择器应该避免在 scoped 中出现。
在 scoped 样式中，类选择器比元素选择器更好，因为大量使用元素选择器是很慢的。

正例：

```
<template>
  <button class="btn btn-close">X</button>
</template>
<style scoped>
.btn-close {
  background-color: red;
}
</style>
```

反例：

```
<template>
  <button>X</button>
</template>
<style scoped>
button {
  background-color: red;
}
</style>
```

### 隐性的父子组件通信

应该优先通过 prop 和事件进行父子组件之间的通信，而不是 this.$parent 或改变 prop。其实在前面已经对通信的使用有做过描述。

正例：

```
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  template: `
    <input
      :value="todo.text"
      @input="$emit('input', $event.target.value)"
    >
  `
})
```

反例：

```
Vue.component('TodoItem', {
  props: {
    todo: {
      type: Object,
      required: true
    }
  },
  methods: {
    removeTodo () {
      var vm = this
      vm.$parent.todos = vm.$parent.todos.filter(function (todo) {
        return todo.id !== vm.todo.id
      })
    }
  },
  template: `
    <span>
      {{ todo.text }}
      <button @click="removeTodo">
        X
      </button>
    </span>
  `
})
```

## 禁止

除非个别特殊情况，否则严禁使用汉语拼音进行命名。

## 建议编译器

推荐使用vs code进行前端编码。