import { NextRequest } from "next/server"

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCuWkcAta2MwxmaCu8edUByzymhXzuNJHE"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Build conversation history for context
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []
    
    if (history && Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === "user" || msg.role === "assistant") {
          contents.push({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }],
          })
        }
      }
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    })

    console.log("Calling Gemini API with:", { contents: contents.length, message: message.substring(0, 50) })

    // Use regular generateContent endpoint (more reliable)
    const response = await fetch(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.text()
      console.error("Gemini API error:", response.status, errorData)
      
      // Try to parse error as JSON
      let errorMessage = `API Error: ${response.status}`
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || errorData
      } catch {
        errorMessage = errorData || errorMessage
      }
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Parse the response
    const data = await response.json()
    console.log("Gemini API response:", data)
    
    const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                     data.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text ||
                     "Sorry, I couldn't generate a response."
    
    if (!fullText || fullText === "Sorry, I couldn't generate a response.") {
      console.error("No text in response:", data)
    }

    // Simulate streaming by chunking the text
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        const words = fullText.split(" ")
        for (let i = 0; i < words.length; i++) {
          const chunk = words[i] + (i < words.length - 1 ? " " : "")
          controller.enqueue(encoder.encode(chunk))
          await new Promise((resolve) => setTimeout(resolve, 30))
        }
        controller.close()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error: any) {
    console.error("Chat API error:", error)
    const errorMessage = error?.message || "Failed to generate response"
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
