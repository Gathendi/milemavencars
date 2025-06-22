import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Get all users with their booking stats
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = `
      SELECT 
        u.*,
        COUNT(DISTINCT b.id) as total_bookings,
        SUM(CASE WHEN b.status = 'active' THEN 1 ELSE 0 END) as active_bookings,
        SUM(CASE WHEN b.status = 'completed' THEN b.total_amount ELSE 0 END) as total_spent,
        MAX(b.created_at) as last_booking_date
      FROM users u
      LEFT JOIN bookings b ON u.id = b.user_id
    `;

    const values: any[] = [];
    if (role) {
      query += " WHERE u.role = $1";
      values.push(role);
    }

    query += ` GROUP BY u.id
               ORDER BY u.created_at DESC
               LIMIT $${values.length + 1}
               OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const result = await db.query(query, values);

    // Get total count for pagination
    const countQuery = "SELECT COUNT(*) as total FROM users" +
                      (role ? " WHERE role = $1" : "");
    const countResult = await db.query(countQuery, role ? [role] : []);

    return NextResponse.json({
      users: result.rows,
      total: parseInt(countResult.rows[0].total),
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// Update user
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      email,
      role,
      is_active,
      phone_number,
      address,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && !["user", "admin"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           role = COALESCE($3, role),
           is_active = COALESCE($4, is_active),
           phone_number = COALESCE($5, phone_number),
           address = COALESCE($6, address),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [name, email, role, is_active, phone_number, address, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// Delete user (soft delete)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if user has active bookings
    const activeBookings = await db.query(
      `SELECT COUNT(*) as count
       FROM bookings
       WHERE user_id = $1 AND status = 'active'`,
      [id]
    );

    if (activeBookings.rows[0].count > 0) {
      return NextResponse.json(
        { error: "Cannot delete user with active bookings" },
        { status: 400 }
      );
    }

    const result = await db.query(
      `UPDATE users
       SET is_active = false,
           deleted = true,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
} 