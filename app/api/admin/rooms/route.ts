import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { z } from "zod";
import { ensureMongoIndexes, getMongoDb } from "@/lib/mongodb";

export const runtime = "nodejs";

const roomSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  pricePerNight: z.number().min(0),
  maxGuests: z.number().int().min(1),
  bedrooms: z.number().int().min(1),
  bathrooms: z.number().int().min(1),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  isAvailable: z.boolean().default(true),
});

type RoomDocument = z.infer<typeof roomSchema> & {
  _id: ObjectId;
  currency?: string;
  shortDescription?: string;
  sortOrder?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

async function requireAdminSession() {
  const cookieStore = await cookies();
  return Boolean(cookieStore.get("__session")?.value);
}

function serializeRoom(room: RoomDocument) {
  return {
    id: room._id.toString(),
    name: room.name || "Room",
    slug: room.slug || room._id.toString(),
    description: room.description || "",
    shortDescription: room.shortDescription || room.description || "",
    pricePerNight: Number(room.pricePerNight || 0),
    currency: room.currency || process.env.NEXT_PUBLIC_BOOKING_CURRENCY || "USD",
    maxGuests: Number(room.maxGuests || 1),
    bedrooms: Number(room.bedrooms || 1),
    bathrooms: Number(room.bathrooms || 1),
    amenities: Array.isArray(room.amenities) ? room.amenities : [],
    images: Array.isArray(room.images) ? room.images : [],
    isAvailable: room.isAvailable !== false,
    status: room.status || "active",
    sortOrder: Number(room.sortOrder || 0),
    createdAt: room.createdAt?.toISOString() || new Date(0).toISOString(),
  };
}

export async function GET() {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureMongoIndexes();

    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
    const rooms = await db
      .collection<RoomDocument>(collectionName)
      .find({})
      .sort({ sortOrder: 1, createdAt: -1 })
      .toArray();

    return NextResponse.json({ rooms: rooms.map(serializeRoom) });
  } catch (error) {
    console.error("Admin rooms lookup failed:", error);
    return NextResponse.json({ error: "Failed to load rooms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureMongoIndexes();

    const data = roomSchema.parse(await request.json());
    const now = new Date();
    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
    const document = {
      ...data,
      currency: process.env.NEXT_PUBLIC_BOOKING_CURRENCY || "USD",
      status: data.isAvailable ? "active" : "inactive",
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection(collectionName).insertOne(document);
    const room = await db.collection<RoomDocument>(collectionName).findOne({ _id: result.insertedId });

    return NextResponse.json({ room: room ? serializeRoom(room) : null }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Admin room creation failed:", error);
    return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
  }
}
