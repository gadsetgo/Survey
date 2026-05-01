import type { SurveyState } from './types'

export function buildPrompt(s: SurveyState): string {
  const technical = {
    'Data pipelines / ETL': s.skills.pipelines,
    'SQL & query fluency': s.skills.sql,
    'Python / scripting': s.skills.python,
    'Cloud platforms': s.skills.cloud,
    'AI / LLM tools': s.skills.ai_tools,
    'Data modeling': s.skills.modeling,
  }

  const domain = {
    'Data governance & policy': s.skills.governance,
    'Data quality frameworks': s.skills.dq,
    'Metadata & cataloging': s.skills.metadata,
    'Analytics & BI delivery': s.skills.bi_delivery,
    'Regulatory / compliance': s.skills.compliance,
    'Business domain knowledge': s.skills.domain,
  }

  const soft = {
    'Stakeholder communication': s.skills.stakeholders,
    'Business problem framing': s.skills.framing,
    'Executive storytelling': s.skills.storytelling,
    'Strategic thinking': s.skills.strategic,
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
3. ROLE_DESTINATIONS: 3 role options (best_fit, stretch, long_horizon) each with: title, rationale (1 sentence), key_skills (3 items), categories (2-letter codes from: DE, AN, DS, GV)
4. ROADMAP: Learning steps organized into 3 bands:
   - quick_wins (90 days): 2-3 steps
   - core_builds (6 months): 2-3 steps
   - pivot_enablers (12-18 months): 1-2 steps
   Each step: title, detail (2 sentences), resources (2-3 names)
5. SKILLS_TO_PROTECT: List of 3-5 existing strong skills worth maintaining

Respond ONLY with a valid JSON object. No preamble, no markdown fences:
{
  "demand_levels": { "pipelines": 0, "sql": 0, "python": 0, "cloud": 0, "ai_tools": 0, "modeling": 0, "governance": 0, "dq": 0, "metadata": 0, "bi_delivery": 0, "compliance": 0, "domain": 0, "stakeholders": 0, "framing": 0, "storytelling": 0, "strategic": 0 },
  "gap_analysis": { "pipelines": "aligned", "sql": "aligned", "python": "aligned", "cloud": "aligned", "ai_tools": "urgent_gap", "modeling": "aligned", "governance": "aligned", "dq": "aligned", "metadata": "at_risk", "bi_delivery": "aligned", "compliance": "aligned", "domain": "aligned", "stakeholders": "aligned", "framing": "aligned", "storytelling": "aligned", "strategic": "aligned" },
  "role_destinations": [
    { "type": "best_fit", "title": "", "rationale": "", "key_skills": [], "categories": ["AN", "GV"] },
    { "type": "stretch", "title": "", "rationale": "", "key_skills": [], "categories": ["DS", "DE"] },
    { "type": "long_horizon", "title": "", "rationale": "", "key_skills": [], "categories": ["DE", "GV"] }
  ],
  "roadmap": {
    "quick_wins": [{ "title": "", "detail": "", "resources": [] }],
    "core_builds": [{ "title": "", "detail": "", "resources": [] }],
    "pivot_enablers": [{ "title": "", "detail": "", "resources": [] }]
  },
  "skills_to_protect": []
}`
}
