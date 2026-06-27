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
    try {
      const data = await res.json();
      throw new Error(data.error || "Failed to set session cookie");
    } catch (e: any) {
      if (e.message !== "Failed to set session cookie" && !e.message.includes("Unexpected token")) {
        throw e;
      }
      throw new Error(`Failed to set session cookie (HTTP ${res.status})`);
    }
  }
}

export async function clearSessionCookie(): Promise<void> {
  const res = await fetch("/api/auth/logout", { method: "POST" });

  if (!res.ok) {
    throw new Error("Failed to clear session cookie");
  }
}
