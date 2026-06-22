import { NextResponse } from "next/server";
import { getBookingById } from "@/lib/firestore/bookings";
import { sendWhatsAppToAdmin } from "@/lib/callmebot";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json();

    if (!bookingId) {
      return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const booking = await getBookingById(bookingId);
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

    // Update booking.whatsappSent to true
    const bookingRef = doc(db, "bookings", bookingId);
    await updateDoc(bookingRef, { whatsappSent: true });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Notify booking error:", error);
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 });
  }
}
