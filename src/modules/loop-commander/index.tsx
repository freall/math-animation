import React, { useState, useEffect, useRef } from 'react';
import { PageType } from '../../types';
import { FadeIn, Bounce, Star, LessonCode, RuntimeBadge } from '../../components/animations';
import '../../App.css';

// ========== 循环指挥官模块（第11课）==========

// 页面1：概念引入 - while(true) 无限循环
export const CmdIntroPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">循环指挥官来啦！</h2></FadeIn>

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
export const CmdBreakPage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">break — 紧急停止！</h2></FadeIn>

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
export const CmdContinuePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">continue — 跳过这一次！</h2></FadeIn>

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
export const CmdComparePage = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
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
      <FadeIn><h2 className="page-title">break vs continue 大对决</h2></FadeIn>

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
export const CmdPracticePage = ({ onBack, onHome }: { onBack: () => void, onHome: () => void }) => {
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
        <h2 className="page-title">挑战练习</h2>
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
