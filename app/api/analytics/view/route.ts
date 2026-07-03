import { NextResponse } from "next/server";
import { getMongoDb, ensureMongoIndexes } from "@/lib/mongodb";

export async function POST() {
  try {
    await ensureMongoIndexes();
    const db = await getMongoDb();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const collectionName = "analytics";

    await db.collection(collectionName).updateOne(
      { date: today },
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date() },
        $setOnInsert: { date: today }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to increment daily views:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
