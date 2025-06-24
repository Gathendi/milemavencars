"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import debounce from "lodash/debounce";
import { useToast } from "@/components/ui/use-toast";
import { Eye, Pencil, Trash2 } from "lucide-react";

// Helper function to format price in KSh
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

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

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function VehicleListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("q") || "";

  // Function to fetch cars data
  const fetchCars = async (page: number, search: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/cars/search?page=${page}&q=${encodeURIComponent(
          search
        )}&limit=${pagination.limit}`
      );
      if (!response.ok) throw new Error("Failed to fetch cars");
      const data = await response.json();
      setCars(data.cars);
      setPagination(data.pagination);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cars. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      const params = new URLSearchParams(searchParams);
      params.set("q", search);
      params.set("page", "1"); // Reset to first page on search
      router.push(`/admin/cars/list?${params.toString()}`);
    }, 300),
    [router, searchParams]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  // Effect to fetch cars when params change
  useEffect(() => {
    fetchCars(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  // Generate pagination range
  const paginationRange = () => {
    const range = [];
    const showPages = 5;
    const leftOffset = Math.floor(showPages / 2);

    let start = currentPage - leftOffset;
    let end = currentPage + leftOffset;

    if (start < 1) {
      end += Math.abs(start) + 1;
      start = 1;
    }

    if (end > pagination.totalPages) {
      start -= end - pagination.totalPages;
      end = pagination.totalPages;
    }

    start = Math.max(start, 1);
    end = Math.min(end, pagination.totalPages);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      const response = await fetch(`/api/admin/cars/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete car");

      toast({
        title: "Success",
        description: "Vehicle has been deleted successfully.",
      });

      // Refresh the car list
      fetchCars();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vehicle List</h1>
          <p className="text-gray-600 mt-1">
            Manage your fleet of {pagination.total} vehicles
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/admin/cars/add">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
              </svg>
              Add Vehicle
            </Link>
          </Button>
          <Button className="gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Input
              type="search"
              placeholder="Search by vehicle name, category, transmission, or fuel type..."
              defaultValue={searchQuery}
              onChange={handleSearchChange}
              className="w-full pr-10"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
              </div>
            )}
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => {
                router.push("/admin/cars/list");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">
            Total Vehicles
          </div>
          <div className="text-2xl font-semibold mt-1">{pagination.total}</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Available</div>
          <div className="text-2xl font-semibold mt-1 text-green-600">
            {cars.filter((car) => car.available).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Featured</div>
          <div className="text-2xl font-semibold mt-1 text-blue-600">
            {cars.filter((car) => car.featured).length}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="text-sm font-medium text-gray-500">Categories</div>
          <div className="text-2xl font-semibold mt-1">
            {new Set(cars.map((car) => car.category)).size}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">S.No</th>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Vehicle Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Details</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cars.map((car, index) => (
                <tr
                  key={car.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-500">
                    {(currentPage - 1) * pagination.limit + index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-14 relative rounded-lg overflow-hidden bg-gray-50">
                      <Image
                        src={car.image_url || "/images/car-placeholder.png"}
                        alt={car.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {car.name}
                      </div>
                      <div className="text-xs text-gray-500">ID: {car.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {car.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {car.seats} Seats
                      </div>
                      <div className="text-xs text-gray-500">
                        {car.transmission} • {car.fuel_type}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {formatPrice(car.price)}
                      </div>
                      <div className="text-xs text-gray-500">Per Day</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          car.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {car.available ? "Available" : "Unavailable"}
                      </span>
                      {car.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:text-blue-600"
                      >
                        <Link href={`/admin/cars/${car.id}`}>
                          <Eye className="w-4 h-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:text-amber-600"
                      >
                        <Link href={`/admin/cars/${car.id}/edit`}>
                          <Pencil className="w-4 h-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:text-red-600"
                        onClick={() => handleDelete(car.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
              {Math.min(currentPage * pagination.limit, pagination.total)} of{" "}
              {pagination.total} vehicles
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/cars/list?page=${Math.max(1, currentPage - 1)}${
                  searchQuery ? `&q=${searchQuery}` : ""
                }`}
                className={`inline-flex items-center justify-center px-3 py-1 border rounded-md text-sm font-medium transition-colors
                  ${
                    currentPage === 1
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Previous
              </Link>
              {paginationRange().map((pageNum) => (
                <Link
                  key={pageNum}
                  href={`/admin/cars/list?page=${pageNum}${
                    searchQuery ? `&q=${searchQuery}` : ""
                  }`}
                  className={`inline-flex items-center justify-center w-8 h-8 border rounded-md text-sm font-medium transition-colors
                    ${
                      pageNum === currentPage
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {pageNum}
                </Link>
              ))}
              <Link
                href={`/admin/cars/list?page=${Math.min(
                  pagination.totalPages,
                  currentPage + 1
                )}${searchQuery ? `&q=${searchQuery}` : ""}`}
                className={`inline-flex items-center justify-center px-3 py-1 border rounded-md text-sm font-medium transition-colors
                  ${
                    currentPage === pagination.totalPages
                      ? "border-gray-200 text-gray-300 cursor-not-allowed"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
