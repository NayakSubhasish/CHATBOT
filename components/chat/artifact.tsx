"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ArtifactProps {
  content: string
}

export function Artifact({ content }: ArtifactProps) {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<number>>(new Set())

  const toggleBlock = (index: number) => {
    setExpandedBlocks(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  // Parse content for code blocks and markdown
  const parseContent = (text: string) => {
    const parts: Array<{ type: "text" | "code" | "markdown"; content: string; lang?: string }> = []
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    let lastIndex = 0
    let match
    let blockIndex = 0

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index)
        if (textContent.trim()) {
          parts.push({ type: "text", content: textContent })
        }
      }

      // Add code block
      const lang = match[1] || "text"
      const code = match[2]
      parts.push({
        type: "code",
        content: code,
        lang,
      })
      blockIndex++

      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const textContent = text.slice(lastIndex)
      if (textContent.trim()) {
        parts.push({ type: "text", content: textContent })
      }
    }

    // If no code blocks found, return as plain text
    if (parts.length === 0) {
      parts.push({ type: "text", content: text })
    }

    return parts
  }

  const renderText = (text: string) => {
    // Simple markdown rendering
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let inBold = false

    lines.forEach((line, lineIdx) => {
      if (line.trim() === "") {
        elements.push(<br key={`br-${lineIdx}`} />)
        return
      }

      const parts: React.ReactNode[] = []
      const boldRegex = /\*\*(.+?)\*\*/g
      let lastIndex = 0
      let match

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index))
        }
        parts.push(<strong key={`bold-${lineIdx}-${match.index}`}>{match[1]}</strong>)
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex))
      }

      elements.push(
        <p key={`line-${lineIdx}`} className="mb-2 last:mb-0">
          {parts.length > 0 ? parts : line}
        </p>
      )
    })

    return <div>{elements}</div>
  }

  const renderCode = (code: string, lang: string, index: number) => {
    const isExpanded = expandedBlocks.has(index)
    const previewLines = code.split("\n").slice(0, 3)
    const hasMore = code.split("\n").length > 3

    return (
      <div key={`code-${index}`} className="my-4 rounded-lg border border-border bg-secondary/50">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs text-muted-foreground">{lang}</span>
          {hasMore && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => toggleBlock(index)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-1 h-3 w-3" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Expand
                </>
              )}
            </Button>
          )}
        </div>
        <pre className="overflow-x-auto p-4 text-sm">
          <code>{isExpanded || !hasMore ? code : previewLines.join("\n") + "\n..."}</code>
        </pre>
      </div>
    )
  }

  const parts = parseContent(content)
  let codeBlockIndex = 0

  return (
    <div className="text-foreground">
      {parts.map((part, idx) => {
        if (part.type === "code") {
          const currentIndex = codeBlockIndex++
          return renderCode(part.content, part.lang || "text", currentIndex)
        }
        return (
          <div key={`text-${idx}`}>
            {renderText(part.content)}
          </div>
        )
      })}
    </div>
  )
}
