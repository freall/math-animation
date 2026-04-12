import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b))

const simplify = (n: number, d: number) => {
  const g = gcd(n, d) || 1
  return { n: n / g, d: d / g }
}

const FractionBar = ({
  numerator,
  denominator,
  label,
}: {
  numerator: number
  denominator: number
  label: string
}) => {
  const width = 280
  const height = 50
  const cell = width / denominator
  const filled = Math.min(numerator, denominator)

  return (
    <div className="fraction-bar">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height}>
        {Array.from({ length: denominator }, (_, idx) => (
          <rect
            key={idx}
            x={idx * cell}
            y={0}
            width={cell}
            height={height}
            fill={idx < filled ? '#60a5fa' : 'white'}
            stroke="#111827"
            strokeWidth="2"
          />
        ))}
        <text x={width / 2} y={32} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#111827">
          {numerator}/{denominator}
        </text>
      </svg>
      <div className="fraction-label">{label}</div>
    </div>
  )
}

export const FractionIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">分数：把一份分成几份</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🍕</div>
        <p>一张披萨平均分成 4 份，吃了 3 份，就可以写成分数：3/4。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>分数表示：</strong>把“1 份整体”平均分成很多小份。</p>
        <div className="concept-list">
          <span className="concept-item">⬇️ 分母：分成几份</span>
          <span className="concept-item">⬆️ 分子：拿了几份</span>
          <span className="concept-item">✅ 真分数 / 假分数 / 带分数</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心规则 →</button>
    </FadeIn>
  </div>
)

export const FractionRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">核心规则：约分、通分、比较</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 约分</h4>
          <p>分子分母同时 ÷ 同一个数。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 通分</h4>
          <p>把分母变成一样，再比较。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 同分母比较</h4>
          <p>分子大 → 分数大。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 同分子比较</h4>
          <p>分母小 → 分数大。</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={560}>
      <LessonCode
        lines={[
          '约分： (a/b) = (a÷k)/(b÷k)',
          '通分： (a/b) = (a×k)/(b×k)',
          '同分母：分子越大，分数越大',
          '同分子：分母越小，分数越大',
        ]}
        activeLine={0}
        runtimeTitle="记住这 4 句"
        runtimeHint="接下来用动画把它们变成看得见的画面。"
      />
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const FractionAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const pairs = useMemo(() => [{ a: 1, b: 2, c: 2, d: 4 }, { a: 2, b: 3, c: 4, d: 6 }, { a: 3, b: 5, c: 6, d: 10 }], [])
  const [index, setIndex] = useState(0)
  const [cursor, setCursor] = useState(0)
  const current = pairs[index]
  const simplifiedLeft = simplify(current.a, current.b)
  const simplifiedRight = simplify(current.c, current.d)

  const frames = useMemo(
    () => [
      { line: 0, message: `先看两条分数条：${current.a}/${current.b} 和 ${current.c}/${current.d}` },
      { line: 1, message: `把它们变成“同样的样子”（通分）或“最简样子”（约分）。` },
      { line: 2, message: `约分后：${simplifiedLeft.n}/${simplifiedLeft.d} 与 ${simplifiedRight.n}/${simplifiedRight.d}` },
      { line: 3, message: `它们其实一样大，所以叫“等值分数”。` },
    ],
    [current, simplifiedLeft, simplifiedRight]
  )

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1200)
    return () => clearInterval(timer)
  }, [frames.length, index])

  const frame = frames[cursor]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：等值分数与比较</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="speed-switch">
          {pairs.map((_, idx) => (
            <button key={idx} className={`speed-chip ${idx === index ? 'active' : ''}`} onClick={() => setIndex(idx)}>
              例子 {idx + 1}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <div className="fraction-board">
          <FractionBar numerator={current.a} denominator={current.b} label="左边分数" />
          <FractionBar numerator={current.c} denominator={current.d} label="右边分数" />
        </div>
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            `${current.a}/${current.b} ? ${current.c}/${current.d}`,
            `约分：${current.a}/${current.b} = ${simplifiedLeft.n}/${simplifiedLeft.d}`,
            `约分：${current.c}/${current.d} = ${simplifiedRight.n}/${simplifiedRight.d}`,
            '比较：看它们是不是同一个分数条',
          ]}
          activeLine={frame.line}
          runtimeBadges={[
            { label: '左边', value: `${simplifiedLeft.n}/${simplifiedLeft.d}` },
            { label: '右边', value: `${simplifiedRight.n}/${simplifiedRight.d}` },
            { label: '结论', value: simplifiedLeft.n === simplifiedRight.n && simplifiedLeft.d === simplifiedRight.d ? '一样大' : '需要通分' },
          ]}
          runtimeTitle="这一刻的结果"
          runtimeHint={frame.message}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const FractionExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const left = { n: 2, d: 3 }
  const right = { n: 3, d: 5 }
  const common = 15
  const l = left.n * (common / left.d)
  const r = right.n * (common / right.d)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">例题：比较分数大小</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>比较 2/3 和 3/5 的大小。</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <div className="rule-box">
          <p><strong>第 1 步：</strong>通分到分母 15</p>
          <p><strong>第 2 步：</strong>2/3 = {l}/15， 3/5 = {r}/15</p>
          <p><strong>第 3 步：</strong>同分母比较：{l} &gt; {r}，所以 2/3 &gt; 3/5</p>
        </div>
      </FadeIn>
      <FadeIn delay={820}>
        <button className="next-btn" onClick={onNext}>开始练习 →</button>
      </FadeIn>
    </div>
  )
}

export const FractionPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    {
      title: '① 约分',
      question: '把 6/8 约分成最简分数。',
      answer: '3/4',
      hint: '分子分母都 ÷ 2 再 ÷ 2。',
    },
    {
      title: '② 通分比较',
      question: '比较 1/2 和 2/5，哪个更大？写 “1/2” 或 “2/5”。',
      answer: '1/2',
      hint: '通分到 10：1/2=5/10，2/5=4/10。',
    },
    {
      title: '③ 同分子比较',
      question: '比较 3/7 和 3/8，哪个更大？写 “3/7” 或 “3/8”。',
      answer: '3/7',
      hint: '同分子：分母越小，分数越大。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const problem = problems[current]

  const submit = () => {
    const ok = value.trim().replace(/\s+/g, '') === problem.answer
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
      <FadeIn><h2 className="page-title">练习闯关：分数基础</h2></FadeIn>
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
            <div className="celebration-message">分数高手！</div>
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

