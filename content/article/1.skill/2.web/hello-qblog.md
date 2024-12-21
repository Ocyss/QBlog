---
title: 基于Nuxt3重写的全新博客正式使用了!
createdAt: 2024/12/21 16:10
updatedAt: 2024/12/21 16:10
published: true
image: https://qiu-blog.oss-cn-hangzhou.aliyuncs.com/Article/ad5f6910-bebc-43e3-a7a7-5ec736e1ca62.png
tags:
  - nuxt
---

## 项目技术栈

下面是精简过的`package.json`，其中有很多测试版的库, 暂不推荐其他人使用


```json [package.json]
{  
  "dependencies": {
    "@nuxt/content": "3.0.0-alpha.8",
    "@nuxt/ui": "3.0.0-alpha.10",
    "lenis": "^1.1.18",
    "nuxt": "^3.14.1592",
    "tailwindcss": "4.0.0-beta.6",
  },
  "devDependencies": {
    "@antfu/eslint-config": "^3.11.2",
    "@tailwindcss/typography": "0.5.15",
    "typescript": "^5.7.2",
  }
}
```

## 可视化编辑器

使用和`Nuxt Content@3`集成的`Nuxt Studio`

可能没配置好，导致可视化编辑的时候页面样式丢失

好像也没图片粘贴自动上传等操作

![nuxt.studio](https://qiu-blog.oss-cn-hangzhou.aliyuncs.com/Article/ad5f6910-bebc-43e3-a7a7-5ec736e1ca62.png)

## 最后

之前的博客太懒了没怎么维护和更新，并且还有一堆问题几个月之前就停更了，一直打算使用`nuxt`重写一个尝试0后端，终于使用`Cursor`3-4天的时间重写完成

后续会不断优化和打磨，并开发个配套的浏览器插件

