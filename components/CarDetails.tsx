import { Users, Fuel, Settings } from "lucide-react";
import Image from "next/image";

interface CarDetailsProps {
  car: {
    id: string;
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
  showPrice?: boolean;
  imageHeight?: string;
  noCardStyle?: boolean;
}

export default function CarDetails({
  car,
  showPrice = true,
  imageHeight = "h-64",
  noCardStyle = false,
}: CarDetailsProps) {
  const content = (
    <>
      <div className={`relative w-full ${imageHeight}`}>
        <Image
          src={
            car.image_url ||
            `https://source.unsplash.com/800x600/?car&sig=${car.id}`
          }
          alt={car.name}
          fill
          className="object-cover rounded-t-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {car.category}
          </span>
        </div>
        {!car.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-xl">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Not Available
            </span>
          </div>
        )}
      </div>
      <div className="p-6 pb-2">
        <h3 className="text-xl font-bold mb-1">{car.name}</h3>
        {car.description && (
          <p className="text-gray-600 mb-2">{car.description}</p>
        )}
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
            <span>{car.fuel_type}</span>
          </div>
        </div>
        {showPrice && (
          <div className="mb-2">
            <span className="text-2xl font-bold text-red-600">
              KSh {car.price.toLocaleString()}
            </span>
            <span className="text-gray-500">/day</span>
          </div>
        )}
      </div>
    </>
  );

  if (noCardStyle) {
    return content;
  }
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {content}
    </div>
  );
}
