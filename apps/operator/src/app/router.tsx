import { Route, Routes } from "react-router";

import DashLayout from "@/app/layouts/DashLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
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
import ApplicationManagePage from "@/pages/(dashboard)/applications/manage";
import VisaQueueManagePage from "@/pages/(dashboard)/visa-queue/manage";
import SignQueueManagePage from "@/pages/(dashboard)/sign-queue/manage";
import UserManagePage from "@/pages/(dashboard)/users/manage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/manage/:id" element={<UserManagePage />} />

          <Route path="/applications/assigned" element={<AssignedApplicationsPage />} />
          <Route path="/applications/assigned/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/under_review" element={<UnderReviewApplicationsPage />} />
          <Route path="/applications/under_review/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/in_document_flow" element={<InDocumentFlowApplicationsPage />} />
          <Route path="/applications/in_document_flow/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/registered" element={<RegisteredApplicationsPage />} />
          <Route path="/applications/registered/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/forwarded" element={<ForwardedApplicationsPage />} />
          <Route path="/applications/forwarded/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/on_assigned" element={<DepartmentApplicationsPage />} />
          <Route path="/applications/on_assigned/manage/:id" element={<ApplicationManagePage />} />
          <Route path="/applications/completed" element={<CompletedApplicationsPage />} />
          <Route path="/applications/completed/manage/:id" element={<ApplicationManagePage />} />

          <Route path="/visa-queue" element={<VisaQueuePage />} />
          <Route path="/visa-queue/manage/:id" element={<VisaQueueManagePage />} />
          <Route path="/sign-queue" element={<SignQueuePage />} />
          <Route path="/sign-queue/manage/:id" element={<SignQueueManagePage />} />
          <Route path="/awaiting_payment" element={<AwaitingPaymentPage />} />
          <Route path="/awaiting_payment/manage/:id" element={<ApplicationManagePage />} />
        </Route>
      </Route>
    </Routes>
  );
}
