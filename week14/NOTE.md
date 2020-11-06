学习笔记
# 手势与动画
## 1. 初步建立动画和时间线
### JavaScript处理帧的几种方式
+ setInterval: 
```
setInterval(() => {}, 16);   // 60帧
```
+ setTimeout:
```
let tick = () => {
  ...
  setTimeout(tick, 16);
}
```
+ requestAnimationFrame:
```
let tick = () => {
  requestAnimationFrame(tick);
}
```
### 动画
+ 属性动画：把一个对象的某一个属性从一个值变成另外一个值
  - constructor接受如下参数： `object, property, startValue, endValue, duration, timingFunction`
  - receive函数来改变属性

## 2. 设计时间线的更新

## 3. 给动画添加暂停和重启功能

## 4. 完善动画的其他功能

## 5. 对时间线进行状态管理
