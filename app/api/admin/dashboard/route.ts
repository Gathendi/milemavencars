import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Get active rentals count
    const activeRentals = await db.query(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE status = 'active'`
    );

    // Get total completed trips
    const completedTrips = await db.query(
      `SELECT COUNT(*) as count 
       FROM bookings 
       WHERE status = 'completed'`
    );

    // Get loyalty points for all users
    const loyaltyPoints = await db.query(
      `SELECT SUM(total_amount * 0.01) as points 
       FROM bookings 
       WHERE status = 'completed'`
    );

    // Get car availability
    const carStats = await db.query(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN available = true THEN 1 ELSE 0 END) as available
       FROM cars`
    );

    // Get current rentals
    const currentRentals = await db.query(
      `SELECT 
        b.id,
        c.name as car,
        b.start_date,
        b.end_date as return_date,
        b.total_amount,
        b.status
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       WHERE b.status = 'active'
       ORDER BY b.start_date DESC`
    );

    // Get upcoming rentals
    const upcomingRentals = await db.query(
      `SELECT 
        b.id,
        c.name as car,
        b.start_date,
        b.end_date as return_date,
        b.total_amount,
        b.status
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       WHERE b.status = 'upcoming'
       ORDER BY b.start_date ASC
       LIMIT 5`
    );

    // Get recommended cars (available cars with highest booking frequency)
    const recommendedCars = await db.query(
      `SELECT 
        c.id,
        c.name,
        c.category,
        c.image_url,
        COUNT(b.id) as booking_count
       FROM cars c
       LEFT JOIN bookings b ON c.id = b.car_id
       WHERE c.available = true
       GROUP BY c.id
       ORDER BY booking_count DESC
       LIMIT 2`
    );

    return NextResponse.json({
      stats: {
        activeRentals: activeRentals.rows[0].count,
        completedTrips: completedTrips.rows[0].count,
        loyaltyPoints: Math.floor(loyaltyPoints.rows[0].points || 0),
        availableCars: carStats.rows[0].available,
        totalCars: carStats.rows[0].total,
      },
      currentRentals: currentRentals.rows,
      upcomingRentals: upcomingRentals.rows,
      recommendedCars: recommendedCars.rows,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
} 