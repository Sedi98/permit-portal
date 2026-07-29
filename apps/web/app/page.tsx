import { VerifyForm } from "@/app/verify/VerifyForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
        <p className="font-semibold uppercase tracking-[0.2em] text-blue-700">Permit Portal</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          İcazə müraciətlərinizi elektron şəkildə təqdim edin.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          İcazə xidmətlərini seçin, müraciətinizi göndərin və təqdim olunmuş sənədlərin həqiqiliyini yoxlayın.
        </p>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-semibold">Sənədi yoxla</h2>
          <p className="mt-2 text-slate-600">Sənəd üzərindəki yoxlama kodunu daxil edin.</p>
          <VerifyForm />
        </div>
      </section>
    </main>
  );
}
