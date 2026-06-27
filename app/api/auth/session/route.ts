import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initAdminApp } from "@/lib/firebase-admin";

export async function POST(request: Request) {
  try {
    // Initialize admin app lazily to catch configuration errors during request handling
    initAdminApp();

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: "ID token is required" }, { status: 400 });
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    if (!uid) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("__session", idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Session error:", error);
    // Return the actual error message so it's easier to debug misconfigurations
    return NextResponse.json(
      { error: error?.message || "Failed to create session" },
      { status: 500 }
    );
  }
}
