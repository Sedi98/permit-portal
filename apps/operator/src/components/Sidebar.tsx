import {
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import { cn } from "@/lib/utils";
import { sidebarItems } from "@/app/navigation";

function SidebarItem({
  item,
  isOpen,
  onToggle,
  isActiveRoute,
}: {
  item: (typeof sidebarItems)[number];
  isOpen: boolean;
  onToggle: () => void;
  isActiveRoute: boolean;
}) {
  const Icon = item.icon;
  const hasSubItems = Boolean(item.subItems?.length);
  const baseButtonClass = cn(
    "flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left transition-colors",
    isActiveRoute || isOpen
      ? "bg-[#eef4fb] text-[#286aa6]"
      : "text-[#1f1f1f] hover:bg-[#f7f9fc]"
  );

  return (
    <li>
      {hasSubItems ? (
        <button type="button" aria-expanded={isOpen} className={baseButtonClass} onClick={onToggle}>
          <Icon
            className={cn(
              "size-5 shrink-0",
              isActiveRoute || isOpen ? "text-[#286aa6]" : "text-[#767676]"
            )}
          />

          <span
            className={cn(
              "min-w-0 flex-1 text-[16px] leading-6",
              isActiveRoute || isOpen ? "font-semibold text-[#286aa6]" : "font-normal"
            )}
          >
            {item.label}
          </span>

          <span
            className={cn(
              "ml-2 flex items-center gap-2",
              isActiveRoute || isOpen ? "text-[#286aa6]" : "text-[#767676]"
            )}
          >
            {/* {isOpen ? (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-[#d0def0] bg-white px-1 text-[14px] leading-none font-normal text-[#286aa6]">
                {item.badgeCount ?? 0}
              </span>
            ) : null} */}
            <ChevronDown className="size-4" />
          </span>
        </button>
      ) : (
        <NavLink
          to={item.path}
          end
          className={({ isActive }) =>
            cn(
              "flex w-full items-center gap-3 rounded-[12px] px-3 py-2 text-left transition-colors",
              isActive
                ? "bg-[#eef4fb] text-[#286aa6]"
                : "text-[#1f1f1f] hover:bg-[#f7f9fc]"
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn("size-5 shrink-0", isActive ? "text-[#286aa6]" : "text-[#767676]")} />

              <span
                className={cn(
                  "min-w-0 flex-1 text-[16px] leading-6",
                  isActive ? "font-semibold text-[#286aa6]" : "font-normal"
                )}
              >
                {item.label}
              </span>

              <ChevronDown className="size-4 text-[#767676] opacity-0" aria-hidden="true" />
            </>
          )}
        </NavLink>
      )}

      {hasSubItems && isOpen ? (
        <div className="mt-3 ml-3 border-l border-[#dfdfdf] pl-3">
          <div className="space-y-2">
            {item.subItems?.map((subItem) => (
              <NavLink
                key={subItem.path}
                to={subItem.path}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-center gap-3 rounded-sm px-2 py-1.5 text-left text-[14px] leading-5 transition-colors",
                    isActive ? "bg-[#f9fbfd] text-[#286aa6]" : "text-[#787878]"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        isActive ? "bg-[#286aa6]" : "bg-[#8a8a8a]"
                      )}
                    />
                    <span className="min-w-0 flex-1 font-normal">{subItem.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ) : null}
    </li>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const [manualOpenPath, setManualOpenPath] = useState<string | null>(null);

  return (
    <aside className="flex w-[300px] flex-col bg-white px-6 pt-6 pb-8 text-[#1f1f1f] border-r border-[#dfdfdf] h-dvh overflow-scroll">
      <img
        src="/logo.svg"
        alt="Azərbaycan Respublikası Energetika Nazirliyi"
        className="h-12 w-[220.8px] shrink-0 object-contain"
      />

      <nav aria-label="Primary" className="mt-10">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const hasSubItems = Boolean(item.subItems?.length);
            const isRouteActive =
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            const isOpen = hasSubItems && (manualOpenPath === item.path || isRouteActive);

            return (
              <SidebarItem
                key={item.path}
                item={item}
                isOpen={Boolean(isOpen)}
                isActiveRoute={isRouteActive}
                onToggle={() => {
                  if (hasSubItems) {
                    setManualOpenPath((current) => (current === item.path ? null : item.path));
                  }
                }}
              />
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
