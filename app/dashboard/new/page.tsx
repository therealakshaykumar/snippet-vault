"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import SnippetForm from "@/components/SnippetForm";

function NewSnippetContent() {
  return (
    <main className="max-w-[800px] mx-auto px-7 pt-10 pb-20 flex flex-col gap-[18px]">
      <h1 className="text-[22px] m-0">New snippet</h1>
      <SnippetForm />
    </main>
  );
}

export default function NewSnippetPage() {
  return (
    <ProtectedRoute>
      <NewSnippetContent />
    </ProtectedRoute>
  );
}
