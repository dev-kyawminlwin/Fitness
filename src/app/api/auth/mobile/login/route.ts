import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const secret = process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev";
    
    // Create a robust JWT for the mobile client. Expires in 30 days.
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
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
