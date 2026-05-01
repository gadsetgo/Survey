import { create } from 'zustand'
import type { SurveyState, SurveyActions, SkillKey, ApiResponse } from './types'

const DEFAULT_SKILLS: SurveyState['skills'] = {
  data_pipelines: 0,
  sql_fluency: 0,
  python: 0,
  cloud_platforms: 0,
  ai_llm_tools: 0,
  data_modeling: 0,
  data_governance: 0,
  data_quality: 0,
  analytics_bi: 0,
  regulatory: 0,
  stakeholder_comms: 0,
  business_domain: 0,
  problem_framing: 0,
  mentoring: 0,
  change_management: 0,
  product_thinking: 0,
}

const INITIAL_STATE: SurveyState = {
  selectedRoles: [],
  selectedCategories: [],
  industry: null,
  seniority: null,
  yearsExperience: null,
  skillShape: null,
  leadershipActivities: [],
  skills: { ...DEFAULT_SKILLS },
  concerns: [],
  results: null,
}

export const useSurveyStore = create<SurveyState & SurveyActions>((set) => ({
  ...INITIAL_STATE,

  setSelectedRoles: (roles) => set({ selectedRoles: roles }),

  toggleRole: (role) =>
    set((s) => ({
      selectedRoles: s.selectedRoles.includes(role)
        ? s.selectedRoles.filter((r) => r !== role)
        : [...s.selectedRoles, role],
    })),

  setSelectedCategories: (cats) => set({ selectedCategories: cats }),

  setIndustry: (industry) => set({ industry }),

  setSeniority: (seniority) => set({ seniority }),

  setYearsExperience: (yearsExperience) => set({ yearsExperience }),

  setSkillShape: (skillShape) => set({ skillShape }),

  toggleLeadershipActivity: (act) =>
    set((s) => ({
      leadershipActivities: s.leadershipActivities.includes(act)
        ? s.leadershipActivities.filter((a) => a !== act)
        : [...s.leadershipActivities, act],
    })),

  setSkill: (key: SkillKey, value: number) =>
    set((s) => ({ skills: { ...s.skills, [key]: value } })),

  toggleConcern: (concern) =>
    set((s) => ({
      concerns: s.concerns.includes(concern)
        ? s.concerns.filter((c) => c !== concern)
        : [...s.concerns, concern],
    })),

  setResults: (results: ApiResponse) => set({ results }),

  reset: () => set({ ...INITIAL_STATE, skills: { ...DEFAULT_SKILLS } }),
}))
