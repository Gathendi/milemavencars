import { NextResponse } from "next/server"
import { db } from "@/lib/db";

// Mock data - In production, this would come from your database
const cars = [
  {
    id: "1",
    name: "Toyota Corolla",
    category: "Sedan",
    price: 3500,
    image: "https://source.unsplash.com/800x600/?sedan,car&sig=1",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    available: true,
    description: "Reliable and fuel-efficient sedan perfect for city driving and business trips.",
  },
  {
    id: "2",
    name: "Toyota Prado",
    category: "SUV",
    price: 8000,
    image: "https://source.unsplash.com/800x600/?suv,car&sig=2",
    seats: 7,
    transmission: "Automatic",
    fuel: "Diesel",
    available: true,
    description: "Spacious SUV ideal for family trips and off-road adventures.",
  },
  {
    id: "3",
    name: "Nissan X-Trail",
    category: "SUV",
    price: 6500,
    image: "https://source.unsplash.com/800x600/?suv,car&sig=3",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    available: true,
    description: "Comfortable crossover SUV perfect for both city and highway driving.",
  },
  {
    id: "4",
    name: "Honda Civic",
    category: "Sedan",
    price: 4000,
    image: "https://source.unsplash.com/800x600/?sedan,car&sig=4",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    available: true,
    description: "Sporty sedan with excellent fuel economy and modern features.",
  },
  {
    id: "5",
    name: "Subaru Forester",
    category: "SUV",
    price: 7000,
    image: "https://source.unsplash.com/800x600/?suv,car&sig=5",
    seats: 5,
    transmission: "Automatic",
    fuel: "Petrol",
    available: false,
    description: "All-wheel drive SUV perfect for all weather conditions.",
  },
  {
    id: "6",
    name: "Volkswagen Polo",
    category: "Hatchback",
    price: 2800,
    image: "https://source.unsplash.com/800x600/?hatchback,car&sig=6",
    seats: 5,
    transmission: "Manual",
    fuel: "Petrol",
    available: true,
    description: "Compact and economical hatchback ideal for city navigation.",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const available = searchParams.get("available");

    let query = "SELECT * FROM cars";
    const conditions = [];
    const params = [];
    let paramCount = 0;

    if (featured === "true") {
      paramCount++;
      conditions.push(`featured = $${paramCount}`);
      params.push(true);
    }
    if (available === "true") {
      paramCount++;
      conditions.push(`available = $${paramCount}`);
      params.push(true);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY created_at DESC";

    const result = await db.query(query, params);
    
    // Transform the data to match the expected format in the frontend
    const cars = result.rows.map(car => {
      // Safely convert price_per_day to a number
      let price = null;
      if (car.price_per_day !== null && car.price_per_day !== undefined) {
        const parsed = parseFloat(car.price_per_day);
        price = isNaN(parsed) ? null : parsed;
      }

      return {
        id: car.id.toString(),
        name: car.name,
        category: car.category,
        price,
        image_url: car.image_url,
        seats: car.specifications?.seats || 5,
        transmission: car.specifications?.transmission || "Automatic",
        fuel_type: car.specifications?.fuel_type || "Petrol",
        available: car.available,
        description: car.description
      };
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Safely convert price to a number
    let price_per_day = null;
    if (body.price !== null && body.price !== undefined) {
      const parsed = parseFloat(body.price);
      price_per_day = isNaN(parsed) ? null : parsed;
    }

    const result = await db.query(
      `INSERT INTO cars (
        name,
        category,
        price_per_day,
        image_url,
        description,
        specifications,
        available
      ) VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *`,
      [
        body.name,
        body.category,
        price_per_day,
        body.image_url,
        body.description,
        {
          seats: body.seats,
          transmission: body.transmission,
          fuel_type: body.fuel_type
        }
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating car:", error);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
