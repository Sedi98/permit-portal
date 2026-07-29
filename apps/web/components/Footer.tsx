import { Globe2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Xidmətlər", href: "#icazələr" },
  { label: "Necə işləyir?", href: "#necə-işləyir" },
  { label: "Faq", href: "#faq" },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "YouTube", href: "https://www.youtube.com/" },
  { label: "Instagram", href: "https://www.instagram.com/" },
];

export function Footer() {
  return (
    <footer className="border-t-[0.8px] border-[#dfdfdf] bg-[#f9fafc] px-6 py-12 text-sm leading-5 md:px-10 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(140px,0.7fr)_minmax(0,1.3fr)] md:gap-12 lg:gap-20">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" aria-label="Permit Portal ana səhifə">
              <Image src="/logo.svg" alt="Azərbaycan Respublikasının Energetika Nazirliyi" width={221} height={48} />
            </Link>
            <p className="max-w-[346px] text-[#286aa6]">
              Azərbaycan Respublikasının Energetika Nazirliyi tərəfindən idarə olunan rəsmi elektron icazə platforması.
            </p>
          </div>

          <nav aria-label="Footer naviqasiyası" className="flex flex-col items-start gap-4">
            <h2 className="font-medium text-[#040b12]">Keçidlər</h2>
            <ul className="flex flex-col gap-4 text-[#286aa6]">
              {navigation.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-4">
            <h2 className="font-medium text-[#040b12]">Əlaqə</h2>
            <address className="flex flex-col gap-4 not-italic text-[#286aa6]">
              <a href="mailto:minenergy@minenergy.gov.az" className="hover:underline">minenergy@minenergy.gov.az</a>
              <a href="tel:+994125981653" className="hover:underline">(+99412) 598-16-53/54/55</a>
              <span>Bakı şəhəri, Ü.Hacıbəyli, 84 (Hökumət evi), AZ1000</span>
            </address>
            <div className="flex items-center gap-4" aria-label="Sosial şəbəkələr">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-12 items-center justify-center rounded-lg text-[#286aa6] transition-colors hover:bg-white"
                >
                  <Globe2 aria-hidden="true" className="size-5" strokeWidth={2.5} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-[#dfdfdf]" />
        <div className="flex flex-col gap-4 pt-5 text-xs leading-4 text-[#286aa6] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Energetika Nazirliyi. Bütün hüquqlar qorunur.</p>
          <div className="flex gap-5">
            <a href="#privacy" className="hover:underline">Məxfilik Siyasəti</a>
            <a href="#terms" className="hover:underline">İstifadə Şərtləri</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
