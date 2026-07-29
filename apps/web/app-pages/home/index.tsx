import { Faq } from "@/app-pages/home/sections/Faq";
import { Hero } from "@/app-pages/home/sections/Hero";
import { HowItWorks } from "@/app-pages/home/sections/HowItWorks";
import { Permissions } from "@/app-pages/home/sections/Permissions";

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "İcazə Portalı",
      description:
        "Energetika sahəsində elektron icazə xidmətləri və onlayn müraciət platforması.",
      inLanguage: "az",
    },
    {
      "@type": "GovernmentOrganization",
      name: "Azərbaycan Respublikasının Energetika Nazirliyi",
      description:
        "Energetika sahəsində elektron icazə xidmətlərini təqdim edən dövlət qurumu.",
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <Hero />
      <Permissions />
      <HowItWorks />
      <Faq />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData) }}
      />
    </main>
  );
}
