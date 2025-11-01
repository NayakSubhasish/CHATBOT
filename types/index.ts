export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
}

export interface Artifact {
  id: string
  type: "code" | "markdown" | "text"
  content: string
  expanded: boolean
}

export interface SearchResult {
  id: string
  title: string
  description: string
  matchedText?: string
}

export interface Person {
  id: string
  name: string
  email?: string
  avatar?: string
}
