import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json()

    // In production, you would:
    // 1. Validate input data
    // 2. Check if user already exists
    // 3. Hash the password
    // 4. Save to database

    // Mock response
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { name, email, phone },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
