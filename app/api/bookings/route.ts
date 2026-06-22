import { NextResponse } from "next/server";
import { createBooking, BookingFormData } from "@/lib/firestore/bookings";
import { sendWhatsAppToAdmin } from "@/lib/callmebot";
import { z } from "zod";

const bookingSchema = z.object({
  roomId: z.string().min(1),
  roomName: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(1),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  guests: z.number().min(1),
  specialRequests: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);

    const bookingData: BookingFormData = {
      roomId: validatedData.roomId,
      roomName: validatedData.roomName,
      guestName: validatedData.guestName,
      guestEmail: validatedData.guestEmail,
      guestPhone: validatedData.guestPhone,
      checkIn: new Date(validatedData.checkIn),
      checkOut: new Date(validatedData.checkOut),
      guests: validatedData.guests,
      specialRequests: validatedData.specialRequests || "",
    };

    const bookingId = await createBooking(bookingData);

    // Send WhatsApp notification (best-effort, don't block on failure)
    try {
      const message = `New Booking Request for ${bookingData.roomName} from ${bookingData.guestName}. Check-in: ${bookingData.checkIn.toLocaleDateString()}. Phone: ${bookingData.guestPhone}`;
      await sendWhatsAppToAdmin(message);
    } catch (err) {
      console.error("WhatsApp notification failed:", err);
    }

    return NextResponse.json({ bookingId }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}
