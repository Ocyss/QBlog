---
title: 解决Fcitx5输入法打字过快漏字母的bug
createdAt: 2023/07/24 09:17
updatedAt: 2023/07/26 06:50
image: https://qiu-blog.oss-cn-hangzhou.aliyuncs.com/Article/1690189274062927708.png
description: 在使用edge浏览器，打开一快就漏一堆字母
tags:
  - Linux
  - Arch
  - 记录
published: true
---

> 2023-07-26 14:45:58
> 解决了，我是傻B

## 1.检查环境变量
使用命令生成一个`md文档`,推荐使用管道符输出到文件，用vim什么查看会方便，有md阅读器更好
```bash
fcitx5-diagnose
# fcitx5-diagnose > fcitx5-log.md
```
他还会告诉你是否有依赖没安装什么的。

## 2.配置环境变量

```bash
echo 'export LANG="zh_CN.UTF-8"
export QT_IM_MODULE=fcitx
export GTK_IM_MODULE=fcitx
export XMODIFIERS="@im=fcitx"' >> /etc/profile
```
> 我配置了，也检查了，但还是漏字母~

> 2023-07-26 14:44:56
> 一定要修改系统级别的环境变量！！
> 我是傻B：不知道哪复制的，GTK_IM_MODLE=fcitx ，少个U，导致我花这么多天，最好厚着脸皮去arch论坛问，然后给依云姐看笑话
>
## 3.Fcitx5 配置
**关闭`在程序中显示预处理文本`**
![](https://qiu-blog.oss-cn-hangzhou.aliyuncs.com/Article/1690189955904023044.png)

> 好吧，对我依旧无用

## 4.更新gtk缓存

找解决方法的时候看到的，说可能是缓存没刷新？就是试了试

```bash
sudo gtk-query-immodules-3.0 --update-cache
sudo gtk-query-immodules-2.0 --update-cache
sudo gtk-query-immodules-3.0-32 --update-cache # 可能没有,最后查看下命令，全部更新下缓存
```

> 一开始在必应搜索框打字，发现频率少了。。以为解决了，就水个博文记录下,然后打这个博文，人傻了，漏了50+次
> 现在在去研究，你们可以先试试上面方法

> 2023-07-26 14:46:07
> 其实就是环境变量没配置好，一开始我只配置的用户的~/.xprofile，然后diagnose输出没有问题，那次配置的绝对没问题。然后找解决方法，对/etc/profile，environment也进行的修改，也是复制别人的。。。然后也没检查diagnose输出。。。
> 所以导致后续一直找不到问题

# 总结

还是配置系统目录的
`/etc/profile` 或者 `/etc/environment`
靠谱，因为我使用的bspwm，fcitx运行的用户不一定是本机用户，导致变量有问题，diagnose也检测不出来

所以 问题的根源就是环境变量的配置
