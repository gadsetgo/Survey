import type { SurveyState, ApiResponse, Skills, SkillKey, RoleDestination, RoadmapStep } from './types'
import DATA_CONSENSUS from './data-survey-consensus.json'

const DEMAND_BY_CATEGORY: Record<string, Skills> = DATA_CONSENSUS as unknown as Record<string, Skills>

const SKILL_LABELS: Record<SkillKey, string> = {
  pipelines:    'Data Pipelines',
  sql:          'Query Logic',
  python:       'Python',
  cloud:        'Cloud Platforms',
  ai_tools:     'AI / LLM Tools',
  modeling:     'Data Modeling',
  governance:   'Data Governance',
  dq:           'Data Quality',
  metadata:     'Metadata & Cataloging',
  bi_delivery:  'Analytics & BI Delivery',
  compliance:   'Regulatory / Compliance',
  domain:       'Business Domain',
  stakeholders: 'Stakeholder Communication',
  framing:      'Business Problem Framing',
  storytelling: 'Executive Storytelling',
  strategic:    'Strategic Thinking',
}

const SKILL_RESOURCES: Record<SkillKey, string[]> = {
  ai_tools:     ['fast.ai Practical AI', 'DeepLearning.AI short courses', 'Anthropic Prompt Engineering Guide'],
  pipelines:    ['dbt Learn', 'Apache Airflow docs', 'DataTalks.Club DE Zoomcamp'],
  python:       ["Python for Data Analysis (O'Reilly)", 'Kaggle Learn Python', 'Real Python tutorials'],
  cloud:        ['AWS Data Analytics Specialty', 'Google Professional Data Engineer', 'A Cloud Guru'],
  governance:   ['DAMA-DMBOK study guide', 'CDMP certification path', 'Collibra Academy'],
  stakeholders: ['Presenting Data and Information (Tufte)', 'Crucial Conversations', 'McKinsey comms frameworks'],
  framing:      ['Structured Thinking (McKinsey)', 'HBR Problem Framing', 'Minto Pyramid Principle'],
  strategic:    ['Good Strategy Bad Strategy (Rumelt)', 'HBR Strategy courses', 'Reforge Growth Series'],
  domain:       ['Domain-Driven Design (Evans)', 'industry-specific Coursera tracks', 'internal business rotations'],
  dq:           ['Great Expectations docs', 'DQMI framework (TDWI)', 'Monte Carlo data observability blog'],
  metadata:     ['DataHub documentation', 'Apache Atlas guides', 'DCAM metadata module'],
  modeling:     ['Kimball DW Toolkit', 'dbt best practices', 'Databricks Data Modeling course'],
  sql:          ['Mode SQL Tutorial', 'StrataScratch practice', 'Advanced SQL for Data Scientists'],
  bi_delivery:  ['Looker LookML docs', 'Tableau Desktop Specialist', 'Power BI DAX deep-dive'],
  compliance:   ['IAPP Privacy Fundamentals', 'GDPR practitioner guide', 'OneTrust learning hub'],
  storytelling: ['Storytelling with Data (Knaflic)', 'Cole Nussbaumer workshops', 'dataviz.tools'],
}

interface DestTemplate {
  best_fit:     Omit<RoleDestination, 'type'>
  stretch:      Omit<RoleDestination, 'type'>
  long_horizon: Omit<RoleDestination, 'type'>
}

const DEST_BY_CATEGORY: Record<string, DestTemplate> = {
  DE: {
    best_fit:     { title: 'Senior Data Engineer',        rationale: 'Directly extends your pipeline and infrastructure expertise into a leadership scope.',             key_skills: ['pipelines', 'cloud', 'python'],         categories: ['DE', 'DS'] },
    stretch:      { title: 'ML Platform Engineer',         rationale: 'Combines your data engineering foundation with emerging AI/ML deployment workflows.',              key_skills: ['ai_tools', 'pipelines', 'python'],      categories: ['DE', 'DS'] },
    long_horizon: { title: 'Head of Data Infrastructure',  rationale: 'Evolves engineering depth into org-level platform strategy and team leadership.',                  key_skills: ['strategic', 'stakeholders', 'cloud'],   categories: ['DE', 'GV'] },
  },
  AN: {
    best_fit:     { title: 'Senior Analytics Engineer',    rationale: 'Builds on your SQL and BI delivery skills with greater ownership of the semantic layer.',          key_skills: ['sql', 'bi_delivery', 'modeling'],       categories: ['AN', 'DE'] },
    stretch:      { title: 'Data Product Manager',         rationale: 'Bridges analytics fluency with product thinking to drive data-driven features end to end.',        key_skills: ['framing', 'stakeholders', 'bi_delivery'], categories: ['AN', 'GV'] },
    long_horizon: { title: 'Head of Analytics',            rationale: 'Transitions analytical depth into executive storytelling and cross-functional leadership.',        key_skills: ['strategic', 'storytelling', 'framing'], categories: ['AN', 'GV'] },
  },
  DS: {
    best_fit:     { title: 'Applied AI / ML Scientist',    rationale: 'Focuses your modelling skills on production AI systems increasingly demanded by employers.',       key_skills: ['ai_tools', 'python', 'modeling'],       categories: ['DS', 'DE'] },
    stretch:      { title: 'AI Product Scientist',         rationale: 'Pairs statistical depth with product and stakeholder skills for LLM-era product teams.',          key_skills: ['framing', 'ai_tools', 'domain'],        categories: ['DS', 'AN'] },
    long_horizon: { title: 'Chief AI Officer / AI Director', rationale: 'Leverages technical depth into org-wide AI strategy and executive leadership.',                  key_skills: ['strategic', 'stakeholders', 'governance'], categories: ['DS', 'GV'] },
  },
  GV: {
    best_fit:     { title: 'Senior Data Governance Lead',  rationale: 'Deepens your policy and stewardship expertise in an era of expanding AI regulation.',             key_skills: ['governance', 'compliance', 'metadata'],  categories: ['GV', 'AN'] },
    stretch:      { title: 'Data Governance & AI Risk Manager', rationale: 'Extends governance skills into AI model risk, bias auditing, and regulatory compliance.',   key_skills: ['compliance', 'governance', 'strategic'], categories: ['GV', 'DS'] },
    long_horizon: { title: 'Chief Data Officer',            rationale: 'Positions governance and strategy expertise at the C-suite level in a data-driven enterprise.',  key_skills: ['strategic', 'stakeholders', 'framing'],  categories: ['GV', 'DE'] },
  },
}

function makeRoadmapStep(key: SkillKey, band: 'quick' | 'core' | 'pivot'): RoadmapStep {
  const label = SKILL_LABELS[key]
  const resources = SKILL_RESOURCES[key]
  if (band === 'quick') {
    return {
      title: `Close the ${label} gap`,
      detail: `Start with one focused resource to build baseline proficiency in ${label}. Aim for 2–3 hours/week over 8 weeks to move from awareness to working knowledge.`,
      resources: resources.slice(0, 2),
    }
  }
  if (band === 'core') {
    return {
      title: `Build depth in ${label}`,
      detail: `Move beyond basics by completing a structured project that applies ${label} in your current domain context. Pair with a community or cohort for accountability.`,
      resources,
    }
  }
  return {
    title: `Position yourself around ${label}`,
    detail: `By month 12, frame your ${label} skills explicitly in your profile and contributions. This enables the strategic pivot to adjacent or leadership roles.`,
    resources: resources.slice(0, 2),
  }
}

export function buildFallbackResults(survey: SurveyState): ApiResponse {
  const primaryCategory = survey.selectedCategories[0] ?? 'AN'
  const demand_levels: Skills = { ...(DEMAND_BY_CATEGORY[primaryCategory] ?? DEMAND_BY_CATEGORY['AN']) }

  const seniority = survey.seniority ?? ''
  if (['Senior', 'Lead', 'Principal', 'Staff'].some((s) => seniority.includes(s))) {
    demand_levels.stakeholders = Math.min(5, demand_levels.stakeholders + 1)
    demand_levels.strategic    = Math.min(5, demand_levels.strategic + 1)
    demand_levels.framing      = Math.min(5, demand_levels.framing + 1)
  }

  const skillKeys = Object.keys(demand_levels) as SkillKey[]

  const gap_analysis = Object.fromEntries(
    skillKeys.map((key) => {
      const delta = demand_levels[key] - survey.skills[key]
      const v: 'aligned' | 'urgent_gap' | 'at_risk' =
        delta >= 2 ? 'urgent_gap' : delta === 1 ? 'at_risk' : 'aligned'
      return [key, v]
    })
  ) as Record<SkillKey, 'aligned' | 'urgent_gap' | 'at_risk'>

  const template = DEST_BY_CATEGORY[primaryCategory] ?? DEST_BY_CATEGORY['AN']

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

  const top = rankedGapKeys.length > 0 ? rankedGapKeys : (['ai_tools'] as SkillKey[])

  const quick_wins  = top.slice(0, 2).map((k) => makeRoadmapStep(k, 'quick'))
  const core_builds = top.slice(0, 3).map((k) => makeRoadmapStep(k, 'core'))
  const pivot_enablers = top.slice(0, 2).map((k) => makeRoadmapStep(k, 'pivot'))

  const skills_to_protect = skillKeys
    .filter((key) => survey.skills[key] >= 3 && demand_levels[key] >= 3)
    .map((key) => SKILL_LABELS[key])

  return {
    demand_levels,
    gap_analysis,
    role_destinations,
    roadmap: { quick_wins, core_builds, pivot_enablers },
    skills_to_protect,
  }
}
