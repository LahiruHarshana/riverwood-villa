import { NextRequest, NextResponse } from "next/server";
import { getMongoDb, ensureMongoIndexes } from "@/lib/mongodb";
import { cookies } from "next/headers";

async function requireAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("__session")?.value);
}

export async function GET(req: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const dateStr = url.searchParams.get("date");

    if (!dateStr) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
    }

    await ensureMongoIndexes();
    const db = await getMongoDb();
    const doc = await db.collection("analytics").findOne({ date: dateStr });

    if (!doc) {
      return NextResponse.json({ views: 0 });
    }

    return NextResponse.json({ views: doc.count || 0 });
  } catch (error) {
    console.error("Failed to fetch daily views:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
