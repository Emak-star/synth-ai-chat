'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { getPersona } from '@/lib/personas'

// ─── Mock dashboard data ──────────────────────────────────────────────────────
const METRICS = [
  { label: 'Monthly active users', value: '12,483', change: '+8.2%', up: true },
  { label: 'Revenue (MRR)',        value: '$48,200', change: '+12.1%', up: true },
  { label: 'Churn rate',           value: '2.1%',   change: '-0.3%',  up: false },
  { label: 'Avg session (min)',    value: '6.4',    change: '+0.8',   up: true },
]

const TABLE_DATA = [
  { company: 'Acme Corp',         plan: 'Pro',        users: 24, mrr: '$480',   status: 'Active' },
  { company: 'Globex Inc',        plan: 'Enterprise', users: 142, mrr: '$2,840', status: 'Active' },
  { company: 'Initech',           plan: 'Pro',        users: 8,  mrr: '$160',   status: 'Trial' },
  { company: 'Umbrella LLC',      plan: 'Starter',    users: 3,  mrr: '$60',    status: 'Active' },
  { company: 'Stark Industries',  plan: 'Enterprise', users: 310, mrr: '$6,200', status: 'Active' },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EmbedPage() {
  const [widgetOpen, setWidgetOpen] = useState(false)
  const persona = getPersona('aria')

  return (
    <div className="h-full overflow-y-auto bg-[#0f0f1a]">

      {/* Explainer banner */}
      <div className="bg-violet-600/10 border-b border-violet-500/20 px-6 py-3">
        <p className="text-xs text-violet-300 text-center">
          <span className="font-medium">Embed demo</span> — This is a mock SaaS dashboard showing how the Synth chat widget would look embedded in a real product. Click the button in the bottom-right corner.
        </p>
      </div>

      {/* Mock dashboard */}
      <div className="flex h-full">

        {/* Mock sidebar */}
        <div className="w-48 shrink-0 border-r border-white/5 bg-[#0a0a12] px-3 py-5 hidden md:flex flex-col gap-1">
          <div className="px-3 mb-5">
            <p className="font-mono text-sm font-medium text-white/60">
              <span className="text-blue-400">pulse</span>.io
            </p>
          </div>
          {['Overview', 'Customers', 'Revenue', 'Analytics', 'Settings'].map((item, i) => (
            <div key={item} className={`px-3 py-2 rounded-lg text-sm cursor-pointer ${i === 0 ? 'bg-white/8 text-white/80' : 'text-white/35 hover:text-white/55 hover:bg-white/4'} transition-colors`}>
              {item}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 px-6 py-8 overflow-y-auto min-w-0">
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-xl font-medium text-white/80">Overview</h1>
                <p className="text-xs text-white/35 mt-1">Last 30 days · Updated 2 min ago</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-white/5 rounded-lg border border-white/8" />
                <div className="h-8 w-8 bg-white/5 rounded-lg border border-white/8 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-blue-400/60" />
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {METRICS.map((m) => (
                <div key={m.label} className="bg-white/3 border border-white/6 rounded-xl p-4">
                  <p className="text-[11px] text-white/35 mb-2">{m.label}</p>
                  <p className="text-2xl font-medium text-white/80 mb-1">{m.value}</p>
                  <p className={`text-[11px] font-medium ${m.up ? 'text-emerald-400' : 'text-red-400'}`}>
                    {m.change} vs last month
                  </p>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="bg-white/3 border border-white/6 rounded-xl p-5 mb-8">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/60 font-medium">Revenue over time</p>
                <div className="flex gap-2">
                  {['1W', '1M', '3M', '1Y'].map((t, i) => (
                    <button key={t} className={`text-[11px] px-2.5 py-1 rounded-md ${i === 1 ? 'bg-white/10 text-white/70' : 'text-white/30 hover:text-white/50'} transition-colors`}>{t}</button>
                  ))}
                </div>
              </div>
              {/* SVG sparkline */}
              <div className="h-32 flex items-end gap-1.5">
                {[30, 45, 38, 55, 48, 62, 58, 72, 65, 80, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all"
                    style={{
                      height: `${h}%`,
                      background: i === 11 ? '#818cf8' : 'rgba(255,255,255,0.06)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white/3 border border-white/6 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/6">
                <p className="text-sm text-white/60 font-medium">Top customers</p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Company', 'Plan', 'Users', 'MRR', 'Status'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] uppercase tracking-wider text-white/25 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_DATA.map((row, i) => (
                    <tr key={i} className="border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors">
                      <td className="px-5 py-3 text-sm text-white/65">{row.company}</td>
                      <td className="px-5 py-3 text-xs text-white/40">{row.plan}</td>
                      <td className="px-5 py-3 text-sm text-white/55">{row.users}</td>
                      <td className="px-5 py-3 text-sm text-white/65">{row.mrr}</td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${
                          row.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chat widget */}
      <ChatWidget open={widgetOpen} onClose={() => setWidgetOpen(false)} persona={persona} />

      {/* Trigger button */}
      {!widgetOpen && (
        <button
          onClick={() => setWidgetOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-30"
          aria-label="Open Synth AI"
          style={{ boxShadow: '0 0 0 3px rgba(139,92,246,0.2), 0 8px 24px rgba(0,0,0,0.4)' }}
        >
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      )}
    </div>
  )
}

// ─── Embedded chat widget ─────────────────────────────────────────────────────
function ChatWidget({
  open,
  onClose,
  persona,
}: {
  open: boolean
  onClose: () => void
  persona: ReturnType<typeof getPersona>
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const { messages, input, setInput, isLoading, stop, append } = useChat({
    api: '/api/chat',
    body: { personaId: 'aria' },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const content = input.trim()
    if (!content || isLoading) return
    setInput('')
    await append({ role: 'user', content })
  }

  if (!open) return null

  return (
    <div
      className="fixed bottom-6 right-6 w-80 sm:w-96 flex flex-col bg-[#13131f] border border-white/10 rounded-2xl overflow-hidden z-40"
      style={{
        height: 520,
        boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 24px 48px rgba(0,0,0,0.6)',
      }}
    >
      {/* Widget header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 shrink-0 bg-[#1a1a2a]">
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${persona.color} ${persona.textColor}`}>
            {persona.avatar}
          </div>
          <div>
            <p className="text-xs font-medium text-white/80">{persona.name} · Synth AI</p>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[10px] text-white/35">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isLoading && (
            <button onClick={stop} className="p-1.5 text-white/30 hover:text-white/60 transition-colors" aria-label="Stop">
              <svg width={12} height={12} viewBox="0 0 24 24" fill="currentColor">
                <rect x="4" y="4" width="16" height="16" rx="2"/>
              </svg>
            </button>
          )}
          <button onClick={onClose} className="p-1.5 text-white/30 hover:text-white/60 transition-colors" aria-label="Close">
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <p className="text-xs text-white/35 leading-relaxed">
              Ask me anything about your dashboard — metrics, customers, trends, or how to improve your product.
            </p>
            {['What drove my churn increase?', 'Summarise this month\'s performance', 'Which customers are at risk?'].map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); setTimeout(() => append({ role: 'user', content: s }), 0) }}
                className="block w-full mt-2 text-left text-xs text-white/40 hover:text-white/60 bg-white/3 hover:bg-white/6 border border-white/8 rounded-xl px-3 py-2 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => {
          const isUser      = m.role === 'user'
          const isStreaming = isLoading && i === messages.length - 1 && !isUser
          return (
            <div key={m.id} className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`rounded-xl px-3 py-2 max-w-[85%] text-xs leading-relaxed ${
                isUser
                  ? 'bg-violet-600 text-white rounded-tr-sm'
                  : 'bg-white/6 text-white/75 rounded-tl-sm'
              }`}>
                {isUser ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <div className="prose-chat" style={{ fontSize: 12 }}>
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                    {isStreaming && (
                      <span className="inline-block w-0.5 h-3 bg-violet-400 ml-0.5 animate-blink align-text-bottom" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 pb-3 pt-2 border-t border-white/8 shrink-0">
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2 focus-within:border-white/15 transition-colors">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
            placeholder="Ask anything…"
            className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-all disabled:opacity-25"
            style={{ background: input.trim() && !isLoading ? '#8b5cf6' : 'rgba(255,255,255,0.08)' }}
          >
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-[9px] text-white/20 text-center mt-1.5">Powered by Synth AI</p>
      </div>
    </div>
  )
}
