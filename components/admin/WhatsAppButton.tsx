"use client";

import { MessageCircle } from "lucide-react";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label: string;
  customMessage?: string;
  customMessageRef?: React.RefObject<HTMLTextAreaElement | null>;
}

export function WhatsAppButton({ phone, message, label, customMessage, customMessageRef }: WhatsAppButtonProps) {
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:-translate-y-[1px] hover:bg-[#128C7E] hover:shadow-md active:translate-y-0 sm:w-auto"
    >
      <MessageCircle className="w-4 h-4" /> {label}
    </button>
  );
}
