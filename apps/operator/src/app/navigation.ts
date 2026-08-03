import type { LucideIcon } from "lucide-react";
import {
  ChartLine,
  CreditCard,
  FileText,
  Home,
  SignatureIcon,
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
  // Roles: all roles
  // Endpoint: GET /api/admin/permit-applications (role-scoped by backend)
  { label: "Əsas səhifə", path: "/", icon: Home, roles: allRoles },

  // Roles: all roles
  // Endpoint: GET /api/admin/statistics (role-scoped by backend)
  { label: "Lövhə", path: "/board", icon: ChartLine, roles: allRoles },

  // Roles: super_admin
  // Endpoint: user-management endpoints (documented separately)
  { label: "İstifadəçilər", path: "/users", icon: Users, roles: ["super_admin"] },

  {
    // Roles: all roles
    // Endpoint: GET /api/admin/permit-applications (status-specific below)
    label: "Müraciətlər",
    path: "/applications",
    icon: FileText,
    roles: allRoles,
    subItems: [
      // Roles: super_admin, executor
      // Endpoint: GET /api/admin/permit-applications?status=assigned
      {
        label: "Yeni daxil olanlar",
        path: "/applications/assigned",
        roles: ["super_admin", "executor"],
        endpoint: "GET /api/admin/permit-applications?status=assigned",
      },
      // Roles: super_admin, executor
      // Endpoint: GET /api/admin/permit-applications?status=under_review
      {
        label: "İcrada olanlar",
        path: "/applications/under_review",
        roles: ["super_admin", "executor"],
        endpoint: "GET /api/admin/permit-applications?status=under_review",
      },
      // Roles: super_admin, executor
      // Endpoint: GET /api/admin/permit-applications?status=in_document_flow
      {
        label: "Göndərilmişlər",
        path: "/applications/in_document_flow",
        roles: ["super_admin", "executor"],
        endpoint: "GET /api/admin/permit-applications?status=in_document_flow",
      },
      // Roles: super_admin, deputy_minister
      // Endpoint: GET /api/admin/permit-applications?status=registered
      {
        label: "Yeni (yönləndirmə gözləyir)",
        path: "/applications/registered",
        roles: ["super_admin", "deputy_minister"],
        endpoint: "GET /api/admin/permit-applications?status=registered",
      },
      // Roles: super_admin, deputy_minister, department_head
      // Endpoint: GET /api/admin/permit-applications?status=forwarded
      {
        label: "Yönləndirilmişlər",
        path: "/applications/forwarded",
        roles: ["super_admin", "deputy_minister", "department_head"],
        endpoint: "GET /api/admin/permit-applications?status=forwarded",
      },
      // Roles: super_admin, department_head
      // Endpoint: GET /api/admin/permit-applications?status=assigned,under_review,in_document_flow
      {
        label: "İcrada olanlar",
        path: "/applications/on_assigned",
        roles: ["super_admin", "department_head"],
        endpoint: "GET /api/admin/permit-applications?status=assigned,under_review,in_document_flow",
      },
      // Roles: all roles
      // Endpoint: GET /api/admin/permit-applications?status=completed
      {
        label: "İcra edilmişlər",
        path: "/applications/completed",
        roles: allRoles,
        endpoint: "GET /api/admin/permit-applications?status=completed",
      },
    ],
  },

  // Roles: super_admin, department_head
  // Endpoint: GET /api/admin/visa-queue
  {
    label: "Viza gözləyən sənədlər",
    path: "/visa-queue",
    icon: SignatureIcon,
    roles: ["super_admin", "department_head"],
    endpoint: "GET /api/admin/visa-queue",
  },

  // Roles: super_admin, deputy_minister
  // Endpoint: GET /api/admin/sign-queue
  {
    label: "İmza gözləyən sənədlər",
    path: "/sign-queue",
    icon: SignatureIcon,
    roles: ["super_admin", "deputy_minister"],
    endpoint: "GET /api/admin/sign-queue",
  },

  // Roles: super_admin, deputy_minister
  // Endpoint: GET /api/admin/permit-applications?status=awaiting_payment
  {
    label: "Ödəniş təsdiqi gözləyənlər",
    path: "/awaiting_payment",
    icon: CreditCard,
    roles: ["executor"],
    endpoint: "GET /api/admin/permit-applications?status=awaiting_payment",
  },
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
