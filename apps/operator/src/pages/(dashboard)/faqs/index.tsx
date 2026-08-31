import { LoaderCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { useAdminFaqs } from "@/features/faqs/hooks";
import type { AdminFaq } from "@/features/faqs/types";
import DeleteFaqDialog from "./delete-faq-dialog";
import FaqFormDialog from "./faq-form-dialog";

export default function FaqsPage() {
  const faqsQuery = useAdminFaqs();
  const faqs = faqsQuery.data?.data ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<AdminFaq | null>(null);
  const [deletingFaq, setDeletingFaq] = useState<AdminFaq | null>(null);

  function changeFormOpen(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setEditingFaq(null);
    }
  }

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">
        Tez-tez verilən suallar
      </h1>

      <TableLayout className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <PageTitle title="FAQ siyahısı" text={`Cəmi ${faqs.length} sual tapıldı`} />
          <Button
            className="gap-2"
            onClick={() => {
              setEditingFaq(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Yeni sual
          </Button>
        </div>

        {faqsQuery.isLoading ? (
          <div className="flex justify-center py-20">
            <LoaderCircle className="size-10 animate-spin text-primary" />
          </div>
        ) : faqsQuery.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            Suallar yüklənmədi.
          </div>
        ) : faqs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            Sual tapılmadı.
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq) => (
              <article
                key={faq.id}
                className="flex flex-col gap-4 rounded-xl border border-[#DFDFDF] bg-white p-5 lg:flex-row lg:items-start lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-md bg-[#F5F5F5] px-2.5 py-1 text-xs font-semibold text-[#797979]">
                      Sıra: {faq.display_order}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        faq.is_active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {faq.is_active ? "Aktiv" : "Qeyri-aktiv"}
                    </span>
                  </div>
                  <h2 className="mt-3 text-base font-semibold leading-6 text-[#1F1F1F]">
                    {faq.question}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#797979]">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      setEditingFaq(faq);
                      setFormOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                    Redaktə et
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2 text-destructive hover:text-destructive"
                    onClick={() => setDeletingFaq(faq)}
                  >
                    <Trash2 className="size-4" />
                    Sil
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </TableLayout>

      {formOpen ? (
        <FaqFormDialog
          key={editingFaq?.id ?? "new"}
          open={formOpen}
          faq={editingFaq}
          onOpenChange={changeFormOpen}
        />
      ) : null}
      <DeleteFaqDialog
        faq={deletingFaq}
        onOpenChange={(open) => {
          if (!open) setDeletingFaq(null);
        }}
      />
    </div>
  );
}
