const express = require("express")
const { body, validationResult, query } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken, requireAdmin } = require("../middleware/auth")

const router = express.Router()

// Get all cars with filtering
router.get(
  "/",
  [
    query("category").optional().isIn(["sedan", "suv", "hatchback", "luxury", "van"]),
    query("minPrice").optional().isNumeric(),
    query("maxPrice").optional().isNumeric(),
    query("available").optional().isBoolean(),
    query("search").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      let query = "SELECT * FROM cars WHERE 1=1"
      const params = []
      let paramCount = 0

      // Apply filters
      if (req.query.category) {
        paramCount++
        query += ` AND LOWER(category) = $${paramCount}`
        params.push(req.query.category.toLowerCase())
      }

      if (req.query.minPrice) {
        paramCount++
        query += ` AND price >= $${paramCount}`
        params.push(Number.parseFloat(req.query.minPrice))
      }

      if (req.query.maxPrice) {
        paramCount++
        query += ` AND price <= $${paramCount}`
        params.push(Number.parseFloat(req.query.maxPrice))
      }

      if (req.query.available !== undefined) {
        paramCount++
        query += ` AND available = $${paramCount}`
        params.push(req.query.available === "true")
      }

      if (req.query.search) {
        paramCount++
        query += ` AND (LOWER(name) LIKE $${paramCount} OR LOWER(description) LIKE $${paramCount})`
        params.push(`%${req.query.search.toLowerCase()}%`)
      }

      query += " ORDER BY created_at DESC"

      const result = await pool.query(query, params)
      res.json(result.rows)
    } catch (error) {
      console.error("Error fetching cars:", error)
      res.status(500).json({ error: "Failed to fetch cars" })
    }
  },
)

// Get single car
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query("SELECT * FROM cars WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Error fetching car:", error)
    res.status(500).json({ error: "Failed to fetch car" })
  }
})

// Create new car (Admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Car name required"),
    body("category").isIn(["sedan", "suv", "hatchback", "luxury", "van"]).withMessage("Valid category required"),
    body("price").isNumeric().withMessage("Valid price required"),
    body("seats").isInt({ min: 1, max: 20 }).withMessage("Valid seat count required"),
    body("transmission").isIn(["manual", "automatic"]).withMessage("Valid transmission type required"),
    body("fuel_type").isIn(["petrol", "diesel", "hybrid", "electric"]).withMessage("Valid fuel type required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, category, price, image_url, seats, transmission, fuel_type, description } = req.body

      const result = await pool.query(
        `INSERT INTO cars (name, category, price, image_url, seats, transmission, fuel_type, description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [name, category, price, image_url || null, seats, transmission, fuel_type, description || null],
      )

      res.status(201).json({
        message: "Car created successfully",
        car: result.rows[0],
      })
    } catch (error) {
      console.error("Error creating car:", error)
      res.status(500).json({ error: "Failed to create car" })
    }
  },
)

// Update car (Admin only)
router.put("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, price, image_url, seats, transmission, fuel_type, description, available } = req.body

    const result = await pool.query(
      `UPDATE cars SET 
       name = COALESCE($1, name),
       category = COALESCE($2, category),
       price = COALESCE($3, price),
       image_url = COALESCE($4, image_url),
       seats = COALESCE($5, seats),
       transmission = COALESCE($6, transmission),
       fuel_type = COALESCE($7, fuel_type),
       description = COALESCE($8, description),
       available = COALESCE($9, available),
       updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [name, category, price, image_url, seats, transmission, fuel_type, description, available, id],
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" })
    }

    res.json({
      message: "Car updated successfully",
      car: result.rows[0],
    })
  } catch (error) {
    console.error("Error updating car:", error)
    res.status(500).json({ error: "Failed to update car" })
  }
})

// Delete car (Admin only)
router.delete("/:id", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query("DELETE FROM cars WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Car not found" })
    }

    res.json({ message: "Car deleted successfully" })
  } catch (error) {
    console.error("Error deleting car:", error)
    res.status(500).json({ error: "Failed to delete car" })
  }
})

module.exports = router
