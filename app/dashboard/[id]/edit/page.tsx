"use client";

import { useEffect, useState, use } from "react";
import { useAuth } from "@/lib/auth-context";
import { getSnippet, Snippet } from "@/lib/firestore";
import ProtectedRoute from "@/components/ProtectedRoute";
import SnippetForm from "@/components/SnippetForm";

function EditSnippetContent({ id }: { id: string }) {
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

  if (snippet.userId !== user?.uid) {
    return (
      <main className="max-w-[800px] mx-auto px-7 py-10 text-fog">
        You don&apos;t have access to this snippet.
      </main>
    );
  }

  return (
    <main className="max-w-[800px] mx-auto px-7 pt-10 pb-20 flex flex-col gap-[18px]">
      <h1 className="text-[22px] m-0">Edit snippet</h1>
      <SnippetForm existing={snippet} />
    </main>
  );
}

export default function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <ProtectedRoute>
      <EditSnippetContent id={id} />
    </ProtectedRoute>
  );
}
