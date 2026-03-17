'use client'

import { useRouter } from 'next/navigation'
import { PERSONA_LIST } from '@/lib/personas'
import { useConversationsStore } from '@/store/conversations'
import { cn } from '@/lib/utils'
import type { PersonaId } from '@/types'

export default function PersonasPage() {
  const router = useRouter()
  const { createConversation, setActive } = useConversationsStore()

  function startChat(personaId: PersonaId) {
    const conv = createConversation(personaId)
    setActive(conv.id)
    router.push('/chat')
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-3">Meet the team</p>
          <h1 className="text-3xl font-medium text-white/90 mb-3">Choose your AI persona</h1>
          <p className="text-sm text-white/45 leading-relaxed max-w-lg">
            Each persona has a distinct personality, communication style, and area of expertise. Switch between them at any time — even mid-conversation.
          </p>
        </div>

        {/* Persona cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {PERSONA_LIST.map((persona) => (
            <div
              key={persona.id}
              className="bg-surface border border-subtle rounded-2xl p-6 flex flex-col gap-5 hover:border-soft transition-colors group"
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div
                  className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-base font-medium', persona.color, persona.textColor)}
                  style={{ boxShadow: `0 0 0 1px ${persona.accentHex}30` }}
                >
                  {persona.avatar}
                </div>
                <div>
                  <p className="text-base font-medium text-white/90">{persona.name}</p>
                  <p className="text-xs text-white/40">{persona.role}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-white/50 leading-relaxed flex-1">
                {persona.description}
              </p>

              {/* Suggestions preview */}
              <div className="space-y-1.5">
                {persona.suggestions.slice(0, 2).map((s) => (
                  <div key={s} className="flex items-start gap-2 text-xs text-white/30">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5 opacity-50">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                    <span>{s}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => startChat(persona.id as PersonaId)}
                className="w-full py-2.5 rounded-xl text-sm font-medium transition-all border"
                style={{
                  borderColor: `${persona.accentHex}40`,
                  color: persona.accentHex,
                  background: `${persona.accentHex}10`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${persona.accentHex}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${persona.accentHex}10`
                }}
              >
                Start chat with {persona.name} →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-10 p-5 bg-surface border border-subtle rounded-2xl">
          <p className="text-xs text-white/35 leading-relaxed">
            <span className="text-white/55 font-medium">Persona switching is instant.</span>{' '}
            You can change which persona you&apos;re talking to at any point using the chip in the chat input. Each persona uses the same underlying Claude model but with a different system prompt that shapes its personality and communication style.
          </p>
        </div>
      </div>
    </div>
  )
}
