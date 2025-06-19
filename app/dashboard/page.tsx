"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/lib/types";
import CarCard from "@/components/CarCard";
import Image from "next/image";

const TABS = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
        <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
      </svg>
    ),
  },
  {
    key: "bookings",
    label: "My Bookings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
        <path d="M16.5 5.25c-1.036 0-1.875.84-1.875 1.875V12h12V7.125c0-1.036-.84-1.875-1.875-1.875h-8.25zM16.5 13.5h12v2.625c0 1.035-.84 1.875-1.875 1.875h-8.25c-1.035 0-1.875-.84-1.875-1.875V13.5z" />
      </svg>
    ),
  },
  {
    key: "history",
    label: "Rental History",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    key: "ai",
    label: (
      <div className="flex items-center gap-2">
        Maven AI
        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-red-100 text-red-600 rounded-full">
          BETA
        </span>
      </div>
    ),
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M16.5 7.5h-9v9h9v-9z" />
        <path
          fillRule="evenodd"
          d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    key: "profile",
    label: "Profile Settings",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    key: "financial",
    label: "Payments & Billing",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
        <path
          fillRule="evenodd"
          d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
];

const mockBookings = [
  {
    id: "1",
    car: "Toyota Prado 2022",
    start: "2024-06-10T10:00:00Z",
    end: "2024-06-15T10:00:00Z",
    status: "active",
  },
  {
    id: "2",
    car: "Mazda CX-5 2021",
    start: "2024-07-01T09:00:00Z",
    end: "2024-07-05T09:00:00Z",
    status: "upcoming",
  },
];

const mockHistory = [
  {
    id: "3",
    car: "Nissan X-Trail 2020",
    start: "2024-05-01T10:00:00Z",
    end: "2024-05-05T10:00:00Z",
    rating: 5,
    review: "Great ride!",
  },
];

const mockAI = {
  recommendations: ["Tesla Model 3", "Toyota Land Cruiser"],
  insights: "You prefer SUVs for weekend trips.",
  priceAlerts: ["Mazda CX-5: 10% off next week!"],
  optimalTimes: "Book on Tuesdays for best rates.",
};

const mockProfile = {
  name: "Boniface Gathendi",
  email: "gathendi@milemaven.co.ke",
  license: "B1234567",
  payment: "Visa **** 1234",
  notifications: { email: true, sms: false, push: true },
  insurance: "Comprehensive",
  emergency: "Jane Doe, +254700000000",
};

const mockFinancial = {
  billing: [
    { id: "b1", date: "2024-05-05", amount: 15000, desc: "Rental payment" },
  ],
  loyalty: 1200,
  autoPay: true,
};

const mockRecommendedCars = [
  {
    id: "r1",
    name: "Tesla Model 3",
    category: "Sedan",
    price: 20000,
    image_url: "https://source.unsplash.com/800x600/?tesla-model-3",
    seats: 5,
    transmission: "Automatic",
    fuel_type: "Electric",
    available: true,
    description: "High-performance electric sedan",
  },
  {
    id: "r2",
    name: "Toyota Land Cruiser",
    category: "SUV",
    price: 25000,
    image_url: "https://source.unsplash.com/800x600/?toyota-land-cruiser",
    seats: 8,
    transmission: "Automatic",
    fuel_type: "Diesel",
    available: true,
    description: "Premium luxury SUV",
  },
];

function UserProfileCard({
  user,
  onEditProfile,
}: {
  user: any;
  onEditProfile: () => void;
}) {
  return (
    <div className="px-4 mb-8 text-center relative z-10">
      <div className="relative inline-block group mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mx-auto backdrop-blur-sm">
          <Image
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "Boniface Gathendi"
              )}&background=ff0000&color=fff`
            }
            alt="Profile"
            fill
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.name || "Boniface Gathendi"
              )}&background=ff0000&color=fff`;
            }}
          />
        </div>
        <button className="absolute bottom-0 right-0 bg-red-500/90 text-white p-1 rounded-full shadow-lg hover:bg-red-600/90 transition-colors backdrop-blur-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
            <path
              fillRule="evenodd"
              d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <h3 className="font-semibold text-lg text-gray-900">
        {user?.name || mockProfile.name}
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        {user?.email || mockProfile.email}
      </p>
      <div className="px-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm backdrop-blur-sm bg-white/80 hover:bg-white/90 border border-gray-200"
          onClick={onEditProfile}
        >
          Edit Profile
        </Button>
      </div>
    </div>
  );
}

function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="p-4 rounded-xl backdrop-blur-md bg-white/60 border border-white/20 shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">Active Rentals</h4>
        <p className="text-2xl font-bold text-gray-900">1</p>
      </div>
      <div className="p-4 rounded-xl backdrop-blur-md bg-white/60 border border-white/20 shadow-sm">
        <h4 className="text-sm font-medium text-gray-500">Loyalty Points</h4>
        <p className="text-2xl font-bold text-gray-900">
          {mockFinancial.loyalty}
        </p>
      </div>
    </div>
  );
}

function DashboardOverview({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <Card className="card border-none relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </CardTitle>
          <CardDescription>
            Here's what's happening with your rentals
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <QuickStats />
          <div className="flex flex-wrap gap-4">
            <Button className="flex-1 backdrop-blur-sm bg-red-500/90 hover:bg-red-600/90">
              Book a New Car
            </Button>
            <Button
              variant="outline"
              className="flex-1 backdrop-blur-sm bg-white/80 hover:bg-white/90"
            >
              View All Cars
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="card border-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg">Current Rental</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {mockBookings
              .filter((b) => b.status === "active")
              .map((booking) => (
                <div key={booking.id} className="space-y-2">
                  <div className="font-medium">{booking.car}</div>
                  <div className="text-sm text-gray-500">
                    Returns: {new Date(booking.end).toLocaleDateString()}
                  </div>
                  <Button size="sm">Extend Rental</Button>
                </div>
              ))}
          </CardContent>
        </Card>

        <Card className="card border-none relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg">Upcoming Booking</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            {mockBookings
              .filter((b) => b.status === "upcoming")
              .map((booking) => (
                <div key={booking.id} className="space-y-2">
                  <div className="font-medium">{booking.car}</div>
                  <div className="text-sm text-gray-500">
                    Pickup: {new Date(booking.start).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Modify
                    </Button>
                    <Button size="sm" variant="destructive">
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BookingsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {mockBookings.filter((b) => b.status === "active").length === 0 ? (
          <p>No active rentals.</p>
        ) : (
          mockBookings
            .filter((b) => b.status === "active")
            .map((b) => (
              <div key={b.id} className="mb-2">
                <div className="font-semibold">{b.car}</div>
                <div>Return: {new Date(b.end).toLocaleString()}</div>
                <Button size="sm" className="mt-1">
                  Extend
                </Button>
              </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}

function HistorySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rental History</CardTitle>
      </CardHeader>
      <CardContent>
        {mockHistory.length === 0 ? (
          <p>No past rentals.</p>
        ) : (
          mockHistory.map((h) => (
            <div key={h.id} className="mb-2">
              <div className="font-semibold">{h.car}</div>
              <div>
                {new Date(h.start).toLocaleDateString()} -{" "}
                {new Date(h.end).toLocaleDateString()}
              </div>
              <div>Rating: {h.rating} / 5</div>
              <div>Review: {h.review}</div>
              <Button size="sm" variant="outline">
                Download Receipt
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function AISection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insights & Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div>{mockAI.insights}</div>
        <div className="mt-2 font-semibold">Price Alerts:</div>
        <ul className="list-disc ml-5">
          {mockAI.priceAlerts.map((alert, i) => (
            <li key={i}>{alert}</li>
          ))}
        </ul>
        <div className="mt-2">Optimal Booking Times: {mockAI.optimalTimes}</div>
      </CardContent>
    </Card>
  );
}

function ProfileSection({ user }: { user: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile & Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Name: {user?.name || mockProfile.name}</div>
        <div>Email: {user?.email || mockProfile.email}</div>
        <div>Driver's License: {mockProfile.license}</div>
        <div>Payment: {mockProfile.payment}</div>
        <div>
          Notifications: Email ({mockProfile.notifications.email ? "on" : "off"}
          ), SMS ({mockProfile.notifications.sms ? "on" : "off"}), Push (
          {mockProfile.notifications.push ? "on" : "off"})
        </div>
        <div>Insurance: {mockProfile.insurance}</div>
        <div>Emergency Contact: {mockProfile.emergency}</div>
      </CardContent>
    </Card>
  );
}

function FinancialSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 font-semibold">Billing History</div>
        <ul>
          {mockFinancial.billing.map((b) => (
            <li key={b.id}>
              {b.date}: {b.desc} - KES {b.amount}
            </li>
          ))}
        </ul>
        <div className="mt-2">Loyalty Points: {mockFinancial.loyalty}</div>
        <div>Auto-Pay: {mockFinancial.autoPay ? "Enabled" : "Disabled"}</div>
      </CardContent>
    </Card>
  );
}

function RecommendedCars() {
  return (
    <aside className="hidden xl:block w-80">
      <div className="sticky top-4 space-y-4">
        <Card className="backdrop-blur-xl bg-white/70 border-white/20 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg">Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {mockRecommendedCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const dashboardData = await response.json();
        // Ensure each car has a fallback image URL
        dashboardData.recommendedCars = dashboardData.recommendedCars.map(
          (car) => ({
            ...car,
            image_url:
              car.image_url ||
              `https://source.unsplash.com/800x600/?car-${car.category.toLowerCase()}&sig=${
                car.id
              }`,
          })
        );
        dashboardData.currentBookings = dashboardData.currentBookings.map(
          (booking) => ({
            ...booking,
            car: {
              ...booking.car,
              image_url:
                booking.car.image_url ||
                `https://source.unsplash.com/800x600/?car-${booking.car.category.toLowerCase()}&sig=${
                  booking.car.id
                }`,
            },
          })
        );
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="mt-2">{error}</p>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Aligned with container */}
      <div className="lg:hidden fixed top-20 z-20 w-full px-4 left-0 right-0">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Container with consistent padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row pt-16">
          {/* Sidebar - Now with adjusted z-index and consistent spacing */}
          <div
            className={`
            fixed lg:static w-[280px] bg-white z-10 mt-16 lg:mt-0
            transition-transform duration-300 ease-in-out
            shadow-[0_4px_12px_0_rgba(0,0,0,0.05)] border-r border-gray-100
            ${
              isMobileMenuOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
          `}
          >
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="flex flex-col h-full py-4">
                <UserProfileCard
                  user={user}
                  onEditProfile={() => setActiveTab("profile")}
                />
                <nav className="px-3 flex-1">
                  {TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveTab(tab.key);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.key
                          ? "bg-red-50 text-red-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="opacity-75">{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content - With proper spacing for all screen sizes */}
          <div className="flex-1 lg:pl-8 pt-4 w-full">
            <div className="py-6 space-y-6">
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-semibold text-gray-900">
                        Welcome back, {user?.name || mockProfile.name}!
                      </h1>
                      <p className="text-gray-500 mt-1">
                        Here's what's happening with your rentals
                      </p>
                    </div>
                    <Button
                      onClick={() => (window.location.href = "/cars")}
                      className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
                    >
                      Book a New Car
                    </Button>
                  </div>

                  {/* Stats Grid - Improved responsive grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <Card className="relative overflow-hidden group transition-all duration-200 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-red-600 to-red-700 transition-opacity duration-200" />
                      <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-white">
                            Active Rentals
                          </CardTitle>
                          <div className="p-2 bg-white/10 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-white"
                            >
                              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-white">
                            1
                          </span>
                          <p className="text-white/80 text-sm mt-1">
                            Vehicle Currently Rented
                          </p>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group transition-all duration-200 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-blue-600 to-blue-700 transition-opacity duration-200" />
                      <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-white">
                            Loyalty Points
                          </CardTitle>
                          <div className="p-2 bg-white/10 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-white">
                            1,200
                          </span>
                          <p className="text-white/80 text-sm mt-1">
                            Points Available
                          </p>
                        </div>
                      </CardHeader>
                    </Card>

                    <Card className="relative overflow-hidden group transition-all duration-200 hover:shadow-lg">
                      <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-600" />
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-green-600 to-green-700 transition-opacity duration-200" />
                      <CardHeader className="relative z-10">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-medium text-white">
                            Total Trips
                          </CardTitle>
                          <div className="p-2 bg-white/10 rounded-lg">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 text-white"
                            >
                              <path
                                fillRule="evenodd"
                                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-4xl font-bold text-white">
                            3
                          </span>
                          <p className="text-white/80 text-sm mt-1">
                            Completed Rentals
                          </p>
                        </div>
                      </CardHeader>
                    </Card>
                  </div>

                  {/* Current and Upcoming Section - Better spacing */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Current Rentals Card */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Current Rentals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {data.currentBookings.map((booking) => (
                          <div key={booking.id} className="mb-2">
                            <div className="font-semibold">
                              {booking.car.name}
                            </div>
                            <div>
                              Return: {new Date(booking.end).toLocaleString()}
                            </div>
                            <Button size="sm" className="mt-1">
                              Extend
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Upcoming Rentals Card */}
                    <Card className="col-span-1">
                      <CardHeader>
                        <CardTitle>Upcoming Rentals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {data.currentBookings.map((booking) => (
                          <div key={booking.id} className="mb-2">
                            <div className="font-semibold">
                              {booking.car.name}
                            </div>
                            <div>
                              Pickup: {new Date(booking.start).toLocaleString()}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                Modify
                              </Button>
                              <Button size="sm" variant="destructive">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recommended Cars Section - Responsive grid */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1c-1.828 0-3.623.149-5.371.435a.75.75 0 00-.629.74v.387c-.827.157-1.642.345-2.445.564a.75.75 0 00-.552.698V5c0 2.056.754 3.931 1.995 5.357a.75.75 0 001.108.095l.346-.31c.798.235 1.626.452 2.472.647a.75.75 0 00.588-.022l.452-.211c.162.064.329.127.498.189a.75.75 0 00.63-.111l.346-.31c.798.235 1.626.452 2.472.647a.75.75 0 00.588-.022l.452-.211a.75.75 0 00.424-.806l-.024-.168c-.386.087-.78.167-1.18.239a.75.75 0 01-.305-1.469c.5-.103.992-.214 1.475-.333a.75.75 0 00.354-1.246c-.182-.196-.37-.387-.563-.573a.75.75 0 00-1.025-.04l-.146.129c-.262-.293-.534-.574-.816-.843a.75.75 0 00-1.025-.04l-.146.129c-.262-.293-.534-.574-.816-.843a.75.75 0 00-1.025-.04l-.146.129c-.262-.293-.534-.574-.816-.843a.75.75 0 00-1.025-.04l-.146.129z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Recommended for You
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.recommendedCars.slice(0, 2).map((car) => (
                        <CarCard key={car.id} car={car} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "bookings" && <BookingsSection />}
              {activeTab === "history" && <HistorySection />}
              {activeTab === "ai" && <AISection />}
              {activeTab === "profile" && <ProfileSection user={user} />}
              {activeTab === "financial" && <FinancialSection />}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-5 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
