import { NextResponse } from 'next/server';
import type { DashboardData } from '@/lib/types';

// Demo data for Gathendi
const demoData: DashboardData = {
  user: {
    id: "u1",
    name: "Boniface Gathendi",
    email: "gathendi@milemaven.co.ke",
    avatar: "https://ui-avatars.com/api/?name=Boniface+Gathendi&background=ff0000",
    role: "user",
    license: "B1234567",
    phone: "+254700000000",
    emergencyContact: "Jane Doe, +254700000000"
  },
  stats: {
    activeRentals: 1,
    loyaltyPoints: 1200,
    totalTrips: 3,
    upcomingBookings: 1
  },
  currentBookings: [
    {
      id: "b1",
      userId: "u1",
      carId: "c1",
      car: {
        id: "c1",
        name: "Toyota Prado 2022",
        category: "SUV",
        price: 15000,
        image_url: "/images/toyota-prado.jpg",
        seats: 7,
        transmission: "Automatic",
        fuel_type: "Diesel",
        available: false,
        description: "Luxury SUV perfect for family trips"
      },
      start: "2024-06-10T10:00:00Z",
      end: "2024-06-15T10:00:00Z",
      status: "active",
      totalAmount: 75000,
      paymentStatus: "paid"
    }
  ],
  upcomingBookings: [
    {
      id: "b2",
      userId: "u1",
      carId: "c2",
      car: {
        id: "c2",
        name: "Mazda CX-5 2021",
        category: "SUV",
        price: 12000,
        image_url: "/images/mazda-cx5.jpg",
        seats: 5,
        transmission: "Automatic",
        fuel_type: "Petrol",
        available: true,
        description: "Modern crossover SUV with great features"
      },
      start: "2024-07-01T09:00:00Z",
      end: "2024-07-05T09:00:00Z",
      status: "upcoming",
      totalAmount: 48000,
      paymentStatus: "paid"
    }
  ],
  recentBookings: [
    {
      id: "b3",
      userId: "u1",
      carId: "c3",
      car: {
        id: "c3",
        name: "Nissan X-Trail 2020",
        category: "SUV",
        price: 10000,
        image_url: "/images/nissan-xtrail.jpg",
        seats: 5,
        transmission: "Automatic",
        fuel_type: "Petrol",
        available: true,
        description: "Reliable family SUV"
      },
      start: "2024-05-01T10:00:00Z",
      end: "2024-05-05T10:00:00Z",
      status: "completed",
      totalAmount: 40000,
      paymentStatus: "paid"
    }
  ],
  recommendedCars: [
    {
      id: "r1",
      name: "Tesla Model 3",
      category: "Sedan",
      price: 20000,
      image_url: "/images/tesla-model-3.jpg",
      seats: 5,
      transmission: "Automatic",
      fuel_type: "Electric",
      available: true,
      description: "High-performance electric sedan"
    },
    {
      id: "r2",
      name: "Toyota Land Cruiser",
      category: "SUV",
      price: 25000,
      image_url: "/images/toyota-land-cruiser.jpg",
      seats: 8,
      transmission: "Automatic",
      fuel_type: "Diesel",
      available: true,
      description: "Premium luxury SUV"
    },
    {
      id: "r3",
      name: "Mazda CX-5",
      category: "SUV",
      price: 12000,
      image_url: "/images/mazda-cx5.jpg",
      seats: 5,
      transmission: "Automatic",
      fuel_type: "Petrol",
      available: true,
      description: "Stylish and efficient crossover"
    }
  ]
};

export async function GET() {
  // In a real application, you would:
  // 1. Get the user ID from the session
  // 2. Fetch real data from your database
  // 3. Apply any necessary transformations
  // 4. Handle errors appropriately

  // For now, we'll return the demo data
  return NextResponse.json(demoData);
} 