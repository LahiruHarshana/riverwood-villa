import { NextResponse } from "next/server";
import { getPublicRooms } from "@/lib/public-rooms";

export const runtime = "nodejs";

export async function GET() {
  try {
    const rooms = await getPublicRooms();
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("Public rooms lookup failed:", error);
    return NextResponse.json({ error: "Failed to load rooms" }, { status: 500 });
  }
}
