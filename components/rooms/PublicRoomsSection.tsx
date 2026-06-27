"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PublicRoom = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  pricePerNight: number;
  currency: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  images: string[];
};

type RoomsResponse = {
  rooms?: PublicRoom[];
  error?: string;
};

type MotionModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let motionPromise: Promise<MotionModules> | null = null;

function loadMotionModules() {
  motionPromise ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]).then(([gsapModule, scrollTriggerModule]) => ({
    gsap: gsapModule.gsap,
    ScrollTrigger: scrollTriggerModule.ScrollTrigger,
  }));

  return motionPromise;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PublicRoomsSection() {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const sectionRef = useRef<HTMLElement>(null);
  const animInitialized = useRef(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const loadRooms = async () => {
      try {
        const response = await fetch("/api/rooms", { cache: "no-store" });
        const data = (await response.json()) as RoomsResponse;

        if (!response.ok) {
          throw new Error(data.error || "Failed to load rooms.");
        }

        if (!cancelled) {
          setRooms(data.rooms || []);
          setErrorMessage("");
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load rooms.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isLoading || rooms.length === 0 || animInitialized.current) return;
    animInitialized.current = true;

    const disposers: Array<() => void> = [];

    const initAnimations = async () => {
      const { gsap, ScrollTrigger } = await loadMotionModules();
      gsap.registerPlugin(ScrollTrigger);

      const section = sectionRef.current;
      if (!section) return;

      const header = section.querySelector<HTMLElement>(".rooms-showcase-header");
      if (header) {
        gsap.fromTo(
          header.children,
          { y: 44, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: header, start: "top 82%", toggleActions: "play none none reverse" },
          }
        );
      }

      const cards = section.querySelectorAll<HTMLElement>(".room-card");
      if (cards.length > 0) {
        cards.forEach((c) => (c.style.transition = "none"));
        gsap.fromTo(
          cards,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".rooms-grid", start: "top 78%", toggleActions: "play none none reverse" },
            onComplete: () => {
              gsap.set(cards, { clearProps: "transform,transition" });
            },
          }
        );

        gsap.utils.toArray<HTMLElement>(".room-card-media", section).forEach((media) => {
          const img = media.querySelector<HTMLElement>("img");
          if (!img) return;

          const tween = gsap.fromTo(
            img,
            { yPercent: -6, scale: 1.08 },
            {
              yPercent: 6,
              scale: 1.02,
              ease: "none",
              scrollTrigger: {
                trigger: media,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          disposers.push(() => tween.kill());
        });
      }

      ScrollTrigger.refresh();

      const refreshOnResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", refreshOnResize);
      disposers.push(() => window.removeEventListener("resize", refreshOnResize));
      disposers.push(() => ScrollTrigger.getAll().forEach((t) => t.kill()));
    };

    void initAnimations();

    return () => {
      disposers.forEach((fn) => fn());
    };
  }, [isLoading, rooms.length]);

  const scrollGrid = (direction: "left" | "right") => {
    if (!gridRef.current) return;
    const scrollAmount = direction === "left" ? -350 : 350;
    gridRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="rooms"
      className="rooms-showcase rv-cinematic"
      data-theme="dark"
      data-bg="#111110"
      data-chapter="04"
      aria-labelledby="rooms-title"
    >
      <div className="rooms-showcase-header">
        <div>
          <span className="section-index">04 / Browse rooms</span>
          <h2 id="rooms-title">See the room before you send the booking request.</h2>
        </div>
        <p>
          Guests usually want to compare room size, layout, and images first. Browse the room pages,
          then use the availability search to book the one that fits your stay.
        </p>
      </div>

      {isLoading && (
        <div className="rooms-grid" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <article className="room-card is-loading" key={index}>
              <div className="room-card-media" />
              <div className="room-card-body">
                <div className="room-card-line is-title" />
                <div className="room-card-line" />
                <div className="room-card-line is-short" />
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && errorMessage && <p className="rooms-note is-error">{errorMessage}</p>}

      {!isLoading && !errorMessage && rooms.length === 0 && (
        <p className="rooms-note">No public rooms are available to browse right now.</p>
      )}

      {!isLoading && rooms.length > 0 && (
        <>
          <div className="rooms-scroll-controls" aria-hidden="true">
            <button
              type="button"
              className="rooms-scroll-btn"
              onClick={() => scrollGrid("left")}
              aria-label="Scroll rooms left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="rooms-scroll-btn"
              onClick={() => scrollGrid("right")}
              aria-label="Scroll rooms right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="rooms-grid" ref={gridRef}>
            {rooms.map((room) => (
              <article className="room-card" key={room.id}>
                <figure className="room-card-media" data-parallax data-cursor="view space">
                  {room.images[0] ? (
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="room-card-fallback">No image yet</div>
                  )}
                  <figcaption className="room-card-media-label">
                    <span>View gallery</span>
                    <span>{room.images.length || 0} images</span>
                  </figcaption>
                </figure>

                <div className="room-card-body">
                  <div className="room-card-topline">
                    <span>{room.maxGuests} guests</span>
                    <span>{formatMoney(room.pricePerNight, room.currency)} / night</span>
                  </div>

                  <h3>{room.name}</h3>
                  <p>{room.shortDescription || room.description}</p>

                  <div className="room-card-meta">
                    <span>{room.bedrooms} bedroom</span>
                    <span>{room.bathrooms} bathroom</span>
                    <span>{room.amenities.slice(0, 2).join(" · ") || "Private stay"}</span>
                  </div>

                  <Link
                    className="room-card-link"
                    href={`/rooms/${room.slug}`}
                    data-magnetic
                  >
                    View room details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
