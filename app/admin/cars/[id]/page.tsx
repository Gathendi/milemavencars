"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Car as CarIcon,
  Calendar,
  Users,
  Fuel,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  description: string;
  available: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export default function CarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCarDetails();
  }, []);

  const fetchCarDetails = async () => {
    try {
      const response = await fetch(`/api/admin/cars/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch car details");
      const data = await response.json();
      setCar(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch car details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/cars/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete car");

      toast({
        title: "Success",
        description: "Vehicle has been deleted successfully.",
      });

      router.push("/admin/cars/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Vehicle Not Found
          </h2>
          <p className="mt-2 text-gray-600">
            The vehicle you're looking for doesn't exist.
          </p>
          <Button asChild className="mt-4">
            <Link href="/admin/cars/list">Back to Vehicle List</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/cars/list">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{car.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/cars/${car.id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Vehicle
            </Link>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? "Deleting..." : "Delete Vehicle"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Image and Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-[4/3] relative">
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="space-y-3">
              {car.available && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Available
                </span>
              )}
              {car.featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Featured
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CarIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Category</span>
                </div>
                <p className="mt-1 text-gray-900">{car.category}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">Seats</span>
                </div>
                <p className="mt-1 text-gray-900">{car.seats} Seats</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Transmission</span>
                </div>
                <p className="mt-1 text-gray-900 capitalize">
                  {car.transmission}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Fuel className="w-5 h-5" />
                  <span className="text-sm font-medium">Fuel Type</span>
                </div>
                <p className="mt-1 text-gray-900 capitalize">{car.fuel_type}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Added On</span>
                </div>
                <p className="mt-1 text-gray-900">
                  {new Date(car.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm font-medium">Last Updated</span>
                </div>
                <p className="mt-1 text-gray-900">
                  {new Date(car.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Pricing</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-KE", {
                  style: "currency",
                  currency: "KES",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(car.price)}
              </span>
              <span className="text-gray-600">per day</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {car.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
