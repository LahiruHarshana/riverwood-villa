"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { ArrowDownRight, ArrowUpRight, X } from "lucide-react";

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
    image: "/villa/villa-bedroom-canopy.jpg",
    alt: "Canopy bedroom at Riverwood Villa",
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
    image: "/villa/villa-terrace-dining.webp",
    alt: "Terrace dining area at Riverwood Villa",
  },
] as const;

const galleryItems = [
  {
    image: "/villa/villa-exterior-front.jpg",
    title: "Arrival",
    index: "01",
    alt: "Front exterior of Riverwood Villa",
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
    />
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const fallback = window.setTimeout(() => {
      settleHeroReveal();
      setShowLoader(false);
    }, 6200);
    return () => window.clearTimeout(fallback);
  }, []);

  useEffect(() => {
    let alive = true;

    function animateMenu() {
      if (!alive) return;

      if (menuOpen) {
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

          // ─── Loader (preserved exactly) ──────────────────────────────
          const loaderCircle = document.querySelector<SVGCircleElement>(".loader-circle");
          const circleLength = loaderCircle?.getTotalLength() ?? 0;

          if (loaderCircle) {
            gsap.set(loaderCircle, {
              strokeDasharray: circleLength,
              strokeDashoffset: 0,
            });
          }

          gsap
            .timeline({
              onComplete: () => {
                if (alive) setShowLoader(false);
                ScrollTrigger.refresh();
              },
            })
            .to('[data-loader="panel-line"]', {
              yPercent: (index) => (index % 2 === 0 ? 100 : -100),
              duration: 1.3,
              ease: "expo.inOut",
              stagger: 0.1,
            })
            .to('[data-loader="line-mid"]', {
              yPercent: (index) => (index % 2 === 0 ? -100 : 100),
              duration: 1.5,
              ease: "power4.inOut",
              stagger: 0.1,
            }, "<")
            .to(".loader-circle", {
              strokeDashoffset: circleLength,
              duration: 1.2,
              ease: "expo.inOut",
            }, "<+0.35")
            .to(".loader-kanji", { autoAlpha: 0, duration: 0.4, ease: "sine.out" }, "<+0.6")
            .to(".loader-circle", { autoAlpha: 0, duration: 0.4, ease: "sine.out" }, "<+0.2")
            .to(".loader-panel", {
              xPercent: (index) => (index % 2 === 0 ? -100 : 100),
              duration: 1.4,
              ease: "expo.inOut",
            }, ">")
            .from(".hero-logo-text", {
              strokeDashoffset: 900,
              fillOpacity: 0,
              duration: 3.5,
              ease: "power2.inOut",
              stagger: 0.15,
            }, "<+0.1")
            .to(".hero-logo-text", {
              fillOpacity: 1,
              duration: 2.5,
              ease: "sine.out",
            }, "<+2.0")
            .fromTo('[data-loader="overlay"]', { opacity: 1 }, {
              opacity: 0.65,
              duration: 1.5,
              ease: "sine.out",
            }, "<+0.3")
            .fromTo('[data-loader="home-svg-small"]', { autoAlpha: 0 }, {
              autoAlpha: 1,
              duration: 1.5,
              ease: "sine.out",
            }, "<+0.2")
            .from('[data-loader="para-line"]', {
              yPercent: 100,
              stagger: 0.045,
              duration: 1.5,
              ease: "power4.out",
            }, "<")
            .from('[data-loader="nav-line"]', {
              scaleX: 0,
              duration: 1.5,
              ease: "expo.inOut",
            }, "<")
            .from('[data-loader="nav-logo"]', {
              yPercent: 100,
              duration: 1.5,
              ease: "power3.out",
            }, "<+0.2")
            .from('[data-loader="nav-est"]', {
              yPercent: 100,
              duration: 1.5,
              ease: "power3.out",
            }, "<+0.2")
            .from('[data-loader="nav-btn-line"]', {
              xPercent: -100,
              duration: 1.5,
              ease: "power3.out",
              stagger: 0.2,
            }, "<+0.2")
            .from('[data-loader="scroll-txt"]', {
              yPercent: 100,
              duration: 1.5,
              ease: "power3.out",
            }, "<+0.25")
            .to(".loader", { autoAlpha: 0, duration: 0.01 })
            .set(".loader", { display: "none" });

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

          // ─── Global cinematic continuity ──────────────────────────────
          const nav = document.querySelector<HTMLElement>(".site-nav");
          const bgDissolve = document.querySelector<HTMLElement>(".bg-dissolve");
          const chapter = document.querySelector<HTMLElement>(".progress-chapter");
          const chapterCurrent = chapter?.querySelector<HTMLElement>("em");

          gsap.set(chapter, { autoAlpha: 0 });
          ScrollTrigger.create({
            trigger: ".intro-section",
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
              scrub: 0.25,
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
            const color = section.dataset.bg ?? "#f6f5f1";
            ScrollTrigger.create({
              trigger: section,
              start: "top 60%",
              end: "bottom 40%",
              onEnter: () => gsap.to(bgDissolve, { backgroundColor: color, duration: 0.9, ease: "power2.out" }),
              onEnterBack: () => gsap.to(bgDissolve, { backgroundColor: color, duration: 0.9, ease: "power2.out" }),
            });
          });

          gsap.utils.toArray<HTMLElement>(".drawn-line, .section-divider").forEach((line) => {
            gsap.fromTo(
              line,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 1.25,
                ease: "expo.out",
                scrollTrigger: { trigger: line, start: "top 88%" },
              },
            );
          });

          // ─── Story / intro ────────────────────────────────────────────
          const introTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".intro-section",
              start: "top 72%",
              once: true,
            },
          });

          introTimeline
            .from(".intro-jp-inner p", {
              yPercent: 120,
              duration: 0.9,
              ease: "power4.out",
            })
            .from(".intro-heading-line", {
              yPercent: 110,
              duration: 1.05,
              ease: "power4.out",
              stagger: 0.09,
            }, "<+0.08")
            .from(".intro-content-wrap > *", {
              y: 36,
              autoAlpha: 0,
              duration: 0.85,
              ease: "power3.out",
              stagger: 0.1,
            }, "<+0.12");

          gsap.fromTo(".intro-image", {
            clipPath: "inset(0 100% 0 0)",
          }, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.45,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".intro-image", start: "top 84%", once: true },
          });

          gsap.fromTo(".intro-small", {
            clipPath: "inset(100% 0 0 0)",
          }, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.25,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".intro-small", start: "top 88%", once: true },
          });

          gsap.to(".intro-image img", {
            yPercent: 10,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: ".intro-section", start: "top bottom", end: "bottom top", scrub: true },
          });

          gsap.to(".intro-small img", {
            yPercent: -10,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: ".intro-small-wrap", start: "top bottom", end: "bottom top", scrub: true },
          });

          // ─── Sticky film sequence ─────────────────────────────────────
          const stickyTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: ".sticky_scroll_trigger",
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });

          stickyTimeline
            .fromTo(".film-word-1", { yPercent: 0, autoAlpha: 1 }, { yPercent: -120, autoAlpha: 0, duration: 1 })
            .fromTo(".film-word-2", { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1 }, "<+0.15")
            .to(".film-word-2", { yPercent: -120, autoAlpha: 0, duration: 1 }, ">+0.2")
            .fromTo(".film-word-3", { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1 }, "<+0.15")
            .to(".big_img_track", { yPercent: -105, duration: 3.2, ease: "none" }, 0)
            .to(".big_img_col:nth-child(odd)", { yPercent: -12, duration: 3.2, ease: "none" }, 0)
            .to(".big_img_col:nth-child(even)", { yPercent: 12, duration: 3.2, ease: "none" }, 0);

          gsap.utils.toArray<HTMLElement>(".big_img_col .g_visual_img").forEach((image, index) => {
            gsap.fromTo(image, { scale: 1.18 }, {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".sticky_scroll_trigger",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
              },
            });
            gsap.to(image, { filter: "saturate(1)", duration: 0.2, delay: index * 0.02 });
          });

          // ─── Stay chapters ────────────────────────────────────────────
          gsap.from(".projects-header > *", {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".projects-header", start: "top 82%", once: true },
          });

          gsap.utils.toArray<HTMLElement>(".home_project_item").forEach((item, index) => {
            const visual = item.querySelector<HTMLElement>(".g_visual_wrap");
            const image = item.querySelector<HTMLElement>(".g_visual_img");
            const content = item.querySelector<HTMLElement>(".home_project_content");
            const bigNum = item.querySelector<HTMLElement>(".home_project_bignum");

            const timeline = gsap.timeline({
              scrollTrigger: { trigger: item, start: "top 80%", once: true },
            });

            timeline
              .from(item, { y: 70, autoAlpha: 0, duration: 1, ease: "power4.out" })
              .fromTo(visual, {
                clipPath: index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
              }, {
                clipPath: "inset(0 0% 0 0%)",
                duration: 1.2,
                ease: "expo.inOut",
              }, "<+0.08")
              .from(content, {
                x: index % 2 === 0 ? 50 : -50,
                autoAlpha: 0,
                duration: 0.9,
                ease: "power3.out",
              }, "<+0.22");

            if (image) {
              gsap.fromTo(image, { yPercent: -8, scale: 1.12 }, {
                yPercent: 8,
                scale: 1.02,
                ease: "none",
                scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
              });
            }

            if (bigNum) {
              gsap.to(bigNum, {
                yPercent: index % 2 === 0 ? -12 : 12,
                ease: "none",
                scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
              });
            }
          });

          // ─── Riverside section ────────────────────────────────────────
          gsap.fromTo(".h_sustain_watermark", {
            autoAlpha: 0,
            y: 40,
          }, {
            autoAlpha: 0.07,
            y: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: { trigger: ".home_sustain", start: "top 72%", once: true },
          });

          gsap.from(".h_sustain_kanji_wrap, .h_sustain_head, .sustain_content_wrap", {
            y: 48,
            autoAlpha: 0,
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: { trigger: ".home_sustain", start: "top 72%", once: true },
          });

          gsap.utils.toArray<HTMLElement>(".home_sustain .g_visual_wrap").forEach((visual, index) => {
            gsap.fromTo(visual, {
              clipPath: index === 0 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
            }, {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.35,
              ease: "expo.inOut",
              scrollTrigger: { trigger: visual, start: "top 84%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>(".home_sustain .g_visual_img").forEach((image) => {
            gsap.fromTo(image, { yPercent: -10, scale: 1.12 }, {
              yPercent: 10,
              scale: 1.02,
              ease: "none",
              scrollTrigger: { trigger: image.closest(".g_visual_wrap"), start: "top bottom", end: "bottom top", scrub: true },
            });
          });

          // ─── Dining / service statement ───────────────────────────────
          gsap.from(".service-section > div:first-child > *", {
            y: 30,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: { trigger: ".service-section", start: "top 78%", once: true },
          });

          gsap.from(".service-type > span", {
            yPercent: 120,
            autoAlpha: 0,
            duration: 1,
            ease: "power4.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".service-type", start: "top 78%", once: true },
          });

          gsap.fromTo(".service-img", {
            clipPath: "inset(0 50% 0 50%)",
          }, {
            clipPath: "inset(0 0% 0 0%)",
            duration: 1.35,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".service-type", start: "top 78%", once: true },
          });

          gsap.to(".service-img img", {
            scale: 1.12,
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: ".service-section", start: "top bottom", end: "bottom top", scrub: true },
          });

          gsap.from(".service-section > p, .service-section > .text-button", {
            y: 34,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".service-type", start: "bottom 75%", once: true },
          });

          // ─── Gallery ──────────────────────────────────────────────────
          gsap.from(".gallery-heading > *", {
            y: 38,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".gallery-heading", start: "top 82%", once: true },
          });

          ScrollTrigger.batch(".gallery-item", {
            start: "top 88%",
            once: true,
            onEnter: (batch: Element[]) => {
              batch.forEach((element: Element, index: number) => {
                window.setTimeout(() => element.classList.add("is-visible"), index * 90);
              });
            },
          });

          // ─── Quote ────────────────────────────────────────────────────
          gsap.from(".quote-section .rv-card", {
            xPercent: -14,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power4.out",
            scrollTrigger: { trigger: ".quote-section", start: "top 76%", once: true },
          });

          gsap.fromTo(".quote-img", {
            clipPath: "inset(100% 0 0 0)",
          }, {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.3,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".quote-section", start: "top 76%", once: true },
          });

          gsap.to(".quote-img img", {
            yPercent: 12,
            scale: 1.1,
            ease: "none",
            scrollTrigger: { trigger: ".quote-section", start: "top bottom", end: "bottom top", scrub: true },
          });

          // ─── Booking CTA ──────────────────────────────────────────────
          gsap.from(".cta-copy > *", {
            y: 45,
            autoAlpha: 0,
            duration: 0.95,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".cta-section", start: "top 76%", once: true },
          });

          gsap.fromTo(".cta-small", {
            clipPath: "circle(0% at 50% 50%)",
          }, {
            clipPath: "circle(72% at 50% 50%)",
            duration: 1.2,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".cta-section", start: "top 76%", once: true },
          });

          gsap.fromTo(".cta-large", {
            clipPath: "inset(0 0 100% 0)",
          }, {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.45,
            ease: "expo.inOut",
            scrollTrigger: { trigger: ".cta-section", start: "top 76%", once: true },
          });

          gsap.to(".cta-large img", {
            yPercent: 10,
            scale: 1.08,
            ease: "none",
            scrollTrigger: { trigger: ".cta-section", start: "top bottom", end: "bottom top", scrub: true },
          });

          // ─── Footer ───────────────────────────────────────────────────
          gsap.from(".footer > nav a", {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.06,
            scrollTrigger: { trigger: ".footer", start: "top 84%", once: true },
          });

          gsap.from(".footer-main > *", {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.16,
            scrollTrigger: { trigger: ".footer-main", start: "top 88%", once: true },
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



      <section className="hero" aria-labelledby="hero-title" data-theme="dark">
        <figure className="hero-bg">
          <Image
            src="/villa/hero.png"
            alt="Aerial view of Riverwood Villa beside the river"
            fill
            priority
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
        className="intro-section rv-rebuilt"
        data-theme="light"
        data-bg="#f6f5f1"
        data-chapter="01"
        aria-labelledby="story-title"
      >
        <div className="intro-left">
          <div className="intro-jp-wrap">
            <span className="jp">The Riverwood rhythm</span>
            <div className="intro-jp-inner">
              <p>Arrive. Exhale. Stay awhile.</p>
            </div>
          </div>
          <h2 id="story-title">
            <span className="mask-line"><span className="intro-heading-line">A private</span></span>
            <span className="mask-line"><span className="intro-heading-line"><em>riverside</em> world</span></span>
            <span className="mask-line"><span className="intro-heading-line">of your own.</span></span>
          </h2>
        </div>

        <div className="intro-image-wrap">
          <figure className="intro-image rv-clip" data-cursor="explore">
            <FillImage
              src="/villa/villa-riverside.webp"
              alt="Riverwood Villa beside the river"
              className="rv-parallax"
              sizes="(max-width: 980px) 100vw, 34vw"
            />
          </figure>
        </div>

        <div className="intro-right">
          <div className="intro-content-wrap">
            <p>
              Riverwood is a small, soulful villa where tropical architecture meets the
              quiet edge of the water. The experience is intentionally simple: generous
              rooms, open balconies, warm hosting, and time that finally feels spacious.
            </p>
            <a className="text-button" href="#stay" data-magnetic>
              Discover the stay <ArrowDownRight size={16} />
            </a>
          </div>
          <div className="intro-small-wrap">
            <figure className="intro-small rv-clip" data-cursor="view">
              <FillImage
                src="/villa/villa-balcony-table.jpg"
                alt="Table set on a Riverwood Villa balcony"
                sizes="(max-width: 980px) 100vw, 25vw"
              />
            </figure>
          </div>
        </div>
        <div className="intro-line drawn-line" aria-hidden="true" />
      </section>

      <section
        className="scroll_section rv-rebuilt"
        data-theme="light"
        data-bg="#efede7"
        data-chapter="02"
        aria-label="A cinematic glimpse of the Riverwood Villa experience"
      >
        <div className="sticky_scroll_trigger">
          <div className="sticky_track">
            <p className="sticky-kicker">One place. Many ways to slow down.</p>
            <div className="sticky_elements" aria-hidden="true">
              <div className="big_txt_row">
                <span className="big_txt film-word film-word-1">Wake slowly</span>
              </div>
              <div className="big_txt_row sticky-word-layer">
                <span className="big_txt italic film-word film-word-2">Live lightly</span>
              </div>
              <div className="big_txt_row sticky-word-layer">
                <span className="big_txt film-word film-word-3">Stay by water</span>
              </div>
            </div>

            <div className="big_img_track" aria-hidden="true">
              <div className="big_img_grid">
                <div className="big_img_col">
                  <figure className="g_visual_wrap">
                    <div className="g_visual_background" />
                    <FillImage
                      src="/villa/villa-balcony-palms.jpg"
                      alt=""
                      className="g_visual_img"
                      sizes="25vw"
                    />
                  </figure>
                </div>
                <div className="big_img_col">
                  <figure className="g_visual_wrap">
                    <div className="g_visual_background" />
                    <FillImage
                      src="/villa/villa-exterior-side-river.jpg"
                      alt=""
                      className="g_visual_img"
                      sizes="25vw"
                    />
                  </figure>
                </div>
                <div className="big_img_col">
                  <figure className="g_visual_wrap">
                    <div className="g_visual_background" />
                    <FillImage
                      src="/villa/villa-hallway.webp"
                      alt=""
                      className="g_visual_img"
                      sizes="25vw"
                    />
                  </figure>
                </div>
                <div className="big_img_col">
                  <figure className="g_visual_wrap">
                    <div className="g_visual_background" />
                    <FillImage
                      src="/villa/villa-balcony-path.jpg"
                      alt=""
                      className="g_visual_img"
                      sizes="25vw"
                    />
                  </figure>
                </div>
              </div>
            </div>
            <p className="sticky-caption">Scroll to move through a day at Riverwood</p>
          </div>
        </div>
      </section>

      <section
        id="stay"
        className="projects-section rv-rebuilt"
        data-theme="light"
        data-bg="#f6f5f1"
        data-chapter="03"
        aria-labelledby="stay-title"
      >
        <div className="projects-header">
          <span className="jp">The stay</span>
          <div>
            <h2 id="stay-title">Spaces that feel <em>open, quiet, and deeply personal.</em></h2>
            <p>
              Each part of the villa has its own pace—from the privacy of the bedrooms to
              the sociable ease of the terrace.
            </p>
          </div>
        </div>

        <div className="home_project_list">
          {stayChapters.map((chapter) => (
            <article className="home_project_item" key={chapter.number}>
              <span className="home_project_bignum" aria-hidden="true">{chapter.number}</span>
              <figure className="g_visual_wrap" data-cursor="view space">
                <div className="g_visual_background" />
                <FillImage
                  src={chapter.image}
                  alt={chapter.alt}
                  className="g_visual_img"
                  sizes="(max-width: 980px) 100vw, 50vw"
                />
              </figure>
              <div className="home_project_content">
                <div className="home_project_info">
                  <span className="jp">{chapter.eyebrow}</span>
                  <div className="home_project_title">
                    <h3>{chapter.title}</h3>
                  </div>
                </div>
                <div className="home_project_right">
                  <div className="home_project_num">
                    <div>{chapter.number}</div><div>/ 03</div>
                  </div>
                  <p className="home_project_copy">{chapter.copy}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="river"
        className="home_sustain rv-rebuilt"
        data-theme="light"
        data-bg="#e7eae5"
        data-chapter="04"
        aria-labelledby="river-title"
      >
        <div className="sustain_container">
          <div className="h_sustain_col-img">
            <div className="intro_img">
              <figure className="g_visual_wrap" data-cursor="river view">
                <div className="g_visual_background" />
                <FillImage
                  src="/villa/villa-exterior-side-sunset.jpg"
                  alt="Riverwood Villa beside the river at sunset"
                  className="g_visual_img"
                  sizes="(max-width: 980px) 100vw, 42vw"
                />
              </figure>
            </div>
          </div>

          <div className="h_sustain_col-l">
            <span className="h_sustain_watermark" aria-hidden="true">R</span>
            <div className="h_sustain_kanji_wrap">
              <span className="jp">At the water&apos;s edge</span>
              <div className="kanji_content">
                <span className="kanji_title">A living landscape</span>
              </div>
            </div>
            <div className="h_sustain_head">
              <h2 id="river-title" className="g_heading">
                Follow the <em>river</em> from first light to dusk.
              </h2>
            </div>
          </div>

          <div className="h_sustain_col-r">
            <div className="sustain_img_small">
              <figure className="g_visual_wrap" data-cursor="wildlife">
                <div className="g_visual_background" />
                <FillImage
                  src="/villa/villa-crocodile.webp"
                  alt="Wildlife seen near the river"
                  className="g_visual_img"
                  sizes="(max-width: 980px) 100vw, 25vw"
                />
              </figure>
            </div>
            <div className="sustain_content_wrap">
              <div className="sustain_content_p">
                <p>
                  The river is not a backdrop here—it shapes the whole stay. Watch boats pass,
                  listen for birds, notice the changing sky, and let each hour arrive without hurry.
                </p>
              </div>
              <a href="#gallery" className="text-button" data-magnetic>
                See the landscape <ArrowDownRight size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="line_wrapper"><div className="drawn-line" /></div>
      </section>

      <section
        id="dining"
        className="service-section rv-rebuilt"
        data-theme="light"
        data-bg="#f6f5f1"
        data-chapter="05"
        aria-labelledby="dining-title"
      >
        <div>
          <span className="jp">Hosted moments</span>
          <p>Simple pleasures, thoughtfully arranged.</p>
        </div>
        <h2 id="dining-title" className="service-type">
          <span data-skew>Stay</span>
          <span aria-hidden="true">·</span>
          <span data-skew>Eat</span>
          <figure className="service-img" data-cursor="taste">
            <FillImage
              src="/villa/villa-outdoor-restaurant.webp"
              alt="Outdoor dining at Riverwood Villa"
              sizes="(max-width: 980px) 80vw, 28vw"
            />
          </figure>
          <span data-skew>Drift</span>
        </h2>
        <p>
          Begin with breakfast on the balcony, share a long meal on the terrace, then follow
          the last light toward the water. Riverwood is designed around the pleasure of not rushing.
        </p>
        <a className="text-button" href="#book" data-magnetic>
          Plan your stay <ArrowDownRight size={16} />
        </a>
      </section>

      <section
        id="gallery"
        className="gallery-section rv-rebuilt"
        data-theme="light"
        data-bg="#efede7"
        data-chapter="06"
        aria-labelledby="gallery-title"
      >
        <div className="gallery-heading">
          <span className="jp">A visual journal</span>
          <h2 id="gallery-title">Scenes from a <em>slower kind of day.</em></h2>
        </div>
        <div className="gallery-grid">
          {galleryItems.map((item) => (
            <figure className="gallery-item" key={item.index} data-cursor="open">
              <FillImage
                src={item.image}
                alt={item.alt}
                sizes="(max-width: 980px) 100vw, 33vw"
              />
              <figcaption><strong>{item.title}</strong><span>{item.index}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        className="quote-section rv-rebuilt"
        data-theme="light"
        data-bg="#e7eae5"
        data-chapter="06"
        aria-label="Riverwood Villa philosophy"
      >
        <div className="rv-card">
          <p>
            The best luxury is not more noise. It is more sky, more water, more room to be together.
          </p>
          <span className="quote-author">The Riverwood philosophy</span>
        </div>
        <figure className="quote-img" data-cursor="pause">
          <FillImage
            src="/villa/villa-balcony-chair.webp"
            alt="A quiet chair on the Riverwood Villa balcony"
            sizes="(max-width: 980px) 100vw, 34vw"
          />
        </figure>
      </section>

      <section
        id="book"
        className="cta-section rv-rebuilt"
        data-theme="light"
        data-bg="#f6f5f1"
        data-chapter="07"
        aria-labelledby="book-title"
      >
        <figure className="cta-small" data-cursor="arrive">
          <FillImage
            src="/villa/villa-starlink.webp"
            alt="Open sky above Riverwood Villa"
            sizes="(max-width: 980px) 38vw, 16vw"
          />
        </figure>
        <div className="cta-copy">
          <span className="jp">Your riverside escape</span>
          <h2 id="book-title">Come <em>stay</em> by the river.</h2>
          <p>
            Tell us your dates, group size, and the kind of stay you are imagining. We will help
            shape a relaxed Riverwood experience around you.
          </p>
          <a
            className="dark-button"
            href="mailto:hello@riverwoodvilla.com?subject=Riverwood%20Villa%20booking%20enquiry"
            data-magnetic
          >
            Start a booking <ArrowUpRight size={16} />
          </a>
        </div>
        <figure className="cta-large" data-cursor="riverwood">
          <FillImage
            src="/villa/villa-hero.webp"
            alt="Aerial view of Riverwood Villa and the surrounding river landscape"
            sizes="(max-width: 980px) 100vw, 34vw"
          />
        </figure>
      </section>

      <footer className="footer" data-theme="light" data-bg="#efede7">
        <nav aria-label="Footer navigation">
          {navItems.slice(0, 6).map(([label, href], index) => (
            <a href={href} key={href}><span>0{index + 1}</span>{label}</a>
          ))}
        </nav>
        <div className="footer-main">
          <h2>Riverwood</h2>
          <div className="footer-info">
            <div>
              <p>Enquiries</p>
              <a href="mailto:hello@riverwoodvilla.com">hello@riverwoodvilla.com</a>
              <a href="tel:+94770000000">+94 77 000 0000</a>
            </div>
            <div>
              <p>Location</p>
              <span>Riverside Road<br />Sri Lanka</span>
            </div>
            <div>
              <p>Follow</p>
              <div className="socials">
                <a href="#" aria-label="Riverwood Villa on Instagram">Instagram</a>
                <a href="#" aria-label="Riverwood Villa on Facebook">Facebook</a>
              </div>
            </div>
            <div>
              <p>Stay</p>
              <a href="#book">Booking enquiry <ArrowUpRight size={14} /></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Riverwood Villa</span>
          <span>Private riverside boutique stay · Sri Lanka</span>
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
