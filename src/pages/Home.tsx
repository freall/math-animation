import {
  ArrowLeftRight,
  ArrowUpDown,
  Blocks,
  Calculator,
  ChevronRight,
  Divide,
  Eye,
  Gamepad2,
  Lightbulb,
  MonitorSmartphone,
  Pencil,
  Plus,
  Rabbit,
  RefreshCcw,
  Repeat,
  Route,
  Ruler,
  Scale,
  ScrollText,
  Sparkles,
  Target,
  TreePine,
  Trophy,
  X,
} from 'lucide-react'
import type { PageType } from '../types'
import type { CourseModule, CourseModuleId } from '../course/registry'
import { FadeIn } from '../components/animations'

const moduleIcons: Partial<Record<CourseModuleId, typeof Target>> = {
  inclusion: Target,
  'shortest-path': Route,
  sports: Trophy,
  'chicken-rabbit': Rabbit,
  'loop-intro': Repeat,
  sorting: ArrowUpDown,
  'loop-commander': Gamepad2,
  poetry: ScrollText,
  planting: TreePine,
  'shape-matching': Blocks,
  induction: Lightbulb,
  'mul-tricks': Calculator,
  fractions: Divide,
  'segment-diagram': Ruler,
  periodic: RefreshCcw,
  kilogram: Scale,
  'score-board': Plus,
  'long-division': Divide,
  'long-multiplication': X,
  'vertical-fill': Pencil,
  'equal-substitution': ArrowLeftRight,
  'three-views': Eye,
}

type HomePageProps = {
  modules: CourseModule[]
  onSelect: (page: PageType) => void
}

const HomePage = ({ modules, onSelect }: HomePageProps) => {
  const totalLessons = modules.reduce((sum, module) => sum + module.pages.length, 0)
  const featuredModule = modules[0]

  return (
    <div className="page home-page">
      <FadeIn>
        <div className="home-nav">
          <div className="home-brand">
            <div className="home-brand-mark">
              <Sparkles size={18} />
            </div>
            <div>
              <strong>Math Animation Lab</strong>
              <span>面向孩子的动画化数学与编程课堂</span>
            </div>
          </div>
          <div className="home-nav-badge">{modules.length} 个主题 · {totalLessons} 个互动环节</div>
        </div>
      </FadeIn>

      <section className="hero-panel">
        <FadeIn delay={120}>
          <div className="hero-copy">
            <span className="hero-kicker">更现代、更专注、更适合移动端</span>
            <h1 className="main-title">把数学思维和 C++ 知识做成真正好学、好玩的互动课堂</h1>
            <p className="subtitle">
              每个主题都包含概念引入、动态图示、生活化例题和闯关练习，让孩子在观察、点击、思考中建立直觉。
            </p>
            <div className="hero-actions">
              <button className="start-btn" type="button" onClick={() => featuredModule && onSelect(featuredModule.entryPage)}>
                开始第一课
                <ChevronRight size={18} />
              </button>
              <a className="home-secondary-btn" href="#course-grid">
                浏览全部主题
                <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={220}>
          <div className="hero-side">
            <div className="hero-stat-grid">
              <div className="hero-stat-card">
                <strong>{modules.length}</strong>
                <span>主题模块</span>
              </div>
              <div className="hero-stat-card">
                <strong>{totalLessons}</strong>
                <span>动画关卡</span>
              </div>
              <div className="hero-stat-card">
                <strong>100%</strong>
                <span>手机可用</span>
              </div>
            </div>

            <div className="home-focus-strip">
              <div className="focus-item">
                <Target size={18} />
                <div>
                  <strong>目标清晰</strong>
                  <span>每课只解决一个核心问题</span>
                </div>
              </div>
              <div className="focus-item">
                <Sparkles size={18} />
                <div>
                  <strong>互动更强</strong>
                  <span>看图、点按、推理、答题一体完成</span>
                </div>
              </div>
              <div className="focus-item">
                <MonitorSmartphone size={18} />
                <div>
                  <strong>移动端友好</strong>
                  <span>更适合竖屏浏览和碎片化学习</span>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <FadeIn delay={320}>
        <section className="home-section">
          <div className="section-heading">
            <div>
              <p className="section-kicker">主题导航</p>
              <h2>按兴趣选择，也可以按路线逐步学习</h2>
            </div>
            <p>从数学思维到编程启蒙，所有模块都保留游戏化、趣味性与正反馈。</p>
          </div>

          <div className="topic-cards" id="course-grid">
            {modules.map((module) => {
              const Icon = moduleIcons[module.id] ?? Target

              return (
                <button key={module.id} className="topic-card" type="button" onClick={() => onSelect(module.entryPage)}>
                  <div className="topic-card-top">
                    <div className="topic-icon">
                      <Icon size={26} />
                    </div>
                    <span className="topic-tag">{module.category}</span>
                  </div>
                  <h3>{module.title}</h3>
                  <p>{module.description}</p>
                  <div className="topic-meta">
                    <span>{module.audience}</span>
                    <span>{module.pages.length} 个环节</span>
                  </div>
                  <div className="topic-action">
                    开始学习
                    <ChevronRight size={16} />
                  </div>
                </button>
              )
            })}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}

export default HomePage
