import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/SectionHeader";
import { getFaqs } from "@/features/faqs/api";
import type { Faq as FaqItem } from "@/features/faqs/types";

export async function Faq() {
  let faqItems: FaqItem[] = [];
  let hasError = false;

  try {
    const response = await getFaqs();
    faqItems = response.data;
  } catch {
    hasError = true;
  }

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

  return (
    <section id="faq" className="bg-white px-6 py-16 sm:py-[100px]" aria-labelledby="faq-title">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          title="Tez-tez verilən suallar"
          description="Ən çox soruşulan suallara cavablar"
          titleId="faq-title"
          className="mb-10"
        />

        {hasError ? (
          <p className="text-center text-base text-[#797979]" role="alert">
            Sualları yükləmək mümkün olmadı.
          </p>
        ) : faqItems.length === 0 ? (
          <p className="text-center text-base text-[#797979]">
            Tez-tez verilən sual tapılmadı.
          </p>
        ) : (
          <div className="mx-auto w-full max-w-[846px]">
            <Accordion
              type="single"
              collapsible
              defaultValue={`faq-${faqItems[0].id}`}
              className="gap-3"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={`faq-${item.id}`}
                  className="overflow-hidden rounded-xl border border-[#dfdfdf] data-[state=open]:!border-0 data-[state=open]:bg-[#f5f5f5]"
                >
                  <AccordionTrigger
                    className="text-[#1f1f1f]"
                    aria-label={`${item.question} cavabını göstər`}
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-5 text-sm font-normal leading-[22.75px] text-[#797979]">
                    <p>{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>

      {faqItems.length > 0 ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
      ) : null}
    </section>
  );
}
