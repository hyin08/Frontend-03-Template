# Hooks 基本用法(客户端）
+ 将`.git/hooks/`里的文件.sample extension去掉，就是可执行文件
+ 可以在node环境写脚本， `process.exit(1);`可以用来终止hook

# ESLint基本用法
1. eslint和git hook结合，通过更改pre-commit文件
  - git commit会commit将要提交的版本，而eslint会检查当前文件，会有冲突
  - 解决方案：1），手动`git stash push -k` -> `git stash pop` 2），pre-commit中使用child_process
  
# 使用无头浏览器检查DOM
- puppeteer https://pptr.dev/
