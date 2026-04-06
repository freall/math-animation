import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

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

export const IntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">什么是容斥原理？</h2></FadeIn>
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

export const VennPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [animate, setAnimate] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 500); return () => clearTimeout(t) }, [])
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">神奇的韦恩图</h2></FadeIn>
      <FadeIn delay={300}><p className="page-intro">韦恩图就像两个重叠的气球~</p></FadeIn>
      <FadeIn delay={600}><div className="venn-demo"><VennDiagram type="two" animating={animate} data={true} /></div></FadeIn>
      <FadeIn delay={1000}><div className="venn-legend">
        <div className="legend-item"><div className="legend-circle blue"></div><span>蓝色部分 = 只喜欢篮球的人</span></div>
        <div className="legend-item"><div className="legend-circle red"></div><span>红色部分 = 只喜欢排球的人</span></div>
        <div className="legend-item"><div className="legend-circle overlap"></div><span>重叠部分 = 两样都喜欢！</span></div>
      </div></FadeIn>
      <FadeIn delay={1300}><div className="tip-box"><p>圆圈交叉的地方，就是同时属于两类的部分</p></div></FadeIn>
      <FadeIn delay={1600}><button className="next-btn" onClick={onNext}>学习公式 →</button></FadeIn>
    </div>
  )
}

export const TwoSetPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  const [step, setStep] = useState(0)
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">二量容斥公式</h2></FadeIn>
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

export const ThreeSetPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">三量容斥 - 更厉害的方法！</h2></FadeIn>
    <FadeIn delay={300}><p className="page-intro">如果有三样东西要数呢？</p></FadeIn>
    <FadeIn delay={500}><div className="venn-demo"><VennDiagram type="three" animating={true} /></div></FadeIn>
    <FadeIn delay={900}><div className="formula-box three-formula"><div className="formula"><span className="formula-part">三者之和</span><span> = </span><span className="formula-abc">A + B + C</span></div><div className="formula-line">- AB - AC - BC</div><div className="formula-line">+ ABC</div></div></FadeIn>
    <FadeIn delay={1200}><div className="rule-box"><p>口诀：</p><p className="rhyme">先加后减再加回</p></div></FadeIn>
    <FadeIn delay={1500}><div className="example-box"><h3>📋 例题练习</h3><p>数学42人，科学37人，英语19人</p><p>数学+科学7人，数学+英语6人</p><p>科学+英语4人，三项都参加2人</p><p className="question">总人数？</p></div></FadeIn>
    <FadeIn delay={1800}><div className="answer-box three-answer"><p>42 + 37 + 19 - 7 - 6 - 4 + 2 = 83</p><p className="final-answer">总人数：<strong>83人</strong></p></div></FadeIn>
    <FadeIn delay={2100}><button className="next-btn" onClick={onNext}>开始练习 →</button></FadeIn>
  </div>
)

export const PracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const handleSubmit = () => { setSubmitted(true); setIsCorrect(parseInt(answer) === 8) }
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">小小练习</h2></FadeIn>
      <FadeIn delay={300}><div className="practice-box"><p>某班有30人参加活动</p><p>喜欢画画的有18人</p><p>喜欢唱歌的有20人</p><p>两样都喜欢的有多少人？</p></div></FadeIn>
      <FadeIn delay={600}>{!submitted ? (
        <div className="answer-input"><input type="number" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="请输入答案" /><button className="submit-btn" onClick={handleSubmit}>提交答案</button></div>
      ) : (
        <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
          {isCorrect ? <><p>太棒了！答对了！</p><p className="explanation">18 + 20 - 30 = 8（人）</p></> : <><p>再想想哦~</p><p className="explanation">提示：18 + 20 - 30 = ?</p><button className="retry-btn" onClick={() => { setAnswer(''); setSubmitted(false) }}>再试一次</button></>}
        </div>
      )}</FadeIn>
      <FadeIn delay={900}><div className="summary-box"><h3>📚 今天学的知识</h3><ul><li>容斥原理 = 先包含，再排除</li><li>二量公式：A + B - AB</li><li>三量公式：A + B + C - AB - AC - BC + ABC</li></ul></div></FadeIn>
      <FadeIn delay={1200}><button className="restart-btn" onClick={onHome}>✅ 完成学习</button></FadeIn>
    </div>
  )
}
