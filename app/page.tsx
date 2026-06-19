"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  CalendarDays,
  ChevronDown,
  Clock3,
  Facebook,
  Home as HomeIcon,
  Hotel,
  Instagram,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sailboat,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Utensils,
  Waves,
  Wifi,
  X,
} from "lucide-react";

const navItems = [
  ["Home", "#home"],
  ["Offer", "#offer"],
  ["Stays", "#stays"],
  ["Gallery", "#gallery"],
  ["Contact", "#contact"],
];

const heroStats = [
  ["4+", "Private suites"],
  ["12+", "Happy guests"],
  ["360°", "River views"],
];

const offerTabs = [
  {
    number: "01",
    title: "Private Villa Living",
    label: "Whole-villa stays",
    copy: "Reserve Riverwood as a quiet private base with generous gathering spaces, garden-facing rooms, and an easy arrival rhythm.",
    image: "/villa/villa-exterior-front.jpg",
    icon: HomeIcon,
  },
  {
    number: "02",
    title: "Slow Riverside Days",
    label: "Nature and calm",
    copy: "Wake to palms, river air, birdsong, and shaded balconies built for long tea, reading, and unhurried conversation.",
    image: "/villa/villa-riverside.webp",
    icon: Waves,
  },
  {
    number: "03",
    title: "Hosted Dining Moments",
    label: "Meals and terraces",
    copy: "Gather around patio dining, morning breakfasts, and relaxed evening meals with hosting support arranged around your stay.",
    image: "/villa/villa-terrace-dining.webp",
    icon: Utensils,
  },
];

const services = [
  {
    icon: Hotel,
    title: "Boutique Rooms",
    copy: "High-ceiling bedrooms, soft linens, ensuite comfort, and quiet corners for rest.",
  },
  {
    icon: Trees,
    title: "Garden Setting",
    copy: "Tropical greenery, paved walkways, open-air balconies, and riverwood shade.",
  },
  {
    icon: Utensils,
    title: "Dining Support",
    copy: "Breakfast, tea, and hosted meal planning available when your dates are confirmed.",
  },
  {
    icon: Wifi,
    title: "Connected Calm",
    copy: "Starlink-supported connectivity for guests who need to work without losing the view.",
  },
  {
    icon: Sailboat,
    title: "Local Experiences",
    copy: "Boat rides, nature sightings, nearby beaches, and quiet routes can be suggested.",
  },
  {
    icon: ShieldCheck,
    title: "Private Planning",
    copy: "Straightforward enquiry support for couples, families, small groups, and longer stays.",
  },
];

const stays = [
  {
    category: "Signature",
    title: "Whole Villa Retreat",
    location: "Riverside private stay",
    price: "$320",
    beds: "4 rooms",
    baths: "4 baths",
    size: "Full villa",
    image: "/villa/villa-exterior-side-river.jpg",
  },
  {
    category: "Couples",
    title: "Canopy Suite Stay",
    location: "Garden-facing bedroom",
    price: "$120",
    beds: "1 room",
    baths: "Ensuite",
    size: "Balcony",
    image: "/villa/villa-bedroom-canopy.jpg",
  },
  {
    category: "Family",
    title: "Terrace Dining Escape",
    location: "Patio and lounge access",
    price: "$220",
    beds: "2 rooms",
    baths: "2 baths",
    size: "Shared spaces",
    image: "/villa/villa-dining-patio.jpg",
  },
  {
    category: "Long Stay",
    title: "Work From Riverwood",
    location: "Desk, Wi-Fi, and calm",
    price: "Custom",
    beds: "Flexible",
    baths: "Private",
    size: "Starlink",
    image: "/villa/villa-bedroom-desk.jpg",
  },
  {
    category: "Nature",
    title: "River Morning Package",
    location: "Balcony and water views",
    price: "$180",
    beds: "2 guests",
    baths: "Ensuite",
    size: "River view",
    image: "/villa/villa-balcony-chairs-river.webp",
  },
  {
    category: "Hosted",
    title: "Slow Weekend Gathering",
    location: "Meals and terrace time",
    price: "$280",
    beds: "Group stay",
    baths: "Private",
    size: "Dining patio",
    image: "/villa/villa-outdoor-restaurant.webp",
  },
];

const aboutFeatures = [
  {
    icon: Leaf,
    title: "Naturally Quiet",
    copy: "The architecture keeps the stay connected to palms, shaded verandas, and river air.",
  },
  {
    icon: Sparkles,
    title: "Warmly Hosted",
    copy: "Thoughtful support is available without making the villa feel overmanaged.",
  },
  {
    icon: MessageCircle,
    title: "Easy to Arrange",
    copy: "Send your group size and dates, then shape the stay with simple private guidance.",
  },
];

const gallery = [
  { src: "/villa/villa-hero.webp", label: "Hero view" },
  { src: "/villa/villa-exterior-night.jpg", label: "Evening facade" },
  { src: "/villa/villa-balcony-table.jpg", label: "Balcony table" },
  { src: "/villa/villa-bedroom-high-ceiling.jpg", label: "High ceiling room" },
  { src: "/villa/villa-peacocks-veranda.jpg", label: "Veranda life" },
  { src: "/villa/villa-terrace.webp", label: "Terrace" },
  { src: "/villa/villa-boat-sunset.webp", label: "Sunset boat" },
  { src: "/villa/villa-paved-walkway.webp", label: "Garden walkway" },
];

const testimonials = [
  {
    quote:
      "Riverwood has that rare balance of privacy, warmth, and tropical calm. The first morning on the balcony was the whole reason to come.",
    name: "Amelia Cooper",
    role: "Family guest",
  },
  {
    quote:
      "The villa works beautifully for a small group. We had enough space to gather, enough quiet to disappear, and no rush anywhere.",
    name: "Nathan Harper",
    role: "Weekend retreat guest",
  },
  {
    quote:
      "A polished stay without feeling formal. The river setting, rooms, and meal support made everything feel easy.",
    name: "Grace Powell",
    role: "Long-stay guest",
  },
];

const journal = [
  {
    title: "How to plan a slower villa weekend beside the water",
    meta: "Stay guide",
    image: "/villa/villa-balcony-palms.jpg",
  },
  {
    title: "What to pack for a private riverside boutique stay",
    meta: "Guest notes",
    image: "/villa/villa-long-balcony.jpg",
  },
  {
    title: "Morning tea, terrace dinners, and the Riverwood rhythm",
    meta: "Experience",
    image: "/villa/villa-terrace-dining.webp",
  },
];

const faqs = [
  {
    question: "Can we reserve the full villa privately?",
    answer:
      "Yes. Riverwood Villa is well suited to private bookings for families, couples, and small groups who want the whole place to themselves.",
  },
  {
    question: "Can meals be arranged during the stay?",
    answer:
      "Breakfast and hosted dining support can be discussed when you enquire. Availability depends on your dates, group size, and preferences.",
  },
  {
    question: "Is the villa suitable for remote work?",
    answer:
      "Yes. The villa includes calm work corners and Starlink-supported connectivity, while still keeping the stay close to nature.",
  },
  {
    question: "Do you support longer stays?",
    answer:
      "Longer stays can be arranged. Share your preferred dates and we can suggest the best room or full-villa setup.",
  },
  {
    question: "What is the best way to enquire?",
    answer:
      "Use the contact form or email link with your dates, group size, and preferred stay style. We will respond with the next practical details.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState(0);
  const [activeFaq, setActiveFaq] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    document.body.style.opacity = "1";

    if (reduceMotion) {
      document.documentElement.classList.add("motion-reduced");
      return;
    }

    let cleanup = () => {};
    const revealFallback = window.setTimeout(() => {
      document.querySelector<HTMLElement>(".loader")?.remove();
      document.querySelectorAll<HTMLElement>(".hero-word").forEach((el) => {
        el.style.transform = "translateY(0%)";
      });
      document.querySelectorAll<HTMLElement>(".hero-fade").forEach((el) => {
        el.style.opacity = "1";
        el.style.visibility = "visible";
        el.style.transform = "translateY(0)";
      });
    }, 4200);

    async function initMotion() {
      try {
        const [{ gsap }, { ScrollTrigger }, LenisModule] = await Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);
        const Lenis = LenisModule.default;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
          lerp: 0.08,
          smoothWheel: true,
        });

        const raf = (time: number) => {
          lenis.raf(time);
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        lenis.on("scroll", ScrollTrigger.update);

        const loadTl = gsap.timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => {
            window.clearTimeout(revealFallback);
            initScrollAnimations();
          },
        });

        loadTl
          .to(".loader-bar", { width: "100%", duration: 0.65 })
          .to(".loader-text", { y: -36, autoAlpha: 0, duration: 0.3 }, "-=0.05")
          .to(".loader", { yPercent: -100, duration: 0.55, ease: "power4.inOut" });

        function initScrollAnimations() {
          gsap.to(".hero-media", {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-animate]").forEach((el, i) => {
            gsap.from(el, {
              y: 34,
              autoAlpha: 0,
              duration: 0.75,
              delay: (i % 4) * 0.04,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 86%",
              },
            });
          });

          gsap.utils.toArray<HTMLElement>(".section-image img").forEach((img) => {
            gsap.to(img, {
              yPercent: -10,
              ease: "none",
              scrollTrigger: {
                trigger: img,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });

          gsap.from(".footer-inner", {
            y: 80,
            autoAlpha: 0.5,
            scale: 0.96,
            ease: "none",
            scrollTrigger: {
              trigger: ".site-footer",
              start: "top bottom",
              end: "center bottom",
              scrub: true,
            },
          });
        }

        cleanup = () => {
          window.clearTimeout(revealFallback);
          lenis.destroy();
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          gsap.killTweensOf("*");
        };
      } catch {
        window.clearTimeout(revealFallback);
        document.querySelector<HTMLElement>(".loader")?.remove();
        document.querySelectorAll<HTMLElement>(".hero-word").forEach((el) => {
          el.style.transform = "translateY(0%)";
        });
        document.querySelectorAll<HTMLElement>(".hero-fade").forEach((el) => {
          el.style.opacity = "1";
          el.style.visibility = "visible";
          el.style.transform = "translateY(0)";
        });
      }
    }

    initMotion();
    return () => {
      window.clearTimeout(revealFallback);
      cleanup();
    };
  }, []);

  const currentOffer = offerTabs[activeOffer];
  const OfferIcon = currentOffer.icon;

  return (
    <main id="home">
      <div className="noise-overlay" />
      <div className="loader" aria-hidden="true">
        <div className="loader-text">Riverwood Villa</div>
        <div className="loader-bar" />
      </div>

      <header className="navbar">
        <a href="#home" className="brand" aria-label="Riverwood Villa home">
          <Image
            src="/brand/riverwood-logo.png"
            alt=""
            width={38}
            height={38}
            priority
          />
          <span>Riverwood Villa</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a className="nav-link" href={href} key={href}>
              <span>{label}</span>
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <a className="nav-cta" href="#contact">
          <i aria-hidden="true" />
          Contact Us Now
          <span>
            <ArrowUpRight size={16} />
          </span>
        </a>

        <button
          className="menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
          {navItems.map(([label, href]) => (
            <a
              href={href}
              key={href}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact Us Now
          </a>
        </div>
      </header>

      <div className="hero-wrap">
        <section className="hero">
          <Image
            src="/villa/villa-exterior-night.jpg"
            alt="Riverwood Villa illuminated at night"
            fill
            priority
            sizes="100vw"
            className="hero-media"
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <h1 aria-label="Find your perfect villa today">
              {["Find your perfect", "villa today"].map((line) => (
                <span className="hero-line" key={line}>
                  <span className="hero-word">{line}</span>
                </span>
              ))}
            </h1>
            <p className="hero-copy hero-fade">
              A private riverside villa with warm rooms, open balconies, hosted
              meals, and calm tropical space for families, couples, and groups.
            </p>
            <div className="hero-actions hero-fade">
              <a className="button button-light" href="#stays">
                Explore Villa
                <span className="button-circle">
                  <ArrowUpRight size={17} />
                </span>
              </a>
              <a className="button button-glass" href="#gallery">
                View Gallery
              </a>
            </div>
            <div className="hero-lower hero-fade">
              <div className="hero-stats" aria-label="Riverwood Villa highlights">
                {heroStats.map(([number, label]) => (
                  <div className="hero-stat" key={label}>
                    <strong>{number}</strong>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <a className="scroll-cue" href="#offer" aria-label="Scroll to offer">
            <ChevronDown size={18} />
          </a>
        </section>
        <div className="rating-badge hero-fade">
          <div className="avatar-stack" aria-hidden="true">
            <Image src="/villa/villa-bedroom-canopy.jpg" alt="" width={42} height={42} />
            <Image src="/villa/villa-balcony-chair.webp" alt="" width={42} height={42} />
            <Image src="/villa/villa-terrace.webp" alt="" width={42} height={42} />
            <Image src="/villa/villa-riverside.webp" alt="" width={42} height={42} />
          </div>
          <div className="rating-copy">
            <span>10+ Featured stays</span>
            <strong>
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <em>4.9/5</em>
            </strong>
          </div>
        </div>
      </div>

      <section className="section offer-section" id="offer">
        <div className="container">
          <div className="section-heading two-column">
            <div data-animate>
              <span className="section-badge">What we offer</span>
              <h2>Comprehensive private villa experiences</h2>
            </div>
            <p data-animate>
              Riverwood offers a carefully curated stay experience: private villa
              access, warm riverside hosting, refined tropical spaces, and a
              simple path to plan your perfect visit.
            </p>
          </div>

          <div className="offer-grid">
            <div className="offer-tabs" data-animate>
              {offerTabs.map((tab, index) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    className={`offer-tab ${activeOffer === index ? "active" : ""}`}
                    key={tab.number}
                    type="button"
                    onClick={() => setActiveOffer(index)}
                  >
                    <span className="offer-number">{tab.number}</span>
                    <span className="offer-tab-copy">
                      <strong>{tab.title}</strong>
                      <small>{tab.label}</small>
                    </span>
                    <TabIcon size={24} />
                  </button>
                );
              })}
            </div>
            <article className="offer-panel" data-animate>
              <div className="offer-image">
                <Image
                  src={currentOffer.image}
                  alt={currentOffer.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 55vw"
                />
                <span>{currentOffer.label}</span>
              </div>
              <div className="offer-detail">
                <div className="icon-pill">
                  <OfferIcon size={26} />
                </div>
                <h3>{currentOffer.title}</h3>
                <p>{currentOffer.copy}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <div className="section-heading centered" data-animate>
            <span className="section-badge">Why choose us</span>
            <h2>Expert hospitality for calm, private stays</h2>
            <p>
              From boutique bedrooms and garden walks to riverside dining and
              Starlink connectivity — everything shaped around your pace and
              preferred way to stay.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <article className="service-card" key={service.title} data-animate>
                  <div className="service-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section stays-section" id="stays">
        <div className="container">
          <div className="section-heading two-column">
            <div data-animate>
              <span className="section-badge">Featured stays</span>
              <h2>Discover stays tailored to your pace and group</h2>
            </div>
            <div className="heading-action" data-animate>
              <p>
                Choose a whole-villa retreat, a suite-focused escape, or a
                hosted weekend shaped around food, family, and river quiet.
              </p>
              <a className="button button-dark" href="#contact">
                View Availability
                <span className="button-circle">
                  <ArrowUpRight size={17} />
                </span>
              </a>
            </div>
          </div>

          <div className="property-grid">
            {stays.map((stay) => (
              <article className="property-card" key={stay.title} data-animate>
                <a className="property-image-wrap" href="#contact" aria-label={`Enquire about ${stay.title}`}>
                  <Image
                    src={stay.image}
                    alt={stay.title}
                    fill
                    sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    className="property-image"
                  />
                  <span className="property-category">{stay.category}</span>
                </a>
                <div className="property-meta">
                  <span>
                    <MapPin size={16} />
                    {stay.location}
                  </span>
                  <strong>{stay.price}</strong>
                </div>
                <h3>{stay.title}</h3>
                <div className="amenities">
                  <span>
                    <BedDouble size={16} />
                    {stay.beds}
                  </span>
                  <span>
                    <Bath size={16} />
                    {stay.baths}
                  </span>
                  <span>
                    <Sparkles size={16} />
                    {stay.size}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section about-section">
        <div className="container about-grid">
          <div className="about-copy" data-animate>
            <span className="section-badge">Who we are</span>
            <h2>Redefining riverside villa hospitality</h2>
            <p>
              Riverwood Villa is built for guests who want the intimacy of a
              private home with the polish of a boutique stay. The design is
              open, tropical, and quietly luxurious without losing warmth.
            </p>
            <div className="about-stats">
              <div>
                <strong>4+</strong>
                <span>Stay modes</span>
              </div>
              <div>
                <strong>8</strong>
                <span>Image-led zones</span>
              </div>
              <div>
                <strong>24h</strong>
                <span>Enquiry support</span>
              </div>
              <div>
                <strong>90%</strong>
                <span>Slow travel mood</span>
              </div>
            </div>
          </div>
          <div className="section-image" data-animate>
            <Image
              src="/villa/villa-exterior-side-sunset.jpg"
              alt="Riverwood Villa at sunset"
              fill
              sizes="(max-width: 900px) 100vw, 36vw"
            />
          </div>
          <div className="about-features">
            {aboutFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="feature-block" key={feature.title} data-animate>
                  <div className="icon-pill">
                    <Icon size={23} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="partners-section" aria-label="Riverwood highlights">
        <div className="marquee">
          {[...Array(2)].map((_, group) => (
            <div className="marquee-group" key={group}>
              {[
                "Private villa",
                "River air",
                "Balcony mornings",
                "Hosted dining",
                "Garden walks",
                "Starlink Wi-Fi",
              ].map((item) => (
                <span key={`${group}-${item}`}>{item}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="section gallery-section" id="gallery">
        <div className="container">
          <div className="section-heading centered" data-animate>
            <span className="section-badge">Riverwood in frame</span>
            <h2>Rooms, balconies, gardens, and riverwood atmosphere</h2>
          </div>
        </div>
        <div className="gallery-marquee" aria-label="Riverwood Villa image gallery">
          {[...gallery, ...gallery].map((image, index) => (
            <figure className="gallery-item" key={`${image.src}-${index}`}>
              <Image
                src={image.src}
                alt={image.label}
                fill
                sizes="(max-width: 760px) 74vw, 360px"
              />
              <figcaption>{image.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <div className="section-heading two-column">
            <div data-animate>
              <span className="section-badge">What guests say</span>
              <h2>Trusted for privacy, loved for quiet luxury</h2>
            </div>
            <p data-animate>
              Guests return for the quiet, the warmth, and the sense of arriving
              somewhere genuinely private — not just another villa rental.
            </p>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.name} data-animate>
                <div className="stars" aria-label="Five stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="currentColor" />
                  ))}
                </div>
                <p>&ldquo;{item.quote}&rdquo;</p>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section journal-section">
        <div className="container">
          <div className="section-heading two-column">
            <div data-animate>
              <span className="section-badge">Villa notes</span>
              <h2>Explore the stay, plan the rhythm, arrive ready</h2>
            </div>
            <a className="button button-dark" href="#contact" data-animate>
              Ask a Question
              <span className="button-circle">
                <ArrowUpRight size={17} />
              </span>
            </a>
          </div>
          <div className="blog-grid">
            {journal.map((item) => (
              <article className="blog-card" key={item.title} data-animate>
                <div className="blog-image">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 760px) 100vw, 33vw"
                  />
                </div>
                <span>{item.meta}</span>
                <h3>{item.title}</h3>
                <small>
                  <Clock3 size={14} />
                  4 min read
                </small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section faq-section">
        <div className="container faq-grid">
          <div data-animate>
            <span className="section-badge">Help center</span>
            <h2>Frequently asked questions</h2>
            <p>
              Practical details before you begin the booking conversation.
            </p>
          </div>
          <div className="faq-list" data-animate>
            {faqs.map((faq, index) => (
              <button
                className={`faq-item ${activeFaq === index ? "open" : ""}`}
                key={faq.question}
                type="button"
                onClick={() => setActiveFaq(index)}
                aria-expanded={activeFaq === index}
              >
                <span className="faq-question">
                  {faq.question}
                  <span className="faq-icon">+</span>
                </span>
                <span className="faq-answer">{faq.answer}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <Image
          src="/villa/villa-exterior-night.jpg"
          alt=""
          fill
          sizes="100vw"
          className="contact-bg"
        />
        <div className="contact-overlay" />
        <div className="container contact-grid">
          <div className="contact-copy" data-animate>
            <span className="section-badge dark">Get in touch</span>
            <h2>Let&apos;s make your Riverwood stay effortless</h2>
            <p>
              Send your dates, group size, and the stay style you have in mind.
              We will help shape the practical next step.
            </p>
            <div className="contact-lines">
              <a href="tel:+94770000000">
                <Phone size={18} />
                +94 77 000 0000
              </a>
              <a href="mailto:hello@riverwoodvilla.com">
                <Mail size={18} />
                hello@riverwoodvilla.com
              </a>
              <span>
                <MapPin size={18} />
                Riverside private boutique stay
              </span>
            </div>
          </div>
          <form
            className="contact-form"
            data-animate
            action="mailto:hello@riverwoodvilla.com"
            method="post"
          >
            <div className="form-row">
              <label>
                First Name
                <input className="text-field" name="first-name" type="text" />
              </label>
              <label>
                Last Name
                <input className="text-field" name="last-name" type="text" />
              </label>
            </div>
            <label>
              Email
              <input className="text-field" name="email" type="email" />
            </label>
            <label>
              Phone
              <input className="text-field" name="phone" type="tel" />
            </label>
            <label>
              Message
              <textarea
                className="text-field"
                name="message"
                rows={4}
                defaultValue="Hi Riverwood Villa, I would like to enquire about availability."
              />
            </label>
            <button className="form-button" type="submit">
              Book a Call
              <CalendarDays size={17} />
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <h2>Riverwood Villa</h2>
            <p>
              A private riverside boutique stay for slow mornings, warm
              hosting, and tropical quiet.
            </p>
            <div className="socials">
              <a href="#" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="mailto:hello@riverwoodvilla.com" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3>Navigation</h3>
            <a href="#home">Home</a>
            <a href="#offer">Offer</a>
            <a href="#stays">Stays</a>
            <a href="#gallery">Gallery</a>
          </div>
          <div>
            <h3>Stay</h3>
            <a href="#contact">Availability</a>
            <a href="#contact">Private Booking</a>
            <a href="#contact">Dining Support</a>
            <a href="#contact">Long Stays</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="tel:+94770000000">+94 77 000 0000</a>
            <a href="mailto:hello@riverwoodvilla.com">hello@riverwoodvilla.com</a>
            <span>Riverwood Villa</span>
            <span>Sri Lanka</span>
          </div>
        </div>
        <div className="container footer-bottom">
          <span>Copyright 2026 Riverwood Villa. All rights reserved.</span>
          <a href="#home">Back to top</a>
        </div>
      </footer>
    </main>
  );
}
