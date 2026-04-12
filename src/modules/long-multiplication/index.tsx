import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type MultStep = {
  line: number
  message: string
  activePos: number
  activeDigit: number
  carry: number
  partials: number[]
  badges: { label: string; value: string }[]
}

const digitsOf = (n: number) => String(Math.max(0, Math.floor(n))).split('').map((d) => parseInt(d))

const generateLongMultiplicationSteps = (a: number, b: number): MultStep[] => {
  const aDigits = digitsOf(a).reverse()
  const bDigits = digitsOf(b).reverse()
  const steps: MultStep[] = []
  const partials: number[] = []

  steps.push({
    line: 0,
    message: `先对齐数位，把 ${a} 和 ${b} 竖着写好。`,
    activePos: 0,
    activeDigit: bDigits[0],
    carry: 0,
    partials: [],
    badges: [{ label: '被乘数', value: `${a}` }, { label: '乘数', value: `${b}` }],
  })

  for (let bi = 0; bi < bDigits.length; bi++) {
    const digit = bDigits[bi]
    let carry = 0
    let partial = 0
    steps.push({
      line: 1,
      message: `从乘数的第 ${bi + 1} 位开始（${digit}），从个位往左乘。`,
      activePos: bi,
      activeDigit: digit,
      carry,
      partials: [...partials],
      badges: [{ label: '当前乘数位', value: `${digit}` }, { label: '进位', value: `${carry}` }],
    })

    for (let ai = 0; ai < aDigits.length; ai++) {
      const prod = digit * aDigits[ai] + carry
      const write = prod % 10
      carry = Math.floor(prod / 10)
      partial += write * Math.pow(10, ai)
      steps.push({
        line: 2,
        message: `${digit} × ${aDigits[ai]} + 进位 = ${prod}，写 ${write}，进位变成 ${carry}。`,
        activePos: bi,
        activeDigit: digit,
        carry,
        partials: [...partials],
        badges: [
          { label: '写下', value: `${write}` },
          { label: '新的进位', value: `${carry}` },
          { label: '当前部分积', value: `${partial}` },
        ],
      })
    }

    if (carry > 0) {
      partial += carry * Math.pow(10, aDigits.length)
      steps.push({
        line: 3,
        message: `最后还有进位 ${carry}，把它写到最前面。`,
        activePos: bi,
        activeDigit: digit,
        carry: 0,
        partials: [...partials],
        badges: [{ label: '部分积', value: `${partial}` }],
      })
    }

    const shifted = partial * Math.pow(10, bi)
    partials.push(shifted)
    steps.push({
      line: 4,
      message: `这一行算完，记得向左移动 ${bi} 位（相当于乘 10 的 ${bi} 次方）。`,
      activePos: bi,
      activeDigit: digit,
      carry: 0,
      partials: [...partials],
      badges: [{ label: '这一行结果', value: `${shifted}` }],
    })
  }

  const result = partials.reduce((sum, v) => sum + v, 0)
  steps.push({
    line: 5,
    message: `把每一行的部分积加起来，得到答案：${result}。`,
    activePos: bDigits.length - 1,
    activeDigit: bDigits[bDigits.length - 1],
    carry: 0,
    partials: [...partials],
    badges: [{ label: '答案', value: `${result}` }],
  })

  return steps
}

const MultBoard = ({
  a,
  b,
  step,
}: {
  a: number
  b: number
  step: MultStep
}) => (
  <div className="mult-board">
    <div className="mult-row">
      <span className="mult-label">被乘数</span>
      <strong>{a}</strong>
    </div>
    <div className="mult-row">
      <span className="mult-label">乘数</span>
      <strong>{b}</strong>
    </div>
    <div className="mult-row">
      <span className="mult-label">部分积</span>
      <div className="mult-partials">
        {step.partials.length ? step.partials.map((p, idx) => <span key={`${p}-${idx}`} className="mult-pill">{p}</span>) : <span className="mult-pill muted">（还没算到）</span>}
      </div>
    </div>
  </div>
)

export const MultIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">乘法竖式：果兴而来</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🍎</div>
        <p>一篮苹果每袋 38 个，有 217 袋，一共多少个？用乘法竖式就能又快又稳算出来。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键：</strong>数位对齐，从个位开始乘，满十就进位。</p>
        <div className="concept-list">
          <span className="concept-item">📍 对齐</span>
          <span className="concept-item">✖️ 从个位乘</span>
          <span className="concept-item">⬆️ 进位</span>
          <span className="concept-item">➕ 加部分积</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心步骤 →</button>
    </FadeIn>
  </div>
)

export const MultRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心步骤：对齐 → 相乘 → 进位 → 相加</h2></FadeIn>
    <FadeIn delay={260}>
      <LessonCode
        lines={[
          '1) 写竖式：个位对齐',
          '2) 从乘数个位开始乘',
          '3) 乘完一行，下一行向左移一位',
          '4) 把每行部分积相加',
          '5) 末尾有 0：先不写 0，最后再补 0',
        ]}
        activeLine={1}
        runtimeTitle="像搭积木一样"
        runtimeHint="动画页会把“每一行部分积”清清楚楚展示出来。"
      />
    </FadeIn>
    <FadeIn delay={780}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const MultAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [a, setA] = useState(217)
  const [b, setB] = useState(38)
  const safeA = Math.max(10, Math.min(999, Math.floor(a || 10)))
  const safeB = Math.max(10, Math.min(99, Math.floor(b || 10)))
  const steps = useMemo(() => generateLongMultiplicationSteps(safeA, safeB), [safeA, safeB])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= steps.length - 1 ? 0 : prev + 1)), 1100)
    return () => clearInterval(timer)
  }, [steps.length])

  const step = steps[cursor]
  const result = safeA * safeB

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：竖式乘法怎么走？</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="mul-inputs">
          <div className="mul-input">
            <span>被乘数（2~3 位）</span>
            <input type="number" value={safeA} min={10} max={999} onChange={(e) => setA(parseInt(e.target.value || '10'))} />
          </div>
          <div className="mul-input">
            <span>乘数（2 位）</span>
            <input type="number" value={safeB} min={10} max={99} onChange={(e) => setB(parseInt(e.target.value || '10'))} />
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <MultBoard a={safeA} b={safeB} step={step} />
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            '写竖式：个位对齐',
            '从乘数的这一位开始乘',
            '写下个位，十位进位',
            '这一行结束，写出进位',
            '下一行左移一位，继续乘',
            `最后把部分积相加 = ${result}`,
          ]}
          activeLine={step.line}
          runtimeBadges={step.badges}
          runtimeTitle="这一刻发生了什么"
          runtimeHint={step.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const MultExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：217 × 38</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>用竖式计算 217 × 38。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 行：</strong>217 × 8 = 1736</p>
        <p><strong>第 2 行：</strong>217 × 30 = 6510（左移一位）</p>
        <p><strong>相加：</strong>1736 + 6510 = <strong>8246</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const MultPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 两位乘两位', question: '计算：36 × 17 = ?', answer: '612', hint: '先算 36×7，再算 36×10。' },
    { title: '② 末尾有 0', question: '计算：560 × 90 = ?（只写数字）', answer: '50400', hint: '先算 56×9=504，再补两个 0。' },
    { title: '③ 再挑战', question: '计算：125 × 48 = ?（只写数字）', answer: '6000', hint: '125×8=1000，48=6×8。' },
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
      <FadeIn><h2 className="page-title">练习闯关：乘法竖式</h2></FadeIn>
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
            <div className="celebration-message">乘法高手！</div>
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

