import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type SegmentFrame = {
  line: number
  message: string
  highlight: 'sum' | 'diff' | 'unit' | 'answer'
  badges: { label: string; value: string }[]
}

const SegmentBar = ({
  aUnits,
  bUnits,
  unitLabel,
  highlight,
}: {
  aUnits: number
  bUnits: number
  unitLabel: string
  highlight: 'sum' | 'diff' | 'unit' | 'answer'
}) => {
  const cell = 34
  const height = 190
  const width = Math.max(320, (Math.max(aUnits, bUnits) + 2) * cell + 60)
  const baseX = 30
  const topY = 72
  const bottomY = 132

  const drawRow = (units: number, y: number, color: string, label: string, active: boolean) => (
    <g>
      <text x={baseX} y={y - 14} fontSize="14" fill="#111827" fontWeight="bold">
        {label}
      </text>
      {Array.from({ length: units }, (_, idx) => (
        <rect
          key={idx}
          x={baseX + idx * cell}
          y={y}
          width={cell - 4}
          height={36}
          rx={10}
          fill={color}
          opacity={active ? 1 : 0.65}
        />
      ))}
    </g>
  )

  const minUnits = Math.min(aUnits, bUnits)
  const diffUnits = Math.abs(aUnits - bUnits)
  const diffStart = baseX + minUnits * cell
  const diffY = 156

  return (
    <div className="segment-board">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="segment-svg">
        {drawRow(aUnits, topY, 'rgba(99, 102, 241, 0.35)', '甲', highlight === 'sum' || highlight === 'unit' || highlight === 'answer')}
        {drawRow(bUnits, bottomY, 'rgba(34, 211, 238, 0.32)', '乙', highlight === 'sum' || highlight === 'unit' || highlight === 'answer')}

        <text x={baseX} y={topY + 64} fontSize="12" fill="#475569">每一格 = {unitLabel}</text>

        {diffUnits > 0 ? (
          <>
            <line
              x1={diffStart}
              y1={diffY}
              x2={diffStart + diffUnits * cell - 4}
              y2={diffY}
              stroke={highlight === 'diff' ? '#ef4444' : '#94a3b8'}
              strokeWidth={highlight === 'diff' ? 4 : 3}
              strokeLinecap="round"
            />
            <text x={diffStart + (diffUnits * cell) / 2} y={diffY - 10} textAnchor="middle" fontSize="13" fill="#ef4444" fontWeight="bold">
              差
            </text>
          </>
        ) : null}

        {highlight === 'unit' ? (
          <rect x={baseX - 8} y={topY - 10} width={cell} height={54} rx={14} fill="rgba(250, 204, 21, 0.22)" stroke="rgba(245, 158, 11, 0.5)" strokeWidth="2" />
        ) : null}
      </svg>
    </div>
  )
}

const buildFrames = (): SegmentFrame[] => {
  const sum = 96
  const diff = 24
  const unit = diff / 2
  const a = unit * 3
  const b = unit * 5

  return [
    {
      line: 0,
      highlight: 'sum',
      message: '先把题目里的“和”写出来：甲 + 乙 = 96。',
      badges: [{ label: '和', value: `${sum}` }],
    },
    {
      line: 1,
      highlight: 'diff',
      message: '再把“差”写出来：乙 - 甲 = 24（谁大谁减谁）。',
      badges: [{ label: '差', value: `${diff}` }],
    },
    {
      line: 2,
      highlight: 'unit',
      message: '把线段图对齐：多出来的“差”可以分成 2 格，所以每格是 24 ÷ 2 = 12。',
      badges: [{ label: '每格', value: `${unit}` }],
    },
    {
      line: 3,
      highlight: 'answer',
      message: `甲有 3 格：3×12=${a}；乙有 5 格：5×12=${b}。`,
      badges: [{ label: '甲', value: `${a}` }, { label: '乙', value: `${b}` }],
    },
    {
      line: 4,
      highlight: 'answer',
      message: `检验：${a}+${b}=${sum}，${b}-${a}=${diff}，完全正确！`,
      badges: [{ label: '检验', value: '通过' }],
    },
  ]
}

export const SegmentIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">线段图解题：把关系画出来</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">📏</div>
        <p>应用题最难的不是算，是“看不见关系”。线段图可以把关系变成画面！</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键：</strong>画出“谁多、谁少、差多少、和多少”。</p>
        <div className="concept-list">
          <span className="concept-item">🧱 一格代表一个单位</span>
          <span className="concept-item">➕ 看总和</span>
          <span className="concept-item">➖ 看差</span>
          <span className="concept-item">✅ 列式求解</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习画图步骤 →</button>
    </FadeIn>
  </div>
)

export const SegmentRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">画图步骤：四步搞定</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 写“和”</h4>
          <p>把总和写清楚。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 写“差”</h4>
          <p>谁多谁少，差多少。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 对齐线段</h4>
          <p>把短的对齐长的。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 找“单位格”</h4>
          <p>差可以分成几格？</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={560}>
      <LessonCode
        lines={[
          '已知：甲 + 乙 = 和',
          '已知：乙 - 甲 = 差',
          '差 ÷ 2 = 每格（单位量）',
          '甲 = 3×每格，乙 = 5×每格（看图上的格数）',
        ]}
        activeLine={0}
        runtimeTitle="先记住流程"
        runtimeHint="动画页会把这四步变成真正的线段图。"
      />
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const SegmentAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const frames = useMemo(() => buildFrames(), [])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1300)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]
  const sum = 96
  const diff = 24
  const unit = diff / 2

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：线段图一步一步来</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>甲和乙一共有 {sum} 个贴纸，乙比甲多 {diff} 个。甲、乙各有多少个？</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <SegmentBar aUnits={3} bUnits={5} unitLabel="12 个" highlight={frame.highlight} />
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            `1) 写和：甲 + 乙 = ${sum}`,
            `2) 写差：乙 - 甲 = ${diff}`,
            `3) 每格：${diff} ÷ 2 = ${unit}`,
            `4) 甲=3×${unit}=36，乙=5×${unit}=60`,
            `5) 检验：36+60=${sum}，60-36=${diff}`,
          ]}
          activeLine={frame.line}
          runtimeBadges={frame.badges}
          runtimeTitle="这一刻的信息"
          runtimeHint={frame.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const SegmentExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const sum = 84
  const diff = 12
  const unit = diff / 2
  const a = unit * 3
  const b = unit * 5

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">例题：和差问题</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>甲和乙一共有 {sum} 个贴纸，乙比甲多 {diff} 个。甲、乙各有多少？</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <div className="rule-box">
          <p><strong>第 1 步：</strong>每格 = {diff} ÷ 2 = {unit}</p>
          <p><strong>第 2 步：</strong>甲=3×{unit}={a}，乙=5×{unit}={b}</p>
        </div>
      </FadeIn>
      <FadeIn delay={820}>
        <button className="next-btn" onClick={onNext}>开始练习 →</button>
      </FadeIn>
    </div>
  )
}

export const SegmentPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 基础和差', question: '甲+乙=70，乙-甲=10，求甲。', answer: '30', hint: '先算每格：10÷2=5，再乘 3。' },
    { title: '② 求乙', question: '甲+乙=54，乙-甲=18，求乙。', answer: '36', hint: '每格=18÷2=9，乙=5×9。' },
    { title: '③ 自己检查', question: '甲+乙=96，乙-甲=24，求甲+乙 是否等于 96？写 “是” 或 “否”。', answer: '是', hint: '答案当然是“是”，记得检验。' },
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
      <FadeIn><h2 className="page-title">练习闯关：线段图</h2></FadeIn>
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
            <div className="celebration-message">画图高手！</div>
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

