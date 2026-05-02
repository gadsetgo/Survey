import type { RoleDestination, RoadmapStep } from './types'
import type { SoftwareSurveyState, SoftwareApiResponse, SoftwareSkills, SoftwareSkillKey } from './software-types'
import SOFTWARE_CONSENSUS from './software-survey-consensus.json'

const DEMAND_BY_CATEGORY: Record<string, SoftwareSkills> =
  SOFTWARE_CONSENSUS as unknown as Record<string, SoftwareSkills>

export const SKILL_LABELS: Record<SoftwareSkillKey, string> = {
  languages:       'Language Proficiency',
  system_design:   'System Design',
  cloud_infra:     'Cloud & Infrastructure',
  ai_coding:       'AI-Assisted Development',
  testing:         'Testing & Quality',
  security:        'Application Security',
  algorithms:      'Algorithms & Data Structures',
  databases:       'Database Engineering',
  devops_ci:       'CI/CD & DevOps',
  api_design:      'API Design',
  performance:     'Performance Engineering',
  architecture:    'Software Architecture',
  code_review:     'Code Review & Mentorship',
  product_thinking:'Product Thinking',
  communication:   'Communication & Docs',
  leadership:      'Technical Leadership',
}

const SKILL_RESOURCES: Record<SoftwareSkillKey, string[]> = {
  languages:       ['Exercism.io practice tracks', 'Crafting Interpreters (Nystrom)', 'Language docs + official tour'],
  system_design:   ['Designing Data-Intensive Applications', 'ByteByteGo newsletter', 'High Scalability blog'],
  cloud_infra:     ['AWS Solutions Architect Associate', 'Terraform — HashiCorp Learn', 'CNCF landscape & certifications'],
  ai_coding:       ['Claude Code docs & cookbook', 'Anthropic Prompt Engineering Guide', 'Building LLM Apps (DeepLearning.AI)'],
  testing:         ['xUnit Test Patterns (Meszaros)', 'Testing JavaScript (Kent C. Dodds)', 'Google Testing Blog'],
  security:        ['OWASP Top 10 guide', 'Web Application Hacker\'s Handbook', 'SANS Security courses'],
  algorithms:      ['Competitive Programmer\'s Handbook', 'NeetCode 150 (curated)', 'Algorithm Design (Kleinberg)'],
  databases:       ['Use The Index, Luke (SQL tuning)', 'CMU Database Systems course', 'MongoDB University'],
  devops_ci:       ['The DevOps Handbook', 'GitHub Actions docs', 'Continuous Delivery (Humble & Farley)'],
  api_design:      ['API Design Patterns (Lochmann)', 'REST API Design Rulebook', 'Stripe API docs (as reference)'],
  performance:     ['High Performance Browser Networking', 'Systems Performance (Gregg)', 'Netflix Tech Blog'],
  architecture:    ['Fundamentals of Software Architecture (Richards)', 'Clean Architecture (Martin)', 'thoughtworks.com/radar'],
  code_review:     ['The Art of Readable Code', 'Google Engineering Practices Guide', 'LeadDev conference talks'],
  product_thinking:['Shape Up (Basecamp)', 'Inspired (Cagan)', 'Continuous Discovery Habits (Torres)'],
  communication:   ['Writing Is Designing (Ames)', 'The Pyramid Principle (Minto)', 'AWS Architecture blog (writing model)'],
  leadership:      ['Staff Engineer (Larson)', 'An Elegant Puzzle (Lethain)', 'LeadDev conference talks'],
}

interface DestTemplate {
  best_fit:     Omit<RoleDestination, 'type'>
  stretch:      Omit<RoleDestination, 'type'>
  long_horizon: Omit<RoleDestination, 'type'>
}

const DEST_BY_CATEGORY: Record<string, DestTemplate> = {
  FE: {
    best_fit:     { title: 'Senior Frontend Engineer',    rationale: 'Deepens your UI expertise with performance, accessibility, and design systems ownership.',      key_skills: ['languages', 'performance', 'api_design'],        categories: ['FE', 'AR'] },
    stretch:      { title: 'Full-stack Product Engineer', rationale: 'Expands frontend depth into backend and product thinking for end-to-end ownership.',            key_skills: ['system_design', 'product_thinking', 'api_design'], categories: ['FE', 'AR'] },
    long_horizon: { title: 'Frontend Architect',          rationale: 'Leads frontend platform strategy — design systems, build tooling, and cross-team standards.',   key_skills: ['architecture', 'leadership', 'code_review'],       categories: ['FE', 'PE'] },
  },
  BE: {
    best_fit:     { title: 'Senior Backend Engineer',     rationale: 'Extends your API and database expertise into distributed systems and high-scale services.',     key_skills: ['system_design', 'databases', 'api_design'],        categories: ['BE', 'PE'] },
    stretch:      { title: 'Platform / Infra Engineer',   rationale: 'Bridges backend depth with cloud-native infrastructure and developer experience.',              key_skills: ['cloud_infra', 'devops_ci', 'performance'],         categories: ['BE', 'PE'] },
    long_horizon: { title: 'Staff / Principal Engineer',  rationale: 'Evolves technical depth into org-wide architecture decisions and engineering leadership.',      key_skills: ['architecture', 'leadership', 'system_design'],     categories: ['BE', 'AR'] },
  },
  PE: {
    best_fit:     { title: 'Senior Platform / SRE',       rationale: 'Deepens your infrastructure and reliability expertise at scale across the engineering org.',   key_skills: ['cloud_infra', 'performance', 'devops_ci'],         categories: ['PE', 'BE'] },
    stretch:      { title: 'Security Engineer',           rationale: 'Extends platform knowledge into application and infrastructure security practices.',            key_skills: ['security', 'devops_ci', 'cloud_infra'],            categories: ['PE', 'AR'] },
    long_horizon: { title: 'VP / Head of Engineering',    rationale: 'Transitions platform ownership into org-wide engineering culture and strategy.',               key_skills: ['leadership', 'communication', 'architecture'],     categories: ['PE', 'AR'] },
  },
  AR: {
    best_fit:     { title: 'Software Architect',          rationale: 'Formalises your design instincts into system-wide architecture decisions and documentation.',   key_skills: ['architecture', 'system_design', 'communication'],  categories: ['AR', 'BE'] },
    stretch:      { title: 'Engineering Manager',         rationale: 'Converts technical breadth and product thinking into people and team leadership.',              key_skills: ['leadership', 'code_review', 'product_thinking'],   categories: ['AR', 'PE'] },
    long_horizon: { title: 'CTO / Technical Co-founder',  rationale: 'Your full-stack view and product instinct position you to lead technical vision at org level.', key_skills: ['leadership', 'product_thinking', 'architecture'],  categories: ['AR', 'PE'] },
  },
}

function makeStep(key: SoftwareSkillKey, band: 'quick' | 'core' | 'pivot'): RoadmapStep {
  const label = SKILL_LABELS[key]
  const resources = SKILL_RESOURCES[key]
  if (band === 'quick') return {
    title: `Close the ${label} gap`,
    detail: `Pick one focused resource and spend 2–3 hours/week for 8 weeks building working knowledge of ${label}.`,
    resources: resources.slice(0, 2),
  }
  if (band === 'core') return {
    title: `Build depth in ${label}`,
    detail: `Move beyond basics with a real project that applies ${label}. Seek peer review and iterate publicly.`,
    resources,
  }
  return {
    title: `Position yourself around ${label}`,
    detail: `By month 12, make ${label} a visible part of your profile — talks, PRs, or written posts that establish expertise.`,
    resources: resources.slice(0, 2),
  }
}

export function buildSoftwareFallbackResults(survey: SoftwareSurveyState): SoftwareApiResponse {
  const primaryCategory = survey.selectedCategories[0] ?? 'BE'
  const demand_levels: SoftwareSkills = { ...(DEMAND_BY_CATEGORY[primaryCategory] ?? DEMAND_BY_CATEGORY['BE']) }
  const skillKeys = Object.keys(demand_levels) as SoftwareSkillKey[]

  const gap_analysis = Object.fromEntries(
    skillKeys.map((key) => {
      const delta = demand_levels[key] - survey.skills[key]
      const v: 'aligned' | 'urgent_gap' | 'at_risk' =
        delta >= 2 ? 'urgent_gap' : delta === 1 ? 'at_risk' : 'aligned'
      return [key, v]
    })
  ) as Record<SoftwareSkillKey, 'aligned' | 'urgent_gap' | 'at_risk'>

  const template = DEST_BY_CATEGORY[primaryCategory] ?? DEST_BY_CATEGORY['BE']
  const role_destinations: RoleDestination[] = [
    { type: 'best_fit',     ...template.best_fit },
    { type: 'stretch',      ...template.stretch },
    { type: 'long_horizon', ...template.long_horizon },
  ]

  const rankedGapKeys = skillKeys
    .map((key) => ({ key, delta: demand_levels[key] - survey.skills[key] }))
    .filter((g) => g.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .map((g) => g.key)

  const top = rankedGapKeys.length > 0 ? rankedGapKeys : (['system_design'] as SoftwareSkillKey[])

  const skills_to_protect = skillKeys
    .filter((key) => survey.skills[key] >= 3 && demand_levels[key] >= 3)
    .map((key) => SKILL_LABELS[key])

  return {
    demand_levels,
    gap_analysis,
    role_destinations,
    roadmap: {
      quick_wins:     top.slice(0, 2).map((k) => makeStep(k, 'quick')),
      core_builds:    top.slice(0, 3).map((k) => makeStep(k, 'core')),
      pivot_enablers: top.slice(0, 2).map((k) => makeStep(k, 'pivot')),
    },
    skills_to_protect,
  }
}

export function buildSoftwareAIPrompt(survey: SoftwareSurveyState, results: SoftwareApiResponse): string {
  const roles = survey.selectedRoles.join(', ') || 'software engineer'
  const cats  = survey.selectedCategories.join(' / ') || 'BE'
  const seniority = survey.seniority ?? 'mid-level'
  const topGaps = (Object.keys(results.gap_analysis) as SoftwareSkillKey[])
    .filter((k) => results.gap_analysis[k] === 'urgent_gap')
    .map((k) => SKILL_LABELS[k])
    .slice(0, 3)
  const strengths = results.skills_to_protect.slice(0, 3)
  const dest = results.role_destinations[0]?.title ?? 'Staff Engineer'
  const destStretch = results.role_destinations[1]?.title ?? 'Engineering Manager'

  return `You are a senior technical career coach specialising in software engineering career development.

My profile:
- Current roles / focus: ${roles}
- Engineering track: ${cats} (${seniority})
- Top skill gaps (2027 demand vs current): ${topGaps.join(', ')}
- Current strengths to protect: ${strengths.join(', ')}
- Target destination (12 months): ${dest}
- Stretch goal (2–3 years): ${destStretch}

Task: Build me a personalised 12-month learning roadmap.

Requirements:
1. Structured month-by-month (or quarterly) — what to learn and what project to build
2. For each skill gap, recommend 1–2 specific, actionable resources (books, courses, repos)
3. Identify which skills AI tools can accelerate and how to use AI coding tools to close gaps faster
4. Flag which skills are AI-resistant (still require deep human expertise) and why I should prioritise them
5. Suggest 2–3 portfolio projects that would demonstrate the target skills to a hiring manager
6. Keep it practical — assume 5–8 hours/week available for deliberate practice

Output format: Structured markdown with a summary table followed by quarterly plans.`
}
