import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { ensureMongoIndexes, getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type BookingDocument = {
  _id: ObjectId;
  roomId?: string;
  roomName?: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  checkIn?: Date;
  checkOut?: Date;
  guests?: number;
  specialRequests?: string;
  status?: "pending" | "confirmed" | "cancelled";
  whatsappSent?: boolean;
  total?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

async function requireAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("__session")?.value);
}

function serializeDate(value: unknown) {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string") return value;
  return new Date(0).toISOString();
}

function serializeBooking(booking: BookingDocument) {
  return {
    id: booking._id.toString(),
    roomId: booking.roomId || "",
    roomName: booking.roomName || "Room",
    guestName: booking.guestName || "",
    guestEmail: booking.guestEmail || "",
    guestPhone: booking.guestPhone || "",
    checkIn: serializeDate(booking.checkIn),
    checkOut: serializeDate(booking.checkOut),
    guests: Number(booking.guests || 1),
    specialRequests: booking.specialRequests || "",
    status: booking.status || "pending",
    whatsappSent: Boolean(booking.whatsappSent),
    total: Number(booking.total || 0),
    createdAt: serializeDate(booking.createdAt),
  };
}

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureMongoIndexes();

    const status = request.nextUrl.searchParams.get("status");
    const roomId = request.nextUrl.searchParams.get("roomId");
    const filter: Record<string, string> = {};

    if (status) filter.status = status;
    if (roomId) filter.roomId = roomId;

    const db = await getMongoDb();
    const bookings = await db
      .collection<BookingDocument>("bookings")
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ bookings: bookings.map(serializeBooking) });
  } catch (error) {
    console.error("Admin bookings lookup failed:", error);
    return NextResponse.json({ error: "Failed to load bookings" }, { status: 500 });
  }
}
