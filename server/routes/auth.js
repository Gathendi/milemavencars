const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

const router = express.Router()

// Register
router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().withMessage("Valid email required"),
    body("phone").isMobilePhone().withMessage("Valid phone number required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, phone, password } = req.body

      // Check if user already exists
      const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "User already exists with this email" })
      }

      // Hash password
      const saltRounds = 12
      const passwordHash = await bcrypt.hash(password, saltRounds)

      // Create user
      const result = await pool.query(
        "INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
        [name, email, phone, passwordHash],
      )

      const user = result.rows[0]

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      })

      res.status(201).json({
        message: "User registered successfully",
        user,
        token,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ error: "Registration failed" })
    }
  },
)

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { email, password } = req.body

      // Get user from database
      const result = await pool.query("SELECT id, name, email, password_hash, role FROM users WHERE email = $1", [
        email,
      ])

      if (result.rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      const user = result.rows[0]

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash)
      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      })

      // Remove password from response
      const { password_hash, ...userWithoutPassword } = user

      res.json({
        message: "Login successful",
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  },
)

// Get current user
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router
