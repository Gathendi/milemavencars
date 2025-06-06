import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import CarDetails from "./CarDetails";
import { X } from "lucide-react";

interface CarCardProps {
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
}

export default function CarCard({ car }: CarCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const handleBookNow = () => {
    if (!user) {
      // Redirect to login page with return URL
      window.location.href = `/login?returnUrl=/book/${car.id}`;
      return;
    }
    // If user is logged in, proceed to booking
    window.location.href = `/book/${car.id}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300">
        <CarDetails
          car={car}
          imageHeight="h-48"
          showPrice={true}
          noCardStyle={true}
        />
        <div className="p-6 pt-0">
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="flex-1 border border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg px-6 py-3 transition-colors"
              type="button"
            >
              Show More Details
            </button>
            <button
              onClick={handleBookNow}
              disabled={!car.available}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
                car.available
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              type="button"
            >
              {car.available ? "Book Now" : "Unavailable"}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                <button
                  onClick={handleBookNow}
                  disabled={!car.available}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                    car.available
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {car.available ? "Book Now" : "Unavailable"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
