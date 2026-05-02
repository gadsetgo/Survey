import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const body = await req.json() as {
    email?: string
    helpful?: string
    suggestion?: string
    survey_type?: string
  }

  const { error } = await supabase
    .from('feedback_submissions')
    .insert({
      survey_type: body.survey_type ?? 'unknown',
      helpful: body.helpful ?? null,
      email: body.email ?? null,
      suggestion: body.suggestion ?? null,
    })

  if (error) {
    console.error('[subscribe] Supabase error:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
