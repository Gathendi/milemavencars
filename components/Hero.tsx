import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-4">
              <img
                src="https://images.unsplash.com/photo-1508974239320-0a029497e820?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D/1200x600/?car,fleet,luxury"
                alt="Premium car rental fleet"
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-6 -left-6 bg-white text-black p-6 rounded-xl shadow-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">500+</div>
                <div className="text-sm">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Drive Your
                <span className="text-red-600"> Dreams</span>
                <br />
                Across Kenya.
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Premium car rental solutions for business and leisure. Reliable,
                affordable, and professional service you can trust.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold">Trusted</h3>
                  <p className="text-sm text-gray-400">Reliable service</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-gray-400">Always available</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-red-600" />
                <div>
                  <h3 className="font-semibold">Premium Fleet</h3>
                  <p className="text-sm text-gray-400">Quality vehicles</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cars">
                <Button size="lg" className="flex items-center space-x-2">
                  <span>Book a Car Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
