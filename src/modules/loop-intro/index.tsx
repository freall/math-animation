import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

export const LoopIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">C++ 循环是什么？</h2></FadeIn>

    <FadeIn delay={300}>
      <div className="story-box">
        <div className="story-icon">🤖</div>
        <p>如果机器人要连续说 5 次“你好”，一条一条写会很麻烦，这时就可以请循环来帮忙！</p>
      </div>
    </FadeIn>

    <FadeIn delay={600}>
      <div className="concept-box">
        <p><strong>循环</strong>就是：把一件事<strong>重复做很多次</strong>。</p>
        <div className="concept-list">
          <span className="concept-item">🎯 先决定做几次</span>
          <span className="concept-item">▶️ 每次执行同样动作</span>
          <span className="concept-item">🛑 次数到了就停止</span>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={900}>
      <div className="syntax-pill-row">
        <div className="syntax-pill">第 1 次</div>
        <div className="syntax-pill">第 2 次</div>
        <div className="syntax-pill">第 3 次</div>
        <div className="syntax-pill">第 4 次</div>
        <div className="syntax-pill">第 5 次</div>
      </div>
    </FadeIn>

    <FadeIn delay={1200}>
      <div className="tip-box">
        
        <p>在 C++ 里，最常见的循环写法就是 <strong>for 循环</strong>。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1500}>
      <button className="next-btn" onClick={onNext}>学习基本语法 →</button>
    </FadeIn>
  </div>
)

export const LoopSyntaxPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">for 循环基本语法</h2></FadeIn>

    <FadeIn delay={300}>
      <LessonCode
        lines={[
          'for (int i = 1; i <= 5; i++) {',
          '  cout << "你好";',
          '}',
        ]}
        activeLine={0}
      />
    </FadeIn>

    <FadeIn delay={600}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 起点</h4>
          <p><strong>int i = 1</strong></p>
          <p>先让 i 从 1 开始。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 条件</h4>
          <p><strong>i &lt;= 5</strong></p>
          <p>只要还没超过 5，就继续。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 动作</h4>
          <p><strong>cout &lt;&lt; "你好"</strong></p>
          <p>每次循环要做的事。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 变化</h4>
          <p><strong>i++</strong></p>
          <p>做完一次后，i 增加 1。</p>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={900}>
      <div className="rule-box">
        <p><strong>一句话记忆：</strong></p>
        <p className="rhyme">先定起点，看条件，做动作，再往下一个数走。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>看动画执行过程 →</button>
    </FadeIn>
  </div>
)

export const LoopProcessPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const frames = [
    {
      activeLine: 0,
      currentPot: 0,
      wateredCount: 0,
      description: '先执行第 1 行，把变量 i 设成 1，循环从这里出发。',
      lineBadges: {
        0: [{ label: 'i', value: '1' }],
      },
      runtimeBadges: [
        { label: 'i', value: '1' },
        { label: '已浇花盆', value: '0 盆' },
      ],
    },
    ...Array.from({ length: 5 }, (_, index) => {
      const value = index + 1
      return [
        {
          activeLine: 1,
          currentPot: value,
          wateredCount: value - 1,
          description: `执行第 2 行，检查条件 i <= 5。现在 i = ${value}，条件成立，可以继续循环。`,
          lineBadges: {
            1: [
              { label: 'i', value: `${value}` },
              { label: '条件', value: 'true' },
            ],
          },
          runtimeBadges: [
            { label: 'i', value: `${value}` },
            { label: '已浇花盆', value: `${value - 1} 盆` },
          ],
        },
        {
          activeLine: 2,
          currentPot: value,
          wateredCount: value - 1,
          description: `执行第 3 行，按照 i 的值去浇第 ${value} 盆花。`,
          lineBadges: {
            2: [
              { label: 'i', value: `${value}` },
              { label: '目标', value: `第 ${value} 盆` },
            ],
          },
          runtimeBadges: [
            { label: 'i', value: `${value}` },
            { label: '正在执行', value: `浇第 ${value} 盆花` },
          ],
        },
        {
          activeLine: 3,
          currentPot: value < 5 ? value + 1 : 0,
          wateredCount: value,
          description: `执行第 4 行，i 自增 1，变量从 ${value} 变成 ${value + 1}。`,
          lineBadges: {
            3: [{ label: 'i', value: `${value} → ${value + 1}` }],
          },
          runtimeBadges: [
            { label: 'i', value: `${value + 1}` },
            { label: '已浇花盆', value: `${value} 盆` },
          ],
        },
      ]
    }).flat(),
    {
      activeLine: 1,
      currentPot: 0,
      wateredCount: 5,
      description: '再次检查第 2 行，此时 i = 6，条件不成立，循环结束。',
      lineBadges: {
        1: [
          { label: 'i', value: '6' },
          { label: '条件', value: 'false' },
        ],
      },
      runtimeBadges: [
        { label: 'i', value: '6' },
        { label: '已浇花盆', value: '5 盆' },
        { label: '循环状态', value: '结束' },
      ],
    },
  ]

  const [step, setStep] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((current) => current >= frames.length - 1 ? 0 : current + 1)
    }, 1100)
    return () => clearInterval(timer)
  }, [frames.length])

  const frame = frames[step]
  const currentPot = frame.currentPot
  const description = frame.description

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">循环怎么一遍遍执行？</h2></FadeIn>

      <FadeIn delay={300}>
        <LessonCode
          lines={[
            'int i = 1;',
            'for (; i <= 5; ) {',
            '  给第 i 盆花浇水;',
            '  i++;',
            '}',
          ]}
          activeLine={frame.activeLine}
          lineBadges={frame.lineBadges}
          runtimeBadges={frame.runtimeBadges}
          runtimeTitle="这一刻代码里的值"
          runtimeHint="动画会按照“初始化 → 判断条件 → 执行动作 → 变量变化”的顺序循环播放。"
        />
      </FadeIn>

      <FadeIn delay={600}>
        <div className="loop-runner">
          <div className="counter-row">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1
              const state = value <= frame.wateredCount ? 'done' : value === currentPot ? 'current' : 'pending'
              return <div key={value} className={`counter-chip ${state}`}>{value}</div>
            })}
          </div>

          <div className="pot-grid">
            {Array.from({ length: 5 }, (_, index) => {
              const value = index + 1
              const watered = value <= frame.wateredCount
              const active = value === currentPot
              return (
                <div key={value} className={`pot-card ${watered ? 'done' : ''} ${active ? 'current' : ''}`}>
                  <div className="pot-emoji">{active ? '💧' : watered ? '🌼' : '🪴'}</div>
                  <div>第 {value} 盆</div>
                </div>
              )
            })}
          </div>

          <p className="loop-status">{description}</p>
          <button className="retry-btn" onClick={() => setStep(0)}>重新播放</button>
        </div>
      </FadeIn>

      <FadeIn delay={900}>
        <button className="next-btn" onClick={onNext}>看实际案例 →</button>
      </FadeIn>
    </div>
  )
}

export const LoopExamplePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const scores = [1, 2, 3, 4, 5]
  const [step, setStep] = useState(0)
  const total = scores.slice(0, step).reduce((sum, value) => sum + value, 0)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">实际案例：一周积分统计</h2></FadeIn>

      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 故事</h3>
          <p>小熊连续 5 天完成编程练习，分别得到 1、2、3、4、5 颗星星，怎样用循环快速算出总分？</p>
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <LessonCode
          lines={[
            'int sum = 0;',
            'for (int i = 1; i <= 5; i++) {',
            '  sum = sum + i;',
            '}',
            'cout << sum;',
          ]}
          activeLine={step === 0 ? 0 : step <= 5 ? 2 : 4}
        />
      </FadeIn>

      <FadeIn delay={900}>
        <div className="sum-track">
          {scores.map((value, index) => (
            <div key={value} className={`sum-badge ${index < step ? 'active' : ''}`}>+ {value}</div>
          ))}
        </div>
        <div className="answer-box">
          <span className="answer-icon">🧮</span>
          <p>当前总分：<strong>{total}</strong></p>
          <p>{step < 5 ? `再执行 ${5 - step} 次循环，就能把后面的分数都加进去。` : '循环全部执行完毕，sum 里就保存着答案。'}</p>
        </div>
        <button className="next-btn" onClick={() => step < 5 ? setStep(step + 1) : onNext()}>
          {step < 5 ? '执行下一次循环 →' : '开始练习 →'}
        </button>
      </FadeIn>
    </div>
  )
}

export const LoopPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const problems = [
    {
      title: '① 识别循环次数',
      question: '下面哪一句表示“从 1 数到 5，一共执行 5 次”？',
      options: [
        'for (int i = 1; i <= 5; i++)',
        'for (int i = 5; i <= 1; i++)',
        'for (int i = 1; i <= 5; i--)',
      ],
      answer: 0,
      explanation: 'i 从 1 开始，每次加 1，直到 5，正好执行 5 次。',
    },
    {
      title: '② 判断循环动作',
      question: '如果 for 循环里写的是 cout << "Hi";，每次循环会发生什么？',
      options: [
        '只输出一次 Hi',
        '每次循环都输出一次 Hi',
        '什么也不会输出',
      ],
      answer: 1,
      explanation: '循环体里的语句会在每次循环时都执行一次。',
    },
    {
      title: '③ 理解累加结果',
      question: '执行 1 + 2 + 3 + 4 之后，sum 最后是多少？',
      options: ['8', '9', '10'],
      answer: 2,
      explanation: '1 + 2 + 3 + 4 = 10，所以最后 sum 是 10。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const problem = problems[current]
  const isCorrect = selected === problem.answer

  const nextProblem = () => {
    if (current < problems.length - 1) {
      setCurrent(current + 1)
      setSelected(null)
      setSubmitted(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">循环小练习</h2></FadeIn>

      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{problems.length}</h3>
          <p>{problem.title}</p>
          <p>{problem.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <div className="quiz-options">
          {problem.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === problem.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
              onClick={() => !submitted && setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={900}>
        {!submitted ? (
          <button className="submit-btn" onClick={() => setSubmitted(true)} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            
            <p>{isCorrect ? '答对了！' : '这题先记住哦！'}</p>
            <p className="explanation">{problem.explanation}</p>
            {current < problems.length - 1 ? (
              <button className="next-btn" onClick={nextProblem}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>

      {current === problems.length - 1 && submitted && (
        <FadeIn delay={1200}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>循环 = 重复执行同一组动作</li>
              <li>for 语法包含起点、条件、动作和变化</li>
              <li>循环可以帮我们快速做重复计算</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}
