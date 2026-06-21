"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

const navItems = [
  ["Home", "#home"],
  ["About", "#about"],
  ["Project", "#project"],
  ["Sustainability", "#sustainability"],
  ["Service", "#service"],
  ["Journal", "#journal"],
  ["Contact", "#contact"],
];

const projectSlides = [
  {
    title: "Riverside Arrival",
    number: "1",
    image: "/villa/villa-exterior-front.jpg",
    copy: "The stay begins with the white villa, shaded palms, and a threshold that immediately slows the day down.",
  },
  {
    title: "Balcony Rituals",
    number: "2",
    image: "/villa/villa-balcony-chairs-river.webp",
    copy: "Open balconies, warm rooms, and river views shape mornings that feel private, easy, and quietly cinematic.",
  },
  {
    title: "Hosted Dining",
    number: "3",
    image: "/villa/villa-terrace-dining.webp",
    copy: "Meals, tea, and local support can be shaped around the rhythm of your group without making the villa feel formal.",
  },
];

const journalImages = [
  ["/villa/villa-exterior-night.jpg", "Warm facade after dark"],
  ["/villa/villa-balcony-table.jpg", "Tea above the palms"],
  ["/villa/villa-bedroom-high-ceiling.jpg", "High ceiling rest"],
  ["/villa/villa-peacocks-veranda.jpg", "Veranda life"],
  ["/villa/villa-boat-sunset.webp", "Sunset boat route"],
  ["/villa/villa-hero.webp", "The riverwood view"],
];

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
            document.querySelectorAll<HTMLElement>(".gallery-item").forEach((el) => {
              el.style.opacity = "1";
              el.style.transform = "";
            });
            document.querySelectorAll<HTMLElement>(".reveal-img").forEach((el) => {
              el.style.clipPath = "inset(0 0% 0 0)";
            });
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

        document.addEventListener("click", clickHandler);

        // ─── Custom cursor (desktop / hover-capable only) ────────────────
        const cursorDot = document.querySelector<HTMLElement>(".cursor-dot");
        const cursorRing = document.querySelector<HTMLElement>(".cursor-ring");

        if (cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches) {
          const xRing = gsap.quickTo(cursorRing, "x", { duration: 0.5, ease: "power3.out" });
          const yRing = gsap.quickTo(cursorRing, "y", { duration: 0.5, ease: "power3.out" });

          window.addEventListener("pointermove", (e: PointerEvent) => {
            gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
            xRing(e.clientX);
            yRing(e.clientY);
          });

          document.querySelectorAll("a, button, .gallery-item, .home_project_item").forEach((el) => {
            el.addEventListener("pointerenter", () => cursorRing.classList.add("is-hover"));
            el.addEventListener("pointerleave", () => cursorRing.classList.remove("is-hover"));
          });
        }

        // ─── Velocity skew ──────────────────────────────────────────────
        const skewSetter = gsap.quickSetter("[data-skew]", "skewY", "deg") as (v: number) => void;
        const clampSkew = gsap.utils.clamp(-5, 5);
        let currentSkew = 0;

        lenis.on("scroll", ({ velocity }: { velocity: number }) => {
          currentSkew = clampSkew(velocity * -0.35);
          skewSetter(currentSkew);
        });

        gsap.ticker.add(() => {
          currentSkew *= 0.88;
          skewSetter(currentSkew);
        });

        // ─── Magnetic buttons ────────────────────────────────────────────
        document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
          const strength = Number(el.dataset.magnetic ?? "0.38");
          el.addEventListener("pointermove", (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            gsap.to(el, {
              x: (e.clientX - (r.left + r.width / 2)) * strength,
              y: (e.clientY - (r.top + r.height / 2)) * strength,
              duration: 0.55,
              ease: "power3.out",
            });
          });
          el.addEventListener("pointerleave", () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.55, ease: "power3.out" });
          });
        });

        // ─── Helper: mask-reveal words ──────────────────────────────────
        function maskRevealWords(
          el: HTMLElement,
          trigger: HTMLElement | null,
          startPos = "top 86%",
          staggerVal = 0.028,
          dur = 1.15
        ) {
          const text = el.innerText;
          el.innerHTML = "";
          text.split(" ").forEach((word) => {
            if (!word.trim()) return;
            const outer = document.createElement("span");
            outer.style.display = "inline-block";
            outer.style.overflow = "hidden";
            outer.style.verticalAlign = "top";
            const inner = document.createElement("span");
            inner.style.display = "inline-block";
            inner.innerText = word + "\u00A0";
            outer.appendChild(inner);
            el.appendChild(outer);
          });
          gsap.fromTo(
            el.querySelectorAll<HTMLElement>("span > span"),
            { yPercent: 110 },
            {
              yPercent: 0,
              duration: dur,
              stagger: { each: staggerVal, ease: "power4.out" },
              ease: "power4.out",
              scrollTrigger: { trigger: trigger ?? el, start: startPos },
            }
          );
        }

        // ─── Helper: clip-path image reveal ────────────────────────────
        function clipRevealImg(frame: HTMLElement, trigger: HTMLElement | null, startPos = "top 87%") {
          gsap.set(frame, { clipPath: "inset(0 100% 0 0)" });
          gsap.to(frame, {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.3,
            ease: "power4.inOut",
            scrollTrigger: { trigger: trigger ?? frame, start: startPos, once: true },
          });
          const innerImg = frame.querySelector<HTMLElement>("img");
          if (innerImg) {
            gsap.fromTo(
              innerImg,
              { scale: 1.18 },
              {
                scale: 1,
                duration: 1.35,
                ease: "power3.out",
                scrollTrigger: { trigger: trigger ?? frame, start: startPos },
              }
            );
            gsap.to(innerImg, {
              yPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: frame.closest("section") ?? frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }
        }

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

          // ─── Nav theme switching ──────────────────────────────────────
          gsap.utils.toArray<HTMLElement>("section, footer").forEach((section) => {
            const setNavTheme = () => {
              const isDark = section.dataset.theme === "dark";
              document.querySelector(".site-nav")?.classList.toggle("is-light", !isDark);
            };
            ScrollTrigger.create({
              trigger: section,
              start: "top top+=8",
              end: "bottom top+=8",
              onEnter: setNavTheme,
              onEnterBack: setNavTheme,
            });
          });

          // ═══ SECTION 2 — INTRO / ABOUT ═══════════════════════════════

          const introSection = document.querySelector<HTMLElement>(".intro-section");

          gsap.utils.toArray<HTMLElement>(".intro-section [data-anim='intro-title']").forEach((el) => {
            gsap.fromTo(el, { yPercent: 115 }, {
              yPercent: 0, duration: 1.25, ease: "power4.out",
              scrollTrigger: { trigger: el.parentElement, start: "top 90%" },
            });
          });

          const introH2 = document.querySelector<HTMLElement>(".intro-left h2");
          if (introH2) maskRevealWords(introH2, introSection, "top 82%", 0.032, 1.2);

          gsap.utils.toArray<HTMLElement>(".intro-section [data-anim='intro-para']").forEach((el) => {
            if (el.tagName.toLowerCase() === "h2") return;
            const text = el.innerText;
            el.innerHTML = "";
            text.split(" ").forEach((word) => {
              if (!word.trim()) return;
              const outer = document.createElement("span");
              outer.style.display = "inline-block";
              outer.style.overflow = "hidden";
              outer.style.verticalAlign = "top";
              const inner = document.createElement("span");
              inner.style.display = "inline-block";
              inner.innerText = word + "\u00A0";
              inner.classList.add("intro-word-inner");
              outer.appendChild(inner);
              el.appendChild(outer);
            });
            gsap.fromTo(
              el.querySelectorAll(".intro-word-inner"),
              { yPercent: 108 },
              {
                yPercent: 0, duration: 1.1,
                stagger: { each: 0.026, ease: "power4.out" },
                ease: "power4.out",
                scrollTrigger: { trigger: el.closest("section") ?? el, start: "top 80%" },
              }
            );
          });

          const introBtn = introSection?.querySelector<HTMLElement>("[data-anim='fade-in']");
          if (introBtn) {
            gsap.fromTo(introBtn, { autoAlpha: 0, y: 16 }, {
              autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out",
              scrollTrigger: { trigger: introBtn, start: "top 90%" },
            });
          }

          gsap.utils.toArray<HTMLElement>("[data-anim='intro-whipe']").forEach((whipe) => {
            const figure = whipe.closest("figure");
            if (!figure) return;
            gsap.set(whipe, { width: "100%", transformOrigin: "right center" });
            gsap.to(whipe, {
              width: "0%",
              duration: 1.5,
              ease: "power4.inOut",
              scrollTrigger: { trigger: figure.parentElement, start: "top 88%", once: true },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-anim='intro-parallax']").forEach((img) => {
            gsap.set(img, { scale: 1.22 });
            gsap.to(img, {
              yPercent: 12, ease: "none",
              scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            });
          });

          gsap.utils.toArray<HTMLElement>("[data-anim='intro-line'], .section-divider[data-anim='intro-line']").forEach((line) => {
            gsap.fromTo(line, { scaleX: 0, transformOrigin: "left center" }, {
              scaleX: 1, duration: 1.8, ease: "power3.inOut",
              scrollTrigger: { trigger: line, start: "top 95%" },
            });
          });

          // ═══ SECTION 3 — STICKY SCROLL ═══════════════════════════════

          gsap.utils.toArray<HTMLElement>("[data-big-text='head']").forEach((el) => {
            const text = el.innerText;
            el.innerHTML = "";
            text.split(" ").forEach((word, wordIndex, arr) => {
              const wordWrapper = document.createElement("span");
              wordWrapper.style.display = "inline-block";
              wordWrapper.style.whiteSpace = "nowrap";
              wordWrapper.classList.add("film-word");
              wordWrapper.innerText = word;
              el.appendChild(wordWrapper);
              if (wordIndex < arr.length - 1) {
                const space = document.createElement("span");
                space.innerHTML = "&nbsp;";
                space.style.display = "inline-block";
                el.appendChild(space);
              }
            });
          });

          const scrollTriggerEl = document.querySelector<HTMLElement>("[data-big-text='trigger']");
          const filmWords = document.querySelectorAll<HTMLElement>(".film-word");
          const imgTrack = document.querySelector<HTMLElement>(".big_img_track");
          const parallaxImgs = document.querySelectorAll<HTMLElement>("[data-scroll-parallax='true'] img");

          if (scrollTriggerEl && filmWords.length > 0 && imgTrack) {
            gsap.set(filmWords, { yPercent: 112, autoAlpha: 0 });
            gsap.set(imgTrack, { yPercent: 28 });

            const stickyTl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: scrollTriggerEl, scrub: true, start: "top top", end: "bottom bottom" },
            });

            stickyTl
              .to(filmWords, { yPercent: 0, autoAlpha: 1, stagger: 0.08, duration: 0.22 }, 0)
              .to("[data-big-text='wrapper']", { yPercent: -10, autoAlpha: 0.72, duration: 0.55 }, 0.35)
              .to(imgTrack, { yPercent: -54, duration: 1 }, 0);

            parallaxImgs.forEach((img) => {
              gsap.fromTo(img, { scale: 1.14, yPercent: -6 }, {
                scale: 1, yPercent: 9, ease: "none",
                scrollTrigger: {
                  trigger: img.closest(".g_visual_wrap") ?? img,
                  scrub: true, start: "top bottom", end: "bottom top",
                },
              });
            });

            gsap.utils.toArray<HTMLElement>(".big_img_col").forEach((col, i) => {
              gsap.fromTo(col, { autoAlpha: 0, rotateX: 12, y: 44, transformPerspective: 900 }, {
                autoAlpha: 1, rotateX: 0, y: 0, duration: 1.1, ease: "power4.out", delay: i * 0.06,
                scrollTrigger: { trigger: imgTrack, start: "top 92%" },
              });
            });
          }

          // ═══ SECTION 4 — PROJECTS (LIGHT THEME GRID) ═════════════════

          gsap.utils.toArray<HTMLElement>(".home_project_item").forEach((item) => {
            const imgWrap = item.querySelector<HTMLElement>("[data-anim='project-img']");
            const title = item.querySelector<HTMLElement>(".home_project_title h3");
            const jp = item.querySelector<HTMLElement>(".home_project_info .jp");
            const copy = item.querySelector<HTMLElement>(".home_project_copy");
            const numDivs = item.querySelectorAll<HTMLElement>(".home_project_num > div");
            const btn = item.querySelector<HTMLElement>(".home_project_right [data-anim='fade-in']");

            const projTl = gsap.timeline({
              scrollTrigger: { trigger: item, start: "top 82%", once: true },
            });

            if (imgWrap) {
              gsap.set(imgWrap, { clipPath: "inset(0 100% 0 0)" });
              projTl.to(imgWrap, {
                clipPath: "inset(0 0% 0 0)",
                duration: 1.3,
                ease: "power4.inOut",
              }, 0);
              const innerImg = imgWrap.querySelector<HTMLElement>("img");
              if (innerImg) {
                projTl.fromTo(innerImg, { scale: 1.18 }, {
                  scale: 1, duration: 1.35, ease: "power3.out",
                }, 0);
              }
            }

            if (jp) {
              projTl.fromTo(jp, { autoAlpha: 0, yPercent: 115 }, {
                autoAlpha: 1, yPercent: 0, duration: 1.0, ease: "power4.out",
              }, 0.2);
            }

            if (title) {
              const words = title.innerText.split(" ");
              title.innerHTML = "";
              words.forEach((word) => {
                const outer = document.createElement("span");
                outer.style.display = "inline-block";
                outer.style.overflow = "hidden";
                outer.style.verticalAlign = "top";
                const inner = document.createElement("span");
                inner.style.display = "inline-block";
                inner.innerText = word + "\u00A0";
                outer.appendChild(inner);
                title.appendChild(outer);
              });
              projTl.fromTo(
                title.querySelectorAll<HTMLElement>("span > span"),
                { yPercent: 110 },
                { yPercent: 0, duration: 1.2, ease: "power4.out", stagger: 0.05 },
                0.3
              );
            }

            if (copy) {
              const text = copy.innerText;
              copy.innerHTML = "";
              text.split(" ").forEach((word) => {
                if (!word.trim()) return;
                const outer = document.createElement("span");
                outer.style.display = "inline-block";
                outer.style.overflow = "hidden";
                outer.style.verticalAlign = "top";
                const inner = document.createElement("span");
                inner.style.display = "inline-block";
                inner.innerText = word + "\u00A0";
                outer.appendChild(inner);
                copy.appendChild(outer);
              });
              projTl.fromTo(
                copy.querySelectorAll<HTMLElement>("span > span"),
                { yPercent: 108 },
                {
                  yPercent: 0, duration: 1.05,
                  stagger: { each: 0.022, ease: "power4.out" },
                  ease: "power4.out",
                },
                0.45
              );
            }

            if (numDivs.length) {
              projTl.fromTo(numDivs, { yPercent: 90, autoAlpha: 0 }, {
                yPercent: 0, autoAlpha: 1, duration: 1.0, ease: "power4.out", stagger: 0.08,
              }, 0.5);
            }

            if (btn) {
              projTl.fromTo(btn, { autoAlpha: 0, y: 16 }, {
                autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
              }, 0.6);
            }

            const bgImg = item.querySelector<HTMLElement>(".g_visual_img");
            if (bgImg) {
              gsap.to(bgImg, {
                yPercent: 10,
                ease: "none",
                scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
              });
            }
          });

          // ═══ SECTION 5 — SUSTAINABILITY ════════════════════════════════

          const sustainSection = document.querySelector<HTMLElement>(".home_sustain");

          const sustainH2 = document.querySelector<HTMLElement>(".g_heading");
          if (sustainH2) maskRevealWords(sustainH2, sustainSection, "top 84%", 0.03, 1.2);

          gsap.utils.toArray<HTMLElement>(".home_sustain [data-anim='intro-title']").forEach((el) => {
            gsap.fromTo(el, { yPercent: 115 }, {
              yPercent: 0, duration: 1.2, ease: "power4.out",
              scrollTrigger: { trigger: el.parentElement, start: "top 90%" },
            });
          });

          const sustainKanji = sustainSection?.querySelector<HTMLElement>(".h_sustain_kanji_wrap [data-anim='fade-in']");
          if (sustainKanji) {
            gsap.fromTo(sustainKanji, { autoAlpha: 0, y: 16 }, {
              autoAlpha: 1, y: 0, duration: 1.0, ease: "power3.out",
              scrollTrigger: { trigger: sustainKanji, start: "top 90%" },
            });
          }

          const sustainPara = document.querySelector<HTMLElement>(".sustain_content_p p");
          if (sustainPara) {
            const words = sustainPara.innerText.split(" ");
            sustainPara.innerHTML = "";
            words.forEach((word) => {
              if (!word.trim()) return;
              const outer = document.createElement("span");
              outer.style.display = "inline-block";
              outer.style.overflow = "hidden";
              outer.style.verticalAlign = "top";
              const inner = document.createElement("span");
              inner.style.display = "inline-block";
              inner.innerText = word + "\u00A0";
              outer.appendChild(inner);
              sustainPara.appendChild(outer);
            });
            gsap.fromTo(
              sustainPara.querySelectorAll<HTMLElement>("span > span"),
              { yPercent: 108 },
              {
                yPercent: 0, duration: 1.05,
                stagger: { each: 0.022, ease: "power4.out" },
                ease: "power4.out",
                scrollTrigger: { trigger: sustainSection, start: "top 80%" },
              }
            );
          }

          const sustainBtn = sustainSection?.querySelector<HTMLElement>(".sustain_content_wrap [data-anim='fade-in']");
          if (sustainBtn) {
            gsap.fromTo(sustainBtn, { autoAlpha: 0, y: 14 }, {
              autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: sustainBtn, start: "top 88%" },
            });
          }

          // Sustainability images — clip-path reveals
          gsap.utils.toArray<HTMLElement>(".home_sustain .reveal-img").forEach((frame) => {
            clipRevealImg(frame, sustainSection, "top 86%");
          });

          // ═══ SECTION 6 — SERVICE (LIGHT THEME) ═══════════════════════

          const serviceSection = document.querySelector<HTMLElement>(".service-section");

          const serviceJp = serviceSection?.querySelector<HTMLElement>(".jp[data-anim='intro-title']");
          if (serviceJp) {
            gsap.fromTo(serviceJp, { yPercent: 115 }, {
              yPercent: 0, duration: 1.25, ease: "power4.out",
              scrollTrigger: { trigger: serviceJp.parentElement, start: "top 90%" },
            });
          }

          const serviceLabel = serviceSection?.querySelector<HTMLElement>(":scope > div:first-child p");
          if (serviceLabel) {
            gsap.fromTo(serviceLabel, { yPercent: 115 }, {
              yPercent: 0, duration: 1.25, ease: "power4.out",
              scrollTrigger: { trigger: serviceLabel.parentElement, start: "top 90%" },
            });
          }

          const serviceTypeEl = document.querySelector<HTMLElement>(".service-type");
          if (serviceTypeEl) {
            const directSpans = serviceTypeEl.querySelectorAll<HTMLElement>("[data-anim='service-word']");
            if (directSpans.length) {
              directSpans.forEach((span) => {
                const outer = document.createElement("span");
                outer.style.display = "inline-block";
                outer.style.overflow = "hidden";
                outer.style.verticalAlign = "top";
                const inner = document.createElement("span");
                inner.style.display = "inline-block";
                inner.innerText = span.innerText;
                inner.style.willChange = "transform";
                outer.appendChild(inner);
                span.innerHTML = "";
                span.appendChild(outer);
              });
              gsap.fromTo(
                serviceTypeEl.querySelectorAll<HTMLElement>("[data-anim='service-word'] span > span"),
                { yPercent: 110, rotateX: 8 },
                {
                  yPercent: 0, rotateX: 0, duration: 1.15, ease: "power4.out",
                  stagger: 0.07,
                  scrollTrigger: { trigger: serviceTypeEl, start: "top 84%" },
                }
              );
            }

            const serviceImg = serviceTypeEl.querySelector<HTMLElement>(".service-img");
            if (serviceImg) clipRevealImg(serviceImg, serviceTypeEl, "top 84%");
          }

          const servicePara = serviceSection?.querySelector<HTMLElement>(":scope > p[data-anim='intro-para']");
          if (servicePara) {
            const text = servicePara.innerText;
            servicePara.innerHTML = "";
            text.split(" ").forEach((word) => {
              if (!word.trim()) return;
              const outer = document.createElement("span");
              outer.style.display = "inline-block";
              outer.style.overflow = "hidden";
              outer.style.verticalAlign = "top";
              const inner = document.createElement("span");
              inner.style.display = "inline-block";
              inner.innerText = word + "\u00A0";
              outer.appendChild(inner);
              servicePara.appendChild(outer);
            });
            gsap.fromTo(
              servicePara.querySelectorAll<HTMLElement>("span > span"),
              { yPercent: 108 },
              {
                yPercent: 0, duration: 1.05,
                stagger: { each: 0.024, ease: "power4.out" },
                ease: "power4.out",
                scrollTrigger: { trigger: servicePara, start: "top 88%" },
              }
            );
          }

          const serviceLink = serviceSection?.querySelector<HTMLElement>("[data-anim='fade-in']");
          if (serviceLink) {
            gsap.fromTo(serviceLink, { autoAlpha: 0, y: 14 }, {
              autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: serviceLink, start: "top 90%" },
            });
          }

          // ═══ SECTION 7 — GALLERY ════════════════════════════════════════

          const galleryH2 = document.querySelector<HTMLElement>(".gallery-heading h2");
          if (galleryH2) maskRevealWords(galleryH2, null, "top 85%", 0.03, 1.15);

          const galleryJp = document.querySelector<HTMLElement>(".gallery-heading .jp");
          if (galleryJp) {
            gsap.fromTo(galleryJp, { yPercent: 115 }, {
              yPercent: 0, duration: 1.0, ease: "power4.out",
              scrollTrigger: { trigger: galleryJp.parentElement, start: "top 90%" },
            });
          }

          gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((item, i) => {
            const isOffset = (i === 1 || i === 4);
            if (isOffset) gsap.set(item, { y: "5rem" });

            gsap.set(item, { clipPath: "inset(0 100% 0 0)" });
            gsap.to(item, {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.3,
              ease: "power4.inOut",
              scrollTrigger: { trigger: item, start: "top 91%", once: true },
            });

            const fig = item.querySelector<HTMLElement>("img");
            if (fig) {
              gsap.fromTo(fig, { scale: 1.12 }, {
                scale: 1, ease: "none",
                scrollTrigger: {
                  trigger: item, start: "top bottom", end: "bottom top", scrub: true,
                },
              });
            }
          });

          // ═══ SECTION 8 — QUOTE (LIGHT THEME) ════════════════════════════

          const quoteSection = document.querySelector<HTMLElement>(".quote-section");

          const quoteJp = document.querySelector<HTMLElement>(".quote-section .jp");
          if (quoteJp) {
            gsap.fromTo(quoteJp, { yPercent: 115 }, {
              yPercent: 0, duration: 1.0, ease: "power4.out",
              scrollTrigger: { trigger: quoteJp.parentElement, start: "top 90%" },
            });
          }

          const quoteP = document.querySelector<HTMLElement>(".quote-section p");
          if (quoteP) {
            const text = quoteP.innerText.trim();
            quoteP.innerHTML = "";
            const sentences = text.split(/(?<=[.!?,])\s+|(?<=\w{4,})\s+(?=[A-Z])/g);
            const chunks = sentences.length > 1 ? sentences : text.split(" ").reduce<string[]>((acc, word, i) => {
              const chunkIdx = Math.floor(i / 4);
              acc[chunkIdx] = (acc[chunkIdx] ? acc[chunkIdx] + " " : "") + word;
              return acc;
            }, []);

            chunks.forEach((chunk) => {
              const outer = document.createElement("span");
              outer.style.display = "block";
              outer.style.overflow = "clip";
              const inner = document.createElement("span");
              inner.style.display = "block";
              inner.innerText = chunk;
              outer.appendChild(inner);
              quoteP.appendChild(outer);
            });

            gsap.fromTo(
              quoteP.querySelectorAll<HTMLElement>("span > span"),
              { yPercent: 105 },
              {
                yPercent: 0, duration: 1.15, stagger: 0.1, ease: "power4.out",
                scrollTrigger: { trigger: quoteSection, start: "top 78%" },
              }
            );
          }

          const quoteImg = document.querySelector<HTMLElement>(".quote-img");
          if (quoteImg) clipRevealImg(quoteImg, quoteSection, "top 84%");

          // ═══ SECTION 9 — CTA (LIGHT THEME) ══════════════════════════════

          const ctaH2 = document.querySelector<HTMLElement>(".cta-copy h2");
          if (ctaH2) maskRevealWords(ctaH2, null, "top 82%", 0.04, 1.3);

          const ctaJp = document.querySelector<HTMLElement>(".cta-copy .jp");
          if (ctaJp) {
            gsap.fromTo(ctaJp, { yPercent: 115 }, {
              yPercent: 0, duration: 1.0, ease: "power4.out",
              scrollTrigger: { trigger: ctaJp.parentElement, start: "top 90%" },
            });
          }

          const ctaPara = document.querySelector<HTMLElement>(".cta-copy p[data-anim='intro-para']");
          if (ctaPara) {
            const text = ctaPara.innerText;
            ctaPara.innerHTML = "";
            text.split(" ").forEach((word) => {
              if (!word.trim()) return;
              const outer = document.createElement("span");
              outer.style.display = "inline-block";
              outer.style.overflow = "hidden";
              outer.style.verticalAlign = "top";
              const inner = document.createElement("span");
              inner.style.display = "inline-block";
              inner.innerText = word + "\u00A0";
              outer.appendChild(inner);
              ctaPara.appendChild(outer);
            });
            gsap.fromTo(
              ctaPara.querySelectorAll<HTMLElement>("span > span"),
              { yPercent: 108 },
              {
                yPercent: 0, duration: 1.05,
                stagger: { each: 0.024, ease: "power4.out" },
                ease: "power4.out",
                scrollTrigger: { trigger: ctaPara, start: "top 88%" },
              }
            );
          }

          const ctaBtn = document.querySelector<HTMLElement>(".cta-copy [data-anim='fade-in']");
          if (ctaBtn) {
            gsap.fromTo(ctaBtn, { autoAlpha: 0, y: 16 }, {
              autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out",
              scrollTrigger: { trigger: ctaBtn, start: "top 90%" },
            });
          }

          const ctaSmall = document.querySelector<HTMLElement>(".cta-small");
          const ctaLarge = document.querySelector<HTMLElement>(".cta-large");
          if (ctaSmall) clipRevealImg(ctaSmall, null, "top 86%");
          if (ctaLarge) {
            clipRevealImg(ctaLarge, null, "top 88%");
            const ctaLargeImg = ctaLarge.querySelector<HTMLElement>("img");
            if (ctaLargeImg) {
              gsap.fromTo(ctaLargeImg, { scale: 1.18 }, {
                scale: 1.0, ease: "none",
                scrollTrigger: { trigger: ctaLarge, start: "top bottom", end: "bottom top", scrub: true },
              });
            }
          }

          // ═══ SECTION 10 — FOOTER ════════════════════════════════════════

          const footerH2 = document.querySelector<HTMLElement>(".footer-main h2");
          if (footerH2) maskRevealWords(footerH2, null, "top 88%", 0.04, 1.4);

          const footerNavLinks = document.querySelectorAll<HTMLElement>(".footer > nav a");
          if (footerNavLinks.length) {
            gsap.fromTo(footerNavLinks, { autoAlpha: 0, y: 20 }, {
              autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.05,
              scrollTrigger: { trigger: ".footer > nav", start: "top 92%" },
            });
          }

          const footerInfo = document.querySelectorAll<HTMLElement>(".footer-info > div");
          if (footerInfo.length) {
            gsap.fromTo(footerInfo, { autoAlpha: 0, y: 16 }, {
              autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.07,
              scrollTrigger: { trigger: ".footer-info", start: "top 92%" },
            });
          }

          const footerBottom = document.querySelector<HTMLElement>(".footer-bottom");
          if (footerBottom) {
            gsap.fromTo(footerBottom, { autoAlpha: 0 }, {
              autoAlpha: 1, duration: 1.0, ease: "sine.out",
              scrollTrigger: { trigger: footerBottom, start: "top 98%" },
            });
          }

        });

        cleanup = () => {
          document.removeEventListener("click", clickHandler);
          context.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      } catch {
        if (alive) {
          settleHeroReveal();
          setShowLoader(false);
          document.querySelectorAll<HTMLElement>(".gallery-item").forEach((el) => {
            el.style.opacity = "1";
          });
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

      <section id="about" className="intro-section" data-theme="light">
        <div className="intro-left">
          <div className="intro-jp-wrap">
            <div className="intro-jp-inner"><span className="jp" data-anim="intro-title">(river air)</span></div>
            <div className="intro-jp-inner"><p data-anim="intro-title">Riverside</p></div>
          </div>
          <h2 data-anim="intro-para">A private villa wrapped in river air.</h2>
        </div>
        <div className="intro-image-wrap">
          <figure className="intro-image">
            <div className="img-bg"></div>
            <Image
              src="/villa/villa-exterior-side-river.jpg"
              alt="Riverwood Villa exterior by the river"
              fill
              sizes="(min-width: 900px) 40vw, 100vw"
              data-anim="intro-parallax"
            />
            <div className="whipe" data-anim="intro-whipe"></div>
          </figure>
        </div>
        <div className="intro-right">
          <div className="intro-content-wrap">
            <p data-anim="intro-para">
              Riverwood keeps the first impression simple: open space, quiet
              greenery, and a warm threshold into a slower kind of stay.
            </p>
            <div data-anim="fade-in">
              <a className="text-button" href="#contact">
                About Us <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
          <div className="intro-small-wrap">
            <figure className="intro-small">
              <div className="img-bg"></div>
              <Image
                src="/villa/villa-balcony-path.jpg"
                alt="Balcony path at Riverwood Villa"
                fill
                sizes="16rem"
                data-anim="intro-parallax"
              />
              <div className="whipe" data-anim="intro-whipe"></div>
            </figure>
          </div>
        </div>
        <div className="intro-line" data-anim="intro-line"></div>
      </section>

      <section className="scroll_section" data-theme="light">
        <div className="sticky_scroll_trigger" data-big-text="trigger">
          <div className="sticky_track">
            <div className="sticky_elements">
              <div className="big_txt_container">
                 <div className="big_txt_row">
                    <span className="big_txt" data-big-text="wrapper">
                      <div data-big-text="head">Balcony Mornings</div>
                    </span>
                 </div>
                 <div className="big_txt_row">
                    <span className="big_txt" data-big-text="wrapper">
                      <div data-big-text="head">River Light</div>
                    </span>
                 </div>
              </div>
            </div>
            <div className="big_img_track">
               <div className="big_img_grid">
                 <div className="big_img_col">
                    <figure className="g_visual_wrap" data-scroll-parallax="true">
                      <div className="g_visual_background"></div>
                      <Image src="/villa/villa-balcony-table.jpg" alt="Balcony" fill sizes="33vw" data-parallax="true" className="g_visual_img" />
                    </figure>
                 </div>
                 <div className="big_img_col">
                    <figure className="g_visual_wrap" data-scroll-parallax="true">
                      <div className="g_visual_background"></div>
                      <Image src="/villa/villa-bedroom-high-ceiling.jpg" alt="Bedroom" fill sizes="33vw" data-parallax="true" className="g_visual_img" />
                    </figure>
                 </div>
                 <div className="big_img_col">
                    <figure className="g_visual_wrap" data-scroll-parallax="true">
                      <div className="g_visual_background"></div>
                      <Image src="/villa/villa-peacocks-veranda.jpg" alt="Veranda" fill sizes="33vw" data-parallax="true" className="g_visual_img" />
                    </figure>
                 </div>
                 <div className="big_img_col">
                    <figure className="g_visual_wrap" data-scroll-parallax="true">
                      <div className="g_visual_background"></div>
                      <Image src="/villa/villa-boat-sunset.webp" alt="Boat" fill sizes="33vw" data-parallax="true" className="g_visual_img" />
                    </figure>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section id="project" className="projects-section" data-theme="light">
        <div className="home_project_list">
          {projectSlides.map((slide, index) => (
            <article className="home_project_item" key={slide.title}>
              <figure className="g_visual_wrap" data-anim="project-img">
                <div className="g_visual_background"></div>
                <Image src={slide.image} alt={slide.title} fill sizes="(min-width: 900px) 50vw, 100vw" className="g_visual_img" data-anim="intro-parallax" />
              </figure>
              <div className="home_project_content">
                <div className="home_project_info">
                  <span className="jp">(project {slide.number})</span>
                  <div className="home_project_title">
                    <h3>{slide.title}</h3>
                  </div>
                </div>
                <div className="home_project_right">
                  <p className="home_project_copy">{slide.copy}</p>
                  <div className="home_project_num">
                    <div>{slide.number}</div>
                    <div>/</div>
                    <div>0{projectSlides.length}</div>
                  </div>
                  <div data-anim="fade-in">
                    <a className="text-button" href="#contact">See project <ArrowUpRight size={16} /></a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="sustainability" className="home_sustain" data-theme="light">
        <div className="sustain_container">
          <div className="h_sustain_col-img">
            <div className="intro_img u-visual-wrap">
              <figure className="g_visual_wrap reveal-img">
                <div className="g_visual_background"></div>
                <Image src="/villa/villa-balcony-path.jpg" alt="Sustainability architecture" fill sizes="50vw" className="g_visual_img" />
                <div className="whipe" data-anim="intro-whipe"></div>
              </figure>
            </div>
          </div>
          <div className="h_sustain_col-l">
            <div className="h_sustain_kanji_wrap">
              <span className="jp" style={{fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: 0}} data-anim="fade-in">建築</span>
              <div className="kanji_content">
                <div className="kanji_title" style={{fontSize: "1.4rem", textTransform: "uppercase"}}><div data-anim="intro-title">(Ken chiku)</div></div>
                <div className="kanji_title" style={{fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.15em"}}><div data-anim="intro-title">Architecture</div></div>
              </div>
            </div>
            <div className="h_sustain_head">
              <h2 className="g_heading">
                Designs That Sustain Life
              </h2>
            </div>
          </div>
          
          <div className="h_sustain_col-r">
            <div className="sustain_img_small">
              <figure className="g_visual_wrap reveal-img">
                <div className="g_visual_background"></div>
                <Image src="/villa/villa-riverside.webp" alt="River view at Riverwood Villa" fill sizes="25vw" className="g_visual_img" />
                <div className="whipe" data-anim="intro-whipe"></div>
              </figure>
            </div>
            <div className="sustain_content_wrap">
              <div className="sustain_content_p">
                <p data-anim="intro-para">
                  Balconies, palms, bird calls, and shaded corners let each day unfold
                  without the hurry of a traditional hotel.
                </p>
              </div>
              <div data-anim="fade-in">
                <a className="text-button" href="#contact">
                  Sustainability <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="line_wrapper">
          <div className="section-divider" data-anim="intro-line"></div>
        </div>
      </section>

      <section id="service" className="service-section" data-theme="light">
        <div>
          <span className="jp" data-anim="intro-title">(hosted calm)</span>
          <p data-anim="intro-title">Service</p>
        </div>
        <div className="service-type">
          <span data-anim="service-word">Precision</span>
          <span data-anim="service-word">In</span>
          <figure className="service-img reveal-img" data-anim="project-img">
            <Image src="/villa/villa-terrace-dining.webp" alt="Hosted dining at Riverwood Villa" fill sizes="30vw" />
          </figure>
          <span data-anim="service-word">Every</span>
          <span data-anim="service-word">Stay</span>
        </div>
        <p data-anim="intro-para">
          Terrace meals, tea, and local guidance can be shaped around your group
          while the villa still feels fully yours.
        </p>
        <div data-anim="fade-in">
          <a className="text-button" href="#contact">
            Our service <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <section id="journal" className="gallery-section" data-theme="light">
        <div className="gallery-heading">
          <span className="jp" data-anim="intro-title">(stay notes)</span>
          <h2 data-anim="intro-para">Scroll through the stay like a film reel.</h2>
        </div>
        <div className="gallery-grid">
          {journalImages.map(([src, label], index) => (
            <figure className="gallery-item reveal-img" key={src} data-skew>
              <Image src={src} alt={label} fill sizes="(min-width: 900px) 30vw, 100vw" />
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="quote-section" data-theme="light">
        <div>
          <span className="jp" data-anim="intro-title">(one meeting)</span>
          <p>
            Riverwood has that rare balance of privacy, warmth, and tropical
            calm. The first morning on the balcony was the whole reason to come.
          </p>
        </div>
        <figure className="quote-img reveal-img" data-anim="project-img">
          <Image src="/villa/villa-balcony-chairs-river.webp" alt="Balcony chairs looking over the river" fill sizes="32vw" />
        </figure>
      </section>

      <section id="contact" className="cta-section" data-theme="light">
        <figure className="cta-small reveal-img" data-anim="project-img">
          <Image src="/villa/villa-exterior-side-sunset.jpg" alt="Riverwood Villa at sunset" fill sizes="18vw" />
        </figure>
        <div className="cta-copy">
          <span className="jp" data-anim="intro-title">(connect)</span>
          <h2 data-anim="intro-para">Bring the dates. Riverwood will slow the rest down.</h2>
          <p data-anim="intro-para">
            Send your dates, group size, and the stay style you have in mind.
            We will help shape the practical next step.
          </p>
          <div data-anim="fade-in">
            <a className="dark-button" href="mailto:hello@riverwoodvilla.com" data-magnetic="0.32">
              Get in touch <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <figure className="cta-large reveal-img" data-anim="project-img">
          <Image src="/villa/villa-exterior-night.jpg" alt="Riverwood Villa at night" fill sizes="44vw" />
        </figure>
      </section>

      <footer className="footer">
        <nav>
          {navItems.map(([label, href], index) => (
            <a href={href} key={href}>
              <span>({index + 1})</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="footer-main">
          <h2>Riverwood Villa</h2>
          <div className="footer-info">
            <div>
              <p>Email</p>
              <a href="mailto:hello@riverwoodvilla.com">
                <Mail size={15} /> hello@riverwoodvilla.com
              </a>
            </div>
            <div>
              <p>Phone</p>
              <a href="tel:+94770000000">
                <Phone size={15} /> +94 77 000 0000
              </a>
            </div>
            <div>
              <p>Office</p>
              <span>
                <MapPin size={15} /> Riverside Road, Sri Lanka
              </span>
            </div>
            <div>
              <p>Social</p>
              <span className="socials">
                <a href="https://www.instagram.com/" aria-label="Instagram"><Instagram size={17} /></a>
                <a href="https://www.facebook.com/" aria-label="Facebook"><Facebook size={17} /></a>
              </span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>©26 Riverwood Villa - All rights reserved</span>
          <a href="#home">Back to top</a>
        </div>
      </footer>

      {/* Custom cursor — desktop only, hidden on touch via CSS */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />
    </main>
  );
}
