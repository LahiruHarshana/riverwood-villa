import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { sendWhatsAppToAdmin } from "@/lib/callmebot";
import { getMongoDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    if (!ObjectId.isValid(bookingId)) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const db = await getMongoDb();
    const booking = await db.collection("bookings").findOne({ _id: new ObjectId(bookingId) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const message = `
🏡 *New Booking Request — Riverwood Villa*

Guest: ${booking.guestName}
Room: ${booking.roomName}
Check-in: ${new Date(booking.checkIn).toLocaleDateString()}
Check-out: ${new Date(booking.checkOut).toLocaleDateString()}
Guests: ${booking.guests}
Phone: ${booking.guestPhone}
Special Requests: ${booking.specialRequests || "None"}

Reply on Dashboard: /admin/bookings/${bookingId}
    `.trim();

    await sendWhatsAppToAdmin(message);

    await db.collection("bookings").updateOne(
      { _id: new ObjectId(bookingId) },
      { $set: { whatsappSent: true, updatedAt: new Date() } }
    );

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Notify booking error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
