## 浏览器工作原理
浏览器的基础工作流程：URL (HTTP)-> HTML (parse)-> DOM (css computing)-> DOM with CSS (layout)-> DOM with position (render)-> Bitmap

## 有限状态机
1. 最大特点：每个状态都是一个机器，每个机器都是互相解耦，每个机器都知道下一个状态
2. Moore 和 Mealy
3. 学习了使用状态机来实现查询字符串(Re-consume)
+ 从简单的例子到复杂例子，从不使用状态机到使用状态机，循序渐进，理解使用状态机对代码扩展、维护的帮助。

## HTTP请求 
1. TCP 和 IP 的基础知识

| TCP            | IP             |
| :----:   | :----:   |
| 流             | 包              |
| 端口            | IP地址          |
| require('net') | libnet/libpcap |

2. HTTP
+ 根据request 和 response 的定义进行逐步解析
- Request: headers中`Content-Type`是一个必要字段，要有默认值，不同的`Content-Type`影响body的格式
- Send函数: 异步，返回Promise; 收到数据传给parser; 根据parser状态resolve Promise
- Response: ResponseParser分段处理Response， 我们用状态机来分析文本的结构；对于body，由于body根据`Content-Type`有不同的结构，我们在解析到`Content-Type`后创建BodyParser来解决问题（对于ThunkedBodyParser，我们也使用状态机来分析）

