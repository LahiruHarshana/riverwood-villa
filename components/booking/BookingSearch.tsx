"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useEffectEvent, useRef, useState } from "react";
import { BedDouble, CalendarDays, Check, Minus, Plus, Search, Users, MessageCircle } from "lucide-react";

type AvailableRoom = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  total: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
};

type AvailabilityResponse = {
  rooms?: AvailableRoom[];
  nights?: number;
  error?: string;
};

type BookingResponse = {
  bookingId?: string;
  error?: string;
};

type BookingFormState = {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  paymentMethod: "pay_at_hotel" | "bank_transfer";
};

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

const initialBookingForm: BookingFormState = {
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  specialRequests: "",
  paymentMethod: "pay_at_hotel",
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(value: string, days: number) {
  const date = value ? new Date(`${value}T00:00:00`) : new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
}

function createRoomHref(room: AvailableRoom, checkIn: string, checkOut: string, guests: number) {
  const params = new URLSearchParams();

  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  params.set("guests", String(guests));
  params.set("room", room.slug);

  return `/rooms/${room.slug}?${params.toString()}`;
}

type BookingSearchProps = {
  className?: string;
  eyebrow?: string;
  title?: string;
  variant?: "default" | "hero";
};

export function BookingSearch({
  className = "",
  eyebrow = "Availability first",
  title = "Find your riverside room",
  variant = "default",
}: BookingSearchProps) {
  const searchParams = useSearchParams();
  const hasHydratedFromUrl = useRef(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [bookingForm, setBookingForm] = useState<BookingFormState>(initialBookingForm);
  const [bookingError, setBookingError] = useState("");
  const [bookingStatus, setBookingStatus] = useState("");
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const selectedRoom = availableRooms.find((room) => room.id === selectedRoomId) || null;
  const today = toDateInputValue(new Date());
  const checkoutMin = checkIn ? addDays(checkIn, 1) : addDays(today, 1);

  const clearBookingState = () => {
    setAvailableRooms([]);
    setSelectedRoomId("");
    setBookingError("");
    setBookingStatus("");
    setIsRequestFormOpen(false);
  };

  const runAvailabilitySearch = async ({
    nextCheckIn,
    nextCheckOut,
    nextGuests,
    preferredRoomSlug,
  }: {
    nextCheckIn: string;
    nextCheckOut: string;
    nextGuests: number;
    preferredRoomSlug?: string | null;
  }) => {
    setErrorMessage("");
    setStatusMessage("");
    clearBookingState();

    if (!nextCheckIn || !nextCheckOut) {
      setErrorMessage("Choose your arrival and departure dates to search availability.");
      return;
    }

    if (nextCheckOut <= nextCheckIn) {
      setErrorMessage("Departure must be after arrival.");
      return;
    }

    const params = new URLSearchParams({
      checkIn: nextCheckIn,
      checkOut: nextCheckOut,
      guests: String(nextGuests),
    });

    setIsSearching(true);

    try {
      const response = await fetch(`/api/availability?${params.toString()}`);
      const data = (await response.json()) as AvailabilityResponse;

      if (!response.ok) {
        throw new Error(data.error || "Availability search failed.");
      }

      const roomCount = data.rooms?.length ?? 0;
      const nights = data.nights ?? 0;
      const rooms = data.rooms || [];
      const preferredRoom = preferredRoomSlug ? rooms.find((room) => room.slug === preferredRoomSlug) : null;

      setAvailableRooms(rooms);
      setSelectedRoomId(preferredRoom?.id || rooms[0]?.id || "");
      setIsRequestFormOpen(false);
      setStatusMessage(
        roomCount > 0
          ? `${roomCount} room${roomCount === 1 ? "" : "s"} available for ${nights} night${nights === 1 ? "" : "s"}.`
          : "No rooms are currently available for those dates. Try adjusting your stay."
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Availability search failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const restoreSearchFromUrl = useEffectEvent(
    async (nextCheckIn: string, nextCheckOut: string, nextGuests: number, preferredRoomSlug?: string | null) => {
      await runAvailabilitySearch({
        nextCheckIn,
        nextCheckOut,
        nextGuests,
        preferredRoomSlug,
      });
    }
  );

  const adjustGuests = (direction: 1 | -1) => {
    setGuests((current) => Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, current + direction)));
    clearBookingState();
  };

  const updateBookingForm = (field: keyof BookingFormState, value: string) => {
    setBookingForm((current) => ({ ...current, [field]: value }));
  };

  const updateCheckIn = (value: string) => {
    setCheckIn(value);
    clearBookingState();
    if (value && checkOut && checkOut <= value) {
      setCheckOut("");
    }
  };

  const updateCheckOut = (value: string) => {
    setCheckOut(value);
    clearBookingState();
  };

  const resetSearch = () => {
    setCheckIn("");
    setCheckOut("");
    setGuests(2);
    setStatusMessage("");
    setErrorMessage("");
    setBookingForm(initialBookingForm);
    clearBookingState();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runAvailabilitySearch({
      nextCheckIn: checkIn,
      nextCheckOut: checkOut,
      nextGuests: guests,
      preferredRoomSlug: searchParams.get("room"),
    });
  };

  useEffect(() => {
    if (hasHydratedFromUrl.current) return;
    hasHydratedFromUrl.current = true;

    const nextCheckIn = searchParams.get("checkIn") || "";
    const nextCheckOut = searchParams.get("checkOut") || "";
    const nextGuestsValue = Number(searchParams.get("guests") || guests);
    const nextGuests = Number.isInteger(nextGuestsValue)
      ? Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, nextGuestsValue))
      : 2;
    const preferredRoomSlug = searchParams.get("room");

    if (nextCheckIn) setCheckIn(nextCheckIn);
    if (nextCheckOut) setCheckOut(nextCheckOut);
    setGuests(nextGuests);

    if (nextCheckIn && nextCheckOut) {
      void restoreSearchFromUrl(nextCheckIn, nextCheckOut, nextGuests, preferredRoomSlug);
    }
  }, [guests, restoreSearchFromUrl, searchParams]);

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBookingError("");
    setBookingStatus("");

    if (!selectedRoom) {
      setBookingError("Select a room before sending your booking request.");
      return;
    }

    if (!bookingForm.guestName.trim() || !bookingForm.guestEmail.trim() || !bookingForm.guestPhone.trim()) {
      setBookingError("Add your name, email, and phone number to request this room.");
      return;
    }

    setIsBooking(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          guestName: bookingForm.guestName,
          guestEmail: bookingForm.guestEmail,
          guestPhone: bookingForm.guestPhone,
          checkIn,
          checkOut,
          guests,
          specialRequests: bookingForm.specialRequests,
          paymentMethod: bookingForm.paymentMethod,
        }),
      });
      const data = (await response.json()) as BookingResponse;

      if (!response.ok) {
        throw new Error(data.error || "Booking request failed.");
      }

      setBookingStatus("Booking request sent. We will contact you shortly to confirm the stay.");
      setBookingForm(initialBookingForm);
      setIsRequestFormOpen(false);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "Booking request failed.");
    } finally {
      setIsBooking(false);
    }
  };

  if (variant === "hero") {
    return (
      <div className={`ms-hero ${className}`.trim()} data-ready={isReady}>
        {!isReady && (
          <div className="ms-hero-skeleton" aria-hidden="true">
            <div className="ms-hero-skeleton-row">
              <div className="ms-hero-skeleton-block" />
              <div className="ms-hero-skeleton-block" />
              <div className="ms-hero-skeleton-block is-narrow" />
            </div>
            <div className="ms-hero-skeleton-btn" />
          </div>
        )}

        <form className="ms-hero-card" onSubmit={handleSubmit}>
          <div className="ms-hero-fields">
            <label className="ms-hero-field">
              <span className="ms-hero-field-label">Arrival</span>
              <span className="ms-hero-field-control">
                <CalendarDays size={16} />
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => updateCheckIn(e.target.value)}
                  aria-label="Check-in date"
                  required
                />
              </span>
            </label>

            <label className="ms-hero-field">
              <span className="ms-hero-field-label">Departure</span>
              <span className="ms-hero-field-control">
                <CalendarDays size={16} />
                <input
                  type="date"
                  value={checkOut}
                  min={checkoutMin}
                  onChange={(e) => updateCheckOut(e.target.value)}
                  aria-label="Check-out date"
                  required
                />
              </span>
            </label>

            <div className="ms-hero-field ms-hero-guest-field">
              <span className="ms-hero-field-label">Guests</span>
              <div className="ms-hero-field-control">
                <Users size={16} />
                <button type="button" onClick={() => adjustGuests(-1)} disabled={guests <= MIN_GUESTS} aria-label="Decrease guests">
                  <Minus size={13} />
                </button>
                <span className="ms-hero-guest-count">{guests}</span>
                <button type="button" onClick={() => adjustGuests(1)} disabled={guests >= MAX_GUESTS} aria-label="Increase guests">
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>

          <button className="ms-hero-submit" type="submit" disabled={isSearching}>
            <span>{isSearching ? "Checking..." : "Check availability"}</span>
            <Search size={16} />
          </button>
        </form>

        {(errorMessage || (statusMessage && availableRooms.length === 0)) && (
          <p className={`ms-note ${errorMessage ? "is-error" : ""}`}>
            {errorMessage || statusMessage}
          </p>
        )}

        {(checkIn || checkOut || statusMessage || errorMessage || availableRooms.length > 0) && (
          <button className="ms-reset-btn" type="button" onClick={resetSearch}>
            Reset search
          </button>
        )}

        {availableRooms.length > 0 && (
          <div className="ms-hero-results">
            <div className="ms-hero-results-header">
              <span className="ms-hero-results-label">Choose your room</span>
              <span className="ms-hero-results-meta">{checkIn} → {checkOut} · {guests} guest{guests === 1 ? "" : "s"}</span>
            </div>

            <div className="ms-room-list">
              {availableRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className={`ms-room-option ${room.id === selectedRoomId ? "is-selected" : ""}`}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setBookingError("");
                    setBookingStatus("");
                    setIsRequestFormOpen(false);
                  }}
                >
                  <span className="ms-room-thumb">
                    {room.images[0] ? <img src={room.images[0]} alt="" /> : <BedDouble size={20} />}
                  </span>
                  <span className="ms-room-info">
                    <strong>{room.name}</strong>
                    <span>{room.maxGuests} guests · {room.bedrooms} bedroom · {formatMoney(room.total, room.currency)} total</span>
                  </span>
                  {room.id === selectedRoomId && <Check size={16} className="ms-room-check" />}
                </button>
              ))}
            </div>

            {selectedRoom && (
              <div className="ms-request">
                <div className="ms-request-summary">
                  <div>
                    <strong>{selectedRoom.name}</strong>
                    <span>{formatMoney(selectedRoom.pricePerNight, selectedRoom.currency)} / night</span>
                  </div>
                  <div className="ms-request-actions">
                    <Link className="ms-room-link" href={createRoomHref(selectedRoom, checkIn, checkOut, guests)}>
                      View room details
                    </Link>
                    <button
                      type="button"
                      className="ms-request-toggle"
                      onClick={() => setIsRequestFormOpen((current) => !current)}
                      aria-expanded={isRequestFormOpen}
                    >
                      {isRequestFormOpen ? "Hide form" : "Request room"}
                    </button>
                  </div>
                </div>

                {(bookingError || bookingStatus) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                    <p className={`ms-note ${bookingError ? "is-error" : ""}`}>
                      {bookingError || bookingStatus}
                    </p>
                    {bookingStatus && !bookingError && selectedRoom && (
                      <a
                        href={`https://wa.me/94782902200?text=${encodeURIComponent(
                          `Hi, I just submitted a booking request.\n\n*Room:* ${selectedRoom.name}\n*Dates:* ${checkIn} to ${checkOut}\n*Guests:* ${guests}\n\n*Name:* ${bookingForm.guestName}\n*Email:* ${bookingForm.guestEmail}\n*Phone:* ${bookingForm.guestPhone}\n*Payment Method:* ${bookingForm.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Pay at Hotel'}${bookingForm.specialRequests ? `\n*Special Requests:* ${bookingForm.specialRequests}` : ''}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          background: "#25D366",
                          color: "#fff",
                          padding: "0.6rem 1rem",
                          borderRadius: "0.4rem",
                          fontWeight: 500,
                          textDecoration: "none",
                          fontSize: "0.9rem"
                        }}
                      >
                        <MessageCircle size={18} /> Open WhatsApp to Confirm
                      </a>
                    )}
                  </div>
                )}

                {isRequestFormOpen && (
                  <form className="ms-request-form" onSubmit={handleBookingSubmit}>
                    <div className="ms-request-grid">
                      <input
                        value={bookingForm.guestName}
                        onChange={(e) => updateBookingForm("guestName", e.target.value)}
                        placeholder="Full name"
                        autoComplete="name"
                        required
                      />
                      <input
                        type="email"
                        value={bookingForm.guestEmail}
                        onChange={(e) => updateBookingForm("guestEmail", e.target.value)}
                        placeholder="Email address"
                        autoComplete="email"
                        required
                      />
                      <input
                        value={bookingForm.guestPhone}
                        onChange={(e) => updateBookingForm("guestPhone", e.target.value)}
                        placeholder="Phone / WhatsApp"
                        autoComplete="tel"
                        required
                      />
                      <select
                        value={bookingForm.paymentMethod}
                        onChange={(e) => updateBookingForm("paymentMethod", e.target.value)}
                      >
                        <option value="pay_at_hotel">Pay at hotel</option>
                        <option value="bank_transfer">Bank transfer</option>
                      </select>
                    </div>
                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(e) => updateBookingForm("specialRequests", e.target.value)}
                      placeholder="Special requests, arrival time, or questions"
                      rows={2}
                    />
                    <button className="ms-request-submit" type="submit" disabled={isBooking}>
                      {isBooking ? "Sending request..." : "Send booking request"}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`ms ${className}`.trim()}>
      <form className="ms-card" onSubmit={handleSubmit}>
        <div className="ms-header">
          <span className="ms-eyebrow">{eyebrow}</span>
          <h3>{title}</h3>
        </div>

        <div className="ms-date-grid">
          <label className="ms-field">
            <span className="ms-field-label">Arrival</span>
            <span className="ms-field-control">
              <CalendarDays size={17} />
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => updateCheckIn(e.target.value)}
                aria-label="Check-in date"
                required
              />
            </span>
          </label>

          <label className="ms-field">
            <span className="ms-field-label">Departure</span>
            <span className="ms-field-control">
              <CalendarDays size={17} />
              <input
                type="date"
                value={checkOut}
                min={checkoutMin}
                onChange={(e) => updateCheckOut(e.target.value)}
                aria-label="Check-out date"
                required
              />
            </span>
          </label>
        </div>

        <div className="ms-bottom">
          <div className="ms-guest-field">
            <span className="ms-field-label">Guests</span>
            <div className="ms-guest-control">
              <Users size={17} />
              <button type="button" onClick={() => adjustGuests(-1)} disabled={guests <= MIN_GUESTS} aria-label="Decrease guests">
                <Minus size={14} />
              </button>
              <strong>{guests}</strong>
              <button type="button" onClick={() => adjustGuests(1)} disabled={guests >= MAX_GUESTS} aria-label="Increase guests">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button className="ms-submit" type="submit" disabled={isSearching}>
            <span>{isSearching ? "Searching..." : "Search availability"}</span>
            <Search size={17} />
          </button>
        </div>

        {(statusMessage || errorMessage) && (
          <p className={`ms-note ${errorMessage ? "is-error" : ""}`}>
            {errorMessage || statusMessage}
          </p>
        )}
      </form>

      {availableRooms.length > 0 && (
        <div className="ms-results">
          <div className="ms-results-header">
            <span className="ms-eyebrow">Choose a room</span>
            <p>{checkIn} to {checkOut} · {guests} guest{guests === 1 ? "" : "s"}</p>
          </div>

          <div className="ms-room-list">
            {availableRooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={`ms-room-option ${room.id === selectedRoomId ? "is-selected" : ""}`}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setBookingError("");
                  setBookingStatus("");
                }}
              >
                <span className="ms-room-thumb">
                  {room.images[0] ? <img src={room.images[0]} alt="" /> : <BedDouble size={22} />}
                </span>
                <span className="ms-room-info">
                  <strong>{room.name}</strong>
                  <small>{room.shortDescription || room.description}</small>
                  <span>{room.maxGuests} guests · {room.bedrooms} bedroom · {formatMoney(room.total, room.currency)} total</span>
                </span>
                {room.id === selectedRoomId && <Check size={18} className="ms-room-check" />}
              </button>
            ))}
          </div>

          {selectedRoom && (
            <form className="ms-request-form" onSubmit={handleBookingSubmit}>
              <div className="ms-request-summary">
                <div>
                  <strong>Request {selectedRoom.name}</strong>
                  <span>{formatMoney(selectedRoom.pricePerNight, selectedRoom.currency)} / night</span>
                </div>
                <Link className="ms-room-link" href={createRoomHref(selectedRoom, checkIn, checkOut, guests)}>
                  View room details
                </Link>
              </div>

              <div className="ms-request-grid">
                <input
                  value={bookingForm.guestName}
                  onChange={(e) => updateBookingForm("guestName", e.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                />
                <input
                  type="email"
                  value={bookingForm.guestEmail}
                  onChange={(e) => updateBookingForm("guestEmail", e.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
                <input
                  value={bookingForm.guestPhone}
                  onChange={(e) => updateBookingForm("guestPhone", e.target.value)}
                  placeholder="Phone / WhatsApp"
                  autoComplete="tel"
                />
                <select
                  value={bookingForm.paymentMethod}
                  onChange={(e) => updateBookingForm("paymentMethod", e.target.value)}
                >
                  <option value="pay_at_hotel">Pay at hotel</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </div>

              <textarea
                value={bookingForm.specialRequests}
                onChange={(e) => updateBookingForm("specialRequests", e.target.value)}
                placeholder="Special requests, arrival time, or questions"
                rows={3}
              />

              {(bookingError || bookingStatus) && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                  <p className={`ms-note ${bookingError ? "is-error" : ""}`}>
                    {bookingError || bookingStatus}
                  </p>
                  {bookingStatus && !bookingError && selectedRoom && (
                    <a
                      href={`https://wa.me/94782902200?text=${encodeURIComponent(
                        `Hi, I just submitted a booking request.\n\n*Room:* ${selectedRoom.name}\n*Dates:* ${checkIn} to ${checkOut}\n*Guests:* ${guests}\n\n*Name:* ${bookingForm.guestName}\n*Email:* ${bookingForm.guestEmail}\n*Phone:* ${bookingForm.guestPhone}\n*Payment Method:* ${bookingForm.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Pay at Hotel'}${bookingForm.specialRequests ? `\n*Special Requests:* ${bookingForm.specialRequests}` : ''}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        background: "#25D366",
                        color: "#fff",
                        padding: "0.6rem 1rem",
                        borderRadius: "0.4rem",
                        fontWeight: 500,
                        textDecoration: "none",
                        fontSize: "0.9rem"
                      }}
                    >
                      <MessageCircle size={18} /> Open WhatsApp to Confirm
                    </a>
                  )}
                </div>
              )}

              <button className="ms-request-submit" type="submit" disabled={isBooking}>
                {isBooking ? "Sending request..." : "Request this room"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
