import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type ScoreMethod = 'pair' | 'group' | 'bracket' | 'balance'

const METHODS: Record<ScoreMethod, { title: string; tip: string; code: string[] }> = {
  pair: {
    title: '凑整配对',
    tip: '把能凑成整十、整百的一对放一起，算得更快。',
    code: ['把数配对凑整：比如 34+66=100', '先算好算的，再把结果加起来'],
  },
  group: {
    title: '分组计算',
    tip: '把很多数分成几组，每组先算完，再合起来。',
    code: ['把一串数分成几组', '组内先算 → 组间再加'],
  },
  bracket: {
    title: '去括号',
    tip: '有括号时先看符号：前面是 “+” 还是 “-”。',
    code: ['+(a+b)=+a+ b', '-(a+b)=-a- b', '-(a-b)=-a+ b'],
  },
  balance: {
    title: '移项平衡',
    tip: '一个加一个减，可以“搬家”让式子更整齐。',
    code: ['a + b - c = a + (b - c)', '先把容易算的一段凑出来'],
  },
}

const buildPairFrames = (numbers: number[]) => {
  const frames: { line: number; message: string; badges: { label: string; value: string }[] }[] = []
  const total = numbers.reduce((sum, v) => sum + v, 0)
  frames.push({
    line: 0,
    message: `先把一串加法写出来：${numbers.join(' + ')}`,
    badges: [{ label: '共有', value: `${numbers.length} 个数` }],
  })

  const pairs: [number, number][] = []
  const used = new Array(numbers.length).fill(false)
  for (let i = 0; i < numbers.length; i++) {
    if (used[i]) continue
    let best = -1
    let bestScore = -1
    for (let j = i + 1; j < numbers.length; j++) {
      if (used[j]) continue
      const s = numbers[i] + numbers[j]
      const score = s % 100 === 0 ? 3 : s % 10 === 0 ? 2 : s % 5 === 0 ? 1 : 0
      if (score > bestScore) {
        bestScore = score
        best = j
      }
    }
    if (best >= 0) {
      used[i] = true
      used[best] = true
      pairs.push([numbers[i], numbers[best]])
    } else {
      used[i] = true
      pairs.push([numbers[i], 0])
    }
  }

  let running = 0
  pairs.forEach((p, idx) => {
    const sum = p[1] === 0 ? p[0] : p[0] + p[1]
    running += sum
    frames.push({
      line: 1,
      message: p[1] === 0 ? `剩下一个数：${p[0]}` : `第 ${idx + 1} 对：${p[0]} + ${p[1]} = ${sum}`,
      badges: [
        { label: '这一组', value: `${sum}` },
        { label: '目前合计', value: `${running}` },
      ],
    })
  })

  frames.push({
    line: 2,
    message: `把每组结果加起来，得到答案：${total}`,
    badges: [{ label: '最终答案', value: `${total}` }],
  })

  return frames
}

export const ScoreIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">巧算方法：满满的积分板</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🧾</div>
        <p>积分板上有很多加分和减分，我们想更快算出总分，就要用“巧算方法”。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>目标：</strong>让算式变成“更好算的样子”。</p>
        <div className="concept-list">
          <span className="concept-item">🧲 先凑整</span>
          <span className="concept-item">🧩 再分组</span>
          <span className="concept-item">🧠 用规则</span>
          <span className="concept-item">✅ 最后检验</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习核心方法 →</button>
    </FadeIn>
  </div>
)

export const ScoreRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [method, setMethod] = useState<ScoreMethod>('pair')
  const current = METHODS[method]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">核心方法：四个按钮</h2></FadeIn>
      <FadeIn delay={220}>
        <div className="sort-selector">
          {(['pair', 'group', 'bracket', 'balance'] as ScoreMethod[]).map((m) => (
            <button key={m} className={`sort-tab ${m === method ? 'active' : ''}`} onClick={() => setMethod(m)}>
              {METHODS[m].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={460}>
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <p><strong>{current.title}：</strong>{current.tip}</p>
        </div>
      </FadeIn>
      <FadeIn delay={680}>
        <LessonCode lines={current.code} activeLine={0} runtimeTitle="记住要点" runtimeHint="动画页会用例子演示怎么一步一步变简单。" />
      </FadeIn>
      <FadeIn delay={940}>
        <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
      </FadeIn>
    </div>
  )
}

export const ScoreAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [numbers, setNumbers] = useState('34,567,89,111,433,66')
  const parsed = useMemo(() => numbers.split(/[,，\s]+/).map((v) => parseInt(v)).filter((v) => Number.isFinite(v)), [numbers])
  const frames = useMemo(() => buildPairFrames(parsed), [parsed])
  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    setCursor(0)
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1100)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]
  const total = parsed.reduce((sum, v) => sum + v, 0)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：凑整配对</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="answer-input">
          <input value={numbers} onChange={(e) => setNumbers(e.target.value)} placeholder="输入一串数字，用逗号分隔" />
          <button className="submit-btn" type="button" onClick={() => setNumbers(numbers.trim() || '34,567,89,111,433,66')}>更新</button>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <LessonCode
          lines={[
            `把数写成加法：${parsed.join(' + ') || '（请先输入数字）'}`,
            '找一对能凑整的数，先算出来',
            `最后把结果加起来 = ${total}`,
          ]}
          activeLine={frame.line}
          runtimeBadges={frame.badges}
          runtimeTitle="这一刻怎么算"
          runtimeHint={frame.message}
        />
      </FadeIn>
      <FadeIn delay={860}>
        <div className="answer-box">
          <span className="answer-icon">🧮</span>
          <p>当前这一串数的总和是：<strong>{total}</strong></p>
        </div>
      </FadeIn>
      <FadeIn delay={1100}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const ScoreExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：连加连减也能巧算</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>快速计算：831 + 155 + 67 - 55 - 131</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>第 1 步：</strong>先把好减的放一起：155 - 55 = 100</p>
        <p><strong>第 2 步：</strong>再算：831 + 100 + 67 - 131</p>
        <p><strong>第 3 步：</strong>67 - 131 = -64</p>
        <p><strong>第 4 步：</strong>831 + 100 - 64 = <strong>867</strong></p>
      </div>
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const ScorePracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const problems = [
    { title: '① 凑整配对', question: '快速计算：48 + 52 + 19 + 81 = ?', answer: 200, hint: '先配对：48+52，19+81。' },
    { title: '② 分组', question: '快速计算：125 + 75 + 36 + 64 = ?', answer: 300, hint: '125+75=200，36+64=100。' },
    { title: '③ 连加连减', question: '快速计算：500 + 60 - 20 + 40 - 80 = ?', answer: 500, hint: '先把 + 和 - 分组。' },
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
      <FadeIn><h2 className="page-title">练习闯关：巧算方法</h2></FadeIn>
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
            <div className="celebration-message">巧算达人！</div>
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

