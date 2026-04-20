import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface MobileAuthResult {
  error?: NextResponse;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function verifyMobileAuth(request: Request): MobileAuthResult {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: NextResponse.json({ error: "Missing or invalid authorization header" }, { status: 401 }) };
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.NEXTAUTH_SECRET || "super-secret-key-for-dev";

  try {
    const decoded = jwt.verify(token, secret) as any;
    return {
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      }
    };
  } catch (error) {
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }
}
