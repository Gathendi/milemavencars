import { NextResponse } from "next/server"

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

export async function GET() {
  try {
    return NextResponse.json(cars)
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // In production, validate admin authentication here

    const newCar = {
      id: Date.now().toString(),
      ...body,
      available: true,
    }

    cars.push(newCar)

    return NextResponse.json(newCar, { status: 201 })
  } catch (error) {
    console.error("Error creating car:", error)
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 })
  }
}
