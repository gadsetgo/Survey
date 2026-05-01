import type { SurveyState } from './types'

export function buildPrompt(s: SurveyState): string {
  const technical = {
    'Data pipelines / ETL': s.skills.data_pipelines,
    'SQL & query fluency': s.skills.sql_fluency,
    'Python / scripting': s.skills.python,
    'Cloud platforms': s.skills.cloud_platforms,
    'AI / LLM tools': s.skills.ai_llm_tools,
    'Data modeling': s.skills.data_modeling,
  }

  const domain = {
    'Data governance / policy': s.skills.data_governance,
    'Data quality frameworks': s.skills.data_quality,
    'Analytics & BI delivery': s.skills.analytics_bi,
    'Regulatory / compliance': s.skills.regulatory,
  }

  const soft = {
    'Stakeholder communication': s.skills.stakeholder_comms,
    'Business domain fluency': s.skills.business_domain,
    'Problem framing': s.skills.problem_framing,
    'Mentoring / team building': s.skills.mentoring,
    'Change management': s.skills.change_management,
    'Product thinking': s.skills.product_thinking,
  }

  return `You are a data career advisor specializing in the AI transition affecting data and analytics roles from 2025–2027.

USER PROFILE:
- Roles: ${s.selectedRoles.join(', ') || 'Not specified'}
- Industry: ${s.industry || 'Not specified'}
- Seniority: ${s.seniority || 'Not specified'}
- Years experience: ${s.yearsExperience || 'Not specified'}
- Skill shape: ${s.skillShape || 'Not specified'}
- Leadership activities: ${s.leadershipActivities.join(', ') || 'None selected'}
- Current skill levels (0-5 scale):
  Technical: ${JSON.stringify(technical)}
  Domain & Functional: ${JSON.stringify(domain)}
  Soft skills: ${JSON.stringify(soft)}
- Concerns: ${s.concerns.join(', ') || 'None specified'}

Based on research into the future of data roles (WEF Future of Jobs 2025, LinkedIn Economic Graph, Gartner data & analytics forecasts), provide:

1. DEMAND_LEVELS: For each of the 16 skills, the projected 2027 demand level (0-5 scale)
2. GAP_ANALYSIS: Classify each skill as "aligned", "urgent_gap", or "at_risk"
3. ROLE_DESTINATIONS: 3 role options (best_fit, stretch, long_horizon) each with: title, rationale (1 sentence), key_skills_needed (3 items)
4. ROADMAP: Learning steps organized into 3 bands:
   - quick_wins (90 days): 2-3 steps
   - core_builds (6 months): 2-3 steps
   - pivot_enablers (12-18 months): 1-2 steps
   Each step: title, detail (2 sentences), resources (2-3 links/names)
5. SKILLS_TO_PROTECT: List of 3-5 existing strong skills worth maintaining

Respond ONLY with a valid JSON object matching this exact schema. No preamble, no markdown fences, no explanation:
{
  "demand_levels": { "data_pipelines": 0, "sql_fluency": 0, "python": 0, "cloud_platforms": 0, "ai_llm_tools": 0, "data_modeling": 0, "data_governance": 0, "data_quality": 0, "analytics_bi": 0, "regulatory": 0, "stakeholder_comms": 0, "business_domain": 0, "problem_framing": 0, "mentoring": 0, "change_management": 0, "product_thinking": 0 },
  "gap_analysis": { "data_pipelines": "aligned", ... },
  "role_destinations": [ { "type": "best_fit", "title": "", "rationale": "", "key_skills": [] }, { "type": "stretch", ... }, { "type": "long_horizon", ... } ],
  "roadmap": { "quick_wins": [ { "title": "", "detail": "", "resources": [] } ], "core_builds": [...], "pivot_enablers": [...] },
  "skills_to_protect": []
}`
}
