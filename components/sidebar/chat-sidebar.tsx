"use client"

import { ChatSession } from "@/types"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface ChatSidebarProps {
  sessions: ChatSession[]
  currentSessionId?: string
  onSelectSession: (sessionId: string) => void
  onDeleteSession: (sessionId: string) => void
  onNewChat: () => void
}

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: ChatSidebarProps) {
  return (
    <div className="relative z-[12] hidden h-full w-64 flex-col border-r border-border bg-card md:flex">
      <div className="border-b border-border p-4">
        <Button onClick={onNewChat} className="w-full" variant="default">
          <MessageSquare className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {sessions.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              No chats yet. Start a new conversation!
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative mb-1 rounded-lg border border-transparent transition-colors ${
                  currentSessionId === session.id
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                }`}
              >
                <button
                  onClick={() => onSelectSession(session.id)}
                  className="w-full px-3 py-2 text-left"
                >
                  <div className="truncate text-sm font-medium">{session.title}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {format(new Date(session.updatedAt), "MMM d, h:mm a")}
                  </div>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
