'use client'

import { useSoftwareSurveyStore } from '@/lib/software-store'
import type { SoftwareSkillKey } from '@/lib/software-types'

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
    color: '#1d7a6b', code: 'TC', title: 'Technical Core',
    sub: 'What you can build',
    skills: [
      { key: 'languages'     as SoftwareSkillKey, label: 'Language proficiency' },
      { key: 'system_design' as SoftwareSkillKey, label: 'System design' },
      { key: 'cloud_infra'   as SoftwareSkillKey, label: 'Cloud & infrastructure' },
      { key: 'ai_coding'     as SoftwareSkillKey, label: 'AI-assisted development' },
      { key: 'testing'       as SoftwareSkillKey, label: 'Testing & quality' },
      { key: 'security'      as SoftwareSkillKey, label: 'Application security' },
    ],
  },
  {
    color: '#e88c2a', code: 'DO', title: 'Domain & Operations',
    sub: 'How you ship and sustain it',
    skills: [
      { key: 'algorithms'    as SoftwareSkillKey, label: 'Algorithms & data structures' },
      { key: 'databases'     as SoftwareSkillKey, label: 'Database engineering' },
      { key: 'devops_ci'     as SoftwareSkillKey, label: 'CI/CD & DevOps' },
      { key: 'api_design'    as SoftwareSkillKey, label: 'API design' },
      { key: 'performance'   as SoftwareSkillKey, label: 'Performance engineering' },
      { key: 'architecture'  as SoftwareSkillKey, label: 'Software architecture' },
    ],
  },
  {
    color: '#5c4db1', code: 'SL', title: 'Soft & Leadership',
    sub: 'How you multiply others',
    skills: [
      { key: 'code_review'      as SoftwareSkillKey, label: 'Code review & mentorship' },
      { key: 'product_thinking' as SoftwareSkillKey, label: 'Product thinking' },
      { key: 'communication'    as SoftwareSkillKey, label: 'Communication & docs' },
      { key: 'leadership'       as SoftwareSkillKey, label: 'Technical leadership' },
    ],
  },
]

const CONCERNS = [
  { id: 'ai-replace',  icon: '🤖', title: 'AI writes my code',     sub: 'Copilot is doing more than I am' },
  { id: 'stack-stale', icon: '📉', title: 'My stack is ageing',    sub: 'The ecosystem moved on' },
  { id: 'senior-path', icon: '🏔️', title: 'Stuck at mid-level',    sub: 'Not sure how to reach senior' },
  { id: 'pivot-mgmt',  icon: '🧭', title: 'Move into management',  sub: 'IC path feels like a ceiling' },
  { id: 'stay-ic',     icon: '🚀', title: 'Stay IC, grow deep',    sub: 'Staff/Principal is the goal' },
]

const BADGE: Record<number, string> = { 0: 'NOVICE', 1: 'NOVICE', 2: 'LEARNING', 3: 'CAPABLE', 4: 'STRONG', 5: 'EXPERT' }
const LEVEL_EMOJI = ['😶', '🌱', '📚', '💪', '🔥', '🏆']

const SKILL_DESCRIPTIONS: Record<SoftwareSkillKey, string[]> = {
  languages: [
    "Googled 'Hello World' last week 🙈",
    'Can read code but writing is... copy-paste heavy',
    'Write working code; look up syntax regularly',
    'Fluent in 1–2 languages; rarely need to look things up',
    'Expert in 2+ languages; writes idiomatic, performant code without thinking',
    'Language-agnostic polyglot — pick up any language in days, write prod code in a week 🏆',
  ],
  system_design: [
    'My architecture is a single main() function 😅',
    'Know what a load balancer is, roughly',
    'Can design a basic 3-tier app; understand caching and DBs',
    'Design scalable services; handle CAP theorem trade-offs',
    'Design large-scale distributed systems; anticipate failure modes others miss',
    'Design systems serving millions; write ADRs that teams reference for years 🏆',
  ],
  cloud_infra: [
    "Cloud? That's just someone else's computer 🤷",
    "Can click through AWS console; haven't broken prod yet",
    'Comfortable with core services (EC2, S3, RDS); basics of VPCs',
    'Write IaC (Terraform/CDK); deploy multi-region; understand cost basics',
    'Design cloud-native platforms; optimize for cost AND reliability at scale',
    'Platform-agnostic cloud expert — design, secure, and optimize any cloud 🏆',
  ],
  ai_coding: [
    'Still typing every character manually 😶',
    'Used Copilot once, it scared me',
    'Use AI suggestions regularly; can verify and fix generated code',
    'Prompt AI for complex tasks; know its limits; use agentic tools effectively',
    'Run multi-step AI agents; build features with AI-first workflows',
    'Code orchestrator: you direct the AI, review, and ship. Faster than any solo coder 🏆',
  ],
  testing: [
    'My test suite is me clicking around the UI 🙈',
    'Write some unit tests; mostly after the fact',
    'Test-after on most code; some integration tests; understand coverage',
    'TDD/BDD on critical paths; think about test strategy up front',
    'Design testing architectures; contract tests, chaos engineering basics',
    'Turn testing into a culture: coverage means nothing, correctness means everything 🏆',
  ],
  security: [
    "SQL injection? Never heard of her 😬",
    'Know OWASP exists; avoid the obvious mistakes',
    'Understand common vulns; review code for basic security issues',
    'Threat model new features; familiar with secure design patterns',
    'Lead security reviews; design zero-trust systems; find subtle vulns',
    'Could give the OWASP keynote. Security is baked into every design decision 🏆',
  ],
  algorithms: [
    'O(n²)? That sounds fine to me 🤷',
    'Know arrays and loops; might use a map if prompted',
    'Comfortable with common structures (trees, graphs); basic big-O reasoning',
    'Can optimize critical paths; select the right data structure instinctively',
    'Deep DS&A knowledge; implement custom structures when needed',
    "Competitive programmer level — but honestly, AI handles this now so you focus on the hard stuff 🤖",
  ],
  databases: [
    'SELECT * FROM everything 😅',
    'Write basic queries; use ORMs and hope for the best',
    'Design normalized schemas; understand indexes conceptually',
    'Optimize slow queries; choose SQL vs NoSQL thoughtfully; understand ACID',
    'Design DB architectures; tune for high-throughput; replication and failover',
    'DB whisperer: the query planner has no secrets from you 🏆',
  ],
  devops_ci: [
    'My deployment is FTP to prod 🚨',
    'Can push to git; vaguely aware CI exists',
    'Write basic CI pipelines; understand deployment vs delivery',
    'Build multi-stage pipelines; blue-green deployments; feature flags',
    'Design DevOps platforms; implement GitOps; measure DORA metrics',
    'Ship 10× a day, sleep well. CI/CD is your craft 🏆',
  ],
  api_design: [
    'POST everything to /api 😅',
    'Follow tutorials; know GET vs POST roughly',
    'Design RESTful endpoints; understand status codes and pagination',
    'Design APIs others love to use; versioning, contracts, OpenAPI docs',
    'Design API platforms; think about DX, evolution, and breaking changes',
    'API as a product: you have designed systems that outlived you 🏆',
  ],
  performance: [
    "It works on my machine 🤷",
    'Know slow when users complain; reload the page',
    'Profile obvious bottlenecks; understand caching basics',
    'Set latency budgets; optimize critical paths; load test regularly',
    'Design for 99.99%: P99 latencies, failure budgets, auto-scaling',
    'Performance is a feature — you have made something 10× faster and proved it 🏆',
  ],
  architecture: [
    "My architecture is 'it works, don't touch it' 😬",
    'Know layers exist; follow existing patterns without questioning them',
    'Understand MVC, basic microservices vs monolith trade-offs',
    'Apply appropriate patterns; write ADRs; reason about coupling vs cohesion',
    'Design systems with 5-year longevity; navigate org and tech constraints',
    'Architecture as communication — your diagrams are the documentation 🏆',
  ],
  code_review: [
    'LGTM without reading it 🙈',
    'Check for obvious bugs; give vague feedback',
    'Catch logic issues; suggest improvements with reasoning',
    'Shape team quality standards through reviews; mentor junior devs',
    'Create review culture; establish eng standards; lift the whole team',
    'Your code reviews are a masterclass. Every comment teaches something 🏆',
  ],
  product_thinking: [
    "That's the PM's job 🤷",
    'Know users exist; build what is spec\'d',
    "Ask 'why' before 'how'; understand the user pain being solved",
    'Shape requirements; challenge scope; make build-vs-buy calls',
    'Co-own the roadmap; drive outcomes, not output',
    'The PM checks with you before writing the spec 🏆',
  ],
  communication: [
    'My docs are TODO comments 😅',
    'Can explain tech to other engineers, mostly',
    'Write clear design docs; explain technical decisions to non-tech audiences',
    'Communicate trade-offs to leadership; write RFCs people actually read',
    'Technical storyteller: translate complexity to any audience',
    'Your PRs, RFCs, and talks are referenced years later 🏆',
  ],
  leadership: [
    'I just write code 🤷',
    'Help juniors when asked; occasionally own a feature',
    'Run project tech decisions; review design proposals',
    'Set direction for a team; drive technical strategy for a domain',
    'Influence org-wide technical strategy; build high-performing teams',
    'The team runs better because you are there. Your influence compounds 🏆',
  ],
}

export default function SoftwareSkillsRating({ dark = false, onNext, onBack }: Props) {
  const T = mkT(dark)
  const { skills, concerns, setSkill, toggleConcern } = useSoftwareSurveyStore()

  return (
    <div style={{ background: T.bg, color: T.fg, minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 24px' }}>

        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0 14px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 24, color: T.fg, padding: 0, lineHeight: 1 }}>←</button>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>STEP 02 / 03</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', color: T.muted }}>RATE YOURSELF</span>
        </header>

        <div style={{ height: 2, background: T.rule, marginBottom: 24 }}>
          <div style={{ height: '100%', background: T.fg, width: '66%', transition: 'width 0.3s' }} />
        </div>

        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: T.muted, marginBottom: 14 }}>YOUR LEVELS</div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, lineHeight: 0.9, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
            Where do<br />you <em style={{ fontStyle: 'italic', fontWeight: 700 }}>shine</em>?
          </h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, color: T.muted, margin: 0 }}>
            Honest beats aspirational. Tap a level to see what it really means.
          </p>
        </div>

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
                        borderRadius: 999, color: badgeActive ? '#fdf8f0' : T.fg,
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
                    <p style={{ fontSize: 11, fontStyle: 'italic', lineHeight: 1.4, color: g.color, margin: 0, minHeight: 16 }}>
                      {SKILL_DESCRIPTIONS[s.key][val]}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div style={{ height: 80 }} />

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
            See my software map
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700 }}>→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
