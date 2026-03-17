'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useChat } from 'ai/react'
import { useConversationsStore } from '@/store/conversations'
import { getPersona } from '@/lib/personas'
import MessageBubble from '@/components/chat/MessageBubble'
import PersonaChip from '@/components/chat/PersonaChip'
import { cn } from '@/lib/utils'
import type { PersonaId } from '@/types'

export default function ChatPage() {
  const {
    conversations, activeId, createConversation,
    setActive, addMessage, updateLastMessage, autoTitle,
  } = useConversationsStore()

  const active  = conversations.find((c) => c.id === activeId)
  const persona = getPersona(active?.personaId ?? 'aria')

  // If no active conversation, create one
  useEffect(() => {
    if (!activeId) {
      const conv = createConversation('aria')
      setActive(conv.id)
    }
  }, [activeId, createConversation, setActive])

  const [personaId, setPersonaId] = useState<PersonaId>(active?.personaId ?? 'aria')
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLTextAreaElement>(null)
  const convIdRef  = useRef<string | null>(activeId)

  // Keep convIdRef in sync
  useEffect(() => { convIdRef.current = activeId }, [activeId])

  // Sync persona with active conversation
  useEffect(() => {
    if (active) setPersonaId(active.personaId)
  }, [active?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const { messages, input, setInput, isLoading, stop, append, setMessages } = useChat({
    api: '/api/chat',
    body: { personaId },
    onFinish: (msg) => {
      const id = convIdRef.current
      if (!id) return
      updateLastMessage(id, msg.content)
      autoTitle(id)
    },
  })

  // Load stored messages when switching conversations
  useEffect(() => {
    if (active) {
      const mapped = active.messages.map((m) => ({
        id:      m.id,
        role:    m.role as 'user' | 'assistant',
        content: m.content,
      }))
      setMessages(mapped)
    }
  }, [activeId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Handle send
  async function handleSend(text?: string) {
    const content = (text ?? input).trim()
    if (!content || isLoading) return

    // Ensure a conversation exists
    let convId = convIdRef.current
    if (!convId) {
      const conv = createConversation(personaId)
      convId = conv.id
    }

    // Persist user message
    addMessage(convId, { role: 'user', content })

    // Persist placeholder for assistant message (will be updated onFinish)
    addMessage(convId, { role: 'assistant', content: '' })

    setInput('')
    await append({ role: 'user', content }, { body: { personaId } })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handlePersonaChange(id: PersonaId) {
    setPersonaId(id)
    // Start a fresh conversation with new persona
    const conv = createConversation(id)
    setActive(conv.id)
    setMessages([])
  }

  const isEmpty = messages.length === 0

  return (
    <div className="flex flex-col h-full">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-subtle shrink-0">
        <div className="flex items-center gap-3">
          <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium', persona.color, persona.textColor)}>
            {persona.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">{persona.name}</p>
            <p className="text-[10px] text-white/35">{persona.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && (
            <button
              onClick={stop}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/50 border border-subtle hover:border-soft hover:text-white/70 transition-colors"
            >
              <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
              Stop
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 min-h-0">
        {isEmpty ? (
          <EmptyState
            persona={persona}
            onSuggestion={(s) => handleSend(s)}
          />
        ) : (
          <>
            {messages.map((m, i) => {
              const stored    = active?.messages[i]
              const streaming = isLoading && i === messages.length - 1 && m.role === 'assistant'
              return (
                <MessageBubble
                  key={m.id}
                  role={m.role as 'user' | 'assistant'}
                  content={m.content}
                  createdAt={stored?.createdAt}
                  personaId={personaId}
                  isStreaming={streaming}
                />
              )
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-5 pb-5 pt-3 border-t border-subtle">
        <div className="flex items-end gap-3 bg-surface border border-subtle rounded-2xl px-4 py-3 focus-within:border-soft transition-colors">
          <PersonaChip personaId={personaId} onChange={handlePersonaChange} />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${persona.name}…`}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/25 resize-none outline-none leading-relaxed max-h-32 overflow-y-auto"
            style={{ fieldSizing: 'content' } as React.CSSProperties}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ background: input.trim() && !isLoading ? '#8b5cf6' : 'rgba(255,255,255,0.08)' }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-center text-[10px] text-white/20 mt-2">
          Enter to send · Shift+Enter for new line · Switch personas anytime
        </p>
      </div>
    </div>
  )
}

function EmptyState({
  persona,
  onSuggestion,
}: {
  persona: ReturnType<typeof getPersona>
  onSuggestion: (s: string) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 text-center">
      <div className={cn('w-16 h-16 rounded-full flex items-center justify-center text-xl font-medium mb-5', persona.color, persona.textColor)}>
        {persona.avatar}
      </div>
      <h2 className="text-xl font-medium text-white/80 mb-1">{persona.name}</h2>
      <p className="text-sm text-white/40 mb-10 max-w-sm leading-relaxed">{persona.greeting}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
        {persona.suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="text-left px-4 py-3 rounded-xl border border-subtle bg-surface hover:bg-surface2 hover:border-soft transition-all text-sm text-white/50 hover:text-white/70 leading-snug"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
