"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label: string;
  customMessage?: string;
  customMessageRef?: React.RefObject<HTMLTextAreaElement | null>;
  fullWidth?: boolean;
}

export function WhatsAppButton({
  phone,
  message,
  label,
  customMessage,
  customMessageRef,
  fullWidth = true,
}: WhatsAppButtonProps) {
  const handleClick = () => {
    let finalMessage = message;
    if (customMessageRef?.current) {
      finalMessage = customMessageRef.current.value;
    } else if (customMessage !== undefined) {
      finalMessage = customMessage;
    }
    const url = getWhatsAppUrl(phone, finalMessage);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className={`admin-whatsapp-button ${fullWidth ? "" : "is-inline"}`.trim()}
    >
      <MessageCircle className="w-4 h-4" /> {label}
    </button>
  );
}
