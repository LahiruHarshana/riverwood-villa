export async function getDailyViews(dateStr: string): Promise<number> {
  try {
    const response = await fetch(`/api/admin/analytics?date=${dateStr}`, { cache: "no-store" });
    if (!response.ok) return 0;
    const data = await response.json();
    return data.views || 0;
  } catch {
    return 0;
  }
}
