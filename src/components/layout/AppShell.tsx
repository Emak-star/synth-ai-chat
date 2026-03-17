'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useConversationsStore } from '@/store/conversations'
import { getPersona } from '@/lib/personas'
import { formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const NAV = [
  {
    href: '/chat',
    label: 'Chat',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: '/personas',
    label: 'Personas',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  {
    href: '/history',
    label: 'History',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    href: '/embed',
    label: 'Embed demo',
    icon: (
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname      = usePathname()
  const [open, setOpen] = useState(false)
  const { conversations, activeId, setActive, createConversation } = useConversationsStore()

  function handleNewChat() {
    createConversation('aria')
    if (pathname !== '/chat') window.location.href = '/chat'
    setOpen(false)
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className={cn(
        'flex flex-col w-56 shrink-0 border-r border-subtle bg-bg',
        'fixed inset-y-0 left-0 z-40 transition-transform duration-200',
        'md:relative md:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-subtle shrink-0">
          <span className="font-mono text-sm font-medium">
            <span style={{ color: '#8b5cf6' }}>synth</span>
            <span className="text-white/40">.ai</span>
          </span>
          <button onClick={() => setOpen(false)} className="md:hidden text-white/40 hover:text-white/70">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="px-2 py-3 border-b border-subtle shrink-0">
          {NAV.map((n) => {
            const active = pathname.startsWith(n.href)
            return (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                  active
                    ? 'bg-white/8 text-white'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/4'
                )}
              >
                {n.icon}
                {n.label}
              </Link>
            )
          })}
        </nav>

        {/* Recent conversations */}
        <div className="flex-1 overflow-y-auto px-2 py-3 min-h-0">
          <p className="px-3 mb-2 text-[10px] uppercase tracking-widest text-white/25 font-medium">Recent</p>
          {conversations.length === 0 && (
            <p className="px-3 text-xs text-white/25">No conversations yet</p>
          )}
          {conversations.slice(0, 20).map((c) => {
            const persona = getPersona(c.personaId)
            const isActive = c.id === activeId && pathname === '/chat'
            return (
              <button
                key={c.id}
                onClick={() => { setActive(c.id); if (pathname !== '/chat') window.location.href = '/chat'; setOpen(false) }}
                className={cn(
                  'w-full flex items-start gap-2.5 px-3 py-2 rounded-lg text-left transition-colors group',
                  isActive ? 'bg-white/8' : 'hover:bg-white/4'
                )}
              >
                <span className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium shrink-0 mt-0.5', persona.color, persona.textColor)}>
                  {persona.avatar}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/70 truncate leading-snug">{c.title}</p>
                  <p className="text-[10px] text-white/25 mt-0.5">{formatDate(c.updatedAt)}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* New chat */}
        <div className="px-2 py-3 border-t border-subtle shrink-0">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            New chat
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Mobile header */}
        <div className="md:hidden flex items-center px-4 h-14 border-b border-subtle shrink-0">
          <button onClick={() => setOpen(true)} className="text-white/50 hover:text-white mr-3">
            <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
          <span className="font-mono text-sm font-medium">
            <span style={{ color: '#8b5cf6' }}>synth</span>
            <span className="text-white/40">.ai</span>
          </span>
        </div>

        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  )
}
