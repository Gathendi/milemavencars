import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";

// Helper function to format price in KSh
function formatPrice(price: number) {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

async function getCars(page: number = 1, limit: number = 10) {
  try {
    const offset = (page - 1) * limit;

    // Get total count
    const totalCountResult = await db.query(
      "SELECT COUNT(*) FROM cars WHERE deleted_at IS NULL"
    );
    const total = parseInt(totalCountResult.rows[0].count);

    // Get cars with pagination
    const result = await db.query(
      `SELECT 
        id, 
        name, 
        category, 
        price, 
        image_url, 
        seats,
        transmission,
        fuel_type,
        description,
        available,
        featured,
        created_at,
        updated_at
      FROM cars 
      WHERE deleted_at IS NULL 
      ORDER BY featured DESC, created_at DESC 
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    return {
      cars: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    throw new Error("Failed to fetch cars");
  }
}

export default async function VehicleListPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { cars, pagination } = await getCars(currentPage);

  // Generate pagination range
  const paginationRange = () => {
    const range = [];
    const showPages = 5; // Number of page buttons to show
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
              {cars.map((car: any, index: number) => (
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
                        {formatPrice(parseFloat(car.price))}
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
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        title="View Details"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path
                            fillRule="evenodd"
                            d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
                        title="Edit Vehicle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                      </button>
                      <button
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors"
                        title="Delete Vehicle"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
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
                href={`/admin/cars/list?page=${Math.max(1, currentPage - 1)}`}
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
                  href={`/admin/cars/list?page=${pageNum}`}
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
                )}`}
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
