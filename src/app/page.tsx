import { site } from "@/config/site";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { FeaturedBot } from "@/components/sections/featured-bot";
import { MarketMonitor } from "@/components/sections/market-monitor";
import { Research } from "@/components/sections/research";
import { OpenAccount } from "@/components/sections/open-account";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { RevealObserver } from "@/components/ui/reveal-observer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  description: site.description,
  jobTitle: site.role,
  sameAs: [site.contact.linkedin, site.contact.github],
  knowsAbout: ["Financial markets", "Quantitative finance", "Algorithmic trading", "Python", "Financial technology"],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="contenido">
        <Hero />
        <About />
        <FeaturedBot />
        <MarketMonitor />
        <Research />
        <OpenAccount />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
