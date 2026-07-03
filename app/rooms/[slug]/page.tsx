import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicRoomBySlug } from "@/lib/public-rooms";

export const runtime = "nodejs";

type RoomPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    room?: string;
  }>;
};

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function createBookingHref(roomSlug: string, checkIn?: string, checkOut?: string, guests?: string) {
  const params = new URLSearchParams();

  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (guests) params.set("guests", guests);
  params.set("room", roomSlug);

  const query = params.toString();
  return query ? `/?${query}#book` : "/#book";
}

function createBrowseHref(roomSlug: string, checkIn?: string, checkOut?: string, guests?: string) {
  const params = new URLSearchParams();

  if (checkIn) params.set("checkIn", checkIn);
  if (checkOut) params.set("checkOut", checkOut);
  if (guests) params.set("guests", guests);
  params.set("room", roomSlug);

  const query = params.toString();
  return query ? `/?${query}#book` : "/#rooms";
}

export default async function RoomPage({ params, searchParams }: RoomPageProps) {
  const { slug } = await params;
  const { checkIn, checkOut, guests } = await searchParams;
  const room = await getPublicRoomBySlug(slug);

  if (!room) {
    notFound();
  }

  const heroImage = room.images[0] || "/villa/villa-bedroom-high-ceiling.jpg";
  const bookingHref = createBookingHref(room.slug, checkIn, checkOut, guests);
  const browseHref = createBrowseHref(room.slug, checkIn, checkOut, guests);

  return (
    <main className="room-page">
      <section className="room-page-hero">
        <div className="room-page-copy">
          <Link href={browseHref} className="text-button" style={{ marginBottom: "2rem", padding: "0.5rem 1rem", fontSize: "0.7rem" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Link>
          <span className="room-page-eyebrow">Riverwood Villa room</span>
          <h1>{room.name}</h1>
          <p>{room.description}</p>

          <div className="room-page-stats">
            <span>{formatMoney(room.pricePerNight, room.currency)} / night</span>
            <span>{room.maxGuests} guests</span>
            <span>{room.bedrooms} bedroom</span>
            <span>{room.bathrooms} bathroom</span>
          </div>

          {(checkIn || checkOut || guests) && (
            <div className="room-page-context">
              <strong>Your stay search</strong>
              <span>
                {checkIn || "Arrival not set"} to {checkOut || "Departure not set"}
                {guests ? ` · ${guests} guest${guests === "1" ? "" : "s"}` : ""}
              </span>
            </div>
          )}

          <div className="room-page-actions">
            <Link className="room-page-button is-primary" href={bookingHref}>
              Request this room
            </Link>
            <Link className="room-page-button is-secondary" href={browseHref}>
              Back to available rooms
            </Link>
          </div>
        </div>

        <div className="room-page-hero-media">
          <Image
            src={heroImage}
            alt={room.name}
            fill
            priority
            sizes="(max-width: 980px) 100vw, 52vw"
          />
        </div>
      </section>

      <section className="room-page-gallery" aria-labelledby="room-gallery-title">
        <div className="room-page-section-heading">
          <span className="section-index">Gallery</span>
          <h2 id="room-gallery-title">Room images</h2>
        </div>

        <div className="room-gallery-grid">
          {room.images.map((image, index) => (
            <figure className={`room-gallery-card ${index === 0 ? "is-featured" : ""}`} key={`${image}-${index}`}>
              <div className="room-gallery-media">
                <Image
                  src={image}
                  alt={`${room.name} image ${index + 1}`}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            </figure>
          ))}
        </div>
      </section>

      <section className="room-page-details" aria-labelledby="room-details-title">
        <div className="room-page-section-heading">
          <span className="section-index">Details</span>
          <h2 id="room-details-title">What this room includes</h2>
        </div>

        <div className="room-details-grid">
          <article>
            <h3>Overview</h3>
            <p>{room.shortDescription || room.description}</p>
          </article>

          <article>
            <h3>Amenities</h3>
            <ul className="room-amenities-list">
              {room.amenities.map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  );
}
