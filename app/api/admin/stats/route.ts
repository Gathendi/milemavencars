import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // TODO: Add authentication middleware to protect this route
    // if (!isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Get total bookings
    const totalBookings = await db.query(
      "SELECT COUNT(*) as count FROM bookings"
    );

    // Get active bookings
    const activeBookings = await db.query(
      "SELECT COUNT(*) as count FROM bookings WHERE status = 'active'"
    );

    // Get total users
    const totalUsers = await db.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'user'"
    );

    // Get total revenue
    const totalRevenue = await db.query(
      "SELECT SUM(total_amount) as total FROM bookings WHERE status != 'cancelled'"
    );

    // Get car statistics
    const carStats = await db.query(
      "SELECT COUNT(*) as total, SUM(CASE WHEN available = true THEN 1 ELSE 0 END) as available FROM cars"
    );

    // Get recent bookings
    const recentBookings = await db.query(
      `SELECT 
        b.id,
        u.name as user,
        c.name as car,
        b.start_date as date,
        b.total_amount as amount,
        b.status
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN cars c ON b.car_id = c.id
      ORDER BY b.created_at DESC
      LIMIT 5`
    );

    // Get recent users
    const recentUsers = await db.query(
      `SELECT 
        id,
        name,
        email,
        created_at as joinDate
      FROM users
      WHERE role = 'user'
      ORDER BY created_at DESC
      LIMIT 5`
    );

    return NextResponse.json({
      totalBookings: totalBookings.rows[0].count,
      activeBookings: activeBookings.rows[0].count,
      totalUsers: totalUsers.rows[0].count,
      totalRevenue: totalRevenue.rows[0].total || 0,
      availableCars: carStats.rows[0].available,
      totalCars: carStats.rows[0].total,
      recentBookings: recentBookings.rows,
      recentUsers: recentUsers.rows,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin statistics" },
      { status: 500 }
    );
  }
} 