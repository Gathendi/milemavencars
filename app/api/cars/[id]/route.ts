import { NextResponse } from "next/server"

// Mock data - same as in route.ts
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
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const car = cars.find((c) => c.id === params.id)

    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json(car)
  } catch (error) {
    console.error("Error fetching car:", error)
    return NextResponse.json({ error: "Failed to fetch car" }, { status: 500 })
  }
}
