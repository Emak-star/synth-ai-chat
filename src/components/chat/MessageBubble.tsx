'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { formatTime } from '@/lib/utils'
import { getPersona } from '@/lib/personas'
import type { PersonaId } from '@/types'

interface Props {
  role:      'user' | 'assistant'
  content:   string
  createdAt?: string
  personaId?: PersonaId
  isStreaming?: boolean
}

export default function MessageBubble({ role, content, createdAt, personaId, isStreaming }: Props) {
  const isUser  = role === 'user'
  const persona = personaId ? getPersona(personaId) : null

  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-1">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-medium text-white/60">
            You
          </div>
        ) : (
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${persona?.color ?? 'bg-violet-500/20'} ${persona?.textColor ?? 'text-violet-300'}`}>
            {persona?.avatar ?? 'AI'}
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-violet-600 text-white rounded-tr-sm'
            : 'bg-surface border border-subtle rounded-tl-sm'
        }`}>
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                components={{
                  code({ className, children, ...rest }) {
                    const match  = /language-(\w+)/.exec(className ?? '')
                    const lang   = match?.[1] ?? ''
                    const code   = String(children).replace(/\n$/, '')
                    const isBlock = code.includes('\n') || !!match

                    if (isBlock) {
                      return (
                        <CodeBlock lang={lang} code={code} />
                      )
                    }
                    return (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-blink align-text-bottom" />
              )}
            </div>
          )}
        </div>
        {createdAt && (
          <p className="text-[10px] text-white/25 px-1">{formatTime(createdAt)}</p>
        )}
      </div>
    </div>
  )
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative rounded-lg overflow-hidden my-2">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-subtle">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">{lang || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[10px] text-white/40 hover:text-white/70 transition-colors"
        >
          {copied ? (
            <>
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={lang || 'text'}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '12px',
          padding: '1rem',
          background: 'rgba(0,0,0,0.4)',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
