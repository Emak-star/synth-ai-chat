'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Conversation, StoredMessage, PersonaId } from '@/types'
import { generateId, titleFromContent } from '@/lib/utils'

interface ConversationsStore {
  conversations:      Conversation[]
  activeId:           string | null

  // Actions
  createConversation: (personaId: PersonaId) => Conversation
  setActive:          (id: string) => void
  getActive:          () => Conversation | undefined
  addMessage:         (conversationId: string, msg: Omit<StoredMessage, 'id' | 'createdAt'>) => StoredMessage
  updateLastMessage:  (conversationId: string, content: string) => void
  autoTitle:          (conversationId: string) => void
  renameConversation: (id: string, title: string) => void
  deleteConversation: (id: string) => void
  clearAll:           () => void
}

export const useConversationsStore = create<ConversationsStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeId:      null,

      createConversation: (personaId) => {
        const conv: Conversation = {
          id:        generateId(),
          title:     'New conversation',
          personaId,
          messages:  [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((s) => ({ conversations: [conv, ...s.conversations], activeId: conv.id }))
        return conv
      },

      setActive: (id) => set({ activeId: id }),

      getActive: () => {
        const { conversations, activeId } = get()
        return conversations.find((c) => c.id === activeId)
      },

      addMessage: (conversationId, msg) => {
        const full: StoredMessage = {
          id:        generateId(),
          createdAt: new Date().toISOString(),
          ...msg,
        }
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, full], updatedAt: new Date().toISOString() }
              : c
          ),
        }))
        return full
      },

      updateLastMessage: (conversationId, content) => {
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const msgs    = [...c.messages]
            const lastIdx = msgs.length - 1
            if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
              msgs[lastIdx] = { ...msgs[lastIdx], content }
            }
            return { ...c, messages: msgs, updatedAt: new Date().toISOString() }
          }),
        }))
      },

      autoTitle: (conversationId) => {
        const conv = get().conversations.find((c) => c.id === conversationId)
        if (!conv || conv.title !== 'New conversation') return
        const firstUser = conv.messages.find((m) => m.role === 'user')
        if (!firstUser) return
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, title: titleFromContent(firstUser.content) }
              : c
          ),
        }))
      },

      renameConversation: (id, title) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        }))
      },

      deleteConversation: (id) => {
        set((s) => {
          const filtered = s.conversations.filter((c) => c.id !== id)
          const newActive = s.activeId === id ? (filtered[0]?.id ?? null) : s.activeId
          return { conversations: filtered, activeId: newActive }
        })
      },

      clearAll: () => set({ conversations: [], activeId: null }),
    }),
    { name: 'synth-conversations' }
  )
)
