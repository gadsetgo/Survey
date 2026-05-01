import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { buildPrompt } from '@/lib/prompts'
import type { SurveyState, ApiResponse } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const survey: SurveyState = await req.json()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
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

    const parsed: ApiResponse = JSON.parse(text)
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('/api/analyze error:', err)
    return NextResponse.json(
      { error: 'Failed to analyze skills' },
      { status: 500 }
    )
  }
}
