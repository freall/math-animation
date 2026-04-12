import { Home, Sparkles } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import type { BuiltinPageType, PageType } from './types'
import { courseModuleMap, courseModules, pageMetaMap } from './course/registry'
import { useIsMobile } from './hooks/use-mobile'
import HomePage from './pages/Home'
import {
  IntroPage as InclusionIntroPage,
  PracticePage as InclusionPracticePage,
  ThreeSetPage,
  TwoSetPage,
  VennPage,
} from './modules/inclusion'
import {
  SPBasicPage,
  SPConceptPage,
  SPForbiddenPage,
  SPIntroPage,
  SPMustPassPage,
  SPPracticePage,
  SPSpecialPage,
} from './modules/shortest-path'
import {
  SportEliminationPage,
  SportGraphPage,
  SportIntroPage,
  SportPracticePage,
  SportRoundPage,
  SportScorePage,
} from './modules/sports'
import {
  CoopBasicPage,
  CoopIntroPage,
  CoopPracticePage,
  CoopReversePage,
  CoopUnknownPage,
} from './modules/chicken-rabbit'
import {
  LoopExamplePage,
  LoopIntroPage,
  LoopPracticePage,
  LoopProcessPage,
  LoopSyntaxPage,
} from './modules/loop-intro'
import {
  SortAlgosPage,
  SortExamplePage,
  SortIntroPage,
  SortPracticePage,
  SortVisualPage,
} from './modules/sorting'
import { CmdBreakPage, CmdComparePage, CmdContinuePage, CmdIntroPage, CmdPracticePage } from './modules/loop-commander'
import { PoetryIntroPage, PoetryQuizPage, PoetryResultPage } from './modules/poetry'
import {
  PlantingAnimationPage,
  PlantingExamplePage,
  PlantingIntroPage,
  PlantingPracticePage,
  PlantingRulePage,
} from './modules/planting'
import { ShapeAnimationPage, ShapeExamplePage, ShapeIntroPage, ShapePracticePage, ShapeRulePage } from './modules/shape-matching'
import {
  InductionAnimationPage,
  InductionExamplePage,
  InductionIntroPage,
  InductionPracticePage,
  InductionRulePage,
} from './modules/induction'
import { FractionAnimationPage, FractionExamplePage, FractionIntroPage, FractionPracticePage, FractionRulePage } from './modules/fractions'
import { KiloAnimationPage, KiloExamplePage, KiloIntroPage, KiloPracticePage, KiloRulePage } from './modules/kilogram'
import { MulAnimationPage, MulExamplePage, MulIntroPage, MulPracticePage, MulRulePage } from './modules/mul-tricks'
import {
  PeriodAnimationPage,
  PeriodExamplePage,
  PeriodIntroPage,
  PeriodPracticePage,
  PeriodRulePage,
} from './modules/periodic'
import {
  SegmentAnimationPage,
  SegmentExamplePage,
  SegmentIntroPage,
  SegmentPracticePage,
  SegmentRulePage,
} from './modules/segment-diagram'
import { ScoreAnimationPage, ScoreExamplePage, ScoreIntroPage, ScorePracticePage, ScoreRulePage } from './modules/score-board'
import { DivAnimationPage, DivExamplePage, DivIntroPage, DivPracticePage, DivRulePage } from './modules/long-division'
import { MultAnimationPage, MultExamplePage, MultIntroPage, MultPracticePage, MultRulePage } from './modules/long-multiplication'
import { FillAnimationPage, FillExamplePage, FillIntroPage, FillPracticePage, FillRulePage } from './modules/vertical-fill'

type PoetryScore = {
  score: number
  total: number
}

type LessonHeaderProps = {
  currentPage: PageType
  isMobile: boolean
  containerRef: React.RefObject<HTMLElement | null>
  onHome: () => void
  onSelectPage: (page: PageType) => void
}

const LessonHeader = ({ currentPage, isMobile, containerRef, onHome, onSelectPage }: LessonHeaderProps) => {
  const pageMeta = pageMetaMap[currentPage]
  if (!pageMeta) return null

  const module = courseModuleMap[pageMeta.moduleId]

  return (
    <header ref={containerRef} className="lesson-shell">
      <div className="lesson-shell-top">
        <button className="lesson-shell-home" type="button" onClick={onHome}>
          <Home size={16} />
          <span>{isMobile ? '首页' : '返回首页'}</span>
        </button>

        <div className="lesson-shell-copy">
          <span className="lesson-shell-eyebrow">{module.category}</span>
          <strong className="lesson-shell-title">{module.title}</strong>
          <p className="lesson-shell-subtitle">{module.subtitle}</p>
        </div>

        <div className="lesson-shell-summary">
          <Sparkles size={16} />
          <div>
            <strong>
              {pageMeta.index + 1}/{module.pages.length}
            </strong>
            <span>{pageMeta.label}</span>
          </div>
        </div>
      </div>

      <div className="lesson-shell-steps">
        {module.pages.map((page, index) => (
          <button
            key={page.id}
            className={`lesson-step ${page.id === currentPage ? 'active' : ''}`}
            type="button"
            onClick={() => onSelectPage(page.id)}
          >
            <span className="lesson-step-index">{index + 1}</span>
            {!isMobile ? <span className="lesson-step-label">{page.shortLabel ?? page.label}</span> : null}
          </button>
        ))}
      </div>
    </header>
  )
}

function App() {
  const isMobile = useIsMobile()
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [poetryScore, setPoetryScore] = useState<PoetryScore>({ score: 0, total: 0 })
  const lessonHeaderRef = useRef<HTMLElement | null>(null)

  const goTo = (page: PageType) => setCurrentPage(page)
  const goHome = () => setCurrentPage('home')
  const handlePoetryFinish = (score: number, total: number) => {
    setPoetryScore({ score, total })
    setCurrentPage('poetry-result')
  }

  const pageMeta = pageMetaMap[currentPage]
  const currentModule = pageMeta ? courseModuleMap[pageMeta.moduleId] : null
  const progressPages = currentModule?.pages ?? []

  useLayoutEffect(() => {
    const el = lessonHeaderRef.current
    if (!currentModule || !el) {
      document.documentElement.style.removeProperty('--lesson-shell-bottom')
      return
    }

    const update = () => {
      const rect = el.getBoundingClientRect()
      document.documentElement.style.setProperty('--lesson-shell-bottom', `${Math.ceil(rect.bottom)}px`)
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [currentModule, currentPage])

  const builtInRenderers: Partial<Record<BuiltinPageType, () => ReactNode>> = {
    home: () => <HomePage modules={courseModules} onSelect={goTo} />,
    intro: () => <InclusionIntroPage onNext={() => goTo('venn')} onBack={goHome} />,
    venn: () => <VennPage onNext={() => goTo('two-set')} onBack={goHome} />,
    'two-set': () => <TwoSetPage onNext={() => goTo('three-set')} onBack={goHome} />,
    'three-set': () => <ThreeSetPage onNext={() => goTo('practice')} onBack={goHome} />,
    practice: () => <InclusionPracticePage onBack={goHome} onHome={goHome} />,
    'sp-intro': () => <SPIntroPage onNext={() => goTo('sp-concept')} onBack={goHome} />,
    'sp-concept': () => <SPConceptPage onNext={() => goTo('sp-basic')} onBack={goHome} />,
    'sp-basic': () => <SPBasicPage onNext={() => goTo('sp-forbidden')} onBack={goHome} />,
    'sp-forbidden': () => <SPForbiddenPage onNext={() => goTo('sp-mustpass')} onBack={goHome} />,
    'sp-mustpass': () => <SPMustPassPage onNext={() => goTo('sp-special')} onBack={goHome} />,
    'sp-special': () => <SPSpecialPage onNext={() => goTo('sp-practice')} onBack={goHome} />,
    'sp-practice': () => <SPPracticePage onBack={goHome} onHome={goHome} />,
    'sport-intro': () => <SportIntroPage onNext={() => goTo('sport-elimination')} onBack={goHome} />,
    'sport-elimination': () => <SportEliminationPage onNext={() => goTo('sport-round')} onBack={goHome} />,
    'sport-round': () => <SportRoundPage onNext={() => goTo('sport-graph')} onBack={goHome} />,
    'sport-graph': () => <SportGraphPage onNext={() => goTo('sport-score')} onBack={goHome} />,
    'sport-score': () => <SportScorePage onNext={() => goTo('sport-practice')} onBack={goHome} />,
    'sport-practice': () => <SportPracticePage onBack={goHome} onHome={goHome} />,
    'chicken-intro': () => <CoopIntroPage onNext={() => goTo('chicken-basic')} onBack={goHome} />,
    'chicken-basic': () => <CoopBasicPage onNext={() => goTo('chicken-unknown')} onBack={goHome} />,
    'chicken-unknown': () => <CoopUnknownPage onNext={() => goTo('chicken-reverse')} onBack={goHome} />,
    'chicken-reverse': () => <CoopReversePage onNext={() => goTo('chicken-practice')} onBack={goHome} />,
    'chicken-practice': () => <CoopPracticePage onBack={goHome} onHome={goHome} />,
    'loop-intro': () => <LoopIntroPage onNext={() => goTo('loop-syntax')} onBack={goHome} />,
    'loop-syntax': () => <LoopSyntaxPage onNext={() => goTo('loop-process')} onBack={goHome} />,
    'loop-process': () => <LoopProcessPage onNext={() => goTo('loop-example')} onBack={goHome} />,
    'loop-example': () => <LoopExamplePage onNext={() => goTo('loop-practice')} onBack={goHome} />,
    'loop-practice': () => <LoopPracticePage onBack={goHome} onHome={goHome} />,
    'sort-intro': () => <SortIntroPage onNext={() => goTo('sort-algos')} onBack={goHome} />,
    'sort-algos': () => <SortAlgosPage onNext={() => goTo('sort-visual')} onBack={goHome} />,
    'sort-visual': () => <SortVisualPage onNext={() => goTo('sort-example')} onBack={goHome} />,
    'sort-example': () => <SortExamplePage onNext={() => goTo('sort-practice')} onBack={goHome} />,
    'sort-practice': () => <SortPracticePage onBack={goHome} onHome={goHome} />,
    'cmd-intro': () => <CmdIntroPage onNext={() => goTo('cmd-break')} onBack={goHome} />,
    'cmd-break': () => <CmdBreakPage onNext={() => goTo('cmd-continue')} onBack={goHome} />,
    'cmd-continue': () => <CmdContinuePage onNext={() => goTo('cmd-compare')} onBack={goHome} />,
    'cmd-compare': () => <CmdComparePage onNext={() => goTo('cmd-practice')} onBack={goHome} />,
    'cmd-practice': () => <CmdPracticePage onBack={goHome} onHome={goHome} />,
    'poetry-intro': () => <PoetryIntroPage onNext={() => goTo('poetry-quiz')} onBack={goHome} />,
    'poetry-quiz': () => <PoetryQuizPage onFinish={handlePoetryFinish} onBack={goHome} />,
    'poetry-result': () => (
      <PoetryResultPage
        score={poetryScore.score}
        total={poetryScore.total}
        onRetry={() => goTo('poetry-quiz')}
        onHome={goHome}
      />
    ),
    'planting-intro': () => <PlantingIntroPage onNext={() => goTo('planting-rule')} onBack={goHome} />,
    'planting-rule': () => <PlantingRulePage onNext={() => goTo('planting-animation')} onBack={goHome} />,
    'planting-animation': () => <PlantingAnimationPage onNext={() => goTo('planting-example')} onBack={goHome} />,
    'planting-example': () => <PlantingExamplePage onNext={() => goTo('planting-practice')} onBack={goHome} />,
    'planting-practice': () => <PlantingPracticePage onBack={goHome} onHome={goHome} />,
    'shape-intro': () => <ShapeIntroPage onNext={() => goTo('shape-rule')} onBack={goHome} />,
    'shape-rule': () => <ShapeRulePage onNext={() => goTo('shape-animation')} onBack={goHome} />,
    'shape-animation': () => <ShapeAnimationPage onNext={() => goTo('shape-example')} onBack={goHome} />,
    'shape-example': () => <ShapeExamplePage onNext={() => goTo('shape-practice')} onBack={goHome} />,
    'shape-practice': () => <ShapePracticePage onBack={goHome} onHome={goHome} />,
    'induction-intro': () => <InductionIntroPage onNext={() => goTo('induction-rule')} onBack={goHome} />,
    'induction-rule': () => <InductionRulePage onNext={() => goTo('induction-animation')} onBack={goHome} />,
    'induction-animation': () => <InductionAnimationPage onNext={() => goTo('induction-example')} onBack={goHome} />,
    'induction-example': () => <InductionExamplePage onNext={() => goTo('induction-practice')} onBack={goHome} />,
    'induction-practice': () => <InductionPracticePage onBack={goHome} onHome={goHome} />,
    'mul-intro': () => <MulIntroPage onNext={() => goTo('mul-rule')} onBack={goHome} />,
    'mul-rule': () => <MulRulePage onNext={() => goTo('mul-animation')} onBack={goHome} />,
    'mul-animation': () => <MulAnimationPage onNext={() => goTo('mul-example')} onBack={goHome} />,
    'mul-example': () => <MulExamplePage onNext={() => goTo('mul-practice')} onBack={goHome} />,
    'mul-practice': () => <MulPracticePage onBack={goHome} onHome={goHome} />,
    'fraction-intro': () => <FractionIntroPage onNext={() => goTo('fraction-rule')} onBack={goHome} />,
    'fraction-rule': () => <FractionRulePage onNext={() => goTo('fraction-animation')} onBack={goHome} />,
    'fraction-animation': () => <FractionAnimationPage onNext={() => goTo('fraction-example')} onBack={goHome} />,
    'fraction-example': () => <FractionExamplePage onNext={() => goTo('fraction-practice')} onBack={goHome} />,
    'fraction-practice': () => <FractionPracticePage onBack={goHome} onHome={goHome} />,
    'segment-intro': () => <SegmentIntroPage onNext={() => goTo('segment-rule')} onBack={goHome} />,
    'segment-rule': () => <SegmentRulePage onNext={() => goTo('segment-animation')} onBack={goHome} />,
    'segment-animation': () => <SegmentAnimationPage onNext={() => goTo('segment-example')} onBack={goHome} />,
    'segment-example': () => <SegmentExamplePage onNext={() => goTo('segment-practice')} onBack={goHome} />,
    'segment-practice': () => <SegmentPracticePage onBack={goHome} onHome={goHome} />,
    'period-intro': () => <PeriodIntroPage onNext={() => goTo('period-rule')} onBack={goHome} />,
    'period-rule': () => <PeriodRulePage onNext={() => goTo('period-animation')} onBack={goHome} />,
    'period-animation': () => <PeriodAnimationPage onNext={() => goTo('period-example')} onBack={goHome} />,
    'period-example': () => <PeriodExamplePage onNext={() => goTo('period-practice')} onBack={goHome} />,
    'period-practice': () => <PeriodPracticePage onBack={goHome} onHome={goHome} />,
    'kilo-intro': () => <KiloIntroPage onNext={() => goTo('kilo-rule')} onBack={goHome} />,
    'kilo-rule': () => <KiloRulePage onNext={() => goTo('kilo-animation')} onBack={goHome} />,
    'kilo-animation': () => <KiloAnimationPage onNext={() => goTo('kilo-example')} onBack={goHome} />,
    'kilo-example': () => <KiloExamplePage onNext={() => goTo('kilo-practice')} onBack={goHome} />,
    'kilo-practice': () => <KiloPracticePage onBack={goHome} onHome={goHome} />,
    'score-intro': () => <ScoreIntroPage onNext={() => goTo('score-rule')} onBack={goHome} />,
    'score-rule': () => <ScoreRulePage onNext={() => goTo('score-animation')} onBack={goHome} />,
    'score-animation': () => <ScoreAnimationPage onNext={() => goTo('score-example')} onBack={goHome} />,
    'score-example': () => <ScoreExamplePage onNext={() => goTo('score-practice')} onBack={goHome} />,
    'score-practice': () => <ScorePracticePage onBack={goHome} onHome={goHome} />,
    'div-intro': () => <DivIntroPage onNext={() => goTo('div-rule')} onBack={goHome} />,
    'div-rule': () => <DivRulePage onNext={() => goTo('div-animation')} onBack={goHome} />,
    'div-animation': () => <DivAnimationPage onNext={() => goTo('div-example')} onBack={goHome} />,
    'div-example': () => <DivExamplePage onNext={() => goTo('div-practice')} onBack={goHome} />,
    'div-practice': () => <DivPracticePage onBack={goHome} onHome={goHome} />,
    'mult-intro': () => <MultIntroPage onNext={() => goTo('mult-rule')} onBack={goHome} />,
    'mult-rule': () => <MultRulePage onNext={() => goTo('mult-animation')} onBack={goHome} />,
    'mult-animation': () => <MultAnimationPage onNext={() => goTo('mult-example')} onBack={goHome} />,
    'mult-example': () => <MultExamplePage onNext={() => goTo('mult-practice')} onBack={goHome} />,
    'mult-practice': () => <MultPracticePage onBack={goHome} onHome={goHome} />,
    'fill-intro': () => <FillIntroPage onNext={() => goTo('fill-rule')} onBack={goHome} />,
    'fill-rule': () => <FillRulePage onNext={() => goTo('fill-animation')} onBack={goHome} />,
    'fill-animation': () => <FillAnimationPage onNext={() => goTo('fill-example')} onBack={goHome} />,
    'fill-example': () => <FillExamplePage onNext={() => goTo('fill-practice')} onBack={goHome} />,
    'fill-practice': () => <FillPracticePage onBack={goHome} onHome={goHome} />,
  }

  const renderCurrentPage = () => {
    const renderer = builtInRenderers[currentPage as BuiltinPageType]
    if (!renderer) {
      return (
        <div className="page">
          <h2 className="page-title">页面不存在</h2>
          <button className="start-btn" type="button" onClick={goHome}>
            返回首页
          </button>
        </div>
      )
    }

    return renderer()
  }

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--primary" />
      <div className="app-shell__glow app-shell__glow--secondary" />

      {currentModule ? (
        <LessonHeader
          currentPage={currentPage}
          isMobile={isMobile}
          containerRef={lessonHeaderRef}
          onHome={goHome}
          onSelectPage={goTo}
        />
      ) : null}

      <main className={`app ${currentPage === 'home' ? 'app-home' : 'app-lesson'}`}>{renderCurrentPage()}</main>

      {currentModule ? (
        <div className="progress-bar">
          <button className="progress-home-btn" type="button" onClick={goHome} aria-label="返回首页">
            <Home size={16} />
          </button>
          {progressPages.map((page) => {
            const isActive = page.id === currentPage

            return (
              <button
                key={page.id}
                className={`progress-step ${isActive ? 'active' : ''}`}
                type="button"
                onClick={() => goTo(page.id)}
                aria-label={page.label}
              >
                <span className="progress-dot" />
                {!isMobile ? <span className="progress-text">{page.shortLabel ?? page.label}</span> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default App
