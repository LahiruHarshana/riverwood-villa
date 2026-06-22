import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Ensure admin app is initialized
if (getApps().length === 0) {
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountEnv) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT is not defined");
  }

  const decoded = Buffer.from(serviceAccountEnv, "base64").toString("utf-8");
  const serviceAccount = JSON.parse(decoded);

  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function POST(request: Request) {
  try {
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
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
