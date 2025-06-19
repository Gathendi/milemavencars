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
  {
    key: "dashboard",
    label: "Dashboard Overview",
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
    label: "MileAI Assistant",
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

function UserProfileCard({ user }: { user: any }) {
  return (
    <div className="mb-8 text-center relative z-10">
      <div className="relative inline-block group mb-3">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/80 shadow-lg mx-auto backdrop-blur-sm">
          <img
            src={
              user?.avatar ||
              "https://ui-avatars.com/api/?name=Boniface+Gathendi&background=ff0000"
            }
            alt="Profile"
            className="w-full h-full object-cover"
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
      <p className="text-sm text-gray-500 mb-3">
        {user?.email || mockProfile.email}
      </p>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full text-sm backdrop-blur-sm bg-white/80 hover:bg-white/90"
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
              <div
                key={car.id}
                className="flex items-center gap-4 p-3 rounded-lg backdrop-blur-sm bg-white/40 hover:bg-white/60 transition-colors"
              >
                <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.currentTarget.src = "https://via.placeholder.com/150")
                    }
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{car.name}</div>
                  <div className="text-sm text-gray-500">{car.price}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="backdrop-blur-sm bg-white/80 hover:bg-white/90"
                >
                  View
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar with glass effect */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-4 backdrop-blur-xl bg-white/70 rounded-xl border border-white/20 shadow-lg p-4 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent pointer-events-none" />

            <UserProfileCard user={user} />
            <nav className="space-y-1 relative">
              {TABS.map((tab, index) => (
                <div key={tab.key}>
                  <button
                    onClick={() => setSelectedTab(tab.key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left relative overflow-hidden ${
                      selectedTab === tab.key
                        ? "bg-red-500/10 text-red-600 shadow-sm backdrop-blur-md"
                        : "text-gray-600 hover:bg-white/40 hover:shadow-sm hover:backdrop-blur-sm"
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10">{tab.icon}</span>
                    <span className="text-sm font-medium relative z-10">
                      {tab.label}
                    </span>
                  </button>
                  {/* Add divider except for last item */}
                  {index < TABS.length - 1 && (
                    <div className="h-px bg-gray-200/50 my-1 mx-4" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">
            <div className="[&_div.card]:backdrop-blur-md [&_div.card]:bg-white/70 [&_div.card]:border-white/20 [&_div.card]:shadow-lg">
              {content}
            </div>
          </div>
        </main>

        {/* Recommended Cars with glass effect */}
        <RecommendedCars />
      </div>
    </div>
  );
}
