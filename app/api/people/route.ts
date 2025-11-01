import { NextRequest, NextResponse } from "next/server"
import { Person } from "@/types"

// Generate mock names for 1M people
function generateMockPeople(query: string, limit: number): Person[] {
  const firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
  ]

  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson", "Anderson", "Thomas", "Taylor",
    "Moore", "Jackson", "Martin", "Lee", "Thompson", "White", "Harris", "Sanchez",
    "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King",
    "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams",
  ]

  const people: Person[] = []
  const seen = new Set<string>()

  // Generate combinations
  for (let i = 0; i < 10000 && people.length < limit; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const name = `${firstName} ${lastName}`
    const key = name.toLowerCase()

    if (!seen.has(key)) {
      seen.add(key)
      const fullName = name.toLowerCase()
      if (!query || fullName.includes(query.toLowerCase())) {
        people.push({
          id: `person-${people.length}`,
          name,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
        })
      }
    }
  }

  return people.slice(0, limit)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 150))

  const people = generateMockPeople(query, limit)

  return NextResponse.json(people)
}
