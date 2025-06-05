const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
require("dotenv").config()

const authRoutes = require("./routes/auth")
const carRoutes = require("./routes/cars")
const bookingRoutes = require("./routes/bookings")
const contactRoutes = require("./routes/contact")
const aiRoutes = require("./routes/ai")

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/cars", carRoutes)
app.use("/api/bookings", bookingRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/ai", aiRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "MileMaven API is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: "Something went wrong!",
    message: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" })
})

app.listen(PORT, () => {
  console.log(`🚗 MileMaven server running on port ${PORT}`)
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`)
})
