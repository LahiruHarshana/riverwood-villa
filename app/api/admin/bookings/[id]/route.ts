import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { z } from "zod";
import { ensureMongoIndexes, getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const statusSchema = z.object({
  status: z.enum(["confirmed", "cancelled"]),
});

type RouteContext = { params: Promise<{ id: string }> };

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
};

async function requireAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("__session")?.value);
}

async function getBookingId(context: RouteContext) {
  const { id } = await context.params;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
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

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookingId = await getBookingId(context);

  if (!bookingId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  try {
    await ensureMongoIndexes();

    const db = await getMongoDb();
    const booking = await db.collection("bookings").findOne({ _id: bookingId });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking: serializeBooking(booking) });
  } catch (error) {
    console.error("Admin booking lookup failed:", error);
    return NextResponse.json({ error: "Failed to load booking" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookingId = await getBookingId(context);

  if (!bookingId) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  try {
    await ensureMongoIndexes();

    const { status } = statusSchema.parse(await request.json());
    const db = await getMongoDb();
    const booking = await db.collection("bookings").findOneAndUpdate(
      { _id: bookingId },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    await db.collection("roomBlocks").updateMany(
      { bookingId: bookingId.toString() },
      { $set: { status, active: status !== "cancelled", updatedAt: new Date() } }
    );

    return NextResponse.json({ booking: serializeBooking(booking) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Admin booking update failed:", error);
    return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
  }
}
