"use client";

import { type FormEvent, useEffect, useState } from "react";
import { BedDouble, CalendarDays, Check, Leaf, Minus, Plus, Search, Users } from "lucide-react";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

type AvailableRoom = {
  id: string;
  name: string;
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
  const hasHeroSearchState = Boolean(checkIn || checkOut || statusMessage || errorMessage || availableRooms.length > 0);

  const clearBookingState = () => {
    setAvailableRooms([]);
    setSelectedRoomId("");
    setBookingError("");
    setBookingStatus("");
    setIsRequestFormOpen(false);
  };

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
    setErrorMessage("");
    setStatusMessage("");
    clearBookingState();

    if (!checkIn || !checkOut) {
      setErrorMessage("Choose your arrival and departure dates to search availability.");
      return;
    }

    if (checkOut <= checkIn) {
      setErrorMessage("Departure must be after arrival.");
      return;
    }

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      guests: String(guests),
    });

    console.log("Searching availability", { checkIn, checkOut, guests });
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

      setAvailableRooms(rooms);
      setSelectedRoomId(rooms[0]?.id || "");
      setIsRequestFormOpen(false);
      setStatusMessage(
        roomCount > 0
          ? `${roomCount} room${roomCount === 1 ? "" : "s"} available for ${nights} night${nights === 1 ? "" : "s"}.`
          : "No rooms are currently available for those dates. Try adjusting your stay."
      );

      console.log("Availability results", data);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Availability search failed.");
    } finally {
      setIsSearching(false);
    }
  };

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
      <div className={`hero-booking-flow ${className}`.trim()}>
        <form className={`hero-booking-card ${isReady ? 'is-loaded' : ''}`} onSubmit={handleSubmit} aria-busy={!isReady}>
          <div className="hero-booking-loader" aria-hidden="true">
            <span className="hero-booking-loader-ring" />
          </div>
          <div className="hero-booking-intro">
            <span className="hero-booking-mark" aria-hidden="true">
              <Leaf size={16} strokeWidth={1.8} />
            </span>
            <div>
              <p>{eyebrow}</p>
              <strong>{title}</strong>
            </div>
          </div>

          <label className="hero-booking-field">
            <span>Arrival</span>
            <span className="hero-booking-control">
              <CalendarDays size={17} strokeWidth={1.7} />
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(event) => updateCheckIn(event.target.value)}
                aria-label="Check-in date"
                required
              />
            </span>
          </label>

          <label className="hero-booking-field">
            <span>Departure</span>
            <span className="hero-booking-control">
              <CalendarDays size={17} strokeWidth={1.7} />
              <input
                type="date"
                value={checkOut}
                min={checkoutMin}
                onChange={(event) => updateCheckOut(event.target.value)}
                aria-label="Check-out date"
                required
              />
            </span>
          </label>

          <div className="hero-booking-field hero-booking-guests" aria-label="Guest count selector">
            <span>Guests</span>
            <div className="hero-booking-control">
              <Users size={17} strokeWidth={1.7} />
              <button
                type="button"
                onClick={() => adjustGuests(-1)}
                disabled={guests <= MIN_GUESTS}
                aria-label="Decrease guests"
              >
                <Minus size={13} />
              </button>
              <strong>{guests}</strong>
              <button
                type="button"
                onClick={() => adjustGuests(1)}
                disabled={guests >= MAX_GUESTS}
                aria-label="Increase guests"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <button className="hero-booking-submit" type="submit" disabled={isSearching}>
            <span>{isSearching ? "Checking" : "Check availability"}</span>
            <Search size={17} strokeWidth={1.8} />
          </button>
        </form>

        {(errorMessage || (statusMessage && availableRooms.length === 0)) && (
          <p className={errorMessage ? "hero-booking-note is-error" : "hero-booking-note"}>
            {errorMessage || statusMessage}
          </p>
        )}

        {hasHeroSearchState && (
          <button className="hero-booking-reset" type="button" onClick={resetSearch}>
            Reset search
          </button>
        )}

        {availableRooms.length > 0 && (
          <div className="hero-booking-result">
            <div className="hero-booking-result-header">
              <span className="hero-booking-result-label">Choose your room</span>
              <span className="hero-booking-result-meta">{checkIn} → {checkOut} · {guests} guest{guests === 1 ? "" : "s"}</span>
            </div>

            <div className="hero-booking-room-list">
              {availableRooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className={room.id === selectedRoomId ? "hero-booking-room is-selected" : "hero-booking-room"}
                  onClick={() => {
                    setSelectedRoomId(room.id);
                    setBookingError("");
                    setBookingStatus("");
                    setIsRequestFormOpen(false);
                  }}
                >
                  <span className="hero-booking-room-thumb">
                    {room.images[0] ? <img src={room.images[0]} alt="" /> : <BedDouble size={20} />}
                  </span>
                  <span className="hero-booking-room-body">
                    <strong>{room.name}</strong>
                    <em>{room.maxGuests} guests · {room.bedrooms} bedroom · {formatMoney(room.total, room.currency)} total</em>
                  </span>
                  {room.id === selectedRoomId && <Check className="hero-booking-room-check" size={16} />}
                </button>
              ))}
            </div>

            {selectedRoom && (
              <div className="hero-booking-request">
                <div className="hero-booking-request-summary">
                  <div>
                    <strong>Selected: {selectedRoom.name}</strong>
                    <span>{formatMoney(selectedRoom.pricePerNight, selectedRoom.currency)} / night</span>
                  </div>
                  <button
                    className="hero-booking-request-toggle"
                    type="button"
                    onClick={() => setIsRequestFormOpen((current) => !current)}
                    aria-expanded={isRequestFormOpen}
                  >
                    {isRequestFormOpen ? "Hide form" : "Request room"}
                  </button>
                </div>

                {(bookingError || bookingStatus) && (
                  <p className={bookingError ? "hero-booking-note is-error" : "hero-booking-note"}>
                    {bookingError || bookingStatus}
                  </p>
                )}

                {isRequestFormOpen && (
                  <form className="hero-booking-request-form" onSubmit={handleBookingSubmit}>
                    <div className="hero-booking-request-grid">
                      <input
                        value={bookingForm.guestName}
                        onChange={(event) => updateBookingForm("guestName", event.target.value)}
                        placeholder="Full name"
                        autoComplete="name"
                        required
                      />
                      <input
                        type="email"
                        value={bookingForm.guestEmail}
                        onChange={(event) => updateBookingForm("guestEmail", event.target.value)}
                        placeholder="Email address"
                        autoComplete="email"
                        required
                      />
                      <input
                        value={bookingForm.guestPhone}
                        onChange={(event) => updateBookingForm("guestPhone", event.target.value)}
                        placeholder="Phone / WhatsApp"
                        autoComplete="tel"
                        required
                      />
                      <select
                        value={bookingForm.paymentMethod}
                        onChange={(event) => updateBookingForm("paymentMethod", event.target.value)}
                      >
                        <option value="pay_at_hotel">Pay at hotel</option>
                        <option value="bank_transfer">Bank transfer</option>
                      </select>
                    </div>

                    <textarea
                      value={bookingForm.specialRequests}
                      onChange={(event) => updateBookingForm("specialRequests", event.target.value)}
                      placeholder="Special requests, arrival time, or questions"
                      rows={2}
                    />

                    <button className="hero-booking-request-submit" type="submit" disabled={isBooking}>
                      {isBooking ? "Sending request" : "Send booking request"}
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
    <div className={`booking-flow ${className}`.trim()}>
      <form className="booking-search-card" onSubmit={handleSubmit}>
        <div className="booking-search-header">
          <span className="booking-search-mark" aria-hidden="true">
            <Leaf size={17} strokeWidth={1.8} />
          </span>
          <div>
            <p className="booking-search-eyebrow">{eyebrow}</p>
            <h3>{title}</h3>
          </div>
        </div>

        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onCheckInChange={updateCheckIn}
          onCheckOutChange={updateCheckOut}
        />

        <div className="booking-search-bottom">
          <div className="booking-guest-card" aria-label="Guest count selector">
            <span className="booking-field-kicker">Guests</span>
            <div className="booking-guest-control">
              <Users size={18} strokeWidth={1.7} />
              <button
                type="button"
                onClick={() => adjustGuests(-1)}
                disabled={guests <= MIN_GUESTS}
                aria-label="Decrease guests"
              >
                <Minus size={14} />
              </button>
              <strong>{guests}</strong>
              <button
                type="button"
                onClick={() => adjustGuests(1)}
                disabled={guests >= MAX_GUESTS}
                aria-label="Increase guests"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <button className="booking-search-submit" type="submit" disabled={isSearching}>
            <span>{isSearching ? "Searching" : "Search availability"}</span>
            <Search size={18} strokeWidth={1.8} />
          </button>
        </div>

        {(statusMessage || errorMessage) && (
          <p className={errorMessage ? "booking-search-note is-error" : "booking-search-note"}>
            {errorMessage || statusMessage}
          </p>
        )}
      </form>

      {availableRooms.length > 0 && (
        <div className="booking-results-card">
          <div className="booking-results-header">
            <span className="booking-search-eyebrow">Choose a room</span>
            <p>{checkIn} to {checkOut} · {guests} guest{guests === 1 ? "" : "s"}</p>
          </div>

          <div className="booking-room-list">
            {availableRooms.map((room) => (
              <button
                key={room.id}
                type="button"
                className={room.id === selectedRoomId ? "booking-room-option is-selected" : "booking-room-option"}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setBookingError("");
                  setBookingStatus("");
                }}
              >
                <span className="booking-room-thumb">
                  {room.images[0] ? <img src={room.images[0]} alt="" /> : <BedDouble size={22} />}
                </span>
                <span className="booking-room-body">
                  <strong>{room.name}</strong>
                  <small>{room.shortDescription || room.description}</small>
                  <em>{room.maxGuests} guests · {room.bedrooms} bedroom · {formatMoney(room.total, room.currency)} total</em>
                </span>
                {room.id === selectedRoomId && <Check className="booking-room-check" size={18} />}
              </button>
            ))}
          </div>

          {selectedRoom && (
            <form className="booking-request-form" onSubmit={handleBookingSubmit}>
              <div className="booking-request-summary">
                <strong>Request {selectedRoom.name}</strong>
                <span>{formatMoney(selectedRoom.pricePerNight, selectedRoom.currency)} / night</span>
              </div>

              <div className="booking-request-grid">
                <input
                  value={bookingForm.guestName}
                  onChange={(event) => updateBookingForm("guestName", event.target.value)}
                  placeholder="Full name"
                  autoComplete="name"
                />
                <input
                  type="email"
                  value={bookingForm.guestEmail}
                  onChange={(event) => updateBookingForm("guestEmail", event.target.value)}
                  placeholder="Email address"
                  autoComplete="email"
                />
                <input
                  value={bookingForm.guestPhone}
                  onChange={(event) => updateBookingForm("guestPhone", event.target.value)}
                  placeholder="Phone / WhatsApp"
                  autoComplete="tel"
                />
                <select
                  value={bookingForm.paymentMethod}
                  onChange={(event) => updateBookingForm("paymentMethod", event.target.value)}
                >
                  <option value="pay_at_hotel">Pay at hotel</option>
                  <option value="bank_transfer">Bank transfer</option>
                </select>
              </div>

              <textarea
                value={bookingForm.specialRequests}
                onChange={(event) => updateBookingForm("specialRequests", event.target.value)}
                placeholder="Special requests, arrival time, or questions"
                rows={3}
              />

              {(bookingError || bookingStatus) && (
                <p className={bookingError ? "booking-search-note is-error" : "booking-search-note"}>
                  {bookingError || bookingStatus}
                </p>
              )}

              <button className="booking-request-submit" type="submit" disabled={isBooking}>
                {isBooking ? "Sending request" : "Request this room"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
