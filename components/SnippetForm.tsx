"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Language, createSnippet, updateSnippet, deleteSnippet, Snippet } from "@/lib/firestore";
import CodeEditor from "./CodeEditor";
import RunPanel from "./RunPanel";

const STARTER = {
  javascript: "// Write some JavaScript, then hit Run\nconsole.log('Hello, snippet vault!');",
  typescript:
    "// Write some TypeScript, then hit Run\nconst greet = (name: string): string => `Hello, ${name}!`;\nconsole.log(greet('snippet vault'));",
};

export default function SnippetForm({ existing }: { existing?: Snippet }) {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState(existing?.title ?? "");
  const [language, setLanguage] = useState<Language>(existing?.language ?? "javascript");
  const [code, setCode] = useState(existing?.code ?? STARTER.javascript);
  const [isPublic, setIsPublic] = useState(existing?.isPublic ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (next: Language) => {
    setLanguage(next);
    // Only swap in starter code for a brand-new, untouched snippet
    if (!existing && (code === STARTER.javascript || code === STARTER.typescript)) {
      setCode(STARTER[next]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      if (existing) {
        await updateSnippet(existing.id, { title, code, language, isPublic });
      } else {
        const id = await createSnippet({
          title,
          code,
          language,
          isPublic,
          userId: user.uid,
          userEmail: user.email ?? "",
        });
        router.push(`/dashboard/${id}/edit`);
        return;
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save snippet");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    if (!confirm("Delete this snippet? This can't be undone.")) return;
    await deleteSnippet(existing.id);
    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2.5 items-center">
        <input
          className="input flex-1 text-base"
          placeholder="Untitled snippet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="input w-40"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <CodeEditor value={code} language={language} onChange={setCode} />

      <RunPanel code={code} language={language} />

      <div className="flex gap-2.5 items-center justify-between">
        <label className="flex items-center gap-2 text-fog text-[13px]">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          Make public
        </label>

        <div className="flex gap-2.5">
          {existing && (
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          )}
          <button className="btn btn-amber" onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {error && <p className="text-red text-[13px]">{error}</p>}
    </div>
  );
}
