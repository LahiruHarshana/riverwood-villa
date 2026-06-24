"use client";

import { CalendarDays } from "lucide-react";

type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  onCheckInChange: (value: string) => void;
  onCheckOutChange: (value: string) => void;
};

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

export function DateRangePicker({
  checkIn,
  checkOut,
  onCheckInChange,
  onCheckOutChange,
}: DateRangePickerProps) {
  const today = toDateInputValue(new Date());
  const checkoutMin = checkIn ? addDays(checkIn, 1) : addDays(today, 1);

  const handleCheckInChange = (value: string) => {
    onCheckInChange(value);

    if (value && checkOut && checkOut <= value) {
      onCheckOutChange("");
    }
  };

  return (
    <div className="booking-date-grid" aria-label="Select stay dates">
      <label className="booking-field-card">
        <span className="booking-field-kicker">Arrival</span>
        <span className="booking-field-control">
          <CalendarDays size={18} strokeWidth={1.7} />
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(event) => handleCheckInChange(event.target.value)}
            aria-label="Check-in date"
            required
          />
        </span>
      </label>

      <label className="booking-field-card">
        <span className="booking-field-kicker">Departure</span>
        <span className="booking-field-control">
          <CalendarDays size={18} strokeWidth={1.7} />
          <input
            type="date"
            value={checkOut}
            min={checkoutMin}
            onChange={(event) => onCheckOutChange(event.target.value)}
            aria-label="Check-out date"
            required
          />
        </span>
      </label>
    </div>
  );
}
