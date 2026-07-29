type DashboardPageProps = {
  title: string;
  description: string;
  route: string;
  highlights: string[];
};

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e6edf5] bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#7a8794]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1f1f1f]">{value}</p>
    </div>
  );
}

export default function DashboardPage({ title, description, route, highlights }: DashboardPageProps) {
  return (
    <section className="min-h-[calc(100vh-3rem)] rounded-[32px] border border-[#e6edf5] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#7a8794]">
            Dashboard section
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#15202b]">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6b78]">{description}</p>
        </div>

        <span className="inline-flex items-center rounded-full bg-[#eef4fb] px-3 py-1 text-sm font-medium text-[#286aa6]">
          {route}
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <MetaCard label="Route" value={route} />
        <MetaCard label="Layout" value="Sidebar + content shell" />
        <MetaCard label="State" value="Ready for implementation" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[28px] bg-[#f9fbfd] p-6 ring-1 ring-[#e6edf5]">
          <h2 className="text-lg font-semibold text-[#15202b]">What lives here</h2>
          <ul className="mt-4 space-y-3">
            {highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-6 text-[#4f5b68]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#286aa6]" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] bg-[#15202b] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
            Implementation note
          </p>
          <p className="mt-4 text-sm leading-6 text-white/80">
            This page is scaffolded for future content. Keep section-specific data and actions
            inside this shell so routing, spacing, and layout stay consistent across the portal.
          </p>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Navigation contract</p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Use the sidebar route as the source of truth for active state and keep page names in
              sync with the menu label.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
