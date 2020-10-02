## 四则运算
- 词法定义
  + TokenNumber: 1 2 3 4 5 6 7 8 9 0的组合
  + Operator: +、-、*、/ 之一
  + Whitespace: `<SP>`
  + LineTerminator: `<LF> <CR>`
- 语法定义
  ```
  <Expression>::=
    <AdditiveExpression><EOF>
    
  <AdditiveExpression>::=
    <MultiplicativeExpression>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
    
  <MultiplicativeExpression>::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
  ```
  
## LL语法分析
  ```
  <AdditiveExpression>::=
    <Number>
    |<MultiplicativeExpression><*><Number>
    |<MultiplicativeExpression></><Number>
    |<AdditiveExpression><+><MultiplicativeExpression>
    |<AdditiveExpression><-><MultiplicativeExpression>
  ```
- 递归完成 MultiplicativeExpression
- 递归完成 AdditiveExpression，跟MultiplicativeExpression类似，但是如果刚进来的是Number，需要先调用MultiplicativeExpression
- 完成 Expression，最终结果只有一个单根
