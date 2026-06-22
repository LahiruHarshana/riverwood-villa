import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";

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
  createdAt: Date;
};

export type BookingFormData = Omit<Booking, "id" | "createdAt" | "status" | "whatsappSent">;

const bookingsCollection = collection(db, "bookings");

export async function getBookings(filters?: { status?: string; roomId?: string }): Promise<Booking[]> {
  try {
    let q = query(bookingsCollection, orderBy("createdAt", "desc"));

    if (filters?.status) {
      q = query(q, where("status", "==", filters.status));
    }

    if (filters?.roomId) {
      q = query(q, where("roomId", "==", filters.roomId));
    }

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        ...data,
        checkIn: data.checkIn?.toDate() || new Date(),
        checkOut: data.checkOut?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Booking;
    });
  } catch (error) {
    console.error("Error getting bookings:", error);
    throw error;
  }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  try {
    const docRef = doc(db, "bookings", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      checkIn: data.checkIn?.toDate() || new Date(),
      checkOut: data.checkOut?.toDate() || new Date(),
      createdAt: data.createdAt?.toDate() || new Date(),
    } as Booking;
  } catch (error) {
    console.error("Error getting booking:", error);
    throw error;
  }
}

export async function createBooking(data: BookingFormData): Promise<string> {
  try {
    const docRef = await addDoc(bookingsCollection, {
      ...data,
      status: "pending",
      whatsappSent: false,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
}

export async function updateBookingStatus(id: string, status: "confirmed" | "cancelled"): Promise<void> {
  try {
    const docRef = doc(db, "bookings", id);
    await updateDoc(docRef, { status });
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw error;
  }
}

export async function getBookingsByDateRange(start: Date, end: Date): Promise<Booking[]> {
  try {
    const q = query(
      bookingsCollection,
      where("checkIn", ">=", Timestamp.fromDate(start)),
      where("checkIn", "<=", Timestamp.fromDate(end)),
      orderBy("checkIn", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docItem) => {
      const data = docItem.data();
      return {
        id: docItem.id,
        ...data,
        checkIn: data.checkIn?.toDate() || new Date(),
        checkOut: data.checkOut?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate() || new Date(),
      } as Booking;
    });
  } catch (error) {
    console.error("Error getting bookings by date range:", error);
    throw error;
  }
}
