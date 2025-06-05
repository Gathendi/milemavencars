import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MileMaven - Premium Car Rental in Kenya",
  description:
    "Trusted car hire solutions for personal and corporate needs in Kenya. Reliable, affordable, and professional vehicle rentals.",
  keywords:
    "car rental Kenya, vehicle hire, corporate car rental, Nairobi car rental",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
