import Link from "next/link"
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Car } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Car className="w-8 h-8 text-red-600" />
              <h3 className="text-2xl font-bold text-red-600">MileMaven</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Kenya's trusted car rental service offering reliable and affordable vehicle solutions for personal and
              corporate needs.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-6 h-6 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" />
              <Twitter className="w-6 h-6 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" />
              <Instagram className="w-6 h-6 text-gray-400 hover:text-red-600 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/cars" className="text-gray-300 hover:text-red-600 transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/bookings" className="text-gray-300 hover:text-red-600 transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-red-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-red-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-red-600" />
                <span className="text-gray-300">+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-red-600" />
                <span className="text-gray-300">info@milemaven.co.ke</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <span className="text-gray-300">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 MileMaven. All rights reserved. | Trusted car rental in Kenya</p>
        </div>
      </div>
    </footer>
  )
}
