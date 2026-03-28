# 小学数学与编程动画教学

这是一个面向儿童的交互式教学网页项目，使用图形、动画、例题和练习，帮助孩子理解数学思维与编程启蒙内容。

项目的长期方向，是把小学信息学奥赛中的 C++ 知识和小学奥数中的核心知识点，逐步建设成一个可持续扩展的动画教学模块库。

## 当前学习模块

### 1. 容斥原理

- 用韦恩图讲解集合重叠
- 包含概念引入、二量容斥、三量容斥和练习

### 2. 最短路线标数法

- 用网格图和标数法讲解最短路径计数
- 包含基础型、不过某点、必过某点、特殊形状和练习

### 3. C++ 循环入门

- 用图形化方式讲解 `for` 循环基本语法
- 用代码执行动画演示循环逐次执行过程
- 在逐行高亮时同步展示当前变量值
- 包含实际案例与交互练习

### 4. C++ 排序算法

- 整合排序算法演示思路，提供面向儿童的动画教学包装
- 当前包含冒泡排序、选择排序、插入排序
- 支持柱形图演示、逐行代码高亮、变量值同步展示
- 包含生活化案例与练习题

## 教学设计要求

- 内容表达要适合小朋友阅读
- 每个模块优先采用“概念 → 规则/语法 → 动画演示 → 实际案例 → 练习”的结构
- 页面要保持正向反馈、步骤清晰、互动轻量
- 首页新增模块后，要同步补充导航入口

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- CSS 动画

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建校验

```bash
pnpm lint
pnpm build
```

## 部署说明

- GitHub Pages 通过 GitHub Actions 发布 `dist`
- 当前需要兼容以下两个访问地址：
- `https://freall.github.io/math-animation/`
- `https://m.aipanda.cc/`
- 构建资源路径必须同时兼容子路径部署和自定义域名部署

## 项目结构

```bash
.
├── .github/workflows/deploy.yml
├── ENGINEERING_PLAN.md
├── TODO_ROADMAP.md
├── public/
│   └── 404.html
├── src/
│   ├── course/
│   │   ├── roadmap.ts
│   │   └── types.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   ├── main.tsx
│   └── components/
│       └── ErrorBoundary.tsx
├── AGENTS.md
└── README.md
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/App.tsx` | 主要页面、教学逻辑、动画流程 |
| `src/App.css` | 页面视觉样式、按钮、动画、练习样式 |
| `public/404.html` | GitHub Pages 单页应用回退 |
| `.github/workflows/deploy.yml` | GitHub Pages 自动部署工作流 |
| `AGENTS.md` | 多代理开发协作规则 |
| `TODO_ROADMAP.md` | 两大学习方向的模块 TODO 清单 |
| `ENGINEERING_PLAN.md` | 面向未来扩展的工程规划 |
| `src/course/roadmap.ts` | 结构化课程路线图与工程里程碑 |

## 维护规则

- 每次功能开发后，要同步维护本 README
- 每次开发完成后，要先校验再提交推送
- 默认流程为：
- 先运行 `pnpm lint`
- 再运行 `pnpm build`
- 验证通过后执行 commit 与 push
- 新增模块或调整长期规划时，要同步更新：
- `TODO_ROADMAP.md`
- `ENGINEERING_PLAN.md`
- `src/course/roadmap.ts`
