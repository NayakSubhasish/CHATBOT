"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { useQuery } from "@tanstack/react-query"
import { SearchResult, Person } from "@/types"
import { Popover, PopoverContent } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface PromptInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function PromptInput({ onSend, disabled }: PromptInputProps) {
  const [value, setValue] = useState("")
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [showMentions, setShowMentions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mentionQuery, setMentionQuery] = useState("")
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Check if we're in a mention context
  const checkMention = (text: string, cursor: number) => {
    const beforeCursor = text.slice(0, cursor)
    const mentionMatch = beforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setShowMentions(true)
      setShowAutocomplete(false)
      return true
    }
    
    setShowMentions(false)
    return false
  }

  // Search API
  const { data: searchResults = [] } = useQuery<SearchResult[]>({
    queryKey: ["search", value],
    queryFn: async () => {
      if (!value.trim() || showMentions) return []
      const res = await fetch(`/api/search?q=${encodeURIComponent(value)}&limit=5`)
      return res.json()
    },
    enabled: !!value.trim() && !showMentions,
  })

  // People API for mentions
  const { data: peopleResults = [] } = useQuery<Person[]>({
    queryKey: ["people", mentionQuery],
    queryFn: async () => {
      if (!showMentions) return []
      const res = await fetch(`/api/people?q=${encodeURIComponent(mentionQuery)}&limit=10`)
      return res.json()
    },
    enabled: showMentions,
  })

  useEffect(() => {
    if (searchResults.length > 0 && !showMentions) {
      setShowAutocomplete(true)
      setSelectedIndex(0)
    } else {
      setShowAutocomplete(false)
    }
  }, [searchResults, showMentions])

  useEffect(() => {
    if (peopleResults.length > 0 && showMentions) {
      setSelectedIndex(0)
    }
  }, [peopleResults, showMentions])

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const newCursor = e.target.selectionStart
    
    setValue(newValue)
    setCursorPosition(newCursor)
    
    checkMention(newValue, newCursor)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const results = showMentions ? peopleResults : searchResults
    const maxIndex = results.length - 1

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev < maxIndex ? prev + 1 : prev))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0))
    } else if (e.key === "Enter" && !e.shiftKey) {
      if (showAutocomplete || showMentions) {
        e.preventDefault()
        if (results[selectedIndex]) {
          handleSelectResult(results[selectedIndex])
        }
      } else if (value.trim()) {
        e.preventDefault()
        handleSend()
      }
    } else if (e.key === "Escape") {
      setShowAutocomplete(false)
      setShowMentions(false)
      inputRef.current?.focus()
    }
  }

  const handleSelectResult = (result: SearchResult | Person) => {
    if (showMentions && "name" in result) {
      // Insert mention
      const beforeCursor = value.slice(0, cursorPosition)
      const afterCursor = value.slice(cursorPosition)
      const mentionMatch = beforeCursor.match(/@(\w*)$/)
      
      if (mentionMatch) {
        const start = cursorPosition - mentionMatch[0].length
        const newValue = value.slice(0, start) + `@${result.name} ` + afterCursor
        setValue(newValue)
        setShowMentions(false)
        inputRef.current?.focus()
        setTimeout(() => {
          const newCursor = start + `@${result.name} `.length
          inputRef.current?.setSelectionRange(newCursor, newCursor)
        }, 0)
      }
    } else if (!showMentions && "title" in result) {
      setValue(result.title)
      setShowAutocomplete(false)
      inputRef.current?.focus()
    }
  }

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue("")
    setShowAutocomplete(false)
    setShowMentions(false)
  }

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text
    
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <strong key={i}>{part}</strong>
          ) : (
            part
          )
        )}
      </>
    )
  }

  return (
    <div className="relative">
      <div className="relative">
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onSelect={(e) => {
            const target = e.target as HTMLTextAreaElement
            setCursorPosition(target.selectionStart)
            checkMention(value, target.selectionStart)
          }}
          placeholder="Type a message or @ to mention someone..."
          disabled={disabled}
          rows={1}
          className="min-h-[52px] w-full resize-none rounded-lg border border-input bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
          }}
        />
        <Button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="absolute bottom-2 right-2 h-8"
          size="sm"
        >
          Send
        </Button>
      </div>

      {(showAutocomplete || showMentions) && (
        <Popover open={true}>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
            side="top"
          >
            <ScrollArea className="max-h-[300px]">
              {showMentions ? (
                <div className="p-1">
                  {peopleResults.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No people found
                    </div>
                  ) : (
                    peopleResults.map((person, idx) => (
                      <button
                        key={person.id}
                        onClick={() => handleSelectResult(person)}
                        className={`w-full rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                          idx === selectedIndex
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <div className="font-medium">{highlightMatch(person.name, mentionQuery)}</div>
                        {person.email && (
                          <div className="text-xs text-muted-foreground">{person.email}</div>
                        )}
                      </button>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-1">
                  {searchResults.length === 0 ? (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No results found
                    </div>
                  ) : (
                    searchResults.map((result, idx) => (
                      <button
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        className={`w-full rounded-sm px-3 py-2 text-left text-sm transition-colors ${
                          idx === selectedIndex
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <div className="font-medium">
                          {highlightMatch(result.title, value)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {result.description}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
