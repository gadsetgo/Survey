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
    best_fit:     { title: 'UI Systems Engineer',                    rationale: 'Shifts from writing components to governing AI-generated UI — design systems, tokens, and accessibility. Tools like v0/Bolt change the FE job from builder to reviewer.',                                                                                        key_skills: ['performance', 'product_thinking', 'code_review'],    categories: ['FE', 'AR'] },
    stretch:      { title: 'Product Engineer',                       rationale: 'The frontend/backend boundary is collapsing. FE engineers who add backend fluency and product ownership ship features end-to-end — the fastest-emerging archetype at AI-native startups.',                                                                         key_skills: ['system_design', 'product_thinking', 'api_design'],   categories: ['FE', 'AR'] },
    long_horizon: { title: 'Principal Product Experience Architect', rationale: 'When AI generates most UI, the human premium is defining how agentic interfaces feel. This role converges design, engineering, and AI product thinking at org level.',                                                                                           key_skills: ['architecture', 'leadership', 'communication'],       categories: ['FE', 'PE'] },
  },
  BE: {
    best_fit:     { title: 'API Systems Engineer',                   rationale: 'MCP hit 97M monthly SDK downloads in 2026 — every BE must design MCP servers, the new plumbing of agent systems. Value shifts from CRUD to agentic API governance.',                                                                                            key_skills: ['api_design', 'system_design', 'security'],           categories: ['BE', 'PE'] },
    stretch:      { title: 'Agentic Systems Architect',              rationale: 'With AI handling most business logic, the stretch move is designing multi-agent workflows — memory hierarchies, sandboxed execution, and inter-agent communication.',                                                                                              key_skills: ['architecture', 'cloud_infra', 'performance'],        categories: ['BE', 'AR'] },
    long_horizon: { title: 'Principal Software Architect',           rationale: 'If AI agents implement features from specs, the Principal Architect defines what gets built — system boundaries, reliability contracts, and org-wide AI delivery governance.',                                                                                    key_skills: ['architecture', 'leadership', 'system_design'],       categories: ['BE', 'AR'] },
  },
  PE: {
    best_fit:     { title: 'AI-Ready Platform / IDP Engineer',       rationale: '76% of DevOps teams integrated AI into CI/CD by 2025. The PE who builds AI-aware Internal Developer Platforms with intelligent guardrails and AI-assisted incident response is the 2026 benchmark.',                                                             key_skills: ['cloud_infra', 'devops_ci', 'security'],              categories: ['PE', 'BE'] },
    stretch:      { title: 'AI Platform Lead / MLOps Engineer',      rationale: 'As AI agents become first-class SDLC citizens, the PE who understands model deployment, GPU resource management, and LLMOps owns the infrastructure running both apps and AI workloads.',                                                                         key_skills: ['performance', 'devops_ci', 'architecture'],          categories: ['PE', 'ML'] },
    long_horizon: { title: 'VP of Platform Engineering',             rationale: 'Elite DevOps teams using AI deploy 973× more frequently than low performers (State of DevOps 2025). The senior PE sets org-wide delivery philosophy: SLOs, AI guardrails, cost governance.',                                                                     key_skills: ['leadership', 'communication', 'architecture'],       categories: ['PE', 'AR'] },
  },
  AR: {
    best_fit:     { title: 'Software Architect',                     rationale: 'AI agents implement features — architects define the system boundaries those agents work within. Architecture judgment becomes the scarcest skill as AI handles more implementation.',                                                                              key_skills: ['architecture', 'system_design', 'communication'],    categories: ['AR', 'BE'] },
    stretch:      { title: 'Engineering Manager',                    rationale: 'Technical breadth plus product thinking maps naturally to people leadership. As AI raises floor productivity, managing and growing engineers is the highest-leverage human contribution.',                                                                          key_skills: ['leadership', 'code_review', 'product_thinking'],     categories: ['AR', 'PE'] },
    long_horizon: { title: 'CTO / Technical Co-founder',             rationale: 'With AI handling most implementation, the full-stack view, product instinct, and architecture judgment you have position you to lead technical vision for an AI-native company.',                                                                                  key_skills: ['leadership', 'product_thinking', 'architecture'],    categories: ['AR', 'PE'] },
  },
  ML: {
    best_fit:     { title: 'LLMOps Engineer / AI Application Engineer', rationale: 'LinkedIn names AI Engineer the fastest-growing job two years running. LLMOps specialists earn 30–50% above standard senior developers. Value is in RAG pipelines, fine-tuning, and inference optimisation — not AutoML.',                                    key_skills: ['ai_coding', 'performance', 'cloud_infra'],           categories: ['ML', 'PE'] },
    stretch:      { title: 'AI Systems Architect',                   rationale: 'As LLM APIs commoditise, the premium shifts to multi-agent systems — model selection, orchestration, memory, tool use, and evaluation frameworks. Gartner: 40% of enterprise apps will include AI agents by end of 2026.',                                        key_skills: ['architecture', 'system_design', 'product_thinking'], categories: ['ML', 'AR'] },
    long_horizon: { title: 'Principal AI Scientist / AI Research Engineer', rationale: 'Stanford HAI: AI research investment hit $581.7B globally in 2025, +130%. When commodity models handle standard tasks, the premium moves to frontier work — custom architectures and research defining what AI can do next.',                             key_skills: ['algorithms', 'architecture', 'communication'],       categories: ['ML', 'AR'] },
  },
  QA: {
    best_fit:     { title: 'AI Quality Engineer',                    rationale: 'AI tools now generate test cases from specs autonomously. Senior QA professionals prioritising strategy earn a +10.6% income premium; those in pure execution face −13.8% (talent500 2026). The role shifts from test writing to test governance.',              key_skills: ['testing', 'ai_coding', 'product_thinking'],          categories: ['QA', 'BE'] },
    stretch:      { title: 'AI Safety Tester / Quality Architect',   rationale: 'Gartner: citizen development will increase software defects by 2500% by 2028. 48% of AI-generated code contains security flaws. QA engineers who specialise in red-teaming LLMs and adversarial prompt testing fill a gap no other role addresses.',            key_skills: ['security', 'testing', 'communication'],              categories: ['QA', 'PE'] },
    long_horizon: { title: 'Head of Quality Intelligence',           rationale: 'When autonomous testing handles regression, the senior QA role defines what "quality" means for AI-generated systems — reliability standards for autonomous agents and governance of QA at enterprise scale.',                                                     key_skills: ['leadership', 'architecture', 'product_thinking'],    categories: ['QA', 'AR'] },
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

  const seniority = survey.seniority ?? ''
  if (['Senior', 'Lead', 'Principal', 'Staff'].some((s) => seniority.includes(s))) {
    demand_levels.leadership    = Math.min(5, demand_levels.leadership + 1)
    demand_levels.communication = Math.min(5, demand_levels.communication + 1)
    demand_levels.code_review   = Math.min(5, demand_levels.code_review + 1)
  }

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

const LEVEL_DESC = ['no exposure', 'beginner', 'some experience', 'proficient', 'advanced', 'expert']

const SW_SKILL_KEYS = Object.keys(SKILL_LABELS) as SoftwareSkillKey[]

export function buildSoftwareAIPrompt(survey: SoftwareSurveyState, results: SoftwareApiResponse): string {
  const roles = survey.selectedRoles.join(', ') || 'software engineer'
  const cats  = survey.selectedCategories.join(' / ') || 'BE'
  const seniority = survey.seniority ?? 'mid-level'
  const dest = results.role_destinations[0]?.title ?? 'Staff Engineer'
  const destStretch = results.role_destinations[1]?.title ?? 'Engineering Manager'
  const concerns = survey.concerns?.join(', ') || 'none specified'

  const urgentGaps = SW_SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'urgent_gap')
  const atRiskKeys = SW_SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'at_risk')
  const alignedKeys = SW_SKILL_KEYS.filter((k) => results.gap_analysis[k] === 'aligned')

  const formatSkill = (k: SoftwareSkillKey) => {
    const cur = survey.skills[k], dem = results.demand_levels[k]
    const gap = dem - cur
    return `  - ${SKILL_LABELS[k]}: currently ${cur}/5 (${LEVEL_DESC[cur]}) → need ${dem}/5 (${LEVEL_DESC[dem]})${gap > 0 ? ` — gap: +${gap}` : ' — at target'}`
  }

  const urgentBlock = urgentGaps.length ? urgentGaps.map(formatSkill).join('\n') : '  (none)'
  const atRiskBlock = atRiskKeys.length  ? atRiskKeys.map(formatSkill).join('\n')  : '  (none)'
  const alignedBlock = alignedKeys.length ? alignedKeys.map(formatSkill).join('\n') : '  (none)'

  return `You are a senior technical career coach using 2025–2027 labour market research (WEF Future of Jobs 2025, LinkedIn Jobs on the Rise 2026, Stanford HAI AI Index 2026, GitHub Octoverse 2025, Stack Overflow Developer Survey 2025).

My profile:
- Current roles / focus: ${roles}
- Engineering track: ${cats} (${seniority})
- Target destination (12 months): ${dest}
- Stretch goal (2–3 years): ${destStretch}
- What I'm concerned about: ${concerns}

My skill inventory (scale 1–5: 1=beginner, 3=proficient, 5=expert):

URGENT GAPS — close these before 2027:
${urgentBlock}

AT RISK — need maintenance or moderate uplift:
${atRiskBlock}

ALREADY ALIGNED — protect and leverage these:
${alignedBlock}

IMPORTANT CALIBRATION: When recommending learning resources or plans for any skill, always match the content difficulty to my CURRENT level for that skill. If I am already at level 4 on a skill and only need level 5, do NOT recommend beginner resources — assume I have the foundations and focus on advanced techniques, edge cases, or production-grade practices. Only recommend foundational content for skills where I am at level 1–2.

Task: Build me a personalised 12-month skill development roadmap grounded in the research above.

Requirements:
1. Month-by-month plan (or quarterly) — what to learn and what project to build each period, calibrated to my existing level per skill
2. For each gap skill, recommend 2 specific resources (book, course, or repo) appropriate to my current level — include URLs where possible
3. Identify which gaps AI coding tools (GitHub Copilot, Claude, Cursor) can close faster — and exactly how to use them given my current proficiency
4. Flag which skills are AI-resistant (still require deep human expertise) and cite why they remain high-value per the research
5. Suggest 2–3 portfolio projects that signal these skills to a hiring manager in ${cats} roles
6. Assume 5–8 hours/week available for deliberate practice; be realistic about what's achievable

Cite data sources (WEF, LinkedIn, GitHub Octoverse, etc.) where relevant. Output as structured markdown with a summary table followed by quarterly plans.`
}
