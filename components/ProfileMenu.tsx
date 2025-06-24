"use client";

import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, UserCircle } from "lucide-react";
import Link from "next/link";

export default function ProfileMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none group">
        <div className="flex items-center space-x-2 rounded-full p-1 transition-all duration-200 ease-in-out group-hover:bg-white/10">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-medium shadow-lg ring-2 ring-white/10 transition-all duration-200 ease-in-out group-hover:shadow-red-500/20 group-hover:ring-white/20">
              {initials}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition-all duration-200 ease-in-out"></div>
          </div>
          <div className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
            {user.name.split(" ")[0]}
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[280px] p-2 bg-white/95 backdrop-blur-sm border-none shadow-2xl shadow-black/10 rounded-xl mt-2"
      >
        <DropdownMenuLabel className="p-3">
          <div className="flex items-center space-x-4">
            <div className="shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white text-lg font-medium shadow-lg">
                {initials}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-base font-semibold text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 opacity-50" />
        <div className="px-1 py-1">
          <DropdownMenuItem asChild className="rounded-lg">
            <Link
              href="/profile"
              className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors duration-150"
            >
              <User className="mr-2 h-4 w-4 text-red-600" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          {user.role === "admin" && (
            <DropdownMenuItem asChild className="rounded-lg">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-red-50 transition-colors duration-150"
              >
                <Settings className="mr-2 h-4 w-4 text-red-600" />
                <span>Admin Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
        </div>
        <DropdownMenuSeparator className="my-2 opacity-50" />
        <div className="px-1 py-1">
          <DropdownMenuItem
            className="rounded-lg flex items-center px-3 py-2 cursor-pointer text-red-600 hover:bg-red-50 transition-colors duration-150"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
