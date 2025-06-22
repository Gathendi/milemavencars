import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: "user" | "admin";
      phone?: string;
    }
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    email: string;
    name: string;
    role: "user" | "admin";
    phone?: string;
  }
} 