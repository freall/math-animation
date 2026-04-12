
export type BuiltinPageType =
  | 'home'
  | 'intro' | 'venn' | 'two-set' | 'three-set' | 'practice' // 容斥原理
  | 'sp-intro' | 'sp-concept' | 'sp-basic' | 'sp-forbidden' | 'sp-mustpass' | 'sp-special' | 'sp-practice' // 标数法
  | 'sport-intro' | 'sport-elimination' | 'sport-round' | 'sport-graph' | 'sport-score' | 'sport-practice' // 体育比赛中的学问
  | 'chicken-intro' | 'chicken-basic' | 'chicken-unknown' | 'chicken-reverse' | 'chicken-practice' // 鸡兔同笼
  | 'loop-intro' | 'loop-syntax' | 'loop-process' | 'loop-example' | 'loop-practice'
  | 'sort-intro' | 'sort-algos' | 'sort-visual' | 'sort-example' | 'sort-practice'
  | 'cmd-intro' | 'cmd-break' | 'cmd-continue' | 'cmd-compare' | 'cmd-practice' // 循环指挥官
  | 'poetry-intro' | 'poetry-quiz' | 'poetry-result' // 诗词大赛
  | 'planting-intro' | 'planting-rule' | 'planting-animation' | 'planting-example' | 'planting-practice' // 植树问题
  | 'shape-intro' | 'shape-rule' | 'shape-animation' | 'shape-example' | 'shape-practice' // 搭配图形
  | 'induction-intro' | 'induction-rule' | 'induction-animation' | 'induction-example' | 'induction-practice' // 归纳解题
  | 'mul-intro' | 'mul-rule' | 'mul-animation' | 'mul-example' | 'mul-practice' // 乘法巧算
  | 'fraction-intro' | 'fraction-rule' | 'fraction-animation' | 'fraction-example' | 'fraction-practice' // 分数基础
  | 'segment-intro' | 'segment-rule' | 'segment-animation' | 'segment-example' | 'segment-practice' // 线段图解题
  | 'period-intro' | 'period-rule' | 'period-animation' | 'period-example' | 'period-practice' // 周期问题
  | 'kilo-intro' | 'kilo-rule' | 'kilo-animation' | 'kilo-example' | 'kilo-practice' // 千克与克
  | 'score-intro' | 'score-rule' | 'score-animation' | 'score-example' | 'score-practice' // 巧算方法
  | 'div-intro' | 'div-rule' | 'div-animation' | 'div-example' | 'div-practice' // 除法竖式
  | 'mult-intro' | 'mult-rule' | 'mult-animation' | 'mult-example' | 'mult-practice' // 乘法竖式
  | 'fill-intro' | 'fill-rule' | 'fill-animation' | 'fill-example' | 'fill-practice' // 竖式填数
  | 'eq-intro' | 'eq-rule' | 'eq-animation' | 'eq-example' | 'eq-practice' // 等量代换
  | 'view-intro' | 'view-rule' | 'view-animation' | 'view-example' | 'view-practice' // 三视图

export type PageType = BuiltinPageType
