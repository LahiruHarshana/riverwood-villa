"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBookingById, updateBookingStatus, deleteBooking, Booking } from "@/lib/firestore/bookings";
import { Spinner } from "@/components/ui/Spinner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { GuestWhatsAppComposer } from "@/components/admin/GuestWhatsAppComposer";
import { User, Mail, Phone, Calendar, Users, Clock, MessageSquare, CheckCircle, XCircle, DollarSign, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<"confirmed" | "cancelled" | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const data = await getBookingById(id);
        setBooking(data);
      } catch (error) {
        console.error("Failed to fetch booking:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const duration = useMemo(() => {
    if (!booking) return 0;
    const diff = new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking]);

  const handleDelete = async () => {
    if (!booking) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Remove this cancelled booking permanently? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove it!",
    });
    if (!result.isConfirmed) return;
    setDeleting(true);
    try {
      await deleteBooking(booking.id);
      router.push("/admin/bookings");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      setDeleting(false);
    }
  };

  const handleStatusChange = async (status: "confirmed" | "cancelled") => {
    if (!booking) return;
    if (status === "cancelled") {
      const result = await Swal.fire({
        title: "Cancel Booking?",
        text: "Cancel this booking? This will notify the guest.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, cancel it!",
      });
      if (!result.isConfirmed) return;
    }
    setConfirmAction(status);
    try {
      await updateBookingStatus(booking.id, status);
      setBooking((prev) => (prev ? { ...prev, status } : null));
      Swal.fire({
        title: "Success!",
        text: `Booking has been ${status}.`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setConfirmAction(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="admin-empty-state py-24 text-center">
        <div className="admin-empty-icon mb-4">
          <Calendar className="h-6 w-6" />
        </div>
        <p className="font-semibold" style={{ color: "var(--ra-ink-strong)" }}>Booking not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 admin-fade-in">
      <AdminPageHeader
        kicker="Guest request"
        title="Booking details"
        subtitle="Review the stay, update status, and send a clear message to the guest."
        backHref="/admin/bookings"
        backLabel="Back to bookings"
        meta={<BookingStatusBadge status={booking.status} />}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="admin-panel p-6">
          <div className="admin-detail-section-head">
            <div className="admin-detail-section-icon">
              <User className="w-4 h-4" />
            </div>
            <h2 className="admin-detail-section-title">Guest information</h2>
          </div>
          <div className="space-y-2.5">
            <div className="admin-info-row">
              <User className="w-4 h-4" />
              <span>{booking.guestName}</span>
            </div>
            <div className="admin-info-row">
              <Mail className="w-4 h-4" />
              <span>{booking.guestEmail}</span>
            </div>
            <div className="admin-info-row">
              <Phone className="w-4 h-4" />
              <span>{booking.guestPhone}</span>
            </div>
          </div>
        </div>

        <div className="admin-panel p-6">
          <div className="admin-detail-section-head">
            <div className="admin-detail-section-icon">
              <Calendar className="w-4 h-4" />
            </div>
            <h2 className="admin-detail-section-title">Stay information</h2>
          </div>
          <div className="space-y-2.5">
            <div className="admin-field-grid">
              <div className="admin-info-row">
                <div>
                  <small>Check-in</small>
                  <p>{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="admin-info-row">
                <div>
                  <small>Check-out</small>
                  <p>{new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="admin-info-row">
              <Clock className="w-4 h-4" />
              <span>Duration: <strong>{duration} nights</strong></span>
            </div>
            <div className="admin-info-row">
              <Users className="w-4 h-4" />
              <span>{booking.guests} guest{booking.guests === 1 ? "" : "s"}</span>
            </div>
            <div className="admin-info-row">
              <DollarSign className="w-4 h-4" />
              <span>Total: <strong>${(booking.total || 0).toLocaleString()}</strong></span>
            </div>
            {booking.specialRequests && (
              <div className="admin-info-row is-highlight">
                <MessageSquare className="w-4 h-4" />
                <div>
                  <small>Special requests</small>
                  <p>{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="admin-panel lg:col-span-2 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="admin-detail-section-head mb-0">
              <div className="admin-detail-section-icon">
                <CheckCircle className="w-4 h-4" />
              </div>
              <h2 className="admin-detail-section-title">Status management</h2>
            </div>
            <BookingStatusBadge status={booking.status} />
          </div>
          <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={() => handleStatusChange("confirmed")}
              disabled={booking.status === "confirmed" || confirmAction !== null}
              className="admin-primary-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px]"
            >
              {confirmAction === "confirmed" ? <Spinner size="sm" /> : <CheckCircle className="w-4 h-4" />}
              {booking.status === "confirmed" ? "Already confirmed" : "Confirm booking"}
            </button>
            <button
              onClick={() => handleStatusChange("cancelled")}
              disabled={booking.status === "cancelled" || confirmAction !== null}
              className="admin-danger-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px]"
            >
              {confirmAction === "cancelled" ? <Spinner size="sm" /> : <XCircle className="w-4 h-4" />}
              {booking.status === "cancelled" ? "Already cancelled" : "Cancel booking"}
            </button>
            {booking.status === "cancelled" && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="admin-danger-button disabled:cursor-not-allowed disabled:opacity-30 min-w-[160px]"
              >
                {deleting ? <Spinner size="sm" /> : <Trash2 className="w-4 h-4" />}
                Remove booking
              </button>
            )}
          </div>
        </div>

        <GuestWhatsAppComposer booking={booking} />
      </div>
    </div>
  );
}
