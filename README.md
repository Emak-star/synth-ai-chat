# Synth — AI Chat Interface

A polished AI chat interface with multiple personas, streaming responses, markdown rendering, and an embeddable widget. Built as a portfolio project demonstrating production-grade AI integration.

**Live demo:** https://synth-ai-chat.vercel.app/chat

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Vercel AI SDK** — `useChat` for streaming, abort, message state
- **Claude API** (claude-sonnet-4-6) — one model, four personas via system prompts
- **react-markdown** + **react-syntax-highlighter** — markdown + code blocks
- **Zustand** — conversation history with localStorage persistence
- **Tailwind CSS** — dark design system

## Features

- 4 AI personas: Aria (assistant), Rex (code), Nova (creative), Sage (analyst)
- Real-time streaming with animated cursor
- Markdown rendering — headers, bold, lists, tables, blockquotes
- Syntax-highlighted code blocks with copy button
- Stop generation mid-stream
- Conversation history — searchable, renameable, deletable
- Persona switching mid-conversation
- Suggested prompts per persona
- Embed demo — mock SaaS dashboard with floating chat widget
- Fully responsive with mobile sidebar drawer

## Getting started

```bash
npm install
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY to .env.local
npm run dev
# → http://localhost:3000
```

## Deploy

Push to GitHub → import in Vercel → add `ANTHROPIC_API_KEY` env var → deploy.

## Project structure

```
src/
├── types/           # Persona, Conversation, StoredMessage
├── lib/
│   ├── personas.ts  # All 4 personas with system prompts
│   └── utils.ts     # generateId, formatDate, titleFromContent
├── store/
│   └── conversations.ts  # Zustand — full conversation history
├── components/
│   ├── layout/AppShell.tsx      # Sidebar, nav, recent convos
│   └── chat/
│       ├── MessageBubble.tsx    # Markdown + syntax highlighting
│       └── PersonaChip.tsx      # Inline persona switcher
└── app/
    ├── api/chat/route.ts   # Streaming API — per-persona system prompt
    ├── chat/page.tsx        # Main chat UI
    ├── personas/page.tsx    # Persona showcase
    ├── history/page.tsx     # Searchable conversation history
    └── embed/page.tsx       # Mock SaaS dashboard + floating widget
```

Built by [Emaks](https://github.com/Emak-star) · Next.js · TypeScript · Tailwind CSS
