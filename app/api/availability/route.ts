import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export const runtime = "nodejs";

const MAX_STAY_NIGHTS = 30;

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

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const checkIn = parseStayDate(searchParams.get("checkIn") || "");
    const checkOut = parseStayDate(searchParams.get("checkOut") || "");
    const guests = Number(searchParams.get("guests") || "1");

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      return NextResponse.json(
        { error: "Valid check-in and check-out dates are required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(guests) || guests < 1) {
      return NextResponse.json({ error: "Guest count must be at least 1." }, { status: 400 });
    }

    const nightKeys = enumerateNightKeys(checkIn, checkOut);

    if (nightKeys.length === 0 || nightKeys.length > MAX_STAY_NIGHTS) {
      return NextResponse.json(
        { error: `Stay length must be between 1 and ${MAX_STAY_NIGHTS} nights.` },
        { status: 400 }
      );
    }

    const roomsSnapshot = await adminDb
      .collection("rooms")
      .where("isAvailable", "==", true)
      .get();

    const blockSnapshots = await Promise.all(
      chunk(nightKeys, 30).map((keys) =>
        adminDb.collection("roomBlocks").where("dateKey", "in", keys).get()
      )
    );

    const blockedRoomIds = new Set<string>();

    blockSnapshots.forEach((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const block = doc.data();

        if (block.active === false || !nightKeys.includes(block.dateKey)) return;
        if (typeof block.roomId === "string") blockedRoomIds.add(block.roomId);
      });
    });

    const nights = nightKeys.length;
    const rooms = roomsSnapshot.docs
      .map((doc) => {
        const room = doc.data();
        const pricePerNight = Number(room.pricePerNight || 0);

        return {
          id: doc.id,
          name: room.name || "Room",
          slug: room.slug || doc.id,
          description: room.description || "",
          shortDescription: room.shortDescription || room.description || "",
          pricePerNight,
          total: pricePerNight * nights,
          currency: room.currency || process.env.NEXT_PUBLIC_BOOKING_CURRENCY || "USD",
          maxGuests: Number(room.maxGuests || 1),
          bedrooms: Number(room.bedrooms || 1),
          bathrooms: Number(room.bathrooms || 1),
          amenities: Array.isArray(room.amenities) ? room.amenities : [],
          images: Array.isArray(room.images) ? room.images : [],
          sortOrder: Number(room.sortOrder || 0),
          status: room.status || "active",
          available: true,
        };
      })
      .filter((room) => room.status === "active" || !room.status)
      .filter((room) => room.maxGuests >= guests)
      .filter((room) => !blockedRoomIds.has(room.id))
      .sort((a, b) => a.sortOrder - b.sortOrder || a.pricePerNight - b.pricePerNight);

    return NextResponse.json({
      checkIn: dateKey(checkIn),
      checkOut: dateKey(checkOut),
      guests,
      nights,
      rooms,
    });
  } catch (error) {
    console.error("Availability lookup failed:", error);
    return NextResponse.json({ error: "Failed to load room availability." }, { status: 500 });
  }
}
