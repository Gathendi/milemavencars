"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import CarCard from "@/components/CarCard";

// Available options for dropdowns
const CATEGORIES = ["Sedan", "SUV", "Hatchback", "Van", "Luxury"];
const TRANSMISSION_TYPES = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];

interface Car {
  id: number;
  name: string;
  category: string;
  price: number;
  image_url: string;
  seats: number;
  transmission: string;
  fuel_type: string;
  description: string | null;
  available: boolean;
  total_bookings: number;
  active_bookings: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminCarsPage() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1,
  });
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    seats: "",
    transmission: "",
    fuel_type: "",
    image_url: "",
    description: "",
  });

  const fetchCars = async (page: number = 1) => {
    try {
      const response = await fetch(
        `/api/admin/cars?page=${page}&limit=${pagination.limit}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cars");
      }
      const data = await response.json();
      setCars(data.cars);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching cars:", error);
      toast({
        title: "Error",
        description: "Failed to fetch cars. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          price: parseFloat(formData.price),
          seats: parseInt(formData.seats),
          transmission: formData.transmission,
          fuel_type: formData.fuel_type,
          image_url: formData.image_url,
          description: formData.description || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add car");
      }

      // Reset form and close dialog
      setFormData({
        name: "",
        category: "",
        price: "",
        seats: "",
        transmission: "",
        fuel_type: "",
        image_url: "",
        description: "",
      });
      setIsOpen(false);

      // Show success toast
      toast({
        title: "Success!",
        description: "Car has been added successfully.",
        duration: 3000,
      });

      // Refresh the car list
      fetchCars(pagination.page);
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add car. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleEdit = (car: Car) => {
    // Implement edit functionality
    console.log("Edit car:", car);
  };

  const handleDelete = async (car: Car) => {
    if (!confirm("Are you sure you want to delete this car?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/cars?id=${car.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete car");
      }

      toast({
        title: "Success!",
        description: "Car has been deleted successfully.",
        duration: 3000,
      });

      // Refresh the car list
      fetchCars(pagination.page);
    } catch (error) {
      console.error("Error deleting car:", error);
      toast({
        title: "Error",
        description: "Failed to delete car. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cars Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Car</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Car Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    placeholder="e.g. Toyota Camry"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[1000] bg-white shadow-lg border rounded-md min-w-[200px]"
                    >
                      {CATEGORIES.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase()}
                          className="cursor-pointer py-2.5 px-4 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Price per day (KSh) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="100"
                    placeholder="e.g. 5000"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Number of Seats <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    type="number"
                    min="2"
                    max="15"
                    placeholder="e.g. 5"
                    value={formData.seats}
                    onChange={(e) =>
                      setFormData({ ...formData, seats: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Transmission <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transmission: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[1000] bg-white shadow-lg border rounded-md min-w-[200px]"
                    >
                      {TRANSMISSION_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase()}
                          className="cursor-pointer py-2.5 px-4 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Fuel Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={formData.fuel_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, fuel_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="z-[1000] bg-white shadow-lg border rounded-md min-w-[200px]"
                    >
                      {FUEL_TYPES.map((type) => (
                        <SelectItem
                          key={type}
                          value={type.toLowerCase()}
                          className="cursor-pointer py-2.5 px-4 hover:bg-gray-100 focus:bg-gray-100"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Image URL <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  type="url"
                  placeholder="https://example.com/car-image.jpg"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Description
                </label>
                <Textarea
                  placeholder="Enter detailed description of the car..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Car</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Car listing section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            isAdmin={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => fetchCars(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "default" : "outline"}
                onClick={() => fetchCars(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}
          <Button
            variant="outline"
            onClick={() => fetchCars(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
