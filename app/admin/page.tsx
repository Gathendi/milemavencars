"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data - Replace with actual API calls
const mockStats = {
  totalBookings: 156,
  activeBookings: 23,
  totalUsers: 89,
  totalRevenue: 450000,
  availableCars: 15,
  totalCars: 20,
  loyaltyPoints: 1200,
  completedRentals: 3,
  recentBookings: [
    {
      id: 1,
      user: "John Doe",
      car: "Toyota Prado 2022",
      date: "2024-06-10",
      returnDate: "2024-06-15",
      amount: 15000,
      status: "active",
    },
    {
      id: 2,
      user: "Jane Smith",
      car: "Tesla Model 3",
      date: "2024-07-01",
      returnDate: "2024-07-05",
      amount: 20000,
      status: "upcoming",
    },
  ],
  recentUsers: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      joinDate: "2024-03-15",
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com",
      joinDate: "2024-03-14",
    },
  ],
};

function StatCard({
  title,
  value,
  icon,
  color = "bg-white",
  textColor = "text-gray-700",
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
  textColor?: string;
}) {
  return (
    <Card className={`${color}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          {icon && <span className="text-gray-500">{icon}</span>}
          <div className="text-right flex-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookingCard({
  booking,
  type,
}: {
  booking: any;
  type: "current" | "upcoming";
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{booking.car}</h3>
            <p className="text-sm text-gray-500">
              {type === "current" ? "Return" : "Pickup"}:{" "}
              {type === "current" ? booking.returnDate : booking.date}
            </p>
          </div>
          <div className="flex gap-2">
            {type === "current" ? (
              <Button variant="default" size="sm">
                Extend
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm">
                  Modify
                </Button>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);

  // TODO: Replace with actual API call
  useEffect(() => {
    // Fetch dashboard stats
    // const fetchStats = async () => {
    //   const response = await fetch('/api/admin/stats');
    //   const data = await response.json();
    //   setStats(data);
    // };
    // fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, Admin!</h2>
          <p className="text-gray-500">
            Here's what's happening with your fleet
          </p>
        </div>
        <Button>Book a New Car</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Rentals"
          value="1"
          color="bg-red-500"
          textColor="text-white"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
            </svg>
          }
        />

        <StatCard
          title="Loyalty Points"
          value="1,200"
          color="bg-blue-500"
          textColor="text-white"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Total Trips"
          value="3"
          color="bg-green-500"
          textColor="text-white"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          }
        />

        <StatCard
          title="Available Cars"
          value={`${stats.availableCars}/${stats.totalCars}`}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
            </svg>
          }
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Rentals</h3>
          {stats.recentBookings
            .filter((booking) => booking.status === "active")
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} type="current" />
            ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Rentals</h3>
          {stats.recentBookings
            .filter((booking) => booking.status === "upcoming")
            .map((booking) => (
              <BookingCard key={booking.id} booking={booking} type="upcoming" />
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recommended for You</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div>
                  <h4 className="font-semibold">Tesla Model 3</h4>
                  <p className="text-sm text-gray-500">Sedan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg"></div>
                <div>
                  <h4 className="font-semibold">Toyota Land Cruiser</h4>
                  <p className="text-sm text-gray-500">SUV</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
