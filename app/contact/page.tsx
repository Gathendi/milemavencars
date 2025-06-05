"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Message sent successfully! We'll get back to you soon.")
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      } else {
        alert("Failed to send message. Please try again.")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      alert("Failed to send message. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in <span className="text-red-600">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions about our car rental services? We're here to help you find the perfect vehicle for your
            journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 mb-8">
                Reach out to us through any of the following channels. Our team is ready to assist you with all your car
                rental needs.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Our Location</h3>
                  <p className="text-gray-600">
                    Westlands, Nairobi
                    <br />
                    Kenya
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone Numbers</h3>
                  <p className="text-gray-600">
                    +254 700 123 456
                    <br />
                    +254 711 987 654
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Addresses</h3>
                  <p className="text-gray-600">
                    info@milemaven.co.ke
                    <br />
                    support@milemaven.co.ke
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Business Hours</h3>
                  <p className="text-gray-600">
                    Monday - Friday: 8:00 AM - 6:00 PM
                    <br />
                    Saturday: 9:00 AM - 4:00 PM
                    <br />
                    Sunday: 10:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Interactive Map</p>
                <p className="text-sm">Nairobi, Kenya</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+254 700 123 456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <select
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Support</option>
                    <option value="corporate">Corporate Rentals</option>
                    <option value="complaint">Complaint</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input-field resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? "Sending..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
