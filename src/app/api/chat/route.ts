import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { NextRequest } from 'next/server'
import { getPersona } from '@/lib/personas'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const { messages, personaId } = await req.json()

  if (!messages?.length) {
    return new Response('Messages are required', { status: 400 })
  }

  const persona = getPersona(personaId ?? 'aria')

  const result = await streamText({
    model:     anthropic('claude-sonnet-4-6'),
    system:    persona.systemPrompt,
    messages,
    maxTokens: 1024,
  })

  return result.toDataStreamResponse()
}
