import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const offset = (page - 1) * limit;

    // Get total count
    const totalCountResult = await db.query(
      "SELECT COUNT(*) FROM cars WHERE deleted_at IS NULL"
    );
    const total = parseInt(totalCountResult.rows[0].count);

    // Get paginated cars with booking statistics
    const result = await db.query(
      `SELECT 
        c.id, 
        c.name, 
        c.category, 
        c.price, 
        c.image_url, 
        c.seats, 
        c.transmission, 
        c.fuel_type, 
        c.description,
        c.available,
        c.created_at,
        c.updated_at,
        COUNT(DISTINCT b.id) as total_bookings,
        COUNT(DISTINCT CASE WHEN b.status = 'active' THEN b.id END) as active_bookings
      FROM cars c
      LEFT JOIN bookings b ON c.id = b.car_id
      WHERE c.deleted_at IS NULL 
      GROUP BY c.id
      ORDER BY c.created_at DESC 
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return NextResponse.json({
      cars: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
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
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        name,
        category,
        price,
        seats,
        transmission,
        fuel_type,
        image_url,
        description,
        true // New cars are available by default
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

    // Soft delete by setting deleted_at
    const result = await db.query(
      "UPDATE cars SET deleted_at = NOW() WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { error: "Failed to delete car" },
      { status: 500 }
    );
  }
} 