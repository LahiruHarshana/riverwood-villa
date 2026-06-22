"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { X } from "lucide-react";

const navItems = [
  ["Home", "#home"],
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

          document.querySelectorAll("a, button").forEach((el) => {
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
                el.addEventListener("pointerenter", () => {
                  cursorLabelEl.textContent = el.dataset.cursor ?? "view";
                  cursorRingEl.classList.add("is-label");
                });
                el.addEventListener("pointerleave", () => {
                  cursorRingEl.classList.remove("is-label");
                });
              });
            }
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

      {/* Custom cursor — desktop only, hidden on touch via CSS */}
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true">
        <span className="cursor-label">view</span>
      </div>
    </main>
  );
}
