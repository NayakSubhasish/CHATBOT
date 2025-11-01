import { ChatSession } from "@/types"

const STORAGE_KEY = "chatbot_sessions"

export function saveSessions(sessions: ChatSession[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  }
}

export function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return []
  
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function saveSession(session: ChatSession): void {
  const sessions = loadSessions()
  const index = sessions.findIndex(s => s.id === session.id)
  
  if (index >= 0) {
    sessions[index] = session
  } else {
    sessions.push(session)
  }
  
  saveSessions(sessions)
}

export function deleteSession(sessionId: string): void {
  const sessions = loadSessions().filter(s => s.id !== sessionId)
  saveSessions(sessions)
}

export function clearAllSessions(): void {
  saveSessions([])
}
