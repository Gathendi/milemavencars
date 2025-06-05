const express = require("express")
const { body, validationResult } = require("express-validator")

const router = express.Router()

// AI Assistant endpoint
router.post(
  "/assistant",
  [body("message").trim().isLength({ min: 1 }).withMessage("Message required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { message } = req.body
      const lowerMessage = message.toLowerCase()

      // Rule-based AI responses (can be replaced with OpenAI API)
      let response = "I'd be happy to help you find the perfect car for your needs!"

      if (lowerMessage.includes("business") || lowerMessage.includes("work") || lowerMessage.includes("meeting")) {
        response =
          "For business trips, I recommend our Toyota Corolla (KSh 3,500/day) or Honda Civic (KSh 4,000/day). They're professional, fuel-efficient, and perfect for city driving. Would you like me to check availability for specific dates?"
      } else if (
        lowerMessage.includes("family") ||
        lowerMessage.includes("kids") ||
        lowerMessage.includes("children")
      ) {
        response =
          "For family trips, our Toyota Prado (KSh 8,000/day) or Nissan X-Trail (KSh 6,500/day) would be perfect! They have plenty of space for passengers and luggage. The Prado seats 7 people if you need extra room."
      } else if (
        lowerMessage.includes("safari") ||
        lowerMessage.includes("adventure") ||
        lowerMessage.includes("off-road")
      ) {
        response =
          "For safari and adventure trips, I highly recommend the Toyota Prado (KSh 8,000/day) or Subaru Forester (KSh 7,000/day). They're built for rough terrain and provide excellent ground clearance for Kenya's diverse landscapes."
      } else if (
        lowerMessage.includes("budget") ||
        lowerMessage.includes("cheap") ||
        lowerMessage.includes("affordable")
      ) {
        response =
          "For budget-friendly options, check out our Volkswagen Polo starting at KSh 2,800/day or the Toyota Corolla at KSh 3,500/day. Both offer excellent value and reliability!"
      } else if (
        lowerMessage.includes("luxury") ||
        lowerMessage.includes("premium") ||
        lowerMessage.includes("executive")
      ) {
        response =
          "For a premium experience, our Mercedes-Benz C-Class (KSh 12,000/day) offers luxury and comfort. It's perfect for special occasions or executive travel with top-tier amenities."
      } else if (
        lowerMessage.includes("group") ||
        lowerMessage.includes("many people") ||
        lowerMessage.includes("large")
      ) {
        response =
          "For group travel, our Toyota Hiace (KSh 5,500/day) can accommodate up to 14 passengers. It's perfect for group trips, events, or airport transfers."
      } else if (lowerMessage.includes("airport") || lowerMessage.includes("pickup") || lowerMessage.includes("jkia")) {
        response =
          "For airport transfers, I recommend our Toyota Corolla for individuals or Toyota Prado for families. We offer convenient pickup and drop-off services at JKIA and other major locations in Nairobi."
      } else if (lowerMessage.includes("nairobi") || lowerMessage.includes("city")) {
        response =
          "For Nairobi city driving, our compact cars like the Toyota Corolla or Volkswagen Polo are ideal. They're easy to navigate through traffic and have excellent fuel efficiency for city conditions."
      } else if (lowerMessage.includes("mombasa") || lowerMessage.includes("coast") || lowerMessage.includes("beach")) {
        response =
          "For trips to Mombasa or the coast, I recommend our Toyota Prado or Nissan X-Trail. They're comfortable for long drives and perfect for beach excursions with ample luggage space."
      }

      res.json({ response })
    } catch (error) {
      console.error("AI Assistant error:", error)
      res.status(500).json({
        response:
          "I'm sorry, I'm having trouble right now. Please contact our support team at +254 700 123 456 for immediate assistance.",
      })
    }
  },
)

module.exports = router
