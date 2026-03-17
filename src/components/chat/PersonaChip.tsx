'use client'

import { useState } from 'react'
import { PERSONA_LIST, getPersona } from '@/lib/personas'
import { cn } from '@/lib/utils'
import type { PersonaId } from '@/types'

export default function PersonaChip({
  personaId,
  onChange,
}: {
  personaId: PersonaId
  onChange: (id: PersonaId) => void
}) {
  const [open, setOpen] = useState(false)
  const persona         = getPersona(personaId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors',
          'border-subtle hover:border-soft bg-surface'
        )}
      >
        <span className={cn('w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-medium', persona.color, persona.textColor)}>
          {persona.avatar}
        </span>
        <span className="text-white/70">{persona.name}</span>
        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
          className={cn('text-white/30 transition-transform', open && 'rotate-180')}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-52 bg-bg3 border border-subtle rounded-xl overflow-hidden shadow-xl z-20 animate-fade-up">
          {PERSONA_LIST.map((p) => (
            <button
              key={p.id}
              onClick={() => { onChange(p.id); setOpen(false) }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-white/5 transition-colors',
                p.id === personaId && 'bg-white/5'
              )}
            >
              <span className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0', p.color, p.textColor)}>
                {p.avatar}
              </span>
              <div>
                <p className="text-sm text-white/80 font-medium">{p.name}</p>
                <p className="text-[10px] text-white/35">{p.role}</p>
              </div>
              {p.id === personaId && (
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-violet-400">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
