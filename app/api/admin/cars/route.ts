import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const result = await db.query(
      `SELECT 
        c.*,
        COUNT(b.id) as total_bookings,
        SUM(CASE WHEN b.status = 'active' THEN 1 ELSE 0 END) as active_bookings
       FROM cars c
       LEFT JOIN bookings b ON c.id = b.car_id
       GROUP BY c.id
       ORDER BY c.created_at DESC`
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      price,
      seats,
      transmission,
      fuel_type,
      image_url,
      description
    } = body;

    const result = await db.query(
      `INSERT INTO cars (
        name,
        category,
        price,
        seats,
        transmission,
        fuel_type,
        image_url,
        description,
        available
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *`,
      [
        name,
        category,
        price,
        seats,
        transmission,
        fuel_type,
        image_url,
        description
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error adding car:", error);
    return NextResponse.json(
      { error: "Failed to add car" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      category,
      price_per_day,
      image_url,
      description,
      features,
      specifications,
      available,
    } = body;

    const result = await db.query(
      `UPDATE cars
       SET name = $1,
           category = $2,
           price_per_day = $3,
           image_url = $4,
           description = $5,
           features = $6,
           specifications = $7,
           available = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        name,
        category,
        price_per_day,
        image_url,
        description,
        features,
        specifications,
        available,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating car:", error);
    return NextResponse.json(
      { error: "Failed to update car" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Car ID is required" },
        { status: 400 }
      );
    }

    // Check if car has active bookings
    const activeBookings = await db.query(
      `SELECT COUNT(*) as count
       FROM bookings
       WHERE car_id = $1 AND status = 'active'`,
      [id]
    );

    if (activeBookings.rows[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete car with active bookings" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `DELETE FROM cars WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
} 