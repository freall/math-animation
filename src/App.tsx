import { useState, useEffect } from 'react'
import './App.css'

// ========== 类型定义 ==========
type PageType =
  | 'home'
  | 'intro' | 'venn' | 'two-set' | 'three-set' | 'practice'  // 容斥原理
  | 'sp-intro' | 'sp-concept' | 'sp-basic' | 'sp-forbidden' | 'sp-mustpass' | 'sp-special' | 'sp-practice'  // 标数法
  | 'sport-intro' | 'sport-elimination' | 'sport-round' | 'sport-graph' | 'sport-score' | 'sport-practice'  // 体育比赛中的学问
  | 'loop-intro' | 'loop-syntax' | 'loop-process' | 'loop-example' | 'loop-practice'
  | 'sort-intro' | 'sort-algos' | 'sort-visual' | 'sort-example' | 'sort-practice'
  | 'cmd-intro' | 'cmd-break' | 'cmd-continue' | 'cmd-compare' | 'cmd-practice'  // 循环指挥官
  | 'poetry-intro' | 'poetry-quiz' | 'poetry-result'  // 诗词大赛

// ========== 动画组件 ==========
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  return <div className={`fade-in ${visible ? 'visible' : ''}`}>{children}</div>
}

const Bounce = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])
  return <div className={`bounce ${visible ? 'visible' : ''}`}>{children}</div>
}

const Star = ({ style }: { style: React.CSSProperties }) => (
  <div className="star" style={style}>
    <svg viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  </div>
)

type RuntimeBadge = {
  label: string
  value: string
}

const LessonCode = ({
  lines,
  activeLine = -1,
  lineBadges = {},
  runtimeBadges = [],
  runtimeTitle = '当前变量',
  runtimeHint,
}: {
  lines: string[],
  activeLine?: number,
  lineBadges?: Record<number, RuntimeBadge[]>,
  runtimeBadges?: RuntimeBadge[],
  runtimeTitle?: string,
  runtimeHint?: string,
}) => (
  <div className="code-board">
    {lines.map((line, index) => (
      <div key={`${index}-${line}`} className={`code-line ${activeLine === index ? 'active' : ''}`}>
        <div className="code-line-main">
          <span className="code-index">{index + 1}</span>
          <code>{line}</code>
        </div>
        {lineBadges[index]?.length ? (
          <div className="code-badges">
            {lineBadges[index].map((badge) => (
              <span key={`${index}-${badge.label}-${badge.value}`} className="code-badge">
                {badge.label} = {badge.value}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    ))}
    {(runtimeBadges.length > 0 || runtimeHint) && (
      <div className="runtime-panel">
        <div className="runtime-title">{runtimeTitle}</div>
        <div className="runtime-list">
          {runtimeBadges.map((badge) => (
            <div key={`${badge.label}-${badge.value}`} className="runtime-item">
              <span className="runtime-label">{badge.label}</span>
              <span className="runtime-value">{badge.value}</span>
            </div>
          ))}
        </div>
        {runtimeHint ? <p className="runtime-hint">{runtimeHint}</p> : null}
      </div>
    )}
  </div>
)

// ========== 首页目录 ==========
const HomePage = ({ onSelect }: { onSelect: (page: PageType) => void }) => (
  <div className="page home-page">
    <div className="stars-container">
      <Star style={{ top: '10%', left: '15%', animationDelay: '0s' }} />
      <Star style={{ top: '20%', right: '20%', animationDelay: '0.5s' }} />
      <Star style={{ top: '60%', left: '10%', animationDelay: '1s' }} />
      <Star style={{ top: '70%', right: '15%', animationDelay: '1.5s' }} />
      <Star style={{ top: '85%', left: '25%', animationDelay: '0.3s' }} />
    </div>

    <Bounce delay={200}>
      <h1 className="main-title">
        <span className="title-icon">📚</span>
        小学数学思维训练
        <span className="title-icon">✨</span>
      </h1>
    </Bounce>

    <FadeIn delay={600}>
      <p className="subtitle">选择一个主题开始学习吧！</p>
    </FadeIn>

    <FadeIn delay={900}>
      <div className="topic-cards">
        <div className="topic-card" onClick={() => onSelect('intro')}>
          <div className="topic-icon">🔢</div>
          <h3>容斥原理</h3>
          <p>学会用韦恩图数清重叠的东西</p>
          <span className="topic-tag">计数方法</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('sp-intro')}>
          <div className="topic-icon">🗺️</div>
          <h3>最短路线标数法</h3>
          <p>用标数法找到所有最短路线</p>
          <span className="topic-tag">路径规划</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('sport-intro')}>
          <div className="topic-icon">🏆</div>
          <h3>体育比赛中的学问</h3>
          <p>用动画看懂赛制、场次和积分里的数学秘密</p>
          <span className="topic-tag">比赛数学</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('loop-intro')}>
          <div className="topic-icon">🔁</div>
          <h3>C++ 循环入门</h3>
          <p>用动画看懂 for 循环怎么一遍遍执行</p>
          <span className="topic-tag">编程启蒙</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('sort-intro')}>
          <div className="topic-icon">📊</div>
          <h3>C++ 排序算法</h3>
          <p>看数字怎样交换位置，慢慢排成整齐队伍</p>
          <span className="topic-tag">算法启蒙</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('cmd-intro')}>
          <div className="topic-icon">🎮</div>
          <h3>循环指挥官</h3>
          <p>用 break 和 continue 掌控循环的节奏</p>
          <span className="topic-tag">流程控制</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('poetry-intro')}>
          <div className="topic-icon">📜</div>
          <h3>诗词大赛</h3>
          <p>24节气与传统节日诗词知识大挑战</p>
          <span className="topic-tag">传统文化</span>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={1200}>
      <div className="mascot">
        <div className="mascot-body">
          <div className="mascot-face">
            <div className="eye left"></div>
            <div className="eye right"></div>
            <div className="mouth"></div>
          </div>
        </div>
      </div>
    </FadeIn>
  </div>
)

// ========== 容斥原理模块 ==========
const VennDiagram = ({ type, animating, data }: { type: 'two' | 'three', animating: boolean, data?: any }) => {
  if (type === 'two') {
    return (
      <div className="venn-container">
        <svg viewBox="0 0 400 300" className="venn-svg">
          <circle cx="160" cy="150" r="100" fill="rgba(59, 130, 246, 0.4)" stroke="#3b82f6" strokeWidth="3" className={animating ? 'circle-a' : ''} />
          <circle cx="240" cy="150" r="100" fill="rgba(239, 68, 68, 0.4)" stroke="#ef4444" strokeWidth="3" className={animating ? 'circle-b' : ''} />
          <text x="100" y="60" className="venn-label">篮球</text>
          <text x="280" y="60" className="venn-label">排球</text>
          {data && <><text x="130" y="130" className="venn-number">10</text><text x="250" y="130" className="venn-number">5</text><text x="190" y="160" className="venn-number overlap">7</text></>}
        </svg>
      </div>
    )
  }
  return (
    <div className="venn-container three-venn">
      <svg viewBox="0 0 500 400" className="venn-svg">
        <circle cx="200" cy="150" r="90" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="3" />
        <circle cx="300" cy="150" r="90" fill="rgba(34, 197, 94, 0.3)" stroke="#22c55e" strokeWidth="3" />
        <circle cx="250" cy="230" r="90" fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="3" />
        <text x="120" y="100" className="venn-label">数学</text>
        <text x="360" y="100" className="venn-label">科学</text>
        <text x="250" y="330" className="venn-label">英语</text>
      </svg>
    </div>
  )
}

const IntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🤔</span>什么是容斥原理？</h2></FadeIn>
    <FadeIn delay={300}><div className="story-box"><div className="story-icon">📖</div><p>从前有个班，16个人参加运动会</p></div></FadeIn>
    <FadeIn delay={600}><div className="activity-cards">
      <div className="activity-card jump"><span className="activity-icon">🪢</span><span className="activity-name">跳绳比赛</span><span className="activity-count">10人</span></div>
      <div className="activity-card run"><span className="activity-icon">🏃</span><span className="activity-name">百米赛跑</span><span className="activity-count">12人</span></div>
    </div></FadeIn>
    <FadeIn delay={900}><div className="question-box"><p className="question">10 + 12 = ?</p><p className="wrong-answer">22人？❌</p><p className="wrong-answer">可是班才16人！</p></div></FadeIn>
    <FadeIn delay={1200}><div className="magic-box"><p>🔮 秘密在这里：</p><p>有6个小朋友两项都参加了！</p></div></FadeIn>
    <FadeIn delay={1500}><button className="next-btn" onClick={onNext}>继续学习 →</button></FadeIn>
  </div>
)

const VennPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 500); return () => clearTimeout(t) }, [])
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🔍</span>神奇的韦恩图</h2></FadeIn>
      <FadeIn delay={300}><p className="page-intro">韦恩图就像两个重叠的气球~</p></FadeIn>
      <FadeIn delay={600}><div className="venn-demo"><VennDiagram type="two" animating={animate} data={true} /></div></FadeIn>
      <FadeIn delay={1000}><div className="venn-legend">
        <div className="legend-item"><div className="legend-circle blue"></div><span>蓝色部分 = 只喜欢篮球的人</span></div>
        <div className="legend-item"><div className="legend-circle red"></div><span>红色部分 = 只喜欢排球的人</span></div>
        <div className="legend-item"><div className="legend-circle overlap"></div><span>重叠部分 = 两样都喜欢！</span></div>
      </div></FadeIn>
      <FadeIn delay={1300}><div className="tip-box"><span className="tip-icon">💡</span><p>圆圈交叉的地方，就是同时属于两类的部分</p></div></FadeIn>
      <FadeIn delay={1600}><button className="next-btn" onClick={onNext}>学习公式 →</button></FadeIn>
    </div>
  )
}

const TwoSetPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">📝</span>二量容斥公式</h2></FadeIn>
      <FadeIn delay={200}><div className="formula-box main-formula"><div className="formula"><span className="formula-part">两者之和</span><span> = </span><span className="formula-a">A</span><span className="formula-plus"> + </span><span className="formula-b">B</span><span className="formula-minus"> - </span><span className="formula-ab">AB</span></div></div></FadeIn>
      {step >= 0 && <FadeIn delay={400}><div className="step-card" onClick={() => setStep(1)}><span className="step-number">1</span><p>先把A和B的人数<strong>加起来</strong></p><span className="step-hint">点击继续</span></div></FadeIn>}
      {step >= 1 && <FadeIn><div className="step-card step-highlight" onClick={() => setStep(2)}><span className="step-number">2</span><p>但是重叠部分被算了<strong>两次</strong>！</p><span className="step-hint">点击继续</span></div></FadeIn>}
      {step >= 2 && <FadeIn><div className="step-card step-final"><span className="step-number">3</span><p>所以要<strong>减去</strong>重叠部分！</p></div></FadeIn>}
      {step >= 3 && <><FadeIn delay={200}><div className="example-box"><h3>📋 例题练习</h3><p>某班36人，每人至少喜欢一种运动</p><p>喜欢篮球的26人，喜欢排球的17人</p><p className="question">两种都喜欢的有多少人？</p></div></FadeIn>
        <FadeIn delay={400}><div className="calculation"><div className="calc-step"><span className="calc-num">26</span><span className="calc-op">+</span><span className="calc-num">17</span><span className="calc-op">=</span><span className="calc-num">43</span></div><div className="calc-arrow">↓</div><div className="calc-step"><span className="calc-num">43</span><span className="calc-op">-</span><span className="calc-num">36</span><span className="calc-op">=</span><span className="calc-num result">7</span><span className="calc-label">人</span></div></div></FadeIn>
        <FadeIn delay={700}><div className="answer-box"><span className="answer-icon">🎉</span><p>答：两种都喜欢的有<strong>7人</strong></p></div></FadeIn>
        <FadeIn delay={1000}><button className="next-btn" onClick={onNext}>学习三量容斥 →</button></FadeIn></>}
      {step < 3 && <div style={{marginTop:20,textAlign:'center'}}><button className="next-btn" onClick={() => setStep(3)}>看例题 →</button></div>}
    </div>
  )
}

const ThreeSetPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🎯</span>三量容斥 - 更厉害的方法！</h2></FadeIn>
    <FadeIn delay={300}><p className="page-intro">如果有三样东西要数呢？</p></FadeIn>
    <FadeIn delay={500}><div className="venn-demo"><VennDiagram type="three" animating={true} /></div></FadeIn>
    <FadeIn delay={900}><div className="formula-box three-formula"><div className="formula"><span className="formula-part">三者之和</span><span> = </span><span className="formula-abc">A + B + C</span></div><div className="formula-line">- AB - AC - BC</div><div className="formula-line">+ ABC</div></div></FadeIn>
    <FadeIn delay={1200}><div className="rule-box"><p>口诀：</p><p className="rhyme">先加后减再加回</p></div></FadeIn>
    <FadeIn delay={1500}><div className="example-box"><h3>📋 例题练习</h3><p>数学42人，科学37人，英语19人</p><p>数学+科学7人，数学+英语6人</p><p>科学+英语4人，三项都参加2人</p><p className="question">总人数？</p></div></FadeIn>
    <FadeIn delay={1800}><div className="answer-box three-answer"><p>42 + 37 + 19 - 7 - 6 - 4 + 2 = 83</p><p className="final-answer">总人数：<strong>83人</strong></p></div></FadeIn>
    <FadeIn delay={2100}><button className="next-btn" onClick={onNext}>开始练习 →</button></FadeIn>
  </div>
)

const PracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const handleSubmit = () => { setSubmitted(true); setIsCorrect(parseInt(answer) === 8) }
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎮</span>小小练习</h2></FadeIn>
      <FadeIn delay={300}><div className="practice-box"><p>某班有30人参加活动</p><p>喜欢画画的有18人</p><p>喜欢唱歌的有20人</p><p>两样都喜欢的有多少人？</p></div></FadeIn>
      <FadeIn delay={600}>{!submitted ? (
        <div className="answer-input"><input type="number" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请输入答案" /><button className="submit-btn" onClick={handleSubmit}>提交答案</button></div>
      ) : (
        <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? <><span className="result-icon">🎉</span><p>太棒了！答对了！</p><p className="explanation">18 + 20 - 30 = 8（人）</p></> : <><span className="result-icon">🤔</span><p>再想想哦~</p><p className="explanation">提示：18 + 20 - 30 = ?</p><button className="retry-btn" onClick={() => { setAnswer(''); setSubmitted(false) }}>再试一次</button></>}
        </div>
      )}</FadeIn>
      <FadeIn delay={900}><div className="summary-box"><h3>📚 今天学的知识</h3><ul><li>容斥原理 = 先包含，再排除</li><li>二量公式：A + B - AB</li><li>三量公式：A + B + C - AB - AC - BC + ABC</li></ul></div></FadeIn>
      <FadeIn delay={1200}><button className="restart-btn" onClick={onHome}>✅ 完成学习</button></FadeIn>
    </div>
  )
}

// ========== 标数法模块 ==========
// GridDiagram: 通用网格标数法图示组件
// - numbers[r][c]: null 表示该格不存在（特殊形状），undefined 表示空白
// - forbidden: 禁止经过的格子坐标 [r,c]
// - startPos/endPos: 起点/终点坐标，默认左下/右上
// - startLabel/endLabel: 起点/终点标签
// - segmentBox: 必过某点时的分段框 {r1,c1,r2,c2}[]
// - specialPoints: 特殊标记点 {r,c,label,color}[]
const GridDiagram = ({
  rows, cols, numbers, forbidden,
  startPos, endPos,
  startLabel = 'A', endLabel = 'B',
  animated, highlightCells,
  onCellClick, interactive = false,
  segmentBoxes,
  specialPoints,
}: {
  rows: number, cols: number,
  numbers?: (number | null | undefined)[][],
  forbidden?: [number, number][],
  startPos?: [number, number],
  endPos?: [number, number],
  startLabel?: string, endLabel?: string,
  animated?: boolean,
  highlightCells?: [number, number][],
  onCellClick?: (row: number, col: number) => void,
  interactive?: boolean,
  segmentBoxes?: { r1: number, c1: number, r2: number, c2: number, color: string }[],
  specialPoints?: { r: number, c: number, label: string, color?: string }[],
}) => {
  const gap = 62
  const padLeft = 48, padRight = 48, padTop = 48, padBottom = 48
  const w = (cols - 1) * gap + padLeft + padRight
  const h = (rows - 1) * gap + padTop + padBottom

  const sRow = startPos ? startPos[0] : rows - 1
  const sCol = startPos ? startPos[1] : 0
  const eRow = endPos ? endPos[0] : 0
  const eCol = endPos ? endPos[1] : cols - 1

  const forbiddenSet = new Set(forbidden?.map(([r, c]) => `${r},${c}`))
  const highlightSet = new Set(highlightCells?.map(([r, c]) => `${r},${c}`))

  const pointExists = (r: number, c: number) => {
    if (!numbers) return true
    return numbers[r]?.[c] !== null
  }

  const px = (c: number) => padLeft + c * gap
  const py = (r: number) => padTop + r * gap

  return (
    <div className="grid-container">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        preserveAspectRatio="xMidYMid meet"
        className="grid-svg"
      >
        {segmentBoxes?.map((box, i) => (
          <rect
            key={`seg${i}`}
            x={px(box.c1) - 10}
            y={py(box.r1) - 10}
            width={(box.c2 - box.c1 - 1) * gap + 20}
            height={(box.r2 - box.r1 - 1) * gap + 20}
            fill="none"
            stroke={box.color}
            strokeWidth="2.5"
            rx="4"
          />
        ))}

        {Array.from({ length: rows - 1 }, (_, r) =>
          Array.from({ length: cols - 1 }, (_, c) => {
            if (!pointExists(r, c) || !pointExists(r, c + 1) || !pointExists(r + 1, c) || !pointExists(r + 1, c + 1)) {
              return null
            }
            return (
              <rect
                key={`cell${r},${c}`}
                x={px(c)}
                y={py(r)}
                width={gap}
                height={gap}
                fill="white"
                stroke="#111827"
                strokeWidth="2.6"
              />
            )
          })
        )}

        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            if (!pointExists(r, c)) return null
            const key = `${r},${c}`
            const isForbidden = forbiddenSet.has(key)
            const isHighlight = highlightSet.has(key)
            const num = numbers?.[r]?.[c]
            const isStart = r === sRow && c === sCol
            const isEnd = r === eRow && c === eCol

            const handleClick = () => {
              if (interactive && onCellClick && !isForbidden) {
                onCellClick(r, c)
              }
            }

            const pointX = px(c)
            const pointY = py(r)

            return (
              <g key={key}>
                <circle cx={pointX} cy={pointY} r={isStart || isEnd ? 7.5 : 4} fill={isForbidden ? '#ef4444' : '#111827'} />
                {interactive && (
                  <circle
                    cx={pointX}
                    cy={pointY}
                    r={14}
                    fill="transparent"
                    style={{ cursor: !isForbidden ? 'pointer' : 'default' }}
                    onClick={handleClick}
                  />
                )}
                {isHighlight && (
                  <circle
                    cx={pointX}
                    cy={pointY}
                    r={10}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                  />
                )}
                {isForbidden && (
                  <text x={pointX} y={pointY - 10} textAnchor="middle" fontSize="24" fill="#ef4444" fontWeight="bold">×</text>
                )}
                {num !== null && num !== undefined && !isForbidden && (
                  <text
                    x={pointX + 12}
                    y={pointY - 10}
                    textAnchor="middle"
                    fontSize={num >= 100 ? "16" : "18"}
                    fontWeight="bold"
                    fill="#111827"
                  >{num}</text>
                )}
                {isStart && (
                  <text x={pointX - 8} y={pointY + 28} textAnchor="middle" fontSize="24" fontStyle="italic" fontWeight="bold" fill="#111827">
                    {startLabel}
                  </text>
                )}
                {isEnd && (
                  <text x={pointX + 16} y={pointY - 12} textAnchor="middle" fontSize="24" fontStyle="italic" fontWeight="bold" fill="#111827">
                    {endLabel}
                  </text>
                )}
                {specialPoints?.find(p => p.r === r && p.c === c) && (() => {
                  const sp = specialPoints.find(p => p.r === r && p.c === c)!
                  return (
                    <text x={pointX + 4} y={pointY - 14} textAnchor="middle" fontSize="30" fontStyle="italic" fontWeight="bold" fill={sp.color || '#ec4899'}>
                      {sp.label}
                    </text>
                  )
                })()}
              </g>
            )
          })
        )}

        {(startLabel.length > 2 || endLabel.length > 2) && (
          <g>
            {startLabel.length > 2 && (
              <text
                x={px(sCol)}
                y={py(sRow) + 36}
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#111827"
              >
                {startLabel}
              </text>
            )}
            {endLabel.length > 2 && (
              <text
                x={px(eCol)}
                y={py(eRow) - 20}
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#111827"
              >
                {endLabel}
              </text>
            )}
          </g>
        )}
      </svg>
    </div>
  )
}

// ==================== 标数法模块 - 完全按照参考图片设计 ====================

// ---- 网格标数法核心算法 ----
// 标准矩形网格：从左下角A到右上角B，只能向右或向上
// rows×cols 表示交叉点数量（不是格子数）
// grid[0] = 顶行(B所在行), grid[rows-1] = 底行(A所在行)
// grid[r][c]: r=0顶, r=rows-1底; c=0左, c=cols-1右

// 基础型：4列×4行交叉点，A在左下(row3,col0)，B在右上(row0,col3)
// 规则：某点 = 左方点 + 下方点（即 grid[r][c] = grid[r][c-1] + grid[r+1][c]）
// 底行全1，左列全1
const basicGrid: number[][] = [
  [1,  4,  10, 20],  // 顶行，B在[0][3]=20
  [1,  3,   6, 10],
  [1,  2,   3,  4],
  [1,  1,   1,  1],  // 底行，A在[3][0]=1
]

// 不过某点：5列×5行，C在[2][3]（从顶数第3行，从左数第4列）
// C标0，影响后续标数
const forbiddenGrid: (number | null)[][] = [
  [1,  5,  15, 25, 40],  // 顶行，B在[0][4]=40
  [1,  4,  10, 10, 15],
  [1,  3,   6,  0,  5],  // C在[2][3]=0
  [1,  2,   3,  4,  5],
  [1,  1,   1,  1,  1],  // 底行，A在[4][0]=1
]

// 必过某点：5列×5行，C在[2][2]（从顶数第3行，从左数第3列）
// 分两段：A→C段（左下3×3子网格），C→B段（C作为新起点）
// A→C段：C=[2][2]=6
// C→B段：C重新作为起点标6，向右向上继续标
const mustPassGrid: (number | null)[][] = [
  [null, null,  6,  18,  36,  60],  // 顶行，B在[0][5]=60
  [null, null,  6,  12,  18,  24],
  [   1,    3,  6,   6,   6,   6],  // C在[2][2]=6（第一程终点=第二程起点）
  [   1,    2,  3, null, null, null],
  [   1,    1,  1, null, null, null],  // 底行，A在[4][0]=1
]

// 特殊形状：阶梯形，丁丁家在右下角，乐乐老师家在左上角
// 方向：向左或向上（从右下到左上）
// 规则：某格 = 右方格 + 下方格
// 底行5格，row3全5格，row2前4格，row1前3格，row0前2格
const specialGrid: (number | null)[][] = [
  [90,  42, null, null, null],  // 顶行2格，乐乐老师家在[0][0]=90
  [48,  28,   14, null, null],  // 第2行3格
  [20,  14,    9,    5, null],  // 第3行4格
  [ 6,   5,    4,    3,    2],  // 第4行5格
  [ 1,   1,    1,    1,    1],  // 底行5格，丁丁家在[4][4]=1
]

// ==================== 标数法入口介绍页 ====================
const SPIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🗺️</span>什么是标数法？</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="story-box">
        <div className="story-icon">🚶</div>
        <p>田田从家 (A) 去学校 (B)，有多少条最短路线？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="concept-box">
        <p><strong>最短路线</strong>有三个要求：</p>
        <div className="concept-list">
          <span className="concept-item">🚫 不绕路</span>
          <span className="concept-item">🚫 不重复</span>
          <span className="concept-item">🚫 不回头</span>
        </div>
      </div>
    </FadeIn>
    
    <FadeIn delay={900}>
      <div className="tip-box">
        <span className="tip-icon">💡</span>
        <p>在网格图中，从左下角到右上角的最短路线，只能<strong>向右</strong>或<strong>向上</strong>走！</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1200}>
      <div className="venn-demo">
        <GridDiagram rows={4} cols={4} />
      </div>
    </FadeIn>
    
    <FadeIn delay={1500}>
      <div className="rule-box">
        <p><strong>标数法核心：</strong></p>
        <p className="rhyme">某点的数 = 来源路线数之和</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1800}>
      <button className="next-btn" onClick={onNext}>学习标数法步骤 →</button>
    </FadeIn>
  </div>
)

// ==================== 标数法步骤讲解页 ====================
const SPConceptPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  
  // 逐步展示标数过程，与图片P2基础型一致
  // grid[0]=顶行(B), grid[3]=底行(A)，4列4行
  // undefined = 格子存在但未标数，null = 格子不存在
  const stepGrids: (number | null | undefined)[][][] = [
    // step0: 空网格（所有格子存在但未标数）
    [[undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined]],
    // step1: 底行（A行）全标1
    [[undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined],[undefined,undefined,undefined,undefined],[1,1,1,1]],
    // step2: 左列全标1
    [[1,undefined,undefined,undefined],[1,undefined,undefined,undefined],[1,undefined,undefined,undefined],[1,1,1,1]],
    // step3: 第2列
    [[1,4,undefined,undefined],[1,3,undefined,undefined],[1,2,undefined,undefined],[1,1,1,1]],
    // step4: 第3列
    [[1,4,10,undefined],[1,3,6,undefined],[1,2,3,undefined],[1,1,1,1]],
    // step5: 完整（B=20）
    [[1,4,10,20],[1,3,6,10],[1,2,3,4],[1,1,1,1]],
  ]

  const stepTexts = [
    { num: '1', text: '找起点 A（左下角）和终点 B（右上角）', btn: '② 标底行 →' },
    { num: '2', text: 'A 点标 1，A 所在的底行全部标 1（只有一条路能到达）', btn: '③ 标左列 →' },
    { num: '3', text: 'A 所在的左列全部标 1（只有一条路能到达）', btn: '④ 标第2列 →' },
    { num: '4', text: '第2列：每格 = 左方格 + 下方格（2=1+1, 3=1+2, 4=1+3）', btn: '⑤ 标第3列 →' },
    { num: '5', text: '第3列：每格 = 左方格 + 下方格（3=2+1, 6=3+3, 10=4+6）', btn: '⑥ 标到终点 →' },
    { num: '6', text: '第4列：4=3+1, 10=6+4, 20=10+10，终点 B 的数就是答案！', btn: '看基础例题 →' },
  ]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">⭐</span>标数法步骤</h2></FadeIn>
      
      <FadeIn delay={300}>
        <div className="formula-box">
          <div className="formula" style={{ fontSize: '1.4rem' }}>某点的数 = 左方格的数 + 下方格的数</div>
        </div>
      </FadeIn>
      
      <FadeIn delay={600}>
        <div className="venn-demo">
          <GridDiagram rows={4} cols={4} numbers={stepGrids[step]} />
        </div>
      </FadeIn>

      <FadeIn delay={800}>
        <div className={`step-card ${step === 5 ? 'step-final' : step > 0 ? 'step-highlight' : ''}`}>
          <span className="step-number">{stepTexts[step].num}</span>
          <p>{stepTexts[step].text}</p>
        </div>
        {step === 5 ? (
          <>
            <div className="answer-box" style={{marginTop: '15px'}}>
              <span className="answer-icon">🎉</span>
              <p>共有<strong>20 条</strong>最短路线！</p>
            </div>
            <button className="next-btn" onClick={onNext}>{stepTexts[step].btn}</button>
          </>
        ) : (
          <button className="next-btn" onClick={() => setStep(s => s + 1)}>{stepTexts[step].btn}</button>
        )}
      </FadeIn>
    </div>
  )
}

// ==================== 标数法基础例题页 ====================
// 对应图片P2：4列×4行，A在左下，B在右上，答案20
const SPBasicPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">📝</span>①基础型</h2></FadeIn>
      
      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 例题</h3>
          <p>田田在下面的路线图中，从 A 点到 B 点，共有多少种不同的最短路线？</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={600}>
        <div className="venn-demo">
          {/* basicGrid: 4列4行，A在[3][0]，B在[0][3] */}
          <GridDiagram
            rows={4}
            cols={4}
            numbers={basicGrid}
          />
        </div>
      </FadeIn>

      <FadeIn delay={900}>
        <div className="rule-box">
          <p><strong>解析：</strong>①找起点 A、终点 B；②确定方向：向右向上；③A 点标 1，A 所在行和列都标 1；④按方向由近及远逐行/列标数；⑤终点 B 的标数就是答案。</p>
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="answer-box">
          <span className="answer-icon">🎉</span>
          <p>终点 B 标的是 <strong>20</strong></p>
          <p>共有 <strong>20 种</strong>最短路线！</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={1500}>
        <button className="next-btn" onClick={onNext}>学习不过某点 →</button>
      </FadeIn>
    </div>
  )
}

// ==================== 标数法 - 不过某点题型 ====================
// 对应图片P2：5列×5行，C在[2][3]，C标0，答案40
const SPForbiddenPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🚫</span>②不过某点/某区域</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>田田从家所在的 A 点去学校所在的 B 点，但途中不能经过 C 点的商店，不同的最短路线一共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        <span className="tip-icon">💡</span>
        <p>不能经过的点标 <strong>0</strong> 或打 <strong>×</strong>，C 点标 0 后会影响后面点的标数！</p>
      </div>
    </FadeIn>

    <FadeIn delay={900}>
      <div className="venn-demo">
        {/*
          forbiddenGrid: 5列×5行
          A在[4][0]（左下），B在[0][4]（右上）
          C在[2][3]，标0
          底行：1,1,1,1,1
          第2行：1,2,3,4,5
          第3行：1,3,6,0(C),5
          第4行：1,4,10,10,15
          顶行：1,5,15,25,40(B)
        */}
        <GridDiagram
          rows={5}
          cols={5}
          numbers={forbiddenGrid}
          forbidden={[[2, 3]]}
          specialPoints={[{ r: 2, c: 3, label: 'C', color: '#ec4899' }]}
        />
      </div>
    </FadeIn>
    
    <FadeIn delay={1200}>
      <div className="rule-box">
        <p><strong>解析：</strong>C 点标 0，C 右方的格子只能从下方来（不能从 C 来），所以 C 右方的格子数值会减少。按照标数法步骤继续标，终点 B 的标数就是 40。</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1500}>
      <div className="answer-box">
        <span className="answer-icon">✅</span>
        <p>终点 B 标的是 <strong>40</strong></p>
        <p>共有 <strong>40 条</strong>最短路线</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1800}>
      <button className="next-btn" onClick={onNext}>学习必过某点 →</button>
    </FadeIn>
  </div>
)

// ==================== 标数法 - 必过某点题型 ====================
// 对应图片P3：5列×5行，C在[2][2]，分两段
// 第一程 A→C：左下3×3子网格，C=[2][2]=6
// 第二程 C→B：C作为新起点标6，向右向上继续
// 完整网格6列×5行（含两段合并展示）
const SPMustPassPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">✅</span>③必过某点/某线</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>田田从家所在的 A 点去学校所在的 B 点，但途中必须经过 C 点的牛牛家，不同的最短路线共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        <span className="tip-icon">💡</span>
        <p>必过某点 → <strong>分段标数，圈画出范围</strong></p>
        <p style={{marginTop: 6}}>第一程：A → C；第二程：C → B（C 的标数作为第二程起点值）</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={900}>
      <div className="venn-demo">
        {/*
          mustPassGrid: 6列×5行（合并两段展示）
          A在[4][0]（左下），B在[0][5]（右上）
          C在[2][2]，C=6（第一程终点=第二程起点）
          
          第一程 A→C（左下3×3子网格）：
            [4][0..2]: 1,1,1
            [3][0..2]: 1,2,3
            [2][0..2]: 1,3,6(C)
          
          第二程 C→B（C标6，向右向上）：
            [2][2..5]: 6,6,6,6
            [1][2..5]: 6,12,18,24
            [0][2..5]: 6,18,36,60(B)
          
          null表示不参与该程的格子
        */}
        <GridDiagram
          rows={5}
          cols={6}
          numbers={mustPassGrid}
          startPos={[4, 0]}
          endPos={[0, 5]}
          segmentBoxes={[
            { r1: 2, c1: 0, r2: 5, c2: 3, color: '#ef4444' },   // 第一程框（A→C）
            { r1: 0, c1: 2, r2: 3, c2: 6, color: '#3b82f6' },   // 第二程框（C→B）
          ]}
          specialPoints={[{ r: 2, c: 2, label: 'C', color: '#ec4899' }]}
        />
      </div>
    </FadeIn>
    
    <FadeIn delay={1200}>
      <div className="rule-box">
        <p><strong>解析：</strong>C 点是必过的点，把题目拆解为先去 C 点再去 B 点。第一程从 A 到 C，C 点标 6；第二程从 C 到 B，C 作为新起点标 6，继续按标数法标数，终点 B 标 60。</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1500}>
      <div className="answer-box">
        <span className="answer-icon">🎉</span>
        <p>终点 B 标的是 <strong>60</strong></p>
        <p>共有 <strong>60 条</strong>最短路线</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1800}>
      <button className="next-btn" onClick={onNext}>学习特殊形状 →</button>
    </FadeIn>
  </div>
)

// ==================== 标数法 - 特殊形状题型 ====================
// 对应图片P3：阶梯形，丁丁家在右下角，乐乐老师家在左上角
// 方向：向左或向上（从右下到左上）
// 底行5格（col0~4），往上每行右侧减少1格
// specialGrid[r][c]: null表示该格不存在
const SPSpecialPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🔷</span>④特殊形状</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>丁丁从家里去乐乐老师家，路线图如下所示，最短路线一共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        <span className="tip-icon">⚠️</span>
        <p>不再是规整的矩形！要<strong>看清每个点能从哪里来</strong>，再按标数法步骤做。</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={900}>
      <div className="venn-demo">
        {/*
          specialGrid: 5列×5行，阶梯形
          丁丁家在右下角[4][4]，乐乐老师家在左上角[0][0]
          方向：向左或向上
          
          底行（row4）：1, 1, 1, 1, 1（全5格）
          row3：6, 5, 4, 3, 2（全5格）
          row2：20, 14, 9, 5, null（4格，右侧1格不存在）
          row1：48, 28, 14, null, null（3格）
          顶行（row0）：90, 42, null, null, null（2格，乐乐老师家在[0][0]）
          
          起点：丁丁家[4][4]（右下）
          终点：乐乐老师家[0][0]（左上）
        */}
        <GridDiagram
          rows={5}
          cols={5}
          numbers={specialGrid}
          startPos={[4, 4]}
          endPos={[0, 0]}
          startLabel="丁丁家"
          endLabel="乐乐老师家"
        />
      </div>
    </FadeIn>
    
    <FadeIn delay={1200}>
      <div className="rule-box">
        <p><strong>解析：</strong>丁丁走的区域是特殊阶梯形，不是规整矩形。做这道题一定要看清标的这个点能从哪里来（只能向左或向上），然后再按照标数法的步骤去做。</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1500}>
      <div className="answer-box">
        <span className="answer-icon">✅</span>
        <p>乐乐老师家标的是 <strong>90</strong></p>
        <p>共有 <strong>90 条</strong>最短路线</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={1800}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

const SPPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const [currentProblem, setCurrentProblem] = useState(0)
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const problems = [
    {
      title: "①基础练习",
      question: "从 A 点到 B 点，最短路线有多少种？（3列×3行网格）",
      rows: 3,
      cols: 3,
      answer: 6,
      forbidden: [] as [number, number][]
    },
    {
      title: "②基础练习（进阶）",
      question: "从 A 点到 B 点，最短路线有多少种？（3列×4行网格）",
      rows: 4,
      cols: 3,
      answer: 10,
      forbidden: [] as [number, number][]
    },
    {
      title: "③不过某点",
      question: "从 A 到 B，不能经过 C 点（第2行第2列），最短路线有多少种？",
      rows: 4,
      cols: 4,
      forbidden: [[2, 1]] as [number, number][],
      answer: 8,
    },
  ]

  const current = problems[currentProblem]

  const handleSubmit = () => {
    const correct = parseInt(answer) === current.answer
    setSubmitted(true)
    setIsCorrect(correct)
    if (correct) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const nextProblem = () => {
    if (currentProblem < problems.length - 1) {
      setCurrentProblem(currentProblem + 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  const prevProblem = () => {
    if (currentProblem > 0) {
      setCurrentProblem(currentProblem - 1)
      setAnswer('')
      setSubmitted(false)
      setIsCorrect(false)
    }
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎮</span>小小练习</h2></FadeIn>
      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 题目 {currentProblem + 1}/{problems.length}</h3>
          <p>{current.title}</p>
          <p>{current.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={600}>
        <div className="venn-demo">
          <GridDiagram 
            rows={current.rows} 
            cols={current.cols} 
            forbidden={current.forbidden}
          />
        </div>
      </FadeIn>
      <FadeIn delay={900}>{!submitted ? (
        <div className="answer-input">
          <input type="number" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请输入答案" />
          <button className="submit-btn" onClick={handleSubmit}>提交答案</button>
        </div>
      ) : (
        <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? (
            <>
              <span className="result-icon">🎉</span>
              <p>太棒了！答对了！</p>
              <p className="explanation">正确答案：{current.answer}种</p>
              {currentProblem < problems.length - 1 && (
                <button className="next-btn" onClick={nextProblem}>下一题 →</button>
              )}
            </>
          ) : (
            <>
              <span className="result-icon">🤔</span>
              <p>再想想哦~</p>
              <p className="explanation">提示：用标数法，从起点开始标</p>
              <button className="retry-btn" onClick={() => { setAnswer(''); setSubmitted(false) }}>再试一次</button>
            </>
          )}
        </div>
      )}</FadeIn>
      
      {showCelebration && (
        <div className="celebration-overlay">
          <div className="celebration-stars">
            {[...Array(20)].map((_, i) => (
              <Star 
                key={i} 
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s`,
                  width: `${20 + Math.random() * 40}px`,
                  height: `${20 + Math.random() * 40}px`,
                  color: i % 3 === 0 ? '#fbbf24' : i % 3 === 1 ? '#60a5fa' : '#34d399'
                }}
              />
            ))}
          </div>
          <div className="celebration-text">
            <div className="celebration-emoji">🎉🎊✨</div>
            <div className="celebration-message">太棒了！</div>
          </div>
        </div>
      )}

      <div className="problem-nav">
        <button 
          className="nav-btn" 
          onClick={prevProblem} 
          disabled={currentProblem === 0}
        >
          ← 上一题
        </button>
        <button 
          className="nav-btn" 
          onClick={nextProblem} 
          disabled={currentProblem === problems.length - 1 || !submitted || !isCorrect}
        >
          下一题 →
        </button>
      </div>

      {currentProblem === problems.length - 1 && submitted && isCorrect && (
        <FadeIn delay={1200}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>标数法 = 某点数值 = 来源之和</li>
              <li>不过某点 → 标0</li>
              <li>必过某点 → 分段相乘</li>
              <li>特殊形状 → 看清来源</li>
            </ul>
          </div>
          <FadeIn delay={1500}><button className="restart-btn" onClick={onHome}>✅ 完成学习</button></FadeIn>
        </FadeIn>
      )}
    </div>
  )
}

const LoopIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🔁</span>C++ 循环是什么？</h2></FadeIn>

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
        <span className="tip-icon">💡</span>
        <p>在 C++ 里，最常见的循环写法就是 <strong>for 循环</strong>。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1500}>
      <button className="next-btn" onClick={onNext}>学习基本语法 →</button>
    </FadeIn>
  </div>
)

const LoopSyntaxPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🧩</span>for 循环基本语法</h2></FadeIn>

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

const LoopProcessPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title"><span className="emoji">🎬</span>循环怎么一遍遍执行？</h2></FadeIn>

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

const LoopExamplePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const scores = [1, 2, 3, 4, 5]
  const [step, setStep] = useState(0)
  const total = scores.slice(0, step).reduce((sum, value) => sum + value, 0)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🌟</span>实际案例：一周积分统计</h2></FadeIn>

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

const LoopPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
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
      <FadeIn><h2 className="page-title"><span className="emoji">🎮</span>循环小练习</h2></FadeIn>

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
            <span className="result-icon">{isCorrect ? '🎉' : '🤔'}</span>
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

type SortAlgorithm = 'bubble' | 'selection' | 'insertion'
type SortAction = 'start' | 'compare' | 'swap' | 'select-min' | 'pick-key' | 'shift' | 'insert' | 'mark-sorted' | 'done'

type SortStep = {
  array: number[]
  action: SortAction
  activeLine: number
  message: string
  comparing?: number[]
  swapping?: number[]
  selected?: number[]
  sortedIndices?: number[]
  runtimeBadges: RuntimeBadge[]
  lineBadges?: Record<number, RuntimeBadge[]>
}

const SORT_LESSONS: Record<SortAlgorithm, {
  title: string
  emoji: string
  desc: string
  story: string
  codeLines: string[]
}> = {
  bubble: {
    title: '冒泡排序',
    emoji: '🫧',
    desc: '每次比较相邻两个数，把更大的数慢慢推到右边。',
    story: '像大气泡一轮一轮浮到水面，最大的数也会慢慢走到队伍最后面。',
    codeLines: [
      'for (int end = n - 1; end > 0; end--) {',
      '  for (int j = 0; j < end; j++) {',
      '    if (a[j] > a[j + 1]) {',
      '      swap(a[j], a[j + 1]);',
      '    }',
      '  }',
      '}',
    ],
  },
  selection: {
    title: '选择排序',
    emoji: '🔎',
    desc: '每一轮都在后面找一个最小的数，换到前面来。',
    story: '像老师从队伍里挑出最矮的小朋友，请他站到最前面。',
    codeLines: [
      'for (int i = 0; i < n - 1; i++) {',
      '  int minIndex = i;',
      '  for (int j = i + 1; j < n; j++) {',
      '    if (a[j] < a[minIndex]) {',
      '      minIndex = j;',
      '    }',
      '  }',
      '  swap(a[i], a[minIndex]);',
      '}',
    ],
  },
  insertion: {
    title: '插入排序',
    emoji: '🧩',
    desc: '每次拿起一个数，插进前面已经排好的队伍里。',
    story: '像整理扑克牌，把新拿到的一张牌插进前面已经排好的位置。',
    codeLines: [
      'for (int i = 1; i < n; i++) {',
      '  int key = a[i];',
      '  int j = i - 1;',
      '  while (j >= 0 && a[j] > key) {',
      '    a[j + 1] = a[j];',
      '    j--;',
      '  }',
      '  a[j + 1] = key;',
      '}',
    ],
  },
}

const cloneSortArray = (array: number[]) => [...array]

const pushSortStep = (steps: SortStep[], array: number[], step: Omit<SortStep, 'array'>) => {
  steps.push({
    array: cloneSortArray(array),
    ...step,
  })
}

const generateBubbleSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []
  const sortedIndices: number[] = []

  pushSortStep(steps, array, {
    action: 'start',
    activeLine: 0,
    message: '先确定无序区域的右边界，从队伍最后开始安排。',
    sortedIndices: [],
    runtimeBadges: [{ label: 'end', value: `${array.length - 1}` }],
    lineBadges: { 0: [{ label: 'end', value: `${array.length - 1}` }] },
  })

  for (let end = array.length - 1; end > 0; end--) {
    for (let j = 0; j < end; j++) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 2,
        message: `比较第 ${j + 1} 个和第 ${j + 2} 个数。`,
        comparing: [j, j + 1],
        sortedIndices: [...sortedIndices],
        runtimeBadges: [{ label: 'end', value: `${end}` }, { label: 'j', value: `${j}` }],
        lineBadges: {
          0: [{ label: 'end', value: `${end}` }],
          1: [{ label: 'j', value: `${j}` }],
          2: [{ label: '比较', value: `${array[j]} > ${array[j + 1]}` }],
        },
      })

      if (array[j] > array[j + 1]) {
        ;[array[j], array[j + 1]] = [array[j + 1], array[j]]
        pushSortStep(steps, array, {
          action: 'swap',
          activeLine: 3,
          message: `左边更大，交换两个数的位置。`,
          swapping: [j, j + 1],
          sortedIndices: [...sortedIndices],
          runtimeBadges: [{ label: 'end', value: `${end}` }, { label: 'j', value: `${j}` }],
          lineBadges: {
            3: [{ label: 'swap', value: `${array[j]} 和 ${array[j + 1]}` }],
          },
        })
      }
    }

    sortedIndices.unshift(end)
    pushSortStep(steps, array, {
      action: 'mark-sorted',
      activeLine: 0,
      message: `这一轮结束，位置 ${end + 1} 上的数已经排好了。`,
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: '已排好', value: `${sortedIndices.length} 个` }],
      lineBadges: { 0: [{ label: 'end', value: `${end - 1}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 6,
    message: '冒泡排序完成，所有数字都从小到大站好了。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateSelectionSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []
  const sortedIndices: number[] = []

  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i
    pushSortStep(steps, array, {
      action: 'select-min',
      activeLine: 1,
      message: `先把第 ${i + 1} 个数当成当前最小值。`,
      selected: [minIndex],
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
      lineBadges: { 1: [{ label: 'minIndex', value: `${minIndex}` }] },
    })

    for (let j = i + 1; j < array.length; j++) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 3,
        message: `看看第 ${j + 1} 个数会不会更小。`,
        comparing: [minIndex, j],
        selected: [minIndex],
        sortedIndices: [...sortedIndices],
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'j', value: `${j}` }, { label: 'minIndex', value: `${minIndex}` }],
        lineBadges: {
          2: [{ label: 'j', value: `${j}` }],
          3: [{ label: '比较', value: `${array[j]} < ${array[minIndex]}` }],
        },
      })

      if (array[j] < array[minIndex]) {
        minIndex = j
        pushSortStep(steps, array, {
          action: 'select-min',
          activeLine: 4,
          message: `找到新的最小值，它现在站在第 ${minIndex + 1} 个位置。`,
          selected: [minIndex],
          sortedIndices: [...sortedIndices],
          runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
          lineBadges: { 4: [{ label: 'minIndex', value: `${minIndex}` }] },
        })
      }
    }

    ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
    sortedIndices.push(i)
    pushSortStep(steps, array, {
      action: 'swap',
      activeLine: 7,
      message: '把这一轮找到的最小值交换到前面来。',
      swapping: [i, minIndex],
      sortedIndices: [...sortedIndices],
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'minIndex', value: `${minIndex}` }],
      lineBadges: { 7: [{ label: 'swap', value: `${i} ↔ ${minIndex}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 8,
    message: '选择排序完成，前面的位置一个个都安排好了。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateInsertionSteps = (input: number[]) => {
  const array = cloneSortArray(input)
  const steps: SortStep[] = []

  pushSortStep(steps, array, {
    action: 'start',
    activeLine: 0,
    message: '第 1 个数先自己站好，后面的数一个个插进来。',
    sortedIndices: [0],
    runtimeBadges: [{ label: 'i', value: '1' }],
  })

  for (let i = 1; i < array.length; i++) {
    const key = array[i]
    let j = i - 1

    pushSortStep(steps, array, {
      action: 'pick-key',
      activeLine: 1,
      message: `拿起数字 ${key}，准备插入前面已经排好的队伍。`,
      selected: [i],
      sortedIndices: Array.from({ length: i }, (_, index) => index),
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
      lineBadges: { 1: [{ label: 'key', value: `${key}` }], 2: [{ label: 'j', value: `${j}` }] },
    })

    while (j >= 0 && array[j] > key) {
      pushSortStep(steps, array, {
        action: 'compare',
        activeLine: 3,
        message: `比较 ${array[j]} 和 ${key}，看看要不要给 ${key} 腾位置。`,
        comparing: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 3: [{ label: '条件', value: `${array[j]} > ${key}` }] },
      })

      array[j + 1] = array[j]
      pushSortStep(steps, array, {
        action: 'shift',
        activeLine: 4,
        message: `${array[j]} 向右移动一格，给 ${key} 留出空位。`,
        swapping: [j, j + 1],
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 4: [{ label: '移动', value: `${array[j]} → 右边` }] },
      })

      j--
      pushSortStep(steps, array, {
        action: 'shift',
        activeLine: 5,
        message: `继续往左看，下一个要比较的位置变成 ${j}。`,
        sortedIndices: Array.from({ length: i }, (_, index) => index),
        runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: 'j', value: `${j}` }],
        lineBadges: { 5: [{ label: 'j', value: `${j}` }] },
      })
    }

    array[j + 1] = key
    pushSortStep(steps, array, {
      action: 'insert',
      activeLine: 7,
      message: `${key} 插入成功，它已经站到了正确的位置。`,
      selected: [j + 1],
      sortedIndices: Array.from({ length: i + 1 }, (_, index) => index),
      runtimeBadges: [{ label: 'i', value: `${i}` }, { label: 'key', value: `${key}` }, { label: '插入位置', value: `${j + 1}` }],
      lineBadges: { 7: [{ label: 'a[j + 1]', value: `${key}` }] },
    })
  }

  pushSortStep(steps, array, {
    action: 'done',
    activeLine: 8,
    message: '插入排序完成，整个队伍已经从小到大排整齐。',
    sortedIndices: Array.from({ length: array.length }, (_, index) => index),
    runtimeBadges: [{ label: '状态', value: '完成' }],
  })

  return steps
}

const generateSortSteps = (algorithm: SortAlgorithm, input: number[]) => {
  if (algorithm === 'bubble') return generateBubbleSteps(input)
  if (algorithm === 'selection') return generateSelectionSteps(input)
  return generateInsertionSteps(input)
}

const SORT_DEMO_ARRAY = [5, 1, 4, 2, 3]

const SortingBars = ({
  step,
}: {
  step: SortStep
}) => {
  const maxValue = Math.max(...step.array)

  return (
    <div className="sorting-bars">
      {step.array.map((value, index) => {
        const isComparing = step.comparing?.includes(index)
        const isSwapping = step.swapping?.includes(index)
        const isSelected = step.selected?.includes(index)
        const isSorted = step.sortedIndices?.includes(index)
        const className = isSwapping ? 'swapping' : isComparing ? 'comparing' : isSelected ? 'selected' : isSorted ? 'sorted' : ''

        return (
          <div key={`${index}-${value}-${step.action}`} className="sorting-bar-wrap">
            <div className={`sorting-bar ${className}`} style={{ height: `${(value / maxValue) * 180 + 40}px` }}>
              <span>{value}</span>
            </div>
            <div className="sorting-index">{index}</div>
          </div>
        )
      })}
    </div>
  )
}

const SortIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">📊</span>C++ 排序算法是什么？</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="story-box">
        <div className="story-icon">🧒</div>
        <p>如果 5 个数字小朋友站成一排，我们想让它们从小到大站整齐，就需要用到排序算法。</p>
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <div className="concept-box">
        <p><strong>排序</strong>就是：按照一定规则，把一组数重新排好顺序。</p>
        <div className="concept-list">
          <span className="concept-item">🔍 先比较</span>
          <span className="concept-item">🔁 再移动</span>
          <span className="concept-item">✅ 最后排整齐</span>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={900}>
      <div className="tip-box">
        <span className="tip-icon">💡</span>
        <p>在 C++ 里，排序算法经常会用到循环、比较和交换位置。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>认识三种排序方法 →</button>
    </FadeIn>
  </div>
)

const SortAlgosPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🧠</span>三种常见排序方法</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="sort-algo-grid">
        {(['bubble', 'selection', 'insertion'] as SortAlgorithm[]).map((algorithm) => {
          const lesson = SORT_LESSONS[algorithm]
          return (
            <div key={algorithm} className="sort-algo-card">
              <div className="sort-algo-emoji">{lesson.emoji}</div>
              <h3>{lesson.title}</h3>
              <p>{lesson.desc}</p>
              <p className="sort-story">{lesson.story}</p>
            </div>
          )
        })}
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <div className="rule-box">
        <p><strong>学习重点：</strong></p>
        <p className="rhyme">看谁在比较，看谁在移动，看谁已经站好。</p>
      </div>
    </FadeIn>
    <FadeIn delay={900}>
      <button className="next-btn" onClick={onNext}>开始动画演示 →</button>
    </FadeIn>
  </div>
)

const SortVisualPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('bubble')
  const [steps, setSteps] = useState<SortStep[]>(() => generateSortSteps('bubble', SORT_DEMO_ARRAY))
  const [cursor, setCursor] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [speed, setSpeed] = useState(950)

  useEffect(() => {
    const newSteps = generateSortSteps(algorithm, SORT_DEMO_ARRAY)
    setSteps(newSteps)
    setCursor(0)
    setPlaying(true)
  }, [algorithm])

  useEffect(() => {
    if (!playing) return
    if (cursor >= steps.length - 1) return
    const timer = setTimeout(() => setCursor((current) => current + 1), speed)
    return () => clearTimeout(timer)
  }, [playing, cursor, steps, speed])

  const currentStep = steps[Math.min(cursor, steps.length - 1)]
  const lesson = SORT_LESSONS[algorithm]
  const isFinished = cursor >= steps.length - 1

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎬</span>代码和动画一起看排序</h2></FadeIn>
      <FadeIn delay={300}>
        <div className="sort-selector">
          {(['bubble', 'selection', 'insertion'] as SortAlgorithm[]).map((item) => (
            <button key={item} className={`sort-tab ${item === algorithm ? 'active' : ''}`} onClick={() => setAlgorithm(item)}>
              {SORT_LESSONS[item].emoji} {SORT_LESSONS[item].title}
            </button>
          ))}
        </div>
      </FadeIn>
      <FadeIn delay={500}>
        <div className="tip-box">
          <span className="tip-icon">{lesson.emoji}</span>
          <p>{lesson.story}</p>
        </div>
      </FadeIn>
      <FadeIn delay={700}>
        <LessonCode
          lines={lesson.codeLines}
          activeLine={currentStep.activeLine}
          lineBadges={currentStep.lineBadges}
          runtimeBadges={currentStep.runtimeBadges}
          runtimeTitle="这一行执行时，变量是多少？"
          runtimeHint={currentStep.message}
        />
      </FadeIn>
      <FadeIn delay={900}>
        <div className="sort-visual-box">
          <SortingBars step={currentStep} />
          <div className="sort-legend">
            <span><i className="legend-dot comparing"></i>正在比较</span>
            <span><i className="legend-dot swapping"></i>正在移动</span>
            <span><i className="legend-dot selected"></i>当前重点</span>
            <span><i className="legend-dot sorted"></i>已经排好</span>
          </div>
          <div className="sort-controls">
            <button className="nav-btn" onClick={() => { setPlaying(false); setCursor(0) }}>重新开始</button>
            <button className="nav-btn" onClick={() => setPlaying((value) => !value)}>{playing && !isFinished ? '暂停' : '播放'}</button>
            <button className="nav-btn" onClick={() => { setPlaying(false); setCursor((value) => Math.min(value + 1, steps.length - 1)) }} disabled={isFinished}>下一步</button>
          </div>
          <div className="speed-switch">
            {[1300, 950, 650].map((value, index) => (
              <button key={value} className={`speed-chip ${speed === value ? 'active' : ''}`} onClick={() => setSpeed(value)}>
                {['慢速', '中速', '快速'][index]}
              </button>
            ))}
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={1200}>
        <button className="next-btn" onClick={onNext}>看生活案例 →</button>
      </FadeIn>
    </div>
  )
}

const SortExamplePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">📚</span>实际案例：整理分数卡片</h2></FadeIn>
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 场景</h3>
        <p>老师把 5 张分数卡片放在桌上：95、68、82、74、88，想从小到大排好，方便大家一眼看出名次。</p>
      </div>
    </FadeIn>
    <FadeIn delay={600}>
      <LessonCode
        lines={[
          'vector<int> scores = {95, 68, 82, 74, 88};',
          'for (int end = scores.size() - 1; end > 0; end--) {',
          '  for (int j = 0; j < end; j++) {',
          '    if (scores[j] > scores[j + 1]) {',
          '      swap(scores[j], scores[j + 1]);',
          '    }',
          '  }',
          '}',
        ]}
        activeLine={3}
        runtimeBadges={[
          { label: '当前比较', value: '95 和 68' },
          { label: '要做什么', value: '交换位置' },
        ]}
        runtimeTitle="老师现在看到的值"
        runtimeHint="如果前面的分数更大，就把它往后换，让更小的分数慢慢来到前面。"
      />
    </FadeIn>
    <FadeIn delay={900}>
      <div className="answer-box">
        <span className="answer-icon">✨</span>
        <p>排序后得到：<strong>68，74，82，88，95</strong></p>
        <p>这样不但更整齐，也更容易比较大小。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>开始练习 →</button>
    </FadeIn>
  </div>
)

const SortPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      title: '① 比较的作用',
      question: '排序时，为什么要先比较两个数？',
      options: ['为了知道谁应该站前面', '为了把数字变大', '为了让数组变长'],
      answer: 0,
      explanation: '比较大小后，程序才知道谁应该往前、谁应该往后。',
    },
    {
      title: '② 冒泡排序特点',
      question: '冒泡排序每一轮最容易先确定的是哪一边？',
      options: ['最左边', '最右边', '中间'],
      answer: 1,
      explanation: '每轮比较后，较大的数会慢慢跑到右边，所以最右边会先确定。',
    },
    {
      title: '③ 插入排序想法',
      question: '插入排序最像下面哪件事？',
      options: ['从头再写一遍数字', '把一张牌插进已排好的扑克牌里', '把所有数都删掉'],
      answer: 1,
      explanation: '插入排序就是把当前数字插进前面已经有序的部分里。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const currentQuestion = questions[current]
  const isCorrect = selected === currentQuestion.answer

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎯</span>排序算法小练习</h2></FadeIn>
      <FadeIn delay={300}>
        <div className="example-box">
          <h3>📋 题目 {current + 1}/{questions.length}</h3>
          <p>{currentQuestion.title}</p>
          <p>{currentQuestion.question}</p>
        </div>
      </FadeIn>
      <FadeIn delay={600}>
        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === currentQuestion.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
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
            <span className="result-icon">{isCorrect ? '🎉' : '🤔'}</span>
            <p>{isCorrect ? '答对啦！' : '再记一记这个知识点哦！'}</p>
            <p className="explanation">{currentQuestion.explanation}</p>
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={() => { setCurrent(current + 1); setSelected(null); setSubmitted(false) }}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>
      {current === questions.length - 1 && submitted && (
        <FadeIn delay={1200}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>排序就是把数字重新排好顺序</li>
              <li>排序算法常常依靠比较、移动和交换</li>
              <li>C++ 可以用循环一步一步完成排序任务</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

// ========== 体育比赛中的学问模块 ==========
type SportPair = [string, string]
type SportScoreMode = '210' | '310'
type SportScoreMatch = {
  left: string
  right: string
  result: string
  leftPoints: number
  rightPoints: number
  total: number
}

const buildLeaguePairs = (teams: string[]): SportPair[] => {
  const pairs: SportPair[] = []
  for (let i = 0; i < teams.length; i += 1) {
    for (let j = i + 1; j < teams.length; j += 1) {
      pairs.push([teams[i], teams[j]])
    }
  }
  return pairs
}

const SportLeagueDiagram = ({
  teams,
  playedPairs,
  activePair,
  labels = {},
}: {
  teams: string[]
  playedPairs: SportPair[]
  activePair?: SportPair | null
  labels?: Record<string, string>
}) => {
  const points = teams.map((team, index) => {
    const angle = -Math.PI / 2 + (index * Math.PI * 2) / teams.length
    return {
      team,
      x: 150 + Math.cos(angle) * 96,
      y: 150 + Math.sin(angle) * 96,
    }
  })

  const pointMap = points.reduce<Record<string, { x: number, y: number }>>((acc, point) => {
    acc[point.team] = { x: point.x, y: point.y }
    return acc
  }, {})

  return (
    <div className="sport-diagram-panel">
      <svg viewBox="0 0 300 300" className="sport-league-svg">
        {playedPairs.map(([left, right], index) => {
          const start = pointMap[left]
          const end = pointMap[right]
          return (
            <line
              key={`${left}-${right}-${index}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="sport-link played"
            />
          )
        })}
        {activePair && (() => {
          const start = pointMap[activePair[0]]
          const end = pointMap[activePair[1]]
          return (
            <line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="sport-link active"
            />
          )
        })()}

        {points.map(({ team, x, y }) => (
          <g key={team}>
            <circle cx={x} cy={y} r="23" className="sport-node" />
            <text x={x} y={y + 6} textAnchor="middle" className="sport-node-text">{team}</text>
            {labels[team] && (
              <text
                x={x}
                y={y > 150 ? y + 42 : y - 34}
                textAnchor="middle"
                className="sport-node-label"
              >
                {labels[team]}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  )
}

const SportIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🏆</span>体育比赛里也藏着数学！</h2></FadeIn>

    <FadeIn delay={250}>
      <div className="story-box">
        <div className="story-icon">🎽</div>
        <p>学校要办跳绳赛、足球赛和乒乓赛，老师想知道：怎么安排比赛？一共要比几场？积分又该怎么算？</p>
      </div>
    </FadeIn>

    <FadeIn delay={500}>
      <div className="sport-mode-grid">
        <div className="sport-mode-card elimination">
          <div className="sport-mode-icon">⚡</div>
          <h3>单败淘汰赛</h3>
          <p>每场比赛都会淘汰 1 支队伍，直到只剩冠军。</p>
          <span>特点：赛程短，速度快</span>
        </div>
        <div className="sport-mode-card league">
          <div className="sport-mode-icon">🤝</div>
          <h3>单循环赛</h3>
          <p>每两支队伍都要见一次面，大家都比一轮。</p>
          <span>特点：更公平，场次更多</span>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={850}>
      <div className="sport-fact-grid">
        <div className="sport-fact-card">
          <strong>淘汰赛</strong>
          <p>总场数 = 队伍数 - 1</p>
        </div>
        <div className="sport-fact-card">
          <strong>单循环赛</strong>
          <p>总场数 = n × (n - 1) ÷ 2</p>
        </div>
        <div className="sport-fact-card">
          <strong>积分制</strong>
          <p>先看每场一共送出几分</p>
        </div>
      </div>
    </FadeIn>

    <FadeIn delay={1150}>
      <div className="tip-box">
        <span className="tip-icon">💡</span>
        <p>这一课我们不只看热闹，还要学会用“淘汰、连线、总分”三把小钥匙，打开比赛里的数学秘密。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1450}><button className="next-btn" onClick={onNext}>先看单败淘汰赛 →</button></FadeIn>
  </div>
)

const SportEliminationPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const eliminationMatches = [
    { round: '第一轮', left: '红队', right: '蓝队', winner: '红队' },
    { round: '第一轮', left: '绿队', right: '黄队', winner: '黄队' },
    { round: '第一轮', left: '紫队', right: '橙队', winner: '紫队' },
    { round: '第一轮', left: '星队', right: '月队', winner: '星队' },
    { round: '半决赛', left: '红队', right: '黄队', winner: '红队' },
    { round: '半决赛', left: '紫队', right: '星队', winner: '星队' },
    { round: '决赛', left: '红队', right: '星队', winner: '红队' },
  ]

  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    if (played >= eliminationMatches.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 850)
    return () => clearTimeout(timer)
  }, [autoPlay, played, eliminationMatches.length])

  const remainingTeams = 8 - played
  const champion = played === eliminationMatches.length ? eliminationMatches[eliminationMatches.length - 1].winner : null
  const currentMatch = eliminationMatches[played]

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">⚡</span>单败淘汰赛：每场少 1 支</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="concept-box">
          <p><strong>单败淘汰赛</strong>像闯关游戏：输了就出局，赢了才能继续往前冲。</p>
          <div className="concept-list">
            <span className="concept-item">🏁 8 支队伍出发</span>
            <span className="concept-item">❌ 每场淘汰 1 支</span>
            <span className="concept-item">🏆 最后留下 1 支冠军</span>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已比赛</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">已淘汰</span>
            <strong className="sport-counter-value">{played} 支</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">还剩队伍</span>
            <strong className="sport-counter-value">{remainingTeams} 支</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <div className="sport-current-match">
          {currentMatch ? `下一场：${currentMatch.left} vs ${currentMatch.right}` : `冠军诞生：${champion}`}
        </div>
      </FadeIn>

      <FadeIn delay={950}>
        <div className="sport-match-list">
          {eliminationMatches.map((match, index) => {
            const isDone = index < played
            const isActive = index === played
            const loser = match.winner === match.left ? match.right : match.left
            return (
              <div key={`${match.round}-${match.left}-${match.right}`} className={`sport-match-card ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                <div className="sport-match-round">{match.round}</div>
                <div className="sport-match-teams">
                  <span className={isDone && match.left === loser ? 'out' : ''}>{match.left}</span>
                  <span className="sport-vs">VS</span>
                  <span className={isDone && match.right === loser ? 'out' : ''}>{match.right}</span>
                </div>
                <div className="sport-match-note">
                  {isDone ? `✅ ${match.winner} 晋级，${loser} 被淘汰` : isActive ? '🎯 这一场正在进行' : '⏳ 等轮到它上场'}
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, eliminationMatches.length))}>打一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停连播' : '自动连播'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      <FadeIn delay={1400}>
        <div className="rule-box">
          <p><strong>为什么总场数是 n - 1？</strong></p>
          <p className="rhyme">因为每场只淘汰 1 支</p>
          <p>8 支队伍要决出冠军，得先淘汰 7 支，所以一共要比 <strong>7 场</strong>。</p>
        </div>
      </FadeIn>

      {champion && (
        <FadeIn delay={1650}>
          <div className="answer-box">
            <span className="answer-icon">🏆</span>
            <p>答：8 支队伍参加单败淘汰赛，一共比 <strong>7 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>再看单循环赛 →</button></FadeIn>
    </div>
  )
}

const SportRoundPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const teamOptions: Record<number, string[]> = {
    4: ['红', '蓝', '绿', '黄'],
    5: ['A', 'B', 'C', 'D', 'E'],
    6: ['甲', '乙', '丙', '丁', '戊', '己'],
  }

  const [teamCount, setTeamCount] = useState(4)
  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const teams = teamOptions[teamCount]
  const pairs = buildLeaguePairs(teams)
  const currentPair = played < pairs.length ? pairs[played] : null
  const playedPairs = pairs.slice(0, played)

  useEffect(() => {
    setPlayed(0)
    setAutoPlay(false)
  }, [teamCount])

  useEffect(() => {
    if (!autoPlay) return
    if (played >= pairs.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 750)
    return () => clearTimeout(timer)
  }, [autoPlay, played, pairs.length])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🤝</span>单循环赛：每两队都要见一面</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="tip-box">
          <span className="tip-icon">🧮</span>
          <p>单循环赛最公平，因为每两支队伍都要比一场。下面选队伍数，看看连线会出现多少条。</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="sport-chooser">
          {[4, 5, 6].map((count) => (
            <button
              key={count}
              className={`sport-chip ${teamCount === count ? 'active' : ''}`}
              onClick={() => setTeamCount(count)}
            >
              {count} 支队伍
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={700}>
        <SportLeagueDiagram
          teams={teams}
          playedPairs={playedPairs}
          activePair={currentPair}
        />
      </FadeIn>

      <FadeIn delay={900}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已安排</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">总场数</span>
            <strong className="sport-counter-value">{pairs.length} 场</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">还没安排</span>
            <strong className="sport-counter-value">{pairs.length - played} 场</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1100}>
        <div className="sport-current-match">
          {currentPair ? `当前连线：${currentPair[0]}队 和 ${currentPair[1]}队` : '所有队伍都见过面啦！'}
        </div>
      </FadeIn>

      <FadeIn delay={1250}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, pairs.length))}>安排一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停连线' : '自动连线'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>清空重来</button>
        </div>
      </FadeIn>

      <FadeIn delay={1450}>
        <div className="rule-box">
          <p><strong>总场数公式：</strong>{teamCount} × ({teamCount} - 1) ÷ 2 = <strong>{pairs.length}</strong></p>
          <p>先把每队要比的场次全加起来，再除以 2，因为每一场都会被两支队伍各数一次。</p>
        </div>
      </FadeIn>

      {played === pairs.length && (
        <FadeIn delay={1650}>
          <div className="answer-box">
            <span className="answer-icon">🌟</span>
            <p>{teamCount} 支队伍进行单循环赛，一共要比 <strong>{pairs.length} 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>看看点线图怎么帮忙 →</button></FadeIn>
    </div>
  )
}

const SportGraphPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const revealPairs: SportPair[] = [['A', 'B'], ['A', 'C'], ['A', 'D'], ['A', 'E'], ['B', 'C'], ['B', 'E']]
  const [revealedCount, setRevealedCount] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  useEffect(() => {
    if (!autoPlay) return
    if (revealedCount >= revealPairs.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setRevealedCount((current) => current + 1), 800)
    return () => clearTimeout(timer)
  }, [autoPlay, revealedCount, revealPairs.length])

  const labels: Record<string, string> = {
    A: '已知 4 场',
    B: '已知 3 场',
    C: '已知 2 场',
    D: '已知 1 场',
    E: revealedCount === revealPairs.length ? '答案 2 场' : '？ 场',
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🕸️</span>比赛没结束时，用点线图来帮忙</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 例题</h3>
          <p>A、B、C、D、E 五位同学进行单循环赛。</p>
          <p>A 赛了 4 场，B 赛了 3 场，C 赛了 2 场，D 赛了 1 场。</p>
          <p className="question">那 E 赛了几场？</p>
        </div>
      </FadeIn>

      <FadeIn delay={550}>
        <SportLeagueDiagram
          teams={['A', 'B', 'C', 'D', 'E']}
          playedPairs={revealPairs.slice(0, revealedCount)}
          activePair={revealedCount < revealPairs.length ? revealPairs[revealedCount] : null}
          labels={labels}
        />
      </FadeIn>

      <FadeIn delay={800}>
        <div className="sport-step-panel">
          <div className={`sport-step-card ${revealedCount >= 4 ? 'done' : revealedCount > 0 ? 'active' : ''}`}>
            <span className="sport-step-index">1</span>
            <p>A 赛了 4 场，所以 A 要和另外 4 个人都连上一条线。</p>
          </div>
          <div className={`sport-step-card ${revealedCount >= 4 ? 'done' : ''}`}>
            <span className="sport-step-index">2</span>
            <p>D 只赛了 1 场，而这 1 场已经和 A 连好了，所以 D 不会再连别的线。</p>
          </div>
          <div className={`sport-step-card ${revealedCount >= 6 ? 'done' : revealedCount > 4 ? 'active' : ''}`}>
            <span className="sport-step-index">3</span>
            <p>B 还差 2 场，只能补到 C 和 E，于是 E 一共赛了 2 场。</p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1050}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setRevealedCount((current) => Math.min(current + 1, revealPairs.length))}>画一条线</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setRevealedCount(0); setAutoPlay(false) }}>清空重来</button>
        </div>
      </FadeIn>

      {revealedCount === revealPairs.length && (
        <FadeIn delay={1300}>
          <div className="answer-box">
            <span className="answer-icon">✅</span>
            <p>答：E 赛了 <strong>2 场</strong>。</p>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={1450}>
        <div className="rule-box">
          <p><strong>如果比赛已经全部结束呢？</strong></p>
          <p>10 支队伍进行单循环赛，每队都要和另外 9 支比 1 场。</p>
          <p>先按每队来数：10 × 9 = 90 次参赛记录，再除以 2，得到 <strong>45 场</strong>。</p>
        </div>
      </FadeIn>

      <FadeIn delay={1750}><button className="next-btn" onClick={onNext}>最后看积分制 →</button></FadeIn>
    </div>
  )
}

const SportScorePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const scoreConfigs: Record<SportScoreMode, {
    title: string
    intro: string
    matches: SportScoreMatch[]
    formula: string
    hint: string
    example: string
    answer: string
  }> = {
    '210': {
      title: '2-1-0 积分制',
      intro: '胜 2 分，平局双方各 1 分，负 0 分。每场比赛总分永远都是 2 分。',
      matches: [
        { left: '红队', right: '蓝队', result: '红队获胜', leftPoints: 2, rightPoints: 0, total: 2 },
        { left: '黄队', right: '绿队', result: '平局', leftPoints: 1, rightPoints: 1, total: 2 },
        { left: '红队', right: '黄队', result: '黄队获胜', leftPoints: 0, rightPoints: 2, total: 2 },
      ],
      formula: '总分 = 场数 × 2',
      hint: '不管谁赢谁平，每场都会送出 2 分，所以总分是固定的。',
      example: '6 个人下单循环赛，共 15 场，总分固定 15 × 2 = 30 分。',
      answer: '如果已经知道 5 个人一共得了 25 分，那么最后 1 个人就得了 5 分。',
    },
    '310': {
      title: '3-1-0 积分制',
      intro: '胜 3 分，平局双方各 1 分，负 0 分。分出胜负时总分 3 分，平局时总分 2 分。',
      matches: [
        { left: '红队', right: '蓝队', result: '红队获胜', leftPoints: 3, rightPoints: 0, total: 3 },
        { left: '黄队', right: '绿队', result: '平局', leftPoints: 1, rightPoints: 1, total: 2 },
        { left: '红队', right: '黄队', result: '黄队获胜', leftPoints: 0, rightPoints: 3, total: 3 },
      ],
      formula: '平局场数 = 最高总分 - 实际总分',
      hint: '如果每场都分出胜负，3 场最多能送出 9 分；一旦出现 1 场平局，总分就会少 1 分。',
      example: '6 支队伍共 15 场，最高总分是 15 × 3 = 45 分。实际总分 41 分，所以平局有 4 场。',
      answer: '因为每出现 1 场平局，总分就会比最高总分少 1 分。',
    },
  }

  const [mode, setMode] = useState<SportScoreMode>('210')
  const [played, setPlayed] = useState(0)
  const [autoPlay, setAutoPlay] = useState(false)

  const config = scoreConfigs[mode]
  const currentMatches = config.matches.slice(0, played)
  const currentTotal = currentMatches.reduce((sum, match) => sum + match.total, 0)
  const maxTotal = mode === '210' ? played * 2 : played * 3
  const lostPoints = maxTotal - currentTotal

  useEffect(() => {
    setPlayed(0)
    setAutoPlay(false)
  }, [mode])

  useEffect(() => {
    if (!autoPlay) return
    if (played >= config.matches.length) {
      setAutoPlay(false)
      return
    }
    const timer = setTimeout(() => setPlayed((current) => current + 1), 850)
    return () => clearTimeout(timer)
  }, [autoPlay, played, config.matches.length])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🥇</span>常见积分制：先看每场一共送出几分</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="sport-point-tabs">
          <button className={`sport-point-tab ${mode === '210' ? 'active' : ''}`} onClick={() => setMode('210')}>2-1-0</button>
          <button className={`sport-point-tab ${mode === '310' ? 'active' : ''}`} onClick={() => setMode('310')}>3-1-0</button>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="concept-box">
          <p><strong>{config.title}</strong></p>
          <p>{config.intro}</p>
        </div>
      </FadeIn>

      <FadeIn delay={750}>
        <div className="sport-counter-row">
          <div className="sport-counter-card">
            <span className="sport-counter-label">已演示</span>
            <strong className="sport-counter-value">{played} 场</strong>
          </div>
          <div className="sport-counter-card highlight">
            <span className="sport-counter-label">实际总分</span>
            <strong className="sport-counter-value">{currentTotal} 分</strong>
          </div>
          <div className="sport-counter-card">
            <span className="sport-counter-label">比最高少</span>
            <strong className="sport-counter-value">{lostPoints} 分</strong>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={1000}>
        <div className="sport-scoreboard">
          {config.matches.map((match, index) => {
            const isDone = index < played
            const isActive = index === played
            return (
              <div key={`${match.left}-${match.right}-${index}`} className={`sport-score-match ${isDone ? 'done' : isActive ? 'active' : 'pending'}`}>
                <div>
                  <strong>{match.left}</strong> vs <strong>{match.right}</strong>
                  <p>{match.result}</p>
                </div>
                <div className="sport-score-points">
                  <span>{match.leftPoints}</span>
                  <span className="sport-score-divider">:</span>
                  <span>{match.rightPoints}</span>
                  <em>总分 {match.total}</em>
                </div>
              </div>
            )
          })}
        </div>
      </FadeIn>

      <FadeIn delay={1200}>
        <div className="sport-action-row">
          <button className="sport-control-btn" onClick={() => setPlayed((current) => Math.min(current + 1, config.matches.length))}>演示一场</button>
          <button className="sport-control-btn" onClick={() => setAutoPlay((current) => !current)}>{autoPlay ? '暂停演示' : '自动演示'}</button>
          <button className="sport-control-btn ghost" onClick={() => { setPlayed(0); setAutoPlay(false) }}>重新开始</button>
        </div>
      </FadeIn>

      <FadeIn delay={1400}>
        <div className="rule-box">
          <p><strong>{config.formula}</strong></p>
          <p>{config.hint}</p>
          <p>{config.example}</p>
        </div>
      </FadeIn>

      <FadeIn delay={1650}>
        <div className="answer-box">
          <span className="answer-icon">📘</span>
          <p>{config.answer}</p>
          {mode === '310' && <p>所以 45 - 41 = <strong>4 场平局</strong>。</p>}
        </div>
      </FadeIn>

      <FadeIn delay={1850}><button className="next-btn" onClick={onNext}>来做几题试试 →</button></FadeIn>
    </div>
  )
}

const SportPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      title: '① 单败淘汰赛',
      question: '8 支队伍参加单败淘汰赛，一共要比多少场？',
      options: ['6 场', '7 场', '8 场'],
      answer: 1,
      explanation: '每场淘汰 1 支，冠军出现前要淘汰 7 支，所以共 7 场。',
    },
    {
      title: '② 单循环赛',
      question: '5 支队伍两两比赛一场，一共要比多少场？',
      options: ['10 场', '12 场', '20 场'],
      answer: 0,
      explanation: '单循环赛总场数 = 5 × 4 ÷ 2 = 10 场。',
    },
    {
      title: '③ 点线图判断',
      question: 'A 赛 4 场，B 赛 3 场，C 赛 2 场，D 赛 1 场，那么 E 赛了几场？',
      options: ['1 场', '2 场', '3 场'],
      answer: 1,
      explanation: '先把 A 连向所有人，再根据 B 还差的 2 场补线，E 一共是 2 场。',
    },
    {
      title: '④ 3-1-0 积分制',
      question: '6 支队伍共打了 15 场比赛，实际总分 41 分，那么有几场平局？',
      options: ['3 场', '4 场', '5 场'],
      answer: 1,
      explanation: '最高总分是 15 × 3 = 45 分，45 - 41 = 4，所以平局有 4 场。',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const question = questions[current]
  const isCorrect = selected === question.answer

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎯</span>比赛数学小练习</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="example-box">
          <h3>📋 第 {current + 1} 题 / {questions.length}</h3>
          <p>{question.title}</p>
          <p className="question">{question.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={550}>
        <div className="quiz-options">
          {question.options.map((option, index) => (
            <button
              key={option}
              className={`quiz-option ${selected === index ? 'selected' : ''} ${submitted && index === question.answer ? 'correct' : ''} ${submitted && selected === index && !isCorrect ? 'wrong' : ''}`}
              onClick={() => !submitted && setSelected(index)}
            >
              {option}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={850}>
        {!submitted ? (
          <button className="submit-btn" onClick={() => setSubmitted(true)} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            <span className="result-icon">{isCorrect ? '🎉' : '🤔'}</span>
            <p>{isCorrect ? '答对啦！你会读比赛里的数学信息了！' : '别着急，再按规则想一想。'}</p>
            <p className="explanation">{question.explanation}</p>
            {current < questions.length - 1 ? (
              <button className="next-btn" onClick={() => { setCurrent((value) => value + 1); setSelected(null); setSubmitted(false) }}>下一题 →</button>
            ) : (
              <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
            )}
          </div>
        )}
      </FadeIn>

      {current === questions.length - 1 && submitted && (
        <FadeIn delay={1150}>
          <div className="summary-box">
            <h3>🏅 这一课你学会了</h3>
            <ul>
              <li>单败淘汰赛总场数是 n - 1</li>
              <li>单循环赛总场数是 n × (n - 1) ÷ 2</li>
              <li>比赛未完成时，可以用点线图帮忙分析</li>
              <li>积分题先看每场总共送出几分</li>
            </ul>
          </div>
        </FadeIn>
      )}
    </div>
  )
}

// ========== 循环指挥官模块（第11课）==========

// 页面1：概念引入 - while(true) 无限循环
const CmdIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  const [running, setRunning] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!running) return
    if (count >= 8) { setRunning(false); return }
    const t = setTimeout(() => setCount(c => c + 1), 600)
    return () => clearTimeout(t)
  }, [running, count])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎮</span>循环指挥官来啦！</h2></FadeIn>

      <FadeIn delay={200}>
        <div className="story-box">
          <div className="story-icon">🧭</div>
          <p>在编程的世界里，有一种神奇的循环——它<strong>永远不会自己停下来</strong>，除非你下命令！</p>
        </div>
      </FadeIn>

      <FadeIn delay={500}>
        <div className="concept-box">
          <p><strong>while(true)</strong> 就是"永远执行"的循环</p>
          <div className="concept-list">
            <span className="concept-item">🔄 条件永远为 true</span>
            <span className="concept-item">♾️ 理论上无限执行</span>
            <span className="concept-item">🛑 必须靠 break 停下来</span>
          </div>
        </div>
      </FadeIn>

      {step >= 1 && (
        <FadeIn>
          <LessonCode
            lines={[
              'while(true) {',
              '  向前走一步;',
              '  // 永远不停地走…',
              '}',
            ]}
            activeLine={running ? (count % 2 === 0 ? 1 : 0) : -1}
            runtimeBadges={running ? [{ label: '步数', value: `${count} 步` }] : []}
            runtimeHint={running ? '🏃 主人公一直向前走…' : count >= 8 ? '🎉 已经走了很多步！' : undefined}
          />
        </FadeIn>
      )}

      {step >= 2 && (
        <FadeIn>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <div className="walker-track">
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`walker-cell ${i < count ? 'walked' : ''} ${i === count - 1 && running ? 'active-walker' : ''}`}
                >
                  {i === count - 1 && count > 0 ? '🏃' : i < count ? '👣' : '⬜'}
                </div>
              ))}
            </div>
            {!running && count === 0 && (
              <button className="next-btn" style={{ marginTop: 12 }} onClick={() => { setRunning(true) }}>
                ▶ 让他一直走！
              </button>
            )}
            {running && <p style={{ color: '#6366f1', fontWeight: 'bold', marginTop: 8 }}>停不下来啦！需要 break 来救场…</p>}
            {!running && count >= 8 && (
              <div className="tip-box" style={{ marginTop: 8 }}>
                <span className="tip-icon">💡</span>
                <p>如果没有 break，主人公会一直走到天荒地老！下面学 break 怎么用。</p>
              </div>
            )}
          </div>
        </FadeIn>
      )}

      {step < 2 && (
        <FadeIn delay={800}>
          <button className="next-btn" onClick={() => setStep(s => s + 1)}>
            {step === 0 ? '看代码 →' : '看动画 →'}
          </button>
        </FadeIn>
      )}
      {step >= 2 && (!running && count >= 8) && (
        <FadeIn delay={300}>
          <button className="next-btn" onClick={onNext}>学习 break 语句 →</button>
        </FadeIn>
      )}
    </div>
  )
}

// 页面2：break 动画页 - Alex 铺路逃岩浆关卡
// 每次循环拆成 5 个子步：while检查 → if判断 → placeAhead → moveForward → e-=3
const CmdBreakPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const MAX_ENERGY = 20
  const COST = 3
  const TRACK_LEN = 8

  // 运行时状态
  // 行索引对应代码行（0-based）：
  //   0: int e = 20;
  //   1: while(true) {
  //   2:   if(e <= 0) { break; }
  //   3:   placeAhead("sand");
  //   4:   moveForward();
  //   5:   e -= 3;
  //   6: }
  const [energy, setEnergy] = useState(MAX_ENERGY)
  const [pos, setPos] = useState(0)
  const [log, setLog] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  // substep: 0=while检查, 1=if判断, 2=placeAhead, 3=move, 4=e-=3
  const [substep, setSubstep] = useState(0)
  const [snapshot, setSnapshot] = useState({ e: MAX_ENERGY, pos: 0, activeLine: -1, hint: '▶ 点击"单步执行"开始' })
  // tick 驱动 autoPlay，每次 interval 触发时 +1
  const [tick, setTick] = useState(0)

  // 纯函数：根据当前状态计算下一步
  const computeNext = (curEnergy: number, curPos: number, curSubstep: number) => {
    let nextEnergy = curEnergy
    let nextPos = curPos
    let nextSubstep = curSubstep
    let activeLine = -1
    let hint = ''
    let logMsg = ''
    let isDone = false

    switch (curSubstep) {
      case 0: // while(true)
        activeLine = 1
        hint = '🔁 while(true)：无条件进入循环体'
        nextSubstep = 1
        break
      case 1: // if(e <= 0) 判断
        activeLine = 2
        if (curEnergy <= 0) {
          hint = `💥 e = ${curEnergy} ≤ 0，触发 break！跳出循环`
          logMsg = `e = ${curEnergy} ≤ 0，break！停止铺路。`
          isDone = true
        } else {
          hint = `✅ e = ${curEnergy} > 0，不触发 break，继续执行`
          nextSubstep = 2
        }
        break
      case 2: // placeAhead("sand")
        activeLine = 3
        hint = `⛏️ 在前方铺一块沙子`
        nextSubstep = 3
        break
      case 3: // moveForward()
        activeLine = 4
        nextPos = Math.min(curPos + 1, TRACK_LEN - 1)
        hint = `🚶 向前迈一步，位置 ${curPos} → ${nextPos}`
        nextSubstep = 4
        break
      case 4: // e -= 3
        activeLine = 5
        nextEnergy = curEnergy - COST
        hint = `⚡ e = ${curEnergy} - ${COST} = ${nextEnergy}，精力减少`
        logMsg = `铺了第 ${nextPos} 格沙子，精力 ${curEnergy} → ${nextEnergy}`
        nextSubstep = 0
        break
    }
    return { nextEnergy, nextPos, nextSubstep, activeLine, hint, logMsg, isDone }
  }

  // 实际推进逻辑（读取最新 state，避免闭包陷阱）
  useEffect(() => {
    if (tick === 0) return
    if (done) return
    const { nextEnergy, nextPos, nextSubstep, activeLine, hint, logMsg, isDone } = computeNext(energy, pos, substep)
    setSnapshot({ e: nextEnergy, pos: nextPos, activeLine, hint })
    if (logMsg) setLog(l => [...l, logMsg])
    if (isDone) {
      setDone(true)
      setAutoPlay(false)
    } else {
      setEnergy(nextEnergy)
      setPos(nextPos)
      setSubstep(nextSubstep)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const handleStep = () => {
    if (done) return
    setTick(t => t + 1)
  }

  // autoPlay：每隔 600ms 递增 tick，由上面的 useEffect 响应
  useEffect(() => {
    if (!autoPlay || done) return
    const t = setInterval(() => setTick(t => t + 1), 600)
    return () => clearInterval(t)
  }, [autoPlay, done])

  const reset = () => {
    setEnergy(MAX_ENERGY)
    setPos(0)
    setLog([])
    setDone(false)
    setAutoPlay(false)
    setSubstep(0)
    setTick(0)
    setSnapshot({ e: MAX_ENERGY, pos: 0, activeLine: -1, hint: '▶ 点击"单步执行"开始' })
  }

  const displayEnergy = done ? 0 : snapshot.e
  const displayPos = done ? pos : snapshot.pos
  const energyPct = Math.max(0, displayEnergy / MAX_ENERGY)
  const barColor = energyPct > 0.5 ? '#22c55e' : energyPct > 0.25 ? '#f59e0b' : '#ef4444'

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🔥</span>break — 紧急停止！</h2></FadeIn>

      <FadeIn delay={200}>
        <div className="story-box">
          <div className="story-icon">⛏️</div>
          <p><strong>Alex 被困在岩浆里！</strong>精力值为 20，每铺一块沙子消耗 3 点精力。精力 ≤ 0 时必须立刻停下来休息！</p>
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <LessonCode
          lines={[
            'int e = 20;  // 精力值',
            'while(true) {',
            '  if(e <= 0) { break; }',
            '  placeAhead("sand");',
            '  moveForward();',
            '  e -= 3;',
            '}',
          ]}
          activeLine={snapshot.activeLine}
          runtimeBadges={[
            { label: '精力 e', value: `${displayEnergy}` },
            { label: '已铺格', value: `${displayPos} 格` },
          ]}
          runtimeTitle="📊 当前变量"
          runtimeHint={done ? '💥 break 触发！停止劳动' : snapshot.hint}
        />
      </FadeIn>

      <FadeIn delay={600}>
        {/* 能量条 */}
        <div className="energy-bar-wrap">
          <span className="energy-label">⚡ 精力</span>
          <div className="energy-bar-bg">
            <div
              className="energy-bar-fill"
              style={{ width: `${energyPct * 100}%`, background: barColor, transition: 'width 0.4s' }}
            />
          </div>
          <span className="energy-val">{displayEnergy}</span>
        </div>

        {/* 路径可视化 */}
        <div className="lava-track">
          {Array.from({ length: TRACK_LEN }, (_, i) => (
            <div key={i} className={`lava-cell ${i < displayPos ? 'sand' : ''} ${i === displayPos ? 'alex' : ''}`}>
              {i === displayPos ? '🧑' : i < displayPos ? '🟫' : '🔥'}
            </div>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={800}>
        {/* 执行日志 */}
        {log.length > 0 && (
          <div className="exec-log">
            {log.slice(-4).map((l, i) => (
              <div key={i} className="exec-log-item">{l}</div>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={900}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          {!done ? (
            <>
              <button className="next-btn" onClick={handleStep} disabled={autoPlay}>单步执行 →</button>
              <button className="next-btn" style={{ background: '#6366f1' }} onClick={() => setAutoPlay(!autoPlay)}>
                {autoPlay ? '⏸ 暂停' : '▶ 自动运行'}
              </button>
            </>
          ) : (
            <>
              <div className="tip-box" style={{ width: '100%', marginBottom: 8 }}>
                <span className="tip-icon">🎯</span>
                <p><strong>break 发挥作用了！</strong>当精力 ≤ 0，程序立刻跳出 while(true)，不再继续铺路。</p>
              </div>
              <button className="retry-btn" onClick={reset}>🔄 重新来过</button>
              <button className="next-btn" onClick={onNext}>学习 continue →</button>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  )
}

// 页面3：continue 动画页 - 跳过坏包子
// 每次循环拆成子步：while条件 → i++ → if判断 → [continue跳过 / 吃包子]
const CmdContinuePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const BUNS = ['好', '好', '坏', '好', '好']
  const BUN_ICONS = ['🥟', '🥟', '🟡', '🥟', '🥟']
  // 代码行（0-based）:
  //   0: int i = 0;
  //   1: while(i < 5) {
  //   2:   i++;
  //   3:   if(是坏包子) { continue; }
  //   4:   // 跳到下一次循环了
  //   5:   吃包子; cout << "包子好吃";
  //   6: }

  const [iVal, setIVal] = useState(0)
  const [eaten, setEaten] = useState(0)
  const [output, setOutput] = useState<string[]>([])
  const [finished, setFinished] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  // substep: 0=while条件, 1=i++, 2=if判断, 3=吃包子
  const [substep, setSubstep] = useState(0)
  const [snapshot, setSnapshot] = useState({
    activeLine: -1,
    hint: '▶ 点击"单步执行"开始',
    i: 0,
    eaten: 0,
    currentBunIdx: -1,
  })
  const [tick, setTick] = useState(0)

  // 纯函数：根据当前状态计算下一步
  const computeNextContinue = (curI: number, curEaten: number, curSubstep: number, curBunIdx: number) => {
    let nextI = curI
    let nextEaten = curEaten
    let nextSubstep = curSubstep
    let activeLine = -1
    let hint = ''
    let logMsg = ''
    let isDone = false
    let bunIdx = curBunIdx

    switch (curSubstep) {
      case 0: // while(i < 5) 条件检查
        activeLine = 1
        if (curI >= BUNS.length) {
          hint = `✅ i = ${curI} ≥ 5，while 条件不成立，循环结束！`
          isDone = true
        } else {
          hint = `🔁 i = ${curI} < 5，while 条件成立，进入循环体`
          nextSubstep = 1
        }
        break
      case 1: { // i++
        activeLine = 2
        nextI = curI + 1
        bunIdx = nextI - 1
        hint = `➕ i = ${curI} + 1 = ${nextI}，现在检查第 ${nextI} 个包子`
        nextSubstep = 2
        break
      }
      case 2: { // if(是坏包子) 判断
        activeLine = 3
        const bunIndex = curI - 1
        const isBad = BUNS[bunIndex] === '坏'
        bunIdx = bunIndex
        if (isBad) {
          hint = `⚠️ 第 ${curI} 个是坏包子！触发 continue → 跳回 while 条件`
          logMsg = `第 ${curI} 个：坏包子 🟡，continue → 跳过！`
          nextSubstep = 0 // continue 跳回 while 条件
        } else {
          hint = `✅ 第 ${curI} 个是好包子，不触发 continue，继续执行`
          nextSubstep = 3
        }
        break
      }
      case 3: { // 吃包子
        activeLine = 5
        nextEaten = curEaten + 1
        const bunIndex2 = curI - 1
        bunIdx = bunIndex2
        hint = `🥟 吃掉第 ${curI} 个好包子！已吃 ${nextEaten} 个`
        logMsg = `第 ${curI} 个：好包子 🥟，吃掉！已吃 ${nextEaten} 个`
        nextSubstep = 0
        break
      }
    }
    return { nextI, nextEaten, nextSubstep, activeLine, hint, logMsg, isDone, bunIdx }
  }

  // tick 触发时推进一步（读取最新 state，避免闭包陷阱）
  useEffect(() => {
    if (tick === 0) return
    if (finished) return
    const { nextI, nextEaten, nextSubstep, activeLine, hint, logMsg, isDone, bunIdx } =
      computeNextContinue(iVal, eaten, substep, snapshot.currentBunIdx)
    setSnapshot({ activeLine, hint, i: nextI, eaten: nextEaten, currentBunIdx: bunIdx })
    if (logMsg) setOutput(o => [...o, logMsg])
    if (isDone) {
      setFinished(true)
      setAutoPlay(false)
    } else {
      setIVal(nextI)
      setEaten(nextEaten)
      setSubstep(nextSubstep)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  const handleStep = () => {
    if (finished) return
    setTick(t => t + 1)
  }

  useEffect(() => {
    if (!autoPlay || finished) return
    const t = setInterval(() => setTick(t => t + 1), 700)
    return () => clearInterval(t)
  }, [autoPlay, finished])

  const reset = () => {
    setIVal(0)
    setEaten(0)
    setOutput([])
    setFinished(false)
    setAutoPlay(false)
    setSubstep(0)
    setTick(0)
    setSnapshot({ activeLine: -1, hint: '▶ 点击"单步执行"开始', i: 0, eaten: 0, currentBunIdx: -1 })
  }

  // 包子格状态：currentBunIdx 高亮当前，之前的格子根据好坏标记已处理
  const getBunClass = (idx: number) => {
    if (idx === snapshot.currentBunIdx) return 'current-bun'
    if (idx < snapshot.currentBunIdx) {
      return BUNS[idx] === '坏' ? 'skipped-bun' : 'eaten-bun'
    }
    return ''
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">⏭️</span>continue — 跳过这一次！</h2></FadeIn>

      <FadeIn delay={200}>
        <div className="story-box">
          <div className="story-icon">🍽️</div>
          <p>小图要吃包子，但第 3 个是黄色的坏包子！用 <strong>continue</strong> 跳过坏包子，继续吃后面的好包子。</p>
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <LessonCode
          lines={[
            'int i = 0;',
            'while(i < 5) {',
            '  i++;',
            '  if(是坏包子) { continue; }',
            '  // 跳到下一次循环了',
            '  吃包子; cout << "包子好吃";',
            '}',
          ]}
          activeLine={snapshot.activeLine}
          runtimeBadges={[
            { label: 'i', value: `${snapshot.i}` },
            { label: '已吃', value: `${snapshot.eaten} 个` },
          ]}
          runtimeTitle="📊 当前变量"
          runtimeHint={snapshot.hint}
        />
      </FadeIn>

      <FadeIn delay={600}>
        {/* 包子展示 */}
        <div className="bun-track">
          {BUNS.map((b, i) => (
            <div key={i} className={`bun-cell ${getBunClass(i)}`}>
              <div className="bun-icon">{BUN_ICONS[i]}</div>
              <div className="bun-label">{b === '坏' ? '坏' : '好'}</div>
              {i < snapshot.currentBunIdx && b !== '坏' && <div className="bun-check">✅</div>}
              {i < snapshot.currentBunIdx && b === '坏' && <div className="bun-check">⏭️</div>}
              {i === snapshot.currentBunIdx && <div className="bun-check">👆</div>}
            </div>
          ))}
        </div>

        {/* 输出日志 */}
        {output.length > 0 && (
          <div className="exec-log" style={{ marginTop: 10 }}>
            {output.map((l, i) => (
              <div key={i} className={`exec-log-item ${l.includes('跳过') ? 'skip-log' : 'eat-log'}`}>{l}</div>
            ))}
          </div>
        )}
      </FadeIn>

      <FadeIn delay={800}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          {!finished ? (
            <>
              <button className="next-btn" onClick={handleStep} disabled={autoPlay}>单步执行 →</button>
              <button className="next-btn" style={{ background: '#6366f1' }} onClick={() => setAutoPlay(!autoPlay)}>
                {autoPlay ? '⏸ 暂停' : '▶ 自动运行'}
              </button>
            </>
          ) : (
            <>
              <div className="tip-box" style={{ width: '100%', marginBottom: 8 }}>
                <span className="tip-icon">🎯</span>
                <p><strong>continue 发挥作用了！</strong>跳过了第 3 个坏包子，但没有停止循环，第 4、5 个好包子照样吃！</p>
              </div>
              <button className="retry-btn" onClick={reset}>🔄 重新来过</button>
              <button className="next-btn" onClick={onNext}>对比 break vs continue →</button>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  )
}

// 页面4：对比 + 9的倍数关卡
const CmdComparePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  // 关卡：输入 n，找 n 以上能被9整除的最小数
  const [inputN, setInputN] = useState('')
  const [traceSteps, setTraceSteps] = useState<{ n: number; mod: number; hit: boolean }[]>([])
  const [answer, setAnswer] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)
  const [playIdx, setPlayIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)

  const runCalc = () => {
    const n0 = parseInt(inputN)
    if (isNaN(n0) || n0 < 0 || n0 > 200) return
    const steps: { n: number; mod: number; hit: boolean }[] = []
    let cur = n0
    for (let i = 0; i < 30; i++) {
      cur++
      const hit = cur % 9 === 0
      steps.push({ n: cur, mod: cur % 9, hit })
      if (hit) break
    }
    setTraceSteps(steps)
    setAnswer(steps[steps.length - 1].n)
    setPlaying(true)
    setPlayIdx(0)
    setStepIdx(0)
  }

  useEffect(() => {
    if (!playing || traceSteps.length === 0) return
    if (playIdx >= traceSteps.length) { setPlaying(false); return }
    const t = setTimeout(() => setPlayIdx(p => p + 1), 500)
    return () => clearTimeout(t)
  }, [playing, playIdx, traceSteps.length])

  const visibleSteps = traceSteps.slice(0, playIdx)

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">⚔️</span>break vs continue 大对决</h2></FadeIn>

      <FadeIn delay={200}>
        <div className="compare-table">
          <div className="compare-header">
            <div className="compare-cell header">关键字</div>
            <div className="compare-cell header">作用</div>
            <div className="compare-cell header">比喻</div>
          </div>
          <div className="compare-row">
            <div className="compare-cell keyword-break">break</div>
            <div className="compare-cell">立刻<strong>终止</strong>整个循环</div>
            <div className="compare-cell">🚪 直接离开教室，不上课了</div>
          </div>
          <div className="compare-row">
            <div className="compare-cell keyword-continue">continue</div>
            <div className="compare-cell"><strong>跳过</strong>本次循环剩余部分</div>
            <div className="compare-cell">⏭️ 打个盹，下节课继续</div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <div className="tip-box">
          <span className="tip-icon">💡</span>
          <p>break 让循环<strong>停下来</strong>；continue 让这一次<strong>溜走</strong>，但循环还在继续。</p>
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        <div className="game-box">
          <h3>🎯 关卡挑战：找 9 的倍数</h3>
          <p>输入一个数字 n，程序用 while(true) + break 找到 n 以上<strong>能被 9 整除的最小数</strong>！</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center', marginTop: 12, flexWrap: 'wrap' }}>
            <input
              type="number"
              className="game-input"
              value={inputN}
              onChange={e => { setInputN(e.target.value); setTraceSteps([]); setAnswer(null); setPlaying(false); setPlayIdx(0) }}
              placeholder="输入 n（0~200）"
              min={0}
              max={200}
            />
            <button className="submit-btn" onClick={runCalc} disabled={inputN === '' || playing}>
              ▶ 开始执行
            </button>
          </div>

          {visibleSteps.length > 0 && (
            <div className="trace-steps">
              {visibleSteps.map((s, i) => (
                <div key={i} className={`trace-step ${s.hit ? 'trace-hit' : 'trace-miss'}`}>
                  <span>n++ → <strong>{s.n}</strong></span>
                  <span>{s.n} % 9 = <strong>{s.mod}</strong></span>
                  {s.hit
                    ? <span className="trace-break">✅ break! 答案是 {s.n}</span>
                    : <span className="trace-cont">❌ 继续循环</span>}
                </div>
              ))}
            </div>
          )}

          {!playing && answer !== null && (
            <div className="answer-box" style={{ marginTop: 10 }}>
              <span className="answer-icon">🎉</span>
              <p>n = {inputN}，答案是 <strong>{answer}</strong>（{answer} ÷ 9 = {answer / 9}）</p>
            </div>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={800}>
        <button className="next-btn" onClick={onNext} style={{ marginTop: 16 }}>开始练习 →</button>
      </FadeIn>
    </div>
  )
}

// 页面5：练习页 - 改编自讲义习题（含真实GESP考题）
const CmdPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const questions = [
    {
      id: 1,
      title: '① GESP 真题考考你',
      question: '在 C++ 中，break 语句只适用于 while 循环，不适用于 for 循环。这句话对吗？',
      options: ['✅ 正确', '❌ 错误'],
      answer: 1,
      explanation: 'break 在 for、while、do-while 循环中都可以使用，不局限于 while！',
    },
    {
      id: 2,
      title: '② 理解 continue',
      question: '下面代码中，continue 触发时会发生什么？\nif(i % 2 == 0) { continue; }\ncout << i;',
      options: [
        '当 i 是偶数时，跳过输出，继续下次循环',
        '当 i 是偶数时，整个循环结束',
        '当 i 是奇数时，跳过输出',
      ],
      answer: 0,
      explanation: 'continue 跳过本次循环中 continue 后面的代码（cout << i），直接进入下一次循环。',
    },
    {
      id: 3,
      title: '③ 识别 break 的位置',
      question: 'break 语句必须放在哪里才能正常工作？',
      options: [
        '循环体内部（for 或 while 的花括号里）',
        '循环体外部，普通语句中',
        '只能在 if 语句里用，不能单独使用',
      ],
      answer: 0,
      explanation: 'break 必须在循环体内才有效，写在循环外会导致编译错误！',
    },
    {
      id: 4,
      title: '④ 读代码选结果',
      question: '下面代码输出什么？\nint i=0;\nwhile(i<5){\n  i++;\n  if(i%3==0) continue;\n  cout << i << " ";\n}',
      options: ['1 2 4 5', '1 2 3 4 5', '3'],
      answer: 0,
      explanation: 'i=3 时触发 continue，跳过输出3；其余 i=1,2,4,5 正常输出。结果是 1 2 4 5。',
    },
    {
      id: 5,
      title: '⑤ break 与 continue 选哪个？',
      question: '要实现"一直检查物品，遇到黄金就停止"，应该用哪个关键字？',
      options: [
        'break — 立刻停止整个循环',
        'continue — 跳过这个物品继续找',
        '两个都用',
      ],
      answer: 0,
      explanation: '遇到黄金"停止"就是终止整个循环，用 break 最合适！',
    },
  ]

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [allDone, setAllDone] = useState(false)

  const q = questions[current]
  const isCorrect = selected === q.answer

  const handleSubmit = () => {
    setSubmitted(true)
    if (selected === q.answer) setScore(s => s + 1)
  }

  const handleNext = () => {
    if (current < questions.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setAllDone(true)
    }
  }

  if (allDone) {
    const perfect = score === questions.length
    return (
      <div className="page">
        <button className="back-btn" onClick={onBack}>← 返回目录</button>
        <FadeIn>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64 }}>{perfect ? '🏆' : score >= 3 ? '🌟' : '💪'}</div>
            <h2 className="page-title">练习完成！</h2>
            <p style={{ fontSize: 22, fontWeight: 'bold', color: '#6366f1', margin: '8px 0' }}>
              得分：{score} / {questions.length}
            </p>
            <p style={{ color: '#64748b' }}>
              {perfect ? '完美！你已经掌握了循环指挥官的所有技能！' : score >= 3 ? '做得很好！再复习一下不确定的题目。' : '没关系，多看几遍动画演示再来挑战吧！'}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="summary-box">
            <h3>📚 今天学的知识</h3>
            <ul>
              <li>while(true) 创建无限循环，需要靠 break 停止</li>
              <li>break 立刻终止整个循环</li>
              <li>continue 跳过当前次循环，继续下一次</li>
              <li>break 只能在循环体内部使用</li>
            </ul>
          </div>
        </FadeIn>
        <FadeIn delay={600}>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 16 }}>
            <button className="retry-btn" onClick={() => { setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setAllDone(false) }}>
              🔄 再来一遍
            </button>
            <button className="restart-btn" onClick={onHome}>✅ 完成学习</button>
          </div>
        </FadeIn>
      </div>
    )
  }

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn>
        <h2 className="page-title"><span className="emoji">🎯</span>挑战练习</h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ color: '#64748b', fontSize: 14 }}>第 {current + 1} / {questions.length} 题</span>
          <span style={{ color: '#6366f1', fontWeight: 'bold' }}>⭐ {score} 分</span>
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="practice-box">
          <h3 style={{ color: '#6366f1', marginBottom: 8 }}>{q.title}</h3>
          <p style={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>{q.question}</p>
        </div>
      </FadeIn>

      <FadeIn delay={400}>
        <div className="options-list">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${selected === i ? 'selected' : ''} ${submitted && i === q.answer ? 'correct-opt' : ''} ${submitted && selected === i && !isCorrect ? 'wrong-opt' : ''}`}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
            >
              {opt}
            </button>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={600}>
        {!submitted ? (
          <button className="submit-btn" onClick={handleSubmit} disabled={selected === null}>提交答案</button>
        ) : (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            <span className="result-icon">{isCorrect ? '🎉' : '🤔'}</span>
            <p>{isCorrect ? '答对啦！太厉害了！' : '再想想哦～'}</p>
            <p className="explanation">{q.explanation}</p>
            <button className="next-btn" onClick={handleNext}>
              {current < questions.length - 1 ? '下一题 →' : '查看成绩 →'}
            </button>
          </div>
        )}
      </FadeIn>
    </div>
  )
}

// ========== 诗词大赛数据 ==========
interface Poetry {
  id: number
  category: string
  categoryType: '节气' | '节日'
  title: string
  author: string
  lines: string[]  // 每句诗
}

// 24节气 + 传统节日诗词库
const POETRY_DB: Poetry[] = [
  // ===== 春季节气 =====
  { id: 1, category: '立春', categoryType: '节气', title: '立春偶成', author: '张栻', lines: ['律回岁晚冰霜少', '春到人间草木知', '便觉眼前生意满', '东风吹水绿参差'] },
  { id: 2, category: '立春', categoryType: '节气', title: '咏柳', author: '贺知章', lines: ['碧玉妆成一树高', '万条垂下绿丝绦', '不知细叶谁裁出', '二月春风似剪刀'] },
  { id: 3, category: '雨水', categoryType: '节气', title: '春夜喜雨', author: '杜甫', lines: ['好雨知时节', '当春乃发生', '随风潜入夜', '润物细无声'] },
  { id: 4, category: '雨水', categoryType: '节气', title: '绝句', author: '杜甫', lines: ['迟日江山丽', '春风花草香', '泥融飞燕子', '沙暖睡鸳鸯'] },
  { id: 5, category: '惊蛰', categoryType: '节气', title: '观田家', author: '韦应物', lines: ['微雨众卉新', '一雷惊蛰始', '田家几日闲', '耕种从此起'] },
  { id: 6, category: '惊蛰', categoryType: '节气', title: '新雷', author: '张维屏', lines: ['造物无言却有情', '每于寒尽觉春生', '千红万紫安排著', '只待新雷第一声'] },
  { id: 7, category: '春分', categoryType: '节气', title: '春分日', author: '徐铉', lines: ['仲春初四日', '春色正中分', '绿野徘徊月', '晴天断续云'] },
  { id: 8, category: '春分', categoryType: '节气', title: '村居', author: '高鼎', lines: ['草长莺飞二月天', '拂堤杨柳醉春烟', '儿童散学归来早', '忙趁东风放纸鸢'] },
  { id: 9, category: '清明', categoryType: '节气', title: '清明', author: '杜牧', lines: ['清明时节雨纷纷', '路上行人欲断魂', '借问酒家何处有', '牧童遥指杏花村'] },
  { id: 10, category: '清明', categoryType: '节气', title: '寒食', author: '韩翃', lines: ['春城无处不飞花', '寒食东风御柳斜', '日暮汉宫传蜡烛', '轻烟散入五侯家'] },
  { id: 11, category: '谷雨', categoryType: '节气', title: '晚春', author: '韩愈', lines: ['草树知春不久归', '百般红紫斗芳菲', '杨花榆荚无才思', '惟解漫天作雪飞'] },
  { id: 12, category: '谷雨', categoryType: '节气', title: '送春', author: '王令', lines: ['三月残花落更开', '小檐日日燕飞来', '子规夜半犹啼血', '不信东风唤不回'] },
  // ===== 夏季节气 =====
  { id: 13, category: '立夏', categoryType: '节气', title: '立夏', author: '陆游', lines: ['赤帜插城扉', '东君整驾归', '泥新巢燕闹', '花尽蜜蜂稀'] },
  { id: 14, category: '立夏', categoryType: '节气', title: '池上', author: '白居易', lines: ['小娃撑小艇', '偷采白莲回', '不解藏踪迹', '浮萍一道开'] },
  { id: 15, category: '小满', categoryType: '节气', title: '五绝·小满', author: '欧阳修', lines: ['夜莺啼绿柳', '皓月醒长空', '最爱垄头麦', '迎风笑落红'] },
  { id: 16, category: '小满', categoryType: '节气', title: '归田园四时乐', author: '欧阳修', lines: ['南风原头吹百草', '草木丛深茅舍小', '麦穗初齐稚子娇', '桑叶正肥蚕食饱'] },
  { id: 17, category: '芒种', categoryType: '节气', title: '时雨', author: '陆游', lines: ['时雨及芒种', '四野皆插秧', '家家麦饭美', '处处菱歌长'] },
  { id: 18, category: '芒种', categoryType: '节气', title: '芒种', author: '窦常', lines: ['愿见纤纤擢素手', '拾穗不违农时忙'] },
  { id: 19, category: '夏至', categoryType: '节气', title: '晓出净慈寺送林子方', author: '杨万里', lines: ['毕竟西湖六月中', '风光不与四时同', '接天莲叶无穷碧', '映日荷花别样红'] },
  { id: 20, category: '夏至', categoryType: '节气', title: '夏至', author: '范成大', lines: ['李核垂腰祝饐', '粽丝系臂扶羸', '节物竞随乡俗', '老翁闲伴儿嬉'] },
  { id: 21, category: '小暑', categoryType: '节气', title: '小暑', author: '陆游', lines: ['万瓦鳞鳞若火龙', '日车不动汗珠融', '无因羽翮氛埃外', '坐觉蒸炊釜甑中'] },
  { id: 22, category: '小暑', categoryType: '节气', title: '夏日南亭怀辛大', author: '孟浩然', lines: ['山光忽西落', '池月渐东上', '散发乘夕凉', '开轩卧闲敞'] },
  { id: 23, category: '大暑', categoryType: '节气', title: '大暑', author: '曾几', lines: ['赤日几时过', '清风无处寻', '经书聊枕籍', '瓜李漫浮沉'] },
  { id: 24, category: '大暑', categoryType: '节气', title: '纳凉', author: '秦观', lines: ['携扙来追柳外凉', '画桥南畔倚胡床', '月明船笛参差起', '风定池莲自在香'] },
  // ===== 秋季节气 =====
  { id: 25, category: '立秋', categoryType: '节气', title: '立秋', author: '刘翰', lines: ['睡起秋声无觅处', '满阶梧叶月明中'] },
  { id: 26, category: '立秋', categoryType: '节气', title: '山居秋暝', author: '王维', lines: ['空山新雨后', '天气晚来秋', '明月松间照', '清泉石上流'] },
  { id: 27, category: '处暑', categoryType: '节气', title: '处暑', author: '苏泂', lines: ['处暑无三日', '新凉直万金', '白头更世事', '青草印禅心'] },
  { id: 28, category: '处暑', categoryType: '节气', title: '早秋', author: '许浑', lines: ['遥夜泛清瑟', '西风生翠萝', '残萤栖玉露', '早雁拂金河'] },
  { id: 29, category: '白露', categoryType: '节气', title: '月夜忆舍弟', author: '杜甫', lines: ['戍鼓断人行', '边秋一雁声', '露从今夜白', '月是故乡明'] },
  { id: 30, category: '白露', categoryType: '节气', title: '秋词', author: '刘禹锡', lines: ['自古逢秋悲寂寥', '我言秋日胜春朝', '晴空一鹤排云上', '便引诗情到碧霄'] },
  { id: 31, category: '秋分', categoryType: '节气', title: '天净沙·秋思', author: '马致远', lines: ['枯藤老树昏鸦', '小桥流水人家', '古道西风瘦马', '夕阳西下'] },
  { id: 32, category: '秋分', categoryType: '节气', title: '秋夕', author: '杜牧', lines: ['银烛秋光冷画屏', '轻罗小扇扑流萤', '天阶夜色凉如水', '坐看牵牛织女星'] },
  { id: 33, category: '寒露', categoryType: '节气', title: '寒露', author: '白居易', lines: ['袅袅凉风动', '凄凄寒露零', '兰衰花始白', '荷破叶犹青'] },
  { id: 34, category: '寒露', categoryType: '节气', title: '九月九日忆山东兄弟', author: '王维', lines: ['独在异乡为异客', '每逢佳节倍思亲', '遥知兄弟登高处', '遍插茱萸少一人'] },
  { id: 35, category: '霜降', categoryType: '节气', title: '山行', author: '杜牧', lines: ['远上寒山石径斜', '白云生处有人家', '停车坐爱枫林晚', '霜叶红于二月花'] },
  { id: 36, category: '霜降', categoryType: '节气', title: '霜月', author: '李商隐', lines: ['初闻征雁已无蝉', '百尺楼高水接天', '青女素娥俱耐冷', '月中霜里斗婵娟'] },
  // ===== 冬季节气 =====
  { id: 37, category: '立冬', categoryType: '节气', title: '立冬', author: '李白', lines: ['冻笔新诗懒写', '寒炉美酒时温', '醉看墨花月白', '恍疑雪满前村'] },
  { id: 38, category: '立冬', categoryType: '节气', title: '江雪', author: '柳宗元', lines: ['千山鸟飞绝', '万径人踪灭', '孤舟蓑笠翁', '独钓寒江雪'] },
  { id: 39, category: '小雪', categoryType: '节气', title: '小雪', author: '戴叔伦', lines: ['花雪随风不厌看', '更多还肯失林峦', '愁人正在书窗下', '一片飞来一片寒'] },
  { id: 40, category: '小雪', categoryType: '节气', title: '夜雪', author: '白居易', lines: ['已讶衾枕冷', '复见窗户明', '夜深知雪重', '时闻折竹声'] },
  { id: 41, category: '大雪', categoryType: '节气', title: '大雪', author: '陆游', lines: ['大雪江南见未曾', '今年方始是严凝', '巧穿帘罅如相觅', '重压林梢欲不胜'] },
  { id: 42, category: '大雪', categoryType: '节气', title: '白雪歌送武判官归京', author: '岑参', lines: ['北风卷地白草折', '胡天八月即飞雪', '忽如一夜春风来', '千树万树梨花开'] },
  { id: 43, category: '冬至', categoryType: '节气', title: '冬至', author: '杜甫', lines: ['天时人事日相催', '冬至阳生春又来', '刺绣五纹添弱线', '吹葭六琯动浮灰'] },
  { id: 44, category: '冬至', categoryType: '节气', title: '邯郸冬至夜思家', author: '白居易', lines: ['邯郸驿里逢冬至', '抱膝灯前影伴身', '想得家中夜深坐', '还应说着远行人'] },
  { id: 45, category: '小寒', categoryType: '节气', title: '小寒', author: '陆游', lines: ['小寒已近手难舒', '终日掩门深闭庐', '树欲生寒叶将落', '梅如解语亦情疏'] },
  { id: 46, category: '小寒', categoryType: '节气', title: '梅花', author: '王安石', lines: ['墙角数枝梅', '凌寒独自开', '遥知不是雪', '为有暗香来'] },
  { id: 47, category: '大寒', categoryType: '节气', title: '大寒', author: '陆游', lines: ['大寒雪未消', '闭户不能出', '可怜切云冠', '局此容膝室'] },
  { id: 48, category: '大寒', categoryType: '节气', title: '卖炭翁', author: '白居易', lines: ['满面尘灰烟火色', '两鬓苍苍十指黑', '卖炭得钱何所营', '身上衣裳口中食'] },
  // ===== 传统节日 =====
  { id: 49, category: '春节', categoryType: '节日', title: '元日', author: '王安石', lines: ['爆竹声中一岁除', '春风送暖入屠苏', '千门万户曈曈日', '总把新桃换旧符'] },
  { id: 50, category: '春节', categoryType: '节日', title: '拜年', author: '文徵明', lines: ['不求见面惟通谒', '名纸朝来满敝庐', '我亦随人投数纸', '世情嫌简不嫌虚'] },
  { id: 51, category: '春节', categoryType: '节日', title: '守岁', author: '苏轼', lines: ['欲知垂尽岁', '有似赴壑蛇', '儿童强不睡', '相守夜欢哗'] },
  { id: 52, category: '春节', categoryType: '节日', title: '新年作', author: '刘长卿', lines: ['乡心新岁切', '天畔独潸然', '老至居人下', '春归在客先'] },
  { id: 53, category: '春节', categoryType: '节日', title: '屠苏酒', author: '陆游', lines: ['半盏屠苏犹未举', '灯前小草写桃符'] },
  { id: 54, category: '春节', categoryType: '节日', title: '迎春', author: '叶燮', lines: ['律转鸿钧', '新元肇启', '东风解冻', '淑气光临'] },
  { id: 55, category: '元宵节', categoryType: '节日', title: '元夕', author: '辛弃疾', lines: ['东风夜放花千树', '更吹落星如雨', '宝马雕车香满路', '凤箫声动'] },
  { id: 56, category: '元宵节', categoryType: '节日', title: '十五夜观灯', author: '卢照邻', lines: ['锦里开芳宴', '兰缸艳早年', '缛彩遥分地', '繁光远缀天'] },
  { id: 57, category: '元宵节', categoryType: '节日', title: '上元夜', author: '崔液', lines: ['玉漏银壶且莫催', '铁关金锁彻明开', '谁家见月能闲坐', '何处闻灯不看来'] },
  { id: 58, category: '元宵节', categoryType: '节日', title: '正月十五夜', author: '苏味道', lines: ['火树银花合', '星桥铁锁开', '暗尘随马去', '明月逐人来'] },
  { id: 59, category: '元宵节', categoryType: '节日', title: '元宵', author: '唐寅', lines: ['有灯无月不娱人', '有月无灯不算春', '春到人间人似玉', '灯烧月下月如银'] },
  { id: 60, category: '寒食节', categoryType: '节日', title: '寒食', author: '韩翃', lines: ['春城无处不飞花', '寒食东风御柳斜', '日暮汉宫传蜡烛', '轻烟散入五侯家'] },
  { id: 61, category: '寒食节', categoryType: '节日', title: '寒食寄京师诸弟', author: '韦应物', lines: ['雨中禁火空斋冷', '江上流莺独坐听', '把酒看花想诸弟', '杜陵寒食草青青'] },
  { id: 62, category: '寒食节', categoryType: '节日', title: '寒食日即事', author: '温庭筠', lines: ['清溪一道穿桃李', '演漾绿蒲涵白芷', '溪上人家凡几家', '落花半落东流水'] },
  { id: 63, category: '清明节', categoryType: '节日', title: '清明', author: '杜牧', lines: ['清明时节雨纷纷', '路上行人欲断魂', '借问酒家何处有', '牧童遥指杏花村'] },
  { id: 64, category: '清明节', categoryType: '节日', title: '清明', author: '王禹偁', lines: ['无花无酒过清明', '兴味萧然似野僧', '昨日邻家乞新火', '晓窗分与读书灯'] },
  { id: 65, category: '清明节', categoryType: '节日', title: '苏堤清明即事', author: '吴惟信', lines: ['梨花风起正清明', '游子寻春半出城', '日暮笙歌收拾去', '万株杨柳属流莺'] },
  { id: 66, category: '清明节', categoryType: '节日', title: '清明日', author: '温庭筠', lines: ['清娥画扇中', '春树郁金红', '出犯繁花露', '归穿弱柳风'] },
  { id: 67, category: '端午节', categoryType: '节日', title: '端午', author: '文秀', lines: ['节分端午自谁言', '万古传闻为屈原', '堪笑楚江空渺渺', '不能洗得直臣冤'] },
  { id: 68, category: '端午节', categoryType: '节日', title: '竞渡诗', author: '卢肇', lines: ['石溪久住思端午', '馆驿楼前看发机', '鼙鼓动时雷隐隐', '兽头凌处雪微微'] },
  { id: 69, category: '端午节', categoryType: '节日', title: '乙卯重五诗', author: '陆游', lines: ['重五山村好', '榴花忽已繁', '粽包分两髻', '艾束著危冠'] },
  { id: 70, category: '端午节', categoryType: '节日', title: '端午日', author: '殷尧藩', lines: ['少年佳节倍多情', '老去谁知感慨生', '不效艾符趋习俗', '但祈蒲酒话升平'] },
  { id: 71, category: '七夕节', categoryType: '节日', title: '乞巧', author: '林杰', lines: ['七夕今宵看碧霄', '牵牛织女渡河桥', '家家乞巧望秋月', '穿尽红丝几万条'] },
  { id: 72, category: '七夕节', categoryType: '节日', title: '迢迢牵牛星', author: '佚名', lines: ['迢迢牵牛星', '皎皎河汉女', '纤纤擢素手', '札札弄机杼'] },
  { id: 73, category: '七夕节', categoryType: '节日', title: '七夕', author: '罗隐', lines: ['络角星河菡萏天', '一家欢笑设红筵', '应倾谢女珠玑箧', '尽写檀郎锦绣篇'] },
  { id: 74, category: '中秋节', categoryType: '节日', title: '十五夜望月', author: '王建', lines: ['中庭地白树栖鸦', '冷露无声湿桂花', '今夜月明人尽望', '不知秋思落谁家'] },
  { id: 75, category: '中秋节', categoryType: '节日', title: '水调歌头', author: '苏轼', lines: ['明月几时有', '把酒问青天', '不知天上宫阙', '今夕是何年'] },
  { id: 76, category: '中秋节', categoryType: '节日', title: '中秋月', author: '晏殊', lines: ['十轮霜影转庭梧', '此夕羁人独向隅', '未必素娥无怅恨', '玉蟾清冷桂花孤'] },
  { id: 77, category: '重阳节', categoryType: '节日', title: '九月九日忆山东兄弟', author: '王维', lines: ['独在异乡为异客', '每逢佳节倍思亲', '遥知兄弟登高处', '遍插茱萸少一人'] },
  { id: 78, category: '重阳节', categoryType: '节日', title: '醉花阴', author: '李清照', lines: ['薄雾浓云愁永昼', '瑞脑销金兽', '佳节又重阳', '玉枕纱厨'] },
  { id: 79, category: '除夕', categoryType: '节日', title: '除夜', author: '高适', lines: ['旅馆寒灯独不眠', '客心何事转凄然', '故乡今夜思千里', '霜鬓明朝又一年'] },
  { id: 80, category: '除夕', categoryType: '节日', title: '除夜雪', author: '陆游', lines: ['北风吹雪四更初', '嘉瑞天教及岁除', '半盏屠苏犹未举', '灯前小草写桃符'] },
]

// 题目类型
type QuizType = 'line_complete' | 'author' | 'category' | 'judge_line' | 'judge_author'

interface Quiz {
  id: number
  type: QuizType
  question: string
  options: string[]
  answer: number
  poetry: Poetry
  explanation?: string
}

// 生成随机题目
const generateQuiz = (poetry: Poetry, allPoetries: Poetry[]): Quiz => {
  const types: QuizType[] = ['line_complete', 'author', 'category', 'judge_line', 'judge_author']
  const type = types[Math.floor(Math.random() * types.length)]
  
  const wrongOptions = (correct: string) => {
    const filtered = allPoetries
      .filter(p => p[correct === 'author' ? 'author' : 'category'] !== (correct === 'author' ? poetry.author : poetry.category))
      .map(p => correct === 'author' ? p.author : p.category)
      .filter((v, i, a) => a.indexOf(v) === i) // 去重
    const shuffled = filtered.sort(() => Math.random() - 0.5)
    return shuffled.slice(0, 3)
  }

  switch (type) {
    case 'line_complete': {
      // 给出一句诗，选择下一句
      const lineIdx = Math.floor(Math.random() * (poetry.lines.length - 1))
      const questionLine = poetry.lines[lineIdx]
      const correctNext = poetry.lines[lineIdx + 1]
      const wrongs = allPoetries
        .filter(p => p.id !== poetry.id)
        .map(p => p.lines[Math.floor(Math.random() * p.lines.length)])
        .filter(l => l !== correctNext)
        .slice(0, 3)
      const options = [correctNext, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + lineIdx,
        type,
        question: `上句：${questionLine}\n请接下句：`,
        options,
        answer: options.indexOf(correctNext),
        poetry,
        explanation: `这首诗出自《${poetry.title}》${poetry.category}时节`,
      }
    }
    case 'author': {
      // 给出诗句，选择作者
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const correct = poetry.author
      const wrongs = wrongOptions('author')
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + 50,
        type,
        question: `这句诗的作者是谁？\n"${questionLine}..."`,
        options,
        answer: options.indexOf(correct),
        poetry,
        explanation: `这句诗出自唐代诗人${poetry.author}的《${poetry.title}》`,
      }
    }
    case 'category': {
      // 给出诗句，选择节气/节日
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const correct = poetry.category
      const allCategories = [...new Set(allPoetries.map(p => p.category))]
      const wrongs = allCategories.filter(c => c !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
      const options = [correct, ...wrongs].sort(() => Math.random() - 0.5)
      return {
        id: poetry.id * 100 + 60,
        type,
        question: `这句诗描述的是哪个${poetry.categoryType}？\n"${questionLine}..."`,
        options,
        answer: options.indexOf(correct),
        poetry,
        explanation: `这首诗出自《${poetry.title}》，描述的是${poetry.category}${poetry.categoryType}`,
      }
    }
    case 'judge_line': {
      // 判断题：给出上句和下句选项，判断是否匹配
      const lineIdx = Math.floor(Math.random() * (poetry.lines.length - 1))
      const correctNext = poetry.lines[lineIdx + 1]
      const wrongs = allPoetries
        .filter(p => p.id !== poetry.id)
        .map(p => p.lines[Math.floor(Math.random() * p.lines.length)])
        .filter(l => l !== correctNext)[0] || '春风又绿江南岸'
      const isCorrect = Math.random() > 0.5
      const options = ['✅ 正确', '❌ 错误']
      return {
        id: poetry.id * 100 + lineIdx + 70,
        type,
        question: `判断："${poetry.lines[lineIdx]}，${isCorrect ? correctNext : wrongs}"\n这是否是《${poetry.title}》中的正确诗句？`,
        options,
        answer: isCorrect ? 0 : 1,
        poetry,
        explanation: isCorrect 
          ? `正确！这句诗出自${poetry.author}的《${poetry.title}》`
          : `错误！正确下句应该是"${correctNext}"`,
      }
    }
    case 'judge_author': {
      // 判断题：判断诗句是否属于某位诗人
      const questionLine = poetry.lines[Math.floor(Math.random() * poetry.lines.length)]
      const isCorrectAuthor = Math.random() > 0.5
      const displayAuthor = isCorrectAuthor ? poetry.author : 
        allPoetries.filter(p => p.author !== poetry.author)[Math.floor(Math.random() * (allPoetries.length - 1))]?.author || '李白'
      const options = ['✅ 正确', '❌ 错误']
      return {
        id: poetry.id * 100 + 80,
        type,
        question: `判断："${questionLine}..."\n这是否是诗人${displayAuthor}的作品？`,
        options,
        answer: isCorrectAuthor ? 0 : 1,
        poetry,
        explanation: isCorrectAuthor
          ? `正确！这句诗出自唐代诗人${poetry.author}的《${poetry.title}》`
          : `错误！这句诗实际出自${poetry.author}的《${poetry.title}》`,
      }
    }
  }
}

// 随机打乱并生成题目组
const generateQuizSet = (count: number = 10): Quiz[] => {
  const shuffled = [...POETRY_DB].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, shuffled.length)).map(p => generateQuiz(p, POETRY_DB))
}

// 庆祝动画组件
const CelebrationEffect = ({ show }: { show: boolean }) => {
  if (!show) return null
  return (
    <div className="celebration-container">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="confetti" 
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            backgroundColor: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6b9d'][i % 5],
          }}
        />
      ))}
    </div>
  )
}

// ========== 诗词大赛介绍页 ==========
const PoetryIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      
      {step === 0 && (
        <>
          <FadeIn>
            <div className="poetry-hero">
              <div className="poetry-lantern">🏮</div>
              <h1 className="page-title poetry-title">
                <span className="emoji">📜</span>诗词大赛
              </h1>
              <p className="poetry-subtitle">24节气 · 传统节日</p>
            </div>
          </FadeIn>
          
          <FadeIn delay={400}>
            <div className="poetry-intro-card">
              <h3>🌸 比赛规则</h3>
              <ul>
                <li>共 <strong>10 道题</strong>，随机抽取</li>
                <li>包含 <strong>选择题</strong> 和 <strong>判断题</strong></li>
                <li>涵盖 <strong>24节气</strong> 和 <strong>传统节日</strong> 诗词</li>
              </ul>
            </div>
          </FadeIn>
          
          <FadeIn delay={700}>
            <div className="poetry-categories">
              <div className="poetry-cat-item">
                <span className="cat-icon">🌱</span>
                <span>春季节气</span>
                <small>立春·雨水·惊蛰·春分·清明·谷雨</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">☀️</span>
                <span>夏季节气</span>
                <small>立夏·小满·芒种·夏至·小暑·大暑</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">🍂</span>
                <span>秋季节气</span>
                <small>立秋·处暑·白露·秋分·寒露·霜降</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">❄️</span>
                <span>冬季节气</span>
                <small>立冬·小雪·大雪·冬至·小寒·大寒</small>
              </div>
              <div className="poetry-cat-item">
                <span className="cat-icon">🎊</span>
                <span>传统节日</span>
                <small>春节·元宵·端午·七夕·中秋·重阳·除夕...</small>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={1000}>
            <button className="next-btn poetry-start-btn" onClick={() => setStep(1)}>
              🎯 准备好了！开始挑战
            </button>
          </FadeIn>
        </>
      )}
      
      {step === 1 && (
        <>
          <FadeIn>
            <h2 className="page-title"><span className="emoji">🎮</span>小提示</h2>
          </FadeIn>
          
          <FadeIn delay={300}>
            <div className="poetry-tips">
              <div className="tip-card">
                <span className="tip-icon">💡</span>
                <div>
                  <strong>上句接下句</strong>
                  <p>给出诗句的前半句，选择正确的后半句</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-icon">👤</span>
                <div>
                  <strong>作者是谁</strong>
                  <p>根据诗句内容，选择正确的诗人</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🏷️</span>
                <div>
                  <strong>属于哪个节日</strong>
                  <p>判断诗句描述的是哪个节气或节日</p>
                </div>
              </div>
              <div className="tip-card">
                <span className="tip-icon">✅</span>
                <div>
                  <strong>判断对错</strong>
                  <p>判断诗句或作者是否正确</p>
                </div>
              </div>
            </div>
          </FadeIn>
          
          <FadeIn delay={600}>
            <button className="next-btn" onClick={onNext}>
              🚀 出发！去答题
            </button>
          </FadeIn>
        </>
      )}
    </div>
  )
}

// ========== 诗词大赛答题页 ==========
const PoetryQuizPage = ({ onFinish, onBack }: { onFinish: (score: number, total: number) => void, onBack: () => void }) => {
  const [quizzes] = useState(() => generateQuizSet(10))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [showCorrect, setShowCorrect] = useState(false)
  
  const quiz = quizzes[current]
  const isCorrect = selected === quiz.answer
  
  const handleSubmit = () => {
    setSubmitted(true)
    setShowCorrect(true)
    if (selected === quiz.answer) {
      setScore(s => s + 1)
    }
  }
  
  const handleNext = () => {
    if (current < quizzes.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setSubmitted(false)
      setShowCorrect(false)
    } else {
      onFinish(score + (selected === quiz.answer ? 1 : 0), quizzes.length)
    }
  }
  
  const getTypeLabel = (type: QuizType) => {
    switch (type) {
      case 'line_complete': return '📝 上句接下句'
      case 'author': return '👤 诗句作者'
      case 'category': return '🏷️ 节日归属'
      case 'judge_line': return '✅ 判断对错'
      case 'judge_author': return '✅ 判断作者'
    }
  }
  
  return (
    <div className="page poetry-quiz-page">
      <button className="back-btn" onClick={onBack}>← 退出比赛</button>
      
      <FadeIn>
        <div className="quiz-header">
          <div className="quiz-progress">
            <span className="quiz-num">第 {current + 1} 题</span>
            <span className="quiz-total">/ 共 {quizzes.length} 题</span>
          </div>
          <div className="quiz-score">⭐ {score} 分</div>
        </div>
        <div className="quiz-progress-bar">
          <div 
            className="quiz-progress-fill" 
            style={{ width: `${((current + 1) / quizzes.length) * 100}%` }}
          />
        </div>
      </FadeIn>
      
      <FadeIn delay={200}>
        <div className="quiz-type-badge">{getTypeLabel(quiz.type)}</div>
      </FadeIn>
      
      <FadeIn delay={300}>
        <div className="quiz-question-box">
          <p style={{ whiteSpace: 'pre-line' }}>{quiz.question}</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={500}>
        <div className="quiz-options">
          {quiz.options.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option ${selected === i ? 'selected' : ''} ${
                showCorrect && i === quiz.answer ? 'correct' : ''
              } ${
                showCorrect && selected === i && !isCorrect ? 'wrong' : ''
              }`}
              onClick={() => !submitted && setSelected(i)}
              disabled={submitted}
            >
              <span className="option-letter">{String.fromCharCode(65 + i)}</span>
              <span className="option-text">{opt}</span>
              {showCorrect && i === quiz.answer && <span className="option-icon">✓</span>}
              {showCorrect && selected === i && !isCorrect && <span className="option-icon">✗</span>}
            </button>
          ))}
        </div>
      </FadeIn>
      
      <FadeIn delay={700}>
        {!submitted ? (
          <button 
            className="submit-btn quiz-submit" 
            onClick={handleSubmit} 
            disabled={selected === null}
          >
            提交答案
          </button>
        ) : (
          <div className={`quiz-result ${isCorrect ? 'correct' : 'wrong'}`}>
            <CelebrationEffect show={isCorrect} />
            <div className="result-icon-large">
              {isCorrect ? '🎉' : '🤔'}
            </div>
            <p className="result-text">{isCorrect ? '太棒了！答对啦！' : '答错了，没关系~'}</p>
            {quiz.explanation && (
              <p className="result-explanation">{quiz.explanation}</p>
            )}
            <button className="next-btn" onClick={handleNext}>
              {current < quizzes.length - 1 ? '下一题 →' : '查看成绩 🏆'}
            </button>
          </div>
        )}
      </FadeIn>
    </div>
  )
}

// ========== 诗词大赛结果页 ==========
const PoetryResultPage = ({ score, total, onRetry, onHome }: { 
  score: number, 
  total: number, 
  onRetry: () => void,
  onHome: () => void 
}) => {
  const percentage = Math.round((score / total) * 100)
  const grade = percentage >= 90 ? '🏆' : percentage >= 70 ? '🌟' : percentage >= 50 ? '👍' : '💪'
  const gradeText = percentage >= 90 ? '诗仙下凡！' : percentage >= 70 ? '诗词小达人！' : percentage >= 50 ? '继续加油！' : '再接再厉！'
  const gradeColor = percentage >= 90 ? '#ffd700' : percentage >= 70 ? '#6366f1' : percentage >= 50 ? '#10b981' : '#f59e0b'
  
  return (
    <div className="page poetry-result-page">
      <FadeIn>
        <div className="result-celebration">
          <div className="result-emoji">{grade}</div>
          <h2 className="page-title">比赛结束！</h2>
          <div className="result-score-display" style={{ color: gradeColor }}>
            {score} <span>/</span> {total}
          </div>
          <p className="result-percentage">{percentage}% 正确率</p>
          <p className="result-grade-text">{gradeText}</p>
        </div>
      </FadeIn>
      
      <FadeIn delay={400}>
        <div className="result-summary">
          <h3>📊 答题情况</h3>
          <div className="summary-stats">
            <div className="stat-item correct">
              <span className="stat-icon">✓</span>
              <span className="stat-num">{score}</span>
              <span className="stat-label">答对</span>
            </div>
            <div className="stat-item wrong">
              <span className="stat-icon">✗</span>
              <span className="stat-num">{total - score}</span>
              <span className="stat-label">答错</span>
            </div>
          </div>
        </div>
      </FadeIn>
      
      <FadeIn delay={700}>
        <div className="result-message">
          {percentage >= 90 && (
            <p>太厉害了！你对传统诗词了如指掌！</p>
          )}
          {percentage >= 70 && percentage < 90 && (
            <p>很棒！你对诗词有不错的了解~</p>
          )}
          {percentage >= 50 && percentage < 70 && (
            <p>不错的开始！多读读诗词会更厉害！</p>
          )}
          {percentage < 50 && (
            <p>没关系！诗词需要慢慢积累，再来挑战吧！</p>
          )}
        </div>
      </FadeIn>
      
      <FadeIn delay={1000}>
        <div className="result-actions">
          <button className="retry-btn" onClick={onRetry}>
            🔄 再来一局
          </button>
          <button className="restart-btn" onClick={onHome}>
            🏠 返回首页
          </button>
        </div>
      </FadeIn>
      
      <CelebrationEffect show={percentage >= 70} />
    </div>
  )
}

// ========== 主应用 ==========
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [poetryScore, setPoetryScore] = useState({ score: 0, total: 0 })

  const goTo = (page: PageType) => setCurrentPage(page)
  const goHome = () => setCurrentPage('home')
  const handlePoetryFinish = (score: number, total: number) => {
    setPoetryScore({ score, total })
    setCurrentPage('poetry-result')
  }

  const iePages: PageType[] = ['intro', 'venn', 'two-set', 'three-set', 'practice']
  const spPages: PageType[] = ['sp-intro', 'sp-concept', 'sp-basic', 'sp-forbidden', 'sp-mustpass', 'sp-special', 'sp-practice']
  const sportPages: PageType[] = ['sport-intro', 'sport-elimination', 'sport-round', 'sport-graph', 'sport-score', 'sport-practice']
  const loopPages: PageType[] = ['loop-intro', 'loop-syntax', 'loop-process', 'loop-example', 'loop-practice']
  const sortPages: PageType[] = ['sort-intro', 'sort-algos', 'sort-visual', 'sort-example', 'sort-practice']
  const cmdPages: PageType[] = ['cmd-intro', 'cmd-break', 'cmd-continue', 'cmd-compare', 'cmd-practice']
  const poetryPages: PageType[] = ['poetry-intro', 'poetry-quiz', 'poetry-result']
  const isInclusion = iePages.includes(currentPage)
  const isShortestPath = spPages.includes(currentPage)
  const isSport = sportPages.includes(currentPage)
  const isLoop = loopPages.includes(currentPage)
  const isSort = sortPages.includes(currentPage)
  const isCmd = cmdPages.includes(currentPage)
  const progressPages = isInclusion
    ? iePages
    : isShortestPath
      ? spPages
      : isSport
        ? sportPages
        : isLoop
          ? loopPages
          : isSort
            ? sortPages
            : isCmd
              ? cmdPages
              : poetryPages.includes(currentPage)
                ? poetryPages
                : []

  return (
    <div className="app">
      {currentPage === 'home' && <HomePage onSelect={goTo} />}

      {/* 容斥原理 */}
      {currentPage === 'intro' && <IntroPage onNext={() => goTo('venn')} onBack={goHome} />}
      {currentPage === 'venn' && <VennPage onNext={() => goTo('two-set')} onBack={goHome} />}
      {currentPage === 'two-set' && <TwoSetPage onNext={() => goTo('three-set')} onBack={goHome} />}
      {currentPage === 'three-set' && <ThreeSetPage onNext={() => goTo('practice')} onBack={goHome} />}
      {currentPage === 'practice' && <PracticePage onBack={goHome} onHome={goHome} />}

      {/* 标数法 */}
      {currentPage === 'sp-intro' && <SPIntroPage onNext={() => goTo('sp-concept')} onBack={goHome} />}
      {currentPage === 'sp-concept' && <SPConceptPage onNext={() => goTo('sp-basic')} onBack={goHome} />}
      {currentPage === 'sp-basic' && <SPBasicPage onNext={() => goTo('sp-forbidden')} onBack={goHome} />}
      {currentPage === 'sp-forbidden' && <SPForbiddenPage onNext={() => goTo('sp-mustpass')} onBack={goHome} />}
      {currentPage === 'sp-mustpass' && <SPMustPassPage onNext={() => goTo('sp-special')} onBack={goHome} />}
      {currentPage === 'sp-special' && <SPSpecialPage onNext={() => goTo('sp-practice')} onBack={goHome} />}
      {currentPage === 'sp-practice' && <SPPracticePage onBack={goHome} onHome={goHome} />}

      {/* 体育比赛中的学问 */}
      {currentPage === 'sport-intro' && <SportIntroPage onNext={() => goTo('sport-elimination')} onBack={goHome} />}
      {currentPage === 'sport-elimination' && <SportEliminationPage onNext={() => goTo('sport-round')} onBack={goHome} />}
      {currentPage === 'sport-round' && <SportRoundPage onNext={() => goTo('sport-graph')} onBack={goHome} />}
      {currentPage === 'sport-graph' && <SportGraphPage onNext={() => goTo('sport-score')} onBack={goHome} />}
      {currentPage === 'sport-score' && <SportScorePage onNext={() => goTo('sport-practice')} onBack={goHome} />}
      {currentPage === 'sport-practice' && <SportPracticePage onBack={goHome} onHome={goHome} />}

      {currentPage === 'loop-intro' && <LoopIntroPage onNext={() => goTo('loop-syntax')} onBack={goHome} />}
      {currentPage === 'loop-syntax' && <LoopSyntaxPage onNext={() => goTo('loop-process')} onBack={goHome} />}
      {currentPage === 'loop-process' && <LoopProcessPage onNext={() => goTo('loop-example')} onBack={goHome} />}
      {currentPage === 'loop-example' && <LoopExamplePage onNext={() => goTo('loop-practice')} onBack={goHome} />}
      {currentPage === 'loop-practice' && <LoopPracticePage onBack={goHome} onHome={goHome} />}

      {currentPage === 'sort-intro' && <SortIntroPage onNext={() => goTo('sort-algos')} onBack={goHome} />}
      {currentPage === 'sort-algos' && <SortAlgosPage onNext={() => goTo('sort-visual')} onBack={goHome} />}
      {currentPage === 'sort-visual' && <SortVisualPage onNext={() => goTo('sort-example')} onBack={goHome} />}
      {currentPage === 'sort-example' && <SortExamplePage onNext={() => goTo('sort-practice')} onBack={goHome} />}
      {currentPage === 'sort-practice' && <SortPracticePage onBack={goHome} onHome={goHome} />}

      {/* 循环指挥官 */}
      {currentPage === 'cmd-intro' && <CmdIntroPage onNext={() => goTo('cmd-break')} onBack={goHome} />}
      {currentPage === 'cmd-break' && <CmdBreakPage onNext={() => goTo('cmd-continue')} onBack={goHome} />}
      {currentPage === 'cmd-continue' && <CmdContinuePage onNext={() => goTo('cmd-compare')} onBack={goHome} />}
      {currentPage === 'cmd-compare' && <CmdComparePage onNext={() => goTo('cmd-practice')} onBack={goHome} />}
      {currentPage === 'cmd-practice' && <CmdPracticePage onBack={goHome} onHome={goHome} />}

      {/* 诗词大赛 */}
      {currentPage === 'poetry-intro' && <PoetryIntroPage onNext={() => goTo('poetry-quiz')} onBack={goHome} />}
      {currentPage === 'poetry-quiz' && <PoetryQuizPage onFinish={handlePoetryFinish} onBack={goHome} />}
      {currentPage === 'poetry-result' && <PoetryResultPage score={poetryScore.score} total={poetryScore.total} onRetry={() => goTo('poetry-quiz')} onHome={goHome} />}

      {/* 进度条 */}
      {currentPage !== 'home' && (
        <div className="progress-bar">
          {progressPages.map(p => (
            <div key={p} className={`progress-dot ${currentPage === p ? 'active' : ''}`}></div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
