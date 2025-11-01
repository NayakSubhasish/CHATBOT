"use client"

import { useEffect, useRef, useState } from "react"
import { Message } from "@/types"
import { ChatMessage } from "./chat-message"
import { ThinkingIndicator } from "./thinking-indicator"
import { WaveLoader } from "./streaming-loader"
import { StickyHeader } from "./sticky-header"
import { PromptInput } from "./prompt-input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

interface ChatInterfaceProps {
  messages: Message[]
  isLoading: boolean
  onSend: (message: string) => void
  onStreamingComplete?: (content: string) => void
  onRegenerate?: (messageId: string) => void
  onEdit?: (messageId: string, newContent: string) => void
}

function buildHistory(messages: Message[]): Array<{ role: string; content: string }> {
  return messages.map(msg => ({
    role: msg.role,
    content: msg.content,
  }))
}

export function ChatInterface({
  messages,
  isLoading,
  onSend,
  onStreamingComplete,
  onRegenerate,
  onEdit,
}: ChatInterfaceProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [streamingMessage, setStreamingMessage] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const { toast } = useToast()

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, streamingMessage])

  const handleSend = async (content: string) => {
    // Add user message
    onSend(content)

    // Start streaming response - ensure loader shows immediately
    setStreamingMessage("")
    setIsStreaming(true)
    
    // Small delay to ensure state updates before API call
    await new Promise(resolve => setTimeout(resolve, 10))

    try {
      // Build conversation history (last 10 messages for context)
      const recentMessages = messages.slice(-10)
      const history = buildHistory(recentMessages)

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, history }),
      })

      // Check if response is an error
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error("No response body")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        accumulated += chunk
        setStreamingMessage(accumulated)
      }

      // Notify parent that streaming is complete
      if (accumulated) {
        onStreamingComplete?.(accumulated)
      } else {
        throw new Error("Empty response from server")
      }
      
      setStreamingMessage("")
      setIsStreaming(false)
    } catch (error: any) {
      console.error("Error streaming response:", error)
      const errorMessage = error?.message || "Failed to get response"
      
      // Show error toast
      toast({
        title: "Error",
        description: errorMessage,
      })
      
      setStreamingMessage("")
      setIsStreaming(false)
    }
  }

  // Group messages by question-answer pairs for sticky headers
  const messageGroups: Array<{ question: Message; answer?: Message }> = []
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      const question = messages[i]
      const answer = messages[i + 1]?.role === "assistant" ? messages[i + 1] : undefined
      messageGroups.push({ question, answer })
      if (answer) i++ // Skip the answer as we've processed it
    }
  }

  // Check if last message is a user message (meaning we're waiting for response)
  const lastMessage = messages[messages.length - 1]
  const isWaitingForResponse = isStreaming && lastMessage?.role === "user"
  
  // Debug logging
  console.log("Chat Interface State:", { 
    isStreaming, 
    messagesCount: messages.length, 
    lastMessageRole: lastMessage?.role,
    streamingMessageLength: streamingMessage.length 
  })

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="mx-auto max-w-3xl relative py-4">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 py-16">
              <div className="text-center">
                <h2 className="mb-2 text-2xl font-semibold">Start a conversation</h2>
                <p className="text-muted-foreground">
                  Type a message to begin chatting with the AI assistant.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messageGroups.map((group, idx) => {
                const isLastGroup = idx === messageGroups.length - 1
                const isLastUserMessage = lastMessage?.role === "user" && lastMessage?.id === group.question.id
                const showStreaming = isStreaming && isLastGroup && isLastUserMessage
                
                // If this group has an answer and we're not streaming, show normally
                if (group.answer && !showStreaming) {
                  return (
                    <StickyHeader key={`group-${idx}`} question={group.question}>
                      <div>
                        <ChatMessage message={group.question} />
                        <ChatMessage
                          message={group.answer}
                          onRegenerate={() => group.answer && onRegenerate?.(group.answer.id)}
                        />
                      </div>
                    </StickyHeader>
                  )
                }
                
                // Show question with streaming indicator if waiting for response
                return (
                  <StickyHeader key={`group-${idx}`} question={group.question}>
                    <div>
                      <ChatMessage message={group.question} />
                      {showStreaming && (
                        <div className="bg-card">
                          <div className="px-4 py-6">
                            {streamingMessage ? (
                              <div className="prose prose-invert max-w-none text-foreground">
                                {streamingMessage}
                                <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse align-middle" />
                              </div>
                            ) : (
                              <WaveLoader />
                            )}
                          </div>
                        </div>
                      )}
                      {!showStreaming && group.answer && (
                        <ChatMessage
                          message={group.answer}
                          onRegenerate={() => group.answer && onRegenerate?.(group.answer.id)}
                        />
                      )}
                    </div>
                  </StickyHeader>
                )
              })}
              {/* Show loader if streaming but no groups match */}
              {isStreaming && messageGroups.length === 0 && (
                <div className="bg-card">
                  <div className="px-4 py-6">
                    {streamingMessage ? (
                      <div className="prose prose-invert max-w-none text-foreground">
                        {streamingMessage}
                        <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse align-middle" />
                      </div>
                    ) : (
                      <WaveLoader />
                    )}
                  </div>
                </div>
              )}
              {/* Show loader if streaming and last message is user but not in groups */}
              {isStreaming && lastMessage?.role === "user" && !messageGroups.some(g => g.question.id === lastMessage.id) && (
                <div>
                  <ChatMessage message={lastMessage} />
                  <div className="bg-card">
                    <div className="px-4 py-6">
                      {streamingMessage ? (
                        <div className="prose prose-invert max-w-none text-foreground">
                          {streamingMessage}
                          <span className="inline-block w-2 h-4 ml-1 bg-foreground animate-pulse align-middle" />
                        </div>
                      ) : (
                        <WaveLoader />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {isLoading && <ThinkingIndicator />}
        </div>
      </ScrollArea>
      <div className="border-t border-border bg-background p-4">
        <div className="mx-auto max-w-3xl">
          <PromptInput onSend={handleSend} disabled={isLoading || isStreaming} />
        </div>
      </div>
    </div>
  )
}
