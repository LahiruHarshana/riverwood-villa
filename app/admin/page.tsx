"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { StatsCard } from "@/components/admin/StatsCard";
import { BookingStatusBadge } from "@/components/admin/BookingStatusBadge";
import { getRooms } from "@/lib/firestore/rooms";
import { getBookings, Booking } from "@/lib/firestore/bookings";
import { getDailyViews } from "@/lib/firestore/analytics";
import { Spinner } from "@/components/ui/Spinner";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DollarSign,
  Hotel,
  MessageCircle,
  Moon,
  Sparkles,
  Users,
  Eye,
} from "lucide-react";

const statusDotClass = (status: string) => {
  if (status === "confirmed") return "is-confirmed";
  if (status === "pending") return "is-pending";
  if (status === "cancelled") return "is-cancelled";
  return "";
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(date);

const formatDateParts = (date: Date) => ({
  month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
  day: new Intl.DateTimeFormat(undefined, { day: "numeric" }).format(date),
});

const getStayNights = (booking: Booking) => {
  const diff = new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    confirmedThisMonth: 0,
    cancelledBookings: 0,
    revenueThisMonth: 0,
    avgStayNights: 0,
    viewsToday: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [upcomingCheckins, setUpcomingCheckins] = useState<Booking[]>([]);
  const [priorityBookings, setPriorityBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const panelsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStr = new Date().toISOString().split("T")[0];
        const [rooms, bookings, viewsToday] = await Promise.all([
          getRooms(), 
          getBookings(),
          getDailyViews(todayStr)
        ]);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const pendingBookings = bookings.filter((b) => b.status === "pending");
        const confirmedThisMonth = bookings.filter(
          (b) => b.status === "confirmed" && new Date(b.createdAt) >= startOfMonth
        );
        const cancelledBookings = bookings.filter((b) => b.status === "cancelled");
        const confirmedBookings = bookings.filter((b) => b.status === "confirmed");

        const revenueThisMonth = bookings
          .filter((b) => b.status === "confirmed" && new Date(b.createdAt) >= startOfMonth)
          .reduce((sum, b) => sum + (b.total || 0), 0);

        const avgStayNights = confirmedBookings.length
          ? Math.round(
              confirmedBookings.reduce((sum, booking) => sum + getStayNights(booking), 0) /
                confirmedBookings.length
            )
          : 0;

        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        const upcoming = bookings
          .filter((b) => new Date(b.checkIn) >= now && new Date(b.checkIn) <= next7Days)
          .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());

        setStats({
          totalRooms: rooms.length,
          availableRooms: rooms.filter((room) => room.isAvailable).length,
          totalBookings: bookings.length,
          pendingBookings: pendingBookings.length,
          confirmedBookings: confirmedBookings.length,
          confirmedThisMonth: confirmedThisMonth.length,
          cancelledBookings: cancelledBookings.length,
          revenueThisMonth,
          avgStayNights,
          viewsToday,
        });

        setRecentBookings(bookings.slice(0, 5));
        setUpcomingCheckins(upcoming);
        setPriorityBookings(
          pendingBookings
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
            .slice(0, 4)
        );
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }
      );
    }

    if (statsRef.current) {
      tl.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 24, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08 },
        "-=0.2"
      );
    }

    if (panelsRef.current) {
      tl.fromTo(
        panelsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 },
        "-=0.15"
      );
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="admin-loading">
        <Spinner size="lg" />
      </div>
    );
  }

  const confirmationRate = stats.totalBookings
    ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
    : 0;
  const pendingRate = stats.totalBookings
    ? Math.round((stats.pendingBookings / stats.totalBookings) * 100)
    : 0;
  const cancelledRate = stats.totalBookings
    ? Math.round((stats.cancelledBookings / stats.totalBookings) * 100)
    : 0;
  const confirmedVisualRate = stats.confirmedBookings ? Math.max(confirmationRate, 5) : 0;
  const pendingVisualRate = stats.pendingBookings ? Math.max(pendingRate, 5) : 0;
  const cancelledVisualRate = stats.cancelledBookings ? Math.max(cancelledRate, 5) : 0;

  return (
    <div className="admin-dashboard space-y-8">
      {/* Header */}
      <header ref={headerRef} className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="admin-page-kicker">Dashboard</span>
          <h1 className="admin-page-title">Villa Operations</h1>
          <p className="admin-page-subtitle">
            A snapshot of rooms, requests, and the guest arrivals that need attention this week.
          </p>
        </div>
        <div className="admin-date-badge">
          <span className="dot relative" />
          {new Date().toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
        </div>
      </header>

      {/* Executive overview */}
      <section className="admin-hero-grid">
        <div className="admin-hero-card">
          <div className="admin-hero-glow" />
          <div className="relative z-10 flex h-full flex-col justify-between gap-8">
            <div>
              <span className="admin-hero-eyebrow"><Sparkles className="h-3.5 w-3.5" /> Live command center</span>
              <h2 className="admin-hero-title">Clear priorities for a smooth guest experience.</h2>
              <p className="admin-hero-copy">
                Review pending enquiries, check this week&apos;s arrivals, and keep room inventory ready from one focused view.
              </p>
            </div>

            <div className="admin-hero-actions">
              <Link href="/admin/bookings" className="admin-hero-button is-primary">
                Review bookings <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/admin/rooms" className="admin-hero-button">
                Manage rooms <Hotel className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-hero-side">
          <div className="admin-mini-metric">
            <span className="admin-mini-icon is-sage"><CheckCircle2 className="h-4 w-4" /></span>
            <div>
              <p>{stats.availableRooms}/{stats.totalRooms}</p>
              <span>rooms available</span>
            </div>
          </div>
          <div className="admin-mini-metric">
            <span className="admin-mini-icon is-amber"><Clock className="h-4 w-4" /></span>
            <div>
              <p>{stats.pendingBookings}</p>
              <span>requests waiting</span>
            </div>
          </div>
          <div className="admin-mini-metric">
            <span className="admin-mini-icon is-blue"><Moon className="h-4 w-4" /></span>
            <div>
              <p>{stats.avgStayNights || "-"}</p>
              <span>average nights</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Views Today" value={stats.viewsToday} icon={Eye} color="indigo" trend="Unique" caption="Website visitors" delay={0} />
        <StatsCard title="Total Rooms" value={stats.totalRooms} icon={BedDouble} color="sage" trend={`${stats.availableRooms} live`} caption="Published inventory" delay={50} />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={CalendarCheck} color="blue" trend="All time" caption="Requests captured" delay={100} />
        <StatsCard title="Pending Bookings" value={stats.pendingBookings} icon={Clock} color="amber" trend={`${pendingRate}%`} caption="Need confirmation" delay={150} />
        <StatsCard title="Confirmed Month" value={stats.confirmedThisMonth} icon={Users} color="teal" trend="MTD" caption={`${confirmationRate}% confirmed pipeline`} delay={200} />
        <StatsCard title="Est. Revenue" value={formatCurrency(stats.revenueThisMonth)} icon={DollarSign} color="slate" trend="MTD" caption="Confirmed bookings" delay={250} />
      </div>

      {/* Operations Section */}
      <div ref={panelsRef} className="grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        {/* Recent Bookings Timeline */}
        <div className="admin-panel p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="admin-section-kicker">Reservations</p>
              <h2 className="admin-section-title">Recent booking activity</h2>
            </div>
            <Link
              href="/admin/bookings"
              className="admin-icon-link"
              aria-label="Open bookings"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="admin-empty-icon mb-3">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--ra-ink-muted)" }}>No recent bookings</p>
            </div>
          ) : (
            <div className="admin-timeline">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="admin-timeline-item">
                  <div className={`admin-timeline-dot ${statusDotClass(booking.status)}`} />
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="admin-timeline-card block"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: "var(--ra-ink)" }}>
                          {booking.guestName}
                        </p>
                        <p className="text-xs mt-0.5 truncate" style={{ color: "var(--ra-ink-muted)" }}>
                          {booking.roomName} · {formatDate(new Date(booking.checkIn))}
                        </p>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Upcoming Check-ins */}
          <div className="admin-panel p-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <p className="admin-section-kicker">Next 7 days</p>
                <h2 className="admin-section-title">Upcoming check-ins</h2>
              </div>
              <Link href="/admin/bookings" className="admin-icon-link" aria-label="Open upcoming bookings">
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            {upcomingCheckins.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="admin-empty-icon mb-3">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--ra-ink-muted)" }}>No upcoming check-ins</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingCheckins.slice(0, 5).map((booking) => {
                  const checkInDate = formatDateParts(new Date(booking.checkIn));

                  return (
                    <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="admin-arrival-card">
                      <div className="admin-arrival-date">
                        <span>{checkInDate.month}</span>
                        <strong>{checkInDate.day}</strong>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p>{booking.guestName}</p>
                        <span className="admin-card-meta">{booking.roomName} · {booking.guests} guest{booking.guests === 1 ? "" : "s"}</span>
                      </div>
                      <BookingStatusBadge status={booking.status} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Priority queue */}
          <div className="admin-panel p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="admin-section-kicker">Action queue</p>
                <h2 className="admin-section-title">Needs attention</h2>
              </div>
              <span className="admin-count-pill">{priorityBookings.length}</span>
            </div>
            {priorityBookings.length === 0 ? (
              <div className="admin-success-state">
                <CheckCircle2 className="h-5 w-5" />
                <span>No pending booking requests right now.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {priorityBookings.map((booking) => (
                  <Link key={booking.id} href={`/admin/bookings/${booking.id}`} className="admin-priority-card">
                    <span className="admin-priority-icon"><MessageCircle className="h-4 w-4" /></span>
                    <div className="min-w-0 flex-1">
                      <p>{booking.guestName}</p>
                      <span className="admin-card-meta">{booking.roomName} · requested {formatDate(new Date(booking.createdAt))}</span>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Health overview */}
          <div className="admin-panel p-6">
            <div className="mb-5">
              <p className="admin-section-kicker">Booking mix</p>
              <h2 className="admin-section-title">Pipeline health</h2>
            </div>
            <div className="admin-health-bars">
              <div style={{ width: `${confirmedVisualRate}%` }} className="is-confirmed" />
              <div style={{ width: `${pendingVisualRate}%` }} className="is-pending" />
              <div style={{ width: `${cancelledVisualRate}%` }} className="is-cancelled" />
            </div>
            <div className="admin-health-legend">
              <span><i className="is-confirmed" /> Confirmed {confirmationRate}%</span>
              <span><i className="is-pending" /> Pending {pendingRate}%</span>
              <span><i className="is-cancelled" /> Cancelled {cancelledRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
