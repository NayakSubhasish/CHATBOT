"use client"

import { Brain, Sparkles } from "lucide-react"

export function AppHeader() {
  return (
    <header className="relative z-[15] border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-8 w-8 rounded-full border border-foreground/20" />
              <Brain className="relative h-5 w-5 text-foreground" />
              <div className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-foreground/60" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                NeuralChat
              </h1>
              <p className="text-xs text-muted-foreground font-medium">
                crafted by <span className="text-foreground">Subhasish</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
            <Sparkles className="h-3 w-3" />
            <span className="font-mono">AI-Powered</span>
          </div>
          <div className="text-xs text-muted-foreground">
            <span className="font-mono">v1.0</span>
          </div>
        </div>
      </div>
    </header>
  )
}

