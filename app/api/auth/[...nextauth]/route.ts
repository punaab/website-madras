import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";
import { User } from "@prisma/client";
import { authOptions } from "./options";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 