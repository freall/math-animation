# 项目长期记忆

## 项目概况
- 项目名：math-animation，面向儿童的信息学奥赛交互式教学网页
- 技术栈：React + TypeScript + Vite + Tailwind CSS
- 主要文件：src/App.tsx（单文件主逻辑），src/App.css（样式）
- 部署：GitHub Pages (freall.github.io/math-animation/) + 自定义域名 m.aipanda.cc

## 已完成模块
1. 容斥原理（intro → venn → two-set → three-set → practice）
2. 最短路线标数法（sp-intro → sp-concept → sp-basic → sp-forbidden → sp-mustpass → sp-special → sp-practice）
3. C++ 循环入门（loop-intro → loop-syntax → loop-process → loop-example → loop-practice）
4. C++ 排序算法（sort-intro → sort-algos → sort-visual → sort-example → sort-practice）
5. **循环指挥官（第11课）**（cmd-intro → cmd-break → cmd-continue → cmd-compare → cmd-practice）
   - 内容：while(true) 无限循环、break 语句、continue 语句、对比表格+9的倍数关卡、GESP真题练习
   - 于 2026-04-01 完成，commit: 358ddc8

## 开发约定
- 新模块页面命名前缀 + 页面功能：如 cmd-break、cmd-continue
- 新模块加入 PageType 联合类型、首页 topic-card、progressPages 数组、JSX 路由
- 样式直接追加到 App.css 末尾
- 验证流程：pnpm lint && pnpm build，通过后 git commit + push
