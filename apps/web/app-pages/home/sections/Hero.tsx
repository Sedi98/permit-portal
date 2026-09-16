import Image from "next/image";

const highlights = [
  { value: "15", label: "İcazə növü" },
  { value: "24/7", label: "Onlayn xidmət" },
  { value: "500+", label: "Uğurlu müraciət" },
  { value: "100%", label: "Rəqəmsal proses" },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-white"
      aria-labelledby="hero-title"
    >
      <Image
        src="/images/hero/permit-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className=" object-cover object-right opacity-55"
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex min-h-[556px] max-w-7xl flex-col items-start justify-center gap-12 px-6 py-12 lg:px-0 lg:py-20">
        <div className="flex max-w-[601px] flex-col items-start gap-6">
          <p className="flex items-center justify-center gap-3 rounded-xl border border-[#dfdfdf] bg-white/50 px-5 py-2 text-base font-bold leading-6 text-[#1f1f1f]">
            <span
              className="size-2 rounded-full bg-[#286aa6]"
              aria-hidden="true"
            />
            Elektron icazə portalı
          </p>

          <h1
            id="hero-title"
            className="max-w-[600px] text-5xl font-bold leading-[1.15] tracking-tight text-[#1f1f1f] sm:text-[68px] sm:leading-[80px]"
          >
            İcazələri <span className="text-[#286aa6]">onlayn</span>
            <br />
            əldə edin
          </h1>

          <p className="max-w-[601px] text-lg font-normal leading-7 text-[#1f1f1f] sm:text-xl">
            Azərbaycan Respublikasının Energetika Nazirliyi tərəfindən təqdim
            edilən elektron platforma vasitəsilə bütün icazə proseslərini
            sürətli, şəffaf və rahat şəkildə həyata keçirin.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 sm:flex-row">
          <a
            href="#icazələr"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-[#286aa6] px-4 text-base font-semibold leading-6 text-white transition-colors hover:bg-[#1f5688] sm:w-[200px]"
          >
            Müraciət et
          </a>
          <a
            href="#necə-işləyir"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-[#dfdfdf] bg-white px-4 text-base font-semibold leading-6 text-[#286aa6] transition-colors hover:bg-slate-50 sm:w-[200px]"
          >
            Necə işləyir?
          </a>
        </div>

        <ul
          className="flex w-full flex-wrap items-center gap-4 text-center sm:flex-nowrap"
          aria-label="Portal haqqında göstəricilər"
        >
          {highlights.map((highlight) => (
            <li
              key={highlight.label}
              className="flex w-[calc(50%-0.5rem)] flex-col items-center gap-2 rounded-lg bg-white/80 py-3 sm:w-[132px]"
            >
              <strong className="text-xl font-bold leading-7 text-[#1f1f1f]">
                {highlight.value}
              </strong>
              <span className="text-sm font-normal leading-5 text-[#797979]">
                {highlight.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
