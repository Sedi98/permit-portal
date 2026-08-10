import type { LucideIcon } from "lucide-react";
import {
  ChartLine,
  CircleCheckBig,
  CreditCard,
  FileText,
  Home,
  Package,
  SignatureIcon,
  Star,
  Users,
} from "lucide-react";

export type Role =
  | "super_admin"
  | "executor"
  | "deputy_minister"
  | "department_head";

export type SidebarSubItem = {
  label: string;
  path: string;
  roles?: Role[];
  endpoint?: string;
};

export type SidebarItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: Role[];
  endpoint?: string;
  subItems?: SidebarSubItem[];
};

const allRoles: Role[] = [
  "super_admin",
  "executor",
  "deputy_minister",
  "department_head",
];

export const sidebarItems: SidebarItem[] = [
  { label: "Əsas səhifə", path: "/", icon: Home, roles: allRoles },
  { label: "Lövhə", path: "/board", icon: ChartLine, roles: allRoles },
  {
    label: "Müraciətlər",
    path: "/applications",
    icon: FileText,
    roles: allRoles,
    subItems: [
      {
        label: "Yeni daxil olanlar",
        path: "/applications/assigned",
        roles: allRoles,
        endpoint: "GET /api/admin/permit-applications?status=registered|assigned",
      },
      {
        label: "Yönləndirdiklərim",
        path: "/applications/routed",
        roles: allRoles,
        endpoint: "GET /api/admin/permit-applications?status_group=routed_by_me",
      },
      {
        label: "İcra edilmişlər",
        path: "/applications/completed",
        roles: allRoles,
        endpoint: "GET /api/admin/permit-applications?status=completed",
      },
    ],
  },
  {
    label: "Çatışmazlıq haqqında bildiriş",
    path: "/confirmations/deficiency",
    icon: SignatureIcon,
    roles: allRoles,
    subItems: [
      { label: "Viza üçün", path: "/confirmations/deficiency/visa", roles: allRoles },
      { label: "İmza üçün", path: "/confirmations/deficiency/sign", roles: allRoles },
    ],
  },
  {
    label: "Xidməti məruzə",
    path: "/confirmations/report",
    icon: SignatureIcon,
    roles: allRoles,
    subItems: [
      { label: "Viza üçün", path: "/confirmations/report/visa", roles: allRoles },
      { label: "İmza üçün", path: "/confirmations/report/sign", roles: allRoles },
      { label: "Təsdiqləyən", path: "/confirmations/report/approve", roles: allRoles },
    ],
  },
  {
    label: "Ödənişlər",
    path: "/payments",
    icon: CreditCard,
    roles: allRoles,
    subItems: [
      { label: "Viza üçün", path: "/confirmations/payment/visa", roles: allRoles },
      { label: "İmza üçün", path: "/confirmations/payment/sign", roles: allRoles },
      { label: "Təsdiq olunanlar", path: "/payments/review", roles: allRoles },
    ],
  },
  {
    label: "İcazələrin rəsmiləşdirilməsi",
    path: "/formalization",
    icon: CircleCheckBig,
    roles: ["super_admin", "deputy_minister"],
    subItems: [
      {
        label: "İmzalanmamışlar",
        path: "/formalization/unsigned",
        roles: ["super_admin", "deputy_minister"],
      },
      {
        label: "İcazələr",
        path: "/formalization/permits",
        roles: ["super_admin", "deputy_minister"],
      },
    ],
  },
  {
    label: "Xidmət məmnuniyyəti",
    path: "/service-ratings",
    icon: Star,
    roles: ["super_admin", "deputy_minister"],
  },
  { label: "İstifadəçilər", path: "/users", icon: Users, roles: ["super_admin"] },
  { label: "İcazələr (növlər)", path: "/permit-services", icon: Package, roles: ["super_admin"] },
];

export function getVisibleSidebarItems(userRole: Role | undefined) {
  return sidebarItems
    .map((item) => {
      if (item.roles && (!userRole || !item.roles.includes(userRole))) return null;

      const subItems = item.subItems?.filter(
        (subItem) => !subItem.roles || (!!userRole && subItem.roles.includes(userRole)),
      );

      if (item.subItems && !subItems?.length) return null;

      return item.subItems ? { ...item, subItems } : item;
    })
    .filter((item): item is SidebarItem => item !== null);
}

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
