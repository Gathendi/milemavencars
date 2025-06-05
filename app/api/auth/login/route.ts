import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

// Mock users - In production, this would be in your database
const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    password: "password123", // In production, this would be hashed
    role: "user",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@milemaven.co.ke",
    password: "admin123", // In production, this would be hashed
    role: "admin",
  },
]

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" },
    )

    // Return user data and token
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
