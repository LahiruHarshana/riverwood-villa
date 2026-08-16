import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  image: string;
  imageAlt: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  image,
  imageAlt,
  secondaryHref,
  secondaryLabel,
}: PageHeroProps) {
  return (
    <section className="mp-hero" aria-labelledby="page-title">
      <Image src={image} alt={imageAlt} fill priority sizes="100vw" />
      <div className="mp-hero-shade" />
      <div className="mp-hero-copy">
        <span className="mp-eyebrow">{eyebrow}</span>
        <h1 id="page-title">{title}</h1>
        <p>{description}</p>
        <div className="mp-hero-actions">
          <Link className="mp-button is-light" href="/#book">Check availability <ArrowDownRight size={16} /></Link>
          {secondaryHref && secondaryLabel ? (
            <Link className="mp-text-link is-light" href={secondaryHref}>{secondaryLabel}</Link>
          ) : null}
        </div>
      </div>
      <div className="mp-hero-location">Pelana · Weligama · Sri Lanka</div>
    </section>
  );
}
