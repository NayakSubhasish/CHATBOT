"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Trash2, Settings } from "lucide-react"

interface CommandMenuProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewChat: () => void
  onClearHistory: () => void
}

const commands = [
  {
    id: "new-chat",
    label: "New Chat",
    icon: MessageSquare,
    action: (onNewChat: () => void) => onNewChat(),
  },
  {
    id: "clear-history",
    label: "Clear History",
    icon: Trash2,
    action: (onClearHistory: () => void) => onClearHistory(),
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    action: () => {},
  },
]

export function CommandMenu({ open, onOpenChange, onNewChat, onClearHistory }: CommandMenuProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    setSelectedIndex(0)
  }, [searchQuery])

  const handleSelectCommand = useCallback((command: typeof commands[0]) => {
    if (command.id === "new-chat") {
      command.action(onNewChat)
    } else if (command.id === "clear-history") {
      command.action(onClearHistory)
    }
    onOpenChange(false)
    setSearchQuery("")
  }, [onNewChat, onClearHistory, onOpenChange])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange(!open)
      }

      if (open) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          )
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        } else if (e.key === "Enter") {
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            handleSelectCommand(filteredCommands[selectedIndex])
          }
        }
      }
    }

    globalThis.addEventListener("keydown", handleKeyDown)
    return () => globalThis.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedIndex, filteredCommands, onOpenChange, onNewChat, onClearHistory, handleSelectCommand])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Command Menu</DialogTitle>
          <DialogDescription>
            Search for actions and navigate with keyboard
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <ScrollArea className="h-[300px]">
            <div className="space-y-1">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No commands found
                </div>
              ) : (
                filteredCommands.map((command, idx) => {
                  const Icon = command.icon
                  return (
                    <button
                      key={command.id}
                      onClick={() => handleSelectCommand(command)}
                      className={`flex w-full items-center gap-3 rounded-lg border border-transparent px-4 py-3 text-left transition-colors ${
                        idx === selectedIndex
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{command.label}</span>
                    </button>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
