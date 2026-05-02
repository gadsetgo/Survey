import type { RoleDestination, Roadmap } from './types'

export interface SoftwareSkills {
  languages:       number
  system_design:   number
  cloud_infra:     number
  ai_coding:       number
  testing:         number
  security:        number
  algorithms:      number
  databases:       number
  devops_ci:       number
  api_design:      number
  performance:     number
  architecture:    number
  code_review:     number
  product_thinking:number
  communication:   number
  leadership:      number
}

export type SoftwareSkillKey = keyof SoftwareSkills

export interface SoftwareApiResponse {
  demand_levels:   SoftwareSkills
  gap_analysis:    Record<SoftwareSkillKey, 'aligned' | 'urgent_gap' | 'at_risk'>
  role_destinations: RoleDestination[]
  roadmap:         Roadmap
  skills_to_protect: string[]
}

export interface SoftwareSurveyState {
  selectedRoles:      string[]
  selectedCategories: string[]
  seniority:          string | null
  yearsExperience:    string | null
  skills:             SoftwareSkills
  concerns:           string[]
  results:            SoftwareApiResponse | null
}

export type SoftwareSurveyActions = {
  setSelectedRoles:      (roles: string[]) => void
  toggleRole:            (role: string) => void
  setSelectedCategories: (cats: string[]) => void
  setSeniority:          (s: string | null) => void
  setYearsExperience:    (y: string | null) => void
  setSkill:              (key: SoftwareSkillKey, value: number) => void
  toggleConcern:         (concern: string) => void
  setResults:            (r: SoftwareApiResponse) => void
  reset:                 () => void
}
