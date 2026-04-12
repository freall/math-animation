import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type MulMethod = 'split' | 'factor' | 'associate'

const METHODS: Record<MulMethod, { title: string; tip: string; code: string[] }> = {
  split: {
    title: '拆分凑整（分配律）',
    tip: '把一个数拆成“好算的整十/整百”，再用分配律。',
    code: [
      'a × (b + c) = a × b + a × c',
      'a × (b - c) = a × b - a × c',
    ],
  },
  factor: {
    title: '提公因式',
    tip: '把相同的乘数提出来，变成更简单的算式。',
    code: [
      'a × b + a × c = a × (b + c)',
      'a × b - a × c = a × (b - c)',
    ],
  },
  associate: {
    title: '调整顺序（结合律）',
    tip: '先让乘积更好算：比如凑成 10、100、1000。',
    code: [
      '(a × b) × c = a × (b × c)',
      'a × b = b × a',
    ],
  },
}

const buildFrames = (a: number, b: number, method: MulMethod) => {
  if (method === 'split') {
    const b1 = Math.ceil(b / 10) * 10
    const b2 = b1 - b
    const op = b2 === 0 ? '+' : '-'
    const delta = Math.abs(b2)
    const frames = [
      { line: 0, message: `想让 ${b} 变好算，先凑到整十：${b} ≈ ${b1}` },
      { line: 1, message: `${b} = ${b1} ${op} ${delta}` },
      { line: 2, message: `${a} × ${b} = ${a} × (${b1} ${op} ${delta})` },
      { line: 3, message: `用分配律展开：${a} × ${b1} ${op} ${a} × ${delta}` },
      { line: 4, message: `分别计算：${a * b1} ${op} ${a * delta}` },
      { line: 5, message: `合起来得到答案：${a * b}` },
    ]
    return frames
  }

  if (method === 'factor') {
    const c = 2
    const frames = [
      { line: 0, message: `观察这个式子：${a}×${b} + ${a}×${c}` },
      { line: 1, message: `两项都有 ${a}，把它提出来。` },
      { line: 2, message: `${a}×${b} + ${a}×${c} = ${a}×(${b}+${c})` },
      { line: 3, message: `括号里先算：${b}+${c}=${b + c}` },
      { line: 4, message: `再乘：${a}×${b + c}=${a * (b + c)}` },
    ]
    return frames
  }

  const frames = [
    { line: 0, message: `想让乘法更快，可以先找一对能凑成整十/整百。` },
    { line: 1, message: `比如：25×4=100，125×8=1000。` },
    { line: 2, message: `如果有多个乘数，先把好算的组合在一起。` },
    { line: 3, message: `然后再乘剩下的数。` },
  ]
  return frames
}

export const MulIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">乘法巧算：凑出彩虹</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🌈</div>
        <p>有些乘法看起来很长，其实用“凑整”和“拆分”就能一下子算出来！</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>目标：</strong>把难算的乘法变成“好算的整十/整百/整千”。</p>
        <div className="concept-list">
          <span className="concept-item">🎯 凑整</span>
          <span className="concept-item">🧩 拆分</span>
          <span className="concept-item">🧠 用定律</span>
          <span className="concept-item">✅ 快速心算</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心方法 →</button>
    </FadeIn>
  </div>
)

export const MulRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [method, setMethod] = useState<MulMethod>('split')
  const current = METHODS[method]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">核心方法：三把钥匙</h2></FadeIn>
      <FadeIn delay={220}>
        <div className="sort-selector">
          {(['split', 'factor', 'associate'] as MulMethod[]).map((m) => (
            <button key={m} className={`sort-tab ${m === method ? 'active' : ''}`} onClick={() => setMethod(m)}>
              {METHODS[m].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <div className="tip-box">
          <span className="tip-icon">🔑</span>
          <p><strong>{current.title}：</strong>{current.tip}</p>
        </div>
      </FadeIn>
      <FadeIn delay={620}>
        <LessonCode lines={current.code} activeLine={0} runtimeTitle="记住这两行就够了" runtimeHint="我们会在动画里用它们把乘法变简单。" />
      </FadeIn>
      <FadeIn delay={860}>
        <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
      </FadeIn>
    </div>
  )
}

export const MulAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [method, setMethod] = useState<MulMethod>('split')
  const [a, setA] = useState(25)
  const [b, setB] = useState(35)
  const frames = useMemo(() => buildFrames(a, b, method), [a, b, method])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1200)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]

  const codeLines = useMemo(() => {
    if (method === 'split') {
      const b1 = Math.ceil(b / 10) * 10
      const b2 = b1 - b
      const op = b2 === 0 ? '+' : '-'
      const delta = Math.abs(b2)
      return [
        `1) 把 ${b} 凑整：${b} = ${b1} ${op} ${delta}`,
        `2) ${a} × ${b} = ${a} × (${b1} ${op} ${delta})`,
        `3) = ${a} × ${b1} ${op} ${a} × ${delta}`,
        `4) = ${a * b1} ${op} ${a * delta} = ${a * b}`,
      ]
    }

    if (method === 'factor') {
      return [
        `1) 观察：${a}×${b} + ${a}×2`,
        `2) 提公因式：= ${a}×(${b}+2)`,
        `3) 先算括号：= ${a}×${b + 2}`,
        `4) 得到：= ${a * (b + 2)}`,
      ]
    }

    return [
      '1) 先找能凑整的一对',
      '2) 用结合律先算好算的',
      '3) 再乘剩下的数',
      '4) 得到答案',
    ]
  }, [a, b, method])

  const runtimeBadges = useMemo(() => {
    if (method === 'split') {
      const b1 = Math.ceil(b / 10) * 10
      const delta = Math.abs(b1 - b)
      return [
        { label: 'a', value: `${a}` },
        { label: 'b', value: `${b}` },
        { label: '凑整到', value: `${b1}` },
        { label: '差', value: `${delta}` },
        { label: '结果', value: `${a * b}` },
      ]
    }
    if (method === 'factor') {
      return [
        { label: 'a', value: `${a}` },
        { label: 'b', value: `${b}` },
        { label: '括号', value: `${b}+2=${b + 2}` },
        { label: '结果', value: `${a * (b + 2)}` },
      ]
    }
    return [
      { label: '提示', value: '优先凑 10/100/1000' },
      { label: '例子', value: '25×4=100' },
    ]
  }, [a, b, method])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：让乘法变好算</h2></FadeIn>
      <FadeIn delay={220}>
        <div className="sort-selector">
          {(['split', 'factor', 'associate'] as MulMethod[]).map((m) => (
            <button key={m} className={`sort-tab ${m === method ? 'active' : ''}`} onClick={() => setMethod(m)}>
              {METHODS[m].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <div className="mul-inputs">
          <div className="mul-input">
            <span>第一个数</span>
            <input type="number" value={a} min={1} max={200} onChange={(e) => setA(parseInt(e.target.value || '0'))} />
          </div>
          <div className="mul-input">
            <span>第二个数</span>
            <input type="number" value={b} min={1} max={200} onChange={(e) => setB(parseInt(e.target.value || '0'))} />
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={620}>
        <LessonCode lines={codeLines} activeLine={Math.max(0, Math.min(frame.line, codeLines.length - 1))} runtimeBadges={runtimeBadges} runtimeTitle="这一刻的数值" runtimeHint={frame.message} />
      </FadeIn>
      <FadeIn delay={900}>
        <div className="answer-box">
          <span className="answer-icon">🧮</span>
          <p>
            {a} × {b} = <strong>{a * b}</strong>
          </p>
          <p className="explanation">动画会循环播放关键步骤，帮助你记住方法。</p>
        </div>
      </FadeIn>
      <FadeIn delay={1180}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const MulExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：25 × 35</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>不用竖式，用巧算算出 25 × 35。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>把 35 凑整：35 = 40 - 5</p>
        <p><strong>第 2 步：</strong>25 × 35 = 25 × (40 - 5)</p>
        <p><strong>第 3 步：</strong>= 25×40 - 25×5 = 1000 - 125</p>
        <p><strong>第 4 步：</strong>= <strong>875</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={880}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const MulPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 凑整拆分', question: '用巧算算：25 × 44 = ?', answer: 1100, hint: '把 44 拆成 40 + 4。' },
    { title: '② 分配律', question: '用巧算算：18 × 125 = ?', answer: 2250, hint: '125×8=1000，试试把 18 拆成 16+2。' },
    { title: '③ 提公因式', question: '用巧算算：27×99 = ?', answer: 2673, hint: '99 = 100 - 1。' },
  ]

  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const ok = parseInt(value) === problem.answer
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
      <FadeIn><h2 className="page-title">练习闯关：乘法巧算</h2></FadeIn>
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
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="请输入答案" />
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
            <div className="celebration-message">你太快啦！</div>
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

