"use client";

import { FormEvent, useState } from "react";

export function VerifyForm() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(token)}`);
      setResult(await response.text());
    } catch {
      setResult("Sorğu zamanı xəta baş verdi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
      <input
        required
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder="Yoxlama kodunu daxil edin"
        className="min-h-12 flex-1 rounded-lg border border-slate-300 bg-white px-4 outline-none ring-blue-500 focus:ring-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="min-h-12 rounded-lg bg-blue-700 px-6 font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
      >
        {loading ? "Yoxlanılır..." : "Yoxla"}
      </button>
      {result ? <pre className="basis-full overflow-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{result}</pre> : null}
    </form>
  );
}
