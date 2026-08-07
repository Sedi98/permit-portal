"use client";

import { X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type NotificationDialogData = {
  summary: string;
  permitType: string;
  applicationNumber: string;
  applicant: string;
  legalEntity: string;
  status: string;
  phone: string;
  email: string;
};

type NotificationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  date: string;
  data: NotificationDialogData;
};

function InfoRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm leading-5">
      <dt className="shrink-0 text-[#797979]">{label}</dt>
      <dd className={`text-right ${accent ? "font-semibold text-[#286aa6]" : "font-medium text-[#1f1f1f]"}`}>
        {value}
      </dd>
    </div>
  );
}

export default function NotificationDialog({
  open,
  onOpenChange,
  title,
  date,
  data,
}: NotificationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] !max-w-[640px] gap-0 overflow-y-auto rounded-xl bg-white p-0 sm:!max-w-[640px]"
      >
        <div className="flex items-start justify-between border-b border-[#dfdfdf] px-6 pt-5 pb-[21px]">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-base leading-6 font-semibold text-[#1f1f1f]">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-5 text-[#797979]">
              {date}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <button
              type="button"
              aria-label="Bağla"
              className="-mt-1 -mr-1 flex size-12 shrink-0 items-center justify-center rounded-lg p-3 text-[#286aa6] transition-colors hover:bg-[#f9fafc] focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:outline-none"
            >
              <X className="size-6" strokeWidth={1.5} />
            </button>
          </DialogClose>
        </div>

        <div className="flex flex-col gap-6 px-6 py-5">
          <p className="text-base leading-6 font-medium text-[#286aa6]">{data.summary}</p>

          <section className="flex flex-col gap-3" aria-labelledby="application-info-title">
            <h2 id="application-info-title" className="text-sm leading-5 font-semibold text-[#1f1f1f]">
              Müraciət məlumatları
            </h2>
            <dl className="flex flex-col gap-3 rounded-xl bg-[#f9fafc] p-5">
              <InfoRow label="İcazə növü:" value={data.permitType} />
              <InfoRow label="Müraciət nömrəsi" value={data.applicationNumber} accent />
              <InfoRow label="Müraciətçi" value={data.applicant} />
              <InfoRow label="Hüquqi şəxs:" value={data.legalEntity} />
              <InfoRow label="Status:" value={data.status} accent />
            </dl>
          </section>

          <section className="flex flex-col gap-3" aria-labelledby="contact-title">
            <h2 id="contact-title" className="text-sm leading-5 font-semibold text-[#1f1f1f]">
              Əlaqə
            </h2>
            <dl className="flex flex-col gap-3 rounded-xl bg-[#f9fafc] p-5">
              <InfoRow label="Tel:" value={data.phone} />
              <InfoRow label="E-poçt:" value={data.email} />
            </dl>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
