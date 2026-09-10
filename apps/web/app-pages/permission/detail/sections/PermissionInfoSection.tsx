import type { DetailSectionData } from "./types";

type PermissionInfoSectionProps = DetailSectionData & {
  index: number;
};

export function PermissionInfoSection({ index, title, content }: PermissionInfoSectionProps) {
  return (
    <section className="rounded-2xl border border-[#dfdfdf] bg-white p-6 sm:p-8" aria-labelledby={`permission-section-${index}`}>
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#286aa6] text-sm font-bold leading-5 text-white" aria-hidden="true">
          {index}
        </span>
        <h2 id={`permission-section-${index}`} className="text-xl font-bold leading-7 text-[#1f1f1f]">
          {title}
        </h2>
      </div>

      <div
        className="mt-5 text-base leading-6 text-[#1f1f1f] [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6 [&_ul]:marker:text-[#286aa6]"
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />
    </section>
  );
}
