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
    <main className="max-w-[800px] mx-auto px-7 pt-10 pb-20 flex flex-col gap-[18px]">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-[22px] mb-1.5">{snippet.title || "Untitled snippet"}</h1>
          <span className="font-mono text-[11px] text-teal border border-hairline rounded px-1.5 py-0.5">
            {snippet.language}
          </span>
        </div>
        {isOwner && (
          <Link className="btn btn-ghost" href={`/dashboard/${snippet.id}/edit`}>
            Edit
          </Link>
        )}
      </div>

      <pre className="font-mono text-[13.5px] bg-panel border border-hairline rounded-lg p-[18px] overflow-x-auto m-0 leading-relaxed">
        {snippet.code}
      </pre>

      <RunPanel code={snippet.code} language={snippet.language} />
    </main>
  );
}
