---
title: Win终端+WSL2 美化记录 上篇 启用毛玻璃
createdAt: 2023/03/18 19:12
updatedAt: 2023/03/18 19:12
image: /static/Article/1679135899201512031.png
description: 微软还是太狗了，这么好看的毛玻璃效果藏着掖着，今天有幸看到，就有了本篇踩坑记录
tags:
  - Windows
  - Linux
  - 踩坑日记
published: true
---

# 打开毛玻璃效果
官方文档：https://learn.microsoft.com/zh-cn/windows/terminal/custom-terminal-gallery/frosted-glass-theme

## 标签页毛玻璃
设置 --> 外观 --> 开启 Use acrylic material in the tab row (requires relaunch)

如果没有左下角打开JSON配置文件
在最外层{}内加一行
```Json
"useAcrylicInTabRow": true
```

![标签页毛玻璃配置](/static/Article/1679137804431419871.png)

## 终端毛玻璃

设置 --> 默认值 --> 其他设置 --> 外观 --> 下拉找到透明度 --> 启用亚克力不透明度调到70%

![终端毛玻璃配置](/static/Article/1679137518846721308.png)
