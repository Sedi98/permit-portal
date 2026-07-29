import Image from "next/image";

type HowItCardProps = {
  index: number;
  title: string;
  description: string;
  icon: string;
};

export function HowItCard({ index, title, description, icon }: HowItCardProps) {
  const activeIndex = Math.min(Math.max(index, 1), 4);

  return (
    <article className="flex min-h-[220px] w-full max-w-[305px] flex-col items-start gap-5 rounded-xl border-[0.8px] border-[#dfdfdf] bg-white p-5">
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full items-center justify-between">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#f5f5f5] p-3">
            <Image src={icon} alt="" width={24} height={24} sizes="24px" />
          </div>
          <span className="text-[40px] font-bold leading-[48px] text-[#dfdfdf]" aria-label={`Addım ${activeIndex}`}>
            {String(activeIndex).padStart(2, "0")}
          </span>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <h3 className="w-full truncate text-base font-semibold leading-6 text-[#1f1f1f]">{title}</h3>
          <p className="w-full text-sm font-normal leading-5 text-[#797979]">{description}</p>
        </div>
      </div>

      <div className="flex h-1 w-full items-center gap-1.5" aria-label={`Addım ${activeIndex} / 4`}>
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={`h-1 rounded-full ${segment === activeIndex ? "w-6 bg-[#286aa6]" : "w-2 bg-[#dfdfdf]"}`}
          />
        ))}
      </div>
    </article>
  );
}
