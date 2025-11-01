"use client"

import { useEffect, useRef, useState } from "react"
import { Message } from "@/types"

interface StickyHeaderProps {
  question: Message
  children: React.ReactNode
}

export function StickyHeader({ question, children }: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const header = headerRef.current

    if (!container || !header) return

    // Find the scroll container (ScrollArea viewport)
    const findScrollContainer = (): HTMLElement | null => {
      let parent = container.parentElement
      while (parent) {
        if (parent.dataset.radixScrollAreaViewport !== undefined) {
          return parent
        }
        parent = parent.parentElement
      }
      return null
    }

    scrollContainerRef.current = findScrollContainer()

    const handleScroll = () => {
      const scrollContainer = scrollContainerRef.current
      if (!container || !header) return

      const containerRect = container.getBoundingClientRect()
      const headerRect = header.getBoundingClientRect()
      
      if (scrollContainer) {
        const scrollContainerRect = scrollContainer.getBoundingClientRect()
        // Check if header should be sticky (when container top is above viewport top)
        if (containerRect.top <= scrollContainerRect.top && containerRect.bottom > scrollContainerRect.top + headerRect.height) {
          setIsSticky(true)
        } else {
          setIsSticky(false)
        }
      } else {
        // Fallback to window scroll
        if (containerRect.top <= 0 && containerRect.bottom > headerRect.height) {
          setIsSticky(true)
        } else {
          setIsSticky(false)
        }
      }
    }

    const scrollContainer = scrollContainerRef.current || globalThis
    scrollContainer.addEventListener("scroll", handleScroll, { passive: true })
    
    // Initial check
    handleScroll()

    return () => {
      if (scrollContainer && scrollContainer !== globalThis) {
        scrollContainer.removeEventListener("scroll", handleScroll)
      } else {
        globalThis.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={headerRef}
        className={`border-b border-border bg-background px-4 py-3 transition-all ${
          isSticky
            ? "sticky top-0 z-40 shadow-md"
            : "relative"
        }`}
      >
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-medium text-foreground line-clamp-2">{question.content}</p>
        </div>
      </div>
      {children}
    </div>
  )
}
