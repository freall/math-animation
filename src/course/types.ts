export type KnowledgeDomain = 'informatics-cpp' | 'math-olympiad'

export type ModuleStage = 'L1' | 'L2' | 'L3'

export type ModuleStatus = 'planned' | 'in_progress' | 'completed'

export type LessonPageKind =
  | 'intro'
  | 'rule'
  | 'animation'
  | 'example'
  | 'practice'
  | 'challenge'

export type RewardType =
  | 'star'
  | 'badge'
  | 'medal'
  | 'streak'
  | 'unlock'

export type FutureLessonModule = {
  id: string
  domain: KnowledgeDomain
  title: string
  stage: ModuleStage
  priority: 'high' | 'medium' | 'low'
  status: ModuleStatus
  summary: string
  outcomes: string[]
  prerequisiteIds: string[]
  pageKinds: LessonPageKind[]
  rewardFocus: RewardType[]
}

export type EngineeringMilestone = {
  id: string
  title: string
  priority: 'high' | 'medium' | 'low'
  goal: string
  deliverables: string[]
}
