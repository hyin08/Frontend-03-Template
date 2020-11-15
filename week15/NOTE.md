# 手势与动画
## 手势的基本知识
流程图
![手势流程图](./images/手势流程图.png)

## 实现鼠标操作
对于鼠标有如下操作：`mousedown, mousemove, mouseup`  
对于gesture有如下对应操作：`touchstart, touchmove, touchend, touchcancel`  
我们对鼠标和gesture进行统一的抽象`start(), move(), end(), cancel()`

## 实现手势的逻辑
根据上面流程图实现`pan, tap, press`手势的区分  
+ press: start()中0.5s的setTimeout触发pressstart, end()触发pressend
+ tap: end()触发tap
+ pan: move()中位移10px触发panstart，之后pan，end()触发panend

## 处理鼠标事件
之前我们只是全局存tap,pan,press状态, 这里我们需要加入context，将这些状态存在context上，来区分事件
