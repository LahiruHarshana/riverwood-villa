import { NextResponse } from "next/server";
import { MongoServerError, ObjectId } from "mongodb";
import { getMongoClient, getMongoDb } from "@/lib/mongodb";
import { z } from "zod";

export const runtime = "nodejs";

const MAX_STAY_NIGHTS = 30;

const bookingSchema = z.object({
  roomId: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: z.string().email(),
  guestPhone: z.string().min(1),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  guests: z.number().min(1),
  specialRequests: z.string().optional(),
  paymentMethod: z.enum(["pay_at_hotel", "bank_transfer"]).optional().default("pay_at_hotel"),
}).refine((data) => {
  const checkIn = parseStayDate(data.checkIn);
  const checkOut = parseStayDate(data.checkOut);
  return Boolean(checkIn && checkOut && checkOut > checkIn);
}, {
  message: "Check-out must be after check-in.",
  path: ["checkOut"],
});

type BookingRequest = z.infer<typeof bookingSchema>;

type RoomDocument = {
  _id: ObjectId;
  name?: string;
  isAvailable?: boolean;
  status?: string;
  maxGuests?: number;
  pricePerNight?: number;
  currency?: string;
};

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function parseStayDate(value: string) {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00.000Z`)
    : new Date(value);

  if (Number.isNaN(parsed.getTime())) return null;

  return new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
}

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function enumerateNightKeys(checkIn: Date, checkOut: Date) {
  const keys: string[] = [];
  const cursor = new Date(checkIn);

  while (cursor < checkOut) {
    keys.push(dateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return keys;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendBookingEmail(params: {
  to: string;
  guestName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  total: number;
  currency: string;
  paymentMethod: BookingRequest["paymentMethod"];
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.warn("Resend credentials are missing; booking email skipped.");
    return false;
  }

  const paymentCopy = params.paymentMethod === "bank_transfer"
    ? "Your request is pending while we share bank transfer instructions and confirm the deposit."
    : "Your request is pending and payment can be handled at the property.";
  const guestName = escapeHtml(params.guestName);
  const roomName = escapeHtml(params.roomName);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: `Riverwood Villa booking request received`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#151512">
          <h1 style="font-family:Georgia,serif;font-weight:500">Booking request received</h1>
          <p>Hi ${guestName},</p>
          <p>Thank you for choosing Riverwood Villa. We received your request for <strong>${roomName}</strong>.</p>
          <p><strong>Dates:</strong> ${params.checkIn} to ${params.checkOut}<br />
          <strong>Nights:</strong> ${params.nights}<br />
          <strong>Total:</strong> ${formatMoney(params.total, params.currency)}</p>
          <p>${paymentCopy}</p>
          <p>We will contact you shortly to finalize the reservation.</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    console.error("Resend booking email failed:", message);
    return false;
  }

  return true;
}

async function sendWhatsAppAdminNotification(message: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const adminPhone = process.env.WHATSAPP_ADMIN_PHONE;

  if (!accessToken || !phoneNumberId || !adminPhone) {
    console.warn("Meta WhatsApp credentials are missing; admin notification skipped.");
    return false;
  }

  const response = await fetch(`https://graph.facebook.com/v20.0/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: adminPhone,
      type: "text",
      text: { preview_url: false, body: message },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Meta WhatsApp notification failed:", error);
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = bookingSchema.parse(body);
    const checkIn = parseStayDate(validatedData.checkIn);
    const checkOut = parseStayDate(validatedData.checkOut);

    if (!checkIn || !checkOut) {
      return NextResponse.json({ error: "Invalid stay dates." }, { status: 400 });
    }

    const nightKeys = enumerateNightKeys(checkIn, checkOut);

    if (nightKeys.length === 0 || nightKeys.length > MAX_STAY_NIGHTS) {
      return NextResponse.json(
        { error: `Stay length must be between 1 and ${MAX_STAY_NIGHTS} nights.` },
        { status: 400 }
      );
    }

    const bookingId = new ObjectId();
    let notificationPayload: Awaited<ReturnType<typeof createBookingTransaction>>;

    notificationPayload = await createBookingTransaction({
      bookingId,
      validatedData,
      checkIn,
      checkOut,
      nightKeys,
    });

    await Promise.allSettled([
      sendBookingEmail({
        to: validatedData.guestEmail,
        guestName: validatedData.guestName,
        roomName: notificationPayload.roomName,
        checkIn: dateKey(checkIn),
        checkOut: dateKey(checkOut),
        nights: notificationPayload.nights,
        total: notificationPayload.total,
        currency: notificationPayload.currency,
        paymentMethod: validatedData.paymentMethod,
      }),
      sendWhatsAppAdminNotification(
        `New Riverwood booking request: ${notificationPayload.roomName}, ${dateKey(checkIn)} to ${dateKey(checkOut)}, ${validatedData.guests} guest(s), ${validatedData.guestName}, ${validatedData.guestPhone}.`
      ),
    ]);

    return NextResponse.json({ bookingId: bookingId.toString(), status: "pending" }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    console.error("Booking creation error:", error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

async function createBookingTransaction({
  bookingId,
  validatedData,
  checkIn,
  checkOut,
  nightKeys,
}: {
  bookingId: ObjectId;
  validatedData: BookingRequest;
  checkIn: Date;
  checkOut: Date;
  nightKeys: string[];
}) {
  if (!ObjectId.isValid(validatedData.roomId)) {
    throw new ApiError("Selected room was not found.", 404);
  }

  const client = await getMongoClient();
  const db = await getMongoDb();
  const roomsCollectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
  const roomsCollection = db.collection<RoomDocument>(roomsCollectionName);
  const bookingsCollection = db.collection("bookings");
  const roomBlocksCollection = db.collection("roomBlocks");
  const roomObjectId = new ObjectId(validatedData.roomId);

  await roomBlocksCollection.createIndex(
    { roomId: 1, dateKey: 1 },
    { unique: true, partialFilterExpression: { active: true } }
  );

  const session = client.startSession();

  try {
    let result: { roomName: string; nights: number; total: number; currency: string } | undefined;

    await session.withTransaction(async () => {
      const room = await roomsCollection.findOne({ _id: roomObjectId }, { session });

      if (!room) {
        throw new ApiError("Selected room was not found.", 404);
      }

      const maxGuests = Number(room.maxGuests || 1);
      const roomStatus = room.status || "active";

      if (room.isAvailable === false || roomStatus !== "active") {
        throw new ApiError("Selected room is not available for booking.", 409);
      }

      if (validatedData.guests > maxGuests) {
        throw new ApiError(`Selected room allows a maximum of ${maxGuests} guests.`, 400);
      }

      const existingBlock = await roomBlocksCollection.findOne(
        { roomId: validatedData.roomId, dateKey: { $in: nightKeys }, active: { $ne: false } },
        { session }
      );

      if (existingBlock) {
        throw new ApiError("This room is no longer available for the selected dates.", 409);
      }

      const roomName = String(room.name || "Room");
      const nights = nightKeys.length;
      const pricePerNight = Number(room.pricePerNight || 0);
      const currency = String(room.currency || process.env.NEXT_PUBLIC_BOOKING_CURRENCY || "USD");
      const subtotal = pricePerNight * nights;
      const taxes = 0;
      const total = subtotal + taxes;
      const now = new Date();

      await bookingsCollection.insertOne(
        {
          _id: bookingId,
          roomId: validatedData.roomId,
          roomObjectId,
          roomName,
          guestName: validatedData.guestName,
          guestEmail: validatedData.guestEmail,
          guestPhone: validatedData.guestPhone,
          checkIn,
          checkOut,
          checkInKey: dateKey(checkIn),
          checkOutKey: dateKey(checkOut),
          nightKeys,
          guests: validatedData.guests,
          nights,
          pricePerNight,
          subtotal,
          taxes,
          total,
          currency,
          paymentMethod: validatedData.paymentMethod,
          paymentStatus: "unpaid",
          status: "pending",
          source: "website",
          specialRequests: validatedData.specialRequests || "",
          whatsappSent: false,
          createdAt: now,
          updatedAt: now,
        },
        { session }
      );

      await roomBlocksCollection.insertMany(
        nightKeys.map((key) => ({
          roomId: validatedData.roomId,
          roomObjectId,
          roomName,
          bookingId: bookingId.toString(),
          bookingObjectId: bookingId,
          dateKey: key,
          type: "booking",
          status: "pending",
          active: true,
          source: "website",
          createdAt: now,
          updatedAt: now,
        })),
        { session }
      );

      result = { roomName, nights, total, currency };
    });

    if (!result) {
      throw new ApiError("Failed to create booking.", 500);
    }

    return result;
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      throw new ApiError("This room is no longer available for the selected dates.", 409);
    }

    throw error;
  } finally {
    await session.endSession();
  }
}
