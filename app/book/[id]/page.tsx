"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Calendar, Clock, MapPin } from "lucide-react";

interface Car {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  seats: number;
  transmission: string;
  fuel: string;
}

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    pickupLocation: "",
    dropoffLocation: "",
    driverLicense: "",
    phoneNumber: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchCar();
  }, [user]);

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${params.id}`);
      const data = await response.json();
      setCar(data);
    } catch (error) {
      console.error("Error fetching car:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!car || !formData.startDate || !formData.endDate) return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Math.max(1, days) * car.price;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carId: params.id,
          ...formData,
          totalAmount: calculateTotal(),
        }),
      });

      if (response.ok) {
        router.push("/bookings?success=true");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-600">Car not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Book Your Vehicle</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Car Details */}
          <div className="card p-6">
            <img
              src={
                car.image ||
                `https://source.unsplash.com/800x600/?car&sig=${car.id}`
              }
              alt={car.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{car.name}</h2>
            <p className="text-gray-600 mb-4">{car.category}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Seats:</span> {car.seats}
              </div>
              <div>
                <span className="font-semibold">Transmission:</span>{" "}
                {car.transmission}
              </div>
              <div>
                <span className="font-semibold">Fuel:</span> {car.fuel}
              </div>
              <div>
                <span className="font-semibold">Price:</span> KSh{" "}
                {car.price.toLocaleString()}/day
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="card p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="input-field"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Calendar className="inline w-4 h-4 mr-1" />
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="input-field"
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <Clock className="inline w-4 h-4 mr-1" />
                    Return Time
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Pickup Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter pickup location"
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pickupLocation: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    Drop-off Location
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter drop-off location"
                    value={formData.dropoffLocation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dropoffLocation: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Driver Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Driver's License Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="License number"
                    value={formData.driverLicense}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        driverLicense: e.target.value,
                      })
                    }
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 700 123 456"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  placeholder="Any special requirements or requests..."
                  value={formData.specialRequests}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      specialRequests: e.target.value,
                    })
                  }
                  className="input-field h-24 resize-none"
                />
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-red-600">
                    KSh {calculateTotal().toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Processing..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
