import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, Star } from '../../components/animations'
import '../../App.css'

type HeightMap = number[][]

const sumHeights = (map: HeightMap) => map.reduce((sum, row) => sum + row.reduce((inner, v) => inner + v, 0), 0)

const buildLayers = (map: HeightMap) => {
  const maxH = Math.max(...map.flat())
  return Array.from({ length: maxH }, (_, layer) => layer + 1)
}

const BlockTower = ({ height, highlight }: { height: number; highlight: boolean }) => (
  <div className={`tower ${highlight ? 'active' : ''}`}>
    {Array.from({ length: height }, (_, idx) => (
      <div key={idx} className="cube">{idx === height - 1 ? '🧊' : ''}</div>
    ))}
    {height === 0 ? <div className="cube empty" /> : null}
  </div>
)

const HeightMapBoard = ({
  map,
  highlight,
}: {
  map: HeightMap
  highlight?: { r: number; c: number } | null
}) => (
  <div className="height-map-board">
    {map.map((row, r) => (
      <div key={r} className="height-map-row">
        {row.map((value, c) => (
          <div key={`${r}-${c}`} className={`height-map-cell ${highlight && highlight.r === r && highlight.c === c ? 'active' : ''}`}>
            <BlockTower height={value} highlight={!!(highlight && highlight.r === r && highlight.c === c)} />
            <div className="height-number">{value}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
)

export const ShapeIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">搭配图形：用方块搭建</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🧱</div>
        <p>小朋友用小方块搭出立体积木。我们要学会：怎么又快又准地数出一共用了多少个方块。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键想法：</strong>把立体拆成一根根“小柱子”，每根柱子有几层就有几个方块。</p>
        <div className="concept-list">
          <span className="concept-item">👀 先看每个位置有多高</span>
          <span className="concept-item">➕ 把所有高度加起来</span>
          <span className="concept-item">✅ 就得到方块总数</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心规则 →</button>
    </FadeIn>
  </div>
)

export const ShapeRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心规则：一格一根柱子</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="formula-box">
        <div className="formula" style={{ fontSize: '1.3rem' }}>
          总方块数 = 所有格子的高度相加
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 看高度</h4>
          <p>每个格子数字表示“堆了几层”。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 数柱子</h4>
          <p>每层就是一个方块。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 做加法</h4>
          <p>把所有柱子的高度加起来。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 复查</h4>
          <p>想一想有没有漏掉的位置。</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const ShapeAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const map = useMemo<HeightMap>(() => [[2, 1, 0], [1, 3, 1], [0, 1, 2]], [])
  const [cursor, setCursor] = useState(0)
  const flat = useMemo(() => map.flat(), [map])
  const positions = useMemo(() => {
    const pos: { r: number; c: number; height: number }[] = []
    map.forEach((row, r) => row.forEach((height, c) => pos.push({ r, c, height })))
    return pos.filter((p) => p.height > 0)
  }, [map])

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= positions.length ? 0 : prev + 1)), 850)
    return () => clearInterval(timer)
  }, [positions.length])

  const learnedCount = cursor === 0 ? 0 : positions.slice(0, Math.min(cursor, positions.length)).reduce((sum, p) => sum + p.height, 0)
  const highlight = cursor === 0 ? null : positions[Math.min(cursor, positions.length) - 1]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：一根根柱子数</h2></FadeIn>
      <FadeIn delay={260}>
        <HeightMapBoard map={map} highlight={highlight ? { r: highlight.r, c: highlight.c } : null} />
      </FadeIn>
      <FadeIn delay={520}>
        <div className="tip-box">
          <span className="tip-icon">🧮</span>
          <p>
            {cursor === 0
              ? '先从第一根柱子开始数：每根柱子的“高度”就是方块数量。'
              : `现在数到第 ${Math.min(cursor, positions.length)} 根柱子：高度是 ${highlight?.height ?? 0}，目前已数到 ${learnedCount} 个方块。`}
          </p>
        </div>
      </FadeIn>
      <FadeIn delay={780}>
        <div className="answer-box">
          <span className="answer-icon">✅</span>
          <p>全部数完：总方块数 = <strong>{sumHeights(map)}</strong></p>
          <p className="explanation">把每格的高度都加起来就行。</p>
        </div>
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const ShapeExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const map = useMemo<HeightMap>(() => [[1, 2, 1], [0, 3, 0]], [])
  const total = sumHeights(map)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">例题：数一数用了几块</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>下面的高度表代表积木：每个数字表示这一格堆了几层。求一共用了多少个小方块。</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <HeightMapBoard map={map} />
      </FadeIn>
      <FadeIn delay={820}>
        <div className="rule-box">
          <p><strong>做法：</strong>把所有高度加起来：1 + 2 + 1 + 3 = {total}</p>
        </div>
      </FadeIn>
      <FadeIn delay={1060}>
        <button className="next-btn" onClick={onNext}>开始练习 →</button>
      </FadeIn>
    </div>
  )
}

export const ShapePracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    {
      title: '① 直接加高度',
      question: '高度表：[[1, 0], [2, 1]]，总方块数是多少？',
      answer: 4,
      hint: '把 1、2、1 加起来。',
    },
    {
      title: '② 看清 0',
      question: '高度表：[[0, 3, 0], [1, 1, 1]]，总方块数是多少？',
      answer: 6,
      hint: '0 表示这个位置没有方块。',
    },
    {
      title: '③ 再挑战',
      question: '高度表：[[2, 2], [2, 2]]，总方块数是多少？',
      answer: 8,
      hint: '四个位置，每个高度 2。',
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
      <FadeIn><h2 className="page-title">练习闯关：搭积木数方块</h2></FadeIn>
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
                <p className="explanation">正确答案：{problem.answer}</p>
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
    </div>
  )
}
