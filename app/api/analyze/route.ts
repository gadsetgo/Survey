import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/prompts'
import type { SurveyState } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const survey: SurveyState = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: buildPrompt(survey),
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text : ''

    const parsed = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err: unknown) {
    console.error('/api/analyze error:', err)

    const errorDetail =
      err instanceof Error ? err.message : 'An unknown error occurred.'

    const status =
      err != null && typeof err === 'object' && 'status' in err &&
      typeof (err as { status: unknown }).status === 'number'
        ? (err as { status: number }).status
        : 500

    return NextResponse.json(
      { error: 'Failed to analyze skills', errorDetail },
      { status }
    )
  }
}
