## 排版
+ 这里我们只对flex布局进行排版，flex布局需要知道子元素，子元素发生在标签的结束标签之前，所以我们在emit endTag的时候调用layout函数
+ 我们先进行预处理，将width、height、left、right、top、bottom抽象成main、cross相关的属性
+ 接着根据主轴尺寸，把元素分进行（若设置了no-wrap，则强行分配进第一行）
+ 接着计算主轴方向
  1. 找出所有flex元素
  2. 把主轴方向的剩余尺寸按比例分配给这些元素
  3. 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
+ 然后计算交叉轴方向
  1. 根据每一行中最大元素尺寸计算行高
  2. 根据行高alignContent和alignSelf/alignItems，确定元素具体位置

## 渲染
+ 目前仅对background-color属性进行绘制，将来加入其它属性
+ 从单个元素的绘制开始，需要依赖一个图形环境，这里使用images包，绘制在一个viewport上进行
+ 采用递归调用子元素的绘制方法完成DOM树的绘制
