"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  CalendarClock,
  ChevronDown,
  ListChecks,
  Plus,
  LucideIcon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavItem {
  title: string;
  href?: string;
  icon: LucideIcon;
  items?: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
}

const sidebarItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Fleet",
    icon: Car,
    items: [
      {
        title: "Vehicle List",
        href: "/admin/cars/list",
        icon: ListChecks,
      },
      {
        title: "Add Vehicle",
        href: "/admin/cars/add",
        icon: Plus,
      },
    ],
  },
  {
    title: "Manage Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Manage Bookings",
    href: "/admin/bookings",
    icon: CalendarClock,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [openDropdown, setOpenDropdown] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close mobile menu when screen size becomes larger
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-gray-100">
        <Link href="/admin" className="block">
          <Image
            src="/Milemaven SVG logo.svg"
            alt="MileMaven"
            width={150}
            height={40}
            priority
            className="dark:invert"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-2">
            {item.items ? (
              <div className="space-y-1">
                <button
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                    ${
                      openDropdown === index
                        ? "bg-red-50 text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  onClick={() =>
                    setOpenDropdown(openDropdown === index ? -1 : index)
                  }
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openDropdown === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`pl-11 space-y-1 overflow-hidden transition-all duration-200 ${
                    openDropdown === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {item.items.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                        pathname === subItem.href
                          ? "bg-red-50 text-red-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <subItem.icon className="w-4 h-4" />
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.href!}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-red-50 text-red-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-sm font-medium text-red-600">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin User
            </p>
            <p className="text-xs text-gray-500 truncate">
              admin@milemaven.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-20 left-4 z-[60]">
        <Button
          variant="outline"
          size="icon"
          className="bg-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 bg-black/20 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-8rem)] w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out z-[50]
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-[calc(100vh-8rem)]">
        <div className="container mx-auto p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
