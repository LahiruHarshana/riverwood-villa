"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phone: string;
  message: string;
  label: string;
  customMessageId?: string;
}

export function WhatsAppButton({ phone, message, label, customMessageId }: WhatsAppButtonProps) {
  const handleClick = () => {
    let finalMessage = message;
    if (customMessageId) {
      const textarea = document.getElementById(customMessageId) as HTMLTextAreaElement | null;
      if (textarea) {
        finalMessage = textarea.value;
      }
    }
    const encodedMessage = encodeURIComponent(finalMessage);
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 font-bold text-white transition-colors hover:bg-[#128C7E]"
    >
      <MessageCircle className="w-4 h-4" /> {label}
    </button>
  );
}
