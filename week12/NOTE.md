# 学习笔记

## proxy与双向绑定
### proxy的基本用法
+ The Proxy object enables you to create a proxy for another object, which can intercept and redefine fundamental operations for that object. https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
+ A Proxy is created with two parameters:
  1. target: the original object which you want to proxy
  2. handler: an object that defines which operations will be intercepted and how to redefine intercepted operations
+ 如果有一个对象，我们既想要去让它设置起来，有想要能被监听，我们用proxy把这个object做一层包裹
### 模仿reactive实现原理
+ 变量callbacks存储所有callbacks，格式：key -> object, value -> { key -> prop, value -> [callbacks] }
+ `reactive()`函数来将普通object包装成Proxy，可以改写set、get等
+ 在`effect()`函数中将callback存入callbacks中
+ 为实现多层的object，我们引入reactivities变量，格式：key -> object, value -> 对应的Proxy
### reactivity响应式对象
+ 双向绑定
  1. 数据到DOM元素： 使用effect函数，比如
  ```
  effect(() => {
      document.getElementById("r").value = po.r;
  })
  ```  
  2. DOM元素到数据：DOM本身的监听操作，比如
  ```
  document.getElementById("r").addEventListener('input', event => po.r = event.target.value);
  ```
  
## 使用Range实现DOM精确操作
### 基本拖拽
1. drag我们是有对应的dragdrop事件， 但是我们希望跟随鼠标进行移动，我们用mousedown、mousemove、mouseup来模拟
2. 在mousedown里面监听mousemove和mouseup事件，只有我们鼠标按下去之后监听，才能在性能上和逻辑上正确。 如果mousemove在mousedown之外，那么只要鼠标移动，这个事件就触发了，即使用flag标记在mousedown没有发生的情况下也不触发mousemove，对性能也有一定影响。
3. mousemove和mouseup是在document上监听，如果在draggable上监听，鼠标移动过快，可能会发生拖断现象。
### 正常流里的拖拽
1. “文字” 里面没有分节点，所以只能通过Range找到能拖拽的空位。
2. 我们用一个变量存储所有的ranges。在mousemove的时候找到最近的range，插入draggable的元素
