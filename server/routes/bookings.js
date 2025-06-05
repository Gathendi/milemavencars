const express = require("express")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get user bookings
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.name as car_name, c.category, c.image_url 
       FROM bookings b 
       JOIN cars c ON b.car_id = c.id 
       WHERE b.user_id = $1 
       ORDER BY b.created_at DESC`,
      [req.user.id],
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching bookings:", error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

// Get all bookings (Admin only)
router.get("/admin", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, c.name as car_name, c.category, u.name as user_name, u.email as user_email
       FROM bookings b 
       JOIN cars c ON b.car_id = c.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC`,
    )

    res.json(result.rows)
  } catch (error) {
    console.error("Error fetching admin bookings:", error)
    res.status(500).json({ error: "Failed to fetch bookings" })
  }
})

// Create booking
router.post(
  "/",
  authenticateToken,
  [
    body("car_id").isInt().withMessage("Valid car ID required"),
    body("start_date").isISO8601().withMessage("Valid start date required"),
    body("end_date").isISO8601().withMessage("Valid end date required"),
    body("start_time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid start time required"),
    body("end_time")
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage("Valid end time required"),
    body("pickup_location").trim().isLength({ min: 3 }).withMessage("Pickup location required"),
    body("dropoff_location").trim().isLength({ min: 3 }).withMessage("Dropoff location required"),
    body("driver_license").trim().isLength({ min: 5 }).withMessage("Driver license required"),
    body("phone_number").isMobilePhone().withMessage("Valid phone number required"),
    body("total_amount").isNumeric().withMessage("Valid total amount required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const {
        car_id,
        start_date,
        end_date,
        start_time,
        end_time,
        pickup_location,
        dropoff_location,
        driver_license,
        phone_number,
        special_requests,
        total_amount,
      } = req.body

      // Check if car exists and is available
      const carResult = await pool.query("SELECT id, available, price FROM cars WHERE id = $1", [car_id])

      if (carResult.rows.length === 0) {
        return res.status(404).json({ error: "Car not found" })
      }

      if (!carResult.rows[0].available) {
        return res.status(400).json({ error: "Car is not available" })
      }

      // Check for conflicting bookings
      const conflictResult = await pool.query(
        `SELECT id FROM bookings 
       WHERE car_id = $1 
       AND status NOT IN ('cancelled') 
       AND (
         (start_date <= $2 AND end_date >= $2) OR
         (start_date <= $3 AND end_date >= $3) OR
         (start_date >= $2 AND end_date <= $3)
       )`,
        [car_id, start_date, end_date],
      )

      if (conflictResult.rows.length > 0) {
        return res.status(400).json({ error: "Car is already booked for selected dates" })
      }

      // Create booking
      const result = await pool.query(
        `INSERT INTO bookings (
        user_id, car_id, start_date, end_date, start_time, end_time,
        pickup_location, dropoff_location, driver_license, phone_number,
        special_requests, total_amount, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'confirmed') 
      RETURNING *`,
        [
          req.user.id,
          car_id,
          start_date,
          end_date,
          start_time,
          end_time,
          pickup_location,
          dropoff_location,
          driver_license,
          phone_number,
          special_requests || null,
          total_amount,
        ],
      )

      res.status(201).json({
        message: "Booking created successfully",
        booking: result.rows[0],
      })
    } catch (error) {
      console.error("Error creating booking:", error)
      res.status(500).json({ error: "Failed to create booking" })
    }
  },
)

// Update booking status (Admin only)
router.patch(
  "/:id/status",
  authenticateToken,
  requireAdmin,
  [body("status").isIn(["pending", "confirmed", "cancelled", "completed"]).withMessage("Valid status required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { id } = req.params
      const { status } = req.body

      const result = await pool.query(
        "UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, id],
      )

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Booking not found" })
      }

      res.json({
        message: "Booking status updated successfully",
        booking: result.rows[0],
      })
    } catch (error) {
      console.error("Error updating booking status:", error)
      res.status(500).json({ error: "Failed to update booking status" })
    }
  },
)

// Cancel booking (User can cancel their own bookings)
router.patch("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      "UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *",
      ["cancelled", id, req.user.id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found or unauthorized" })
    }

    res.json({
      message: "Booking cancelled successfully",
      booking: result.rows[0],
    })
  } catch (error) {
    console.error("Error cancelling booking:", error)
    res.status(500).json({ error: "Failed to cancel booking" })
  }
})

module.exports = router
