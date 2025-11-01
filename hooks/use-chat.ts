"use client"

import { useState, useCallback, useEffect } from "react"
import { Message, ChatSession } from "@/types"
import { loadSessions, saveSession, deleteSession as deleteSessionStorage } from "@/lib/storage"

export function useChat(initialSessionId?: string) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load sessions from storage
  useEffect(() => {
    const loaded = loadSessions()
    setSessions(loaded)
    
    if (initialSessionId) {
      const session = loaded.find(s => s.id === initialSessionId)
      if (session) {
        setCurrentSession(session)
      }
    } else if (loaded.length > 0) {
      setCurrentSession(loaded[0])
    } else {
      createNewSession()
    }
  }, [initialSessionId])

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setCurrentSession(newSession)
    setSessions(prev => [newSession, ...prev])
    saveSession(newSession)
    return newSession
  }, [])

  const switchSession = useCallback((sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId)
    if (session) {
      setCurrentSession(session)
    }
  }, [sessions])

  const addMessage = useCallback((message: Omit<Message, "id" | "timestamp">, sessionId?: string) => {
    setSessions(prev => {
      const targetSessionId = sessionId || currentSession?.id
      if (!targetSessionId) return prev

      const session = prev.find(s => s.id === targetSessionId)
      if (!session) return prev

      const newMessage: Message = {
        ...message,
        id: `msg-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
      }

      const updatedSession: ChatSession = {
        ...session,
        messages: [...session.messages, newMessage],
        updatedAt: Date.now(),
        title: session.messages.length === 0 
          ? message.content.slice(0, 50) 
          : session.title,
      }

      saveSession(updatedSession)
      const newSessions = prev.map(s => s.id === updatedSession.id ? updatedSession : s)
      
      // Update current session if it matches
      setCurrentSession(prevSession => {
        if (prevSession?.id === targetSessionId) {
          return updatedSession
        }
        return prevSession
      })

      return newSessions
    })
  }, [currentSession])

  const updateMessage = useCallback((messageId: string, content: string) => {
    if (!currentSession) return

    const updatedSession: ChatSession = {
      ...currentSession,
      messages: currentSession.messages.map(msg =>
        msg.id === messageId ? { ...msg, content } : msg
      ),
      updatedAt: Date.now(),
    }

    setCurrentSession(updatedSession)
    setSessions(prev =>
      prev.map(s => s.id === updatedSession.id ? updatedSession : s)
    )
    saveSession(updatedSession)
  }, [currentSession])

  const deleteSession = useCallback((sessionId: string) => {
    deleteSessionStorage(sessionId)
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (currentSession?.id === sessionId) {
      const remaining = sessions.filter(s => s.id !== sessionId)
      setCurrentSession(remaining[0] || null)
      if (remaining.length === 0) {
        createNewSession()
      }
    }
  }, [currentSession, sessions, createNewSession])

  return {
    sessions,
    currentSession,
    isLoading,
    createNewSession,
    switchSession,
    addMessage,
    updateMessage,
    deleteSession,
    setIsLoading,
  }
}
