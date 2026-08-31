import {
  Bell,
  ChevronDown,
  LogOut,
  Settings2,
  UserRound,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/features/auth/hooks";
import { useUnreadNotificationsCount } from "@/features/notifications/hooks";

const menuItems = [
  // { label: "Profilim", icon: UserRound },
  // { label: "Ayarlar", icon: Settings2 },
  { label: "Çıxış", icon: LogOut, destructive: true },
] as const;

export default function Header() {
  const navigate = useNavigate();
  const menuId = useId();
  const { data: me } = useMe();
  const unreadCountQuery = useUnreadNotificationsCount();
  const unreadCount = unreadCountQuery.data?.data.count ?? 0;
  const logout = useLogout();
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="rounded-none bg-white px-6 py-3 lg:px-8">
      <div className="flex min-h-[48px] items-center justify-between gap-6">
        <h1 className="text-[16px] font-semibold leading-6 tracking-[-0.01em] text-[#1f1f1f]">
          Energetika Nazirliyi - Operator İdarəetmə Sistemi
        </h1>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={
              unreadCount > 0
                ? `Bildirişlər, ${unreadCount} oxunmamış bildiriş`
                : "Bildirişlər"
            }
            className="relative inline-flex size-12 items-center justify-center rounded-lg border border-[#dfdfdf] bg-white text-[#286aa6] transition-colors hover:bg-[#f7f9fc]"
            onClick={() => navigate("/notifications")}
          >
            <Bell className="size-6" />
            {unreadCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold leading-none text-white"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls={menuId}
              className={cn(
                "inline-flex h-12 w-[200px] items-center justify-between rounded-lg border border-[#dfdfdf] bg-white px-4 text-left transition-colors",
                open && "bg-[#f8fbfe]"
              )}
              onClick={() => setOpen((current) => !current)}
            >
              <span className="min-w-0 flex-1 truncate text-[16px] font-semibold leading-6 text-[#286aa6]">
                {me?.data?.name ?? "İstifadəçi"}
              </span>
              <ChevronDown
                className={cn("size-5 shrink-0 text-[#286aa6] transition-transform", open && "rotate-180")}
              />
            </button>

            {open ? (
              <div
                id={menuId}
                role="menu"
                aria-label="İstifadəçi menyusu"
                className="absolute right-0 top-full z-20 mt-3 w-[220px] rounded-2xl border border-[#e6edf5] bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.14)]"
              >
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    "destructive" in item && item.destructive
                          ? "text-[#c2410c] hover:bg-[#fff4ed]"
                          : "text-[#1f1f1f] hover:bg-[#f7f9fc]"
                  )}
                  onClick={() => {
                    if (item.label === "Çıxış") {
                      logout.mutate();
                    } else {
                      setOpen(false);
                    }
                  }}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
