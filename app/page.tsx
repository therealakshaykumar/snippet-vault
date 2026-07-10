"use client";

import { usePublicSnippets } from "@/lib/hooks/useSnippets";
import SnippetCard from "@/components/SnippetCard";

export default function HomePage() {
  const { snippets, loading, error } = usePublicSnippets();

  return (
    <main className="max-w-[960px] mx-auto px-7 pt-12 pb-20">
      <div className="mb-10">
        <h1 className="text-[32px] leading-[1.25] mb-2.5 font-semibold">
          A vault for your <span className="text-amber">JS</span> &amp;{" "}
          <span className="text-amber">TS</span> snippets.
        </h1>
        <p className="text-fog m-0">Write it once, run it in the browser, find it again later.</p>
      </div>

      {loading && <p className="text-fog">Loading snippets…</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && !error && snippets.length === 0 && (
        <p className="text-fog">No public snippets yet — be the first to share one.</p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
        {snippets.map((s) => (
          <SnippetCard key={s.id} snippet={s} href={`/snippets/${s.id}`} />
        ))}
      </div>
    </main>
  );
}
