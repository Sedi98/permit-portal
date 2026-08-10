import ApplicationListPage from "@/components/ApplicationListPage";

export default function AwaitingPaymentPage() {
  return <ApplicationListPage title="Təsdiq olunan ödənişlər" initialStatus="payment_review" />;
}
