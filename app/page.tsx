"use client"

import { useState } from "react"
import { useChat } from "@/hooks/use-chat"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/sidebar/chat-sidebar"
import { CommandMenu } from "@/components/command-menu"
import { useToast } from "@/hooks/use-toast"
import { clearAllSessions } from "@/lib/storage"
import { AppHeader } from "@/components/header/app-header"

export default function Home() {
  const {
    sessions,
    currentSession,
    createNewSession,
    switchSession,
    addMessage,
    updateMessage,
    deleteSession,
  } = useChat()
  
  const [commandMenuOpen, setCommandMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSend = (content: string) => {
    if (!currentSession) {
      const newSession = createNewSession()
      // Add message to the newly created session
      setTimeout(() => {
        addMessage({ role: "user", content }, newSession.id)
      }, 0)
      return
    }

    // Add user message
    addMessage({ role: "user", content })
  }

  const handleStreamingComplete = (content: string) => {
    if (currentSession) {
      addMessage({ role: "assistant", content }, currentSession.id)
    }
  }

  const handleRegenerate = async (messageId: string) => {
    if (!currentSession) return

    const userMessage = currentSession.messages.find(
      (m, idx) => idx > 0 && currentSession.messages[idx - 1].id === messageId && m.role === "user"
    )

    if (!userMessage) return

    setIsLoading(true)
    try {
      // Build conversation history up to the message being regenerated
      const messageIndex = currentSession.messages.findIndex(m => m.id === messageId)
      const historyMessages = currentSession.messages.slice(0, messageIndex - 1)
      const history = historyMessages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content, history }),
      })

      if (!response.body) return

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value)
      }

      // Update the assistant message
      updateMessage(messageId, accumulated)
      setIsLoading(false)
    } catch (error) {
      console.error("Error regenerating:", error)
      setIsLoading(false)
    }
  }

  const handleClearHistory = () => {
    clearAllSessions()
    createNewSession()
    toast({
      title: "History cleared",
      description: "All chat sessions have been deleted.",
    })
    setCommandMenuOpen(false)
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-black">
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          backgroundImage: `
            radial-gradient(circle at 1px 1px, hsl(0, 0%, 80%) 2px, transparent 0)
          `,
          backgroundSize: '48px 48px',
          opacity: 0.25,
        }}
      />
      <AppHeader />
      <div className="relative z-[10] flex flex-1 overflow-hidden">
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          onSelectSession={switchSession}
          onDeleteSession={deleteSession}
          onNewChat={createNewSession}
        />
        <main className="relative z-[5] flex flex-1 flex-col overflow-hidden">
          {currentSession ? (
            <ChatInterface
              messages={currentSession.messages}
              isLoading={isLoading}
              onSend={handleSend}
              onStreamingComplete={handleStreamingComplete}
              onRegenerate={handleRegenerate}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No active session</p>
            </div>
          )}
        </main>
      </div>
      <CommandMenu
        open={commandMenuOpen}
        onOpenChange={setCommandMenuOpen}
        onNewChat={createNewSession}
        onClearHistory={handleClearHistory}
      />
    </div>
  )
}
