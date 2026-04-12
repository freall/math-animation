import React, { useMemo, useState } from 'react'
import { FadeIn, Star } from '../../components/animations'
import '../../App.css'

type HeightMap = number[][]

type ViewKind = 'top' | 'front' | 'left'

const maxHeight = (map: HeightMap) => Math.max(...map.flat())

const footprint = (map: HeightMap) => map.map((row) => row.map((v) => (v > 0 ? 1 : 0)))

const frontProfile = (map: HeightMap) => {
  const rows = map.length
  const cols = map[0]?.length ?? 0
  const profile = Array.from({ length: cols }, (_, c) => {
    let h = 0
    for (let r = 0; r < rows; r += 1) h = Math.max(h, map[r][c])
    return h
  })
  return profile
}

const leftProfile = (map: HeightMap) => map.map((row) => Math.max(...row))

const buildFilled = (w: number, h: number, fillHeights: number[]) =>
  Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => (h - y <= (fillHeights[x] ?? 0) ? 1 : 0)),
  )

const Grid = ({
  cells,
  onToggle,
  locked = true,
  label,
}: {
  cells: number[][]
  onToggle?: (r: number, c: number) => void
  locked?: boolean
  label: string
}) => (
  <div className="view-card">
    <div className="view-card-title">{label}</div>
    <div className="view-grid" style={{ gridTemplateColumns: `repeat(${cells[0]?.length ?? 0}, 1fr)` }}>
      {cells.flatMap((row, r) =>
        row.map((v, c) => (
          <button
            key={`${r}-${c}`}
            className={`view-cell ${v ? 'filled' : ''}`}
            type="button"
            onClick={() => (!locked && onToggle ? onToggle(r, c) : null)}
            aria-label={`${label} ${r + 1}-${c + 1}`}
          />
        )),
      )}
    </div>
  </div>
)

const IsoCubes = ({ map, highlight }: { map: HeightMap; highlight?: { r: number; c: number } | null }) => {
  const size = 26
  const rows = map.length
  const cols = map[0]?.length ?? 0
  const cubes = useMemo(() => {
    const list: { r: number; c: number; z: number }[] = []
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        for (let z = 0; z < map[r][c]; z += 1) list.push({ r, c, z })
      }
    }
    list.sort((a, b) => (a.r + a.c + a.z) - (b.r + b.c + b.z) || a.r - b.r || a.c - b.c || a.z - b.z)
    return list
  }, [cols, map, rows])

  const baseX = 160
  const baseY = 120 + Math.max(0, maxHeight(map) - 2) * 10
  const iso = (r: number, c: number, z: number) => {
    const x = baseX + (c - r) * (size * 0.9)
    const y = baseY + (c + r) * (size * 0.52) - z * (size * 0.78)
    return { x, y }
  }

  const cube = (r: number, c: number, z: number) => {
    const { x, y } = iso(r, c, z)
    const h = size * 0.78
    const w = size * 0.9
    const top = [
      [x, y - h],
      [x + w, y - h + w * 0.55],
      [x, y - h + w * 1.1],
      [x - w, y - h + w * 0.55],
    ]
    const left = [
      [x - w, y - h + w * 0.55],
      [x, y - h + w * 1.1],
      [x, y + w * 1.1],
      [x - w, y + w * 0.55],
    ]
    const right = [
      [x + w, y - h + w * 0.55],
      [x, y - h + w * 1.1],
      [x, y + w * 1.1],
      [x + w, y + w * 0.55],
    ]
    const isHighlighted = !!highlight && highlight.r === r && highlight.c === c
    const stroke = isHighlighted ? 'rgba(236,72,153,0.9)' : 'rgba(15,23,42,0.35)'
    const topFill = isHighlighted ? 'rgba(99,102,241,0.55)' : 'rgba(99,102,241,0.22)'
    const leftFill = isHighlighted ? 'rgba(14,165,233,0.32)' : 'rgba(148,163,184,0.26)'
    const rightFill = isHighlighted ? 'rgba(236,72,153,0.26)' : 'rgba(226,232,240,0.32)'
    return { top, left, right, stroke, topFill, leftFill, rightFill }
  }

  return (
    <div className="iso-board">
      <svg className="iso-svg" viewBox="0 0 320 240" role="img" aria-label="积木模型">
        {cubes.map(({ r, c, z }) => {
          const g = cube(r, c, z)
          const points = (p: number[][]) => p.map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(' ')
          return (
            <g key={`${r}-${c}-${z}`}>
              <polygon points={points(g.left)} fill={g.leftFill} stroke={g.stroke} strokeWidth={1.5} />
              <polygon points={points(g.right)} fill={g.rightFill} stroke={g.stroke} strokeWidth={1.5} />
              <polygon points={points(g.top)} fill={g.topFill} stroke={g.stroke} strokeWidth={1.5} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

const Celebration = ({ show }: { show: boolean }) =>
  show ? (
    <div className="stars-container" aria-hidden="true">
      {Array.from({ length: 18 }).map((_, i) => {
        const left = `${10 + ((i * 31) % 82)}%`
        const top = `${12 + ((i * 27) % 76)}%`
        const delay = `${(i % 6) * 0.12}s`
        const size = 22 + ((i * 9) % 18)
        return <Star key={i} style={{ left, top, width: size, height: size, animationDelay: delay }} />
      })}
    </div>
  ) : null

export const ViewIntroPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>
      ← 返回目录
    </button>
    <FadeIn>
      <h2 className="page-title">三视图：给积木拍三张照片</h2>
    </FadeIn>
    <FadeIn delay={220}>
      <div className="story-box">
        <div className="story-icon">📸</div>
        <p>一个立体积木，从不同方向看，会看到不同的“平面影子”。我们用三张“照片”来描述它。</p>
      </div>
    </FadeIn>
    <FadeIn delay={420}>
      <div className="concept-box">
        <p>
          <strong>三视图</strong>就是三张图：
        </p>
        <div className="concept-list">
          <span className="concept-item">⬆️ 上视图：从上往下看（俯视）</span>
          <span className="concept-item">⬅️ 左视图：从左边往右看</span>
          <span className="concept-item">➡️ 正视图：从正面往里看</span>
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

export const ViewRulePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>
      ← 返回目录
    </button>
    <FadeIn>
      <h2 className="page-title">核心规则：看影子只看“最外面”</h2>
    </FadeIn>
    <FadeIn delay={220}>
      <div className="loop-flow-grid">
        <div className="loop-flow-card">
          <h4>① 上视图</h4>
          <p>只要这个位置有积木，就涂一个格子。</p>
        </div>
        <div className="loop-flow-card">
          <h4>② 正视图</h4>
          <p>每一列只看“最高的那一摞”。</p>
        </div>
        <div className="loop-flow-card">
          <h4>③ 左视图</h4>
          <p>每一行只看“最高的那一摞”。</p>
        </div>
        <div className="loop-flow-card">
          <h4>④ 多想一步</h4>
          <p>三视图不一定唯一，但会限制积木摆法。</p>
        </div>
      </div>
    </FadeIn>
    <FadeIn delay={720}>
      <button className="next-btn" onClick={onNext}>
        看动画讲解 →
      </button>
    </FadeIn>
  </div>
)

export const ViewAnimationPage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const model = useMemo<HeightMap>(() => [[2, 1]], [])
  const [view, setView] = useState<ViewKind>('top')

  const top = useMemo(() => footprint(model), [model])
  const fProfile = useMemo(() => frontProfile(model), [model])
  const lProfile = useMemo(() => leftProfile(model), [model])
  const h = useMemo(() => maxHeight(model), [model])
  const front = useMemo(() => buildFilled(fProfile.length, h, fProfile), [fProfile, h])
  const left = useMemo(() => buildFilled(lProfile.length, h, lProfile), [h, lProfile])

  const highlight = useMemo(() => {
    if (view === 'top') return { r: 0, c: 0 }
    if (view === 'front') return { r: 0, c: 0 }
    return { r: 0, c: 0 }
  }, [view])

  const explain =
    view === 'top'
      ? '上视图只看“有没有占地”。两格都有积木，所以涂两个格子。'
      : view === 'front'
        ? '正视图每一列只看最高的高度：左边 2 格高，右边 1 格高。'
        : '左视图从左边看，只剩下一列：最高是 2 格高。'

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        ← 返回目录
      </button>
      <FadeIn>
        <h2 className="page-title">动画讲解：同一堆积木，三种看法</h2>
      </FadeIn>
      <FadeIn delay={220}>
        <div className="view-layout">
          <IsoCubes map={model} highlight={highlight} />
          <div className="view-picks">
            <button className={`view-pick ${view === 'top' ? 'active' : ''}`} type="button" onClick={() => setView('top')}>
              上视图
            </button>
            <button className={`view-pick ${view === 'front' ? 'active' : ''}`} type="button" onClick={() => setView('front')}>
              正视图
            </button>
            <button className={`view-pick ${view === 'left' ? 'active' : ''}`} type="button" onClick={() => setView('left')}>
              左视图
            </button>
            <div className="tip-box" style={{ marginTop: 12 }}>
              <span className="tip-icon">👀</span>
              <p>{explain}</p>
            </div>
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={440}>
        <div className="view-grid-row">
          <Grid cells={top} label="上视图" />
          <Grid cells={front} label="正视图" />
          <Grid cells={left} label="左视图" />
        </div>
      </FadeIn>
      <FadeIn delay={720}>
        <button className="next-btn" onClick={onNext}>
          看一道例题 →
        </button>
      </FadeIn>
    </div>
  )
}

export const ViewExamplePage = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const model = useMemo<HeightMap>(() => [[1, 2, 1], [0, 1, 0]], [])
  const top = useMemo(() => footprint(model), [model])
  const fProfile = useMemo(() => frontProfile(model), [model])
  const lProfile = useMemo(() => leftProfile(model), [model])
  const h = useMemo(() => maxHeight(model), [model])
  const front = useMemo(() => buildFilled(fProfile.length, h, fProfile), [fProfile, h])
  const left = useMemo(() => buildFilled(lProfile.length, h, lProfile), [h, lProfile])

  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>
        ← 返回目录
      </button>
      <FadeIn>
        <h2 className="page-title">例题：先画上视图，再补两张</h2>
      </FadeIn>
      <FadeIn delay={220}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>下面是一堆积木。请画出它的上视图、正视图和左视图。</p>
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <IsoCubes map={model} />
      </FadeIn>
      <FadeIn delay={540}>
        <div className="view-grid-row">
          <Grid cells={top} label="上视图" />
          <Grid cells={front} label="正视图" />
          <Grid cells={left} label="左视图" />
        </div>
      </FadeIn>
      <FadeIn delay={740}>
        <button className="next-btn" onClick={onNext}>
          开始练习 →
        </button>
      </FadeIn>
    </div>
  )
}

export const ViewPracticePage = ({ onBack, onHome }: { onBack: () => void; onHome: () => void }) => {
  const model = useMemo<HeightMap>(() => [[2, 1], [1, 0]], [])
  const expected = useMemo(() => footprint(model), [model])
  const [picked, setPicked] = useState(() => expected.map((row) => row.map(() => 0)))
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const toggle = (r: number, c: number) => {
    if (submitted) return
    setPicked((prev) => prev.map((row, rr) => row.map((v, cc) => (rr === r && cc === c ? (v ? 0 : 1) : v))))
  }

  const check = () => {
    const ok = picked.every((row, r) => row.every((v, c) => v === expected[r][c]))
    setSubmitted(true)
    setIsCorrect(ok)
    if (ok) {
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 2000)
    }
  }

  const reset = () => {
    setPicked(expected.map((row) => row.map(() => 0)))
    setSubmitted(false)
    setIsCorrect(false)
  }

  return (
    <div className="page">
      <Celebration show={showCelebration} />
      <button className="back-btn" onClick={onBack}>
        ← 返回目录
      </button>
      <FadeIn>
        <h2 className="page-title">练习闯关：画出上视图</h2>
      </FadeIn>
      <FadeIn delay={220}>
        <div className="example-box">
          <h3>📋 题目</h3>
          <p>看下面这堆积木，在格子里点一点，画出它的上视图（有占地就涂）。</p>
        </div>
      </FadeIn>
      <FadeIn delay={420}>
        <IsoCubes map={model} />
      </FadeIn>
      <FadeIn delay={520}>
        <div className="view-grid-row">
          <Grid cells={picked} onToggle={toggle} locked={false} label="上视图（点格子）" />
        </div>
      </FadeIn>
      <FadeIn delay={640}>
        {!submitted ? (
          <div className="practice-actions">
            <button className="submit-btn" type="button" onClick={check}>
              提交
            </button>
            <button className="nav-btn" type="button" onClick={reset}>
              重画
            </button>
            <button className="home-secondary-btn" type="button" onClick={onHome}>
              返回首页
            </button>
          </div>
        ) : (
          <div className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                🎉 画得很像！你已经会看上视图了！
                <button className="home-secondary-btn" onClick={onHome}>
                  回首页继续学
                </button>
              </>
            ) : (
              <>
                ❌ 再看看：只要这个位置有积木，就要涂一个格子。
                <div className="practice-actions">
                  <button className="retry-btn" onClick={reset}>
                    再试一次
                  </button>
                  <button className="nav-btn" onClick={() => setPicked(expected.map((row) => [...row]))}>
                    看答案
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </FadeIn>
    </div>
  )
}

