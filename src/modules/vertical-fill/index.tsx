import React, { useEffect, useMemo, useState } from 'react'
import { FadeIn, LessonCode, Star } from '../../components/animations'
import '../../App.css'

type FillPuzzle = {
  title: string
  kind: 'add' | 'sub'
  top: string
  bottom: string
  result: string
  answer: { top: string; bottom: string; result: string }
  hint: string
}

const isDigitOrBlank = (ch: string) => ch === '_' || (ch >= '0' && ch <= '9')

const normalizeRow = (value: string, width: number) => value.padStart(width, ' ')

const toCells = (value: string, width: number) => normalizeRow(value, width).split('')

const countBlanks = (value: string) => value.split('').filter((ch) => ch === '_').length

const FillBoard = ({
  puzzle,
  draft,
  activeCol,
}: {
  puzzle: FillPuzzle
  draft: { top: string; bottom: string; result: string }
  activeCol: number
}) => {
  const width = Math.max(puzzle.top.length, puzzle.bottom.length, puzzle.result.length)
  const top = toCells(draft.top, width)
  const bottom = toCells(draft.bottom, width)
  const result = toCells(draft.result, width)

  return (
    <div className="fill-board">
      <div className="fill-row">
        {top.map((ch, idx) => (
          <div key={idx} className={`fill-cell ${idx === activeCol ? 'active' : ''} ${ch === '_' ? 'blank' : ''}`}>
            {isDigitOrBlank(ch) ? ch === '_' ? '□' : ch : ''}
          </div>
        ))}
      </div>
      <div className="fill-row">
        <div className="fill-op">{puzzle.kind === 'add' ? '+' : '-'}</div>
        {bottom.map((ch, idx) => (
          <div key={idx} className={`fill-cell ${idx === activeCol ? 'active' : ''} ${ch === '_' ? 'blank' : ''}`}>
            {isDigitOrBlank(ch) ? ch === '_' ? '□' : ch : ''}
          </div>
        ))}
      </div>
      <div className="fill-line" />
      <div className="fill-row">
        {result.map((ch, idx) => (
          <div key={idx} className={`fill-cell ${idx === activeCol ? 'active' : ''} ${ch === '_' ? 'blank' : ''}`}>
            {isDigitOrBlank(ch) ? ch === '_' ? '□' : ch : ''}
          </div>
        ))}
      </div>
    </div>
  )
}

const applyDigitToNextBlank = (value: string, digit: string) => {
  const idx = value.indexOf('_')
  if (idx < 0) return value
  return value.slice(0, idx) + digit + value.slice(idx + 1)
}

export const FillIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">竖式填数：胖胖之旅</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="story-box">
        <div className="story-icon">🧩</div>
        <p>竖式里有些数字被遮住了。别慌！只要按“个位、十位、百位”一步一步推，就能把空格填出来。</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="concept-box">
        <p><strong>关键：</strong>对齐数位，从个位开始算，注意进位和退位。</p>
        <div className="concept-list">
          <span className="concept-item">📍 对齐个位</span>
          <span className="concept-item">⬆️ 进位</span>
          <span className="concept-item">⬇️ 退位</span>
          <span className="concept-item">✅ 验算</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={820}>
      <button className="next-btn" onClick={onNext}>学习解题思路 →</button>
    </FadeIn>
  </div>
)

export const FillRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">解题思路：从个位反推</h2></FadeIn>
    <FadeIn delay={260}>
      <LessonCode
        lines={[
          '1) 先看个位：这一列最简单',
          '2) 再看十位：别忘了进位/退位',
          '3) 再看百位：一列一列推',
          '4) 最后验算：把填好的竖式重新算一遍',
        ]}
        activeLine={0}
        runtimeTitle="像侦探一样"
        runtimeHint="竖式填空最怕跳步：每次只推一列，就不会乱。"
      />
    </FadeIn>
    <FadeIn delay={760}>
      <button className="next-btn" onClick={onNext}>看动画讲解 →</button>
    </FadeIn>
  </div>
)

export const FillAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const puzzle: FillPuzzle = useMemo(
    () => ({
      title: '竖式加法填空',
      kind: 'add',
      top: '4_5',
      bottom: '_37',
      result: '6_2',
      answer: { top: '465', bottom: '137', result: '602' },
      hint: '先看个位：5 + 7 = 12，所以个位是 2，进 1。',
    }),
    []
  )

  const frames = useMemo(
    () => [
      { line: 0, col: 2, msg: '先看个位：□ + 7 的个位是 2，说明 □ 是 5，并且要进 1。', badges: [{ label: '个位', value: '5+7=12' }] },
      { line: 1, col: 1, msg: '再看十位：_ + 3 + 进位1 的十位是 0，说明 _ 是 6。', badges: [{ label: '十位', value: '6+3+1=10' }] },
      { line: 2, col: 0, msg: '最后看百位：4 + _ + 进位1 的百位是 6，说明 _ 是 1。', badges: [{ label: '百位', value: '4+1+1=6' }] },
      { line: 3, col: 0, msg: '填完啦！再验算一遍：465 + 137 = 602。', badges: [{ label: '验算', value: '通过' }] },
    ],
    []
  )

  const [cursor, setCursor] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setCursor((prev) => (prev >= frames.length - 1 ? 0 : prev + 1)), 1400)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[cursor]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">动画讲解：一列一列推</h2></FadeIn>
      <FadeIn delay={260}>
        <div className="example-box">
          <h3>📋 {puzzle.title}</h3>
          <p>把空格补完整：每个 □ 都要填一个数字。</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <FillBoard puzzle={puzzle} draft={{ top: puzzle.top, bottom: puzzle.bottom, result: puzzle.result }} activeCol={frame.col} />
      </FadeIn>
      <FadeIn delay={760}>
        <LessonCode
          lines={[
            '从个位开始推',
            '带上进位/退位再推十位',
            '再推百位',
            '最后验算',
          ]}
          activeLine={frame.line}
          runtimeBadges={frame.badges}
          runtimeTitle="这一列发生了什么"
          runtimeHint={frame.msg}
        />
      </FadeIn>
      <FadeIn delay={1040}>
        <button className="next-btn" onClick={onNext}>看一道例题 →</button>
      </FadeIn>
    </div>
  )
}

export const FillExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">例题：自己当小侦探</h2></FadeIn>
    <FadeIn delay={260}>
      <div className="example-box">
        <h3>📋 题目</h3>
        <p>竖式填空： 7□2 - 3□7 = 3□5</p>
      </div>
    </FadeIn>
    <FadeIn delay={520}>
      <div className="rule-box">
        <p><strong>做法：</strong>从个位开始：2 - 7 不够减，说明要借 1。</p>
        <p>再看十位：带上借位继续推，最后再推百位。</p>
        <p>填空题没有唯一套路，但一定要“一列一列推”。</p>
      </div>
    </FadeIn>
    <FadeIn delay={860}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

export const FillPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const puzzles: FillPuzzle[] = [
    {
      title: '① 加法填空',
      kind: 'add',
      top: '3_6',
      bottom: '2_4',
      result: '6_0',
      answer: { top: '316', bottom: '294', result: '610' },
      hint: '从个位开始：6+4=10，个位是 0，进 1。',
    },
    {
      title: '② 减法填空',
      kind: 'sub',
      top: '8_1',
      bottom: '3_7',
      result: '4_4',
      answer: { top: '891', bottom: '357', result: '534' },
      hint: '个位：1-7 不够减，要借位。',
    },
    {
      title: '③ 组合填空',
      kind: 'add',
      top: '4_5',
      bottom: '_37',
      result: '6_2',
      answer: { top: '465', bottom: '137', result: '602' },
      hint: '先看个位：5+7=12。',
    },
  ]

  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
  const [current, setCurrent] = useState(0)
  const [draft, setDraft] = useState(() => ({ top: puzzles[0].top, bottom: puzzles[0].bottom, result: puzzles[0].result }))
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [celebrate, setCelebrate] = useState(false)

  const puzzle = puzzles[current]

  useEffect(() => {
    setDraft({ top: puzzle.top, bottom: puzzle.bottom, result: puzzle.result })
    setSubmitted(false)
    setCorrect(false)
  }, [current, puzzle.bottom, puzzle.result, puzzle.top])

  const remaining = countBlanks(draft.top) + countBlanks(draft.bottom) + countBlanks(draft.result)

  const fillNext = (digit: string) => {
    if (submitted) return
    if (draft.top.includes('_')) {
      setDraft((prev) => ({ ...prev, top: applyDigitToNextBlank(prev.top, digit) }))
      return
    }
    if (draft.bottom.includes('_')) {
      setDraft((prev) => ({ ...prev, bottom: applyDigitToNextBlank(prev.bottom, digit) }))
      return
    }
    if (draft.result.includes('_')) {
      setDraft((prev) => ({ ...prev, result: applyDigitToNextBlank(prev.result, digit) }))
    }
  }

  const submit = () => {
    const ok = draft.top === puzzle.answer.top && draft.bottom === puzzle.answer.bottom && draft.result === puzzle.answer.result
    setSubmitted(true)
    setCorrect(ok)
    if (ok) {
      setCelebrate(true)
      setTimeout(() => setCelebrate(false), 2000)
    }
  }

  const next = () => {
    if (current < puzzles.length - 1) setCurrent((prev) => prev + 1)
  }

  const prev = () => {
    if (current > 0) setCurrent((prev) => prev - 1)
  }

  const reset = () => {
    setDraft({ top: puzzle.top, bottom: puzzle.bottom, result: puzzle.result })
    setSubmitted(false)
    setCorrect(false)
  }

  const width = Math.max(puzzle.top.length, puzzle.bottom.length, puzzle.result.length)
  const activeCol = Math.max(0, width - remaining)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">练习闯关：竖式填数</h2></FadeIn>
      <FadeIn delay={240}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{puzzles.length}</h3>
          <p>{puzzle.title}</p>
          <p>点数字把空格填满，然后提交答案。</p>
        </div>
      </FadeIn>
      <FadeIn delay={520}>
        <FillBoard puzzle={puzzle} draft={draft} activeCol={activeCol} />
      </FadeIn>
      <FadeIn delay={760}>
        <div className="digit-pad">
          {digits.map((d) => (
            <button key={d} className="digit-btn" type="button" onClick={() => fillNext(d)} disabled={submitted || remaining === 0 && !draft.result.includes('_')}>
              {d}
            </button>
          ))}
        </div>
        <div className="fill-actions">
          <button className="nav-btn" type="button" onClick={reset} disabled={submitted === false && draft.top === puzzle.top && draft.bottom === puzzle.bottom && draft.result === puzzle.result}>
            重置
          </button>
          <button className="submit-btn" type="button" onClick={submit} disabled={remaining !== 0 || submitted}>
            提交答案
          </button>
        </div>
      </FadeIn>
      <FadeIn delay={980}>
        {submitted ? (
          <div className={`result-box ${correct ? 'correct' : 'wrong'}`}>
            {correct ? (
              <>
                <p>太棒了！全部填对啦！</p>
                <p className="explanation">你已经掌握了按列推理的技巧。</p>
                {current < puzzles.length - 1 ? <button className="next-btn" onClick={next}>下一题 →</button> : null}
                {current === puzzles.length - 1 ? <button className="restart-btn" onClick={onHome}>✅ 完成学习</button> : null}
              </>
            ) : (
              <>
                <p>差一点点，再试一次！</p>
                <p className="explanation">提示：{puzzle.hint}</p>
                <button className="retry-btn" onClick={reset}>再试一次</button>
              </>
            )}
          </div>
        ) : (
          <div className="tip-box">
            <span className="tip-icon">🧠</span>
            <p>还剩 <strong>{remaining}</strong> 个空格。建议从个位开始，一列一列推。</p>
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
            <div className="celebration-message">侦探成功！</div>
          </div>
        </div>
      ) : null}

      <div className="problem-nav">
        <button className="nav-btn" onClick={prev} disabled={current === 0}>← 上一题</button>
        <button className="nav-btn" onClick={next} disabled={current === puzzles.length - 1 || !submitted || !correct}>
          下一题 →
        </button>
      </div>
    </div>
  )
}

