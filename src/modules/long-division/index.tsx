import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type DivisionStep = {
  line: number
  message: string
  activePos: number
  currentChunk: number
  qSoFar: string
  remainder: number
  badges: { label: string; value: string }[]
}

const splitDigits = (n: number) => String(Math.max(0, Math.floor(n))).split('').map((d) => parseInt(d))

const generateDivisionSteps = (dividend: number, divisor: number): DivisionStep[] => {
  const digits = splitDigits(dividend)
  const steps: DivisionStep[] = []
  let remainder = 0
  let q = ''

  steps.push({
    line: 0,
    message: `先写出竖式：${dividend} ÷ ${divisor}。我们从最高位开始走台阶。`,
    activePos: 0,
    currentChunk: digits[0],
    qSoFar: '',
    remainder,
    badges: [{ label: '被除数', value: `${dividend}` }, { label: '除数', value: `${divisor}` }],
  })

  for (let i = 0; i < digits.length; i++) {
    const currentChunk = remainder * 10 + digits[i]
    const qDigit = Math.floor(currentChunk / divisor)
    const product = qDigit * divisor
    const nextRemainder = currentChunk - product
    q += String(qDigit)

    steps.push({
      line: 1,
      message: `看这一段：${currentChunk} ÷ ${divisor}，商是 ${qDigit}。`,
      activePos: i,
      currentChunk,
      qSoFar: q,
      remainder,
      badges: [{ label: '当前段', value: `${currentChunk}` }, { label: '商（这一位）', value: `${qDigit}` }],
    })

    steps.push({
      line: 2,
      message: `乘：${qDigit} × ${divisor} = ${product}。`,
      activePos: i,
      currentChunk,
      qSoFar: q,
      remainder,
      badges: [{ label: '乘积', value: `${product}` }],
    })

    steps.push({
      line: 3,
      message: `减：${currentChunk} - ${product} = ${nextRemainder}（这就是余数）。`,
      activePos: i,
      currentChunk,
      qSoFar: q,
      remainder: nextRemainder,
      badges: [{ label: '余数', value: `${nextRemainder}` }],
    })

    remainder = nextRemainder
    if (i < digits.length - 1) {
      steps.push({
        line: 4,
        message: `落：把下一位 ${digits[i + 1]} 落下来，继续算。`,
        activePos: i + 1,
        currentChunk: remainder * 10 + digits[i + 1],
        qSoFar: q,
        remainder,
        badges: [{ label: '下一位', value: `${digits[i + 1]}` }],
      })
    }
  }

  const quotient = parseInt(q, 10)
  steps.push({
    line: 5,
    message: `竖式完成：商是 ${quotient}，余数是 ${remainder}。可以检验：${divisor}×${quotient}+${remainder}=${dividend}。`,
    activePos: digits.length - 1,
    currentChunk: digits[digits.length - 1],
    qSoFar: q,
    remainder,
    badges: [{ label: '商', value: `${quotient}` }, { label: '余数', value: `${remainder}` }],
  })

  return steps
}

const DivisionBoard = ({
  dividend,
  divisor,
  step,
}: {
  dividend: number
  divisor: number
  step: DivisionStep
}) => {
  const digits = splitDigits(dividend)
  return (
    <div className="division-board">
      <div className="division-top">
        <div className="division-quotient">
          <span>商：</span>
          <strong>{parseInt(step.qSoFar || '0', 10)}</strong>
          <span className="division-remainder">余数：{step.remainder}</span>
        </div>
      </div>
      <div className="division-row">
        <div className="division-divisor">{divisor}</div>
        <div className="division-bracket">)</div>
        <div className="division-digits">
          {digits.map((d, idx) => (
            <div key={idx} className={`division-digit ${idx === step.activePos ? 'active' : ''}`}>
              {d}
            </div>
          ))}
        </div>
      </div>
      <div className="division-hint">
        当前算到第 {step.activePos + 1} 位：这一段是 <strong>{step.currentChunk}</strong>
      </div>
    </div>
  )
}

export const DivIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">除法竖式：蓝色牧场</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🐑</div>
        <p>牧场里要把草料平均分给小羊。除法竖式就像“走台阶”，一步一步把答案走出来。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>竖式除法的节奏：</strong>商 → 乘 → 减 → 落，重复直到算完。</p>
        <div className="concept-list">
          <span className="concept-item">🧮 商</span>
          <span className="concept-item">✖️ 乘</span>
          <span className="concept-item">➖ 减</span>
          <span className="concept-item">⬇️ 落</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心步骤 →</button>
    </FadeIn>
  </div>
)

export const DivRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心步骤：商乘减落</h2></FadeIn>
    <FadeIn delay={260}>
      <LessonCode
        lines={[
          '1) 看：从最高位开始取一段',
          '2) 商：这一段 ÷ 除数，写商',
          '3) 乘：商 × 除数',
          '4) 减：这一段 - 乘积 = 余数',
          '5) 落：把下一位落下来，继续',
          '6) 最后：商 + 余数，记得检验',
        ]}
        activeLine={1}
        runtimeTitle="像走台阶"
        runtimeHint="如果商中间出现 0，也要写 0 占位。"
      />
    </FadeIn>
    <FadeIn delay={760}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const DivAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [dividend, setDividend] = useState(3609)
  const [divisor, setDivisor] = useState(6)

  const safeDivisor = Math.max(2, Math.min(9, Math.floor(divisor || 2)))
  const safeDividend = Math.max(0, Math.min(9999, Math.floor(dividend || 0)))

  const steps = useMemo(() => generateDivisionSteps(safeDividend, safeDivisor), [safeDividend, safeDivisor])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= steps.length - 1 ? 0 : prev + 1)), 1000)
    return () => clearInterval(timer)
  }, [steps.length])

  const step = steps[cursor]
  const quotient = Math.floor(safeDividend / safeDivisor)
  const remainder = safeDividend % safeDivisor

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：竖式一步一步走</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="kilo-inputs">
          <div className="kilo-card">
            <strong>被除数</strong>
            <div className="kilo-row" style={{ gridTemplateColumns: '1fr' }}>
              <input type="number" value={safeDividend} min={0} max={9999} onChange={(e) => setDividend(parseInt(e.target.value || '0'))} />
            </div>
          </div>
          <div className="kilo-card">
            <strong>除数（2~9）</strong>
            <div className="kilo-row" style={{ gridTemplateColumns: '1fr' }}>
              <input type="number" value={safeDivisor} min={2} max={9} onChange={(e) => setDivisor(parseInt(e.target.value || '2'))} />
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <DivisionBoard dividend={safeDividend} divisor={safeDivisor} step={step} />
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            '看 → 商',
            `商：${step.currentChunk} ÷ ${safeDivisor} = ${Math.floor(step.currentChunk / safeDivisor)}`,
            `乘：${Math.floor(step.currentChunk / safeDivisor)} × ${safeDivisor}`,
            '减：得到余数',
            '落：落下一位继续',
            `完成：商=${quotient}，余数=${remainder}`,
          ]}
          activeLine={step.line}
          runtimeBadges={step.badges}
          runtimeTitle="这一刻的动作"
          runtimeHint={step.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const DivExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：商中间有 0</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>用竖式计算：3609 ÷ 6</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>关键提醒：</strong>当某一段不够除时，商要写 <strong>0</strong> 占位。</p>
        <p>最后检验：6 × 601 + 3 = 3609。</p>
      </div>
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const DivPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 基础', question: '计算：784 ÷ 8 = ?', answer: '98', hint: '从 7 开始，走商乘减落。' },
    { title: '② 再来一题', question: '计算：624 ÷ 6 = ?', answer: '104', hint: '商可能出现 0，占位别忘了。' },
    { title: '③ 有余数', question: '计算：203 ÷ 6 = ?（格式：商…余…）', answer: '商33余5', hint: '先算商，再写余数。' },
  ]

  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const input = value.trim().replace(/\s+/g, '')
    const ok = input === problem.answer
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
      <FadeIn><h2 className="page-title">练习闯关：除法竖式</h2></FadeIn>
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
            <div className="celebration-message">除法高手！</div>
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

