"use client"

export function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-6 text-sm text-muted-foreground">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:200ms]" />
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:400ms]" />
      </div>
      <span>Thinking...</span>
    </div>
  )
}
