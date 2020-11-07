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
+ Timeline对象来操作、添加animation
## 2. 设计时间线的更新
+ Timeline add函数添加startTime参数，来表示animation的start时间
+ Timeline start的时候与animation的startTime比较，来处理动画之前添加的动画和运行时添加的动画
## 3. 给动画添加暂停和重启功能
### 暂停
```
    pause() {
        // 记录pause起始时间, (目前多次按pause键会不停重置PAUSE_START，需要处理这个问题)
        this[PAUSE_START] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
```
### 重启
```
    resume() {
        // 记录PAUSE时长，(目前resume键不能在pause键前先按)
        this[PAUSE_TIME] += Date.now() - this[PAUSE_START];
        this[TICK]();
    }
```
在tick()中需要调整`t`
```
    ...
    if(this[START_TIME].get(animation) < startTime)
        t = now - startTime - this[PAUSE_TIME];  // 引入pause，需要减去PAUSE_TIME
    else // 运行过程中可以添加动画
        t = now - this[START_TIME].get(animation) - this[PAUSE_TIME];
    ...
```
## 4. 完善动画的其他功能

## 5. 对时间线进行状态管理
