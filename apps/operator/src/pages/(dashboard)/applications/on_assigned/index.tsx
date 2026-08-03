import ApplicationListPage from "@/components/ApplicationListPage";

export default function DepartmentApplicationsPage() {
  return (
    <ApplicationListPage
      title="İcrada olanlar"
      initialStatus="assigned,under_review,in_document_flow"
    />
  );
}
