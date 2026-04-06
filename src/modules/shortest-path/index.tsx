import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

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
export const SPIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">什么是标数法？</h2></FadeIn>
    
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
export const SPConceptPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">标数法步骤</h2></FadeIn>
      
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
export const SPBasicPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
  return (
    <div className="page">
      <button className="back-btn" onClick={onBack}>← 返回目录</button>
      <FadeIn><h2 className="page-title">①基础型</h2></FadeIn>
      
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
export const SPForbiddenPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">②不过某点/某区域</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>田田从家所在的 A 点去学校所在的 B 点，但途中不能经过 C 点的商店，不同的最短路线一共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        
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
export const SPMustPassPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">③必过某点/某线</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>田田从家所在的 A 点去学校所在的 B 点，但途中必须经过 C 点的牛牛家，不同的最短路线共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        
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
export const SPSpecialPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">④特殊形状</h2></FadeIn>
    
    <FadeIn delay={300}>
      <div className="example-box">
        <h3>📋 例题</h3>
        <p>丁丁从家里去乐乐老师家，路线图如下所示，最短路线一共有多少条？</p>
      </div>
    </FadeIn>
    
    <FadeIn delay={600}>
      <div className="tip-box">
        
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

export const SPPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
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
      <FadeIn><h2 className="page-title">小小练习</h2></FadeIn>
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
              
              <p>太棒了！答对了！</p>
              <p className="explanation">正确答案：{current.answer}种</p>
              {currentProblem < problems.length - 1 && (
                <button className="next-btn" onClick={nextProblem}>下一题 →</button>
              )}
            </>
          ) : (
            <>
              
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

export const SortIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">C++ 排序算法是什么？</h2></FadeIn>
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
        
        <p>在 C++ 里，排序算法经常会用到循环、比较和交换位置。</p>
      </div>
    </FadeIn>
    <FadeIn delay={1200}>
      <button className="next-btn" onClick={onNext}>认识三种排序方法 →</button>
    </FadeIn>
  </div>
)

export const SortAlgosPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">三种常见排序方法</h2></FadeIn>
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

export const SortVisualPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">代码和动画一起看排序</h2></FadeIn>
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

export const SortExamplePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => (
  <div className="page">
    <button className="back-btn" onClick={onBack}>← 返回目录</button>
    <FadeIn><h2 className="page-title">实际案例：整理分数卡片</h2></FadeIn>
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

export const SortPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
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
      <FadeIn><h2 className="page-title">排序算法小练习</h2></FadeIn>
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
