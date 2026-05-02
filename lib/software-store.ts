import { create } from 'zustand'
import type { SoftwareSurveyState, SoftwareSurveyActions, SoftwareSkillKey, SoftwareApiResponse } from './software-types'

const DEFAULT_SKILLS: SoftwareSurveyState['skills'] = {
  languages: 0, system_design: 0, cloud_infra: 0, ai_coding: 0,
  testing: 0, security: 0, algorithms: 0, databases: 0,
  devops_ci: 0, api_design: 0, performance: 0, architecture: 0,
  code_review: 0, product_thinking: 0, communication: 0, leadership: 0,
}

const INITIAL_STATE: SoftwareSurveyState = {
  selectedRoles: [], selectedCategories: [],
  seniority: null, yearsExperience: null,
  skills: { ...DEFAULT_SKILLS },
  concerns: [], results: null,
}

export const useSoftwareSurveyStore = create<SoftwareSurveyState & SoftwareSurveyActions>((set) => ({
  ...INITIAL_STATE,

  setSelectedRoles: (roles) => set({ selectedRoles: roles }),

  toggleRole: (role) =>
    set((s) => ({
      selectedRoles: s.selectedRoles.includes(role)
        ? s.selectedRoles.filter((r) => r !== role)
        : [...s.selectedRoles, role],
    })),

  setSelectedCategories: (cats) => set({ selectedCategories: cats }),
  setSeniority: (seniority) => set({ seniority }),
  setYearsExperience: (yearsExperience) => set({ yearsExperience }),

  setSkill: (key: SoftwareSkillKey, value: number) =>
    set((s) => ({ skills: { ...s.skills, [key]: value } })),

  toggleConcern: (concern) =>
    set((s) => ({
      concerns: s.concerns.includes(concern)
        ? s.concerns.filter((c) => c !== concern)
        : [...s.concerns, concern],
    })),

  setResults: (results: SoftwareApiResponse) => set({ results }),

  reset: () => set({ ...INITIAL_STATE, skills: { ...DEFAULT_SKILLS } }),
}))
