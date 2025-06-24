"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Key, Camera, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 mb-6 text-white shadow-xl">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-white/5 rounded-full flex items-center justify-center text-3xl font-semibold ring-4 ring-white/30 shadow-inner">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="w-4 h-4 text-red-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
                <p className="text-red-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-6">
            <div className="flex border-b">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-600 hover:text-red-600"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Information
              </h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={
                  isEditing ? "border-red-200 text-red-600 hover:bg-red-50" : ""
                }
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-red-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-red-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-red-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full p-3 border rounded-lg disabled:bg-gray-50 focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all duration-200"
                />
              </div>

              {/* Change Password Section */}
              <div className="pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Key className="w-4 h-4 text-red-600" />
                    <h3 className="text-lg font-medium text-gray-900">
                      Password
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      // TODO: Implement password change logic
                    }}
                  >
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Save Button */}
              {isEditing && (
                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
