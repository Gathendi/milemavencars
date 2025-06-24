"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Menu, X, Car } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="w-8 h-8 text-red-600" />
            <span className="text-2xl font-bold text-red-600">MileMaven</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link href="/cars" className="hover:text-red-600 transition-colors">
              Cars
            </Link>
            <Link
              href="/bookings"
              className="hover:text-red-600 transition-colors"
            >
              My Bookings
            </Link>
            <Link
              href="/contact"
              className="hover:text-red-600 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <ProfileMenu />
            ) : (
              <div className="space-x-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-red-600 transition-colors">
                Home
              </Link>
              <Link
                href="/cars"
                className="hover:text-red-600 transition-colors"
              >
                Cars
              </Link>
              <Link
                href="/bookings"
                className="hover:text-red-600 transition-colors"
              >
                My Bookings
              </Link>
              <Link
                href="/contact"
                className="hover:text-red-600 transition-colors"
              >
                Contact
              </Link>
              {user ? (
                <div className="pt-2 border-t border-gray-700">
                  <Link
                    href="/profile"
                    className="block py-2 hover:text-red-600"
                  >
                    Profile Settings
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block py-2 hover:text-red-600"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    variant="ghost"
                    className="w-full justify-start mt-2 text-red-600 hover:text-red-700"
                  >
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start">
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full justify-start">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
