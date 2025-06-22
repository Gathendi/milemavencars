import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get all bookings with detailed information
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = `
      SELECT 
        b.*,
        c.name as car_name,
        c.category as car_category,
        c.image_url as car_image,
        u.name as user_name,
        u.email as user_email
      FROM bookings b
      JOIN cars c ON b.car_id = c.id
      JOIN users u ON b.user_id = u.id
    `;

    const values: any[] = [];
    if (status) {
      query += " WHERE b.status = $1";
      values.push(status);
    }

    query += ` ORDER BY b.created_at DESC
               LIMIT $${values.length + 1} 
               OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);

    // Get total count for pagination
    const countQuery = "SELECT COUNT(*) as total FROM bookings" + 
                      (status ? " WHERE status = $1" : "");
    const countResult = await db.query(countQuery, status ? [status] : []);

    return NextResponse.json({
      bookings: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// Update booking status
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, admin_notes } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "active", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE bookings
       SET status = $1,
           admin_notes = $2,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, admin_notes, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // If status is completed or cancelled, make the car available
    if (status === "completed" || status === "cancelled") {
      await db.query(
        `UPDATE cars
         SET available = true
         WHERE id = $1`,
        [result.rows[0].car_id]
      );
    }

    // If status is active, make the car unavailable
    if (status === "active") {
      await db.query(
        `UPDATE cars
         SET available = false
         WHERE id = $1`,
        [result.rows[0].car_id]
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// Delete booking (soft delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE bookings
       SET deleted = true,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Make the car available if the booking was active
    if (result.rows[0].status === "active") {
      await db.query(
        `UPDATE cars
         SET available = true
         WHERE id = $1`,
        [result.rows[0].car_id]
      );
    }

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
} 