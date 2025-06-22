import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import CarDetails from "./CarDetails";

interface Car {
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
  total_bookings?: number;
  active_bookings?: number;
}

interface CarCardProps {
  car: Car;
  isAdmin?: boolean;
  onEdit?: (car: Car) => void;
  onDelete?: (car: Car) => void;
}

export default function CarCard({
  car,
  isAdmin,
  onEdit,
  onDelete,
}: CarCardProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="relative">
          <img
            src={car.image_url}
            alt={car.name}
            className="w-full h-48 object-cover"
          />
          {!car.available && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
              Not Available
            </div>
          )}
          {isAdmin && (
            <div className="absolute bottom-2 right-2 flex space-x-2">
              <div className="bg-white/90 backdrop-blur-sm text-sm px-2 py-1 rounded-full">
                Total Bookings: {car.total_bookings || 0}
              </div>
              <div className="bg-white/90 backdrop-blur-sm text-sm px-2 py-1 rounded-full">
                Active: {car.active_bookings || 0}
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Category</span>
              <span className="font-medium">{car.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Price per day</span>
              <span className="font-medium text-red-600">
                KSh {car.price.toLocaleString()}
              </span>
            </div>
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

          <div className="mt-6 space-y-3">
            {isAdmin ? (
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit && onEdit(car)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete && onDelete(car)}
                >
                  Delete
                </Button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-full border border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg px-6 py-3 transition-colors"
                  type="button"
                >
                  Show More Details
                </button>
                <Link href={`/book/${car.id}`} className="block w-full">
                  <button
                    disabled={!car.available}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      car.available
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    type="button"
                  >
                    {car.available ? "Book Now" : "Not Available"}
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="sticky top-0 bg-gradient-to-r from-red-700 via-red-600 to-red-500 p-4 border-b flex justify-between items-center z-20">
              <h2 className="text-xl font-bold text-white">Car Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-red-800 rounded-full"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="p-6 pt-4">
              <CarDetails
                car={car}
                imageHeight="h-64"
                showPrice={true}
                noCardStyle={true}
              />
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-600">
                    {car.description ||
                      `Experience luxury and comfort with this ${car.category.toLowerCase()}. Perfect for both city driving and long journeys, this vehicle offers ${
                        car.seats
                      } comfortable seats and smooth ${car.transmission.toLowerCase()} transmission. Powered by ${car.fuel_type.toLowerCase()}, it delivers excellent performance and fuel efficiency.`}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Features</h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>
                      Spacious interior with {car.seats} comfortable seats
                    </li>
                    <li>{car.transmission} transmission for smooth driving</li>
                    <li>{car.fuel_type} engine for optimal performance</li>
                    <li>Modern safety features</li>
                    <li>Premium sound system</li>
                    <li>Climate control</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Pricing</h4>
                  <p className="text-gray-600">
                    Daily rate: KSh {car.price.toLocaleString()}
                    <br />
                    Weekly rate: KSh {(
                      car.price *
                      7 *
                      0.9
                    ).toLocaleString()}{" "}
                    (10% discount)
                    <br />
                    Monthly rate: KSh {(
                      car.price *
                      30 *
                      0.8
                    ).toLocaleString()}{" "}
                    (20% discount)
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Link href={`/book/${car.id}`} className="block w-full">
                  <button
                    disabled={!car.available}
                    className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                      car.available
                        ? "bg-red-600 hover:bg-red-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {car.available ? "Book Now" : "Not Available"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
