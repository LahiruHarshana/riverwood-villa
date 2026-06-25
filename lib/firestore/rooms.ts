export type Room = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  pricePerNight: number;
  currency?: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  status?: string;
  sortOrder?: number;
  createdAt: Date;
};

export type RoomFormData = Omit<Room, "id" | "createdAt">;

type RoomPayload = Omit<Room, "createdAt"> & { createdAt: string };

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function toRoom(room: RoomPayload): Room {
  return {
    ...room,
    createdAt: new Date(room.createdAt),
  };
}

export async function getRooms(): Promise<Room[]> {
  const data = await requestJson<{ rooms: RoomPayload[] }>("/api/admin/rooms");
  return data.rooms.map(toRoom);
}

export async function getRoomById(id: string): Promise<Room | null> {
  const response = await fetch(`/api/admin/rooms/${id}`, { cache: "no-store" });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const data = (await response.json()) as { room: RoomPayload };
  return toRoom(data.room);
}

export async function createRoom(data: RoomFormData): Promise<string> {
  const result = await requestJson<{ room: RoomPayload }>("/api/admin/rooms", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return result.room.id;
}

export async function updateRoom(id: string, data: Partial<RoomFormData>): Promise<void> {
  await requestJson(`/api/admin/rooms/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteRoom(id: string): Promise<void> {
  await requestJson(`/api/admin/rooms/${id}`, { method: "DELETE" });
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  const params = new URLSearchParams({
    checkIn: checkIn.toISOString().slice(0, 10),
    checkOut: checkOut.toISOString().slice(0, 10),
    guests: "1",
  });
  const response = await fetch(`/api/availability?${params.toString()}`, { cache: "no-store" });

  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const data = (await response.json()) as { rooms: Array<{ id: string }> };
  return data.rooms.some((room) => room.id === roomId);
}
