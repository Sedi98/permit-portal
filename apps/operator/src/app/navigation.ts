import type { LucideIcon } from "lucide-react";
import {
  ChartLine,
  CircleHelp,
  CircleX,
  ClipboardCheck,
  ClipboardX,
  FileText,
  Home,
  Inbox,
  Medal,
  MessageSquare,
  MessagesSquare,
  PencilLine,
  RefreshCcw,
  Settings2,
  Star,
  WalletCards,
} from "lucide-react";

export type SidebarSubItem = {
  label: string;
  path: string;
};

export type SidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  badgeCount?: number;
  subItems?: SidebarSubItem[];
};

export const sidebarItems: SidebarItem[] = [
  { label: "Əsas səhifə", path: "/", icon: Home },
  { label: "Lövhə", path: "/board", icon: ChartLine },
  {
    label: "Müraciətlər",
    path: "/applications",
    icon: FileText,
    badgeCount: 3,
    subItems: [
      { label: "Yeni daxil olanlar", path: "/applications/new" },
      { label: "Yönləndirilmişlər", path: "/applications/assigned" },
      { label: "İcra edilmişlər", path: "/applications/completed" },
    ],
  },
  {
    label: "Rəy üçün sorğular",
    path: "/feedback-requests",
    icon: MessageSquare,
    badgeCount: 3,
    subItems: [
      { label: "Viza üçün", path: "/feedback-requests/viza-uchun" },
      { label: "İmza üçün", path: "/feedback-requests/imza-uchun" },
      { label: "Göndərilənlər", path: "/feedback-requests/gonderilenler" },
      { label: "Daxil olanlar", path: "/feedback-requests/daxil-olanlar" },
      { label: "Geri qaytarılanlar", path: "/feedback-requests/geri-qaytarilanlar" },
      {
        label: "Müddət uzatma sorğuları",
        path: "/feedback-requests/muddet-uzatma-sorgulari",
      },
      { label: "Vizaladıqlarım", path: "/feedback-requests/vizaladiglarim" },
      { label: "İmzaladıqlarım", path: "/feedback-requests/imzaladiglarim" },
    ],
  },
  {
    label: "Sənədin təsdiqi üçün sorğular",
    path: "/document-approval-requests",
    icon: ClipboardCheck,
  },
  {
    label: "Çatışmazlıq barədə bildirişlər",
    path: "/noncompliance-notices",
    icon: ClipboardX,
    badgeCount: 3,
    subItems: [
      { label: "Viza üçün", path: "/noncompliance-notices/viza-uchun" },
      { label: "İmza üçün", path: "/noncompliance-notices/imza-uchun" },
      { label: "Göndərilənlər", path: "/noncompliance-notices/gonderilenler" },
      { label: "Geri qaytarılanlar", path: "/noncompliance-notices/geri-qaytarilanlar" },
      { label: "Vizaladıqlarım", path: "/noncompliance-notices/vizaladiglarim" },
      { label: "İmzaladıqlarım", path: "/noncompliance-notices/imzaladiglarim" },
      {
        label: "Ümumi vizaladıqlarım",
        path: "/noncompliance-notices/umumi-vizaladiglarim",
      },
    ],
  },
  { label: "Ödənişlər", path: "/payments", icon: WalletCards },
  { label: "Xidməti məruzələr", path: "/service-reports", icon: PencilLine },
  { label: "Sərəncamların rəsmiləşməsi", path: "/orders-registration", icon: MessagesSquare },
  { label: "İmtinalar", path: "/rejections", icon: CircleX },
  { label: "Hesabatlar", path: "/reports", icon: FileText },
  {
    label: "Dayandırma, Bərpa, Ləğv etmə",
    path: "/suspension-restoration-cancellation",
    icon: RefreshCcw,
  },
  { label: "İcazələrin rəsmiləşdirilməsi", path: "/permits-registration", icon: Medal },
  { label: "Mesajlar", path: "/messages", icon: Inbox },
  { label: "Qiymətləndirmə", path: "/evaluation", icon: Star },
  {
    label: "Təklif, Şikayət, Sorğular",
    path: "/suggestions-complaints-requests",
    icon: MessagesSquare,
  },
  { label: "Sual-Cavab bazası", path: "/faq", icon: CircleHelp },
  { label: "İdarəetmə modulu", path: "/administration", icon: Settings2 },
];

export function getSidebarBreadcrumbs(pathname: string) {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");

  for (const item of sidebarItems) {
    if (normalizedPath === item.path) {
      return [{ label: item.label, path: item.path }];
    }

    const subItem = item.subItems?.find((entry) => entry.path === normalizedPath);
    if (subItem) {
      return [
        { label: item.label, path: item.path },
        { label: subItem.label, path: subItem.path },
      ];
    }
  }

  const segments = normalizedPath.split("/").filter(Boolean);
  return segments.length
    ? segments.map((segment, index) => ({
        label: segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
        path: `/${segments.slice(0, index + 1).join("/")}`,
      }))
    : [{ label: "Əsas səhifə", path: "/" }];
}
