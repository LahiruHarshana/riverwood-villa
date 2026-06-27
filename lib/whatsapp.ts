const IOS_WHATSAPP_USER_AGENT = /iPad|iPhone|iPod/;

function normalizeWhatsAppPhone(phone: string) {
  return phone.replace(/[^\d]/g, "");
}

export function createWhatsAppUrl(phone: string, message: string, userAgent?: string) {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const encodedMessage = encodeURIComponent(message);
  const isIOS = typeof userAgent === "string" && IOS_WHATSAPP_USER_AGENT.test(userAgent);

  if (isIOS) {
    return `whatsapp://send?phone=${normalizedPhone}&text=${encodedMessage}`;
  }

  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
}

export function getWhatsAppUrl(phone: string, message: string) {
  if (typeof navigator === "undefined") {
    return createWhatsAppUrl(phone, message);
  }

  return createWhatsAppUrl(phone, message, navigator.userAgent);
}
