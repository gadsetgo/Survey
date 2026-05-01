export interface Skills {
  // Technical
  pipelines: number
  sql: number
  python: number
  cloud: number
  ai_tools: number
  modeling: number
  // Domain & Functional
  governance: number
  dq: number
  metadata: number
  bi_delivery: number
  compliance: number
  domain: number
  // Soft & Cross-functional
  stakeholders: number
  framing: number
  storytelling: number
  strategic: number
}

export type SkillKey = keyof Skills

export interface RoleDestination {
  type: 'best_fit' | 'stretch' | 'long_horizon'
  title: string
  rationale: string
  key_skills: string[]
  categories?: string[]  // e.g. ['AN', 'GV'] for mini-Venn
}

export interface RoadmapStep {
  title: string
  detail: string
  resources: string[]
}

export interface Roadmap {
  quick_wins: RoadmapStep[]
  core_builds: RoadmapStep[]
  pivot_enablers: RoadmapStep[]
}

export interface ApiResponse {
  demand_levels: Skills
  gap_analysis: Record<SkillKey, 'aligned' | 'urgent_gap' | 'at_risk'>
  role_destinations: RoleDestination[]
  roadmap: Roadmap
  skills_to_protect: string[]
}

export interface SurveyState {
  // Screen 1 — Role selection
  selectedRoles: string[]
  selectedCategories: string[]
  industry: string | null

  // Screen 2 — Career shape
  seniority: string | null
  yearsExperience: string | null
  skillShape: string | null
  leadershipActivities: string[]

  // Screen 3 — Skills rating
  skills: Skills
  concerns: string[]

  // Results
  results: ApiResponse | null
}

export type SurveyActions = {
  setSelectedRoles: (roles: string[]) => void
  toggleRole: (role: string) => void
  setSelectedCategories: (cats: string[]) => void
  setIndustry: (industry: string | null) => void
  setSeniority: (s: string | null) => void
  setYearsExperience: (y: string | null) => void
  setSkillShape: (shape: string | null) => void
  toggleLeadershipActivity: (act: string) => void
  setSkill: (key: SkillKey, value: number) => void
  toggleConcern: (concern: string) => void
  setResults: (r: ApiResponse) => void
  reset: () => void
}
