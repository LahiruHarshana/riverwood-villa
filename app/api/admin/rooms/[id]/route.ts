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

type RouteContext = { params: Promise<{ id: string }> };

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

async function getRoomId(context: RouteContext) {
  const { id } = await context.params;
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomId = await getRoomId(context);

  if (!roomId) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  try {
    await ensureMongoIndexes();

    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
    const room = await db.collection<RoomDocument>(collectionName).findOne({ _id: roomId });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room: serializeRoom(room) });
  } catch (error) {
    console.error("Admin room lookup failed:", error);
    return NextResponse.json({ error: "Failed to load room" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomId = await getRoomId(context);

  if (!roomId) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  try {
    await ensureMongoIndexes();

    const data = roomSchema.partial().parse(await request.json());
    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
    const update = {
      ...data,
      ...(typeof data.isAvailable === "boolean" ? { status: data.isAvailable ? "active" : "inactive" } : {}),
      updatedAt: new Date(),
    };

    const result = await db.collection(collectionName).findOneAndUpdate(
      { _id: roomId },
      { $set: update },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ room: serializeRoom(result as RoomDocument) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Admin room update failed:", error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const roomId = await getRoomId(context);

  if (!roomId) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  try {
    const db = await getMongoDb();
    const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
    const result = await db.collection(collectionName).deleteOne({ _id: roomId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Admin room deletion failed:", error);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
