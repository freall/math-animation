import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

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

export const SportIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">体育比赛里也藏着数学！</h2></FadeIn>

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
        
        <p>这一课我们不只看热闹，还要学会用“淘汰、连线、总分”三把小钥匙，打开比赛里的数学秘密。</p>
      </div>
    </FadeIn>

    <FadeIn delay={1450}><button className="next-btn" onClick={onNext}>先看单败淘汰赛 →</button></FadeIn>
  </div>
)

export const SportEliminationPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">单败淘汰赛：每场少 1 支</h2></FadeIn>

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

export const SportRoundPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">单循环赛：每两队都要见一面</h2></FadeIn>

      <FadeIn delay={250}>
        <div className="tip-box">
          
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

export const SportGraphPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">比赛没结束时，用点线图来帮忙</h2></FadeIn>

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

export const SportScorePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">常见积分制：先看每场一共送出几分</h2></FadeIn>

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

export const SportPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
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
      <FadeIn><h2 className="page-title">比赛数学小练习</h2></FadeIn>

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
