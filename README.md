# 小学数学与编程动画教学

这是一个面向儿童的交互式教学网页项目，围绕“图形化 + 动画化 + 例题 + 练习 + 正反馈”设计数学思维与 C++ 编程启蒙内容。

当前项目已完成一轮 UI 与工程重构：

- 首页升级为更现代、目标更清晰的课程导航页
- `App.tsx` 收敛为基于模块注册表的 `AppShell`
- 顶部课程导航与底部进度条都由统一页面序列驱动
- 现有课程拆分到 `src/modules/*`，更利于后续扩展新主题
- 页面整体样式同步优化为更适合手机竖屏浏览的响应式布局

## 当前学习模块

### 1. 容斥原理
- 用韦恩图讲解集合重叠
- 包含概念引入、韦恩图观察、二量容斥、三量容斥和练习

### 2. 最短路线标数法
- 用网格图和标数法讲解最短路径计数
- 包含基础型、禁行格、必经点、特殊形状和练习

### 3. 体育比赛中的学问
- 用动画讲解单败淘汰赛、单循环赛、点线图分析和积分制
- 包含赛制引入、场次动画、未完成比赛分析、积分演示和练习

### 4. 鸡兔同笼
- 用动画讲解假设法、差量法和倒扣型变式
- 包含模型理解、方法演示和闯关练习

### 5. C++ 循环入门
- 用图形化方式讲解 `for` 循环基本语法
- 用代码执行动画演示循环逐次执行过程
- 在逐行高亮时同步展示当前变量值

### 6. C++ 排序算法
- 当前包含冒泡排序、选择排序、插入排序
- 支持柱形图演示、逐行代码高亮、变量值同步展示
- 包含生活化案例与练习题

### 7. 循环指挥官
- 用互动闯关方式讲解 `break` 与 `continue`
- 包含无限循环认知、逐步执行动画、对比总结和练习

### 8. 诗词大赛
- 围绕 24 节气与传统节日制作随机题库挑战
- 包含开场引导、答题流程和结果反馈

## 教学设计要求

- 内容表达适合小朋友阅读
- 每个模块优先采用“概念 → 规则/语法 → 动画演示 → 实际案例 → 练习”的结构
- 保持游戏性、趣味性和互动性，同时避免界面过度装饰
- 新模块接入后，需要同步更新首页导航、模块注册表和页面序列

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- CSS 动画
- `lucide-react` 图标

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

本次重构完成后已执行：

- `pnpm lint`
- `pnpm build`

## 部署说明

- GitHub Pages 通过 GitHub Actions 发布 `dist`
- 当前需要兼容以下两个访问地址：
  - `https://freall.github.io/math-animation/`
  - `https://m.aipanda.cc/`
- 构建资源路径必须同时兼容子路径部署和自定义域名部署

## 当前工程结构

```bash
src/
├── components/
│   ├── ErrorBoundary.tsx
│   └── animations.tsx
├── course/
│   ├── registry.ts
│   ├── roadmap.ts
│   └── types.ts
├── hooks/
│   └── use-mobile.tsx
├── modules/
│   ├── chicken-rabbit/
│   ├── inclusion/
│   ├── loop-commander/
│   ├── loop-intro/
│   ├── poetry/
│   ├── shortest-path/
│   ├── sorting/
│   └── sports/
├── pages/
│   └── Home.tsx
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## 关键文件

| 文件 | 作用 |
|------|------|
| `src/App.tsx` | 应用壳层，负责模块切换、顶部导航、底部进度条与页面渲染 |
| `src/course/registry.ts` | 统一维护模块元信息、首页入口、页面顺序 |
| `src/pages/Home.tsx` | 首页课程导航与主题入口 |
| `src/modules/*` | 各教学模块的页面实现 |
| `src/components/animations.tsx` | 共享动画与代码展示组件 |
| `src/App.css` | 全局样式、首页壳层、课程导航与模块视觉样式 |
| `src/course/roadmap.ts` | 结构化课程路线图与工程里程碑 |
| `TODO_ROADMAP.md` | 模块与工程任务清单 |
| `ENGINEERING_PLAN.md` | 中长期工程规划 |

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
