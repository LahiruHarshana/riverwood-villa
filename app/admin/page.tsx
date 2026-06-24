"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/StatsCard";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { getRooms } from "@/lib/firestore/rooms";
import { getBookings, Booking } from "@/lib/firestore/bookings";
import { Spinner } from "@/components/ui/Spinner";
import { BedDouble, CalendarCheck, Clock, Users, DollarSign, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingCheckins, setUpcomingCheckins] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rooms, bookings] = await Promise.all([getRooms(), getBookings()]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const pendingBookings = bookings.filter((b) => b.status === "pending");
        const confirmedThisMonth = bookings.filter(
          (b) => b.status === "confirmed" && new Date(b.createdAt) >= startOfMonth
        );

        const revenueThisMonth = 0; // Bookings do not currently store price snapshots.

        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        const upcoming = bookings
          .filter((b) => new Date(b.checkIn) >= now && new Date(b.checkIn) <= next7Days)
          .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

        setStats({
          totalRooms: rooms.length,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings.length,
          confirmedThisMonth: confirmedThisMonth.length,
          revenueThisMonth,
        });

        setRecentBookings(bookings.slice(0, 5));
        setUpcomingCheckins(upcoming);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <div>Preparing dashboard</div>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Overview</span>
          <h1 className="admin-page-title">Villa operations</h1>
          <p className="admin-page-subtitle">
            A calm snapshot of rooms, requests, and the guest arrivals that need attention this week.
          </p>
        </div>
        <div className="rounded-full border border-[#151512]/10 bg-[#fffdf7]/70 px-4 py-2 text-sm font-bold text-[#465143] shadow-sm">
          {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Rooms" value={stats.totalRooms} icon={BedDouble} color="bg-[#e8ebe3]" />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} color="bg-[#efe7dc]" />
        <StatsCard title="Pending Bookings" value={stats.pendingBookings} icon={Clock} color="bg-[#f3dfb7]" />
        <StatsCard title="Confirmed Month" value={stats.confirmedThisMonth} icon={Users} color="bg-[#dfe9dc]" />
        <StatsCard title="Est. Revenue" value={`$${stats.revenueThisMonth}`} icon={DollarSign} color="bg-[#dae9e1]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="admin-panel p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f7d6c]">Requests</p>
              <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">Recent bookings</h2>
            </div>
            <ArrowUpRight className="h-5 w-5 text-[#6f7d6c]" />
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-[#6f746a]">No recent bookings</p>
          ) : (
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-2xl border border-[#151512]/10 bg-[#fffdf7]/70 p-4"
                >
                  <div>
                    <p className="font-bold text-[#151512]">{booking.guestName}</p>
                    <p className="text-sm text-[#6f746a]">{booking.roomName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <BookingStatusBadge status={booking.status} />
                    <ArrowUpRight className="w-4 h-4 text-[#6f7d6c]" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="admin-panel p-6">
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#6f7d6c]">Next 7 days</p>
            <h2 className="mt-1 font-serif text-2xl font-medium tracking-[-0.04em] text-[#151512]">Upcoming check-ins</h2>
          </div>
          {upcomingCheckins.length === 0 ? (
            <p className="text-[#6f746a]">No upcoming check-ins in the next 7 days</p>
          ) : (
            <div className="space-y-3">
              {upcomingCheckins.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between rounded-2xl border border-[#151512]/10 bg-[#fffdf7]/70 p-4"
                >
                  <div>
                    <p className="font-bold text-[#151512]">{booking.guestName}</p>
                    <p className="text-sm text-[#6f746a]">
                      {new Date(booking.checkIn).toLocaleDateString()} · {booking.roomName}
                    </p>
                  </div>
                  <BookingStatusBadge status={booking.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
