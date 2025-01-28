---
title: Win终端+WSL2 美化记录 下篇 wsl终端美化+静态ip
createdAt: 2023/03/24 02:53
updatedAt: 2023/03/24 02:53
image: /static/Article/1679624474390073838.png
description: 简单的更换下终端，并且固定ip，方便和宿主机沟通
tags:
  - Windows
  - Linux
  - 踩坑日记
published: true
---

# 一.更换终端

Linux 系统中有很多 `shell`，比如 `bash`、`sh`、`zsh` 等，虽然存在很多不同的 `shell`，`bash` 却是最常见或许也是最主流的。

而 `zsh(Z shell)` 是 bash 的一个替代品，他对于 bash 有了很多的优化，无论是使用命令，外观，体验，能够让用户更方便顺畅的使用 `Terminal` 。

### 1.安装 Zsh 终端

```sh
sudo apt update`
sudo apt install git zsh -y
```

在安装 `oh-my-zsh` 可以更方便的管理 zsh 的配置，和安装插件等

```sh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

`wsl --shutdown`
输入命令重启 WSL 就能发现终端已经更换成功了

### 2.安装 `powerlevel10k` 主题

这里使用 gitee.com 上的官方镜像加速下载

```sh
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k
```

然后修改 `~/.zshrc`
将 `ZSH_THEME="powerlevel10k/powerlevel10k"`

然后重启 wsl 就会有向导，一步一步的指引你个性化的配置终端，如果没有对应字体，可以下载下面几个

[MesloLGS NF Regular.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf)
[MesloLGS NF Bold.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf)
[MesloLGS NF Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf)
[MesloLGS NF Bold Italic.ttf](https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf)

字体在 WIndows 系统上安装好，然后在终端配置里面更改 wsl 的字体

![](/static/Article/1679625801518824630.png)

# 二.配置网络
大部分参考CSDN [wsl2设置静态ip（固定ip）static ip - littlebird4](https://blog.csdn.net/littlebird4/article/details/126024621)

但启动脚本因为我们换了终端,所以文件也需要换
`~/.bashrc` 改成 `~/.zshrc`

然后可以修改两边的hosts，就不用记那么长的ip了
Windows的在 `C:\Windows\System32\drivers\etc\hosts`
在里面加一行 `172.22.0.2 wsl`
这样直接`ping wsl`就能ping通了

WSL的在 `/etc/hosts`
在里面加一行 `172.22.0.1 win`
这样直接`ping win`就能ping通了

![](/static/Article/1679626392096498086.png)
