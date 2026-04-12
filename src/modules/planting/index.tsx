import React, { useEffect, useMemo, useState } from 'react'
import { Bounce, FadeIn, Star } from '../../components/animations'
import '../../App.css'

type PlantingMode = 'both' | 'one' | 'none' | 'circle'

const MODE_META: Record<
  PlantingMode,
  { title: string; subtitle: string; tip: string; formula: (intervals: number) => number }
> = {
  both: {
    title: '两端都种',
    subtitle: '起点和终点都有树',
    tip: '树的棵数 = 间隔数 + 1',
    formula: (intervals) => intervals + 1,
  },
  one: {
    title: '只种一端',
    subtitle: '只在起点或终点种树',
    tip: '树的棵数 = 间隔数',
    formula: (intervals) => intervals,
  },
  none: {
    title: '两端都不种',
    subtitle: '起点终点都没有树',
    tip: '树的棵数 = 间隔数 - 1',
    formula: (intervals) => Math.max(0, intervals - 1),
  },
  circle: {
    title: '围成一圈',
    subtitle: '绕操场一圈种树',
    tip: '树的棵数 = 间隔数',
    formula: (intervals) => intervals,
  },
}

const computeIntervals = (length: number, gap: number) => Math.floor(length / gap)

const PlantingDiagram = ({
  length,
  gap,
  mode,
  showUntil,
}: {
  length: number
  gap: number
  mode: PlantingMode
  showUntil: number
}) => {
  const intervals = computeIntervals(length, gap)
  const treeCount = MODE_META[mode].formula(intervals)

  const points = useMemo(() => {
    if (mode === 'circle') {
      return Array.from({ length: intervals }, (_, idx) => idx)
    }

    if (mode === 'both') {
      return Array.from({ length: intervals + 1 }, (_, idx) => idx)
    }
    if (mode === 'one') {
      return Array.from({ length: intervals }, (_, idx) => idx)
    }
    return Array.from({ length: Math.max(0, intervals - 1) }, (_, idx) => idx + 1)
  }, [intervals, mode])

  const progress = Math.min(showUntil, points.length)
  const visible = points.slice(0, progress)

  const lineCount = intervals + 1
  const cellWidth = 34
  const width = Math.max(280, lineCount * cellWidth + 60)

  const isCircle = mode === 'circle'
  const radius = 96
  const center = { x: width / 2, y: 140 }

  return (
    <div className="planting-board">
      <svg viewBox={`0 0 ${width} 260`} className="planting-svg" width={width} height={260}>
        {!isCircle ? (
          <>
            <line x1="30" y1="130" x2={width - 30} y2="130" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
            {Array.from({ length: lineCount }, (_, idx) => {
              const x = 30 + idx * cellWidth
              const showTree = visible.includes(idx)
              return (
                <g key={idx}>
                  <circle cx={x} cy={130} r="5" fill="#111827" />
                  {showTree ? <text x={x} y={112} textAnchor="middle" fontSize="20">🌳</text> : null}
                </g>
              )
            })}
            {Array.from({ length: intervals }, (_, idx) => {
              const x = 30 + idx * cellWidth + cellWidth / 2
              return (
                <text key={`gap${idx}`} x={x} y={160} textAnchor="middle" fontSize="12" fill="#475569">
                  {gap}m
                </text>
              )
            })}
            <text x="30" y="190" textAnchor="start" fontSize="13" fill="#475569">起点</text>
            <text x={width - 30} y="190" textAnchor="end" fontSize="13" fill="#475569">终点</text>
          </>
        ) : (
          <>
            <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="#111827" strokeWidth="4" />
            {Array.from({ length: intervals }, (_, idx) => {
              const angle = (Math.PI * 2 * idx) / intervals - Math.PI / 2
              const x = center.x + Math.cos(angle) * radius
              const y = center.y + Math.sin(angle) * radius
              const showTree = visible.includes(idx)
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r="5" fill="#111827" />
                  {showTree ? <text x={x} y={y - 14} textAnchor="middle" fontSize="20">🌳</text> : null}
                </g>
              )
            })}
            <text x={center.x} y={235} textAnchor="middle" fontSize="13" fill="#475569">
              一圈被分成 {intervals} 个等间隔
            </text>
          </>
        )}
      </svg>

      <div className="planting-stats">
        <div className="planting-stat">
          <strong>{length}m</strong>
          <span>总长度</span>
        </div>
        <div className="planting-stat">
          <strong>{gap}m</strong>
          <span>间隔</span>
        </div>
        <div className="planting-stat">
          <strong>{intervals}</strong>
          <span>间隔数</span>
        </div>
        <div className="planting-stat highlight">
          <strong>{treeCount}</strong>
          <span>树的棵数</span>
        </div>
      </div>
    </div>
  )
}

export const PlantingIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn>
      <h2 className="page-title">植树问题</h2>
    </FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🛣️</div>
        <p>沿着一条小路每隔一定距离种一棵树：到底要种几棵？这就是经典的“植树问题”。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键抓手：</strong>先数“间隔”，再决定“端点种不种”。</p>
        <div className="concept-list">
          <span className="concept-item">📏 先算间隔数</span>
          <span className="concept-item">🌳 再算树的棵数</span>
          <span className="concept-item">🎯 最后检查端点</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={800}>
      <button className="next-btn" onClick={onNext}>学习核心规则 →</button>
    </FadeIn>
  </div>
)

export const PlantingRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn>
      <h2 className="page-title">核心规则：先算间隔数</h2>
    </FadeIn>
    <FadeIn delay={260}>
      <div className="formula-box">
        <div className="formula" style={{ fontSize: '1.35rem' }}>
          间隔数 = 总长度 ÷ 间隔
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="loop-flow-grid">
        {(['both', 'one', 'none', 'circle'] as PlantingMode[]).map((mode) => (
          <div key={mode} className="loop-flow-card">
            <h4>{MODE_META[mode].title}</h4>
            <p>{MODE_META[mode].subtitle}</p>
            <p><strong>{MODE_META[mode].tip}</strong></p>
          </div>
        ))}
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <div className="rule-box">
        <p><strong>提醒：</strong></p>
        <p className="rhyme">“间隔数”和“棵数”不是一回事，端点种不种，会改变最后的棵数。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1100}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const PlantingAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [mode, setMode] = useState<PlantingMode>('both')
  const [length, setLength] = useState(20)
  const [gap, setGap] = useState(5)
  const intervals = computeIntervals(length, gap)
  const targetTreeCount = MODE_META[mode].formula(intervals)
  const [showUntil, setShowUntil] = useState(0)

  useEffect(() => {
    setShowUntil(0)
    const timer = setInterval(() => {
      setShowUntil((prev) => {
        const next = prev + 1
        if (next > targetTreeCount) return targetTreeCount
        return next
      })
    }, 520)
    return () => clearInterval(timer)
  }, [mode, length, gap, targetTreeCount])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn>
        <h2 className="page-title">动画讲解：一步一步种树</h2>
      </FadeIn>
      <FadeIn delay={240}>
        <div className="sort-selector">
          {(['both', 'one', 'none', 'circle'] as PlantingMode[]).map((item) => (
            <button key={item} className={`sort-tab ${item === mode ? 'active' : ''}`} onClick={() => setMode(item)}>
              {MODE_META[item].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <div className="planting-sliders">
          <div className="planting-slider">
            <span>总长度：{length}m</span>
            <input
              type="range"
              min={10}
              max={40}
              step={5}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
            />
          </div>
          <div className="planting-slider">
            <span>间隔：{gap}m</span>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={gap}
              onChange={(e) => setGap(parseInt(e.target.value))}
            />
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={620}>
        <PlantingDiagram length={length} gap={gap} mode={mode} showUntil={showUntil} />
      </FadeIn>
      <FadeIn delay={900}>
        <div className="tip-box">
          <span className="tip-icon">🧠</span>
          <p>
            先算间隔数：<strong>{length} ÷ {gap} = {intervals}</strong>。
            然后看端点：<strong>{MODE_META[mode].tip}</strong>，所以一共 <strong>{targetTreeCount}</strong> 棵树。
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={1180}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const PlantingExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn>
      <h2 className="page-title">例题：两端都种</h2>
    </FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>一条 30 米的小路，每隔 5 米种一棵树，两端都种。一共种多少棵？</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>间隔数 = 30 ÷ 5 = 6</p>
        <p><strong>第 2 步：</strong>两端都种 → 树的棵数 = 间隔数 + 1</p>
      </div>
    </FadeIn>
    <FadeIn delay={760}>
      <div className="answer-box">
        <span className="answer-icon">✅</span>
        <p>树的棵数 = 6 + 1 = <strong>7</strong>（棵）</p>
      </div>
    </FadeIn>
    <FadeIn delay={1040}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const PlantingPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    {
      title: '① 两端都种',
      question: '一条 20 米小路，每隔 4 米种一棵树，两端都种。共几棵？',
      answer: 6,
      hint: '先算间隔数，再看“两端都种”。',
    },
    {
      title: '② 只种一端',
      question: '一条 18 米小路，每隔 3 米种一棵，只在起点种树（终点不种）。共几棵？',
      answer: 6,
      hint: '只种一端：棵数 = 间隔数。',
    },
    {
      title: '③ 围成一圈',
      question: '操场一圈 120 米，每隔 10 米种一棵，绕一圈。共几棵？',
      answer: 12,
      hint: '绕圈时没有“多出来的端点”。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const correct = parseInt(answer) === problem.answer
    setSubmitted(true)
    setIsCorrect(correct)
    if (correct) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const next = () => {
    if (current < problems.length - 1) {
      setCurrent((prev) => prev + 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">练习闯关：植树问题</h2></FadeIn>

      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{problems.length}</h3>
          <p>{problem.title}</p>
          <p>{problem.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={520}>
        {!submitted ? (
          <div className="answer-input">
            <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="请输入答案" />
            <button className="submit-btn" onClick={submit} disabled={!answer.trim()}>提交答案</button>
          </div>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                <p>太棒了！答对了！</p>
                <p className="explanation">正确答案：{problem.answer}（棵）</p>
                {current < problems.length - 1 ? <button className="next-btn" onClick={next}>下一题 →</button> : null}
                {current === problems.length - 1 ? <button className="restart-btn" onClick={onHome}>✅ 完成学习</button> : null}
              </>
            ) : (
              <>
                <p>再想想哦~</p>
                <p className="explanation">提示：{problem.hint}</p>
                <button className="retry-btn" onClick={() => { setAnswer(''); setSubmitted(false) }}>再试一次</button>
              </>
            )}
          </div>
        )}
      </FadeIn>

      {showCelebration ? (
        <div className="celebration-overlay">
          <div className="celebration-stars">
            {[...Array(18)].map((_, i) => (
              <Star
                key={i}
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s`,
                  width: `${18 + Math.random() * 38}px`,
                  height: `${18 + Math.random() * 38}px`,
                  color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#60a5fa' : '#34d399',
                }}
              />
            ))}
          </div>
          <div className="celebration-text">
            <div className="celebration-emoji">🎉🎊✨</div>
            <div className="celebration-message">太棒了！</div>
          </div>
        </div>
      ) : null}

      <div className="problem-nav">
        <button className="nav-btn" onClick={prev} disabled={current === 0}>← 上一题</button>
        <button className="nav-btn" onClick={next} disabled={current === problems.length - 1 || !submitted || !isCorrect}>
          下一题 →
        </button>
      </div>

      {current === problems.length - 1 && submitted && isCorrect ? (
        <FadeIn delay={900}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>先算间隔数：总长度 ÷ 间隔</li>
              <li>端点种不种，会影响最后棵数</li>
              <li>围成一圈时：棵数 = 间隔数</li>
            </ul>
          </div>
        </FadeIn>
      ) : null}
    </div>
  )
}
