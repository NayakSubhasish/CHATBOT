"use client"

export function StreamingLoader() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:0ms]" />
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:200ms]" />
        <span className="h-2 w-2 animate-thinking rounded-full bg-foreground [animation-delay:400ms]" />
      </div>
      <span className="text-sm text-muted-foreground">AI is typing...</span>
    </div>
  )
}

export function WaveLoader() {
  return (
    <div className="flex items-center gap-3 px-4 py-6">
      <div className="flex items-end gap-1 h-5">
        <span className="w-1 bg-foreground rounded-full animate-wave h-3 opacity-40 [animation-delay:0ms]" />
        <span className="w-1 bg-foreground rounded-full animate-wave h-4 opacity-60 [animation-delay:150ms]" />
        <span className="w-1 bg-foreground rounded-full animate-wave h-5 opacity-100 [animation-delay:300ms]" />
        <span className="w-1 bg-foreground rounded-full animate-wave h-4 opacity-60 [animation-delay:450ms]" />
        <span className="w-1 bg-foreground rounded-full animate-wave h-3 opacity-40 [animation-delay:600ms]" />
      </div>
      <span className="text-sm text-muted-foreground">AI is thinking...</span>
    </div>
  )
}
