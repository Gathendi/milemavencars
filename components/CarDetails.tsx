import { Users, Fuel, Settings } from "lucide-react";
import Image from "next/image";

interface CarDetailsProps {
  car: {
    id: string | number;
    name: string;
    category: string;
    price: number;
    image_url: string;
    seats: number;
    transmission: string;
    fuel_type: string;
    available: boolean;
    description?: string;
  };
  imageHeight?: string;
  showPrice?: boolean;
  noCardStyle?: boolean;
}

export default function CarDetails({
  car,
  imageHeight = "h-48",
  showPrice = false,
  noCardStyle = false,
}: CarDetailsProps) {
  const formatPrice = (price: number | null): string => {
    if (price === null || typeof price !== "number") {
      return "0";
    }
    return price.toLocaleString();
  };

  const content = (
    <>
      <div className="relative">
        <img
          src={car.image_url}
          alt={car.name}
          className={`w-full ${imageHeight} object-cover rounded-t-lg`}
        />
        {!car.available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            Not Available
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-4">{car.name}</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Category</span>
            <span className="font-medium">{car.category}</span>
          </div>
          {showPrice && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Price per day</span>
              <span className="font-medium text-red-600">
                KSh {formatPrice(car.price)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Seats</span>
            <span className="font-medium">{car.seats}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Transmission</span>
            <span className="font-medium">{car.transmission}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Fuel Type</span>
            <span className="font-medium">{car.fuel_type}</span>
          </div>
        </div>
      </div>
    </>
  );

  if (noCardStyle) {
    return content;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {content}
    </div>
  );
}
