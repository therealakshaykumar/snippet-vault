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
    <main className="max-w-[960px] mx-auto px-7 pt-10 pb-20">
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-[22px] m-0">My Snippets</h1>
        <Link className="btn btn-amber" href="/dashboard/new">
          + New snippet
        </Link>
      </div>

      {loading && <p className="text-fog">Loading…</p>}
      {error && <p className="text-red">{error}</p>}
      {!loading && !error && snippets.length === 0 && (
        <p className="text-fog">
          Nothing here yet. <Link href="/dashboard/new">Create your first snippet.</Link>
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
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
