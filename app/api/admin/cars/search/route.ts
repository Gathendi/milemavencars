import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    const searchTerm = `%${search.toLowerCase()}%`;

    // Get total count with search
    const totalCountResult = await db.query(
      `SELECT COUNT(*) FROM cars 
       WHERE deleted_at IS NULL 
       AND (
         LOWER(name) LIKE $1 OR 
         LOWER(category) LIKE $1 OR 
         LOWER(transmission) LIKE $1 OR 
         LOWER(fuel_type) LIKE $1
       )`,
      [searchTerm]
    );
    const total = parseInt(totalCountResult.rows[0].count);

    // Get cars with pagination and search
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
      AND (
        LOWER(name) LIKE $1 OR 
        LOWER(category) LIKE $1 OR 
        LOWER(transmission) LIKE $1 OR 
        LOWER(fuel_type) LIKE $1
      )
      ORDER BY featured DESC, created_at DESC 
      LIMIT $2 OFFSET $3`,
      [searchTerm, limit, offset]
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
    console.error("Error searching cars:", error);
    return NextResponse.json(
      { error: "Failed to search cars" },
      { status: 500 }
    );
  }
} 