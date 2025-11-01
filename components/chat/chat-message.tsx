"use client"

import { Message } from "@/types"
import { Button } from "@/components/ui/button"
import { Copy, RefreshCw, Edit } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Artifact } from "./artifact"

interface ChatMessageProps {
  message: Message
  onCopy?: () => void
  onRegenerate?: () => void
  onEdit?: () => void
}

export function ChatMessage({ message, onCopy, onRegenerate, onEdit }: ChatMessageProps) {
  const { toast } = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    })
    onCopy?.()
  }

  const isUser = message.role === "user"

  return (
    <div className={`group relative flex gap-4 px-4 py-6 ${isUser ? "bg-transparent" : "bg-card/80"}`}>
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {isUser ? (
              <div className="text-sm text-foreground">{message.content}</div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <Artifact content={message.content} />
              </div>
            )}
          </div>
          {!isUser && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleCopy}
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </Button>
              {onRegenerate && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={onRegenerate}
                  title="Regenerate"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          {isUser && onEdit && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
                title="Edit"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
