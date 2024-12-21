---
title: Gin 路由封装,统一返回结构体,错误处理
createdAt: 2023/08/02 14:06
updatedAt: 2023/08/02 14:16
image: https://qiu-blog.oss-cn-hangzhou.aliyuncs.com/Article/1690985751196238315.png
description: 能直接return 结果的感觉真的太棒了
tags:
  - go
  - gin
published: true
---

## 使用方法"封装"

一开始使用的方案是封装几个小方法来统一返回的结构体的
项目是字节青训营的项目,状态码就2个,所以还是挺好用的

我也习惯在`dev`模式和`debug`模式下返回`error`错误,方便定位问题~~
也喜欢用**可变参数**来封装,这样比较简洁,也好扩展多返回几个或者不返回
```go
func OK(c *gin.Context, data ...map[string]any) {
	res := gin.H{
		"status_code": statusOk,
		"status_msg":  "Success",
	}
	for d := range data {
		for k, v := range data[d] {
			res[k] = v
		}
	}
	c.JSON(http.StatusOK, res)
}

func Err(c *gin.Context, msg string, err ...error) {
	res := gin.H{
		"status_code": statusErr,
		"status_msg":  msg,
	}
	// 调试与开发模式，返回错误消息。
	if (flags.Dev || flags.Debug) && len(err) > 0 {
		errs := make([]string, len(err))
		for i, e := range err {
			if e != nil {
				errs[i] = e.Error()
			}
		}
		res["errmsg"] = errs
	}
	c.JSON(http.StatusOK, res)
}

// ErrParam 参数错误封装
func ErrParam(c *gin.Context, err ...error) {
	Err(c, "参数不正确", err...)
}

```

### 优点
- 确实简单
- 一眼就明白
### 缺点
- 每次处理错误都需要在下面加个return,不然下面的也跑了一边
- 路由方法感觉很乱,看着不舒服

## 使用装饰器封装

使用装饰器来实现统一返回体,简单好看,还方便

```go
type MyHandler func(*gin.Context) (int, any)

// decorator 装饰器
func decorator() func(h MyHandler) gin.HandlerFunc {
	return func(h MyHandler) gin.HandlerFunc {
		return func(c *gin.Context) {
			code, data := h(c)
			req := gin.H{
				"status_code": code,
				"status_msg":  "",
			}
			if code == 0 {
				//判断数据类型
				if val, ok := data.(handlers.H); ok {
					for k, v := range val {
						req[k] = v
					}
				}
				req["status_msg"] = "ok!"
				c.JSON(200, req)
			} else {
				switch data.(type) {
				case string:
					req["status_msg"] = data
				case error:
					//判断是否debug模式，是的话返回错误信息
					if flags.Dev || flags.Debug {
						req["errmsg"] = data.(error).Error()
					}
				case handlers.MyErr:
					e := data.(handlers.MyErr)
					req["status_msg"] = e.Msg
					//判断是否debug模式，是的话返回错误信息
					if flags.Dev || flags.Debug {
						errs := make([]string, 0, 10)
						for i := range e.Errs {
							errs = append(errs, e.Errs[i].Error())
						}
						req["errmsg"] = errs
					}
				}

				c.JSON(http.StatusOK, req)
			}
		}
	}
}

func newRouter(group *gin.RouterGroup, method string, path string, handler MyHandler, handlers ...gin.HandlerFunc) {
	if handler != nil {
		// 未开发的路由传nil,不挂载
		group.Handle(method, path, append(handlers, decorator()(handler))...)
	}
}
```

这是路由处理那边的,这样我遇到错误就只需要
`return Err("你没有登录")`
也可以在后面带上err错误,正确的话就直接返回
`return Ok(H{"id":666})`

简洁多了,可读性也高了

```go
func Ok(data any) (int, any) {
	return 0, data
}
func Err(msg string, errs ...error) (int, MyErr) {
	return 1, MyErr{msg, errs}
}
func ErrParam(errs ...error) (int, MyErr) {
	return 1, MyErr{"参数不正确", errs}
}
```

下面是路由挂载的使用方法
```go
router := r.Group("douyin")
tester := r.Group("douyin")
tester.Use(middleware.Test())
// 视频类接口
{
  newRouter(router, "GET", "feed/", handlers.VideoGet)                     // 获取视频流
  newRouter(router, "POST", "publish/action/", handlers.VideoAction)       // 视频投稿
  newRouter(tester, "POST", "publish/actionUrl/", handlers.VideoActionUrl) // 视频投稿(测试接口)
  newRouter(router, "GET", "publish/list/", handlers.VideoList)            // 获取发布列表
}
```
