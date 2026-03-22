import { useState, useEffect } from 'react'
import './App.css'

// ========== 类型定义 ==========
type PageType =
  | 'home'
  | 'intro' | 'venn' | 'two-set' | 'three-set' | 'practice'  // 容斥原理
  | 'sp-intro' | 'sp-concept' | 'sp-basic' | 'sp-forbidden' | 'sp-mustpass' | 'sp-special' | 'sp-practice'  // 标数法

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

// ========== 首页目录 ==========
const HomePage = ({ onSelect }: { onSelect: (topic: string) => void }) => (
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
        <div className="topic-card" onClick={() => onSelect('inclusion')}>
          <div className="topic-icon">🔢</div>
          <h3>容斥原理</h3>
          <p>学会用韦恩图数清重叠的东西</p>
          <span className="topic-tag">计数方法</span>
        </div>
        <div className="topic-card" onClick={() => onSelect('shortest-path')}>
          <div className="topic-icon">🗺️</div>
          <h3>最短路线标数法</h3>
          <p>用标数法找到所有最短路线</p>
          <span className="topic-tag">路径规划</span>
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
const GridDiagram = ({ rows, cols, numbers, forbidden, startLabel, endLabel, animated, highlightCells }: {
  rows: number, cols: number, numbers?: (number | null)[][], forbidden?: [number, number][],
  startLabel?: string, endLabel?: string, animated?: boolean, highlightCells?: [number, number][]
}) => {
  const cellW = 50, cellH = 50, pad = 40
  const w = cols * cellW + pad * 2, h = rows * cellH + pad * 2
  const forbiddenSet = new Set(forbidden?.map(([r, c]) => `${r},${c}`))
  const highlightSet = new Set(highlightCells?.map(([r, c]) => `${r},${c}`))

  return (
    <div className="grid-container">
      <svg viewBox={`0 0 ${w} ${h}`} className="grid-svg">
        {/* 网格线 */}
        {Array.from({ length: rows + 1 }, (_, i) => (
          <line key={`h${i}`} x1={pad} y1={pad + i * cellH} x2={pad + cols * cellW} y2={pad + i * cellH} stroke="#cbd5e1" strokeWidth="1" />
        ))}
        {Array.from({ length: cols + 1 }, (_, i) => (
          <line key={`v${i}`} x1={pad + i * cellW} y1={pad} x2={pad + i * cellW} y2={pad + rows * cellH} stroke="#cbd5e1" strokeWidth="1" />
        ))}

        {/* 单元格 */}
        {Array.from({ length: rows }, (_, r) =>
          Array.from({ length: cols }, (_, c) => {
            const x = pad + c * cellW, y = pad + r * cellH
            const key = `${r},${c}`
            const isForbidden = forbiddenSet.has(key)
            const isHighlight = highlightSet.has(key)
            const num = numbers?.[r]?.[c]
            const isStart = r === rows - 1 && c === 0
            const isEnd = r === 0 && c === cols - 1

            return (
              <g key={key}>
                <rect x={x} y={y} width={cellW} height={cellH}
                  fill={isForbidden ? '#fecaca' : isStart ? '#bbf7d0' : isEnd ? '#bfdbfe' : isHighlight ? '#fef08a' : 'white'}
                  stroke={isForbidden ? '#ef4444' : '#e2e8f0'} strokeWidth={isForbidden ? 2 : 1}
                  className={animated && num !== null && num !== undefined ? 'cell-appear' : ''} />
                {isForbidden && <text x={x + cellW / 2} y={y + cellH / 2 + 8} textAnchor="middle" fontSize="20" fill="#ef4444" fontWeight="bold">×</text>}
                {isStart && <text x={x + cellW / 2} y={y + cellH / 2 + 10} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#16a34a">A</text>}
                {isEnd && <text x={x + cellW / 2} y={y + cellH / 2 + 10} textAnchor="middle" fontSize="22" fontWeight="bold" fill="#2563eb">B</text>}
                {num !== null && num !== undefined && !isForbidden && !isStart && !isEnd && (
                  <text x={x + cellW / 2} y={y + cellH / 2 + 8} textAnchor="middle" fontSize="18" fontWeight="bold" fill={isHighlight ? '#ca8a04' : '#6366f1'}>{num}</text>
                )}
                {/* 方向箭头 */}
                {c < cols - 1 && !isEnd && !isForbidden && <text x={x + cellW - 8} y={y + cellH / 2 + 4} fontSize="12" fill="#94a3b8">→</text>}
                {r > 0 && !isStart && !isForbidden && <text x={x + cellW / 2} y={y + 14} textAnchor="middle" fontSize="12" fill="#94a3b8">↑</text>}
              </g>
            )
          })
        )}
      </svg>
    </div>
  )
}

// 标数法：基础例题网格 (5列4行)
const basicGrid = [
  [1, 5, 15, 35, 70],
  [1, 4, 10, 20, 35],
  [1, 3, 6, 10, 15],
  [1, 1, 1, 1, 1],
]

// 标数法：不过某点网格
const forbiddenGrid = [
  [1, 5, 14, 28, 48],
  [1, 4, 9, 14, 20],
  [1, 3, 0, 5, 6],
  [1, 1, 1, 1, 1],
]

// 标数法：必过某点 - A到C
const mustPassAC = [
  [6, 0, 0],
  [3, 0, 0],
  [1, 1, 1],
]

// 标数法：必过某点 - C到B
const mustPassCB = [
  [4, 10, 20],
  [3, 6, 10],
  [1, 0, 0],
]

// 标数法：特殊形状
const specialGrid = [
  [1, 3, 6, 10],
  [1, 2, 3, 4],
  [0, 1, 1, 1],
  [1, 1, 0, 0],
]

const SPIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🗺️</span>什么是标数法？</h2></FadeIn>
    <FadeIn delay={300}><div className="story-box"><div className="story-icon">🚶</div><p>田田从家(A)去学校(B)，有多少条最短路线？</p></div></FadeIn>
    <FadeIn delay={600}><div className="concept-box">
      <p>最短路线有三个要求：</p>
      <div className="concept-list">
        <span className="concept-item">🚫 不绕路</span>
        <span className="concept-item">🚫 不重复</span>
        <span className="concept-item">🚫 不回头</span>
      </div>
    </div></FadeIn>
    <FadeIn delay={900}><div className="tip-box"><span className="tip-icon">💡</span><p>只能向右走或向上走！</p></div></FadeIn>
    <FadeIn delay={1200}><div className="venn-demo"><GridDiagram rows={3} cols={4} startLabel="A" endLabel="B" /></div></FadeIn>
    <FadeIn delay={1500}><button className="next-btn" onClick={onNext}>学习标数法 →</button></FadeIn>
  </div>
)

const SPConceptPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">⭐</span>标数法核心</h2></FadeIn>
    <FadeIn delay={300}><div className="formula-box"><div className="formula" style={{ fontSize: '1.5rem' }}>某点的数 = 来源路线数之和</div></div></FadeIn>
    <FadeIn delay={600}><div className="step-card"><span className="step-number">1</span><p>找<strong>起点</strong>和<strong>终点</strong></p></div></FadeIn>
    <FadeIn delay={900}><div className="step-card"><span className="step-number">2</span><p>确定方向：<strong>向右、向上</strong></p></div></FadeIn>
    <FadeIn delay={1200}><div className="step-card"><span className="step-number">3</span><p>起点标<strong>1</strong>，同行同列都标<strong>1</strong></p></div></FadeIn>
    <FadeIn delay={1500}><div className="step-card"><span className="step-number">4</span><p>按方向<strong>由近及远</strong>逐行/列标数</p></div></FadeIn>
    <FadeIn delay={1800}><button className="next-btn" onClick={onNext}>看例题 →</button></FadeIn>
  </div>
)

const SPBasicPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  const animatedCells: [number, number][] = step === 0 ? [] : step === 1 ? [[3,0],[3,1],[3,2],[3,3],[3,4],[2,0],[1,0],[0,0]] : step === 2 ? [[2,1],[1,1],[0,1]] : step === 3 ? [[2,2],[1,2],[0,2]] : step === 4 ? [[2,3],[1,3],[0,3]] : step === 5 ? [[0,4]] : []

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">📝</span>基础例题</h2></FadeIn>
      <FadeIn delay={300}><div className="example-box"><h3>📋 题目</h3><p>从A点到B点，共有多少种不同的最短路线？</p></div></FadeIn>
      <FadeIn delay={600}><div className="venn-demo"><GridDiagram rows={4} cols={5} numbers={step >= 6 ? basicGrid : undefined} animated highlightCells={animatedCells} /></div></FadeIn>

      {step === 0 && <FadeIn delay={900}><button className="next-btn" onClick={() => setStep(1)}>① 起点行列标1 →</button></FadeIn>}
      {step === 1 && <FadeIn><div className="tip-box"><span className="tip-icon">📌</span><p>起点A所在的第一行和第一列都标1，因为只有一条路能到达这些格子</p></div><button className="next-btn" onClick={() => setStep(2)}>② 继续标数 →</button></FadeIn>}
      {step === 2 && <FadeIn><div className="tip-box"><span className="tip-icon">🔢</span><p>第2列：每个格子 = 上方 + 左方的数之和</p></div><button className="next-btn" onClick={() => setStep(3)}>③ 继续 →</button></FadeIn>}
      {step === 3 && <FadeIn><button className="next-btn" onClick={() => setStep(4)}>④ 继续 →</button></FadeIn>}
      {step === 4 && <FadeIn><button className="next-btn" onClick={() => setStep(5)}>⑤ 标到B →</button></FadeIn>}
      {step === 5 && <FadeIn><button className="next-btn" onClick={() => setStep(6)}>⑥ 查看答案 →</button></FadeIn>}
      {step >= 6 && <>
        <FadeIn delay={200}><div className="answer-box"><span className="answer-icon">🎉</span><p>B点标的是<strong>70</strong></p><p>共有<strong>70种</strong>最短路线！</p></div></FadeIn>
        <FadeIn delay={500}><button className="next-btn" onClick={onNext}>学习进阶 →</button></FadeIn>
      </>}
    </div>
  )
}

const SPForbiddenPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🚫</span>不过某点</h2></FadeIn>
    <FadeIn delay={300}><div className="example-box"><h3>📋 题目</h3><p>从A到B，但<strong>不能经过C点</strong>的商店</p><p>不同的最短路线一共有多少条？</p></div></FadeIn>
    <FadeIn delay={600}><div className="venn-demo"><GridDiagram rows={4} cols={5} numbers={forbiddenGrid} forbidden={[[2, 2]]} /></div></FadeIn>
    <FadeIn delay={900}><div className="tip-box"><span className="tip-icon">💡</span><p>不能经过的点标<strong>0</strong>或打<strong>×</strong></p></div></FadeIn>
    <FadeIn delay={1200}><div className="rule-box"><p>注意：</p><p className="rhyme" style={{ fontSize: '1.3rem' }}>C点标0后会影响后面点的标数</p></div></FadeIn>
    <FadeIn delay={1500}><div className="answer-box"><span className="answer-icon">✅</span><p>B点标的是<strong>48</strong></p><p>共有<strong>48条</strong>最短路线</p></div></FadeIn>
    <FadeIn delay={1800}><button className="next-btn" onClick={onNext}>学习下一题型 →</button></FadeIn>
  </div>
)

const SPMustPassPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">✅</span>必过某点</h2></FadeIn>
    <FadeIn delay={300}><div className="example-box"><h3>📋 题目</h3><p>从A到B，但<strong>必须经过C点</strong></p><p>不同的最短路线共有多少条？</p></div></FadeIn>
    <FadeIn delay={600}><div className="tip-box"><span className="tip-icon">💡</span><p>必过某点 → <strong>分段标数</strong>，圈出范围</p></div></FadeIn>
    <FadeIn delay={900}><div className="segment-demo">
      <div className="segment-box">
        <h4>第一程：A → C</h4>
        <GridDiagram rows={3} cols={3} numbers={mustPassAC} />
        <p className="segment-result">A到C：<strong>6条</strong>路线</p>
      </div>
      <div className="segment-arrow">→</div>
      <div className="segment-box">
        <h4>第二程：C → B</h4>
        <GridDiagram rows={3} cols={3} numbers={mustPassCB} />
        <p className="segment-result">C到B：<strong>20条</strong>路线</p>
      </div>
    </div></FadeIn>
    <FadeIn delay={1200}><div className="calculation">
      <div className="calc-step"><span className="calc-num">6</span><span className="calc-op">×</span><span className="calc-num">20</span><span className="calc-op">=</span><span className="calc-num result">120</span></div>
    </div></FadeIn>
    <FadeIn delay={1500}><div className="answer-box"><span className="answer-icon">🎉</span><p>共有<strong>120条</strong>最短路线</p></div></FadeIn>
    <FadeIn delay={1800}><button className="next-btn" onClick={onNext}>学习特殊形状 →</button></FadeIn>
  </div>
)

const SPSpecialPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title"><span className="emoji">🔷</span>特殊形状</h2></FadeIn>
    <FadeIn delay={300}><div className="example-box"><h3>📋 题目</h3><p>丁丁从家里去乐乐老师家，路线图如下</p><p>最短路线一共有多少条？</p></div></FadeIn>
    <FadeIn delay={600}><div className="tip-box"><span className="tip-icon">⚠️</span><p>不再是规整的矩形！要<strong>看清每个点能从哪里来</strong></p></div></FadeIn>
    <FadeIn delay={900}><div className="venn-demo"><GridDiagram rows={4} cols={4} numbers={specialGrid} forbidden={[[2, 0], [3, 2], [3, 3]]} /></div></FadeIn>
    <FadeIn delay={1200}><div className="rule-box"><p>关键：</p><p className="rhyme" style={{ fontSize: '1.3rem' }}>看清每个点从哪里来</p></div></FadeIn>
    <FadeIn delay={1500}><div className="answer-box"><span className="answer-icon">✅</span><p>B点标的是<strong>10</strong></p><p>共有<strong>10条</strong>最短路线</p></div></FadeIn>
    <FadeIn delay={1800}><button className="next-btn" onClick={onNext}>开始练习 →</button></FadeIn>
  </div>
)

const SPPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const handleSubmit = () => { setSubmitted(true); setIsCorrect(parseInt(answer) === 35) }
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title"><span className="emoji">🎮</span>小小练习</h2></FadeIn>
      <FadeIn delay={300}><div className="example-box"><h3>📋 题目</h3><p>从A点到B点，最短路线有多少种？</p></div></FadeIn>
      <FadeIn delay={600}><div className="venn-demo"><GridDiagram rows={4} cols={5} /></div></FadeIn>
      <FadeIn delay={900}>{!submitted ? (
        <div className="answer-input"><input type="number" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请输入答案" /><button className="submit-btn" onClick={handleSubmit}>提交答案</button></div>
      ) : (
        <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? <><span className="result-icon">🎉</span><p>太棒了！答对了！</p><p className="explanation">用标数法算出：35种</p></> : <><span className="result-icon">🤔</span><p>再想想哦~</p><p className="explanation">提示：用标数法，从起点开始标</p><button className="retry-btn" onClick={() => { setAnswer(''); setSubmitted(false) }}>再试一次</button></>}
        </div>
      )}</FadeIn>
      <FadeIn delay={1200}><div className="summary-box"><h3>📚 今天学的知识</h3><ul><li>标数法 = 某点数值 = 来源之和</li><li>不过某点 → 标0</li><li>必过某点 → 分段相乘</li><li>特殊形状 → 看清来源</li></ul></div></FadeIn>
      <FadeIn delay={1500}><button className="restart-btn" onClick={onHome}>✅ 完成学习</button></FadeIn>
    </div>
  )
}

// ========== 主应用 ==========
function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')

  const goTo = (page: PageType) => setCurrentPage(page)
  const goHome = () => setCurrentPage('home')

  const iePages: PageType[] = ['intro', 'venn', 'two-set', 'three-set', 'practice']
  const spPages: PageType[] = ['sp-intro', 'sp-concept', 'sp-basic', 'sp-forbidden', 'sp-mustpass', 'sp-special', 'sp-practice']
  const isInclusion = iePages.includes(currentPage)
  const isShortestPath = spPages.includes(currentPage)
  const progressPages = isInclusion ? iePages : isShortestPath ? spPages : []

  return (
    <div className="app">
      {currentPage === 'home' && <HomePage onSelect={(t) => goTo(t === 'inclusion' ? 'intro' : 'sp-intro')} />}

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
