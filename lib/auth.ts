/**
 * Client-side auth helpers.
 */

export async function setSessionCookie(idToken: string): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    throw new Error("Failed to set session cookie");
  }
}

export async function clearSessionCookie(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error("Failed to clear session cookie");
  }
}
