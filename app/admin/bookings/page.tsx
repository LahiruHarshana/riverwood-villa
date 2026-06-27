"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/useBookings";
import { BookingTable } from "@/components/admin/BookingTable";
import { Spinner } from "@/components/ui/Spinner";
import { deleteBooking } from "@/lib/firestore/bookings";
import { Filter, Search, SlidersHorizontal, CalendarDays } from "lucide-react";

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
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Reservations</span>
          <h1 className="admin-page-title">Bookings</h1>
          <p className="admin-page-subtitle">Filter enquiries, confirm guests, and keep every stay moving smoothly.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search guest or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="admin-input pl-9 sm:w-[14rem]"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-input pl-9 pr-8 appearance-none cursor-pointer min-w-[7.5rem]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Card */}
      {bookings.length === 0 ? (
        <div className="admin-empty-state py-16 text-center">
          <div className="admin-empty-icon mb-4">
            <CalendarDays className="h-6 w-6" />
          </div>
          <p className="font-medium" style={{ color: "var(--ra-ink-muted)" }}>No bookings found</p>
          <p className="text-sm mt-1" style={{ color: "var(--ra-ink-faint)" }}>Bookings will appear here once guests start reserving.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden p-6">
          <BookingTable data={filteredBookings} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
}
