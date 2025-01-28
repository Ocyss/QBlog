---
title: Vue3 动态设置head插件unhead介绍- 支持标题模板，meta等。vue-meta 替代品
createdAt: 2023/03/25 15:42
updatedAt: 2023/03/25 15:43
image: /static/Article/1679730194529794500.png
description: 可以算是 vue-meta 的替代品了，并且还可以在路由守卫等外部使用api，封装好了所有head相关的api，方便到极致!!
tags:
  - 前端
  - Vue3
published: true
---

> 在网上想找可以动态设置head的vue插件的时候发现了vue-meta，但是在2021就已经停更了
>
> 又在评论区发现了 unhead  这款替代品

`unhead`  直译 `无头`

插件真的是太震撼我了，基本封装好了所有`head`相关的api

而且不止限于Vue使用

## 一.安装

```bash
yarn add @unhead/vue
```

官网 https://unhead.harlanzw.com/

## 二.挂载

Vue 3

```ts
import { createHead } from '@unhead/vue'
import { createApp } from 'vue'
const app = createApp()
const head = createHead()
app.use(head)
app.mount('#app')
```

Vue 2

```ts
import { createHead, Vue2ProvideUnheadPlugin } from '@unhead/vue'
import Vue from 'vue'

const head = createHead()
Vue.use(Vue2ProvideUnheadPlugin, head)
Vue.use(head)

Vue({
  el: '#app',
})
```

## 三.使用

```ts
import { useHead } from '@unhead/vue'

const myPage = ref({ description: 'This is my page' })
const title = ref('title')
const myScript = computed(() => ({
  src: 'https://example.com/script.js',
  defer: true,
}))

useHead({
  // ref (recommended)
  title,
  // computer getter (recommended)
  meta: [{ name: 'description', content: () => myPage.value.description },],
  // computed (not recommended)
  script: [computed(() => ({
    src: 'https://example.com/script.js',
    defer: true,
  }))],
})
```

## 四.进阶玩法 (标题模板)

标题模板允许您以统一的方式呈现页面标题。

使用  `titleTemplate `  键可以为页面标题设置模板。

- 带有 , 的字符串`%s`被替换为`title`

```ts
useHead({
  titleTemplate: 'My Site - %s',
})
```

- 一个函数，它有一个可选的标题作为唯一的参数并返回一个字符串

```ts
useHead({
  titleTemplate: (title?: string) => `${title} - My Site`,
})
```

#### 使用

```ts
useHead({ title: 'My Page' })
```

这样网站标题就被渲染成了

`My Page - My Site`

#### 某个特定页面禁用模板

可以设置   `titleTemplate`   为   `null`   .

```ts
useHead({
  titleTemplate: null,
})
```

#### 默认标题

```ts
useHead({
  titleTemplate: (title?: string) => !title ? 'Default title' : `${title} - My Site`,
})
```

#### 离开页面小提示

```ts
let oldtitle: string // 记录旧标题，方便切换回来

function titleTemplate(title?: string) {
  oldtitle = title
  return `${title} - ${useConfig.value?.userInfo?.title}`
}
// 调用原生接口判断是否离开了页面
document.addEventListener('visibilitychange', () => {
  const state = document.visibilityState
  if (state === 'visible') {
    useHead({ title: oldtitle, titleTemplate })
  }
  else if (state === 'hidden') {
    useHead({ title: '啊💔怎么离开了呢💔怎么会?怎么会呢!', titleTemplate: null })
  }
})

useHead({
  titleTemplate,
})
```
