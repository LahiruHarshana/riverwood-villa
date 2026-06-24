import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/lib/mongodb";

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

type RoomDocument = {
  _id: ObjectId;
  name?: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  pricePerNight?: number;
  currency?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: unknown;
  images?: unknown;
  isAvailable?: boolean;
  sortOrder?: number;
  status?: string;
};

type RoomBlockDocument = {
  roomId?: string;
  dateKey?: string;
  active?: boolean;
};

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

    const db = await getMongoDb();
    const roomsCollectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";

    const [roomDocuments, blockDocuments] = await Promise.all([
      db.collection<RoomDocument>(roomsCollectionName).find({ isAvailable: true }).toArray(),
      db.collection<RoomBlockDocument>("roomBlocks")
        .find({ dateKey: { $in: nightKeys }, active: { $ne: false } })
        .toArray(),
    ]);

    const blockedRoomIds = new Set<string>();

    blockDocuments.forEach((block) => {
      if (block.active === false || !block.dateKey || !nightKeys.includes(block.dateKey)) return;
      if (typeof block.roomId === "string") blockedRoomIds.add(block.roomId);
    });

    const nights = nightKeys.length;
    const rooms = roomDocuments
      .map((room) => {
        const id = room._id.toString();
        const pricePerNight = Number(room.pricePerNight || 0);

        return {
          id,
          name: room.name || "Room",
          slug: room.slug || id,
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
