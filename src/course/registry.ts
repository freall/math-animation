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
  | 'planting'
  | 'shape-matching'
  | 'induction'
  | 'mul-tricks'
  | 'fractions'
  | 'segment-diagram'
  | 'periodic'
  | 'kilogram'
  | 'score-board'
  | 'long-division'
  | 'long-multiplication'
  | 'vertical-fill'
  | 'equal-substitution'
  | 'three-views'

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
  {
    id: 'planting',
    title: '植树问题',
    subtitle: '先数间隔，再看端点，轻松搞定棵数。',
    description: '用动画把“间隔数”和“棵数”的关系讲清楚，含环形与端点变化。',
    category: '应用题模型',
    audience: '小学奥数',
    entryPage: 'planting-intro',
    pages: [
      { id: 'planting-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'planting-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'planting-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'planting-example', label: '例题解析', shortLabel: '例题' },
      { id: 'planting-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'shape-matching',
    title: '搭配图形',
    subtitle: '把立体拆成小柱子，一根根数清楚。',
    description: '用小方块搭积木，学会从“高度表”快速数出方块总数。',
    category: '空间想象',
    audience: '数学思维',
    entryPage: 'shape-intro',
    pages: [
      { id: 'shape-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'shape-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'shape-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'shape-example', label: '例题解析', shortLabel: '例题' },
      { id: 'shape-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'induction',
    title: '归纳解题',
    subtitle: '找循环，用余数，快速定位答案。',
    description: '用动画学会找规律：先列、再看、找循环、用余数。',
    category: '找规律',
    audience: '奥数思维',
    entryPage: 'induction-intro',
    pages: [
      { id: 'induction-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'induction-rule', label: '核心步骤', shortLabel: '步骤' },
      { id: 'induction-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'induction-example', label: '例题解析', shortLabel: '例题' },
      { id: 'induction-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'mul-tricks',
    title: '乘法巧算',
    subtitle: '凑整、拆分、提公因式，让乘法更快。',
    description: '用动画把乘法分配律、结合律讲清楚，学会快速心算。',
    category: '计算方法',
    audience: '小学奥数',
    entryPage: 'mul-intro',
    pages: [
      { id: 'mul-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'mul-rule', label: '核心方法', shortLabel: '方法' },
      { id: 'mul-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'mul-example', label: '例题解析', shortLabel: '例题' },
      { id: 'mul-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'fractions',
    title: '分数基础',
    subtitle: '分子分母、约分通分、比较大小，一步学会。',
    description: '用图形化把分数意义讲清楚，并用通分/同分母比较分数大小。',
    category: '分数',
    audience: '小学数学',
    entryPage: 'fraction-intro',
    pages: [
      { id: 'fraction-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'fraction-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'fraction-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'fraction-example', label: '例题解析', shortLabel: '例题' },
      { id: 'fraction-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'segment-diagram',
    title: '线段图解题',
    subtitle: '把数量关系画出来，答案自然出现。',
    description: '用线段图把“和、差、倍”关系讲清楚，学会列式求解。',
    category: '应用题模型',
    audience: '小学奥数',
    entryPage: 'segment-intro',
    pages: [
      { id: 'segment-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'segment-rule', label: '画图步骤', shortLabel: '步骤' },
      { id: 'segment-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'segment-example', label: '例题解析', shortLabel: '例题' },
      { id: 'segment-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'periodic',
    title: '周期问题',
    subtitle: '找循环，用余数，快速定位第 n 次。',
    description: '把周期规律做成动画：先找循环长度，再用取余锁定答案。',
    category: '找规律',
    audience: '数学思维',
    entryPage: 'period-intro',
    pages: [
      { id: 'period-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'period-rule', label: '核心方法', shortLabel: '方法' },
      { id: 'period-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'period-example', label: '例题解析', shortLabel: '例题' },
      { id: 'period-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'kilogram',
    title: '千克与克',
    subtitle: '认识重量单位，学会换算与计算。',
    description: '用称重动画讲清楚 1 千克 = 1000 克，并做换算与应用题练习。',
    category: '计量单位',
    audience: '小学数学',
    entryPage: 'kilo-intro',
    pages: [
      { id: 'kilo-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'kilo-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'kilo-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'kilo-example', label: '例题解析', shortLabel: '例题' },
      { id: 'kilo-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'score-board',
    title: '巧算方法',
    subtitle: '凑整、分组、去括号，让加减法更快。',
    description: '用动画把“连加连减”的巧算思路讲清楚，学会快速计算与检验。',
    category: '计算方法',
    audience: '小学数学',
    entryPage: 'score-intro',
    pages: [
      { id: 'score-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'score-rule', label: '核心方法', shortLabel: '方法' },
      { id: 'score-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'score-example', label: '例题解析', shortLabel: '例题' },
      { id: 'score-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'long-division',
    title: '除法竖式',
    subtitle: '商、乘、减、落，像走台阶一样算。',
    description: '用动画演示竖式除法的每一步，包括商中间有 0 的情况与余数检验。',
    category: '计算方法',
    audience: '小学数学',
    entryPage: 'div-intro',
    pages: [
      { id: 'div-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'div-rule', label: '核心步骤', shortLabel: '步骤' },
      { id: 'div-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'div-example', label: '例题解析', shortLabel: '例题' },
      { id: 'div-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'long-multiplication',
    title: '乘法竖式',
    subtitle: '对齐数位、先乘个位、再做进位。',
    description: '用动画一步步演示乘法竖式，包括两位数乘两位数与末尾有 0 的乘法。',
    category: '计算方法',
    audience: '小学数学',
    entryPage: 'mult-intro',
    pages: [
      { id: 'mult-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'mult-rule', label: '核心步骤', shortLabel: '步骤' },
      { id: 'mult-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'mult-example', label: '例题解析', shortLabel: '例题' },
      { id: 'mult-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'vertical-fill',
    title: '竖式填数',
    subtitle: '看清对齐和进位，缺的数字就能找出来。',
    description: '用互动闯关的方式练习竖式加减填空，培养数位和进退位意识。',
    category: '计算方法',
    audience: '小学数学',
    entryPage: 'fill-intro',
    pages: [
      { id: 'fill-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'fill-rule', label: '解题思路', shortLabel: '思路' },
      { id: 'fill-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'fill-example', label: '例题解析', shortLabel: '例题' },
      { id: 'fill-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'equal-substitution',
    title: '等量代换',
    subtitle: '把“相等”当成替身，式子就变简单。',
    description: '用动画学会等量代换：找到等量关系，把难的换成简单的，再合并计算。',
    category: '等量关系',
    audience: '小学奥数',
    entryPage: 'eq-intro',
    pages: [
      { id: 'eq-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'eq-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'eq-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'eq-example', label: '例题解析', shortLabel: '例题' },
      { id: 'eq-practice', label: '练习闯关', shortLabel: '练习' },
    ],
  },
  {
    id: 'three-views',
    title: '三视图',
    subtitle: '从上、从前、从左，给积木拍三张照片。',
    description: '用立体积木动画理解上视图、正视图、左视图怎么画，并做点格子闯关练习。',
    category: '空间想象',
    audience: '数学思维',
    entryPage: 'view-intro',
    pages: [
      { id: 'view-intro', label: '概念引入', shortLabel: '引入' },
      { id: 'view-rule', label: '核心规则', shortLabel: '规则' },
      { id: 'view-animation', label: '动画讲解', shortLabel: '动画' },
      { id: 'view-example', label: '例题解析', shortLabel: '例题' },
      { id: 'view-practice', label: '练习闯关', shortLabel: '练习' },
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
