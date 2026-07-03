import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    const db = getAdminDb();
    const doc = await db.collection("analytics").doc(`views_${dateStr}`).get();

    if (!doc.exists) {
      return NextResponse.json({ views: 0 });
    }

    const data = doc.data();
    return NextResponse.json({ views: data?.count || 0 });
  } catch (error) {
    console.error("Failed to fetch daily views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
