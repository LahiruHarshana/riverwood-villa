"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";
import { BookingSearch } from "@/components/booking/BookingSearch";

type MotionModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  Lenis: typeof import("lenis").default;
};
type GsapTween = ReturnType<MotionModules["gsap"]["to"]>;

let motionModulesPromise: Promise<MotionModules> | null = null;

function loadMotionModules() {
  motionModulesPromise ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]).then(([gsapModule, scrollTriggerModule, lenisModule]) => ({
    gsap: gsapModule.gsap,
    ScrollTrigger: scrollTriggerModule.ScrollTrigger,
    Lenis: lenisModule.default,
  }));

  return motionModulesPromise;
}

const navItems = [
  ["Home", "#home"],
  ["Story", "#story"],
  ["Stay", "#stay"],
  ["River", "#river"],
  ["Dining", "#dining"],
  ["Gallery", "#gallery"],
  ["Book", "#book"],
] as const;

const stayChapters = [
  {
    number: "01",
    eyebrow: "Sleep",
    title: "Rooms made for unhurried mornings",
    copy: "High ceilings, soft natural materials, generous beds, and calm views create a private retreat that feels connected to the landscape.",
    image: "/villa/villa-bedroom-high-ceiling.jpg",
    alt: "High-ceiling canopy bedroom at Riverwood Villa",
  },
  {
    number: "02",
    eyebrow: "Breathe",
    title: "Balconies open to palms and river light",
    copy: "Step outside for coffee, conversation, and the changing sound of the river. Every veranda is designed as a room of its own.",
    image: "/villa/villa-balcony-chairs-river.webp",
    alt: "Balcony chairs overlooking the river",
  },
  {
    number: "03",
    eyebrow: "Gather",
    title: "Shared spaces with room to linger",
    copy: "Long tables, shaded terraces, and open-air corners give families and groups space to eat, rest, and reconnect without a schedule.",
    image: "/villa/villa-terrace.webp",
    alt: "Shared veranda seating beside the river at Riverwood Villa",
  },
] as const;

const galleryItems = [
  {
    image: "/villa/villa-exterior-side.jpg",
    title: "Arrival",
    index: "01",
    alt: "Riverwood Villa exterior beside palms and river light",
  },
  {
    image: "/villa/villa-long-balcony.jpg",
    title: "Veranda",
    index: "02",
    alt: "Long balcony at Riverwood Villa",
  },
  {
    image: "/villa/villa-boat-sunset.webp",
    title: "Sunset",
    index: "03",
    alt: "Boat on the river at sunset",
  },
  {
    image: "/villa/villa-peacocks-veranda.jpg",
    title: "Wild visitors",
    index: "04",
    alt: "Peacocks near the villa veranda",
  },
  {
    image: "/villa/villa-exterior-night.jpg",
    title: "After dark",
    index: "05",
    alt: "Riverwood Villa illuminated at night",
  },
  {
    image: "/villa/villa-paved-walkway.webp",
    title: "Slow paths",
    index: "06",
    alt: "Paved garden walkway at Riverwood Villa",
  },
] as const;

const fullGalleryCategories = [
  "All",
  "River",
  "Rooms",
  "Balconies",
  "Dining",
  "Exterior",
  "Wildlife",
  "Amenities",
] as const;

type FullGalleryCategory = (typeof fullGalleryCategories)[number];

const fullGalleryItems: Array<{
  image: string;
  title: string;
  category: Exclude<FullGalleryCategory, "All">;
  alt: string;
  caption: string;
  shape?: "wide" | "tall";
}> = [
  {
    image: "/villa/villa-exterior-side-river.jpg",
    title: "Riverside balconies",
    category: "River",
    alt: "Riverwood Villa balconies beside the river and palms",
    caption: "The upper level opens directly to river views and palms.",
    shape: "tall",
  },
  {
    image: "/villa/villa-balcony-chairs-river.webp",
    title: "Corner river balcony",
    category: "Balconies",
    alt: "Two wooden chairs on a Riverwood Villa balcony overlooking the river",
    caption: "A quiet corner for morning tea with the water below.",
  },
  {
    image: "/villa/villa-terrace-dining.webp",
    title: "Riverside terrace tables",
    category: "Dining",
    alt: "Covered riverside terrace dining area with tables and chairs",
    caption: "Shaded dining directly beside the river edge.",
    shape: "tall",
  },
  {
    image: "/villa/villa-balcony-path.jpg",
    title: "Garden-side balcony",
    category: "Balconies",
    alt: "Wooden chairs on a balcony overlooking the garden path",
    caption: "Balcony seating framed by palms and the garden walkway.",
    shape: "tall",
  },
  {
    image: "/villa/villa-exterior-side.jpg",
    title: "Villa and river facade",
    category: "Exterior",
    alt: "Side view of Riverwood Villa beside palm trees and the river",
    caption: "The villa follows the bend of the river from garden to balcony.",
    shape: "tall",
  },
  {
    image: "/villa/villa-dining-patio.jpg",
    title: "Sunset dining balcony",
    category: "Dining",
    alt: "Dining table on a balcony facing the river at sunset",
    caption: "A long table set toward the last light on the river.",
    shape: "tall",
  },
  {
    image: "/villa/villa-bedroom-desk.jpg",
    title: "Bedroom work corner",
    category: "Rooms",
    alt: "Minimal bedroom with canopy bed and desk at Riverwood Villa",
    caption: "Simple private rooms with desk space and soft lighting.",
    shape: "tall",
  },
  {
    image: "/villa/villa-boat-sunset.webp",
    title: "Boat at dusk",
    category: "River",
    alt: "Small boat on the river at sunset near Riverwood Villa",
    caption: "Evening river movement just beyond the villa.",
    shape: "tall",
  },
  {
    image: "/villa/villa-long-balcony.jpg",
    title: "Long shared balcony",
    category: "Balconies",
    alt: "Long balcony with wooden chairs overlooking tropical greenery",
    caption: "Open-air seating runs along the guest rooms.",
    shape: "tall",
  },
  {
    image: "/villa/villa-bedroom-canopy.jpg",
    title: "Canopy room",
    category: "Rooms",
    alt: "Warm bedroom with canopy bed and balcony doors",
    caption: "A calm room with mosquito netting, warm lights, and balcony access.",
    shape: "tall",
  },
  {
    image: "/villa/villa-exterior-side-sunset.jpg",
    title: "Golden river facade",
    category: "Exterior",
    alt: "Riverwood Villa exterior beside the river at sunset",
    caption: "The building catches the warm river light at sunset.",
    shape: "tall",
  },
  {
    image: "/villa/villa-crocodile.webp",
    title: "River wildlife",
    category: "Wildlife",
    alt: "Crocodile swimming in the river near mangroves",
    caption: "Wildlife sightings are part of the riverside landscape.",
    shape: "tall",
  },
  {
    image: "/villa/villa-terrace.webp",
    title: "Open veranda seating",
    category: "Balconies",
    alt: "Covered veranda with wooden chairs overlooking the river",
    caption: "Shared veranda space for slow afternoons above the water.",
    shape: "tall",
  },
  {
    image: "/villa/villa-exterior-front.jpg",
    title: "Front arrival",
    category: "Exterior",
    alt: "Front exterior of Riverwood Villa with palm trees and sign",
    caption: "The front arrival view with palms, balconies, and villa signage.",
    shape: "wide",
  },
  {
    image: "/villa/villa-exterior-night.jpg",
    title: "Villa after dark",
    category: "Exterior",
    alt: "Riverwood Villa illuminated at night",
    caption: "Warm balcony lights give the villa a soft night presence.",
    shape: "wide",
  },
  {
    image: "/villa/villa-balcony-chair.webp",
    title: "Covered river table",
    category: "Balconies",
    alt: "Covered balcony table and chairs overlooking the river",
    caption: "A sheltered table for reading, tea, and the river breeze.",
    shape: "tall",
  },
  {
    image: "/villa/villa-balcony-palms.jpg",
    title: "Palm-view balcony",
    category: "Balconies",
    alt: "Wooden chair and table on balcony facing palm trees",
    caption: "Palm shade and timber details create a quiet private edge.",
    shape: "tall",
  },
  {
    image: "/villa/villa-hero.webp",
    title: "Aerial river setting",
    category: "River",
    alt: "Aerial view of Riverwood Villa by the river and tropical greenery",
    caption: "The villa sits between river, mangrove green, and coastal air.",
    shape: "wide",
  },
  {
    image: "/villa/villa-peacocks-veranda.jpg",
    title: "Peacocks on the veranda",
    category: "Wildlife",
    alt: "Two peacocks standing on the Riverwood Villa veranda railing",
    caption: "Peacocks sometimes arrive right at the balcony rail.",
    shape: "tall",
  },
  {
    image: "/villa/villa-bedroom-high-ceiling.jpg",
    title: "High-ceiling room",
    category: "Rooms",
    alt: "High-ceiling bedroom with canopy bed and dressing mirror",
    caption: "High timber ceilings and polished floors keep the room airy.",
    shape: "tall",
  },
  {
    image: "/villa/villa-balcony-table.jpg",
    title: "Shared balcony chairs",
    category: "Balconies",
    alt: "Wooden chairs and table along a balcony overlooking the river",
    caption: "A shared balcony line designed for conversation and river watching.",
    shape: "tall",
  },
  {
    image: "/villa/villa-hallway.webp",
    title: "Guest corridor",
    category: "Rooms",
    alt: "Long white corridor with wooden guest room doors",
    caption: "Clean corridors connect the private guest rooms.",
    shape: "tall",
  },
  {
    image: "/villa/villa-riverside.webp",
    title: "River bend aerial",
    category: "River",
    alt: "Aerial view of Riverwood Villa and the river bend",
    caption: "An overhead view of the villa and surrounding green river bend.",
    shape: "wide",
  },
  {
    image: "/villa/villa-paved-walkway.webp",
    title: "Garden arrival path",
    category: "Exterior",
    alt: "Paved walkway beside Riverwood Villa and tropical garden",
    caption: "The paved garden path leads guests into the villa grounds.",
    shape: "tall",
  },
  {
    image: "/villa/villa-outdoor-restaurant.webp",
    title: "Outdoor riverside dining",
    category: "Dining",
    alt: "Outdoor restaurant tables beside the river",
    caption: "Casual riverside tables for hosted meals and group moments.",
    shape: "wide",
  },
  {
    image: "/villa/villa-starlink.webp",
    title: "Starlink Wi-Fi speed",
    category: "Amenities",
    alt: "Starlink speed test showing fast internet connection",
    caption: "Fast Starlink connectivity for work, streaming, and longer stays.",
    shape: "tall",
  },
];

const filmFrames = [
  {
    number: "01",
    eyebrow: "Morning",
    title: "Wake inside the river light.",
    copy: "Balcony doors open, palms move softly, and the first hours of the day arrive without a schedule.",
    image: "/villa/villa-balcony-palms.jpg",
    alt: "Morning palms seen from a Riverwood Villa balcony",
  },
  {
    number: "02",
    eyebrow: "Afternoon",
    title: "Let the villa become your rhythm.",
    copy: "Move between cool rooms, long tables, shaded verandas, and the water whenever the mood changes.",
    image: "/villa/villa-terrace-dining.webp",
    alt: "Shaded riverside dining terrace in the afternoon",
  },
  {
    number: "03",
    eyebrow: "Evening",
    title: "Follow the last light to the river.",
    copy: "Gather for a hosted meal, watch the sky deepen, and end the day where the garden meets the water.",
    image: "/villa/villa-boat-sunset.webp",
    alt: "A boat on the river at sunset near Riverwood Villa",
  },
] as const;

const riverMoments = [
  {
    number: "01",
    title: "First light",
    copy: "The river begins quietly—silver water, bird calls, and the soft movement of leaves beyond the balcony.",
  },
  {
    number: "02",
    title: "Slow afternoon",
    copy: "Shade settles over the garden while boats pass in the distance and every shared space remains open to the breeze.",
  },
  {
    number: "03",
    title: "Dusk on the water",
    copy: "The landscape turns warm, dinner begins, and the edge of the river becomes the villa’s most natural gathering place.",
  },
] as const;

function settleHeroReveal() {
  const overlay = document.querySelector<HTMLElement>(".hero-overlay");
  if (overlay) overlay.style.opacity = "0.65";

  document.querySelectorAll<SVGTextElement>(".hero-logo-text").forEach((text) => {
    text.style.fillOpacity = "1";
    text.style.strokeDashoffset = "0";
  });

  const smallMark = document.querySelector<HTMLElement>(".hero-small-mark");
  if (smallMark) smallMark.style.opacity = "1";

  document
    .querySelectorAll<HTMLElement>(
      '.hero-content p span, .scroll-to-explore span, [data-loader="nav-logo"], [data-loader="nav-est"], [data-loader="nav-btn-line"]'
    )
    .forEach((element) => {
      element.style.transform = "translateY(0)";
    });

  const navLine = document.querySelector<HTMLElement>('[data-loader="nav-line"]');
  if (navLine) navLine.style.transform = "scaleX(1)";
}

function LoaderMark() {
  return (
    <svg viewBox="0 0 500 500" aria-hidden="true" className="loader-svg">
      <g transform="matrix(3.0810909271240234, 0, 0, 3.0810909271240234, -520.272705078125, -520.272705078125)">
        <circle className="loader-circle" cx="250" cy="250" r="75" />
        <image
          className="loader-kanji"
          href="/brand/logo.png"
          x="200"
          y="200"
          width="100"
          height="100"
        />
      </g>
    </svg>
  );
}

function HeroLogo() {
  return (
    <svg
      className="hero-logo"
      data-loader="svg"
      viewBox="0 0 1443 390"
      aria-hidden="true"
    >
      <text className="hero-logo-text" x="0" y="142">
        RIVERWOOD
      </text>
      <text className="hero-logo-text is-small" x="0" y="342">
        VILLA
      </text>
    </svg>
  );
}

function FillImage({
  src,
  alt,
  className,
  sizes = "(max-width: 980px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      loading="lazy"
    />
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [fullGalleryExpanded, setFullGalleryExpanded] = useState(false);
  const [activeFullGalleryCategory, setActiveFullGalleryCategory] =
    useState<FullGalleryCategory>("All");
  const hasAnimatedMenu = useRef(false);
  const fullGalleryRef = useRef<HTMLElement | null>(null);

  const openFullGallery = () => {
    setFullGalleryExpanded(true);
    window.requestAnimationFrame(() => {
      fullGalleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      loadMotionModules()
        .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
        .catch(() => undefined);
    });
  };

  const selectFullGalleryCategory = (category: FullGalleryCategory) => {
    setActiveFullGalleryCategory(category);
    window.requestAnimationFrame(() => {
      loadMotionModules()
        .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
        .catch(() => undefined);
    });
  };

  useEffect(() => {
    const fallback = window.setTimeout(() => {
      settleHeroReveal();
      setShowLoader(false);
    }, 3600);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".site-nav");
    if (!nav) return;

    const updateNavSurface = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    updateNavSurface();
    window.addEventListener("scroll", updateNavSurface, { passive: true });

    return () => window.removeEventListener("scroll", updateNavSurface);
  }, []);

  useEffect(() => {
    let alive = true;

    async function animateMenu() {
      if (!menuOpen && !hasAnimatedMenu.current) return;

      const { gsap } = await loadMotionModules();
      if (!alive) return;

      if (menuOpen) {
        hasAnimatedMenu.current = true;
        gsap.set(".site-menu", { autoAlpha: 1, pointerEvents: "auto" });
        gsap.fromTo(
          ".menu-left",
          { xPercent: -100 },
          { xPercent: 0, duration: 0.95, ease: "expo.inOut" }
        );
        gsap.fromTo(
          ".menu-right",
          { xPercent: 100 },
          { xPercent: 0, duration: 0.95, ease: "expo.inOut" },
        );
        gsap.fromTo(
          ".menu-left a span, .menu-left a strong",
          { yPercent: 120, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.82,
            ease: "power4.out",
            stagger: 0.035,
            delay: 0.18,
          }
        );
        gsap.fromTo(
          ".menu-right button, .menu-right > div, .menu-right small",
          { y: 34, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.68,
            ease: "power3.out",
            stagger: 0.07,
            delay: 0.34,
          }
        );
      } else {
        gsap.to(".site-menu", {
          autoAlpha: 0,
          pointerEvents: "none",
          duration: 0.42,
          ease: "sine.out",
        });
        gsap.to(".menu-left", { xPercent: -100, duration: 0.55, ease: "expo.inOut" });
        gsap.to(".menu-right", { xPercent: 100, duration: 0.55, ease: "expo.inOut" });
      }
    }

    animateMenu();

    return () => {
      alive = false;
    };
  }, [menuOpen]);

  useEffect(() => {
    let alive = true;
    let cleanup = () => {};

    async function bootMotion() {
      try {
        if (!alive) return;

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        if (reduceMotion) {
          document.documentElement.classList.add("motion-reduced");
          settleHeroReveal();
          setShowLoader(false);
          const bd = document.querySelector<HTMLElement>(".bg-dissolve");
          if (bd) bd.style.background = "var(--paper)";
          return;
        }

        const { gsap, ScrollTrigger, Lenis } = await loadMotionModules();
        if (!alive) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
          wheelMultiplier: 0.88,
        });

        lenis.on("scroll", ScrollTrigger.update);
        const raf = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0);

        const disposers: Array<() => void> = [];
        const on = <K extends keyof WindowEventMap>(
          target: Window | Document | HTMLElement,
          type: K,
          handler: (event: WindowEventMap[K]) => void,
        ) => {
          target.addEventListener(type, handler as EventListener);
          disposers.push(() => target.removeEventListener(type, handler as EventListener));
        };

        const clickHandler = (event: MouseEvent) => {
          const link = (event.target as Element | null)?.closest<HTMLAnchorElement>(
            'a[href^="#"]'
          );
          if (!link) return;
          const target = document.querySelector<HTMLElement>(link.hash);
          if (!target) return;
          event.preventDefault();
          setMenuOpen(false);
          lenis.scrollTo(target, { offset: -20 });
        };

        on(document, "click", clickHandler);

        // ─── Custom cursor (desktop / hover-capable only) ────────────────
        const cursorDot = document.querySelector<HTMLElement>(".cursor-dot");
        const cursorRing = document.querySelector<HTMLElement>(".cursor-ring");

        if (cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches) {
          const xRing = gsap.quickTo(cursorRing, "x", { duration: 0.5, ease: "power3.out" });
          const yRing = gsap.quickTo(cursorRing, "y", { duration: 0.5, ease: "power3.out" });

          on(window, "pointermove", (event: PointerEvent) => {
            gsap.set(cursorDot, { x: event.clientX, y: event.clientY });
            xRing(event.clientX);
            yRing(event.clientY);
          });

          document.querySelectorAll<HTMLElement>("a, button").forEach((element) => {
            const enter = () => cursorRing.classList.add("is-hover");
            const leave = () => cursorRing.classList.remove("is-hover");
            element.addEventListener("pointerenter", enter);
            element.addEventListener("pointerleave", leave);
            disposers.push(() => {
              element.removeEventListener("pointerenter", enter);
              element.removeEventListener("pointerleave", leave);
            });
          });
        }

        // ─── Velocity skew ──────────────────────────────────────────────
        const skewSetter = gsap.quickSetter("[data-skew]", "skewY", "deg") as (v: number) => void;
        const clampSkew = gsap.utils.clamp(-5, 5);
        let currentSkew = 0;

        const velocityHandler = ({ velocity }: { velocity: number }) => {
          currentSkew = clampSkew(velocity * -0.35);
          skewSetter(currentSkew);
        };
        lenis.on("scroll", velocityHandler);

        const settleSkew = () => {
          currentSkew *= 0.88;
          skewSetter(currentSkew);
        };
        gsap.ticker.add(settleSkew);

        // ─── Magnetic buttons ────────────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
          const strength = Number(el.dataset.magnetic ?? "0.38");
          const move = (event: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            gsap.to(el, {
              x: (event.clientX - (rect.left + rect.width / 2)) * strength,
              y: (event.clientY - (rect.top + rect.height / 2)) * strength,
              duration: 0.55,
              ease: "power3.out",
              overwrite: "auto",
            });
          };
          const leave = () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
          };
          el.addEventListener("pointermove", move);
          el.addEventListener("pointerleave", leave);
          disposers.push(() => {
            el.removeEventListener("pointermove", move);
            el.removeEventListener("pointerleave", leave);
          });
        });

        const context = gsap.context(() => {

          // ─── Loader ─────────────────────────────────────────────────
          const loaderCircle = document.querySelector<SVGCircleElement>(".loader-circle");
          const circleLength = loaderCircle?.getTotalLength() ?? 0;

          if (loaderCircle) {
            gsap.set(loaderCircle, {
              strokeDasharray: circleLength,
              strokeDashoffset: 0,
            });
          }

          gsap.set(".hero-logo-text", {
            animation: "none",
            strokeDashoffset: 900,
            fillOpacity: 0,
          });

          gsap
            .timeline({
              onComplete: () => {
                ScrollTrigger.refresh();
              },
            })
            .to('[data-loader="panel-line"]', {
              yPercent: (index) => (index % 2 === 0 ? 100 : -100),
              duration: 0.6,
              ease: "expo.inOut",
              stagger: 0.05,
            })
            .to('[data-loader="line-mid"]', {
              yPercent: (index) => (index % 2 === 0 ? -100 : 100),
              duration: 0.7,
              ease: "power4.inOut",
              stagger: 0.05,
            }, "<")
            .to(".loader-circle", {
              strokeDashoffset: circleLength,
              duration: 0.75,
              ease: "expo.inOut",
            }, "<+0.12")
            .to(".loader-kanji", { autoAlpha: 0, duration: 0.25, ease: "sine.out" }, "<+0.34")
            .to(".loader-circle", { autoAlpha: 0, duration: 0.25, ease: "sine.out" }, "<+0.12")
            .add("doors", 0.82)
            .to(".loader-logo", {
              autoAlpha: 0,
              scale: 0.9,
              duration: 0.32,
              ease: "power2.out",
            }, "doors")
            .to(".loader-panel", {
              xPercent: (index) => (index % 2 === 0 ? -100 : 100),
              rotateY: (index) => (index % 2 === 0 ? -8 : 8),
              duration: 1.05,
              ease: "expo.inOut",
            }, "doors")
            .to(".loader", { autoAlpha: 0, duration: 0.16, ease: "sine.out" }, "doors+=0.98")
            .set(".loader", { display: "none" }, "doors+=1.14")
            .add(() => {
              if (alive) setShowLoader(false);
              ScrollTrigger.refresh();
            }, "doors+=1.14")
            .to(".hero-logo-text", {
              strokeDashoffset: 0,
              duration: 2.15,
              ease: "power2.inOut",
              stagger: 0.1,
            }, "doors+=0.78")
            .to(".hero-logo-text", {
              fillOpacity: 1,
              duration: 1.2,
              ease: "sine.out",
            }, "<+1.05")
            .fromTo('[data-loader="overlay"]', { opacity: 1 }, {
              opacity: 0.65,
              duration: 0.95,
              ease: "sine.out",
            }, "doors+=0.82")
            .fromTo('[data-loader="home-svg-small"]', { autoAlpha: 0 }, {
              autoAlpha: 1,
              duration: 0.9,
              ease: "sine.out",
            }, "doors+=1.28")
            .from('[data-loader="para-line"]', {
              yPercent: 100,
              stagger: 0.045,
              duration: 0.95,
              ease: "power4.out",
            }, "doors+=1.28")
            .from('[data-loader="nav-line"]', {
              scaleX: 0,
              duration: 1.0,
              ease: "expo.inOut",
            }, "doors+=0.98")
            .from('[data-loader="nav-logo"]', {
              yPercent: 100,
              duration: 0.95,
              ease: "power3.out",
            }, "doors+=1.1")
            .from('[data-loader="nav-est"]', {
              yPercent: 100,
              duration: 0.95,
              ease: "power3.out",
            }, "doors+=1.1")
            .from('[data-loader="nav-btn-line"]', {
              xPercent: -100,
              duration: 0.95,
              ease: "power3.out",
              stagger: 0.2,
            }, "doors+=1.1")
            .from('[data-loader="scroll-txt"]', {
              yPercent: 100,
              duration: 0.9,
              ease: "power3.out",
            }, "doors+=1.42");

          // ─── Hero parallax ────────────────────────────────────────────
          gsap.to(".hero-bg img", {
            scale: 1.14,
            yPercent: 16,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // Cursor labels: ring grows + shows a tiny label on [data-cursor] hovers.
          if (window.matchMedia("(hover: hover)").matches) {
            const cursorRingEl = document.querySelector<HTMLElement>(".cursor-ring");
            const cursorLabelEl = document.querySelector<HTMLElement>(".cursor-label");
            if (cursorRingEl && cursorLabelEl) {
              document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((el) => {
                const enter = () => {
                  cursorLabelEl.textContent = el.dataset.cursor ?? "view";
                  cursorRingEl.classList.add("is-label");
                };
                const leave = () => cursorRingEl.classList.remove("is-label");
                el.addEventListener("pointerenter", enter);
                el.addEventListener("pointerleave", leave);
                disposers.push(() => {
                  el.removeEventListener("pointerenter", enter);
                  el.removeEventListener("pointerleave", leave);
                });
              });
            }
          }

          // ─── Global continuity after the frozen hero ──────────────────
          const nav = document.querySelector<HTMLElement>(".site-nav");
          const bgDissolve = document.querySelector<HTMLElement>(".bg-dissolve");
          const chapter = document.querySelector<HTMLElement>(".progress-chapter");
          const chapterCurrent = chapter?.querySelector<HTMLElement>("em");

          gsap.set(chapter, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: ".prologue-section",
            start: "top 82%",
            onEnter: () => gsap.to(chapter, { autoAlpha: 1, duration: 0.4 }),
            onLeaveBack: () => gsap.to(chapter, { autoAlpha: 0, duration: 0.25 }),
          });

          gsap.to(".progress-fill", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".rv-page",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.2,
            },
          });

          document.querySelectorAll<HTMLElement>("[data-theme]").forEach((section) => {
            ScrollTrigger.create({
              trigger: section,
              start: "top 14%",
              end: "bottom 14%",
              onEnter: () => nav?.classList.toggle("is-light", section.dataset.theme !== "dark"),
              onEnterBack: () => nav?.classList.toggle("is-light", section.dataset.theme !== "dark"),
            });
          });

          document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((section) => {
            ScrollTrigger.create({
              trigger: section,
              start: "top center",
              end: "bottom center",
              onEnter: () => {
                if (chapterCurrent) chapterCurrent.textContent = section.dataset.chapter ?? "01";
              },
              onEnterBack: () => {
                if (chapterCurrent) chapterCurrent.textContent = section.dataset.chapter ?? "01";
              },
            });
          });

          document.querySelectorAll<HTMLElement>("[data-bg]").forEach((section) => {
            const color = section.dataset.bg ?? "#FFFFFF";
            ScrollTrigger.create({
              trigger: section,
              start: "top 60%",
              end: "bottom 40%",
              onEnter: () => gsap.to(bgDissolve, { backgroundColor: color, duration: 0.7, ease: "power2.out" }),
              onEnterBack: () => gsap.to(bgDissolve, { backgroundColor: color, duration: 0.7, ease: "power2.out" }),
            });
          });

          gsap.utils.toArray<HTMLElement>(".motion-line, .section-rule").forEach((line) => {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 1.2,
                ease: "expo.out",
                scrollTrigger: { trigger: line, start: "top 90%", once: true },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((frame) => {
            const image = frame.querySelector<HTMLElement>("img");
            if (!image) return;
            gsap.fromTo(
              image,
              { yPercent: -8, scale: 1.1 },
              {
                yPercent: 8,
                scale: 1.02,
                ease: "none",
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });

          // ─── Editorial prologue ───────────────────────────────────────
          const prologueTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".prologue-section",
              start: "top 72%",
              once: true,
            },
          });

          prologueTimeline
            .from(".prologue-kicker > *", {
              yPercent: 120,
              duration: 0.8,
              ease: "power4.out",
              stagger: 0.05,
            })
            .from(".prologue-title-line > span", {
              yPercent: 115,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.08,
            }, "<+0.08")
            .from(".prologue-copy > *", {
              y: 34,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.09,
            }, "<+0.15");

          gsap.fromTo(".prologue-main-image", {
            clipPath: "inset(0 100% 0 0)",
          }, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.5,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".prologue-visuals", start: "top 82%", once: true },
          });

          gsap.fromTo(".prologue-float-image", {
            clipPath: "inset(100% 0 0 0)",
            y: 70,
          }, {
            clipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 1.35,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".prologue-visuals", start: "top 72%", once: true },
          });

          gsap.to(".prologue-marquee-track", {
            xPercent: -24,
            ease: "none",
            scrollTrigger: {
              trigger: ".prologue-section",
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
            },
          });

          // ─── Scroll-directed film: image frames behave like video cuts ─
          const filmFramesEls = gsap.utils.toArray<HTMLElement>(".film-frame");
          const filmCopies = gsap.utils.toArray<HTMLElement>(".film-copy");

          if (filmFramesEls.length > 0) {
            const filmSegment = 0.8;
            const filmTotalDuration = filmFramesEls.length * filmSegment;
            const filmImages = filmFramesEls
              .map((frame) => frame.querySelector<HTMLElement>("img"))
              .filter((image): image is HTMLElement => Boolean(image));

            gsap.set(filmFramesEls, { clipPath: "inset(100% 0 0 0)" });
            gsap.set(filmFramesEls[0], { clipPath: "inset(0% 0 0 0)" });
            gsap.set(filmImages, { scale: 1.06 });
            gsap.set(filmImages[0], { scale: 1.035 });
            gsap.set(filmCopies.slice(1), { autoAlpha: 0, y: 44 });

            const filmTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: ".film-sequence",
                start: "top top",
                end: `+=${filmFramesEls.length * 80}%`,
                pin: ".film-pin",
                scrub: 0.75,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            filmImages.forEach((image, index) => {
              filmTimeline.to(image, {
                scale: 1.015,
                duration: filmSegment,
                ease: "none",
              }, index * filmSegment);
            });

            filmFramesEls.forEach((frame, index) => {
              if (index === 0) return;
              const position = index * filmSegment;
              filmTimeline
                .to(frame, {
                  clipPath: "inset(0% 0 0 0)",
                  duration: filmSegment,
                  ease: "power3.inOut",
                }, position)
                .to(filmCopies[index - 1], {
                  autoAlpha: 0,
                  y: -34,
                  duration: 0.26,
                  ease: "power2.in",
                }, position)
                .fromTo(filmCopies[index], {
                  autoAlpha: 0,
                  y: 44,
                }, {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.42,
                  ease: "power3.out",
                }, position + 0.14);
            });

            filmTimeline.to(".film-progress-fill", {
              scaleX: 1,
              duration: filmTotalDuration,
              ease: "none",
            }, 0);
          }

          // ─── Horizontal stay chapters, inspired by editorial project rails ─
          const stayPanels = gsap.utils.toArray<HTMLElement>(".stay-panel");
          const revealStayPanel = (
            panel: HTMLElement,
            containerAnimation?: GsapTween,
          ) => {
            const image = panel.querySelector<HTMLElement>(".stay-panel-image");
            const copy = panel.querySelector<HTMLElement>(".stay-panel-copy");
            const triggerConfig = containerAnimation
              ? {
                  trigger: panel,
                  containerAnimation,
                  start: "left 82%",
                  once: true,
                }
              : {
                  trigger: panel,
                  start: "top 84%",
                  once: true,
                };

            if (image) {
              gsap.fromTo(image, { clipPath: "inset(0 100% 0 0)" }, {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.15,
                ease: "expo.inOut",
                scrollTrigger: triggerConfig,
              });
            }
            if (copy) {
              gsap.from(copy, {
                y: 40,
                autoAlpha: 0,
                duration: 0.85,
                ease: "power3.out",
                scrollTrigger: triggerConfig,
              });
            }
          };

          if (window.matchMedia("(min-width: 981px)").matches) {
            const staySection = document.querySelector<HTMLElement>(".stay-journey");
            const stayTrack = document.querySelector<HTMLElement>(".stay-track");
            const stayPin = document.querySelector<HTMLElement>(".stay-pin");

            if (staySection && stayTrack && stayPin) {
              const travel = () => Math.max(0, stayTrack.scrollWidth - window.innerWidth);
              const stayTween = gsap.to(stayTrack, {
                x: () => -travel(),
                ease: "none",
                scrollTrigger: {
                  trigger: staySection,
                  start: "top top",
                  end: () => `+=${travel()}`,
                  pin: stayPin,
                  scrub: 1,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });

              gsap.to(".stay-progress-fill", {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: staySection,
                  start: "top top",
                  end: () => `+=${travel()}`,
                  scrub: true,
                },
              });

              stayPanels.forEach((panel) => revealStayPanel(panel, stayTween));
              disposers.push(() => stayTween.kill());
            }
          } else {
            stayPanels.forEach((panel) => revealStayPanel(panel));
          }

          // ─── River chapters: pinned visual with scene-to-scene wipes ──
          const riverScenes = gsap.utils.toArray<HTMLElement>(".river-scene");
          const riverMomentEls = gsap.utils.toArray<HTMLElement>(".river-moment");
          if (riverScenes.length > 0) {
            gsap.set(riverScenes, { clipPath: "inset(100% 0 0 0)" });
            gsap.set(riverScenes[0], { clipPath: "inset(0% 0 0 0)" });

            riverMomentEls.forEach((moment, index) => {
              ScrollTrigger.create({
                trigger: moment,
                start: "top 58%",
                end: "bottom 42%",
                onEnter: () => {
                  gsap.to(riverScenes[index], { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
                  gsap.to(riverScenes.filter((_, sceneIndex) => sceneIndex > index), {
                    clipPath: "inset(100% 0 0 0)",
                    duration: 0.7,
                    ease: "expo.inOut",
                  });
                },
                onEnterBack: () => {
                  gsap.to(riverScenes[index], { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "expo.inOut" });
                  gsap.to(riverScenes.filter((_, sceneIndex) => sceneIndex > index), {
                    clipPath: "inset(100% 0 0 0)",
                    duration: 0.7,
                    ease: "expo.inOut",
                  });
                },
              });
            });
          }

          gsap.from(".river-header > *", {
            y: 44,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".river-header", start: "top 78%", once: true },
          });

          gsap.utils.toArray<HTMLElement>(".river-moment").forEach((moment) => {
            gsap.from(moment.children, {
              y: 36,
              autoAlpha: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: { trigger: moment, start: "top 80%", once: true },
            });
          });

          // ─── Kinetic dining statement ─────────────────────────────────
          gsap.utils.toArray<HTMLElement>(".dining-word-row").forEach((row, index) => {
            gsap.fromTo(row, {
              xPercent: index % 2 === 0 ? -10 : 10,
            }, {
              xPercent: index % 2 === 0 ? 7 : -7,
              ease: "none",
              scrollTrigger: {
                trigger: ".dining-section-v2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
              },
            });
          });

          gsap.fromTo(".dining-image-window", {
            clipPath: "inset(0 50% 0 50%)",
          }, {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.35,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".dining-image-window", start: "top 80%", once: true },
          });

          gsap.from(".dining-detail", {
            y: 48,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".dining-details", start: "top 82%", once: true },
          });

          // ─── Full gallery: scroll-scrubbed image motion ───────────────
          gsap.from(".full-gallery-heading > *", {
            y: 44,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.09,
            scrollTrigger: { trigger: ".full-gallery-heading", start: "top 82%", once: true },
          });

          gsap.fromTo(".full-gallery-feature", {
            clipPath: "inset(0 100% 0 0)",
          }, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.25,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".full-gallery-feature", start: "top 82%", once: true },
          });

          gsap.utils.toArray<HTMLElement>(".full-gallery-card").forEach((card) => {
            const image = card.querySelector<HTMLElement>("img");

            gsap.fromTo(card, {
              y: 70,
              autoAlpha: 0,
              clipPath: "inset(14% 0 0 0)",
            }, {
              y: 0,
              autoAlpha: 1,
              clipPath: "inset(0% 0 0 0)",
              duration: 1,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 86%", once: true },
            });

            if (image) {
              gsap.fromTo(image, {
                yPercent: -7,
                scale: 1.12,
              }, {
                yPercent: 7,
                scale: 1.025,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              });
            }
          });

          // ─── Visual journal rails ─────────────────────────────────────
          gsap.utils.toArray<HTMLElement>(".journal-row").forEach((row) => {
            const reverse = row.classList.contains("is-reverse");
            const distance = () => Math.max(0, row.scrollWidth - window.innerWidth + 80);
            gsap.fromTo(row, {
              x: reverse ? () => -distance() : 0,
            }, {
              x: reverse ? 0 : () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: ".journal-section-v2",
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            });
          });

          gsap.from(".journal-header > *", {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".journal-header", start: "top 82%", once: true },
          });

          // ─── Manifesto and booking finale ─────────────────────────────
          gsap.from(".manifesto-line > span", {
            yPercent: 115,
            duration: 1,
            ease: "power4.out",
            stagger: 0.08,
            scrollTrigger: { trigger: ".manifesto-section", start: "top 72%", once: true },
          });

          gsap.from(".booking-copy > *", {
            y: 44,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".booking-section-v2", start: "top 76%", once: true },
          });

          gsap.fromTo(".booking-visual", {
            clipPath: "inset(100% 0 0 0)",
          }, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".booking-section-v2", start: "top 74%", once: true },
          });

          gsap.from(".footer-v3 > *", {
            y: 48,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".footer-v3", start: "top 86%", once: true },
          });
        });

        const refresh = () => ScrollTrigger.refresh();
        if (document.fonts?.ready) {
          document.fonts.ready.then(refresh).catch(() => undefined);
        }
        on(window, "load", refresh);

        cleanup = () => {
          disposers.forEach((dispose) => dispose());
          context.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          gsap.ticker.remove(settleSkew);
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      } catch {
        if (alive) {
          settleHeroReveal();
          setShowLoader(false);
        }
      }
    }

    bootMotion();

    return () => {
      alive = false;
      cleanup();
    };
  }, []);


  return (
    <main id="home" className="rv-page">
      {/* ─── Continuity layer (spec §3.3 / §3.4) ─── */}
      <div className="bg-dissolve" aria-hidden="true" />
      <div className="progress-through-line" aria-hidden="true">
        <div className="progress-fill" />
      </div>
      <div className="progress-chapter" aria-hidden="true">
        <em>01</em><span>/ 07</span>
      </div>
      {showLoader ? (
        <div className="loader" aria-hidden="true">
          <div className="loader-panel left">
            <div className="panel-inner">
              <div data-loader="panel-line" className="loader-line is-panel-inner-l" />
            </div>
            <div data-loader="line-mid" className="loader-line is-panel-l" />
          </div>
          <div className="loader-panel right">
            <div className="panel-inner">
              <div data-loader="panel-line" className="loader-line is-panel-inner-r" />
            </div>
            <div data-loader="line-mid" className="loader-line is-panel-r" />
          </div>
          <div className="loader-logo"><LoaderMark /></div>
        </div>
      ) : null}

      <header className="site-nav">
        <div data-loader="nav-line" className="nav-line" aria-hidden="true" />
        <a href="#home" className="nav-logo" aria-label="Riverwood Villa home">
          <span data-loader="nav-logo">Riverwood Villa</span>
        </a>
        <span className="nav-est">
          <span data-loader="nav-est">EST - Private Villa</span>
        </span>
        <a className="nav-book-cta" href="#book">
          Check availability <ArrowUpRight size={14} strokeWidth={1.9} />
        </a>
        <button
          className="nav-menu"
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <span>Menu</span>
          <span className="nav-btn-lines" aria-hidden="true">
            <i data-loader="nav-btn-line" />
            <i data-loader="nav-btn-line" />
          </span>
        </button>
      </header>

      <aside className={`site-menu ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <nav className="menu-left" aria-label="Primary navigation">
          {navItems.map(([label, href], index) => (
            <a href={href} key={href}>
              <span>({index + 1})</span>
              <strong>{label}</strong>
            </a>
          ))}
        </nav>
        <div className="menu-right">
          <button type="button" onClick={() => setMenuOpen(false)}>
            Close <X size={18} />
          </button>
          <div>
            <p>Email</p>
            <a href="mailto:hello@riverwoodvilla.com">hello@riverwoodvilla.com</a>
          </div>
          <div>
            <p>Phone</p>
            <a href="tel:+94770000000">+94 77 000 0000</a>
          </div>
          <div>
            <p>Office</p>
            <span>Riverside Road, Sri Lanka</span>
          </div>
          <small>Private riverside boutique stay</small>
        </div>
      </aside>

      <a className="floating-booking-cta" href="#book" aria-label="Check room availability">
        <span>Book your stay</span>
        <strong>Check availability</strong>
        <ArrowUpRight size={16} strokeWidth={1.9} />
      </a>



      <section className="hero" aria-labelledby="hero-title" data-theme="dark">
        <figure className="hero-bg">
          <Image
            src="/villa/hero.png"
            alt="Aerial view of Riverwood Villa beside the river"
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
          />
          <div data-loader="overlay" className="hero-overlay" />
        </figure>
        <div className="hero-container">
          <div className="hero-layout">
            <div className="hero-logo-wrap">
              <h1 id="hero-title" className="hero-h1">
                Riverwood Villa
              </h1>
              <HeroLogo />
            </div>
            <div className="hero-content">
              <div className="hero-content-top">
                <Image
                  className="hero-small-mark"
                  data-loader="home-svg-small"
                  src="/brand/logo.png"
                  alt=""
                  width={96}
                  height={96}
                  aria-hidden="true"
                />
                <p data-loader="para">
                  <span data-loader="para-line">
                    Private riverside living, balcony mornings, hosted meals, and soft
                    Sri Lankan river light from arrival to evening.
                  </span>
                </p>
              </div>
              <div className="scroll-to-explore">
                <span data-loader="scroll-txt">scroll</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="story"
        className="prologue-section rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="01"
        aria-labelledby="story-title"
      >
        <div className="prologue-kicker">
          <span>01</span>
          <span>The Riverwood story</span>
          <span>Private riverside living</span>
        </div>

        <div className="prologue-title-wrap">
          <h2 id="story-title" className="prologue-title">
            <span className="prologue-title-line"><span>A villa shaped by</span></span>
            <span className="prologue-title-line"><span><em>water, light,</em> and time.</span></span>
          </h2>
          <div className="prologue-copy">
            <p>
              Riverwood is designed for the hours people usually rush through: balcony mornings,
              long lunches, quiet swims of light across a room, and evenings gathered beside the river.
            </p>
            <a className="outline-button-v2" href="#stay" data-magnetic>
              Explore the stay <ArrowDownRight size={16} />
            </a>
          </div>
        </div>

        <div className="prologue-visuals">
          <figure className="prologue-main-image media-frame" data-parallax data-cursor="enter">
            <FillImage
              src="/villa/villa-riverside.webp"
              alt="Riverwood Villa opening toward the river"
              sizes="(max-width: 980px) 100vw, 68vw"
            />
          </figure>
          <figure className="prologue-float-image media-frame" data-parallax data-cursor="view">
            <FillImage
              src="/villa/villa-balcony-table.jpg"
              alt="A table prepared on a Riverwood Villa balcony"
              sizes="(max-width: 980px) 60vw, 22vw"
            />
          </figure>
          <div className="prologue-note">
            <span>06° North</span>
            <p>Warm architecture, open balconies, hosted meals, and river air from morning to night.</p>
          </div>
        </div>

        <div className="prologue-marquee" aria-hidden="true">
          <div className="prologue-marquee-track">
            <span>River light</span><i>✦</i><span>Open air</span><i>✦</i><span>Slow mornings</span><i>✦</i>
            <span>Warm hosting</span><i>✦</i><span>River light</span><i>✦</i><span>Open air</span><i>✦</i>
          </div>
        </div>
      </section>

      <section
        className="film-sequence rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="02"
        aria-label="A scroll-directed day at Riverwood Villa"
      >
        <div className="film-pin">
          <div className="film-stage" data-cursor="scroll">
            {filmFrames.map((frame) => (
              <figure className="film-frame" key={frame.number}>
                <FillImage
                  src={frame.image}
                  alt={frame.alt}
                  sizes="100vw"
                />
              </figure>
            ))}
            <div className="film-sage-panel" aria-hidden="true" />
          </div>

          <div className="film-copy-stack">
            {filmFrames.map((frame) => (
              <div className="film-copy" key={frame.number}>
                <div className="film-meta">
                  <span>{frame.number} / 03</span>
                  <span>{frame.eyebrow}</span>
                </div>
                <h2>{frame.title}</h2>
                <p>{frame.copy}</p>
              </div>
            ))}
          </div>

          <div className="film-side-label" aria-hidden="true">
            Scroll-directed film
          </div>
          <div className="film-progress" aria-hidden="true">
            <div className="film-progress-fill" />
          </div>
        </div>
      </section>

      <section
        id="stay"
        className="stay-journey rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="03"
        aria-labelledby="stay-title"
      >
        <div className="stay-pin">
          <div className="stay-track">
            <article className="stay-intro-panel">
              <span className="section-index">03 / The stay</span>
              <h2 id="stay-title">Spaces that make room for <em>real rest.</em></h2>
              <p>
                Move through the villa as one continuous experience—from private rooms to
                open balconies and generous places to gather.
              </p>
              <div className="stay-intro-mark" aria-hidden="true">R</div>
            </article>

            {stayChapters.map((chapter) => (
              <article className="stay-panel" key={chapter.number}>
                <figure className="stay-panel-image media-frame" data-parallax data-cursor="view space">
                  <FillImage
                    src={chapter.image}
                    alt={chapter.alt}
                    sizes="(max-width: 980px) 100vw, 58vw"
                  />
                </figure>
                <div className="stay-panel-copy">
                  <div className="stay-panel-meta">
                    <span>{chapter.number}</span>
                    <span>{chapter.eyebrow}</span>
                  </div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.copy}</p>
                </div>
                <span className="stay-panel-number" aria-hidden="true">{chapter.number}</span>
              </article>
            ))}
          </div>

          <div className="stay-progress" aria-hidden="true">
            <div className="stay-progress-fill" />
          </div>
        </div>
      </section>

      <section
        id="river"
        className="river-section-v2 rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="04"
        aria-labelledby="river-title"
      >
        <div className="river-grid">
          <div className="river-visual-column">
            <div className="river-visual-stack" data-cursor="river">
              <figure className="river-scene">
                <FillImage
                  src="/villa/villa-exterior-side-river.jpg"
                  alt="Riverwood Villa beside the river in daylight"
                  sizes="(max-width: 980px) 100vw, 50vw"
                />
              </figure>
              <figure className="river-scene">
                <FillImage
                  src="/villa/villa-crocodile.webp"
                  alt="Wildlife seen from Riverwood Villa"
                  sizes="(max-width: 980px) 100vw, 50vw"
                />
              </figure>
              <figure className="river-scene">
                <FillImage
                  src="/villa/villa-boat-sunset.webp"
                  alt="Sunset on the river near Riverwood Villa"
                  sizes="(max-width: 980px) 100vw, 50vw"
                />
              </figure>
            </div>
            <div className="river-coordinate">
              <span>Water / Garden / Sky</span>
              <span>Sri Lanka</span>
            </div>
          </div>

          <div className="river-copy-column">
            <header className="river-header">
              <span className="section-index">04 / The river</span>
              <h2 id="river-title">A landscape that changes <em>with every hour.</em></h2>
              <p>
                The water is not scenery behind the villa. It is the rhythm that connects every room,
                meal, conversation, and view.
              </p>
            </header>

            <div className="river-moments">
              {riverMoments.map((moment) => (
                <article className="river-moment" key={moment.number}>
                  <span>{moment.number}</span>
                  <h3>{moment.title}</h3>
                  <p>{moment.copy}</p>
                  <div className="section-rule" aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        id="dining"
        className="dining-section-v2 rv-cinematic"
        data-theme="light"
        data-bg="#89A894"
        data-chapter="05"
        aria-labelledby="dining-title"
      >
        <header className="dining-header">
          <span className="section-index">05 / Hosted moments</span>
          <p>One unhurried day, arranged around you.</p>
        </header>

        <div className="dining-kinetic" aria-labelledby="dining-title">
          <h2 id="dining-title" className="dining-word-row"><span>Stay</span><em>softly</em></h2>
          <h2 className="dining-word-row"><span>Eat</span><em>together</em></h2>
          <h2 className="dining-word-row"><span>Drift</span><em>slowly</em></h2>
        </div>

        <div className="dining-feature">
          <figure className="dining-image-window media-frame" data-parallax data-cursor="taste">
            <FillImage
              src="/villa/villa-outdoor-restaurant.webp"
              alt="Outdoor hosted dining at Riverwood Villa"
              sizes="(max-width: 980px) 100vw, 54vw"
            />
          </figure>
          <p>
            Breakfast on the balcony. Lunch beneath shade. A long table at dusk.
            Riverwood turns the simplest moments into the ones people remember.
          </p>
          <a className="solid-button-v2" href="#book" data-magnetic>
            Plan your stay <ArrowDownRight size={16} />
          </a>
        </div>

        <div className="dining-details">
          <article className="dining-detail"><span>01</span><h3>Fresh mornings</h3><p>Slow breakfasts, fruit, tea, and river air.</p></article>
          <article className="dining-detail"><span>02</span><h3>Shared tables</h3><p>Hosted meals with space for conversation.</p></article>
          <article className="dining-detail"><span>03</span><h3>Evening calm</h3><p>Last light, soft music, and nowhere else to be.</p></article>
        </div>
      </section>

      <section
        id="gallery"
        className="journal-section-v2 rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="06"
        aria-labelledby="gallery-title"
      >
        <header className="journal-header">
          <span className="section-index">06 / Visual journal</span>
          <h2 id="gallery-title">Small scenes from a <em>slower kind of day.</em></h2>
          <div className="journal-header-actions">
            <p>Architecture, landscape, wildlife, and the spaces between.</p>
            <button
              className="gallery-view-all"
              type="button"
              onClick={openFullGallery}
              data-magnetic
            >
              View all images <ArrowDownRight size={15} />
            </button>
          </div>
        </header>

        <div className="journal-viewport">
          <div className="journal-row">
            {galleryItems.slice(0, 4).map((item) => (
              <figure className="journal-card" key={`row-a-${item.index}`} data-cursor="open">
                <div className="journal-image"><FillImage src={item.image} alt={item.alt} sizes="42vw" /></div>
                <figcaption><span>{item.index}</span><strong>{item.title}</strong></figcaption>
              </figure>
            ))}
          </div>
          <div className="journal-row is-reverse">
            {[...galleryItems.slice(3), ...galleryItems.slice(0, 2)].map((item, index) => (
              <figure className="journal-card is-small" key={`row-b-${item.index}-${index}`} data-cursor="open">
                <div className="journal-image"><FillImage src={item.image} alt={item.alt} sizes="34vw" /></div>
                <figcaption><span>{item.index}</span><strong>{item.title}</strong></figcaption>
              </figure>
            ))}
          </div>
        </div>

        <section
          ref={fullGalleryRef}
          id="full-gallery"
          className={`full-gallery-panel ${fullGalleryExpanded ? "is-open" : ""}`}
          aria-labelledby="full-gallery-title"
          aria-hidden={!fullGalleryExpanded}
        >
          <div className="full-gallery-heading">
            <span className="section-index">Gallery full</span>
            <h3 id="full-gallery-title">Every angle of the villa, sorted by the way you want to explore.</h3>
            <p>
              Images are grouped by what they actually show, not only by file name: river,
              rooms, balconies, dining, exterior, wildlife, and amenities.
            </p>
          </div>

          <div className="full-gallery-feature" data-cursor="scan">
            <FillImage
              src="/villa/villa-riverside.webp"
              alt="Aerial view of Riverwood Villa on the river bend"
              sizes="(max-width: 980px) 100vw, 72vw"
            />
            <div className="full-gallery-feature-copy">
              <span>Scroll gallery</span>
              <strong>{fullGalleryItems.length} images</strong>
            </div>
          </div>

          <div className="full-gallery-tools" aria-label="Gallery categories">
            {fullGalleryCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeFullGalleryCategory === category ? "is-active" : ""}
                disabled={!fullGalleryExpanded}
                onClick={() => selectFullGalleryCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="full-gallery-grid">
            {fullGalleryItems.map((item, index) => {
              const isFilteredOut =
                activeFullGalleryCategory !== "All" && item.category !== activeFullGalleryCategory;

              return (
              <figure
                className={`full-gallery-card ${item.shape ? `is-${item.shape}` : ""} ${isFilteredOut ? "is-filtered-out" : ""}`}
                key={`${item.image}-${item.category}`}
                data-cursor="view"
                aria-hidden={isFilteredOut}
              >
                <div className="full-gallery-media">
                  <FillImage
                    src={item.image}
                    alt={item.alt}
                    sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <figcaption>
                  <span>{String(index + 1).padStart(2, "0")} / {item.category}</span>
                  <strong>{item.title}</strong>
                  <p>{item.caption}</p>
                </figcaption>
              </figure>
              );
            })}
          </div>
        </section>
      </section>

      <section
        className="manifesto-section rv-cinematic"
        data-theme="light"
        data-bg="#89A894"
        data-chapter="06"
        aria-label="Riverwood Villa philosophy"
      >
        <span className="manifesto-index">The Riverwood philosophy</span>
        <blockquote>
          <span className="manifesto-line"><span>The best luxury is</span></span>
          <span className="manifesto-line"><span>more <em>sky</em>, more water,</span></span>
          <span className="manifesto-line"><span>and more room to be together.</span></span>
        </blockquote>
        <figure className="manifesto-image" data-cursor="pause">
          <FillImage
            src="/villa/villa-balcony-chair.webp"
            alt="A quiet chair overlooking the Riverwood Villa landscape"
            sizes="(max-width: 980px) 58vw, 20vw"
          />
        </figure>
      </section>

      <section
        id="book"
        className="booking-section-v2 rv-cinematic"
        data-theme="light"
        data-bg="#FFFFFF"
        data-chapter="07"
        aria-labelledby="book-title"
      >
        <div className="booking-copy">
          <span className="section-index">07 / Your stay</span>
          <h2 id="book-title">Come stay <em>where the river slows everything down.</em></h2>
          <p>
            Share your dates, group size, and the kind of escape you are imagining.
            We will shape a relaxed Riverwood experience around you.
          </p>
          <BookingSearch />
        </div>

        <figure className="booking-visual media-frame" data-parallax data-cursor="arrive">
          <FillImage
            src="/villa/villa-hero.webp"
            alt="Aerial view of Riverwood Villa and the river landscape"
            sizes="(max-width: 980px) 100vw, 55vw"
          />
        </figure>

        <div className="booking-footnote">
          <span>Private riverside boutique stay</span>
          <span>Sri Lanka</span>
        </div>
      </section>

      <footer className="footer-v3" data-theme="light" data-bg="#89A894">
        <div className="footer-v3-top">
          <a href="#home" className="footer-v3-brand" aria-label="Riverwood Villa home">
            Riverwood
          </a>
          <div className="footer-v3-intro">
            <span>07 / 07</span>
            <p>Private riverside living, hosted with warmth.</p>
          </div>
        </div>

        <div className="footer-v3-explore">
          <span className="footer-v3-explore-label">Explore</span>
          <nav className="footer-v3-nav" aria-label="Footer navigation">
            {navItems.map(([label, href], index) => (
              <a href={href} key={href}>
                <span className="footer-v3-nav-index">0{index + 1}</span>
                <span className="footer-v3-nav-text">{label}</span>
                <ArrowUpRight className="footer-v3-nav-arrow" size={14} strokeWidth={1.8} />
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-v3-contact">
          <div className="footer-v3-contact-item is-email">
            <span>Email</span>
            <a href="mailto:hello@riverwoodvilla.com">hello@riverwoodvilla.com</a>
          </div>
          <div className="footer-v3-contact-item is-phone">
            <span>Phone</span>
            <a href="tel:+94770000000">+94 77 000 0000</a>
          </div>
          <div className="footer-v3-contact-item is-location">
            <span>Location</span>
            <p>Riverside Road, Sri Lanka</p>
          </div>
          <div className="footer-v3-contact-item is-social">
            <span>Social</span>
            <p><a href="#">Instagram</a><span aria-hidden="true"> · </span><a href="#">Facebook</a></p>
          </div>
        </div>

        <div className="footer-v3-bottom">
          <span>© {new Date().getFullYear()} Riverwood Villa</span>
          <span>Designed for slower days</span>
          <a href="#home">Back to top <ArrowUpRight size={13} /></a>
        </div>
      </footer>

      {/* Custom cursor — desktop only, hidden on touch via CSS */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">view</span>
      </div>
    </main>
  );
}
