# System and Packages
Ubuntu 20.04.1 LTS
node   15.4.0
npm    7.0.15

# 简单了解Node.js的流
https://nodejs.org/api/stream.html  

https://nodejs.org/api/stream.html#stream_class_stream_readable  
  - Event: 'data'
  - Event: 'end'
  - readable.pipe(destination[, options]) 
  
https://nodejs.org/api/stream.html#stream_class_stream_writable  
  - writable.write(chunk[, encoding][, callback])
  - writable.end([chunk[, encoding]][, callback])

# 实现一个发布系统
## 简单发送
- publish-server：向真实的server copy自己的文件a
- publish-tool：向publish server发送我们想要发布的文件

流程（流式传输）： publish-tool发送request(需要更改的文件)到虚拟机上的publish-server -> publish-server接收request并将文件copy到server上

对于虚拟机，注意Port Forwarding配置好端口匹配

## 多文件上传
archiver进行压缩， unzipper进行解压



