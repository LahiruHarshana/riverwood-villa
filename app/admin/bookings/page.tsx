"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingTable } from "@/components/admin/BookingTable";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { FilterChips } from "@/components/admin/FilterChips";
import { Spinner } from "@/components/ui/Spinner";
import { deleteBooking } from "@/lib/firestore/bookings";
import { Search, SlidersHorizontal, CalendarDays } from "lucide-react";

export default function BookingsPage() {
  const { bookings, loading, error, refetch } = useBookings();
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      await deleteBooking(id);
      refetch();
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      b.guestName?.toLowerCase().includes(query) ||
      b.roomName?.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center admin-fade-in">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: "var(--ra-rose-bg)", color: "var(--ra-rose)" }}>
          <SlidersHorizontal className="h-6 w-6" />
        </div>
        <p className="mt-4 font-semibold" style={{ color: "var(--ra-ink)" }}>Failed to load bookings</p>
        <p className="text-sm mt-1" style={{ color: "var(--ra-ink-muted)" }}>Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 admin-fade-in">
      <AdminPageHeader
        kicker="Reservations"
        title="Bookings"
        subtitle="Filter enquiries, confirm guests, and keep every stay moving smoothly."
      />

      <div className="admin-summary-strip">
        <div className="admin-summary-item">
          <span>Total</span>
          <strong>{statusCounts.all}</strong>
        </div>
        <div className="admin-summary-item">
          <span>Pending</span>
          <strong>{statusCounts.pending}</strong>
        </div>
        <div className="admin-summary-item">
          <span>Confirmed</span>
          <strong>{statusCounts.confirmed}</strong>
        </div>
        <div className="admin-summary-item">
          <span>Cancelled</span>
          <strong>{statusCounts.cancelled}</strong>
        </div>
      </div>

      <div className="admin-toolbar-panel">
        <FilterChips
          value={statusFilter}
          onChange={setStatusFilter}
          ariaLabel="Booking status filters"
          options={[
            { value: "all", label: "All", count: statusCounts.all },
            { value: "pending", label: "Pending", count: statusCounts.pending },
            { value: "confirmed", label: "Confirmed", count: statusCounts.confirmed },
            { value: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
          ]}
        />

        <div className="admin-toolbar-panel-row">
          <div className="relative admin-search-wrap">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ra-ink-faint)" }} />
            <input
              type="text"
              placeholder="Search guest or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input !pl-9"
            />
          </div>
          <p className="admin-results-note">
            Showing {filteredBookings.length} of {bookings.length} booking{bookings.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="admin-empty-state py-16 text-center">
          <div className="admin-empty-icon mb-4">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="font-medium" style={{ color: "var(--ra-ink-muted)" }}>No bookings found</p>
          <p className="text-sm mt-1" style={{ color: "var(--ra-ink-faint)" }}>Bookings will appear here once guests start reserving.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-3 sm:p-5 lg:p-6">
          <BookingTable data={filteredBookings} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
