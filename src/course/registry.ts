import type { PageType } from '../types'

export type CourseModuleId =
  | 'inclusion'
  | 'shortest-path'
  | 'sports'
  | 'chicken-rabbit'
  | 'loop-intro'
  | 'sorting'
  | 'loop-commander'
  | 'poetry'

export type CoursePageConfig = {
  id: PageType
  label: string
  shortLabel?: string
}

export type CourseModule = {
  id: CourseModuleId
  title: string
  subtitle: string
  description: string
  category: string
  audience: string
  entryPage: PageType
  pages: CoursePageConfig[]
}

const builtInCourseModules: CourseModule[] = [
  {
    id: 'inclusion',
    title: '容斥原理',
    subtitle: '用集合与重叠，把“重复计算”看得清清楚楚。',
    description: '从韦恩图出发，学会处理重叠区域、避免多算和少算。',
    category: '计数方法',
    audience: '小学奥数',
    entryPage: 'intro',
    pages: [
      { id: 'intro', label: '概念引入', shortLabel: '引入' },
      { id: 'venn', label: '韦恩图观察', shortLabel: '图示' },
      { id: 'two-set', label: '两个集合', shortLabel: '两集' },
      { id: 'three-set', label: '三个集合', shortLabel: '三集' },
      { id: 'practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'shortest-path',
    title: '最短路线标数法',
    subtitle: '把每个格子的走法数出来，再也不怕路径题。',
    description: '用标数、禁行格和必经点，系统掌握最短路线计数。',
    category: '路径规划',
    audience: '数学思维',
    entryPage: 'sp-intro',
    pages: [
      { id: 'sp-intro', label: '问题认识', shortLabel: '认识' },
      { id: 'sp-concept', label: '标数规则', shortLabel: '规则' },
      { id: 'sp-basic', label: '基础网格', shortLabel: '基础' },
      { id: 'sp-forbidden', label: '禁行格', shortLabel: '禁行' },
      { id: 'sp-mustpass', label: '必经点', shortLabel: '必经' },
      { id: 'sp-special', label: '变式挑战', shortLabel: '变式' },
      { id: 'sp-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'sports',
    title: '体育比赛中的学问',
    subtitle: '赛制、场次、积分和图论，一次讲透。',
    description: '把比赛里的数学秘密做成动画，用图和表一步步理解。',
    category: '比赛数学',
    audience: '生活应用',
    entryPage: 'sport-intro',
    pages: [
      { id: 'sport-intro', label: '比赛模式', shortLabel: '模式' },
      { id: 'sport-elimination', label: '淘汰赛', shortLabel: '淘汰' },
      { id: 'sport-round', label: '循环赛', shortLabel: '循环' },
      { id: 'sport-graph', label: '图论连线', shortLabel: '图论' },
      { id: 'sport-score', label: '积分规则', shortLabel: '积分' },
      { id: 'sport-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'chicken-rabbit',
    title: '鸡兔同笼',
    subtitle: '把假设、差量和倒推方法真正看懂。',
    description: '从经典应用题入手，学会把“头和脚”转成可视化推理。',
    category: '应用题模型',
    audience: '奥数基础',
    entryPage: 'chicken-intro',
    pages: [
      { id: 'chicken-intro', label: '问题模型', shortLabel: '模型' },
      { id: 'chicken-basic', label: '假设法', shortLabel: '假设' },
      { id: 'chicken-unknown', label: '差量法', shortLabel: '差量' },
      { id: 'chicken-reverse', label: '倒推法', shortLabel: '倒推' },
      { id: 'chicken-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'loop-intro',
    title: 'C++ 循环入门',
    subtitle: '让 for 循环的执行过程变成一眼能懂的动画。',
    description: '从语法、流程到实例，理解程序为什么会一遍遍执行。',
    category: '编程启蒙',
    audience: '信息学入门',
    entryPage: 'loop-intro',
    pages: [
      { id: 'loop-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'loop-syntax', label: '语法结构', shortLabel: '语法' },
      { id: 'loop-process', label: '执行过程', shortLabel: '过程' },
      { id: 'loop-example', label: '生活例子', shortLabel: '例子' },
      { id: 'loop-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'sorting',
    title: 'C++ 排序算法',
    subtitle: '比较、交换、插入，全都变成会动的步骤。',
    description: '通过柱状图和步骤提示理解冒泡、选择与插入排序。',
    category: '算法启蒙',
    audience: '信息学进阶',
    entryPage: 'sort-intro',
    pages: [
      { id: 'sort-intro', label: '问题背景', shortLabel: '背景' },
      { id: 'sort-algos', label: '算法家族', shortLabel: '算法' },
      { id: 'sort-visual', label: '动态排序', shortLabel: '动态' },
      { id: 'sort-example', label: '代码实例', shortLabel: '实例' },
      { id: 'sort-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'loop-commander',
    title: '循环指挥官',
    subtitle: '学会 break 与 continue，真正掌控循环节奏。',
    description: '把流程控制做成关卡任务，让每一次跳出和跳过都有画面。',
    category: '流程控制',
    audience: '编程思维',
    entryPage: 'cmd-intro',
    pages: [
      { id: 'cmd-intro', label: '任务引入', shortLabel: '引入' },
      { id: 'cmd-break', label: 'break 终止', shortLabel: 'break' },
      { id: 'cmd-continue', label: 'continue 跳过', shortLabel: 'continue' },
      { id: 'cmd-compare', label: '对比理解', shortLabel: '对比' },
      { id: 'cmd-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'poetry',
    title: '诗词大赛',
    subtitle: '把传统文化做成更有节奏的答题挑战。',
    description: '围绕节气与节日设计互动问答，让知识记忆更牢。',
    category: '传统文化',
    audience: '综合拓展',
    entryPage: 'poetry-intro',
    pages: [
      { id: 'poetry-intro', label: '活动介绍', shortLabel: '介绍' },
      { id: 'poetry-quiz', label: '答题挑战', shortLabel: '答题' },
      { id: 'poetry-result', label: '结果反馈', shortLabel: '结果' },
    ],
  },
]
export const courseModules: CourseModule[] = [...builtInCourseModules]

export const courseModuleMap = Object.fromEntries(courseModules.map((module) => [module.id, module])) as Record<
  CourseModuleId,
  CourseModule
>

export const pageMetaMap = courseModules.reduce<
  Partial<Record<PageType, { moduleId: CourseModuleId; index: number; label: string; shortLabel: string }>>
>((acc, module) => {
  module.pages.forEach((page, index) => {
    acc[page.id] = {
      moduleId: module.id,
      index,
      label: page.label,
      shortLabel: page.shortLabel ?? page.label,
    }
  })

  return acc
}, {})

export const totalLessonCount = courseModules.reduce((sum, module) => sum + module.pages.length, 0)
