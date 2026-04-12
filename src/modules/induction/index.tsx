import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, Star } from '../../components/animations'
import '../../App.css'

type PatternFrame = {
  label: string
  caption: string
  activeIndex: number
  badges: { label: string; value: string }[]
}

const buildCycleFrames = (cycle: string[], n: number): PatternFrame[] => {
  const frames: PatternFrame[] = []
  frames.push({
    label: '先找到循环',
    caption: `这组规律每 ${cycle.length} 个重复一次：${cycle.join(' → ')}`,
    activeIndex: -1,
    badges: [{ label: '循环长度', value: `${cycle.length}` }],
  })

  for (let i = 1; i <= n; i++) {
    const idx = (i - 1) % cycle.length
    frames.push({
      label: `第 ${i} 次`,
      caption: `第 ${i} 个对应循环里的第 ${idx + 1} 个。`,
      activeIndex: idx,
      badges: [
        { label: 'i', value: `${i}` },
        { label: 'i-1', value: `${i - 1}` },
        { label: '取余', value: `${idx}` },
        { label: '答案', value: `${cycle[idx]}` },
      ],
    })
  }

  return frames
}

const PatternStrip = ({
  items,
  activeIndex,
}: {
  items: string[]
  activeIndex: number
}) => (
  <div className="pattern-strip">
    {items.map((item, idx) => (
      <div key={`${item}-${idx}`} className={`pattern-chip ${idx === activeIndex ? 'active' : ''}`}>
        {item}
      </div>
    ))}
  </div>
)

export const InductionIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">归纳解题：找规律</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🔎</div>
        <p>有些题目看起来很长，其实藏着“重复的规律”。我们学会找规律，就能又快又准算出答案！</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>归纳</strong>就是：把很多情况变成一个简单的规律。</p>
        <div className="concept-list">
          <span className="concept-item">👀 观察</span>
          <span className="concept-item">📝 列表</span>
          <span className="concept-item">🔁 找循环</span>
          <span className="concept-item">✅ 验证</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心步骤 →</button>
    </FadeIn>
  </div>
)

export const InductionRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心步骤：四步找规律</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 列几个</h4>
          <p>先写出前几项或前几天。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 找变化</h4>
          <p>看看“怎么变”的。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 找循环</h4>
          <p>很多题会重复出现。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 用余数</h4>
          <p>用“取余”找到对应位置。</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={560}>
      <div className="rule-box">
        <p><strong>口诀：</strong></p>
        <p className="rhyme">先列再看，再找循环，用余数把答案抱回家。</p>
      </div>
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const InductionAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const cycle = useMemo(() => ['🌞', '🌧️', '🌈', '❄️'], [])
  const frames = useMemo(() => buildCycleFrames(cycle, 10), [cycle])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1100)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：循环规律怎么用？</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 小故事</h3>
          <p>天气每天按顺序循环：🌞 → 🌧️ → 🌈 → ❄️ → 🌞 → …</p>
          <p>第 10 天是什么天气？</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <PatternStrip items={cycle} activeIndex={frame.activeIndex} />
      </FadeIn>
      <FadeIn delay={760}>
        <div className="tip-box">
          <span className="tip-icon">🎬</span>
          <p><strong>{frame.label}：</strong>{frame.caption}</p>
        </div>
      </FadeIn>
      <FadeIn delay={980}>
        <div className="runtime-panel">
          <div className="runtime-title">这一刻的数值</div>
          <div className="runtime-list">
            {frame.badges.map((b) => (
              <div key={`${b.label}-${b.value}`} className="runtime-item">
                <span className="runtime-label">{b.label}</span>
                <span className="runtime-value">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={1220}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const InductionExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：用余数定位</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>小灯泡按顺序闪：A、B、C、A、B、C…… 第 20 次闪的是哪个字母？</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>循环长度是 3（A、B、C）</p>
        <p><strong>第 2 步：</strong>算余数： (20 - 1) ÷ 3 的余数是 1</p>
        <p><strong>第 3 步：</strong>余数 1 对应第 2 个 → <strong>B</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <div className="answer-box">
        <span className="answer-icon">✅</span>
        <p>答案：第 20 次是 <strong>B</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={1040}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const InductionPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    {
      title: '① 循环长度',
      question: '如果规律是 A、B、C、A、B、C…… 循环长度是多少？',
      options: ['2', '3', '6'],
      answer: 1,
      explanation: 'A、B、C 一共 3 个，会重复出现。',
    },
    {
      title: '② 用余数找位置',
      question: '规律：红、蓝、黄、红、蓝、黄…… 第 7 个是什么颜色？',
      options: ['红', '蓝', '黄'],
      answer: 0,
      explanation: '(7 - 1) ÷ 3 余 0，对应第 1 个颜色：红。',
    },
    {
      title: '③ 再来一题',
      question: '规律：1、2、1、2、1、2…… 第 10 个是多少？',
      options: ['1', '2', '3'],
      answer: 1,
      explanation: '循环长度 2，第 10 个落在第 2 位，所以是 2。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const problem = problems[current]
  const isCorrect = selected === problem.answer

  const submit = () => {
    setSubmitted(true)
    if (selected === problem.answer) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const next = () => {
    if (current < problems.length - 1) {
      setCurrent((prev) => prev + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">练习闯关：找规律</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{problems.length}</h3>
          <p>{problem.title}</p>
          <p>{problem.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <div className="quiz-options">
          {problem.options.map((opt, idx) => (
            <button
              key={opt}
              className={`quiz-option ${selected === idx ? 'selected' : ''} ${submitted && idx === problem.answer ? 'correct' : ''} ${
                submitted && selected === idx && !isCorrect ? 'wrong' : ''
              }`}
              onClick={() => !submitted && setSelected(idx)}
            >
              {opt}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={820}>
        {!submitted ? (
          <button className="submit-btn" onClick={submit} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                <p>太棒了！答对了！</p>
                <p className="explanation">{problem.explanation}</p>
                {current < problems.length - 1 ? <button className="next-btn" onClick={next}>下一题 →</button> : null}
                {current === problems.length - 1 ? <button className="restart-btn" onClick={onHome}>✅ 完成学习</button> : null}
              </>
            ) : (
              <>
                <p>再想想哦~</p>
                <p className="explanation">提示：先找循环长度，再用 (n - 1) 取余。</p>
                <button className="retry-btn" onClick={() => { setSelected(null); setSubmitted(false) }}>再试一次</button>
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
    </div>
  )
}
