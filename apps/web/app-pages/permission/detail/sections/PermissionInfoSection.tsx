import type { DetailSectionData } from "./types";

type PermissionInfoSectionProps = DetailSectionData & {
  index: number;
};

export function PermissionInfoSection({ index, title, items }: PermissionInfoSectionProps) {
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

      <ul className="mt-5 flex flex-col gap-4 text-base leading-6 text-[#1f1f1f]">
        {items.map((item) => (
          <li key={item.text} className="flex items-start gap-3">
            <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-[#286aa6]" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className={item.emphasis ? "font-semibold" : undefined}>{item.text}</p>
              {item.children ? (
                <ol className={`mt-1 list-inside space-y-1 pl-4 ${item.children.ordered ? "list-decimal" : "list-disc"}`}>
                  {item.children.items.map((child) => (
                    <li key={child}>{child}</li>
                  ))}
                </ol>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
