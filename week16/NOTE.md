# 轮播组件
## 手势动画应用
1. 在之前的`carousel`中使用`gesture`库
2. 使用`pan`事件来拖拽
3. 使用`timeline`来实现轮播， 往timeline加animation， 替换掉setTimeout
4. 在`gesture`中加上start事件，在carousel里用来pause timeline（在用户点击图片的时候，我们需要暂停轮播），这时会引入这些问题：
  + 在动画过程中拖的时候位置不对, 需要计算偏移量弥补
  + 在拖拽时，图片还是在不停变，因为setInterval没有停, 设置一个handler，在start的时候同时clearInterval
5. 使用`end`而不是`panend`，使得不是pan的时候暂停松开后，也能回到正确位置
  
这里有这两个问题在视频中没有给出：
1. 拖拽结束后再次拖拽，图片不正确，这是因为t在`panend`的时候没有重置，导致`progress`计算不正确，我在panend里设置`t = Date.now()`,可以解决这问题。但是视频里没有设置，为何仍可以运行？
2. 在`flick`中，目前gesture里velocity不可能为负。我们可以用x的正负来判断direction, 而不是velocity。

## 为组件添加更多属性（一）
1. 这里看到另一个解决上面第一个问题的方法：
```
if(Date.now() - t < 1500) {
    let progress = (Date.now() - t) / 1500; // 1500 为动画时长
    ax = ease(progress) * 500 - 500;
} else {
    ax = 0;
}
```
2. 将`carousel`中的`attributes`和`setAttribute`放入`Component`里，并更改`mountTo`
```
mountTo(parent) {
    if(!this.root)
        this.render();
    parent.appendChild(this.root);
}
```
3. `Component`中添加`state`机制
4. `Component`中添加事件机制, 将事件添加到ATTRIBUTES上，在carousel中状态改变时可以触发事件机制,将数据绑定在`event.detail`上
```
triggerEvent(type, args) {
    this[ATTRIBUTES]["on" + type](new CustomEvent(type, { detail: args }));
}
```
## 为组件添加更多属性（二）
1. 为组件加入children机制 （内容型，模板型）
  + 内容型： Button组件
  + 模板型： List组件



