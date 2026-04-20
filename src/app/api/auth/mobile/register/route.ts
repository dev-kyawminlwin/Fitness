import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role = "USER" } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role
      }
    });

    const secret = process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev";
    
    // Auto-login the user immediately after registration
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
      },
      secret,
      { expiresIn: '30d' }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    });

  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
