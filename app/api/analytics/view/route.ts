import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST() {
  try {
    const db = getAdminDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const docRef = db.collection("analytics").doc(`views_${today}`);

    await docRef.set(
      {
        date: today,
        count: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment daily views:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
