import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/SectionHeader";

const faqItems = [
  {
    question: "Xidmətlər ödənişlidirmi?",
    answer:
      "Müraciət üçün şəxsiyyət vəsiqəsi, müvafiq texniki sənədlər və lisenziya tələbinə uyğun digər sənədlər tələb olunur. Hər icazə növü üçün tələb olunan sənədlər xidmətlər bölməsindən əldə edilə bilər.",
  },
  {
    question: "Müraciət üçün hansı sənədlər tələb olunur?",
    answer:
      "Tələb olunan sənədlər seçdiyiniz icazə növündən asılıdır. Xidmət səhifəsində müraciətə başlamazdan əvvəl bütün sənədlərin siyahısı göstərilir.",
  },
  {
    question: "Müraciətin statusunu necə izləyə bilərəm?",
    answer:
      "Portal hesabınıza daxil olaraq müraciətlərim bölməsindən müraciətinizin cari statusunu izləyə bilərsiniz. Status dəyişdikdə bildiriş də göndərilir.",
  },
  {
    question: "Müraciətə baxılması nə qədər vaxt aparır?",
    answer:
      "Baxılma müddəti icazənin növünə və təqdim olunan sənədlərin tamlığına görə dəyişir. Təxmini müddət hər xidmətin məlumat bölməsində qeyd olunur.",
  },
  {
    question: "Texniki dəstək üçün kimə müraciət edə bilərəm?",
    answer:
      "Texniki suallarınız üçün portalda göstərilən 974 çağrı xətti ilə əlaqə saxlaya və ya portalın dəstək bölməsindən müraciət göndərə bilərsiniz.",
  },
];

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: {
      "@type": "Answer",
      text: answer,
    },
  })),
};

export function Faq() {
  return (
    <section id="faq" className="bg-white px-6 py-16 sm:py-[100px]" aria-labelledby="faq-title">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Tez-tez verilən suallar"
          description="Ən çox soruşulan suallara cavablar"
          titleId="faq-title"
          className="mb-10"
        />

        <div className="mx-auto w-full max-w-[846px]">
          <Accordion type="single" collapsible defaultValue="faq-1" className="gap-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`faq-${index + 1}`}
                className="overflow-hidden rounded-xl border border-[#dfdfdf] data-[state=open]:!border-0 data-[state=open]:bg-[#f5f5f5]"
              >
                <AccordionTrigger className="text-[#1f1f1f]" aria-label={`${item.question} cavabını göstər`}>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-5 pt-5 text-sm font-normal leading-[22.75px] text-[#797979]">
                  <p>{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }} />
    </section>
  );
}
