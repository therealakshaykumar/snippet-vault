"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useUserSnippets } from "@/lib/hooks/useSnippets";
import ProtectedRoute from "@/components/ProtectedRoute";
import SnippetCard from "@/components/SnippetCard";

function DashboardContent() {
  const { user } = useAuth();
  const { snippets, loading, error } = useUserSnippets(user?.uid);

  return (
    <main className="max-w-[980px] mx-auto px-7 pt-16 pb-20">
      <section className="glass-card p-7 mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-fog text-sm uppercase tracking-[0.24em] mb-2">Your workspace</p>
            <h1 className="text-3xl font-semibold">My Snippets</h1>
          </div>
          <Link className="btn btn-amber w-full sm:w-auto" href="/dashboard/new">
            + New snippet
          </Link>
        </div>
      </section>

      {loading && <p className="text-fog">Loading…</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && !error && snippets.length === 0 && (
        <p className="text-fog">
          Nothing here yet. <Link className="text-amber hover:text-amber-bright" href="/dashboard/new">
            Create your first snippet.
          </Link>
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5">
        {snippets.map((s) => (
          <SnippetCard key={s.id} snippet={s} href={`/dashboard/${s.id}/edit`} />
        ))}
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
