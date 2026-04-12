import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type PeriodFrame = {
  line: number
  message: string
  activeIndex: number
  badges: { label: string; value: string }[]
}

const CycleRing = ({
  items,
  activeIndex,
}: {
  items: string[]
  activeIndex: number
}) => {
  const size = 260
  const radius = 92
  const center = { x: size / 2, y: size / 2 }

  return (
    <div className="cycle-ring">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={center.x} cy={center.y} r={radius} fill="none" stroke="rgba(15, 23, 42, 0.2)" strokeWidth="8" />
        {items.map((item, idx) => {
          const angle = (Math.PI * 2 * idx) / items.length - Math.PI / 2
          const x = center.x + Math.cos(angle) * radius
          const y = center.y + Math.sin(angle) * radius
          const active = idx === activeIndex
          return (
            <g key={`${item}-${idx}`}>
              <circle cx={x} cy={y} r={active ? 22 : 18} fill={active ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.8)'} stroke={active ? '#4f46e5' : 'rgba(148,163,184,0.5)'} strokeWidth="2" />
              <text x={x} y={y + 6} textAnchor="middle" fontSize={active ? 18 : 16} fontWeight="bold" fill="#111827">
                {item}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const buildFrames = (cycle: string[], target: number): PeriodFrame[] => {
  const frames: PeriodFrame[] = []
  frames.push({
    line: 0,
    message: `先找循环：一共 ${cycle.length} 天/次重复一次。`,
    activeIndex: -1,
    badges: [{ label: '循环长度', value: `${cycle.length}` }],
  })

  const steps = Math.min(target, 12)
  for (let i = 1; i <= steps; i++) {
    const idx = (i - 1) % cycle.length
    frames.push({
      line: 1,
      message: `第 ${i} 次/天，对应循环的第 ${idx + 1} 个。`,
      activeIndex: idx,
      badges: [
        { label: 'i', value: `${i}` },
        { label: 'i-1', value: `${i - 1}` },
        { label: '取余', value: `${idx}` },
        { label: '答案', value: `${cycle[idx]}` },
      ],
    })
  }

  const finalIdx = (target - 1) % cycle.length
  frames.push({
    line: 2,
    message: `真正要找的是第 ${target} 次：(${target}-1) % ${cycle.length} = ${finalIdx}，答案是 ${cycle[finalIdx]}。`,
    activeIndex: finalIdx,
    badges: [
      { label: '目标', value: `${target}` },
      { label: '取余结果', value: `${finalIdx}` },
      { label: '答案', value: `${cycle[finalIdx]}` },
    ],
  })

  return frames
}

export const PeriodIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">周期问题：一圈一圈算</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🗓️</div>
        <p>有些事情会重复发生：比如每 3 天轮一次值日。问第 100 天谁值日？这就是周期问题。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键：</strong>先找循环长度，再用“取余”找到位置。</p>
        <div className="concept-list">
          <span className="concept-item">🔁 找循环</span>
          <span className="concept-item">➗ 用余数</span>
          <span className="concept-item">🎯 定位答案</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心方法 →</button>
    </FadeIn>
  </div>
)

export const PeriodRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心方法： (n - 1) 取余</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="formula-box">
        <div className="formula" style={{ fontSize: '1.28rem' }}>
          第 n 个 → (n - 1) % 循环长度
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <LessonCode
        lines={[
          '1) 写出循环顺序（比如 A→B→C）',
          '2) 循环长度 = 3',
          '3) 计算 (n - 1) % 3',
          '4) 余数 0/1/2 对应第 1/2/3 个',
        ]}
        activeLine={0}
        runtimeTitle="一张小卡片记住它"
        runtimeHint="接下来用动画看到“余数定位”的过程。"
      />
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const PeriodAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const cycle = useMemo(() => ['甲', '乙', '丙'], [])
  const [target, setTarget] = useState(10)
  const frames = useMemo(() => buildFrames(cycle, target), [cycle, target])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1200)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：谁在第 n 天？</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="planting-sliders">
          <div className="planting-slider">
            <span>目标天数：第 {target} 天</span>
            <input type="range" min={4} max={40} step={1} value={target} onChange={(e) => setTarget(parseInt(e.target.value))} />
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <CycleRing items={cycle} activeIndex={frame.activeIndex} />
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            `循环：${cycle.join(' → ')}`,
            '重复规则：第 n 个 = (n - 1) % 循环长度',
            `目标：(${target}-1) % ${cycle.length}`,
          ]}
          activeLine={frame.line}
          runtimeBadges={frame.badges}
          runtimeTitle="这一刻怎么算"
          runtimeHint={frame.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const PeriodExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：轮流值日</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>三个人按顺序值日：甲、乙、丙循环。第 17 天是谁值日？</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>循环长度 = 3</p>
        <p><strong>第 2 步：</strong>(17 - 1) % 3 = 16 % 3 = 1</p>
        <p><strong>第 3 步：</strong>余数 1 → 对应第 2 个 → <strong>乙</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const PeriodPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 两天循环', question: '规律：A、B、A、B…… 第 9 个是什么？写 A 或 B。', answer: 'A', hint: '循环长度 2，用 (n-1)%2。' },
    { title: '② 四天循环', question: '规律：春、夏、秋、冬循环。第 12 天是什么？写 春/夏/秋/冬。', answer: '冬', hint: '(12-1)%4=3，对应第 4 个。' },
    { title: '③ 自己算', question: '规律：红、蓝、黄循环。第 25 个是什么？写 红/蓝/黄。', answer: '红', hint: '(25-1)%3=0，对应第 1 个。' },
  ]

  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const ok = value.trim() === problem.answer
    setSubmitted(true)
    setCorrect(ok)
    if (ok) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 2000)
    }
  }

  const next = () => {
    if (current < problems.length - 1) {
      setCurrent((prev) => prev + 1)
      setValue('')
      setSubmitted(false)
      setCorrect(false)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent((prev) => prev - 1)
      setValue('')
      setSubmitted(false)
      setCorrect(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">练习闯关：周期问题</h2></FadeIn>
      <FadeIn delay={240}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{problems.length}</h3>
          <p>{problem.title}</p>
          <p>{problem.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        {!submitted ? (
          <div className="answer-input">
            <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入答案" />
            <button className="submit-btn" onClick={submit} disabled={!value.trim()}>提交答案</button>
          </div>
        ) : (
          <div className={`result-box ${correct ? 'correct' : 'wrong'}`}>
            {correct ? (
              <>
                <p>太棒了！答对了！</p>
                <p className="explanation">正确答案：{problem.answer}</p>
                {current < problems.length - 1 ? <button className="next-btn" onClick={next}>下一题 →</button> : null}
                {current === problems.length - 1 ? <button className="restart-btn" onClick={onHome}>✅ 完成学习</button> : null}
              </>
            ) : (
              <>
                <p>再想想哦~</p>
                <p className="explanation">提示：{problem.hint}</p>
                <button className="retry-btn" onClick={() => { setValue(''); setSubmitted(false) }}>再试一次</button>
              </>
            )}
          </div>
        )}
      </FadeIn>

      {celebrate ? (
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
            <div className="celebration-message">规律大师！</div>
          </div>
        </div>
      ) : null}

      <div className="problem-nav">
        <button className="nav-btn" onClick={prev} disabled={current === 0}>← 上一题</button>
        <button className="nav-btn" onClick={next} disabled={current === problems.length - 1 || !submitted || !correct}>
          下一题 →
        </button>
      </div>
    </div>
  )
}

