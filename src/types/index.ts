export type PersonaId = 'aria' | 'rex' | 'nova' | 'sage'

export interface Persona {
  id:           PersonaId
  name:         string
  role:         string
  description:  string
  systemPrompt: string
  color:        string   // tailwind bg class for avatar
  textColor:    string   // tailwind text class for avatar
  accentHex:    string   // raw hex for borders / highlights
  avatar:       string   // initials
  greeting:     string   // opening message shown in empty state
  suggestions:  string[] // suggested prompts shown in empty state
}

export interface StoredMessage {
  id:        string
  role:      'user' | 'assistant'
  content:   string
  createdAt: string // ISO
}

export interface Conversation {
  id:         string
  title:      string
  personaId:  PersonaId
  messages:   StoredMessage[]
  createdAt:  string
  updatedAt:  string
}
