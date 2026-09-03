import { Route, Routes } from "react-router";

import DashLayout from "@/app/layouts/DashLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import ApplicationListPage from "@/components/ApplicationListPage";
import AwaitingSignaturePage from "@/pages/(dashboard)/formalization/unsigned";
import LoginPage from "@/pages/login/index";
import HomePage from "@/pages/(dashboard)/home";
import BoardPage from "@/pages/(dashboard)/board";
import UsersPage from "@/pages/(dashboard)/users";
import AssignedApplicationsPage from "@/pages/(dashboard)/applications/assigned";
import UnderReviewApplicationsPage from "@/pages/(dashboard)/applications/under_review";
import InDocumentFlowApplicationsPage from "@/pages/(dashboard)/applications/in_document_flow";
import RegisteredApplicationsPage from "@/pages/(dashboard)/applications/registered";
import ForwardedApplicationsPage from "@/pages/(dashboard)/applications/forwarded";
import DepartmentApplicationsPage from "@/pages/(dashboard)/applications/on_assigned";
import CompletedApplicationsPage from "@/pages/(dashboard)/applications/completed";
import VisaQueuePage from "@/pages/(dashboard)/visa-queue";
import SignQueuePage from "@/pages/(dashboard)/sign-queue";
import AwaitingPaymentPage from "@/pages/(dashboard)/awaiting_payment";
import ApplicationDetailPage from "@/pages/(dashboard)/applications/manage";
import ConfirmationQueuePage from "@/pages/(dashboard)/confirmations/queue";
import ConfirmationHistoryPage from "@/pages/(dashboard)/confirmations";
import PermitServiceManagePage from "@/pages/(dashboard)/permit-services/manage";
import PermitServicesPage from "@/pages/(dashboard)/permit-services";
import ServiceRatingsPage from "@/pages/(dashboard)/service-ratings";
import UserCreatePage from "@/pages/(dashboard)/users/new";
import VisaQueueManagePage from "@/pages/(dashboard)/visa-queue/manage";
import SignQueueManagePage from "@/pages/(dashboard)/sign-queue/manage";
import UserManagePage from "@/pages/(dashboard)/users/manage";
import NotificationsPage from "@/pages/(dashboard)/notifications";
import FaqsPage from "@/pages/(dashboard)/faqs";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/applications/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/assigned" element={<AssignedApplicationsPage />} />
          <Route path="/applications/assigned/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/under_review" element={<UnderReviewApplicationsPage />} />
          <Route path="/applications/under_review/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/in_document_flow" element={<InDocumentFlowApplicationsPage />} />
          <Route path="/applications/in_document_flow/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/registered" element={<RegisteredApplicationsPage />} />
          <Route path="/applications/registered/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/forwarded" element={<ForwardedApplicationsPage />} />
          <Route path="/applications/routed" element={<ForwardedApplicationsPage />} />
          <Route path="/applications/routed/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/forwarded/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/on_assigned" element={<DepartmentApplicationsPage />} />
          <Route path="/applications/on_assigned/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/applications/completed" element={<CompletedApplicationsPage />} />
          <Route path="/applications/completed/manage/:id" element={<ApplicationDetailPage />} />

          <Route path="/visa-queue" element={<VisaQueuePage />} />
          <Route path="/visa-queue/manage/:id" element={<VisaQueueManagePage />} />
          <Route path="/sign-queue" element={<SignQueuePage />} />
          <Route path="/sign-queue/manage/:id" element={<SignQueueManagePage />} />
          <Route path="/awaiting_payment" element={<AwaitingPaymentPage />} />
          <Route path="/awaiting_payment/manage/:id" element={<ApplicationDetailPage />} />
          <Route path="/confirmations/history" element={<ConfirmationHistoryPage />} />

          <Route
            path="/confirmations/deficiency/visa"
            element={<ConfirmationQueuePage title="Çatışmazlıq bildirişi — Viza üçün" type="deficiency" role="visa" />}
          />
          <Route
            path="/confirmations/deficiency/sign"
            element={<ConfirmationQueuePage title="Çatışmazlıq bildirişi — İmza üçün" type="deficiency" role="sign" />}
          />
          <Route
            path="/confirmations/report/visa"
            element={<ConfirmationQueuePage title="Xidməti məruzə — Viza üçün" type="report" role="visa" />}
          />
          <Route
            path="/confirmations/report/sign"
            element={<ConfirmationQueuePage title="Xidməti məruzə — İmza üçün" type="report" role="sign" />}
          />
          <Route
            path="/confirmations/report/approve"
            element={<ConfirmationQueuePage title="Xidməti məruzə — Təsdiqləyən" type="report" role="approve" />}
          />
          <Route
            path="/confirmations/payment/visa"
            element={<ConfirmationQueuePage title="Ödəniş — Viza üçün" type="payment" role="visa" />}
          />
          <Route
            path="/confirmations/payment/sign"
            element={<ConfirmationQueuePage title="Ödəniş — İmza üçün" type="payment" role="sign" />}
          />
          <Route path="/payments/review" element={<AwaitingPaymentPage />} />
          <Route path="/payments/review/manage/:id" element={<ApplicationDetailPage />} />
          <Route
            element={
              <ProtectedRoute allowedRoles={["super_admin", "deputy_minister"]} />
            }
          >
            <Route path="/formalization/unsigned" element={<AwaitingSignaturePage />} />
            <Route
              path="/formalization/permits"
              element={<ApplicationListPage title="İcazələr" initialStatus="completed" />}
            />
            <Route
              path="/formalization/permits/manage/:id"
              element={<ApplicationDetailPage />}
            />
            <Route path="/service-ratings" element={<ServiceRatingsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UserCreatePage />} />
            <Route path="/users/manage/:id" element={<UserManagePage />} />
            <Route path="/permit-services" element={<PermitServicesPage />} />
            <Route path="/permit-services/new" element={<PermitServiceManagePage />} />
            <Route path="/permit-services/:id" element={<PermitServiceManagePage />} />
            <Route path="/faqs" element={<FaqsPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
