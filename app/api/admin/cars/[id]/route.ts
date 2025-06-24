import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/admin/cars/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const car = await db.query(
      `SELECT * FROM cars WHERE id = $1 AND deleted_at IS NULL`,
      [params.id]
    );

    if (car.rows.length === 0) {
      return new NextResponse("Car not found", { status: 404 });
    }

    return NextResponse.json(car.rows[0]);
  } catch (error) {
    console.error("Error fetching car:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// PUT /api/admin/cars/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const {
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
    } = body;

    const result = await db.query(
      `UPDATE cars 
       SET name = $1,
           category = $2,
           price = $3,
           image_url = $4,
           seats = $5,
           transmission = $6,
           fuel_type = $7,
           description = $8,
           available = $9,
           featured = $10,
           updated_at = NOW()
       WHERE id = $11 AND deleted_at IS NULL
       RETURNING *`,
      [
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
        params.id,
      ]
    );

    if (result.rows.length === 0) {
      return new NextResponse("Car not found", { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating car:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// DELETE /api/admin/cars/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Soft delete by setting deleted_at
    const result = await db.query(
      `UPDATE cars 
       SET deleted_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING *`,
      [params.id]
    );

    if (result.rows.length === 0) {
      return new NextResponse("Car not found", { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting car:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 