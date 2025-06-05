import { Users, Fuel, Settings } from "lucide-react";
import Link from "next/link";

interface CarCardProps {
  car: {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    seats: number;
    transmission: string;
    fuel: string;
    available: boolean;
  };
}

export default function CarCard({ car }: CarCardProps) {
  return (
    <div className="card overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={
            car.image ||
            `https://source.unsplash.com/800x600/?car&sig=${car.id}`
          }
          alt={car.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {car.category}
          </span>
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{car.name}</h3>

        {/* Car Features */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>{car.seats} seats</span>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>{car.transmission}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Fuel className="w-4 h-4" />
            <span>{car.fuel}</span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold text-red-600">
              KSh {car.price.toLocaleString()}
            </span>
            <span className="text-gray-500">/day</span>
          </div>
          <Link
            href={car.available ? `/book/${car.id}` : "#"}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              car.available
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {car.available ? "Book Now" : "Unavailable"}
          </Link>
        </div>
      </div>
    </div>
  );
}
