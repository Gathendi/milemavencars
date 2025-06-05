const express = require("express")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")

const router = express.Router()

// Submit contact form
router.post(
  "/",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("subject").trim().isLength({ min: 3 }).withMessage("Subject required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters"),
    body("phone").optional().isMobilePhone().withMessage("Valid phone number required if provided"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, phone, subject, message } = req.body

      // Save to database
      const result = await pool.query(
        "INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [name, email, phone || null, subject, message],
      )

      // Here you could also send an email notification
      // await sendContactNotification(result.rows[0]);

      res.status(201).json({
        message: "Contact form submitted successfully",
        id: result.rows[0].id,
      })
    } catch (error) {
      console.error("Error submitting contact form:", error)
      res.status(500).json({ error: "Failed to submit contact form" })
    }
  },
)

// Get contact messages (Admin only)
router.get("/", async (req, res) => {
  try {
    // In a real app, you'd add authentication middleware here
    const result = await pool.query("SELECT * FROM contact_messages ORDER BY created_at DESC")

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    res.status(500).json({ error: "Failed to fetch contact messages" })
  }
})

module.exports = router
