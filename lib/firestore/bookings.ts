export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  specialRequests: string;
  status: BookingStatus;
  whatsappSent: boolean;
  total?: number;
  createdAt: Date;
};

export type BookingFormData = Omit<Booking, "id" | "createdAt" | "status" | "whatsappSent">;

type BookingPayload = Omit<Booking, "checkIn" | "checkOut" | "createdAt"> & {
  checkIn: string;
  checkOut: string;
  createdAt: string;
};

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

function toBooking(booking: BookingPayload): Booking {
  return {
    ...booking,
    checkIn: new Date(booking.checkIn),
    checkOut: new Date(booking.checkOut),
    createdAt: new Date(booking.createdAt),
  };
}

export async function getBookings(filters?: { status?: string; roomId?: string }): Promise<Booking[]> {
  const params = new URLSearchParams();

  if (filters?.status) params.set("status", filters.status);
  if (filters?.roomId) params.set("roomId", filters.roomId);

  const query = params.toString();
  const data = await requestJson<{ bookings: BookingPayload[] }>(
    `/api/admin/bookings${query ? `?${query}` : ""}`
  );

  return data.bookings.map(toBooking);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const response = await fetch(`/api/admin/bookings/${id}`, { cache: "no-store" });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);

  const data = (await response.json()) as { booking: BookingPayload };
  return toBooking(data.booking);
}

export async function createBooking(data: BookingFormData): Promise<string> {
  const result = await requestJson<{ bookingId: string }>("/api/bookings", {
    method: "POST",
    body: JSON.stringify({
      ...data,
      checkIn: data.checkIn.toISOString(),
      checkOut: data.checkOut.toISOString(),
    }),
  });

  return result.bookingId;
}

export async function updateBookingStatus(id: string, status: "confirmed" | "cancelled"): Promise<void> {
  await requestJson(`/api/admin/bookings/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getBookingsByDateRange(start: Date, end: Date): Promise<Booking[]> {
  const bookings = await getBookings();
  return bookings.filter((booking) => booking.checkIn >= start && booking.checkIn <= end);
}
