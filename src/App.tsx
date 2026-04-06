import { Home, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import './App.css'
import type { PageType } from './types'
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

type PoetryScore = {
  score: number
  total: number
}

type LessonHeaderProps = {
  currentPage: PageType
  isMobile: boolean
  onHome: () => void
  onSelectPage: (page: PageType) => void
}

const LessonHeader = ({ currentPage, isMobile, onHome, onSelectPage }: LessonHeaderProps) => {
  const pageMeta = pageMetaMap[currentPage]
  if (!pageMeta) return null

  const module = courseModuleMap[pageMeta.moduleId]

  return (
    <header className="lesson-shell">
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

  const goTo = (page: PageType) => setCurrentPage(page)
  const goHome = () => setCurrentPage('home')
  const handlePoetryFinish = (score: number, total: number) => {
    setPoetryScore({ score, total })
    setCurrentPage('poetry-result')
  }

  const pageMeta = pageMetaMap[currentPage]
  const currentModule = pageMeta ? courseModuleMap[pageMeta.moduleId] : null
  const progressPages = currentModule?.pages ?? []

  const renderers = {
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
  } satisfies Record<PageType, () => ReactNode>

  return (
    <div className="app-shell">
      <div className="app-shell__glow app-shell__glow--primary" />
      <div className="app-shell__glow app-shell__glow--secondary" />

      {currentModule ? (
        <LessonHeader currentPage={currentPage} isMobile={isMobile} onHome={goHome} onSelectPage={goTo} />
      ) : null}

      <main className={`app ${currentPage === 'home' ? 'app-home' : 'app-lesson'}`}>{renderers[currentPage]()}</main>

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
