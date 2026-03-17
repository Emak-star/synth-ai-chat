'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useConversationsStore } from '@/store/conversations'
import { getPersona } from '@/lib/personas'
import { formatDate, formatTime, cn } from '@/lib/utils'

export default function HistoryPage() {
  const router                                        = useRouter()
  const { conversations, setActive, deleteConversation, clearAll } = useConversationsStore()
  const [search, setSearch]                           = useState('')
  const [confirmClear, setConfirmClear]               = useState(false)
  const [editingId, setEditingId]                     = useState<string | null>(null)
  const [editTitle, setEditTitle]                     = useState('')
  const { renameConversation }                        = useConversationsStore()

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()))
  )

  function openConversation(id: string) {
    setActive(id)
    router.push('/chat')
  }

  function startEdit(id: string, title: string) {
    setEditingId(id)
    setEditTitle(title)
  }

  function saveEdit(id: string) {
    if (editTitle.trim()) renameConversation(id, editTitle.trim())
    setEditingId(null)
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 font-medium mb-3">Saved</p>
            <h1 className="text-3xl font-medium text-white/90">Conversation history</h1>
            <p className="text-sm text-white/40 mt-1">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
          </div>
          {conversations.length > 0 && (
            confirmClear ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-white/50">Clear everything?</span>
                <button onClick={() => { clearAll(); setConfirmClear(false) }} className="text-xs px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors">
                  Yes, clear all
                </button>
                <button onClick={() => setConfirmClear(false)} className="text-xs px-3 py-1.5 rounded-lg border border-subtle text-white/40 hover:text-white/60 transition-colors">
                  Cancel
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="text-xs text-white/30 hover:text-white/50 transition-colors">
                Clear all
              </button>
            )
          )}
        </div>

        {/* Search */}
        {conversations.length > 0 && (
          <div className="relative mb-6">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface border border-subtle rounded-xl pl-10 pr-4 py-3 text-sm text-white/70 placeholder-white/25 outline-none focus:border-soft transition-colors"
            />
          </div>
        )}

        {/* Empty state */}
        {conversations.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-subtle flex items-center justify-center mx-auto mb-5">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="text-white/30">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <p className="text-white/40 text-sm mb-2">No conversations yet</p>
            <button onClick={() => router.push('/chat')} className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              Start your first chat →
            </button>
          </div>
        )}

        {/* No results */}
        {conversations.length > 0 && filtered.length === 0 && (
          <p className="text-center text-white/35 text-sm py-12">No results for &ldquo;{search}&rdquo;</p>
        )}

        {/* Conversation list */}
        <div className="space-y-2">
          {filtered.map((conv) => {
            const persona    = getPersona(conv.personaId)
            const lastMsg    = conv.messages.at(-1)
            const isEditing  = editingId === conv.id

            return (
              <div
                key={conv.id}
                className="group bg-surface border border-subtle rounded-xl overflow-hidden hover:border-soft transition-colors"
              >
                <div className="flex items-center gap-4 p-4">
                  {/* Persona avatar */}
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-medium shrink-0', persona.color, persona.textColor)}>
                    {persona.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !isEditing && openConversation(conv.id)}>
                    {isEditing ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(conv.id); if (e.key === 'Escape') setEditingId(null) }}
                        onBlur={() => saveEdit(conv.id)}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-bg3 border border-soft rounded-lg px-2 py-1 text-sm text-white/80 outline-none"
                      />
                    ) : (
                      <p className="text-sm font-medium text-white/75 truncate">{conv.title}</p>
                    )}
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-[10px] text-white/30">{persona.name} · {formatDate(conv.updatedAt)}</p>
                      {lastMsg && (
                        <p className="text-[10px] text-white/20 truncate hidden sm:block">
                          · {lastMsg.content.slice(0, 50)}{lastMsg.content.length > 50 ? '…' : ''}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message count */}
                  <p className="text-[10px] text-white/25 shrink-0 hidden sm:block">
                    {conv.messages.length} msg{conv.messages.length !== 1 ? 's' : ''}
                  </p>

                  {/* Actions — visible on hover */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => { e.stopPropagation(); startEdit(conv.id, conv.title) }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors"
                      aria-label="Rename"
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-colors"
                      aria-label="Delete"
                    >
                      <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
