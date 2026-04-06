import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

type SortAlgorithm = 'bubble' | 'selection' | 'insertion'
type SortAction = 'start' | 'compare' | 'swap' | 'select-min' | 'pick-key' | 'shift' | 'insert' | 'mark-sorted' | 'done'

type SortStep = {
  array: number[]
  action: SortAction
  activeLine: number
  message: string
  comparing?: number[]
  swapping?: number[]
  selected?: number[]
  sortedIndices?: number[]
  runtimeBadges: RuntimeBadge[]
  lineBadges?: Record<number, RuntimeBadge[]>
}

const SORT_LESSONS: Record<SortAlgorithm, {
  title: string
  emoji: string
  desc: string
  story: string
  codeLines: string[]
}> = {
  bubble: {
    title: '冒泡排序',
    emoji: '🫧',
    desc: '每次比较相邻两个数，把更大的数慢慢推到右边。',
    story: '像大气泡一轮一轮浮到水面，最大的数也会慢慢走到队伍最后面。',
    codeLines: [
      'for (int end = n - 1; end > 0; end--) {',
      '  for (int j = 0; j < end; j++) {',
      '    if (a[j] > a[j + 1]) {',
      '      swap(a[j], a[j + 1]);',
      '    }',
      '  }',
      '}',
    ],
  },
  selection: {
    title: '选择排序',
    emoji: '🔎',
    desc: '每一轮都在后面找一个最小的数，换到前面来。',
    story: '像老师从队伍里挑出最矮的小朋友，请他站到最前面。',
    codeLines: [
      'for (int i = 0; i < n - 1; i++) {',
      '  int minIndex = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (a[j] < a[minIndex]) {',
      '      minIndex = j;',
      '    }',
      '  }',
      '  swap(a[i], a[minIndex]);',
      '}',
    ],
  },
  insertion: {
    title: '插入排序',
    emoji: '🧩',
    desc: '每次拿起一个数，插进前面已经排好的队伍里。',
    story: '像整理扑克牌，把新拿到的一张牌插进前面已经排好的位置。',
    codeLines: [
      'for (int i = 1; i < n; i++) {',
      '  int key = a[i];',
      '  int j = i - 1;',
      '  while (j >= 0 && a[j] > key) {',
      '    a[j + 1] = a[j];',
      '    j--;',
      '  }',
      '  a[j + 1] = key;',
      '}',
    ],
  },
}

const cloneSortArray = (array: number[]) => [...array]

const pushSortStep = (steps: SortStep[], array: number[], step: Omit<SortStep, 'array'>) => {
  steps.push({
    array: cloneSortArray(array),
    ...step,
  })
}

const generateBubbleSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []
  const sortedIndices: number[] = []

  pushSortStep(steps, array, {
    action: 'start',
    activeLine: 0,
    message: '先确定无序区域的右边界，从队伍最后开始安排。',
    sortedIndices: [],
    runtimeBadges: [{ label: 'end', value: `${array.length - 1}` }],
    lineBadges: { 0: [{ label: 'end', value: `${array.length - 1}` }] },
  })

  for (let end = array.length - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 2,
        message: `比较第 ${j + 1} 个和第 ${j + 2} 个数。`,
        comparing: [j, j + 1],
        sortedIndices: [...sortedIndices],
        runtimeBadges: [{ label: 'end', value: `${end}` }, { label: 'j', value: `${j}` }],
        lineBadges: {
          0: [{ label: 'end', value: `${end}` }],
          1: [{ label: 'j', value: `${j}` }],
          2: [{ label: '比较', value: `${array[j]} > ${array[j + 1]}` }],
        },
      })

      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        pushSortStep(steps, array, {
          action: 'swap',
          activeLine: 3,
          message: `左边更大，交换两个数的位置。`,
          swapping: [j, j + 1],
          sortedIndices: [...sortedIndices],
          runtimeBadges: [{ label: 'end', value: `${end}` }, { label: 'j', value: `${j}` }],
          lineBadges: {
            3: [{ label: 'swap', value: `${array[j]} 和 ${array[j + 1]}` }],
          },
        })
      }
    }

    sortedIndices.unshift(end)
    pushSortStep(steps, array, {
      action: 'mark-sorted',
      activeLine: 0,
      message: `这一轮结束，位置 ${end + 1} 上的数已经排好了。`,
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: '已排好', value: `${sortedIndices.length} 个` }],
      lineBadges: { 0: [{ label: 'end', value: `${end - 1}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 6,
    message: '冒泡排序完成，所有数字都从小到大站好了。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateSelectionSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []
  const sortedIndices: number[] = []

  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i
    pushSortStep(steps, array, {
      action: 'select-min',
      activeLine: 1,
      message: `先把第 ${i + 1} 个数当成当前最小值。`,
      selected: [minIndex],
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
      lineBadges: { 1: [{ label: 'minIndex', value: `${minIndex}` }] },
    })

    for (let j = i + 1; j < array.length; j++) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 3,
        message: `看看第 ${j + 1} 个数会不会更小。`,
        comparing: [minIndex, j],
        selected: [minIndex],
        sortedIndices: [...sortedIndices],
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'j', value: `${j}` }, { label: 'minIndex', value: `${minIndex}` }],
        lineBadges: {
          2: [{ label: 'j', value: `${j}` }],
          3: [{ label: '比较', value: `${array[j]} < ${array[minIndex]}` }],
        },
      })

      if (array[j] < array[minIndex]) {
        minIndex = j
        pushSortStep(steps, array, {
          action: 'select-min',
          activeLine: 4,
          message: `找到新的最小值，它现在站在第 ${minIndex + 1} 个位置。`,
          selected: [minIndex],
          sortedIndices: [...sortedIndices],
          runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
          lineBadges: { 4: [{ label: 'minIndex', value: `${minIndex}` }] },
        })
      }
    }

    ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
    sortedIndices.push(i)
    pushSortStep(steps, array, {
      action: 'swap',
      activeLine: 7,
      message: '把这一轮找到的最小值交换到前面来。',
      swapping: [i, minIndex],
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
      lineBadges: { 7: [{ label: 'swap', value: `${i} ↔ ${minIndex}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 8,
    message: '选择排序完成，前面的位置一个个都安排好了。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateInsertionSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []

  pushSortStep(steps, array, {
    action: 'start',
    activeLine: 0,
    message: '第 1 个数先自己站好，后面的数一个个插进来。',
    sortedIndices: [0],
    runtimeBadges: [{ label: 'i', value: '1' }],
  })

  for (let i = 1; i < array.length; i++) {
    const key = array[i]
    let j = i - 1

    pushSortStep(steps, array, {
      action: 'pick-key',
      activeLine: 1,
      message: `拿起数字 ${key}，准备插入前面已经排好的队伍。`,
      selected: [i],
      sortedIndices: Array.from({ length: i }, (_, index) => index),
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
      lineBadges: { 1: [{ label: 'key', value: `${key}` }], 2: [{ label: 'j', value: `${j}` }] },
    })

    while (j >= 0 && array[j] > key) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 3,
        message: `比较 ${array[j]} 和 ${key}，看看要不要给 ${key} 腾位置。`,
        comparing: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 3: [{ label: '条件', value: `${array[j]} > ${key}` }] },
      })

      array[j + 1] = array[j]
      pushSortStep(steps, array, {
        action: 'shift',
        activeLine: 4,
        message: `${array[j]} 向右移动一格，给 ${key} 留出空位。`,
        swapping: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 4: [{ label: '移动', value: `${array[j]} → 右边` }] },
      })

      j--
      pushSortStep(steps, array, {
        action: 'shift',
        activeLine: 5,
        message: `继续往左看，下一个要比较的位置变成 ${j}。`,
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 5: [{ label: 'j', value: `${j}` }] },
      })
    }

    array[j + 1] = key
    pushSortStep(steps, array, {
      action: 'insert',
      activeLine: 7,
      message: `${key} 插入成功，它已经站到了正确的位置。`,
      selected: [j + 1],
      sortedIndices: Array.from({ length: i + 1 }, (_, index) => index),
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: '插入位置', value: `${j + 1}` }],
      lineBadges: { 7: [{ label: 'a[j + 1]', value: `${key}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 8,
    message: '插入排序完成，整个队伍已经从小到大排整齐。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateSortSteps = (algorithm: SortAlgorithm, input: number[]) => {
  if (algorithm === 'bubble') return generateBubbleSteps(input)
  if (algorithm === 'selection') return generateSelectionSteps(input)
  return generateInsertionSteps(input)
}

const SORT_DEMO_ARRAY = [5, 1, 4, 2, 3]

const SortingBars = ({
  step,
}: {
  step: SortStep
}) => {
  const maxValue = Math.max(...step.array)

  return (
    <div className="sorting-bars">
      {step.array.map((value, index) => {
        const isComparing = step.comparing?.includes(index)
        const isSwapping = step.swapping?.includes(index)
        const isSelected = step.selected?.includes(index)
        const isSorted = step.sortedIndices?.includes(index)
        const className = isSwapping ? 'swapping' : isComparing ? 'comparing' : isSelected ? 'selected' : isSorted ? 'sorted' : ''

        return (
          <div key={`${index}-${value}-${step.action}`} className="sorting-bar-wrap">
            <div className={`sorting-bar ${className}`} style={{ height: `${(value / maxValue) * 180 + 40}px` }}>
              <span>{value}</span>
            </div>
            <div className="sorting-index">{index}</div>
          </div>
        )
      })}
    </div>
  )
}

export const SortIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">C++ 排序算法是什么？</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="story-box">
        <div className="story-icon">🧒</div>
        <p>如果 5 个数字小朋友站成一排，我们想让它们从小到大站整齐，就需要用到排序算法。</p>
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <div className="concept-box">
        <p><strong>排序</strong>就是：按照一定规则，把一组数重新排好顺序。</p>
        <div className="concept-list">
          <span className="concept-item">🔍 先比较</span>
          <span className="concept-item">🔁 再移动</span>
          <span className="concept-item">✅ 最后排整齐</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={900}>
      <div className="tip-box">
        
        <p>在 C++ 里，排序算法经常会用到循环、比较和交换位置。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>认识三种排序方法 →</button>
    </FadeIn>
  </div>
)

export const SortAlgosPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">三种常见排序方法</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="sort-algo-grid">
        {(['bubble', 'selection', 'insertion'] as SortAlgorithm[]).map((algorithm) => {
          const lesson = SORT_LESSONS[algorithm]
          return (
            <div key={algorithm} className="sort-algo-card">
              <div className="sort-algo-emoji">{lesson.emoji}</div>
              <h3>{lesson.title}</h3>
              <p>{lesson.desc}</p>
              <p className="sort-story">{lesson.story}</p>
            </div>
          )
        })}
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <div className="rule-box">
        <p><strong>学习重点：</strong></p>
        <p className="rhyme">看谁在比较，看谁在移动，看谁已经站好。</p>
      </div>
    </FadeIn>
    <FadeIn delay={900}>
      <button className="next-btn" onClick={onNext}>开始动画演示 →</button>
    </FadeIn>
  </div>
)

export const SortVisualPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble')
  const [steps, setSteps] = useState<SortStep[]>(() => generateSortSteps('bubble', SORT_DEMO_ARRAY))
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(950)

  useEffect(() => {
    const newSteps = generateSortSteps(algorithm, SORT_DEMO_ARRAY)
    setSteps(newSteps)
    setCursor(0)
    setPlaying(true)
  }, [algorithm])

  useEffect(() => {
    if (!playing) return
    if (cursor >= steps.length - 1) return
    const timer = setTimeout(() => setCursor((current) => current + 1), speed)
    return () => clearTimeout(timer)
  }, [playing, cursor, steps, speed])

  const currentStep = steps[Math.min(cursor, steps.length - 1)]
  const lesson = SORT_LESSONS[algorithm]
  const isFinished = cursor >= steps.length - 1

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">代码和动画一起看排序</h2></FadeIn>
      <FadeIn delay={300}>
        <div className="sort-selector">
          {(['bubble', 'selection', 'insertion'] as SortAlgorithm[]).map((item) => (
            <button key={item} className={`sort-tab ${item === algorithm ? 'active' : ''}`} onClick={() => setAlgorithm(item)}>
              {SORT_LESSONS[item].emoji} {SORT_LESSONS[item].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={500}>
        <div className="tip-box">
          
          <p>{lesson.story}</p>
        </div>
      </FadeIn>
      <FadeIn delay={700}>
        <LessonCode
          lines={lesson.codeLines}
          activeLine={currentStep.activeLine}
          lineBadges={currentStep.lineBadges}
          runtimeBadges={currentStep.runtimeBadges}
          runtimeTitle="这一行执行时，变量是多少？"
          runtimeHint={currentStep.message}
        />
      </FadeIn>
      <FadeIn delay={900}>
        <div className="sort-visual-box">
          <SortingBars step={currentStep} />
          <div className="sort-legend">
            <span><i className="legend-dot comparing"></i>正在比较</span>
            <span><i className="legend-dot swapping"></i>正在移动</span>
            <span><i className="legend-dot selected"></i>当前重点</span>
            <span><i className="legend-dot sorted"></i>已经排好</span>
          </div>
          <div className="sort-controls">
            <button className="nav-btn" onClick={() => { setPlaying(false); setCursor(0) }}>重新开始</button>
            <button className="nav-btn" onClick={() => setPlaying((value) => !value)}>{playing && !isFinished ? '暂停' : '播放'}</button>
            <button className="nav-btn" onClick={() => { setPlaying(false); setCursor((value) => Math.min(value + 1, steps.length - 1)) }} disabled={isFinished}>下一步</button>
          </div>
          <div className="speed-switch">
            {[1300, 950, 650].map((value, index) => (
              <button key={value} className={`speed-chip ${speed === value ? 'active' : ''}`} onClick={() => setSpeed(value)}>
                {['慢速', '中速', '快速'][index]}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={1200}>
        <button className="next-btn" onClick={onNext}>看生活案例 →</button>
      </FadeIn>
    </div>
  )
}

export const SortExamplePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">实际案例：整理分数卡片</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 场景</h3>
        <p>老师把 5 张分数卡片放在桌上：95、68、82、74、88，想从小到大排好，方便大家一眼看出名次。</p>
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <LessonCode
        lines={[
          'vector<int> scores = {95, 68, 82, 74, 88};',
          'for (int end = scores.size() - 1; end > 0; end--) {',
          '  for (int j = 0; j < end; j++) {',
          '    if (scores[j] > scores[j + 1]) {',
          '      swap(scores[j], scores[j + 1]);',
          '    }',
          '  }',
          '}',
        ]}
        activeLine={3}
        runtimeBadges={[
          { label: '当前比较', value: '95 和 68' },
          { label: '要做什么', value: '交换位置' },
        ]}
        runtimeTitle="老师现在看到的值"
        runtimeHint="如果前面的分数更大，就把它往后换，让更小的分数慢慢来到前面。"
      />
    </FadeIn>
    <FadeIn delay={900}>
      <div className="answer-box">
        <span className="answer-icon">✨</span>
        <p>排序后得到：<strong>68，74，82，88，95</strong></p>
        <p>这样不但更整齐，也更容易比较大小。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const SortPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      title: '① 比较的作用',
      question: '排序时，为什么要先比较两个数？',
      options: ['为了知道谁应该站前面', '为了把数字变大', '为了让数组变长'],
      answer: 0,
      explanation: '比较大小后，程序才知道谁应该往前、谁应该往后。',
    },
    {
      title: '② 冒泡排序特点',
      question: '冒泡排序每一轮最容易先确定的是哪一边？',
      options: ['最左边', '最右边', '中间'],
      answer: 1,
      explanation: '每轮比较后，较大的数会慢慢跑到右边，所以最右边会先确定。',
    },
    {
      title: '③ 插入排序想法',
      question: '插入排序最像下面哪件事？',
      options: ['从头再写一遍数字', '把一张牌插进已排好的扑克牌里', '把所有数都删掉'],
      answer: 1,
      explanation: '插入排序就是把当前数字插进前面已经有序的部分里。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const currentQuestion = questions[current]
  const isCorrect = selected === currentQuestion.answer

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">排序算法小练习</h2></FadeIn>
      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{questions.length}</h3>
          <p>{currentQuestion.title}</p>
          <p>{currentQuestion.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={600}>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === currentQuestion.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
              onClick={() => !submitted && setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={900}>
        {!submitted ? (
          <button className="submit-btn" onClick={() => setSubmitted(true)} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            
            <p>{isCorrect ? '答对啦！' : '再记一记这个知识点哦！'}</p>
            <p className="explanation">{currentQuestion.explanation}</p>
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={() => { setCurrent(current + 1); setSelected(null); setSubmitted(false) }}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>
      {current === questions.length - 1 && submitted && (
        <FadeIn delay={1200}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>排序就是把数字重新排好顺序</li>
              <li>排序算法常常依靠比较、移动和交换</li>
              <li>C++ 可以用循环一步一步完成排序任务</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

// ========== 体育比赛中的学问模块 ==========
type SportPair = [string, string]
type SportScoreMode = '210' | '310'
type SportScoreMatch = {
  left: string
  right: string
  result: string
  leftPoints: number
  rightPoints: number
  total: number
}

const buildLeaguePairs = (teams: string[]): SportPair[] => {
  const pairs: SportPair[] = []
  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      pairs.push([teams[i], teams[j]])
    }
  }
  return pairs
}

const SportLeagueDiagram = ({
  teams,
  playedPairs,
  activePair,
  labels = {},
}: {
  teams: string[]
  playedPairs: SportPair[]
  activePair?: SportPair | null
  labels?: Record<string, string>
}) => {
  const points = teams.map((team, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / teams.length
    return {
      team,
      x: 150 + Math.cos(angle) * 96,
      y: 150 + Math.sin(angle) * 96,
    }
  })

  const pointMap = points.reduce<Record<string, { x: number, y: number }>>((acc, point) => {
    acc[point.team] = { x: point.x, y: point.y }
    return acc
  }, {})

  return (
    <div className="sport-diagram-panel">
      <svg viewBox="0 0 300 300" className="sport-league-svg">
        {playedPairs.map(([left, right], index) => {
          const start = pointMap[left]
          const end = pointMap[right]
          return (
            <line
              key={`${left}-${right}-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="sport-link played"
            />
          )
        })}
        {activePair && (() => {
          const start = pointMap[activePair[0]]
          const end = pointMap[activePair[1]]
          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="sport-link active"
            />
          )
        })()}

        {points.map(({ team, x, y }) => (
          <g key={team}>
            <circle cx={x} cy={y} r="23" className="sport-node" />
            <text x={x} y={y + 6} textAnchor="middle" className="sport-node-text">{team}</text>
            {labels[team] && (
              <text
                x={x}
                y={y > 150 ? y + 42 : y - 34}
                textAnchor="middle"
                className="sport-node-label"
              >
                {labels[team]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

export const SportIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">体育比赛里也藏着数学！</h2></FadeIn>

    <FadeIn delay={250}>
      <div className="story-box">
        <div className="story-icon">🎽</div>
        <p>学校要办跳绳赛、足球赛和乒乓赛，老师想知道：怎么安排比赛？一共要比几场？积分又该怎么算？</p>
      </div>
    </FadeIn>

    <FadeIn delay={500}>
      <div className="sport-mode-grid">
        <div className="sport-mode-card elimination">
          <div className="sport-mode-icon">⚡</div>
          <h3>单败淘汰赛</h3>
          <p>每场比赛都会淘汰 1 支队伍，直到只剩冠军。</p>
          <span>特点：赛程短，速度快</span>
        </div>
        <div className="sport-mode-card league">
          <div className="sport-mode-icon">🤝</div>
          <h3>单循环赛</h3>
          <p>每两支队伍都要见一次面，大家都比一轮。</p>
          <span>特点：更公平，场次更多</span>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={850}>
      <div className="sport-fact-grid">
        <div className="sport-fact-card">
          <strong>淘汰赛</strong>
          <p>总场数 = 队伍数 - 1</p>
        </div>
        <div className="sport-fact-card">
          <strong>单循环赛</strong>
          <p>总场数 = n × (n - 1) ÷ 2</p>
        </div>
        <div className="sport-fact-card">
          <strong>积分制</strong>
          <p>先看每场一共送出几分</p>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={1150}>
      <div className="tip-box">
        
        <p>这一课我们不只看热闹，还要学会用“淘汰、连线、总分”三把小钥匙，打开比赛里的数学秘密。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1450}><button className="next-btn" onClick={onNext}>先看单败淘汰赛 →</button></FadeIn>
  </div>
)

export const SportEliminationPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const eliminationMatches = [
    { round: '第一轮', left: '红队', right: '蓝队', winner: '红队' },
    { round: '第一轮', left: '绿队', right: '黄队', winner: '黄队' },
    { round: '第一轮', left: '紫队', right: '橙队', winner: '紫队' },
    { round: '第一轮', left: '星队', right: '月队', winner: '星队' },
    { round: '半决赛', left: '红队', right: '黄队', winner: '红队' },
    { round: '半决赛', left: '紫队', right: '星队', winner: '星队' },
    { round: '决赛', left: '红队', right: '星队', winner: '红队' },
  ]

  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    if (played >= eliminationMatches.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 850)
    return () => clearTimeout(timer)
  }, [autoPlay, played, eliminationMatches.length])

  const remainingTeams = 8 - played
  const champion = played === eliminationMatches.length ? eliminationMatches[eliminationMatches.length - 1].winner : null
  const currentMatch = eliminationMatches[played]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">单败淘汰赛：每场少 1 支</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="concept-box">
          <p><strong>单败淘汰赛</strong>像闯关游戏：输了就出局，赢了才能继续往前冲。</p>
          <div className="concept-list">
            <span className="concept-item">🏁 8 支队伍出发</span>
            <span className="concept-item">❌ 每场淘汰 1 支</span>
            <span className="concept-item">🏆 最后留下 1 支冠军</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已比赛</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">已淘汰</span>
            <strong className="sport-counter-value">{played} 支</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">还剩队伍</span>
            <strong className="sport-counter-value">{remainingTeams} 支</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <div className="sport-current-match">
          {currentMatch ? `下一场：${currentMatch.left} vs ${currentMatch.right}` : `冠军诞生：${champion}`}
        </div>
      </FadeIn>

      <FadeIn delay={950}>
        <div className="sport-match-list">
          {eliminationMatches.map((match, index) => {
            const isDone = index < played
            const isActive = index === played
            const loser = match.winner === match.left ? match.right : match.left
            return (
              <div key={`${match.round}-${match.left}-${match.right}`} className={`sport-match-card ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                <div className="sport-match-round">{match.round}</div>
                <div className="sport-match-teams">
                  <span className={isDone && match.left === loser ? 'out' : ''}>{match.left}</span>
                  <span className="sport-vs">VS</span>
                  <span className={isDone && match.right === loser ? 'out' : ''}>{match.right}</span>
                </div>
                <div className="sport-match-note">
                  {isDone ? `✅ ${match.winner} 晋级，${loser} 被淘汰` : isActive ? '🎯 这一场正在进行' : '⏳ 等轮到它上场'}
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, eliminationMatches.length))}>打一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停连播' : '自动连播'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      <FadeIn delay={1400}>
        <div className="rule-box">
          <p><strong>为什么总场数是 n - 1？</strong></p>
          <p className="rhyme">因为每场只淘汰 1 支</p>
          <p>8 支队伍要决出冠军，得先淘汰 7 支，所以一共要比 <strong>7 场</strong>。</p>
        </div>
      </FadeIn>

      {champion && (
        <FadeIn delay={1650}>
          <div className="answer-box">
            <span className="answer-icon">🏆</span>
            <p>答：8 支队伍参加单败淘汰赛，一共比 <strong>7 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>再看单循环赛 →</button></FadeIn>
    </div>
  )
}

export const SportRoundPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const teamOptions: Record<number, string[]> = {
    4: ['红', '蓝', '绿', '黄'],
    5: ['A', 'B', 'C', 'D', 'E'],
    6: ['甲', '乙', '丙', '丁', '戊', '己'],
  }

  const [teamCount, setTeamCount] = useState(4)
  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const teams = teamOptions[teamCount]
  const pairs = buildLeaguePairs(teams)
  const currentPair = played < pairs.length ? pairs[played] : null
  const playedPairs = pairs.slice(0, played)

  useEffect(() => {
    setPlayed(0)
    setAutoPlay(false)
  }, [teamCount])

  useEffect(() => {
    if (!autoPlay) return
    if (played >= pairs.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 750)
    return () => clearTimeout(timer)
  }, [autoPlay, played, pairs.length])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">单循环赛：每两队都要见一面</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="tip-box">
          
          <p>单循环赛最公平，因为每两支队伍都要比一场。下面选队伍数，看看连线会出现多少条。</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="sport-chooser">
          {[4, 5, 6].map((count) => (
            <button
              key={count}
              className={`sport-chip ${teamCount === count ? 'active' : ''}`}
              onClick={() => setTeamCount(count)}
            >
              {count} 支队伍
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={700}>
        <SportLeagueDiagram
          teams={teams}
          playedPairs={playedPairs}
          activePair={currentPair}
        />
      </FadeIn>

      <FadeIn delay={900}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已安排</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">总场数</span>
            <strong className="sport-counter-value">{pairs.length} 场</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">还没安排</span>
            <strong className="sport-counter-value">{pairs.length - played} 场</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1100}>
        <div className="sport-current-match">
          {currentPair ? `当前连线：${currentPair[0]}队 和 ${currentPair[1]}队` : '所有队伍都见过面啦！'}
        </div>
      </FadeIn>

      <FadeIn delay={1250}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, pairs.length))}>安排一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停连线' : '自动连线'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>清空重来</button>
        </div>
      </FadeIn>

      <FadeIn delay={1450}>
        <div className="rule-box">
          <p><strong>总场数公式：</strong>{teamCount} × ({teamCount} - 1) ÷ 2 = <strong>{pairs.length}</strong></p>
          <p>先把每队要比的场次全加起来，再除以 2，因为每一场都会被两支队伍各数一次。</p>
        </div>
      </FadeIn>

      {played === pairs.length && (
        <FadeIn delay={1650}>
          <div className="answer-box">
            <span className="answer-icon">🌟</span>
            <p>{teamCount} 支队伍进行单循环赛，一共要比 <strong>{pairs.length} 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>看看点线图怎么帮忙 →</button></FadeIn>
    </div>
  )
}

export const SportGraphPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const revealPairs: SportPair[] = [['A', 'B'], ['A', 'C'], ['A', 'D'], ['A', 'E'], ['B', 'C'], ['B', 'E']]
  const [revealedCount, setRevealedCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    if (revealedCount >= revealPairs.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setRevealedCount((current) => current + 1), 800)
    return () => clearTimeout(timer)
  }, [autoPlay, revealedCount, revealPairs.length])

  const labels: Record<string, string> = {
    A: '已知 4 场',
    B: '已知 3 场',
    C: '已知 2 场',
    D: '已知 1 场',
    E: revealedCount === revealPairs.length ? '答案 2 场' : '？ 场',
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">比赛没结束时，用点线图来帮忙</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 例题</h3>
          <p>A、B、C、D、E 五位同学进行单循环赛。</p>
          <p>A 赛了 4 场，B 赛了 3 场，C 赛了 2 场，D 赛了 1 场。</p>
          <p className="question">那 E 赛了几场？</p>
        </div>
      </FadeIn>

      <FadeIn delay={550}>
        <SportLeagueDiagram
          teams={['A', 'B', 'C', 'D', 'E']}
          playedPairs={revealPairs.slice(0, revealedCount)}
          activePair={revealedCount < revealPairs.length ? revealPairs[revealedCount] : null}
          labels={labels}
        />
      </FadeIn>

      <FadeIn delay={800}>
        <div className="sport-step-panel">
          <div className={`sport-step-card ${revealedCount >= 4 ? 'done' : revealedCount > 0 ? 'active' : ''}`}>
            <span className="sport-step-index">1</span>
            <p>A 赛了 4 场，所以 A 要和另外 4 个人都连上一条线。</p>
          </div>
          <div className={`sport-step-card ${revealedCount >= 4 ? 'done' : ''}`}>
            <span className="sport-step-index">2</span>
            <p>D 只赛了 1 场，而这 1 场已经和 A 连好了，所以 D 不会再连别的线。</p>
          </div>
          <div className={`sport-step-card ${revealedCount >= 6 ? 'done' : revealedCount > 4 ? 'active' : ''}`}>
            <span className="sport-step-index">3</span>
            <p>B 还差 2 场，只能补到 C 和 E，于是 E 一共赛了 2 场。</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1050}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setRevealedCount((current) => Math.min(current + 1, revealPairs.length))}>画一条线</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setRevealedCount(0); setAutoPlay(false) }}>清空重来</button>
        </div>
      </FadeIn>

      {revealedCount === revealPairs.length && (
        <FadeIn delay={1300}>
          <div className="answer-box">
            <span className="answer-icon">✅</span>
            <p>答：E 赛了 <strong>2 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1450}>
        <div className="rule-box">
          <p><strong>如果比赛已经全部结束呢？</strong></p>
          <p>10 支队伍进行单循环赛，每队都要和另外 9 支比 1 场。</p>
          <p>先按每队来数：10 × 9 = 90 次参赛记录，再除以 2，得到 <strong>45 场</strong>。</p>
        </div>
      </FadeIn>

      <FadeIn delay={1750}><button className="next-btn" onClick={onNext}>最后看积分制 →</button></FadeIn>
    </div>
  )
}

export const SportScorePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const scoreConfigs: Record<SportScoreMode, {
    title: string
    intro: string
    matches: SportScoreMatch[]
    formula: string
    hint: string
    example: string
    answer: string
  }> = {
    '210': {
      title: '2-1-0 积分制',
      intro: '胜 2 分，平局双方各 1 分，负 0 分。每场比赛总分永远都是 2 分。',
      matches: [
        { left: '红队', right: '蓝队', result: '红队获胜', leftPoints: 2, rightPoints: 0, total: 2 },
        { left: '黄队', right: '绿队', result: '平局', leftPoints: 1, rightPoints: 1, total: 2 },
        { left: '红队', right: '黄队', result: '黄队获胜', leftPoints: 0, rightPoints: 2, total: 2 },
      ],
      formula: '总分 = 场数 × 2',
      hint: '不管谁赢谁平，每场都会送出 2 分，所以总分是固定的。',
      example: '6 个人下单循环赛，共 15 场，总分固定 15 × 2 = 30 分。',
      answer: '如果已经知道 5 个人一共得了 25 分，那么最后 1 个人就得了 5 分。',
    },
    '310': {
      title: '3-1-0 积分制',
      intro: '胜 3 分，平局双方各 1 分，负 0 分。分出胜负时总分 3 分，平局时总分 2 分。',
      matches: [
        { left: '红队', right: '蓝队', result: '红队获胜', leftPoints: 3, rightPoints: 0, total: 3 },
        { left: '黄队', right: '绿队', result: '平局', leftPoints: 1, rightPoints: 1, total: 2 },
        { left: '红队', right: '黄队', result: '黄队获胜', leftPoints: 0, rightPoints: 3, total: 3 },
      ],
      formula: '平局场数 = 最高总分 - 实际总分',
      hint: '如果每场都分出胜负，3 场最多能送出 9 分；一旦出现 1 场平局，总分就会少 1 分。',
      example: '6 支队伍共 15 场，最高总分是 15 × 3 = 45 分。实际总分 41 分，所以平局有 4 场。',
      answer: '因为每出现 1 场平局，总分就会比最高总分少 1 分。',
    },
  }

  const [mode, setMode] = useState<SportScoreMode>('210')
  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const config = scoreConfigs[mode]
  const currentMatches = config.matches.slice(0, played)
  const currentTotal = currentMatches.reduce((sum, match) => sum + match.total, 0)
  const maxTotal = mode === '210' ? played * 2 : played * 3
  const lostPoints = maxTotal - currentTotal

  useEffect(() => {
    setPlayed(0)
    setAutoPlay(false)
  }, [mode])

  useEffect(() => {
    if (!autoPlay) return
    if (played >= config.matches.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 850)
    return () => clearTimeout(timer)
  }, [autoPlay, played, config.matches.length])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">常见积分制：先看每场一共送出几分</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="sport-point-tabs">
          <button className={`sport-point-tab ${mode === '210' ? 'active' : ''}`} onClick={() => setMode('210')}>2-1-0</button>
          <button className={`sport-point-tab ${mode === '310' ? 'active' : ''}`} onClick={() => setMode('310')}>3-1-0</button>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="concept-box">
          <p><strong>{config.title}</strong></p>
          <p>{config.intro}</p>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已演示</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">实际总分</span>
            <strong className="sport-counter-value">{currentTotal} 分</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">比最高少</span>
            <strong className="sport-counter-value">{lostPoints} 分</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1000}>
        <div className="sport-scoreboard">
          {config.matches.map((match, index) => {
            const isDone = index < played
            const isActive = index === played
            return (
              <div key={`${match.left}-${match.right}-${index}`} className={`sport-score-match ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                <div>
                  <strong>{match.left}</strong> vs <strong>{match.right}</strong>
                  <p>{match.result}</p>
                </div>
                <div className="sport-score-points">
                  <span>{match.leftPoints}</span>
                  <span className="sport-score-divider">:</span>
                  <span>{match.rightPoints}</span>
                  <em>总分 {match.total}</em>
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, config.matches.length))}>演示一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      <FadeIn delay={1400}>
        <div className="rule-box">
          <p><strong>{config.formula}</strong></p>
          <p>{config.hint}</p>
          <p>{config.example}</p>
        </div>
      </FadeIn>

      <FadeIn delay={1650}>
        <div className="answer-box">
          <span className="answer-icon">📘</span>
          <p>{config.answer}</p>
          {mode === '310' && <p>所以 45 - 41 = <strong>4 场平局</strong>。</p>}
        </div>
      </FadeIn>

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>来做几题试试 →</button></FadeIn>
    </div>
  )
}

export const SportPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      title: '① 单败淘汰赛',
      question: '8 支队伍参加单败淘汰赛，一共要比多少场？',
      options: ['6 场', '7 场', '8 场'],
      answer: 1,
      explanation: '每场淘汰 1 支，冠军出现前要淘汰 7 支，所以共 7 场。',
    },
    {
      title: '② 单循环赛',
      question: '5 支队伍两两比赛一场，一共要比多少场？',
      options: ['10 场', '12 场', '20 场'],
      answer: 0,
      explanation: '单循环赛总场数 = 5 × 4 ÷ 2 = 10 场。',
    },
    {
      title: '③ 点线图判断',
      question: 'A 赛 4 场，B 赛 3 场，C 赛 2 场，D 赛 1 场，那么 E 赛了几场？',
      options: ['1 场', '2 场', '3 场'],
      answer: 1,
      explanation: '先把 A 连向所有人，再根据 B 还差的 2 场补线，E 一共是 2 场。',
    },
    {
      title: '④ 3-1-0 积分制',
      question: '6 支队伍共打了 15 场比赛，实际总分 41 分，那么有几场平局？',
      options: ['3 场', '4 场', '5 场'],
      answer: 1,
      explanation: '最高总分是 15 × 3 = 45 分，45 - 41 = 4，所以平局有 4 场。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const question = questions[current]
  const isCorrect = selected === question.answer

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">比赛数学小练习</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 第 {current + 1} 题 / {questions.length}</h3>
          <p>{question.title}</p>
          <p className="question">{question.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={550}>
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === question.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
              onClick={() => !submitted && setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={850}>
        {!submitted ? (
          <button className="submit-btn" onClick={() => setSubmitted(true)} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            
            <p>{isCorrect ? '答对啦！你会读比赛里的数学信息了！' : '别着急，再按规则想一想。'}</p>
            <p className="explanation">{question.explanation}</p>
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={() => { setCurrent((value) => value + 1); setSelected(null); setSubmitted(false) }}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>

      {current === questions.length - 1 && submitted && (
        <FadeIn delay={1150}>
          <div className="summary-box">
            <h3>🏅 这一课你学会了</h3>
            <ul>
              <li>单败淘汰赛总场数是 n - 1</li>
              <li>单循环赛总场数是 n × (n - 1) ÷ 2</li>
              <li>比赛未完成时，可以用点线图帮忙分析</li>
              <li>积分题先看每场总共送出几分</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

// ========== 鸡兔同笼模块 ==========
type CoopAssumption = 'all-chicken' | 'all-rabbit'

const CoopCreatureWall = ({
  firstCount,
  secondCount,
  firstIcon,
  secondIcon,
  firstLabel,
  secondLabel,
}: {
  firstCount: number
  secondCount: number
  firstIcon: string
  secondIcon: string
  firstLabel: string
  secondLabel: string
}) => {
  const total = firstCount + secondCount

  return (
    <div className="coop-wall-panel">
      <div className="coop-wall">
        {Array.from({ length: total }, (_, index) => {
          const isSecond = index >= firstCount
          return (
            <div key={`${firstLabel}-${secondLabel}-${index}`} className={`coop-creature-card ${isSecond ? 'second' : 'first'}`}>
              <span className="coop-creature-emoji">{isSecond ? secondIcon : firstIcon}</span>
            </div>
          )
        })}
      </div>
      <div className="coop-legend-row">
        <span className="coop-legend-pill first">{firstIcon} {firstLabel} × {firstCount}</span>
        <span className="coop-legend-pill second">{secondIcon} {secondLabel} × {secondCount}</span>
      </div>
    </div>
  )
}

const CoopVasePreview = ({ brokenCount }: { brokenCount: number }) => (
  <div className="coop-vase-preview">
    {Array.from({ length: 8 }, (_, index) => {
      const isBroken = index < brokenCount
      return (
        <div key={`vase-${index}`} className={`coop-vase-card ${isBroken ? 'broken' : 'good'}`}>
          <span>{isBroken ? '💥' : '🏺'}</span>
        </div>
      )
    })}
  </div>
)

export const CoopIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">鸡兔同笼，先找“相同”和“不同”</h2></FadeIn>

    <FadeIn delay={250}>
      <div className="story-box">
        <div className="story-icon">🐰</div>
        <p>一个笼子里有鸡和兔，只知道总共有 <strong>40 个头</strong>、<strong>100 条腿</strong>。鸡和兔到底各有几只呢？</p>
      </div>
    </FadeIn>

    <FadeIn delay={500}>
      <CoopCreatureWall
        firstCount={4}
        secondCount={2}
        firstIcon="🐔"
        secondIcon="🐰"
        firstLabel="鸡"
        secondLabel="兔"
      />
    </FadeIn>

    <FadeIn delay={800}>
      <div className="coop-clue-grid">
        <div className="coop-clue-card same">
          <span className="coop-clue-icon">🙂</span>
          <h3>共同点</h3>
          <p>每只都有 1 个头，所以总头数能告诉我们“总只数”。</p>
        </div>
        <div className="coop-clue-card different">
          <span className="coop-clue-icon">👣</span>
          <h3>不同点</h3>
          <p>鸡有 2 条腿，兔有 4 条腿，腿数差异就是破案线索。</p>
        </div>
        <div className="coop-clue-card method">
          <span className="coop-clue-icon">🪄</span>
          <h3>解题魔法</h3>
          <p>先大胆假设，再一只只换，看看总腿数怎么变。</p>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={1100}>
      <div className="summary-box coop-summary-box">
        <h3>🧠 鸡兔同笼的本质</h3>
        <ul>
          <li>有两种东西混在一起</li>
          <li>它们有一个相同特征</li>
          <li>还藏着一个不同特征</li>
          <li>用“假设 + 替换”就能慢慢找到答案</li>
        </ul>
      </div>
    </FadeIn>

    <FadeIn delay={1400}>
      <div className="tip-box">
        
        <p>这种方法不只会算鸡兔，还能算买书、搬花瓶、积分奖惩等很多生活题。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1650}><button className="next-btn" onClick={onNext}>开始玩“换一换” →</button></FadeIn>
  </div>
)

export const CoopBasicPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const totalAnimals = 40
  const targetLegs = 100
  const [mode, setMode] = useState<CoopAssumption>('all-chicken')
  const [swapCount, setSwapCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const assumedLegs = mode === 'all-chicken' ? totalAnimals * 2 : totalAnimals * 4
  const solutionCount = Math.abs(targetLegs - assumedLegs) / 2
  const chickenCount = mode === 'all-chicken' ? totalAnimals - swapCount : swapCount
  const rabbitCount = mode === 'all-chicken' ? swapCount : totalAnimals - swapCount
  const currentLegs = chickenCount * 2 + rabbitCount * 4
  const gap = Math.abs(targetLegs - currentLegs)
  const solved = currentLegs === targetLegs

  useEffect(() => {
    setSwapCount(0)
    setAutoPlay(false)
  }, [mode])

  useEffect(() => {
    if (!autoPlay) return
    if (solved || swapCount >= solutionCount) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setSwapCount((value) => Math.min(value + 1, solutionCount)), 280)
    return () => clearTimeout(timer)
  }, [autoPlay, solved, solutionCount, swapCount])

  const handleStep = () => setSwapCount((value) => Math.min(value + 1, solutionCount))

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">基础型：假设成一样，再慢慢换</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>鸡兔共有 40 只，关在同一个笼子里。</p>
          <p>如果一共数出 100 条腿，鸡和兔各有几只？</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="coop-tabs">
          <button className={`coop-tab ${mode === 'all-chicken' ? 'active' : ''}`} onClick={() => setMode('all-chicken')}>先假设全是鸡</button>
          <button className={`coop-tab ${mode === 'all-rabbit' ? 'active' : ''}`} onClick={() => setMode('all-rabbit')}>也可以假设全是兔</button>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <div className="coop-counter-row">
          <div className="coop-counter-card">
            <span className="coop-counter-label">现在有鸡</span>
            <strong className="coop-counter-value">{chickenCount} 只</strong>
          </div>
          <div className="coop-counter-card highlight">
            <span className="coop-counter-label">现在有兔</span>
            <strong className="coop-counter-value">{rabbitCount} 只</strong>
          </div>
          <div className="coop-counter-card">
            <span className="coop-counter-label">总腿数</span>
            <strong className="coop-counter-value">{currentLegs} 条</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={950}>
        <CoopCreatureWall
          firstCount={chickenCount}
          secondCount={rabbitCount}
          firstIcon="🐔"
          secondIcon="🐰"
          firstLabel="鸡"
          secondLabel="兔"
        />
      </FadeIn>

      <FadeIn delay={1150}>
        <div className="coop-gap-banner">
          {solved
            ? '🎉 正好 100 条腿，答案找到啦！'
            : mode === 'all-chicken'
              ? `离 100 条腿还差 ${gap} 条，再把 ${gap / 2} 只鸡换成兔就行。`
              : `比 100 条腿多了 ${gap} 条，再把 ${gap / 2} 只兔换成鸡就行。`}
        </div>
      </FadeIn>

      <FadeIn delay={1350}>
        <div className="coop-step-grid">
          <div className="coop-step-card">
            <span className="coop-step-index">1</span>
            <p>{mode === 'all-chicken' ? `假设 40 只全是鸡：40 × 2 = ${assumedLegs} 条腿。` : `假设 40 只全是兔：40 × 4 = ${assumedLegs} 条腿。`}</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">2</span>
            <p>{mode === 'all-chicken' ? `和实际 100 条相比，还差 ${targetLegs - assumedLegs} 条。` : `和实际 100 条相比，多出 ${assumedLegs - targetLegs} 条。`}</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">3</span>
            <p>{mode === 'all-chicken' ? '1 只鸡换成 1 只兔，腿数会多 2 条。' : '1 只兔换成 1 只鸡，腿数会少 2 条。'}</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1550}>
        <div className="coop-equation-strip">
          <span>{Math.abs(targetLegs - assumedLegs)}</span>
          <span>÷</span>
          <span>2</span>
          <span>=</span>
          <strong>{solutionCount}</strong>
        </div>
      </FadeIn>

      <FadeIn delay={1750}>
        <div className="coop-action-row">
          <button className="coop-control-btn" onClick={handleStep} disabled={solved}>换一只</button>
          <button className="coop-control-btn" onClick={() => setAutoPlay((value) => !value)} disabled={solved}>{autoPlay ? '暂停自动换' : '自动换一换'}</button>
          <button className="coop-control-btn ghost" onClick={() => { setSwapCount(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      {solved && (
        <FadeIn delay={1950}>
          <div className="answer-box">
            <span className="answer-icon">✅</span>
            <p>答：鸡有 <strong>{chickenCount} 只</strong>，兔有 <strong>{rabbitCount} 只</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={2150}><button className="next-btn" onClick={onNext}>再挑战一种变式 →</button></FadeIn>
    </div>
  )
}

export const CoopUnknownPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const totalHeads = 40
  const totalCreatures = totalHeads / 2
  const targetLegs = 68
  const [deerCount, setDeerCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const birdCount = totalCreatures - deerCount
  const currentLegs = birdCount * 2 + deerCount * 4
  const solved = currentLegs === targetLegs
  const solutionDeer = (targetLegs - totalCreatures * 2) / 2

  useEffect(() => {
    if (!autoPlay) return
    if (solved || deerCount >= solutionDeer) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setDeerCount((value) => Math.min(value + 1, solutionDeer)), 320)
    return () => clearTimeout(timer)
  }, [autoPlay, deerCount, solved, solutionDeer])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">总只数未知型：先用共同点找总数</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>笼子里有双头鸟和双头鹿，一共有 40 个头、68 条腿。</p>
          <p className="question">双头鸟和双头鹿各有多少只？</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="coop-counter-row">
          <div className="coop-counter-card">
            <span className="coop-counter-label">总头数</span>
            <strong className="coop-counter-value">40 个</strong>
          </div>
          <div className="coop-counter-card highlight">
            <span className="coop-counter-label">总只数</span>
            <strong className="coop-counter-value">40 ÷ 2 = 20 只</strong>
          </div>
          <div className="coop-counter-card">
            <span className="coop-counter-label">当前腿数</span>
            <strong className="coop-counter-value">{currentLegs} 条</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <CoopCreatureWall
          firstCount={birdCount}
          secondCount={deerCount}
          firstIcon="🐦"
          secondIcon="🦌"
          firstLabel="双头鸟"
          secondLabel="双头鹿"
        />
      </FadeIn>

      <FadeIn delay={1000}>
        <div className="coop-gap-banner">
          {solved ? '🎉 68 条腿也对上啦！' : `先把 20 只都当成双头鸟，还差 ${targetLegs - currentLegs} 条腿。`}
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="coop-step-grid">
          <div className="coop-step-card">
            <span className="coop-step-index">1</span>
            <p>每一只都有 2 个头，所以总只数先算出来：40 ÷ 2 = 20 只。</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">2</span>
            <p>假设 20 只全是双头鸟，一共有 20 × 2 = 40 条腿。</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">3</span>
            <p>1 只双头鸟换成 1 只双头鹿，腿数会多 2 条，所以鹿有 28 ÷ 2 = 14 只。</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1450}>
        <div className="coop-equation-strip">
          <span>68 - 40</span>
          <span>=</span>
          <span>28</span>
          <span>，28 ÷ 2 =</span>
          <strong>{solutionDeer}</strong>
        </div>
      </FadeIn>

      <FadeIn delay={1650}>
        <div className="coop-action-row">
          <button className="coop-control-btn" onClick={() => setDeerCount((value) => Math.min(value + 1, solutionDeer))} disabled={solved}>换成一只鹿</button>
          <button className="coop-control-btn" onClick={() => setAutoPlay((value) => !value)} disabled={solved}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="coop-control-btn ghost" onClick={() => { setDeerCount(0); setAutoPlay(false) }}>清空重来</button>
        </div>
      </FadeIn>

      {solved && (
        <FadeIn delay={1850}>
          <div className="answer-box">
            <span className="answer-icon">🌟</span>
            <p>答：双头鸟有 <strong>{birdCount} 只</strong>，双头鹿有 <strong>{deerCount} 只</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={2050}><button className="next-btn" onClick={onNext}>再看倒扣型题目 →</button></FadeIn>
    </div>
  )
}

export const CoopReversePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const totalVases = 250
  const intactFee = 20
  const brokenFine = 100
  const targetMoney = 4400
  const expectedMoney = totalVases * intactFee
  const changePerBroken = intactFee + brokenFine
  const [brokenCount, setBrokenCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const currentMoney = expectedMoney - brokenCount * changePerBroken
  const solved = currentMoney === targetMoney
  const solutionBroken = (expectedMoney - targetMoney) / changePerBroken

  useEffect(() => {
    if (!autoPlay) return
    if (solved || brokenCount >= solutionBroken) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setBrokenCount((value) => Math.min(value + 1, solutionBroken)), 420)
    return () => clearTimeout(timer)
  }, [autoPlay, brokenCount, solved, solutionBroken])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">倒扣型：坏一个，不只是少拿，还要倒赔</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>工人运 250 个花瓶，完整送到 1 个给 20 元，打坏 1 个要倒赔 100 元。</p>
          <p className="question">运完后共得 4400 元，一共打坏了几个花瓶？</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="coop-counter-row">
          <div className="coop-counter-card">
            <span className="coop-counter-label">如果全完好</span>
            <strong className="coop-counter-value">{expectedMoney} 元</strong>
          </div>
          <div className="coop-counter-card highlight">
            <span className="coop-counter-label">现在钱数</span>
            <strong className="coop-counter-value">{currentMoney} 元</strong>
          </div>
          <div className="coop-counter-card">
            <span className="coop-counter-label">已坏花瓶</span>
            <strong className="coop-counter-value">{brokenCount} 个</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={780}>
        <div className="coop-money-flow">
          <div className="coop-money-chip good">完好 1 个：+20 元</div>
          <div className="coop-money-chip broken">打坏 1 个：-100 元</div>
          <div className="coop-money-chip total">一来一去：少 120 元</div>
        </div>
      </FadeIn>

      <FadeIn delay={1020}>
        <CoopVasePreview brokenCount={brokenCount} />
      </FadeIn>

      <FadeIn delay={1220}>
        <div className="coop-gap-banner">
          {solved ? '🎉 现在正好只剩 4400 元！' : `和 4400 元还差 ${currentMoney - targetMoney} 元，每坏 1 个就少 120 元。`}
        </div>
      </FadeIn>

      <FadeIn delay={1450}>
        <div className="coop-step-grid">
          <div className="coop-step-card">
            <span className="coop-step-index">1</span>
            <p>先假设 250 个花瓶全都完好，应拿 250 × 20 = 5000 元。</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">2</span>
            <p>实际只拿到 4400 元，所以一共少了 5000 - 4400 = 600 元。</p>
          </div>
          <div className="coop-step-card">
            <span className="coop-step-index">3</span>
            <p>1 个好花瓶变成坏花瓶，要少拿 20 元，还要再赔 100 元，共少 120 元。</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1680}>
        <div className="coop-equation-strip">
          <span>600</span>
          <span>÷</span>
          <span>120</span>
          <span>=</span>
          <strong>{solutionBroken}</strong>
        </div>
      </FadeIn>

      <FadeIn delay={1900}>
        <div className="coop-action-row">
          <button className="coop-control-btn" onClick={() => setBrokenCount((value) => Math.min(value + 1, solutionBroken))} disabled={solved}>打坏一个</button>
          <button className="coop-control-btn" onClick={() => setAutoPlay((value) => !value)} disabled={solved}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="coop-control-btn ghost" onClick={() => { setBrokenCount(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      <FadeIn delay={2120}>
        <div className="tip-box">
          
          <p>这就是图片里说的“倒扣型”：原来是加分，变坏后反而扣分，所以单差要用 <strong>20 + 100</strong> 来算。</p>
        </div>
      </FadeIn>

      {solved && (
        <FadeIn delay={2350}>
          <div className="answer-box">
            <span className="answer-icon">🏁</span>
            <p>答：一共打坏了 <strong>{brokenCount} 个花瓶</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={2550}><button className="next-btn" onClick={onNext}>来闯关练习吧 →</button></FadeIn>
    </div>
  )
}

export const CoopPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      title: '① 基础型',
      question: '鸡兔共有 40 只，腿有 100 条，兔有多少只？',
      options: ['8 只', '10 只', '12 只'],
      answer: 1,
      explanation: '先假设全是鸡，共 80 条腿，还差 20 条。每把 1 只鸡换成兔，就多 2 条腿，所以兔有 10 只。',
    },
    {
      title: '② 先找共同点',
      question: '双头鸟和双头鹿一共有 40 个头。先算出的总只数是多少？',
      options: ['10 只', '20 只', '40 只'],
      answer: 1,
      explanation: '因为每一只都有 2 个头，所以总只数 = 40 ÷ 2 = 20 只。',
    },
    {
      title: '③ 倒扣型',
      question: '花瓶题里，1 个好花瓶变成 1 个坏花瓶，钱数一共会少多少？',
      options: ['80 元', '100 元', '120 元'],
      answer: 2,
      explanation: '本来应该 +20 元，现在变成 -100 元，一来一去共少 120 元。',
    },
    {
      title: '④ 生活应用',
      question: '100 元买了 2 本 20 元漫画书和 1 本 50 元参考书，这道题和鸡兔同笼最像哪一步？',
      options: ['先看相同点，再假设成一种', '先画路线图', '先把重复部分减掉'],
      answer: 0,
      explanation: '鸡兔同笼最核心的想法，就是抓住共同点，再用假设和替换去找答案。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const question = questions[current]
  const isCorrect = selected === question.answer
  const starCount = score === questions.length ? 3 : score >= questions.length - 1 ? 2 : 1

  const handleSubmit = () => {
    if (selected === null || submitted) return
    setSubmitted(true)
    if (selected === question.answer) {
      setScore((value) => value + 1)
    }
  }

  const handleNext = () => {
    setCurrent((value) => value + 1)
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">鸡兔同笼闯关赛</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 第 {current + 1} 题 / {questions.length}</h3>
          <p>{question.title}</p>
          <p className="question">{question.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={550}>
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === question.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
              onClick={() => !submitted && setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={850}>
        {!submitted ? (
          <button className="submit-btn" onClick={handleSubmit} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            
            <p>{isCorrect ? '答对啦！你已经越来越像鸡兔侦探了！' : '再想想“相同点”和“每换一只差多少”。'}</p>
            <p className="explanation">{question.explanation}</p>
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={handleNext}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>

      {current === questions.length - 1 && submitted && (
        <FadeIn delay={1150}>
          <div className="summary-box coop-summary-box">
            <h3>🏅 你的闯关成绩：{score} / {questions.length}</h3>
            <div className="coop-star-row">
              {Array.from({ length: 3 }, (_, index) => (
                <span key={`star-${index}`} className={`coop-star ${index < starCount ? 'active' : ''}`}>⭐</span>
              ))}
            </div>
            <ul>
              <li>先抓住相同点，找出总只数</li>
              <li>再看不同点，算出每换 1 只的变化</li>
              <li>倒扣型题目要记得“少拿 + 倒赔”一起算</li>
              <li>买书、搬花瓶、奖惩积分题都能用这个思路</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
