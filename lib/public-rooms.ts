import "server-only";

import { ObjectId } from "mongodb";
import { ensureMongoIndexes, getMongoDb } from "@/lib/mongodb";

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
  createdAt?: Date;
};

export type PublicRoom = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  status: string;
  sortOrder: number;
};

function serializePublicRoom(room: RoomDocument): PublicRoom {
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
    amenities: Array.isArray(room.amenities) ? room.amenities.filter((item): item is string => typeof item === "string") : [],
    images: Array.isArray(room.images) ? room.images.filter((item): item is string => typeof item === "string") : [],
    isAvailable: room.isAvailable !== false,
    status: room.status || "active",
    sortOrder: Number(room.sortOrder || 0),
  };
}

async function getRoomsCollection() {
  await ensureMongoIndexes();

  const db = await getMongoDb();
  const collectionName = process.env.MONGODB_ROOMS_COLLECTION || "rooms";
  return db.collection<RoomDocument>(collectionName);
}

export async function getPublicRooms(): Promise<PublicRoom[]> {
  const collection = await getRoomsCollection();
  const rooms = await collection
    .find({ isAvailable: true })
    .sort({ sortOrder: 1, pricePerNight: 1, createdAt: -1 })
    .toArray();

  return rooms
    .map(serializePublicRoom)
    .filter((room) => room.status === "active" || !room.status);
}

export async function getPublicRoomBySlug(slug: string): Promise<PublicRoom | null> {
  const collection = await getRoomsCollection();
  const room = await collection.findOne({ slug, isAvailable: true });

  if (!room) return null;

  const publicRoom = serializePublicRoom(room);
  if (publicRoom.status !== "active" && publicRoom.status) return null;

  return publicRoom;
}
