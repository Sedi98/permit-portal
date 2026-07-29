import { Routes, Route } from "react-router";

import DashLayout from '@/app/layouts/DashLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import LoginPage from '@/pages/login/index';
import HomePage from '@/pages/(dashboard)/home';
import BoardPage from "@/pages/(dashboard)/board";
import ApplicationsPage from "@/pages/(dashboard)/applications";
import NewApplicationsPage from "@/pages/(dashboard)/applications/new";
import AssignedApplicationsPage from "@/pages/(dashboard)/applications/assigned";
import CompletedApplicationsPage from "@/pages/(dashboard)/applications/completed";
import FeedbackRequestsPage from "@/pages/(dashboard)/feedback-requests";
import FeedbackRequestsVizaUchunPage from "@/pages/(dashboard)/feedback-requests/viza-uchun";
import FeedbackRequestsImzaUchunPage from "@/pages/(dashboard)/feedback-requests/imza-uchun";
import FeedbackRequestsGonderilenlerPage from "@/pages/(dashboard)/feedback-requests/gonderilenler";
import FeedbackRequestsDaxilOlanlarPage from "@/pages/(dashboard)/feedback-requests/daxil-olanlar";
import FeedbackRequestsGeriQaytarilanlarPage from "@/pages/(dashboard)/feedback-requests/geri-qaytarilanlar";
import FeedbackRequestsMuddetUzatmaSorgulariPage from "@/pages/(dashboard)/feedback-requests/muddet-uzatma-sorgulari";
import FeedbackRequestsVizaladiglarimPage from "@/pages/(dashboard)/feedback-requests/vizaladiglarim";
import FeedbackRequestsImzaladiglarimPage from "@/pages/(dashboard)/feedback-requests/imzaladiglarim";
import DocumentApprovalRequestsPage from "@/pages/(dashboard)/document-approval-requests";
import NoncomplianceNoticesPage from "@/pages/(dashboard)/noncompliance-notices";
import NoncomplianceNoticesVizaUchunPage from "@/pages/(dashboard)/noncompliance-notices/viza-uchun";
import NoncomplianceNoticesImzaUchunPage from "@/pages/(dashboard)/noncompliance-notices/imza-uchun";
import NoncomplianceNoticesGonderilenlerPage from "@/pages/(dashboard)/noncompliance-notices/gonderilenler";
import NoncomplianceNoticesGeriQaytarilanlarPage from "@/pages/(dashboard)/noncompliance-notices/geri-qaytarilanlar";
import NoncomplianceNoticesVizaladiglarimPage from "@/pages/(dashboard)/noncompliance-notices/vizaladiglarim";
import NoncomplianceNoticesImzaladiglarimPage from "@/pages/(dashboard)/noncompliance-notices/imzaladiglarim";
import NoncomplianceNoticesUmumiVizaladiglarimPage from "@/pages/(dashboard)/noncompliance-notices/umumi-vizaladiglarim";
import PaymentsPage from "@/pages/(dashboard)/payments";
import ServiceReportsPage from "@/pages/(dashboard)/service-reports";
import OrdersRegistrationPage from "@/pages/(dashboard)/orders-registration";
import RejectionsPage from "@/pages/(dashboard)/rejections";
import ReportsPage from "@/pages/(dashboard)/reports";
import SuspensionRestorationCancellationPage from "@/pages/(dashboard)/suspension-restoration-cancellation";
import PermitsRegistrationPage from "@/pages/(dashboard)/permits-registration";
import MessagesPage from "@/pages/(dashboard)/messages";
import EvaluationPage from "@/pages/(dashboard)/evaluation";
import SuggestionsComplaintsRequestsPage from "@/pages/(dashboard)/suggestions-complaints-requests";
import FaqPage from "@/pages/(dashboard)/faq";
import AdministrationPage from "@/pages/(dashboard)/administration";


export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/board" element={<BoardPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/new" element={<NewApplicationsPage />} />
          <Route path="/applications/assigned" element={<AssignedApplicationsPage />} />
          <Route path="/applications/completed" element={<CompletedApplicationsPage />} />
          <Route path="/feedback-requests" element={<FeedbackRequestsPage />} />
          <Route path="/feedback-requests/viza-uchun" element={<FeedbackRequestsVizaUchunPage />} />
          <Route path="/feedback-requests/imza-uchun" element={<FeedbackRequestsImzaUchunPage />} />
          <Route path="/feedback-requests/gonderilenler" element={<FeedbackRequestsGonderilenlerPage />} />
          <Route path="/feedback-requests/daxil-olanlar" element={<FeedbackRequestsDaxilOlanlarPage />} />
          <Route path="/feedback-requests/geri-qaytarilanlar" element={<FeedbackRequestsGeriQaytarilanlarPage />} />
          <Route path="/feedback-requests/muddet-uzatma-sorgulari" element={<FeedbackRequestsMuddetUzatmaSorgulariPage />} />
          <Route path="/feedback-requests/vizaladiglarim" element={<FeedbackRequestsVizaladiglarimPage />} />
          <Route path="/feedback-requests/imzaladiglarim" element={<FeedbackRequestsImzaladiglarimPage />} />
          <Route path="/document-approval-requests" element={<DocumentApprovalRequestsPage />} />
          <Route path="/noncompliance-notices" element={<NoncomplianceNoticesPage />} />
          <Route path="/noncompliance-notices/viza-uchun" element={<NoncomplianceNoticesVizaUchunPage />} />
          <Route path="/noncompliance-notices/imza-uchun" element={<NoncomplianceNoticesImzaUchunPage />} />
          <Route path="/noncompliance-notices/gonderilenler/:id" element={<NoncomplianceNoticesGonderilenlerPage />} />
          <Route path="/noncompliance-notices/gonderilenler" element={<NoncomplianceNoticesGonderilenlerPage />} />
          <Route path="/noncompliance-notices/geri-qaytarilanlar" element={<NoncomplianceNoticesGeriQaytarilanlarPage />} />
          <Route path="/noncompliance-notices/vizaladiglarim" element={<NoncomplianceNoticesVizaladiglarimPage />} />
          <Route path="/noncompliance-notices/imzaladiglarim" element={<NoncomplianceNoticesImzaladiglarimPage />} />
          <Route path="/noncompliance-notices/umumi-vizaladiglarim" element={<NoncomplianceNoticesUmumiVizaladiglarimPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/service-reports" element={<ServiceReportsPage />} />
          <Route path="/orders-registration" element={<OrdersRegistrationPage />} />
          <Route path="/rejections" element={<RejectionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route
            path="/suspension-restoration-cancellation"
            element={<SuspensionRestorationCancellationPage />}
          />
          <Route path="/permits-registration" element={<PermitsRegistrationPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/evaluation" element={<EvaluationPage />} />
          <Route
            path="/suggestions-complaints-requests"
            element={<SuggestionsComplaintsRequestsPage />}
          />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/administration" element={<AdministrationPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
