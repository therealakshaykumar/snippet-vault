"use client";

import { usePublicSnippets } from "@/lib/hooks/useSnippets";
import SnippetCard from "@/components/SnippetCard";

export default function HomePage() {
  const { snippets, loading, error } = usePublicSnippets();

  return (
    <main className="max-w-[980px] mx-auto px-7 pt-16 pb-20">
      <section className="glass-card p-8 mb-10 overflow-hidden">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-fog">
          modern code storage
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            A vault for your <span className="text-amber">JS</span> &amp; <span className="text-amber">TS</span> snippets.
          </h1>
          <p className="max-w-2xl text-fog text-base leading-7">
            Write it once, run it instantly, and keep your best snippets in a polished, searchable vault.
          </p>
        </div>
      </section>

      {loading && <p className="text-fog">Loading snippets…</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && !error && snippets.length === 0 && (
        <p className="text-fog">No public snippets yet — be the first to share one.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
        {snippets.map((s) => (
          <SnippetCard key={s.id} snippet={s} href={`/snippets/${s.id}`} />
        ))}
      </div>
    </main>
  );
}
