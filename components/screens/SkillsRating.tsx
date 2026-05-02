'use client'

import { useSurveyStore } from '@/lib/store'
import type { SkillKey } from '@/lib/types'

interface Props {
  dark?: boolean
  onNext: () => void
  onBack: () => void
}

const mkT = (dark: boolean) => dark
  ? { bg: '#1a1410', fg: '#fdf8f0', muted: 'rgba(253,248,240,0.55)', rule: 'rgba(253,248,240,0.14)' }
  : { bg: '#fdf8f0', fg: '#1a1410', muted: 'rgba(26,20,16,0.55)',    rule: 'rgba(26,20,16,0.14)'    }

const GROUPS = [
  {
    color: '#1d7a6b', code: 'TC', title: 'Technical',
    sub: 'What you can build & operate',
    skills: [
      { key: 'pipelines' as SkillKey, label: 'Data pipelines / ETL' },
      { key: 'sql'       as SkillKey, label: 'SQL & query fluency' },
      { key: 'python'    as SkillKey, label: 'Python / scripting' },
      { key: 'cloud'     as SkillKey, label: 'Cloud platforms' },
      { key: 'ai_tools'  as SkillKey, label: 'AI / LLM tools' },
      { key: 'modeling'  as SkillKey, label: 'Data modeling' },
    ],
  },
  {
    color: '#e88c2a', code: 'DM', title: 'Domain',
    sub: 'What you understand about the work',
    skills: [
      { key: 'governance'  as SkillKey, label: 'Governance & policy' },
      { key: 'dq'          as SkillKey, label: 'Data quality frameworks' },
      { key: 'metadata'    as SkillKey, label: 'Metadata & cataloging' },
      { key: 'bi_delivery' as SkillKey, label: 'Analytics & BI delivery' },
      { key: 'compliance'  as SkillKey, label: 'Regulatory fluency' },
      { key: 'domain'      as SkillKey, label: 'Business domain knowledge' },
    ],
  },
  {
    color: '#5c4db1', code: 'SF', title: 'Soft & Cross-functional',
    sub: 'How you work with people',
    skills: [
      { key: 'stakeholders' as SkillKey, label: 'Stakeholder communication' },
      { key: 'framing'      as SkillKey, label: 'Business problem framing' },
      { key: 'storytelling' as SkillKey, label: 'Executive storytelling' },
      { key: 'strategic'    as SkillKey, label: 'Strategic thinking' },
    ],
  },
]

const CONCERNS = [
  { id: 'automation', icon: '🤖', title: 'My role is at risk',       sub: 'AI is taking over my tasks' },
  { id: 'ai-skills',  icon: '📉', title: 'Falling behind on AI',     sub: 'Peers are upskilling faster' },
  { id: 'ceiling',    icon: '🏔️', title: 'Hit a ceiling',            sub: 'My niche is narrowing' },
  { id: 'pivot',      icon: '🧭', title: 'Want to pivot',            sub: 'Need a path to a new role' },
  { id: 'ahead',      icon: '🚀', title: 'Stay ahead',               sub: 'Proactive, not crisis mode' },
]

const BADGE: Record<number, string> = { 0: 'NOVICE', 1: 'NOVICE', 2: 'LEARNING', 3: 'CAPABLE', 4: 'STRONG', 5: 'EXPERT' }

const LEVEL_EMOJI = ['😶', '🌱', '📚', '💪', '🔥', '🏆']

const SKILL_DESCRIPTIONS: Record<SkillKey, string[]> = {
  pipelines: [
    'ETL? Never built one — data just appears, right? 😅',
    'I know what a pipeline is and have poked at one',
    'Can build basic ETL flows and debug when things break',
    'Solid pipeline builder — orchestration, incremental loads, the works',
    'Designs production-grade pipelines with observability, SLAs and retry logic',
    'Could architect the data infrastructure for a Fortune 500 from scratch 🏆',
  ],
  sql: [
    'SELECT * FROM confusion WHERE brain = NULL 😶',
    'Can write basic SELECTs and JOINs on a good day',
    'Comfortable with aggregations, CTEs, and window functions',
    'SQL is second nature — optimises queries, writes complex analytics',
    'Can tune query plans, design schemas, and mentor others on SQL craft',
    'SQL wizard. Teaches, designs, and writes the book others learn from 🏆',
  ],
  python: [
    "print('hello world') and that's about it 😶",
    'Can read Python and make small changes without breaking too much',
    'Write scripts, pandas dataframes, and simple automation',
    'Builds clean Python modules, knows testing, packaging, and best practices',
    'Designs Python services, reviews code, and sets team standards',
    'Could teach a multi-week Python bootcamp without notes 🏆',
  ],
  cloud: [
    'The cloud is just someone else\'s computer — and I\'ve never touched it 😶',
    'Have clicked around AWS/GCP/Azure but not deployed anything real',
    'Can deploy basic services, manage storage, and read cloud bills with horror',
    'Comfortable architecting multi-service cloud data solutions with IAM and cost controls',
    'Designs cloud-native data platforms — multi-region, secure, cost-optimised',
    'Certified across multiple clouds and mentors others on cloud architecture 🏆',
  ],
  ai_tools: [
    "ChatGPT is for writing emails, right? 😶",
    "Used LLMs a few times, haven't built anything with them",
    'Can call an LLM API and do basic prompt engineering',
    'Build LLM-powered features — RAG, agents, function calling',
    'Designs AI systems end-to-end: evals, guardrails, fine-tuning, production ops',
    'Could give the LLMOps keynote. Builds and evaluates prod AI systems at scale 🏆',
  ],
  modeling: [
    'Flat tables are my comfort zone — dimensional what? 😶',
    'Understand star schemas conceptually but haven\'t implemented one',
    'Can design and implement dimensional models and write dbt models',
    'Designs scalable semantic layers, data vaults, or medallion architectures',
    'Sets modeling standards for the org; balances performance vs flexibility',
    'Could author the definitive guide on data modeling for your industry 🏆',
  ],
  governance: [
    'Data governance sounds like a compliance thing for other people 😶',
    'I know it involves policies and someone owns it, just not me',
    'Familiar with data stewardship, ownership concepts, and basic cataloging',
    'Implements governance programs, data dictionaries, and lineage tracking',
    'Designs governance frameworks — DAMA-aligned, cross-functional, enforced',
    'Could pass the CDMP exam in my sleep and has probably written training materials 🏆',
  ],
  dq: [
    'Data quality means checking if the file downloaded properly, right? 😶',
    'I know bad data exists and it causes problems for others',
    'Can write basic data quality checks and flag anomalies',
    'Implements DQ frameworks with profiling, SLAs, and alerting pipelines',
    'Designs org-wide data quality programs with monitoring and escalation paths',
    'Practically invented the DQ runbook others follow — and monitors the monitors 🏆',
  ],
  metadata: [
    'Metadata is just the info about the info... still not sure why it matters 😶',
    'Know what a data catalog is; have browsed one once or twice',
    'Can tag datasets, maintain basic catalog entries, and explain lineage',
    'Builds and maintains catalog implementations (DataHub, Alation, Collibra)',
    'Designs metadata strategies, drives adoption, and champions semantic tagging',
    'Wrote the catalog adoption playbook your company runs on 🏆',
  ],
  bi_delivery: [
    "Dashboards are for managers. I just send CSV files 😶",
    'Can build a basic bar chart and share it with someone',
    'Comfortable building self-service dashboards in Tableau, Power BI, or Looker',
    'Designs the BI layer — semantic models, certified metrics, governed dashboards',
    'Owns the analytics product end-to-end: from data model to executive adoption',
    'The BI platform you built is the single source of truth for the whole company 🏆',
  ],
  compliance: [
    'GDPR? Is that a band? 😅',
    'I know fines exist and they are very, very scary',
    'Familiar with GDPR basics, CCPA, and what a DPA actually does',
    'Can navigate GDPR, CCPA, and DPDP — knows when to escalate',
    'Deep knowledge of global regulations — advises teams and designs compliant systems',
    'Could advise a regulator. Leads compliance programs and writes the policies 🏆',
  ],
  domain: [
    "I know what the company does… roughly 😶",
    'Understand the basics of the business but struggle with domain jargon',
    'Can hold a meeting with business stakeholders without Googling every term',
    'Deep industry knowledge — speaks the language, spots the real problems',
    'Bridges data and business strategy; trusted advisor to domain leadership',
    'You are the go-to person when the business needs someone who truly gets it 🏆',
  ],
  stakeholders: [
    'I send emails with attachments and hope for the best 😶',
    'Can explain what I do in plain English... sometimes',
    'Comfortable presenting findings and fielding basic questions',
    'Skilled at translating data insights for non-technical audiences under pressure',
    'Navigates complex org dynamics, builds trust, and influences without authority',
    'Stakeholders request meetings with YOU. You make data decisions happen 🏆',
  ],
  framing: [
    "The business has a problem? That's what the PM is for 😶",
    'Can restate a problem but struggle to scope or structure the approach',
    'Can decompose a vague request into answerable questions',
    'Consistently reframes problems from "what happened" to "what should we do"',
    'Teaches problem framing to others; shapes org thinking before work begins',
    'Your problem definition is so crisp the team wishes they had asked you first 🏆',
  ],
  storytelling: [
    'My slide decks are... comprehensive. Very comprehensive. 😶',
    'Can present data in order; working on making it land emotionally',
    'Structures a narrative arc — context, conflict, resolution — in presentations',
    'Builds exec-ready presentations that drive decisions, not just inform',
    'Coaches others on data storytelling; known for presentations that move rooms',
    'Your last slide deck got quoted in the board meeting without you in the room 🏆',
  ],
  strategic: [
    'Strategy is above my pay grade and I am fine with that 😶',
    'I understand the company direction but rarely connect my work to it',
    'Can articulate how my work contributes to team or department goals',
    'Proactively shapes team roadmaps and spots data opportunities ahead of asks',
    'Influences org-level data strategy; trusted in leadership planning conversations',
    'You wrote the data strategy that is now the company\'s north star 🏆',
  ],
}

export default function SkillsRating({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const { skills, concerns, setSkill, toggleConcern } = useSurveyStore()

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        {/* Nav */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 03 / 04</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>RATE YOURSELF</span>
        </header>

        {/* Progress */}
        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '75%', transition: 'width 0.3s' }} />
        </div>

        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR LEVELS</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 56, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            Where do<br />you <em style={{ fontStyle: 'italic', fontWeight: 700 }}>shine</em>?
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: T.muted, margin: 0 }}>
            Honest beats aspirational. Tap a level to see what it really means.
          </p>
        </div>

        {/* 00 What's driving this */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>00</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.16em', color: T.fg }}>WHAT&apos;S DRIVING THIS</span>
            <span style={{ flex: 1, height: 1, background: T.rule }} />
          </div>
          <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.04em', color: T.muted, marginBottom: 10 }}>Pick all that apply</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CONCERNS.map((c) => {
              const active = concerns.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleConcern(c.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', gap: 4,
                    padding: '14px 12px', border: `1px solid ${active ? T.fg : T.rule}`,
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left', fontFamily: "'DM Sans', sans-serif",
                    background: active ? T.fg : 'transparent', color: active ? T.bg : T.fg,
                  }}
                >
                  <span style={{ fontSize: 22, marginBottom: 4 }}>{c.icon}</span>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>{c.title}</span>
                  <span style={{ fontSize: 11, lineHeight: 1.35, color: active ? (dark ? 'rgba(26,20,16,0.7)' : 'rgba(253,248,240,0.7)') : T.muted }}>{c.sub}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Skill groups */}
        {GROUPS.map((g, i) => (
          <div key={g.code} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: T.muted }}>0{i + 1}</span>
              <span style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 11,
                color: '#fdf8f0', background: g.color, padding: '4px 8px', borderRadius: 4, letterSpacing: '0.06em',
              }}>{g.code}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, letterSpacing: '-0.02em', color: T.fg }}>{g.title}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{g.sub}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {g.skills.map((s) => {
                const val = skills[s.key]
                const badge = BADGE[val]
                const badgeActive = val >= 4
                return (
                  <div key={s.key}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{LEVEL_EMOJI[val]}</span>
                        <span style={{ fontSize: 14, fontWeight: 500, color: T.fg }}>{s.label}</span>
                      </div>
                      <span style={{
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.14em',
                        padding: '3px 8px', border: `1px solid ${badgeActive ? g.color : T.muted}`,
                        borderRadius: 999,
                        color: badgeActive ? '#fdf8f0' : T.fg,
                        background: badgeActive ? g.color : 'transparent',
                      }}>
                        {badge}
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 6 }}>
                      {[0, 1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() => setSkill(s.key, n)}
                          aria-label={`Set ${s.label} to ${n}`}
                          style={{
                            height: 40, border: `1.5px solid ${n <= val ? g.color : T.rule}`,
                            borderRadius: 6, cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                            background: n <= val ? g.color : 'transparent',
                          }}
                        >
                          <span style={{ fontSize: 14, lineHeight: 1 }}>{LEVEL_EMOJI[n]}</span>
                          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 10, color: n <= val ? '#fdf8f0' : T.muted }}>
                            {n}
                          </span>
                        </button>
                      ))}
                    </div>
                    {/* Contextual description */}
                    <p style={{
                      fontSize: 11, fontStyle: 'italic', lineHeight: 1.4,
                      color: g.color, margin: 0, minHeight: 16,
                      transition: 'opacity 0.2s',
                    }}>
                      {SKILL_DESCRIPTIONS[s.key][val]}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* spacer for sticky footer */}
        <div style={{ height: 80 }} />

        {/* Sticky footer */}
        <div style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 480, padding: '16px 24px 24px',
          background: T.bg, borderTop: `1px solid ${T.rule}`,
        }}>
          <button
            onClick={onNext}
            style={{
              width: '100%', padding: '18px 24px', border: 'none', borderRadius: 999,
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              fontSize: 16, fontWeight: 500, fontFamily: "'DM Sans', sans-serif",
              background: T.fg, color: T.bg,
            }}
          >
            See my map
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
