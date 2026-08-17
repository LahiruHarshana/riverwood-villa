"use client";

import { useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import type { Booking } from "@/lib/firestore/bookings";
import { WhatsAppButton } from "@/components/admin/WhatsAppButton";

function formatStayRange(checkIn: string, checkOut: string) {
  return `${new Date(checkIn).toLocaleDateString()}–${new Date(checkOut).toLocaleDateString()}`;
}

function buildMessageTemplates(booking: Booking) {
  const stay = formatStayRange(booking.checkIn, booking.checkOut);

  return [
    {
      label: "Booking received",
      message: `Hi ${booking.guestName}, thank you for your booking request at Riverwood Villa (${booking.roomName}, ${stay}, ${booking.guests} guest${booking.guests === 1 ? "" : "s"}). We will review your details and confirm shortly.`,
    },
    {
      label: "Confirm booking",
      message: `Hi ${booking.guestName}, your booking at Riverwood Villa (${booking.roomName}, ${stay}) is confirmed. We look forward to hosting you!`,
    },
    {
      label: "Request deposit",
      message: `Hi ${booking.guestName}, thank you for choosing Riverwood Villa. To secure your reservation for ${stay}, please send a 30% deposit. Reply here and we will share payment details.`,
    },
    {
      label: "Ask arrival time",
      message: `Hi ${booking.guestName}, we are preparing for your stay at Riverwood Villa (${stay}). Could you share your expected arrival time and any special requests?`,
    },
    {
      label: "Pay at hotel",
      message: `Hi ${booking.guestName}, your booking request for ${booking.roomName} (${stay}) is noted with pay-at-hotel. We will confirm availability shortly and share check-in details.`,
    },
  ];
}

export function GuestWhatsAppComposer({ booking }: { booking: Booking }) {
  const quickMessages = useMemo(() => buildMessageTemplates(booking), [booking]);
  const [customMessage, setCustomMessage] = useState(quickMessages[0].message);

  const applyTemplate = (message: string) => {
    setCustomMessage(message);
  };

  const openCustomMessage = () => {
    const trimmed = customMessage.trim();
    if (!trimmed) return;
    window.open(getWhatsAppUrl(booking.guestPhone, trimmed), "_blank", "noopener,noreferrer");
  };

  return (
    <div className="admin-panel lg:col-span-2 p-6">
      <div className="admin-detail-section-head">
        <div className="admin-detail-section-icon">
          <MessageCircle className="w-4 h-4" />
        </div>
        <h2 className="admin-detail-section-title">Contact guest</h2>
      </div>

      <p className="admin-form-section-copy mb-4">
        Send a ready-made WhatsApp message or edit the text below before sending.
      </p>

      <div className="admin-action-grid mb-5">
        {quickMessages.map((msg) => (
          <WhatsAppButton
            key={msg.label}
            phone={booking.guestPhone}
            message={msg.message}
            label={msg.label}
          />
        ))}
      </div>

      <div className="admin-custom-message-panel">
        <div className="admin-custom-message-head">
          <h3 className="admin-form-section-title">Custom message</h3>
          <span className="admin-results-note">Tap a template, edit if needed, then send.</span>
        </div>

        <div className="admin-message-template-list">
          {quickMessages.map((template) => (
            <button
              key={template.label}
              type="button"
              className="admin-message-template-chip"
              onClick={() => applyTemplate(template.message)}
            >
              Use: {template.label}
            </button>
          ))}
        </div>

        <textarea
          value={customMessage}
          onChange={(event) => setCustomMessage(event.target.value)}
          placeholder="Write your message to the guest..."
          className="admin-input admin-custom-message-input"
          rows={5}
        />

        <div className="admin-custom-message-actions">
          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => setCustomMessage("")}
          >
            Clear
          </button>
          <button
            type="button"
            className="admin-whatsapp-button is-send"
            onClick={openCustomMessage}
            disabled={!customMessage.trim()}
          >
            <MessageCircle className="w-4 h-4" /> Send on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
