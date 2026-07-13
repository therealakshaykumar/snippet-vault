"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getSnippet, Snippet } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import RunPanel from "@/components/RunPanel";

export default function SnippetViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const [snippet, setSnippet] = useState<Snippet | null | undefined>(undefined);

  useEffect(() => {
    getSnippet(id).then(setSnippet);
  }, [id]);

  if (snippet === undefined) {
    return <main className="max-w-[800px] mx-auto px-7 py-10 text-fog">Loading…</main>;
  }

  if (snippet === null) {
    return <main className="max-w-[800px] mx-auto px-7 py-10 text-fog">Snippet not found.</main>;
  }

  const isOwner = user?.uid === snippet.userId;

  if (!snippet.isPublic && !isOwner) {
    return (
      <main className="max-w-[800px] mx-auto px-7 py-10 text-fog">
        This snippet is private.
      </main>
    );
  }

  return (
    <main className="max-w-[900px] mx-auto px-7 pt-16 pb-20 space-y-8">
      <section className="glass-card p-7 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-fog uppercase tracking-[0.24em] text-[11px] mb-2">
              snippet details
            </p>
            <h1 className="text-3xl font-semibold">{snippet.title || "Untitled snippet"}</h1>
          </div>
          {isOwner && (
            <Link className="btn btn-ghost self-start" href={`/dashboard/${snippet.id}/edit`}>
              Edit
            </Link>
          )}
        </div>

        <span className="font-mono text-[11px] text-teal border border-white/10 rounded-full px-2.5 py-1">
          {snippet.language}
        </span>

        <pre className="code-block m-0">
          <code>{snippet.code}</code>
        </pre>
      </section>

      <RunPanel code={snippet.code} language={snippet.language} />
    </main>
  );
}
