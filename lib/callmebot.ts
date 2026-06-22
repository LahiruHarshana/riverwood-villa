export async function sendWhatsAppToAdmin(message: string): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;

  if (!phone || !apiKey) {
    console.warn("CallMeBot credentials are missing");
    return false;
  }

  const encoded = encodeURIComponent(message);
  const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apiKey}`;

  try {
    const res = await fetch(url);
    return res.ok;
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
    return false;
  }
}
