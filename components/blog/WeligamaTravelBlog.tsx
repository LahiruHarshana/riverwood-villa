"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Plus } from "lucide-react";
import {
  blogMeta,
  faqs,
  places,
  practicalTips,
  riverwoodDay,
  riverwoodImages,
  routeStops,
  whenToVisit,
  whyWeligama,
} from "@/lib/blog/weligama-travel-guide";

type MotionModules = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  Lenis: typeof import("lenis").default;
};
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

function BlogImage({
  src,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 980px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      priority={priority}
      loading={priority ? undefined : "lazy"}
    />
  );
}

export function WeligamaTravelBlog() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const pageRef = useRef<HTMLElement>(null);

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
          disposers.push(() =>
            target.removeEventListener(type, handler as EventListener),
          );
        };

        const nav = document.querySelector<HTMLElement>(".blog-nav");
        const updateNav = () => {
          if (!nav) return;
          nav.classList.toggle("is-scrolled", window.scrollY > 24);
          nav.classList.toggle("is-light", window.scrollY > window.innerHeight * 0.6);
        };
        on(window, "scroll", updateNav);
        updateNav();

        const bgDissolve = document.querySelector<HTMLElement>(".blog-bg-dissolve");

        const context = gsap.context(() => {
          // Reading progress
          gsap.to(".blog-progress-fill", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".blog-page",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.15,
            },
          });

          // Hero parallax + letterbox
          gsap.to(".blog-hero-media img", {
            scale: 1.14,
            yPercent: 14,
            ease: "none",
            scrollTrigger: {
              trigger: ".blog-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.fromTo(
            ".blog-letterbox-top, .blog-letterbox-bottom",
            { height: "14vh" },
            {
              height: 0,
              duration: 1.6,
              ease: "expo.inOut",
              delay: 0.4,
            },
          );

          gsap.to(".blog-letterbox-top, .blog-letterbox-bottom", {
            height: "16vh",
            ease: "none",
            scrollTrigger: {
              trigger: ".blog-hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.to(".blog-reel-fill", {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".blog-page",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.2,
            },
          });

          gsap.from(".blog-hero-kicker > *", {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.3,
          });

          gsap.from(".blog-hero-title", {
            yPercent: 40,
            autoAlpha: 0,
            duration: 1.1,
            ease: "power4.out",
            delay: 0.45,
          });

          gsap.from(".blog-hero-sub, .blog-hero-meta > *", {
            y: 28,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            delay: 0.7,
          });

          // Intro reveal
          gsap.from(".blog-intro-lead", {
            y: 50,
            autoAlpha: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: ".blog-intro",
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.from(".blog-intro-body p", {
            y: 32,
            autoAlpha: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".blog-intro-body",
              start: "top 82%",
              toggleActions: "play none none reverse",
            },
          });

          gsap.fromTo(
            ".blog-opening-visual",
            { clipPath: "inset(50% 50% 50% 50%)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.5,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: ".blog-opening-visual",
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );

          const openingImg = document.querySelector<HTMLElement>(
            ".blog-opening-visual img",
          );
          if (openingImg) {
            gsap.fromTo(
              openingImg,
              { scale: 1.1, yPercent: -5 },
              {
                scale: 1.02,
                yPercent: 5,
                ease: "none",
                scrollTrigger: {
                  trigger: ".blog-opening-visual",
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          }

          gsap.fromTo(
            ".blog-callout",
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.2,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: ".blog-callout",
                start: "top 82%",
                toggleActions: "play none none reverse",
              },
            },
          );

          // Section headers — cinematic blur reveal
          gsap.utils
            .toArray<HTMLElement>(".blog-section-header")
            .forEach((header) => {
              gsap.from(header.children, {
                y: 48,
                autoAlpha: 0,
                filter: "blur(10px)",
                duration: 1,
                ease: "power3.out",
                stagger: 0.12,
                scrollTrigger: {
                  trigger: header,
                  start: "top 80%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Route horizontal scroll (desktop)
          const routeSection = document.querySelector<HTMLElement>(
            ".blog-route-section",
          );
          const routeTrack = document.querySelector<HTMLElement>(
            ".blog-route-track",
          );
          const routePin = document.querySelector<HTMLElement>(".blog-route-pin");

          if (
            routeSection &&
            routeTrack &&
            routePin &&
            window.matchMedia("(min-width: 981px)").matches
          ) {
            const travel = () =>
              Math.max(0, routeTrack.scrollWidth - window.innerWidth);
            const routeTween = gsap.to(routeTrack, {
              x: () => -travel(),
              ease: "none",
              scrollTrigger: {
                trigger: routeSection,
                start: "top top",
                end: () => `+=${travel()}`,
                pin: routePin,
                scrub: 1,
                anticipatePin: 1,
                invalidateOnRefresh: true,
              },
            });

            gsap.to(".blog-route-progress-fill", {
              scaleX: 1,
              ease: "none",
              scrollTrigger: {
                trigger: routeSection,
                start: "top top",
                end: () => `+=${travel()}`,
                scrub: true,
              },
            });

            disposers.push(() => routeTween.kill());
          }

          // Route cards (mobile / fallback)
          gsap.utils
            .toArray<HTMLElement>(".blog-route-card")
            .forEach((card, index) => {
              gsap.from(card, {
                y: 50,
                autoAlpha: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: index * 0.05,
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Why cards
          gsap.utils
            .toArray<HTMLElement>(".blog-why-card")
            .forEach((card, index) => {
              gsap.from(card, {
                y: 44,
                autoAlpha: 0,
                duration: 0.75,
                ease: "power3.out",
                delay: index * 0.06,
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Scroll-directed film — places play like movie cuts (desktop)
          const filmSection = document.querySelector<HTMLElement>(
            ".blog-film-sequence",
          );
          const filmFramesEls = gsap.utils.toArray<HTMLElement>(
            ".blog-film-frame",
          );
          const filmCopies = gsap.utils.toArray<HTMLElement>(".blog-film-copy");
          const sceneCurrent = document.querySelector<HTMLElement>(
            ".blog-reel-scene",
          );

          if (
            filmSection &&
            filmFramesEls.length > 0 &&
            window.matchMedia("(min-width: 981px)").matches
          ) {
            const filmSegment = 0.75;
            const filmTotalDuration = filmFramesEls.length * filmSegment;
            const filmImages = filmFramesEls
              .map((frame) => frame.querySelector<HTMLElement>("img"))
              .filter((image): image is HTMLElement => Boolean(image));

            gsap.set(filmFramesEls, { clipPath: "inset(100% 0 0 0)" });
            gsap.set(filmFramesEls[0], { clipPath: "inset(0% 0 0 0)" });
            gsap.set(filmImages, { scale: 1.1 });
            gsap.set(filmImages[0], { scale: 1.04 });
            gsap.set(filmCopies.slice(1), { autoAlpha: 0, y: 52 });

            const filmTimeline = gsap.timeline({
              scrollTrigger: {
                trigger: filmSection,
                start: "top top",
                end: `+=${filmFramesEls.length * 75}%`,
                pin: ".blog-film-pin",
                scrub: 0.6,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const index = Math.min(
                    filmFramesEls.length - 1,
                    Math.floor(self.progress * filmFramesEls.length),
                  );
                  if (sceneCurrent) {
                    sceneCurrent.textContent = String(index + 1).padStart(2, "0");
                  }
                },
              },
            });

            filmImages.forEach((image, index) => {
              filmTimeline.to(
                image,
                {
                  scale: 1.02,
                  duration: filmSegment,
                  ease: "none",
                },
                index * filmSegment,
              );
            });

            filmFramesEls.forEach((frame, index) => {
              if (index === 0) return;
              const position = index * filmSegment;
              filmTimeline
                .to(
                  frame,
                  {
                    clipPath: "inset(0% 0 0 0)",
                    duration: filmSegment,
                    ease: "power3.inOut",
                  },
                  position,
                )
                .to(
                  filmCopies[index - 1],
                  {
                    autoAlpha: 0,
                    y: -42,
                    duration: 0.28,
                    ease: "power2.in",
                  },
                  position,
                )
                .fromTo(
                  filmCopies[index],
                  { autoAlpha: 0, y: 52 },
                  {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.48,
                    ease: "power3.out",
                  },
                  position + 0.12,
                );
            });

            filmTimeline.to(
              ".blog-film-progress-fill",
              {
                scaleX: 1,
                duration: filmTotalDuration,
                ease: "none",
              },
              0,
            );

            disposers.push(() => filmTimeline.kill());
          }

          // Mobile place chapters
          gsap.utils
            .toArray<HTMLElement>(".blog-places-mobile .blog-place")
            .forEach((place) => {
              const visual = place.querySelector<HTMLElement>(
                ".blog-place-visual",
              );
              const copy = place.querySelector<HTMLElement>(".blog-place-copy");

              if (visual) {
                gsap.fromTo(
                  visual,
                  { clipPath: "inset(0 100% 0 0)" },
                  {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 1.25,
                    ease: "expo.inOut",
                    scrollTrigger: {
                      trigger: place,
                      start: "top 75%",
                      toggleActions: "play none none reverse",
                    },
                  },
                );

                const img = visual.querySelector("img");
                if (img) {
                  gsap.fromTo(
                    img,
                    { scale: 1.12, yPercent: -6 },
                    {
                      scale: 1.02,
                      yPercent: 6,
                      ease: "none",
                      scrollTrigger: {
                        trigger: place,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 0.8,
                      },
                    },
                  );
                }
              }

              if (copy) {
                gsap.from(copy.children, {
                  y: 36,
                  autoAlpha: 0,
                  duration: 0.8,
                  ease: "power3.out",
                  stagger: 0.1,
                  scrollTrigger: {
                    trigger: place,
                    start: "top 72%",
                    toggleActions: "play none none reverse",
                  },
                });
              }
            });

          // Riverwood images — staggered film gate reveals
          gsap.utils
            .toArray<HTMLElement>(".blog-riverwood-image")
            .forEach((figure, index) => {
              gsap.fromTo(
                figure,
                { clipPath: "inset(100% 0 0 0)", y: 50 },
                {
                  clipPath: "inset(0% 0 0 0)",
                  y: 0,
                  duration: 1.15,
                  ease: "expo.inOut",
                  delay: index * 0.1,
                  scrollTrigger: {
                    trigger: figure,
                    start: "top 85%",
                    toggleActions: "play none none reverse",
                  },
                },
              );

              const img = figure.querySelector("img");
              if (img) {
                gsap.fromTo(
                  img,
                  { scale: 1.14 },
                  {
                    scale: 1.04,
                    ease: "none",
                    scrollTrigger: {
                      trigger: figure,
                      start: "top bottom",
                      end: "bottom top",
                      scrub: 0.9,
                    },
                  },
                );
              }
            });

          // Day timeline items
          gsap.utils
            .toArray<HTMLElement>(".blog-day-item")
            .forEach((item, index) => {
              gsap.from(item.children, {
                x: -24,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
                stagger: 0.08,
                delay: index * 0.05,
                scrollTrigger: {
                  trigger: item,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Season cards
          gsap.utils
            .toArray<HTMLElement>(".blog-season-card")
            .forEach((card, index) => {
              gsap.from(card, {
                y: 36,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
                delay: index * 0.06,
                scrollTrigger: {
                  trigger: card,
                  start: "top 88%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // Tips
          gsap.utils
            .toArray<HTMLElement>(".blog-tips-list li")
            .forEach((item, index) => {
              gsap.from(item, {
                x: -20,
                autoAlpha: 0,
                duration: 0.65,
                ease: "power3.out",
                delay: index * 0.04,
                scrollTrigger: {
                  trigger: item,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // FAQ items
          gsap.utils
            .toArray<HTMLElement>(".blog-faq-item")
            .forEach((item, index) => {
              gsap.from(item, {
                y: 28,
                autoAlpha: 0,
                duration: 0.7,
                ease: "power3.out",
                delay: index * 0.05,
                scrollTrigger: {
                  trigger: item,
                  start: "top 90%",
                  toggleActions: "play none none reverse",
                },
              });
            });

          // CTA
          gsap.fromTo(
            ".blog-cta-visual",
            { clipPath: "inset(0 50% 0 50%)" },
            {
              clipPath: "inset(0 0% 0 0%)",
              duration: 1.3,
              ease: "expo.inOut",
              scrollTrigger: {
                trigger: ".blog-cta-section",
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );

          gsap.from(".blog-cta-copy > *", {
            y: 40,
            autoAlpha: 0,
            duration: 0.85,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: ".blog-cta-copy",
              start: "top 78%",
              toggleActions: "play none none reverse",
            },
          });

          // Background color shifts
          if (bgDissolve) {
            const sections: Array<{ selector: string; color: string }> = [
              { selector: ".blog-riverwood-section", color: "#111110" },
              { selector: ".blog-day-section", color: "#e7eae5" },
              { selector: ".blog-why-section", color: "#efede7" },
              { selector: ".blog-tips-section", color: "#efede7" },
            ];

            sections.forEach(({ selector, color }) => {
              const el = document.querySelector(selector);
              if (!el) return;
              ScrollTrigger.create({
                trigger: el,
                start: "top 60%",
                end: "bottom 40%",
                onEnter: () =>
                  gsap.to(bgDissolve, {
                    backgroundColor: color,
                    duration: 0.6,
                    ease: "power2.out",
                  }),
                onEnterBack: () =>
                  gsap.to(bgDissolve, {
                    backgroundColor: color,
                    duration: 0.6,
                    ease: "power2.out",
                  }),
                onLeave: () =>
                  gsap.to(bgDissolve, {
                    backgroundColor: "#f6f5f1",
                    duration: 0.6,
                    ease: "power2.out",
                  }),
                onLeaveBack: () =>
                  gsap.to(bgDissolve, {
                    backgroundColor: "#f6f5f1",
                    duration: 0.6,
                    ease: "power2.out",
                  }),
              });
            });
          }
        }, pageRef);

        const refresh = () => ScrollTrigger.refresh();
        if (document.fonts?.ready) {
          document.fonts.ready.then(refresh).catch(() => undefined);
        }
        on(window, "load", refresh);

        cleanup = () => {
          disposers.forEach((dispose) => dispose());
          context.revert();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          gsap.ticker.remove(raf);
          lenis.destroy();
        };
      } catch {
        /* motion fallback — static page still works */
      }
    }

    bootMotion();

    return () => {
      alive = false;
      cleanup();
    };
  }, []);

  return (
    <article ref={pageRef} className="blog-page">
      <div className="blog-bg-dissolve" aria-hidden="true" />
      <div className="blog-film-grain" aria-hidden="true" />
      <div className="blog-progress-line" aria-hidden="true">
        <div className="blog-progress-fill" />
      </div>
      <div className="blog-reel-indicator" aria-hidden="true">
        <span className="blog-reel-label">Reel</span>
        <div className="blog-reel-track">
          <div className="blog-reel-fill" />
        </div>
        <em className="blog-reel-scene">01</em>
      </div>

      <header className="site-nav blog-nav" data-theme="dark">
        <div className="nav-line" aria-hidden="true" />
        <Link href="/" className="nav-logo" aria-label="Riverwood Villa home">
          <span>Riverwood Villa</span>
        </Link>
        <span className="nav-est">
          <span>Travel Journal</span>
        </span>
        <Link className="nav-book-cta" href="/#book" aria-label="Book your stay">
          Book now <ArrowUpRight size={14} strokeWidth={1.9} />
        </Link>
        <Link
          className="nav-menu"
          href="/"
          aria-label="Back to homepage"
        >
          <span>Home</span>
          <span className="nav-btn-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </Link>
      </header>

      {/* Hero */}
      <section className="blog-hero" aria-labelledby="blog-hero-title">
        <div className="blog-hero-media">
          <BlogImage
            src={blogMeta.heroImage}
            alt={blogMeta.heroImageAlt}
            priority
            sizes="100vw"
          />
        </div>
        <div className="blog-hero-overlay" aria-hidden="true" />
        <div className="blog-hero-letterbox" aria-hidden="true">
          <span className="blog-letterbox-top" />
          <span className="blog-letterbox-bottom" />
        </div>
        <div className="blog-hero-content">
          <div className="blog-hero-kicker">
            <span>Riverwood Travel Journal</span>
            <span>Weligama, Sri Lanka</span>
            <span>August 2026</span>
          </div>
          <h1 id="blog-hero-title" className="blog-hero-title">
            Beautiful Weligama: <em>Surf, culture, island views</em> and the
            riverside stay that completes the journey
          </h1>
          <p className="blog-hero-sub">
            A complete guide to the best places, smartest routes and slowest,
            loveliest moments on Sri Lanka&apos;s south coast.
          </p>
          <div className="blog-hero-meta">
            <span>Things to do in Weligama</span>
            <span>15 min read</span>
            <span>By {blogMeta.author}</span>
          </div>
        </div>
        <div className="blog-scroll-hint">Scroll</div>
      </section>

      {/* Intro */}
      <section className="blog-intro" aria-label="Introduction">
        <p className="blog-intro-lead">
          Weligama does not reveal itself all at once. At first, you notice the
          long curve of sand, surfboards stacked beside the road and the soft
          green water of the bay.
        </p>
        <div className="blog-intro-body">
          <p>
            Stay a little longer and another Weligama appears: fishing boats
            returning in the morning, an ancient figure carved into rock, a
            private island wrapped in trees, and a river moving quietly behind
            the energy of the coast.
          </p>
          <p>
            The name Weligama means &ldquo;Sandy Village,&rdquo; and the town
            remains one of the south coast&apos;s most welcoming introductions.
            Its sheltered bay is celebrated by beginner surfers; its railway and
            road links make exploration easy; and Mirissa, Midigama, Koggala,
            Ahangama and Galle all sit within practical day-trip range.
          </p>
          <p>
            But the best Weligama holiday should not become a race between
            viewpoints. The coast gives you movement; the river gives you
            stillness. That is why Riverwood Villa belongs inside the Weligama
            story—not simply as a bed for the night, but as the place where the
            journey finally slows enough to be remembered.
          </p>
        </div>
      </section>

      <figure className="blog-opening-visual" aria-label="Weligama Bay aerial view">
        <BlogImage
          src={blogMeta.openingImage}
          alt={blogMeta.openingImageAlt}
          sizes="100vw"
        />
      </figure>

      <aside className="blog-callout" aria-label="Riverwood promise">
        <span className="blog-callout-label">Riverwood Promise</span>
        <p className="blog-callout-text">
          If you leave Weligama without spending one slow day beside the river
          at Riverwood Villa, you may have seen the town—but you have missed its
          most peaceful rhythm.
        </p>
      </aside>

      {/* Route */}
      <section
        className="blog-route-section"
        aria-labelledby="route-title"
        data-chapter="route"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">The route</span>
          <h2 id="route-title" className="blog-section-title">
            First: the best route <em>after arriving</em> in Weligama
          </h2>
          <p className="blog-section-desc">
            For a first visit, begin close to the bay, move west in one clean
            line, and return to Riverwood for the evening. This route gives you
            surf, local life, Weligama&apos;s two signature heritage sights and
            a calm finish without wasting the day in traffic.
          </p>
        </header>

        <div className="blog-route-pin">
          <div className="blog-route-track">
            {routeStops.map((stop) => (
              <article className="blog-route-card" key={stop.time}>
                <span className="blog-route-time">{stop.time}</span>
                <h3 className="blog-route-stop">{stop.stop}</h3>
                <p className="blog-route-why">{stop.why}</p>
              </article>
            ))}
          </div>
          <div className="blog-route-progress" aria-hidden="true">
            <div className="blog-route-progress-fill" />
          </div>
        </div>

        <p className="blog-route-note">
          Arriving in the morning? Reverse the mood rather than the geography:
          enjoy the bay before the heat builds, return to Riverwood for
          breakfast or a quiet midday break, then continue to Taprobane and
          Kushtarajagala in the afternoon.
        </p>
      </section>

      {/* Why Weligama */}
      <section
        className="blog-why-section"
        aria-labelledby="why-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">Why it matters</span>
          <h2 id="why-title" className="blog-section-title">
            Why Weligama is <em>important</em>
          </h2>
          <p className="blog-section-desc">
            Weligama is more than a convenient beach stop between Galle and
            Matara. Several versions of Sri Lanka meet in a small area.
          </p>
        </header>
        <div className="blog-why-grid">
          {whyWeligama.map((item) => (
            <article className="blog-why-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Places — cinematic film (desktop) + scroll cards (mobile) */}
      <section
        className="blog-places-section"
        aria-labelledby="places-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">Places to visit</span>
          <h2 id="places-title" className="blog-section-title">
            The most beautiful and <em>important</em> places to visit
          </h2>
        </header>

        <div className="blog-film-sequence" aria-label="Scroll-directed destination film">
          <div className="blog-film-pin">
            <div className="blog-film-stage">
              {places.map((place) => (
                <figure className="blog-film-frame" key={place.number}>
                  <BlogImage
                    src={place.image}
                    alt={place.alt}
                    sizes="100vw"
                  />
                </figure>
              ))}
              <div className="blog-film-vignette" aria-hidden="true" />
            </div>

            <div className="blog-film-copy-stack">
              {places.map((place) => (
                <div className="blog-film-copy" key={place.number}>
                  <div className="blog-film-meta">
                    <span>{place.number} / 08</span>
                    <span>Scene</span>
                  </div>
                  <h3>{place.title}</h3>
                  <p>{place.paragraphs[0]}</p>
                </div>
              ))}
            </div>

            <div className="blog-film-side-label" aria-hidden="true">
              Scroll-directed film
            </div>
            <div className="blog-film-progress" aria-hidden="true">
              <div className="blog-film-progress-fill" />
            </div>
          </div>
        </div>

        <div className="blog-places-mobile">
          {places.map((place, index) => (
            <article
              className={`blog-place ${index % 2 === 1 ? "is-reverse" : ""}`}
              key={place.number}
            >
              <figure className="blog-place-visual">
                <BlogImage
                  src={place.image}
                  alt={place.alt}
                  sizes="(max-width: 980px) 100vw, 45vw"
                />
                <span className="blog-place-number">{place.number}</span>
              </figure>
              <div className="blog-place-copy">
                <h3>{place.title}</h3>
                {place.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Riverwood */}
      <section
        className="blog-riverwood-section"
        aria-labelledby="riverwood-title"
      >
        <div className="blog-riverwood-inner">
          <header>
            <span className="blog-section-index">Where to stay</span>
            <h2 id="riverwood-title" className="blog-section-title">
              Riverwood Villa: <em>the riverside day</em> that completes Weligama
            </h2>
            <p className="blog-riverwood-intro">
              This is the day that turns Riverwood from accommodation into
              memory. A Weligama trip without one slow Riverwood day is a trip
              that never discovered how peaceful Weligama can be.
            </p>
          </header>

          <div className="blog-riverwood-grid">
            {riverwoodImages.map((img, index) => (
              <figure
                className={`blog-riverwood-image ${index === 0 ? "is-wide" : ""}`}
                key={img.image}
              >
                <BlogImage
                  src={img.image}
                  alt={img.alt}
                  sizes={
                    index === 0
                      ? "(max-width: 980px) 100vw, 80vw"
                      : "(max-width: 980px) 100vw, 40vw"
                  }
                />
                <figcaption>{img.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Riverwood day */}
      <section
        className="blog-day-section"
        aria-labelledby="day-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">A perfect day</span>
          <h2 id="day-title" className="blog-section-title">
            One slow day <em>at Riverwood</em>
          </h2>
          <p className="blog-section-desc">
            Do not treat this as another item on a checklist. This is the day
            that turns Riverwood from accommodation into memory.
          </p>
        </header>
        <div className="blog-day-timeline">
          {riverwoodDay.map((item) => (
            <article className="blog-day-item" key={item.time}>
              <span className="blog-day-time">{item.time}</span>
              <div>
                <h4>{item.title}</h4>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* When to visit */}
      <section
        className="blog-season-section"
        aria-labelledby="season-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">Planning</span>
          <h2 id="season-title" className="blog-section-title">
            When to <em>visit</em> Weligama
          </h2>
          <p className="blog-section-desc">
            For the south coast, the most reliable planning window for calmer
            seas, surfing and outdoor days generally runs from October or
            November through March or April.
          </p>
        </header>
        <div className="blog-season-grid">
          {whenToVisit.map((item) => (
            <article className="blog-season-card" key={item.label}>
              <span>{item.label}</span>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section
        className="blog-tips-section"
        aria-labelledby="tips-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">Practical</span>
          <h2 id="tips-title" className="blog-section-title">
            Travel <em>tips</em>
          </h2>
        </header>
        <ol className="blog-tips-list">
          {practicalTips.map((tip) => (
            <li key={tip.slice(0, 50)}>{tip}</li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section
        className="blog-faq-section"
        aria-labelledby="faq-title"
      >
        <header className="blog-section-header">
          <span className="blog-section-index">FAQ</span>
          <h2 id="faq-title" className="blog-section-title">
            Frequently <em>asked</em> questions
          </h2>
        </header>
        <div className="blog-faq-list">
          {faqs.map((faq, index) => (
            <div
              className={`blog-faq-item ${openFaq === index ? "is-open" : ""}`}
              key={faq.question}
            >
              <button
                type="button"
                className="blog-faq-question"
                onClick={() =>
                  setOpenFaq(openFaq === index ? null : index)
                }
                aria-expanded={openFaq === index}
              >
                {faq.question}
                <Plus className="blog-faq-icon" size={20} strokeWidth={1.5} />
              </button>
              <div className="blog-faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="blog-cta-section" aria-labelledby="cta-title">
        <figure className="blog-cta-visual">
          <BlogImage
            src="/villa/villa-balcony-chairs-river.webp"
            alt="Wooden balcony chairs overlooking the river at Riverwood Villa"
            sizes="(max-width: 980px) 100vw, 45vw"
          />
        </figure>
        <div className="blog-cta-copy">
          <h2 id="cta-title">
            See the coast, then stay for <em>the river</em>
          </h2>
          <p>
            Come for the beaches and the famous photographs. Stay for the balcony
            mornings, shared tables, river air and the moment the day finally
            becomes quiet. Because the most complete Weligama story is not only
            about where you went—it is about where you allowed yourself to stop.
          </p>
          <div className="blog-cta-actions">
            <Link className="solid-button-v2" href="/#book" data-magnetic>
              Plan your stay <ArrowDownRight size={16} />
            </Link>
            <Link className="outline-button-v2" href="/#rooms">
              View rooms <ArrowDownRight size={16} />
            </Link>
          </div>
          <div className="blog-cta-contact">
            <p>
              No. 47/7, Sri Sambuddathwa Jayanthi Mw, Pelana, Weligama, Sri
              Lanka
            </p>
            <p>
              <a href="https://riverwoodvillaweligama.com">
                riverwoodvillaweligama.com
              </a>
              {" · "}
              <a href="tel:+94765670128">+94 76 567 0128</a>
              {" · "}
              <a href="mailto:riverwoodvillaweligama@gmail.com">
                riverwoodvillaweligama@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>

      <footer className="blog-footer">
        <div className="blog-footer-inner">
          <Link href="/" className="blog-footer-brand">
            Riverwood Villa
          </Link>
          <nav className="blog-footer-links" aria-label="Blog footer">
            <Link href="/">Home</Link>
            <Link href="/#book">Book</Link>
            <Link href="/#rooms">Rooms</Link>
            <Link href="/#gallery">Gallery</Link>
          </nav>
        </div>
      </footer>
    </article>
  );
}
