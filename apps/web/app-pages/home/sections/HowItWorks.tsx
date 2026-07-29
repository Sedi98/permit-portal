import { HowItCard } from "@/components/HowItCard";
import { SectionHeader } from "@/components/SectionHeader";

const howItWorks = [
  {
    title: "İcazə növünü seçin",
    description: "Kataloqdan fəaliyyət növünüzə uyğun icazəni seçin. Kateqoriyalar üzrə filtr edə bilərsiniz.",
    icon: "/icons/how-it-works/step-1.svg",
  },
  {
    title: "Müraciəti doldurun",
    description: "Onlayn formada tələb olunan məlumatları daxil edin. Proses sadə və ardıcıldır.",
    icon: "/icons/how-it-works/step-2.svg",
  },
  {
    title: "Sənədləri yükləyin",
    description: "Tələb olunan sənədləri elektron formada yükləyin. PDF, JPEG və digər formatlar qəbul edilir.",
    icon: "/icons/how-it-works/step-3.svg",
  },
  {
    title: "Statusu izləyin",
    description: "Müraciətinizin statusunu real vaxt rejimində izləyin. SMS və e-poçt bildirişləri alın.",
    icon: "/icons/how-it-works/step-4.svg",
  },
];

export function HowItWorks() {
  return (
    <section id="necə-işləyir" className="bg-white px-6 py-16 sm:py-20" aria-labelledby="how-it-works-title">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Necə işləyir?"
          description="İcazə almaq üçün cəmi bir neçə sadə addım"
          titleId="how-it-works-title"
          className="mb-10"
        />

        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorks.map((step, index) => (
            <HowItCard key={step.title} index={index + 1} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
