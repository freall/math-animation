import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

const toGrams = (kg: number, g: number) => kg * 1000 + g

const WeightScale = ({
  leftLabel,
  rightLabel,
  leftGrams,
  rightGrams,
}: {
  leftLabel: string
  rightLabel: string
  leftGrams: number
  rightGrams: number
}) => {
  const diff = leftGrams - rightGrams
  const angle = Math.max(-10, Math.min(10, diff / 120))
  const tilt = rightGrams > leftGrams ? -angle : angle

  return (
    <div className="weight-scale">
      <div className="weight-scale-top" style={{ transform: `rotate(${tilt}deg)` }}>
        <div className="weight-pan">
          <div className="weight-pan-title">{leftLabel}</div>
          <div className="weight-pan-value">{leftGrams} g</div>
        </div>
        <div className="weight-beam" />
        <div className="weight-pan">
          <div className="weight-pan-title">{rightLabel}</div>
          <div className="weight-pan-value">{rightGrams} g</div>
        </div>
      </div>
      <div className="weight-stand" />
      <div className="weight-result">{diff === 0 ? '平衡' : diff > 0 ? '左边更重' : '右边更重'}</div>
    </div>
  )
}

export const KiloIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">千克的初步：认识重量</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">⚖️</div>
        <p>买水果、称体重、带书包，我们都会遇到“重量”。今天学会克和千克，就能算得更准。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键：</strong>千克和克是同一种“重量单位”，只是大小不同。</p>
        <div className="concept-list">
          <span className="concept-item">🧱 1 千克 = 1000 克</span>
          <span className="concept-item">➕ 可以加减</span>
          <span className="concept-item">🔁 可以换算</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心规则 →</button>
    </FadeIn>
  </div>
)

export const KiloRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心规则：1 千克 = 1000 克</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="formula-box">
        <div className="formula" style={{ fontSize: '1.35rem' }}>
          1 kg = 1000 g
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <LessonCode
        lines={[
          '把 kg 换成 g：g = kg × 1000',
          '把 g 换成 kg：kg = g ÷ 1000',
          '混合单位：2kg 300g = 2300g',
          '做加减：先统一单位再计算',
        ]}
        activeLine={0}
        runtimeTitle="记住这 4 句"
        runtimeHint="动画页会用天平把它们变得直观。"
      />
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const KiloAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [leftKg, setLeftKg] = useState(1)
  const [leftG, setLeftG] = useState(200)
  const [rightKg, setRightKg] = useState(0)
  const [rightG, setRightG] = useState(1200)

  const left = toGrams(leftKg, leftG)
  const right = toGrams(rightKg, rightG)

  const frames = useMemo(
    () => [
      { line: 0, message: '先把两边都换算成克，才能公平比较。' },
      { line: 1, message: `左边：${leftKg}kg ${leftG}g = ${leftKg}×1000+${leftG} = ${left}g` },
      { line: 2, message: `右边：${rightKg}kg ${rightG}g = ${rightKg}×1000+${rightG} = ${right}g` },
      { line: 3, message: `比较：${left}g 和 ${right}g，看看谁更重。` },
    ],
    [left, leftG, leftKg, right, rightG, rightKg]
  )

  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1100)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：天平与换算</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="kilo-inputs">
          <div className="kilo-card">
            <strong>左边</strong>
            <div className="kilo-row">
              <label>kg</label>
              <input type="number" value={leftKg} min={0} max={10} onChange={(e) => setLeftKg(parseInt(e.target.value || '0'))} />
              <label>g</label>
              <input type="number" value={leftG} min={0} max={999} onChange={(e) => setLeftG(parseInt(e.target.value || '0'))} />
            </div>
          </div>
          <div className="kilo-card">
            <strong>右边</strong>
            <div className="kilo-row">
              <label>kg</label>
              <input type="number" value={rightKg} min={0} max={10} onChange={(e) => setRightKg(parseInt(e.target.value || '0'))} />
              <label>g</label>
              <input type="number" value={rightG} min={0} max={999} onChange={(e) => setRightG(parseInt(e.target.value || '0'))} />
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <WeightScale leftLabel="左边" rightLabel="右边" leftGrams={left} rightGrams={right} />
      </FadeIn>
      <FadeIn delay={780}>
        <LessonCode
          lines={[
            '统一单位：把 kg 都换成 g',
            `左边：${leftKg}kg ${leftG}g = ${left}g`,
            `右边：${rightKg}kg ${rightG}g = ${right}g`,
            `比较：${left}g ? ${right}g`,
          ]}
          activeLine={frame.line}
          runtimeBadges={[
            { label: '左边', value: `${left}g` },
            { label: '右边', value: `${right}g` },
          ]}
          runtimeTitle="这一刻的数值"
          runtimeHint={frame.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const KiloExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：换算再计算</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>小明的书包重 2kg 350g，又装进了 650g 的水壶。现在书包一共多重？</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>2kg 350g = 2350g</p>
        <p><strong>第 2 步：</strong>2350g + 650g = <strong>3000g</strong></p>
        <p><strong>第 3 步：</strong>3000g = <strong>3kg</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const KiloPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① kg→g', question: '1kg 80g = ? g（只写数字）', answer: '1080', hint: '1kg=1000g，再加 80g。' },
    { title: '② g→kg', question: '2500g = ? kg（只写数字，可以有小数）', answer: '2.5', hint: '2500 ÷ 1000。' },
    { title: '③ 加减', question: '3kg 200g - 850g = ? g（只写数字）', answer: '2350', hint: '先变成克：3200-850。' },
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
      <FadeIn><h2 className="page-title">练习闯关：千克与克</h2></FadeIn>
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
            <div className="celebration-message">单位小达人！</div>
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

