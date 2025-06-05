import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simple rule-based responses - In production, integrate with OpenAI API
    let response = "I'd be happy to help you find the perfect car!"

    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("business") || lowerMessage.includes("work") || lowerMessage.includes("meeting")) {
      response =
        "For business trips, I recommend our Toyota Corolla or Honda Civic. They're professional, fuel-efficient, and perfect for city driving. Would you like me to check availability?"
    } else if (lowerMessage.includes("family") || lowerMessage.includes("kids") || lowerMessage.includes("children")) {
      response =
        "For family trips, our Toyota Prado or Nissan X-Trail would be perfect! They have plenty of space for passengers and luggage. The Prado seats 7 people if you need extra room."
    } else if (
      lowerMessage.includes("safari") ||
      lowerMessage.includes("adventure") ||
      lowerMessage.includes("off-road")
    ) {
      response =
        "For safari and adventure trips, I highly recommend the Toyota Prado or Subaru Forester. They're built for rough terrain and provide excellent ground clearance."
    } else if (
      lowerMessage.includes("budget") ||
      lowerMessage.includes("cheap") ||
      lowerMessage.includes("affordable")
    ) {
      response =
        "For budget-friendly options, check out our Volkswagen Polo starting at KSh 2,800/day or the Toyota Corolla at KSh 3,500/day. Both offer great value!"
    } else if (lowerMessage.includes("luxury") || lowerMessage.includes("premium")) {
      response =
        "For a premium experience, our Toyota Prado offers luxury and comfort at KSh 8,000/day. It's perfect for special occasions or executive travel."
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI Assistant error:", error)
    return NextResponse.json(
      {
        response: "I'm sorry, I'm having trouble right now. Please contact our support team for assistance.",
      },
      { status: 500 },
    )
  }
}
