"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TABS = [
  { key: "dashboard", label: "Dashboard", icon: "🏠" },
  { key: "bookings", label: "Bookings", icon: "🚗" },
  { key: "history", label: "History", icon: "📜" },
  { key: "ai", label: "AI", icon: "🤖" },
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "financial", label: "Financial", icon: "💳" },
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
  name: "Alex Kimani",
  email: "alex@example.com",
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
    image: "/images/tesla-model-3.jpg",
    price: "KES 8,000/day",
  },
  {
    id: "r2",
    name: "Toyota Land Cruiser",
    image: "/images/toyota-land-cruiser.jpg",
    price: "KES 12,000/day",
  },
  {
    id: "r3",
    name: "Mazda CX-5",
    image: "/images/mazda-cx5.jpg",
    price: "KES 7,000/day",
  },
];

function DashboardOverview({ user }: { user: any }) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Welcome, {user?.name || mockProfile.name}!</CardTitle>
        <CardDescription>
          AI Recommendations: {mockAI.recommendations.join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button>Book a Car</Button>
          <Button variant="secondary">Extend Rental</Button>
          <Button variant="outline">Report Issue</Button>
        </div>
      </CardContent>
    </Card>
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
    <aside className="hidden lg:block w-80 p-4 pr-6">
      <div className="sticky top-4">
        <h2 className="text-lg font-semibold mb-4">Recommended for You</h2>
        <div className="space-y-4">
          {mockRecommendedCars.map((car) => (
            <Card key={car.id} className="flex items-center gap-4 p-3">
              <img
                src={car.image}
                alt={car.name}
                className="w-16 h-12 object-cover rounded-md border"
                onError={(e) =>
                  (e.currentTarget.src = "/images/tesla-model-3.jpg")
                }
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{car.name}</div>
                <div className="text-sm text-gray-500">{car.price}</div>
              </div>
              <Button size="sm">Book</Button>
            </Card>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");

  let content;
  switch (selectedTab) {
    case "dashboard":
      content = <DashboardOverview user={user} />;
      break;
    case "bookings":
      content = <BookingsSection />;
      break;
    case "history":
      content = <HistorySection />;
      break;
    case "ai":
      content = <AISection />;
      break;
    case "profile":
      content = <ProfileSection user={user} />;
      break;
    case "financial":
      content = <FinancialSection />;
      break;
    default:
      content = <DashboardOverview user={user} />;
  }

  return (
    <div className="flex min-h-[80vh] bg-gray-50">
      {/* Sidebar */}
      <aside className="sticky top-4 h-fit self-start w-20 md:w-56 bg-white border-r shadow-sm rounded-xl m-4 flex flex-col items-center py-6">
        <nav className="flex flex-col gap-2 w-full">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left font-medium text-gray-700 hover:bg-gray-100 focus:outline-none ${
                selectedTab === tab.key ? "bg-gray-200 text-red-600" : ""
              }`}
            >
              <span className="text-xl md:text-2xl">{tab.icon}</span>
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full">
        {content}
      </main>
      {/* Recommended Cars (Right Sidebar) */}
      <RecommendedCars />
    </div>
  );
}
