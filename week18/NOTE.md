# Mocha
安装Mocha  
安装Babel，可以使用export， import  
最佳实践：使用local环境`./node_modules/.bin/mocha ...`  

# Code Coverage (nyc)
对于babel的project需要安装这两个dependencies：
```
npm i babel-plugin-istanbul @istanbuljs/nyc-config-babel --save-dev
```
在`.babelrc`中加：
```
{
    "presets": ["@babel/env", "..., etc."],
    "plugins": ["istanbul"]
}
```
在`.nycrc`中加：
```
{
    "extends": "@istanbuljs/nyc-config-babel"
}
```

# 对html-parser进行单元测试
根据代码的function不断补充test，来达到目标：(目前 %Funcs: 100%, %Lines: 90.43%)
- %Funcs: 100% 
- %Lines: > 90%

# 所有工具与generator的集成
将本节课的mocha， nyc等加入generator
