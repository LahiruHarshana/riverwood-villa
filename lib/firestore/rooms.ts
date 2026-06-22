import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

export type Room = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
};

export type RoomFormData = Omit<Room, "id" | "createdAt">;

const roomsCollection = collection(db, "rooms");

export async function getRooms(): Promise<Room[]> {
  try {
    const snapshot = await getDocs(roomsCollection);
    return snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data(),
      createdAt: docItem.data().createdAt?.toDate() || new Date(),
    })) as Room[];
  } catch (error) {
    console.error("Error getting rooms:", error);
    throw error;
  }
}

export async function getRoomById(id: string): Promise<Room | null> {
  try {
    const docRef = doc(db, "rooms", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data()?.createdAt?.toDate() || new Date(),
    } as Room;
  } catch (error) {
    console.error("Error getting room:", error);
    throw error;
  }
}

export async function createRoom(data: RoomFormData): Promise<string> {
  try {
    const docRef = await addDoc(roomsCollection, {
      ...data,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export async function updateRoom(id: string, data: Partial<RoomFormData>): Promise<void> {
  try {
    const docRef = doc(db, "rooms", id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
}

export async function deleteRoom(id: string): Promise<void> {
  try {
    const docRef = doc(db, "rooms", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: Date,
  checkOut: Date
): Promise<boolean> {
  try {
    const bookingsCollection = collection(db, "bookings");
    const q = query(
      bookingsCollection,
      where("roomId", "==", roomId),
      where("status", "==", "confirmed")
    );

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map((docItem) => docItem.data());

    const checkInTime = checkIn.getTime();
    const checkOutTime = checkOut.getTime();

    return !bookings.some((booking: any) => {
      const bookingStart = booking.checkIn.toDate().getTime();
      const bookingEnd = booking.checkOut.toDate().getTime();

      // Check if the requested dates overlap with existing confirmed booking
      return (
        (checkInTime >= bookingStart && checkInTime < bookingEnd) ||
        (checkOutTime > bookingStart && checkOutTime <= bookingEnd) ||
        (checkInTime <= bookingStart && checkOutTime >= bookingEnd)
      );
    });
  } catch (error) {
    console.error("Error checking room availability:", error);
    throw error;
  }
}
