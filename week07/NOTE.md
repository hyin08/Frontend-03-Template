## DOM API
Node
  + Element
    + HTMLElement
    + SVGElement
  + Document
  + CharacterData
    + Text
    + Comment
    + ProcessingInstruction (处理信息，不应该出现)
  + DocumentFragment
  + DocumentType

API
  + 导航类操作
    + Node
      + parentNode
      + childNodes
      + firstChild
      + lastChild
      + nextSibling
      + previousSibling
    + Element
      + parentElement
      + children
      + firstElementChild
      + lastElementChild
      + nextElementSibling
      + previousElementSibling
  + 修改操作
    + appendChild
    + insertBefore
    + removeChild
    + replaceChild
  + 高级操作
    + compareDocumentPosition：是一个用于比较两个节点中关系的函数
    + contains：检查一个节点是否包含另一个节点的函数
    + isEqualNode：检查两个节点是否完全相同
    + isSameNode：检查两个节点是同一个节点，实际上在JavaScript中可以用”===“
    + cloneNode：复制一个节点，如果传入参数true，则会连同子元素做深拷贝
## 事件 API
EventTarget.addEventListener()
  + options
    + capture
    + once
    + passive
## Range API
创建
```
var range = new Range();
range.setStart(element, 9);
range.setEnd(element, 4);
// 对于element，偏移值是children，对于text来说，偏移值就是文字的个数

var range=document.getSelection().getRangeAt(0);
```

range的一些API
  + range.setStartBefore
  + range.setEndBefore
  + range.setStartAfter
  + range.setEndAfter
  + range.selectNode
  + range.selectNodeContents
  + 删：var fragment = range.extractContents()
  + 加：range.insertNode(document.createTextNode("aaaa"))
## CSSOM
因为CSS代码嵌在HTML代码里，所以用DOM API访问。 
  + document.styleSheets[0].cssRules
  + document.styleSheets[0].insertRule("p {color: pink;}", 0)
  + document.styleSheets[0].removeRule(0);

## CSSOM VIEW
window
  + window.innerWidth, window.innerHeight
  + window.outerWidth, window.outerHeight
  + window.devicePixelRatio
  + window.screen
  + window.open("about:blank", "blank", "width=0,height=100,left=100,right=100")
  + moveTo(x,y)
  + moveBy(x,y)
  + resizeTo(x,y)
  + resizeBy(x,y)
  
scroll
  + 元素
    + scrollTop
    + scrollLeft
    + scrollWidth
    + scrollHeight
    + scroll(x,y)
    + scrollBy(x,y)
    + scrollIntoView()
  + window
    + scrollX
    + scrollY
    + scroll(x,y)
    + scrollBy(x,y)
    
layout
  + getClientRects()
  + getBoundingClientRect()

## 其他API
跟着老师动手搜集API，通过遍历浏览器window的对象来整理API，学习很多新的知识和学习方法
