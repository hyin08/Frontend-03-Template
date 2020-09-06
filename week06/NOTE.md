## CSS排版
1. 盒
    + HTML代码中可以书写开始__标签__，结束__标签__ ，和自封闭__标签__ 。
    + 一对起止__标签__ ，表示一个__元素__ 。
    + DOM树中存储的是__元素__和其它类型的节点（Node）。
    + CSS选择器选中的是__元素__ 。
    + CSS选择器选中的__元素__ ，在排版时可能产生多个__盒__ 。
    + 排版和渲染的基本单位是__盒__ 。
    
    + content -> padding -> border -> margin
    + box-sizing 
        + content-box
        + border-box

2. 正常流排版
    + 收集盒进行
    + 计算盒在行中的排布
    + 计算行的排布
3. 正常流的行级排布
    + base-line: 英文为主，用来对齐
    + text-top & text-bottom: 如果字体大小不变，text-top和text-bottom不变；如果多种字体混排，text-top和text-bottom由fontSize最大的字体决定
    + line-top & line-bottom: 如果文字和盒混排，lint-top和line-bottom会偏移（比如盒跟text-bottom等对齐，盒足够高，会把line-top撑高）
4. 正常流的块级排布
    + Float
        + 会影响行盒的尺寸；
        + 不止影响自己所在的行，凡是它的高所占据的范围内，所有的行盒都会根据float元素的尺寸，调整大小；
        + 两个float可能会堆叠，第二个float可能受第一个float影响
    + Clear
        + 会调整自己在纵向的位置，不会产生堆叠;
        + 可以用来对float元素换行
    + Margin Collapse：（只会发生在BFC，不会发生在IFC，或者flex，grid）
        + BFC里，两个box从上往下，都有margin，并不会把两个margin的空白都留出来相加，而是会让它们两个发生堆叠的现象，叠出来的高度跟最大的margin的高度相等。
5. BFC合并
    + Block
        + Block Container：里面有BFC
            + block
            + inline-block
            + table-cell
            + flex item
            + grid cell
            + table-caption
        + Block-level Box：外面有BFC的
            + Block level
                + display: block
                + display: flex
                + display: table
                + display: grid
            + Inline level
                + display: inline-block
                + display: inline-flex
                + display: inline-table
                + display: inline-grid
        + Block Box = Block Container + Block-level Box: 里外都有BFC的
            + block box && overflow: visible -> BFC合并
6. Flex排版
    + 收集盒进行
        + 根据主轴尺寸，把元素分进行
        + 若设置了no-wrap，则强行分配进第一行
    + 计算盒在主轴方向的排布
        + 找出所有flex元素
        + 把主轴方向的剩余尺寸按比例分配给这些元素
        + 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
    + 计算盒在交叉轴方向的排布
        + 根据每一行中最大元素尺寸计算行高
        + 根据行高flex-align和item-align，确定元素具体位置
        
## CSS 动画与绘制
1. 动画
    + @keyframes
        + transition
            + transition-property
            + transition-duration
            + transition-timing-fiunction
            + transition-delay
    + animation
        + animation-name
        + animation-duration
        + animation-timing-function
        + animation-delay
        + animation-iteration-count
        + animation-direction
2. 颜色
    + RGB
    + HSV
    + HSL
3. 绘制
    + 几何图形
        + border
        + box-shadow
        + border-radius
    + 文字
        + font
        + text-decoration
    + 位图
        + background-image
