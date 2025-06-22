import { NextResponse } from "next/server"
import { db } from "@/lib/db";

export async function GET(request: Request) {
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

    // Get paginated cars
    const result = await db.query(
      `SELECT 
        id, 
        name, 
        category, 
        price, 
        image_url, 
        seats,
        transmission,
        fuel_type,
        description,
        available,
        featured,
        created_at,
        updated_at
      FROM cars 
      WHERE deleted_at IS NULL 
      ORDER BY featured DESC, created_at DESC 
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await db.query(
      `INSERT INTO cars (
        name,
        category,
        price,
        image_url,
        seats,
        transmission,
        fuel_type,
        description,
        available,
        featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        body.name,
        body.category,
        parseFloat(body.price),
        body.image_url,
        parseInt(body.seats) || 5,
        body.transmission || 'Automatic',
        body.fuel_type || 'Petrol',
        body.description || null,
        true,
        body.featured || false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
