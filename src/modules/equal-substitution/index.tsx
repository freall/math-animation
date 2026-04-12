import React, { useMemo, useState } from 'react'
import { FadeIn, Star } from '../../components/animations'
import '../../App.css'

type Token = {
  id: string
  label: string
  kind?: 'swap'
}

const TokenRow = ({ tokens, activeIds }: { tokens: Token[]; activeIds?: Set<string> }) => (
  <div className="token-row">
    {tokens.map((t) => (
      <span
        key={t.id}
        className={`token-chip ${t.kind === 'swap' ? 'swap' : ''} ${activeIds?.has(t.id) ? 'active' : ''}`}
      >
        {t.label}
      </span>
    ))}
  </div>
)

const Celebration = ({ show }: { show: boolean }) =>
  show ? (
    <div className="stars-container" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => {
        const left = `${8 + ((i * 37) % 84)}%`
        const top = `${10 + ((i * 29) % 78)}%`
        const delay = `${(i % 6) * 0.12}s`
        const size = 22 + ((i * 7) % 18)
        return <Star key={i} style={{ left, top, width: size, height: size, animationDelay: delay }} />
      })}
    </div>
  ) : null

export const EqIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>
      ← 返回目录
    </button>
    <FadeIn>
      <h2 className="page-title">等量代换：会换的等号</h2>
    </FadeIn>
    <FadeIn delay={220}>
      <div className="story-box">
        <div className="story-icon">⚖️</div>
        <p>
          想像有一台“公平天平”：左边和右边一样重，就说明它们<strong>一样多</strong>。
        </p>
      </div>
    </FadeIn>
    <FadeIn delay={420}>
      <div className="concept-box">
        <p>
          <strong>等量代换</strong>就是：
        </p>
        <div className="concept-list">
          <span className="concept-item">✅ 如果 A 和 B 一样多（A = B）</span>
          <span className="concept-item">🔁 那么在任何式子里，都可以把 A 换成 B</span>
          <span className="concept-item">🧠 换完更简单，就更好算</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={720}>
      <button className="next-btn" onClick={onNext}>
        学习核心规则 →
      </button>
    </FadeIn>
  </div>
)

export const EqRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>
      ← 返回目录
    </button>
    <FadeIn>
      <h2 className="page-title">核心规则：能换就能算</h2>
    </FadeIn>
    <FadeIn delay={220}>
      <div className="formula-box">
        <div className="formula" style={{ fontSize: '1.25rem' }}>
          如果 A = B，那么在任何式子里：A 可以换成 B，B 也可以换成 A
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={440}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 找等量</h4>
          <p>先从题目里找到“谁等于谁”。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 选替身</h4>
          <p>选一个更好算的替身去代换。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 代换化简</h4>
          <p>把难的换成简单的，再合并。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 检验</h4>
          <p>把结果代回去看看对不对。</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={740}>
      <button className="next-btn" onClick={onNext}>
        看动画讲解 →
      </button>
    </FadeIn>
  </div>
)

export const EqAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  type EqStep = { title: string; tip: string; row: Token[]; active: Set<string>; result?: number }

  const steps = useMemo<EqStep[]>(() => {
    const base: Token[] = [
      { id: 'a1', label: '🍎' },
      { id: 'plus1', label: '+' },
      { id: 'a2', label: '🍎' },
      { id: 'plus2', label: '+' },
      { id: 'b1', label: '🍌' },
    ]

    const swapped: Token[] = [
      { id: 'b2', label: '🍌', kind: 'swap' as const },
      { id: 'b3', label: '🍌', kind: 'swap' as const },
    ]

    return [
      {
        title: '先记住等量关系',
        tip: '这里规定：🍎 = 🍌 + 🍌（一个苹果等于两根香蕉）。',
        row: base,
        active: new Set<string>(),
      },
      {
        title: '把第一个 🍎 换成两根 🍌',
        tip: '看到 🍎，就可以用 🍌🍌 来代换。',
        row: [swapped[0], swapped[1], { id: 'plus1', label: '+' }, { id: 'a2', label: '🍎' }, { id: 'plus2', label: '+' }, { id: 'b1', label: '🍌' }],
        active: new Set(['b2', 'b3']),
      },
      {
        title: '把第二个 🍎 也换掉',
        tip: '再把另一个 🍎 也代换成 🍌🍌。',
        row: [
          { id: 'b2', label: '🍌', kind: 'swap' as const },
          { id: 'b3', label: '🍌', kind: 'swap' as const },
          { id: 'plus1', label: '+' },
          { id: 'b4', label: '🍌', kind: 'swap' as const },
          { id: 'b5', label: '🍌', kind: 'swap' as const },
          { id: 'plus2', label: '+' },
          { id: 'b1', label: '🍌' },
        ],
        active: new Set(['b4', 'b5']),
      },
      {
        title: '现在就变成“数香蕉”了',
        tip: '一共 5 根香蕉，所以答案是 5。',
        row: [
          { id: 'b2', label: '🍌' },
          { id: 'b3', label: '🍌' },
          { id: 'b4', label: '🍌' },
          { id: 'b5', label: '🍌' },
          { id: 'b1', label: '🍌' },
        ],
        active: new Set(['b1', 'b2', 'b3', 'b4', 'b5']),
        result: 5,
      },
    ]
  }, [])

  const [step, setStep] = useState(0)
  const current = steps[step]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        ← 返回目录
      </button>
      <FadeIn>
        <h2 className="page-title">动画讲解：一步一步把难的换成简单的</h2>
      </FadeIn>
      <FadeIn delay={220}>
        <div className="example-box">
          <h3>🧩 小任务</h3>
          <p>已知：🍎 = 🍌 + 🍌。那么：🍎 + 🍎 + 🍌 等于多少根 🍌？</p>
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <div className="eq-stage">
          <div className="eq-stage-title">{current.title}</div>
          <TokenRow tokens={current.row} activeIds={current.active} />
          <div className="eq-stage-tip">{current.tip}</div>
          {typeof current.result === 'number' ? (
            <div className="answer-box">
              <span className="answer-icon">✅</span>
              <p>
                答案：<strong>{current.result}</strong> 根 🍌
              </p>
            </div>
          ) : null}
        </div>
      </FadeIn>
      <FadeIn delay={640}>
        <div className="practice-actions">
          <button className="nav-btn" type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            上一步
          </button>
          {step < steps.length - 1 ? (
            <button className="next-btn" type="button" onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}>
              下一步 →
            </button>
          ) : (
            <button className="next-btn" type="button" onClick={onNext}>
              看一道例题 →
            </button>
          )}
        </div>
      </FadeIn>
    </div>
  )
}

export const EqExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>
      ← 返回目录
    </button>
    <FadeIn>
      <h2 className="page-title">例题：代换让式子更短</h2>
    </FadeIn>
    <FadeIn delay={220}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>已知：⭐ = 🍬🍬🍬（一颗星星等于 3 颗糖）。问：⭐ + 🍬🍬 等于多少颗 🍬？</p>
      </div>
    </FadeIn>
    <FadeIn delay={440}>
      <div className="rule-box">
        <p>
          <strong>① 代换：</strong>⭐ 换成 🍬🍬🍬
        </p>
        <p>
          <strong>② 合并：</strong>🍬🍬🍬 + 🍬🍬 = 🍬🍬🍬🍬🍬
        </p>
        <p>
          <strong>③ 答案：</strong>一共 5 颗 🍬
        </p>
      </div>
    </FadeIn>
    <FadeIn delay={720}>
      <button className="next-btn" onClick={onNext}>
        开始练习 →
      </button>
    </FadeIn>
  </div>
)

export const EqPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 直接代换', question: '已知：🐟 = 🐟🐟（1 条小鱼等于 2 条小鱼）。问：🐟 + 🐟 等于几条 🐟？', answer: 4, hint: '把每个 🐟 都换成 2 条。' },
    { title: '② 先代换再合并', question: '已知：🍓 = 🍬🍬。问：🍓 + 🍬 + 🍓 等于几颗 🍬？', answer: 5, hint: '🍓 先换成 🍬🍬。' },
    { title: '③ 小挑战', question: '已知：🌟 = 🍪🍪🍪。问：🌟 + 🌟 + 🍪 等于几块 🍪？', answer: 7, hint: '两颗 🌟 就是 6 块 🍪。' },
  ]

  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const correct = parseInt(answer, 10) === problem.answer
    setSubmitted(true)
    setIsCorrect(correct)
    if (correct) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const next = () => {
    if (current < problems.length - 1) {
      setCurrent((p) => p + 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  const prev = () => {
    if (current > 0) {
      setCurrent((p) => p - 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  return (
    <div className="page">
      <Celebration show={showCelebration} />
      <button className="back-btn" onClick={onBack}>
        ← 返回目录
      </button>
      <FadeIn>
        <h2 className="page-title">练习闯关：等量代换小达人</h2>
      </FadeIn>
      <FadeIn delay={220}>
        <div className="example-box">
          <h3>
            📋 题目 {current + 1}/{problems.length}
          </h3>
          <p>{problem.title}</p>
          <p>{problem.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        {!submitted ? (
          <div className="answer-input">
            <input type="number" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="请输入答案" />
            <button className="submit-btn" onClick={submit} disabled={!answer.trim()}>
              提交答案
            </button>
          </div>
        ) : (
          <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                🎉 太棒了！你真的会代换了！
                <button className="next-btn" onClick={next} disabled={current === problems.length - 1}>
                  下一题 →
                </button>
              </>
            ) : (
              <>
                ❌ 还差一点点！提示：{problem.hint}
                <button className="retry-btn" onClick={() => setSubmitted(false)}>
                  再试一次
                </button>
              </>
            )}
          </div>
        )}
      </FadeIn>
      <FadeIn delay={640}>
        <div className="practice-actions">
          <button className="nav-btn" onClick={prev} disabled={current === 0}>
            上一题
          </button>
          <button className="home-secondary-btn" onClick={onHome}>
            返回首页
          </button>
        </div>
      </FadeIn>
    </div>
  )
}
