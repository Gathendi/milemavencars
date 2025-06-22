"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Car,
  CalendarCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";

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
  icon: Icon,
  trend,
  trendValue,
  description,
  className = "",
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: "up" | "down";
  trendValue?: string;
  description?: string;
  className?: string;
}) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-red-50">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
          {trend && (
            <span
              className={`flex items-center text-sm font-medium ${
                trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {trendValue}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function BookingCard({ booking, type }: { booking: any; type: string }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                type === "current" ? "bg-green-50" : "bg-blue-50"
              }`}
            >
              {type === "current" ? (
                <Clock
                  className={`w-6 h-6 ${
                    type === "current" ? "text-green-600" : "text-blue-600"
                  }`}
                />
              ) : (
                <CalendarCheck
                  className={`w-6 h-6 ${
                    type === "current" ? "text-green-600" : "text-blue-600"
                  }`}
                />
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">
                {booking.user}
              </p>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  type === "current"
                    ? "bg-green-50 text-green-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {type === "current" ? "Active" : "Upcoming"}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{booking.car}</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500">
                {new Date(booking.date).toLocaleDateString()} -{" "}
                {new Date(booking.returnDate).toLocaleDateString()}
              </p>
              <p className="text-sm font-medium text-gray-900">
                Ksh {booking.amount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(mockStats);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-red-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Monitor your fleet's performance and bookings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            View Alerts
          </Button>
          <Button className="gap-2 bg-red-600 hover:bg-red-700">
            <Car className="w-4 h-4" />
            Add New Car
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={CalendarCheck}
          trend="up"
          trendValue="12%"
          description="vs. last month"
        />
        <StatCard
          title="Active Rentals"
          value={stats.activeBookings}
          icon={Car}
          trend="up"
          trendValue="8%"
          description="currently on road"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend="up"
          trendValue="24%"
          description="registered users"
        />
        <StatCard
          title="Revenue"
          value={`Ksh ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          trend="up"
          trendValue="18%"
          description="this month"
        />
      </div>

      {/* Fleet Status */}
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-600" />
            Fleet Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Available Cars
              </p>
              <p className="text-2xl font-bold">{stats.availableCars}</p>
              <p className="text-sm text-gray-500">
                out of {stats.totalCars} total
              </p>
            </div>
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeDasharray={`${
                      (stats.availableCars / stats.totalCars) * 100
                    }, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {Math.round((stats.availableCars / stats.totalCars) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-red-600" />
            Current Rentals
          </h2>
          <div className="space-y-4">
            {stats.recentBookings
              .filter((booking) => booking.status === "active")
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="current"
                />
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-red-600" />
            Upcoming Rentals
          </h2>
          <div className="space-y-4">
            {stats.recentBookings
              .filter((booking) => booking.status === "upcoming")
              .map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  type="upcoming"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
