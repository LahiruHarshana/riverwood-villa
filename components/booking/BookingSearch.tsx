"use client";

import { type FormEvent, useState } from "react";
import { Leaf, Minus, Plus, Search, Users } from "lucide-react";
import { DateRangePicker } from "@/components/booking/DateRangePicker";

type AvailabilityResponse = {
  rooms?: unknown[];
  nights?: number;
  error?: string;
};

const MIN_GUESTS = 1;
const MAX_GUESTS = 10;

export function BookingSearch() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const adjustGuests = (direction: 1 | -1) => {
    setGuests((current) => Math.min(MAX_GUESTS, Math.max(MIN_GUESTS, current + direction)));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");

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

  return (
    <form className="booking-search-card" onSubmit={handleSubmit}>
      <div className="booking-search-header">
        <span className="booking-search-mark" aria-hidden="true">
          <Leaf size={17} strokeWidth={1.8} />
        </span>
        <div>
          <p className="booking-search-eyebrow">Availability first</p>
          <h3>Find your riverside room</h3>
        </div>
      </div>

      <DateRangePicker
        checkIn={checkIn}
        checkOut={checkOut}
        onCheckInChange={setCheckIn}
        onCheckOutChange={setCheckOut}
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
  );
}
