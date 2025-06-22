"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

// Mock data - Replace with actual API calls
const mockCars = [
  {
    id: 1,
    name: "Toyota Prado",
    category: "SUV",
    price: 15000,
    seats: 7,
    transmission: "Automatic",
    fuel_type: "Diesel",
    available: true,
    image_url: "https://example.com/prado.jpg",
  },
  {
    id: 2,
    name: "Tesla Model 3",
    category: "Sedan",
    price: 20000,
    seats: 5,
    transmission: "Automatic",
    fuel_type: "Electric",
    available: true,
    image_url: "https://example.com/tesla.jpg",
  },
];

function CarForm({
  car = null,
  onSubmit,
}: {
  car?: any;
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState(
    car || {
      name: "",
      category: "",
      price: "",
      seats: "",
      transmission: "",
      fuel_type: "",
      image_url: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Input
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (KES)</label>
          <Input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Seats</label>
          <Input
            type="number"
            value={formData.seats}
            onChange={(e) =>
              setFormData({ ...formData, seats: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Transmission</label>
          <Input
            value={formData.transmission}
            onChange={(e) =>
              setFormData({ ...formData, transmission: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Fuel Type</label>
          <Input
            value={formData.fuel_type}
            onChange={(e) =>
              setFormData({ ...formData, fuel_type: e.target.value })
            }
            required
          />
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        {car ? "Update Car" : "Add Car"}
      </Button>
    </form>
  );
}

export default function CarsManagement() {
  const [cars, setCars] = useState(mockCars);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<any>(null);

  const handleAddCar = async (data: any) => {
    // TODO: Replace with actual API call
    const newCar = {
      ...data,
      id: cars.length + 1,
      available: true,
    };
    setCars([...cars, newCar]);
    setIsAddDialogOpen(false);
  };

  const handleEditCar = async (data: any) => {
    // TODO: Replace with actual API call
    const updatedCars = cars.map((car) =>
      car.id === editingCar.id ? { ...car, ...data } : car
    );
    setCars(updatedCars);
    setEditingCar(null);
  };

  const handleDeleteCar = async (id: number) => {
    // TODO: Replace with actual API call
    if (window.confirm("Are you sure you want to delete this car?")) {
      const updatedCars = cars.filter((car) => car.id !== id);
      setCars(updatedCars);
    }
  };

  const handleToggleAvailability = async (id: number) => {
    // TODO: Replace with actual API call
    const updatedCars = cars.map((car) =>
      car.id === id ? { ...car, available: !car.available } : car
    );
    setCars(updatedCars);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cars</h2>
          <p className="text-muted-foreground">Manage your car fleet</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Car</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Car</DialogTitle>
            </DialogHeader>
            <CarForm onSubmit={handleAddCar} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {cars.map((car) => (
          <Card key={car.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{car.name}</CardTitle>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setEditingCar(car)}
                    >
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Car</DialogTitle>
                    </DialogHeader>
                    <CarForm car={car} onSubmit={handleEditCar} />
                  </DialogContent>
                </Dialog>
                <Button
                  variant={car.available ? "default" : "secondary"}
                  onClick={() => handleToggleAvailability(car.id)}
                >
                  {car.available ? "Mark Unavailable" : "Mark Available"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteCar(car.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-gray-500">{car.category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Price</p>
                  <p className="text-sm text-gray-500">
                    KES {car.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Seats</p>
                  <p className="text-sm text-gray-500">{car.seats}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Transmission</p>
                  <p className="text-sm text-gray-500">{car.transmission}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Fuel Type</p>
                  <p className="text-sm text-gray-500">{car.fuel_type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p
                    className={`text-sm ${
                      car.available ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {car.available ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
