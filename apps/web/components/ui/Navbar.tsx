"use client";

import { Bell, BookOpen, ChevronDown, FileText, LogOut, Menu, PhoneCall, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const links = [
  { label: "İcazələr", href: "#icazələr" },
  { label: "Necə işləyir?", href: "#necə-işləyir" },
  { label: "Faq", href: "#faq" },
];

export function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => setAuthenticated(document.cookie.includes("permit_portal_authenticated=1"));
    checkAuth();
    window.addEventListener("portal-auth-change", checkAuth);
    return () => window.removeEventListener("portal-auth-change", checkAuth);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/session", { method: "DELETE" });
    setAuthenticated(false);
    setProfileOpen(false);
    window.location.assign("/");
  }

  return (
    <header className="relative z-50 h-20 w-full border-b border-slate-100 bg-white">
      <div className="mx-auto flex h-full w-full items-center justify-between px-6 md:px-20">
        <Link href="/" aria-label="Permit Portal ana səhifə" className="shrink-0">
          <Image src="/logo.svg" alt="Azərbaycan Respublikasının Energetika Nazirliyi" width={221} height={48} priority />
        </Link>

        <nav aria-label="Əsas naviqasiya" className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex flex-col gap-0.5 p-2 text-base font-normal leading-6 text-[#1f1f1f] transition-colors hover:text-[#286aa6]"
            >
              {link.label}
              <span className="h-0.5 w-0 rounded-full bg-[#286aa6] transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a href="tel:974" className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#286aa6]">
            <PhoneCall aria-hidden="true" className="size-6" strokeWidth={1.7} />
            <span>974</span>
          </a>
          {authenticated ? (
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <div className="flex items-center gap-2 rounded-lg border border-[#dfdfdf] bg-white p-1.5 pl-3">
                <span className="text-base font-semibold leading-6 text-[#286aa6]">İstifadəçi</span>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Profil menyusunu aç"
                    className="flex size-9 items-center justify-center rounded-lg text-[#286aa6] hover:bg-[#eaf3fa]"
                  >
                    <ChevronDown className={`size-5 transition-transform ${profileOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                </PopoverTrigger>
              </div>
              <PopoverContent align="end" sideOffset={8} className="w-60 rounded-xl border-0 bg-white p-2 shadow-lg">
                <ProfileMenu onLogout={() => void handleLogout()} />
              </PopoverContent>
            </Popover>
          ) : (
            <a href="/login" className="rounded-lg bg-[#286aa6] px-4 py-3 text-base font-semibold leading-6 text-white transition-colors hover:bg-[#1f5688]">
              Portala giriş
            </a>
          )}
        </div>

        <button
          type="button"
          aria-label="Menyunu aç"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
          className="flex size-11 items-center justify-center rounded-lg text-[#286aa6] hover:bg-slate-50 md:hidden"
        >
          <Menu aria-hidden="true" className="size-6" />
        </button>
      </div>

      {sidebarOpen ? (
        <>
          <button
            type="button"
            aria-label="Menyunu bağla"
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 top-20 bg-slate-950/30 md:hidden"
          />
          <aside className="fixed right-0 top-0 flex h-full w-[min(20rem,85vw)] flex-col bg-white p-6 shadow-2xl md:hidden" aria-label="Mobil naviqasiya">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-[#1f1f1f]">Menyu</span>
              <button
                type="button"
                aria-label="Menyunu bağla"
                onClick={() => setSidebarOpen(false)}
                className="flex size-10 items-center justify-center rounded-lg text-[#286aa6] hover:bg-slate-50"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <nav aria-label="Mobil əsas naviqasiya" className="mt-8 flex flex-col gap-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-normal leading-6 text-[#1f1f1f] hover:bg-slate-50 hover:text-[#286aa6]"
                >
                  {link.label}
                </a>
              ))}
              <a href="tel:974" className="mt-4 flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold leading-6 text-[#286aa6]">
                <PhoneCall aria-hidden="true" className="size-5" strokeWidth={1.7} />
                974
              </a>
              {authenticated ? (
                <>
                  <span className="mt-4 px-3 text-base font-semibold leading-6 text-[#286aa6]">İstifadəçi</span>
                  <ProfileMenu onLogout={() => void handleLogout()} mobile />
                </>
              ) : (
                <a href="/login" className="mt-2 rounded-lg bg-[#286aa6] px-4 py-3 text-center text-base font-semibold leading-6 text-white hover:bg-[#1f5688]">
                  Portala giriş
                </a>
              )}
            </nav>
          </aside>
        </>
      ) : null}
    </header>
  );
}

function ProfileMenu({ onLogout, mobile = false }: { onLogout: () => void; mobile?: boolean }) {
  return (
    <div className={`${mobile ? "mt-2" : ""} flex flex-col gap-3 rounded-xl bg-white p-0`}>
      <a href="/muracietlerim" className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#286aa6] hover:bg-[#eaf3fa]"><FileText className="size-6" aria-hidden="true" />Müraciətlərim</a>
      <a href="/qaralamalar" className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#286aa6] hover:bg-[#eaf3fa]"><BookOpen className="size-6" aria-hidden="true" />Qaralamalar</a>
      <a href="/bildirisler" className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-semibold leading-6 text-[#286aa6] hover:bg-[#eaf3fa]"><Bell className="size-6" aria-hidden="true" /><span className="flex-1">Bildirişlər</span><span className="rounded-full bg-[#286aa6] px-2 py-0.5 text-sm font-medium leading-5 text-white">2</span></a>
      <div className="border-t border-[#dfdfdf] pt-3"><button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#fef1f1] px-4 py-3 text-base font-semibold leading-6 text-[#f32020] hover:bg-[#fde3e3]"><LogOut className="size-6" aria-hidden="true" />Çıxış et</button></div>
    </div>
  );
}
