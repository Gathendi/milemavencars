export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: 'user' | 'admin';
  phone?: string;
  license?: string;
  emergencyContact?: string;
}

export interface Booking {
  id: string;
  userId: string;
  carId: string;
  car: Car;
  start: string;
  end: string;
  status: 'active' | 'upcoming' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface Car {
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
}

export interface UserStats {
  activeRentals: number;
  loyaltyPoints: number;
  totalTrips: number;
  upcomingBookings: number;
}

export interface DashboardData {
  user: User;
  stats: UserStats;
  currentBookings: Booking[];
  upcomingBookings: Booking[];
  recentBookings: Booking[];
  recommendedCars: Car[];
} 