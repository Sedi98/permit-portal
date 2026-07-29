import Image from "next/image";
import Link from "next/link";

type PermissionCardProps = {
  title: string;
  href: string;
  icon: string;
  iconAlt?: string;
  duration?: string;
};

export function PermissionCard({
  title,
  href,
  icon,
  iconAlt = "",
  duration = "7 iş günü",
}: PermissionCardProps) {
  return (
    <Link
      href={href}
      className="block w-full max-w-[305px] rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#286aa6] focus-visible:ring-offset-2"
      aria-label={`${title} icazəsinə keçid`}
    >
      <article className="flex min-h-[221px] flex-col items-start justify-between rounded-xl border-[0.8px] border-[#dfdfdf] bg-white p-5 transition-shadow hover:shadow-md">
        <div className="flex w-full flex-col items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-[#f9fafc] p-3">
            <Image src={icon} alt={iconAlt} width={24} height={24} sizes="24px" />
          </div>
          <h3 className="w-full text-base font-semibold leading-6 text-[#1f1f1f]">{title}</h3>
        </div>

        <div className="flex w-full items-center justify-between border-t border-[#dfdfdf] pt-[9px]">
          <span className="flex items-center gap-2 rounded-lg bg-[#f9fafc] p-2 text-sm font-semibold leading-5 text-[#286aa6]">
            <Image src="/icons/permissions/clock.svg" alt="" width={20} height={20} sizes="20px" />
            {duration}
          </span>
          <span className="flex size-10 items-center justify-center rounded-lg p-2" aria-hidden="true">
            <Image src="/icons/permissions/arrow-right.svg" alt="" width={24} height={24} sizes="24px" />
          </span>
        </div>
      </article>
    </Link>
  );
}
