import { Fragment, type ReactNode } from "react";
import { Link, useLocation } from "react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getSidebarBreadcrumbs } from "@/app/navigation";

export default function PageLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const breadcrumbs = getSidebarBreadcrumbs(location.pathname);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList className="px-6">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <Fragment key={crumb.path}>
                {index > 0 ? <BreadcrumbSeparator key={`${crumb.path}-separator`} /> : null}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.path}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {children ? <div className="min-w-0 w-full bg-white h-[calc(100vh-140px)] p-6 overflow-scroll">{children}</div> : null}
    </section>
  );
}
