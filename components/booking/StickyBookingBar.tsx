"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export function StickyBookingBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const booking = document.getElementById("book");

      if (!hero) {
        setVisible(window.scrollY > window.innerHeight * 0.7);
        return;
      }

      const pastHero = hero.getBoundingClientRect().bottom < 0;
      const bookingRect = booking?.getBoundingClientRect();
      const bookingInView = Boolean(
        bookingRect && bookingRect.top < window.innerHeight * 0.82 && bookingRect.bottom > 120
      );

      setVisible(pastHero && !bookingInView);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <aside className={`sticky-booking-bar ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <div className="sticky-booking-copy">
        <span>Book your stay</span>
        <strong>Check riverside availability</strong>
      </div>
      <a
        className="sticky-booking-button"
        href="#book"
        aria-label="Check room availability"
        tabIndex={visible ? 0 : -1}
      >
        Check availability <ArrowUpRight size={16} strokeWidth={1.9} />
      </a>
    </aside>
  );
}
