"use client";

import { useEffect } from "react";

export function PageTracker() {
  useEffect(() => {
    // Only track once per browser session to prevent double-counting on refreshes
    if (!sessionStorage.getItem("tracked_view")) {
      fetch("/api/analytics/view", { method: "POST" })
        .catch(() => {
          // Silent fail for analytics, don't interrupt the user experience
        });
      sessionStorage.setItem("tracked_view", "true");
    }
  }, []);

  return null;
}
