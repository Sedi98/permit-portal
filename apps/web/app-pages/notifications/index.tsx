import NotificationHeader from "@/app-pages/notifications/sections/NotificationHeader";
import NotificationContainer from "@/app-pages/notifications/sections/NotificationContainer";

const mockNotifications = [
  {
    id: "additional-document",
    title: "Əlavə sənəd tələb olunur",
    applicationNumber: "ENR-2024-001389",
    message:
      "ENR-2024-001389 nömrəli müraciətinizə əlavə sənəd tələb olunur. Texniki audit hesabatının yenilənmiş versiyasını 5 iş günü ərzində göndərin.",
    date: "28.03.2024 · 10:15",
    read: true,
    details: {
      summary: "Müraciətinizə 7 (yeddi) iş günü ərzində baxılacaqdır.",
      permitType: "Elektrik enerjisinin paylanmasına icazə",
      applicationNumber: "ENR-2025-2026",
      applicant: "Salmanov Elçin Qalib - FİN: 7SD34DB",
      legalEntity: "Azər Enerji MMC - VÖEN: 1234567890",
      status: "Qeydiyyata alındı",
      phone: "(+99412) 974",
      email: "minenergy@minenergy.az",
    },
  },
  {
    id: "application-registered",
    title: "Müraciət qeydiyyata alındı",
    applicationNumber: "ENR-2024-001389",
    message:
      "ENR-2024-001389 nömrəli müraciətiniz qeydiyyata alındı və baxılmağa göndərildi.",
    date: "28.03.2024 · 10:15",
    read: false,
    details: {
      summary: "Müraciətinizə 7 (yeddi) iş günü ərzində baxılacaqdır.",
      permitType: "Elektrik enerjisinin paylanmasına icazə",
      applicationNumber: "ENR-2025-2026",
      applicant: "Salmanov Elçin Qalib - FİN: 7SD34DB",
      legalEntity: "Azər Enerji MMC - VÖEN: 1234567890",
      status: "Qeydiyyata alındı",
      phone: "(+99412) 974",
      email: "minenergy@minenergy.az",
    },
  },
] as const;

export default function NotificationsPage() {
  return (
    <main>
      <NotificationHeader
        count={mockNotifications.filter((notification) => !notification.read).length}
      />
      <section aria-label="Bildirişlər" className="my-8 max-w-7xl w-full mx-auto">
        {mockNotifications.map(({ id, ...notification }) => (
          <NotificationContainer key={id} {...notification} />
        ))}
      </section>
    </main>
  );
}
