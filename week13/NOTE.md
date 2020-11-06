学习笔记
# 组件的基本知识
## 组件的基本概念和基本组成部分
- 对象与组件
  + 对象： Properties, Methods, Inherit
  + 组件： Properties, Methods, Inherit, Attribute, Config&State, Event, Lifecycle, Children
- Attribute vs. Property vs. state vs. config
  |   | Markup set | JS set | JS Change | User Input Change |
  | ----------- | ----------- | ------------ | --------- | ----- |
  | property | :x: | :heavy_check_mark: | :heavy_check_mark: | ? |
  | attribute | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | ? |
  | state | :x: | :x: | :x: | :heavy_check_mark: |
  | config | :x: | :heavy_check_mark: | :x: | :x: |
- Lifecycle
- Children
  + Content型Children
  + Template型Children
## 添加JSX
- 除了使用React的createElement之外，我们还可以自定义transform，并自己实现相关功能
  1. 在webpack.config.js中添加
  ```
  module.exports = {
    .
    .
    .
    module: {
        rules: [
            { 
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        plugins: [["@babel/plugin-transform-react-jsx", {pragma: "createElement"}]],
                    }
                }
            }
        ]
    },
    .
    .
    .
  }
  ```
  2. 定义`createElement`, 并处理attributes和children（一般节点和文本节点）
  3. 可以自定义标签，并在class里面实现`setAttribute`,`appendChild`和`mountTo`
  4. 为满足将自定义标签append到HTML自带标签下，我们也需要对HTML的标签外套一层wrapper，并且实现相同函数
  
 # 轮播组件
 ## 一
 1. 创建一个Component class放在framework.js, 并让ElementWrapper和TextWrapper entend这个Component class
 2. 我们新建的标签都会继承Component，对于Carousel，我们传进来的attributes是一个image url的数组，render的时候将他们作为子节点
 3. 我们在mountTo中调用render函数，保证render在setAttribute之后调用
 ## 自动播放
 1. 在处理轮播的时候，不需要将所有的children都进行transform, 只需要将current和next的transform
 2. 先将next放在初始位置（current后面），这里需要将transition设为none， 然后开启transition，current和next进行动画
 3. 需要注意最后一张图之后回到第一张图，采用`let nextIndex = (currentIndex + 1) % children.length;`处理
 ## 手动拖拽
 1. 在当前element监听mousedown事件，之后在document监听mousemove和mouseup事件
 
