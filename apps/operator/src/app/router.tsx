import { lazy, Suspense, type ReactNode } from "react";
import { Route, Routes } from "react-router";

import DashLayout from "@/app/layouts/DashLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ApplicationDetailPageSkeleton from "@/components/skeletons/ApplicationDetailPageSkeleton";
import ApplicationListPageSkeleton from "@/components/skeletons/ApplicationListPageSkeleton";
import {
  AwaitingSignaturePageSkeleton,
  BoardPageSkeleton,
  ConfirmationHistoryPageSkeleton,
  ConfirmationQueuePageSkeleton,
  ContactSettingsPageSkeleton,
  FaqsPageSkeleton,
  HomePageSkeleton,
  LoginPageSkeleton,
  NotificationsPageSkeleton,
  PermitServiceManagePageSkeleton,
  PermitServicesPageSkeleton,
  ReportsPageSkeleton,
  ServiceRatingsPageSkeleton,
  SignQueueManagePageSkeleton,
  SignQueuePageSkeleton,
  UserCreatePageSkeleton,
  UserManagePageSkeleton,
  UsersPageSkeleton,
  VisaQueueManagePageSkeleton,
  VisaQueuePageSkeleton,
} from "@/components/skeletons/PageSkeletons";

const ApplicationListPage = lazy(() => import("@/components/ApplicationListPage"));
const ApplicationDetailPage = lazy(() => import("@/pages/(dashboard)/applications/manage"));
const AssignedApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/assigned"));
const UnderReviewApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/under_review"));
const InDocumentFlowApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/in_document_flow"));
const RegisteredApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/registered"));
const ForwardedApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/forwarded"));
const DepartmentApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/on_assigned"));
const CompletedApplicationsPage = lazy(() => import("@/pages/(dashboard)/applications/completed"));
const AwaitingPaymentPage = lazy(() => import("@/pages/(dashboard)/awaiting_payment"));
const AwaitingSignaturePage = lazy(() => import("@/pages/(dashboard)/formalization/unsigned"));
const BoardPage = lazy(() => import("@/pages/(dashboard)/board"));
const ConfirmationHistoryPage = lazy(() => import("@/pages/(dashboard)/confirmations"));
const ConfirmationQueuePage = lazy(() => import("@/pages/(dashboard)/confirmations/queue"));
const ContactSettingsPage = lazy(() => import("@/pages/(dashboard)/contact-settings"));
const FaqsPage = lazy(() => import("@/pages/(dashboard)/faqs"));
const HomePage = lazy(() => import("@/pages/(dashboard)/home"));
const LoginPage = lazy(() => import("@/pages/login"));
const NotificationsPage = lazy(() => import("@/pages/(dashboard)/notifications"));
const PermitServiceManagePage = lazy(() => import("@/pages/(dashboard)/permit-services/manage"));
const PermitServicesPage = lazy(() => import("@/pages/(dashboard)/permit-services"));
const ReportsPage = lazy(() => import("@/pages/(dashboard)/reports"));
const ServiceRatingsPage = lazy(() => import("@/pages/(dashboard)/service-ratings"));
const SignQueueManagePage = lazy(() => import("@/pages/(dashboard)/sign-queue/manage"));
const SignQueuePage = lazy(() => import("@/pages/(dashboard)/sign-queue"));
const UserCreatePage = lazy(() => import("@/pages/(dashboard)/users/new"));
const UserManagePage = lazy(() => import("@/pages/(dashboard)/users/manage"));
const UsersPage = lazy(() => import("@/pages/(dashboard)/users"));
const VisaQueueManagePage = lazy(() => import("@/pages/(dashboard)/visa-queue/manage"));
const VisaQueuePage = lazy(() => import("@/pages/(dashboard)/visa-queue"));

function LazyRoute({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}

function ApplicationListRoute({
  children,
  title,
  showStatus = false,
}: {
  children: ReactNode;
  title: string;
  showStatus?: boolean;
}) {
  return (
    <Suspense fallback={<ApplicationListPageSkeleton title={title} showStatus={showStatus} />}>
      {children}
    </Suspense>
  );
}

function ApplicationDetailRoute() {
  return (
    <Suspense fallback={<ApplicationDetailPageSkeleton />}>
      <ApplicationDetailPage />
    </Suspense>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LazyRoute fallback={<LoginPageSkeleton />}><LoginPage /></LazyRoute>} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashLayout />}>
          <Route index element={<LazyRoute fallback={<HomePageSkeleton />}><HomePage /></LazyRoute>} />
          <Route path="/board" element={<LazyRoute fallback={<BoardPageSkeleton />}><BoardPage /></LazyRoute>} />
          <Route path="/notifications" element={<LazyRoute fallback={<NotificationsPageSkeleton />}><NotificationsPage /></LazyRoute>} />
          <Route path="/applications/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/assigned" element={<ApplicationListRoute title="Yeni daxil olanlar"><AssignedApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/assigned/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/under_review" element={<ApplicationListRoute title="İcrada olanlar"><UnderReviewApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/under_review/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/in_document_flow" element={<ApplicationListRoute title="Göndərilmişlər"><InDocumentFlowApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/in_document_flow/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/registered" element={<ApplicationListRoute title="Yeni (yönləndirmə gözləyir)"><RegisteredApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/registered/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/forwarded" element={<ApplicationListRoute title="Yönləndirdiklərim"><ForwardedApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/routed" element={<ApplicationListRoute title="Yönləndirdiklərim"><ForwardedApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/routed/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/forwarded/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/on_assigned" element={<ApplicationListRoute title="İcrada olanlar" showStatus><DepartmentApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/on_assigned/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/applications/completed" element={<ApplicationListRoute title="İcra edilmişlər"><CompletedApplicationsPage /></ApplicationListRoute>} />
          <Route path="/applications/completed/manage/:id" element={<ApplicationDetailRoute />} />

          <Route path="/visa-queue" element={<LazyRoute fallback={<VisaQueuePageSkeleton />}><VisaQueuePage /></LazyRoute>} />
          <Route path="/visa-queue/manage/:id" element={<LazyRoute fallback={<VisaQueueManagePageSkeleton />}><VisaQueueManagePage /></LazyRoute>} />
          <Route path="/sign-queue" element={<LazyRoute fallback={<SignQueuePageSkeleton />}><SignQueuePage /></LazyRoute>} />
          <Route path="/sign-queue/manage/:id" element={<LazyRoute fallback={<SignQueueManagePageSkeleton />}><SignQueueManagePage /></LazyRoute>} />
          <Route path="/awaiting_payment" element={<ApplicationListRoute title="Təsdiq olunan ödənişlər"><AwaitingPaymentPage /></ApplicationListRoute>} />
          <Route path="/awaiting_payment/manage/:id" element={<ApplicationDetailRoute />} />
          <Route path="/confirmations/history" element={<LazyRoute fallback={<ConfirmationHistoryPageSkeleton />}><ConfirmationHistoryPage /></LazyRoute>} />
          <Route path="/reports" element={<LazyRoute fallback={<ReportsPageSkeleton />}><ReportsPage /></LazyRoute>} />

          <Route
            path="/confirmations/deficiency/visa"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Çatışmazlıq bildirişi — Viza üçün" type="deficiency" role="visa" /></LazyRoute>}
          />
          <Route
            path="/confirmations/deficiency/sign"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Çatışmazlıq bildirişi — İmza üçün" type="deficiency" role="sign" /></LazyRoute>}
          />
          <Route
            path="/confirmations/report/visa"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Xidməti məruzə — Viza üçün" type="report" role="visa" /></LazyRoute>}
          />
          <Route
            path="/confirmations/report/sign"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Xidməti məruzə — İmza üçün" type="report" role="sign" /></LazyRoute>}
          />
          <Route
            path="/confirmations/report/approve"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Xidməti məruzə — Təsdiqləyən" type="report" role="approve" /></LazyRoute>}
          />
          <Route
            path="/confirmations/payment/visa"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Ödəniş — Viza üçün" type="payment" role="visa" /></LazyRoute>}
          />
          <Route
            path="/confirmations/payment/sign"
            element={<LazyRoute fallback={<ConfirmationQueuePageSkeleton />}><ConfirmationQueuePage title="Ödəniş — İmza üçün" type="payment" role="sign" /></LazyRoute>}
          />
          <Route path="/payments/review" element={<ApplicationListRoute title="Təsdiq olunan ödənişlər"><AwaitingPaymentPage /></ApplicationListRoute>} />
          <Route path="/payments/review/manage/:id" element={<ApplicationDetailRoute />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["super_admin", "deputy_minister"]} />
            }
          >
            <Route path="/formalization/unsigned" element={<LazyRoute fallback={<AwaitingSignaturePageSkeleton />}><AwaitingSignaturePage /></LazyRoute>} />
            <Route
              path="/formalization/permits"
              element={
                <ApplicationListRoute title="İcazələr">
                  <ApplicationListPage title="İcazələr" initialStatus="completed" />
                </ApplicationListRoute>
              }
            />
            <Route
              path="/formalization/permits/manage/:id"
              element={<ApplicationDetailRoute />}
            />
            <Route path="/service-ratings" element={<LazyRoute fallback={<ServiceRatingsPageSkeleton />}><ServiceRatingsPage /></LazyRoute>} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
            <Route path="/users" element={<LazyRoute fallback={<UsersPageSkeleton />}><UsersPage /></LazyRoute>} />
            <Route path="/users/new" element={<LazyRoute fallback={<UserCreatePageSkeleton />}><UserCreatePage /></LazyRoute>} />
            <Route path="/users/manage/:id" element={<LazyRoute fallback={<UserManagePageSkeleton />}><UserManagePage /></LazyRoute>} />
            <Route path="/permit-services" element={<LazyRoute fallback={<PermitServicesPageSkeleton />}><PermitServicesPage /></LazyRoute>} />
            <Route path="/permit-services/new" element={<LazyRoute fallback={<PermitServiceManagePageSkeleton />}><PermitServiceManagePage /></LazyRoute>} />
            <Route path="/permit-services/:id" element={<LazyRoute fallback={<PermitServiceManagePageSkeleton />}><PermitServiceManagePage /></LazyRoute>} />
            <Route path="/faqs" element={<LazyRoute fallback={<FaqsPageSkeleton />}><FaqsPage /></LazyRoute>} />
            <Route path="/contact-settings" element={<LazyRoute fallback={<ContactSettingsPageSkeleton />}><ContactSettingsPage /></LazyRoute>} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
