## 为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？
first-letter和first-line是在已经完成排版之后进行的处理。first-letter只是把第一个字母括起来进行处理，使用float之类的性能相对可以。而first-line由于浏览器宽度等不同，它控制住的元素数量也不同，如果使用float等设置，性能可能不好。

## 学习笔记
+ 从CSS的总体结构出发，介绍了@rule，并着重学习@media，@keyframes，@fontface
+ CSS规则基本结构 Selector(selector_group, 复杂选择器，复合选择器，简单选择器), Declaration(Key, Value)
+ 通过爬虫方法抓取W3C网站上获取CSS标准的一些内容
+ CSS语法： 简单选择器 -> 复合选择器 -> 复杂选择器
+ specificity计算原理，通过specificity来确定选择器优先级
+ 伪类
  - 链接、行为
  - 树结构
  - 逻辑型
+ 伪元素
  - ::before
  - ::after
  - ::first-letter
  - ::first-line
