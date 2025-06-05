"use client"

import { useState, useEffect } from "react"
import CarCard from "@/components/CarCard"
import { Search, Filter } from "lucide-react"

interface Car {
  id: string
  name: string
  category: string
  price: number
  image: string
  seats: number
  transmission: string
  fuel: string
  available: boolean
}

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCars()
  }, [])

  useEffect(() => {
    filterCars()
  }, [cars, searchTerm, selectedCategory, priceRange])

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/cars")
      const data = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCars = () => {
    let filtered = cars

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (car) =>
          car.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((car) => car.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Price filter
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number)
      filtered = filtered.filter((car) => {
        if (max) {
          return car.price >= min && car.price <= max
        } else {
          return car.price >= min
        }
      })
    }

    setFilteredCars(filtered)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Our <span className="text-red-600">Vehicle Fleet</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our extensive collection of premium vehicles, perfect for any journey across Kenya.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="hatchback">Hatchback</option>
            <option value="luxury">Luxury</option>
          </select>

          {/* Price Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Prices</option>
            <option value="0-3000">Under KSh 3,000</option>
            <option value="3000-6000">KSh 3,000 - 6,000</option>
            <option value="6000-10000">KSh 6,000 - 10,000</option>
            <option value="10000">Above KSh 10,000</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
              setPriceRange("all")
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredCars.length} of {cars.length} vehicles
        </p>
      </div>

      {/* Cars Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No cars found</h3>
          <p className="text-gray-500">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  )
}
