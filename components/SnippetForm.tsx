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
    <div className="glass-card p-6 space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <input
          className="input text-base"
          placeholder="Untitled snippet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="input w-full"
          value={language}
          onChange={(e) => handleLanguageChange(e.target.value as Language)}
        >
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      <CodeEditor value={code} language={language} onChange={setCode} />

      <RunPanel code={code} language={language} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3 text-fog text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border border-white/10 bg-panel-raised text-amber focus:ring-amber"
          />
          Make public
        </label>

        <div className="flex flex-wrap gap-3 justify-end">
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
