import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteMotion } from "@/components/site/SiteMotion";

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="marketing-site">
      <SiteHeader />
      {children}
      <SiteFooter />
      <SiteMotion />
    </div>
  );
}
