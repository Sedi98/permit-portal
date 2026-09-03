import { format } from "date-fns";
import type { ComponentProps } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router";

import TableLayout from "@/app/layouts/TableLayout";
import PageTitle from "@/components/PageTitle";
import StatusBadge from "@/components/StatusBadge";
import { DataTable } from "@/components/ui/data-table";
import { useConfirmationHistory } from "@/features/confirmations/hooks";
import type { ConfirmationHistoryItem } from "@/features/confirmations/types";

const PER_PAGE = 20;

const statusLabels: Record<string, string> = {
  registered: "Qeydiyyata alındı",
  forwarded: "Şöbəyə yönləndirildi",
  assigned: "Yönləndirilib",
  under_review: "İcradadır",
  in_document_flow: "Sənəd dövriyyəsindədir",
  deficiency_confirmation: "Çatışmazlıq bildirişi təsdiqlənir",
  awaiting_revision: "Düzəliş gözlənilir",
  report_confirmation: "Xidməti məruzə təsdiqlənir",
  payment_confirmation: "Ödəniş tapşırığı təsdiqlənir",
  awaiting_payment: "Ödəniş gözlənilir",
  payment_review: "Ödəniş yoxlanılır",
  awaiting_signature: "İmza gözlənilir",
  sent_for_approval: "Təsdiq gözlənilir",
  completed: "Tamamlanıb",
  rejected: "Geri qaytarılıb",
  suspended: "Dayandırılıb",
};

const statusVariants: Record<
  string,
  ComponentProps<typeof StatusBadge>["variant"]
> = {
  registered: "registered",
  forwarded: "registered",
  assigned: "assigned",
  under_review: "under_review",
  in_document_flow: "under_review",
  deficiency_confirmation: "sent_for_approval",
  awaiting_revision: "registered",
  report_confirmation: "sent_for_approval",
  payment_confirmation: "sent_for_approval",
  awaiting_payment: "sent_for_approval",
  payment_review: "under_review",
  awaiting_signature: "sent_for_approval",
  sent_for_approval: "sent_for_approval",
  completed: "completed",
  rejected: "rejected",
  suspended: "suspended",
};

function ApplicationNumberCell({ item }: { item: ConfirmationHistoryItem }) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="text-left text-sm font-medium leading-5 text-[#286aa6] hover:underline"
      onClick={() =>
        navigate(`/applications/manage/${item.permit_application_id}?readonly=1`)
      }
    >
      {item.application_no}
    </button>
  );
}

const columns: ColumnDef<ConfirmationHistoryItem>[] = [
  {
    header: "Sənəd nömrəsi",
    accessorKey: "application_no",
    cell: ({ row }) => <ApplicationNumberCell item={row.original} />,
  },
  {
    header: "İcazə növü",
    accessorKey: "permit_service_name",
    cell: ({ row }) => (
      <span className="line-clamp-2 max-w-[320px] text-sm leading-5 text-[#1f1f1f]">
        {row.original.permit_service_name}
      </span>
    ),
  },
  {
    header: "Sənəd tipi",
    accessorKey: "document_type_label",
  },
  {
    header: "Rol",
    accessorKey: "role_label",
  },
  {
    header: "Tarix",
    accessorKey: "approved_at",
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm text-[#797979]">
        {format(new Date(row.original.approved_at), "dd.MM.yyyy HH:mm")}
      </span>
    ),
  },
  {
    header: "Hazırkı status",
    accessorKey: "current_status",
    cell: ({ row }) => {
      const status = row.original.current_status;
      const variant = statusVariants[status];

      return variant ? (
        <StatusBadge variant={variant} label={statusLabels[status] ?? status} />
      ) : (
        <span className="text-sm text-[#1f1f1f]">{statusLabels[status] ?? status}</span>
      );
    },
  },
];

export default function ConfirmationHistoryPage() {
  const historyQuery = useConfirmationHistory(PER_PAGE);
  const response = historyQuery.data?.data;
  const items = response?.data ?? [];
  const total = response?.total ?? 0;

  return (
    <div className="relative space-y-4">
      <h1 className="pl-4 text-base font-medium leading-6 text-stone-900">
        İmza/Viza tarixçəsi
      </h1>
      <TableLayout className="space-y-5">
        <PageTitle
          title="Təsdiqlənmiş sənədlər"
          text={`Cəmi ${total} sənəd tapıldı`}
        />

        {historyQuery.isLoading ? (
          <div className="flex items-center justify-center py-20" role="status">
            <div className="size-10 animate-spin rounded-full border-4 border-[#286aa6] border-t-transparent" />
            <span className="sr-only">Tarixçə yüklənir...</span>
          </div>
        ) : historyQuery.isError ? (
          <div className="rounded-lg bg-destructive/5 p-6 text-center text-sm text-destructive">
            İmza/Viza tarixçəsi yüklənmədi.
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#DFDFDF] p-12 text-center text-sm text-[#797979]">
            Təsdiqlənmiş sənəd yoxdur.
          </div>
        ) : (
          <DataTable columns={columns} data={items} />
        )}
      </TableLayout>
    </div>
  );
}
