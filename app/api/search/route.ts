import { NextRequest, NextResponse } from "next/server"
import { SearchResult } from "@/types"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "React Query Best Practices",
      description: "Learn how to use React Query effectively in your Next.js applications",
      matchedText: query,
    },
    {
      id: "2",
      title: "Next.js 14 App Router Guide",
      description: "Complete guide to building applications with Next.js 14 App Router",
      matchedText: query,
    },
    {
      id: "3",
      title: "TypeScript Advanced Patterns",
      description: "Advanced TypeScript patterns for modern web development",
      matchedText: query,
    },
    {
      id: "4",
      title: "Tailwind CSS Customization",
      description: "How to customize Tailwind CSS for your design system",
      matchedText: query,
    },
    {
      id: "5",
      title: "shadcn/ui Components",
      description: "Building beautiful UI with shadcn/ui components library",
      matchedText: query,
    },
  ]

  // Filter based on query
  const filtered = query
    ? mockResults.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase()) ||
        r.description.toLowerCase().includes(query.toLowerCase())
      )
    : mockResults

  // Add delay to simulate network
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json(filtered.slice(0, limit))
}
