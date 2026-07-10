"use client";

import Link from "next/link";
import { Snippet } from "@/lib/firestore";

export default function SnippetCard({
  snippet,
  href,
}: {
  snippet: Snippet;
  href: string;
}) {
  const preview = snippet.code.split("\n").slice(0, 4).join("\n");

  return (
    <Link
      href={href}
      className="block border border-hairline rounded-lg bg-panel px-4 py-3.5 transition-colors hover:border-fog-dim"
    >
      <div className="flex justify-between items-center mb-2.5">
        <span className="font-semibold text-sm">{snippet.title || "Untitled snippet"}</span>
        <span className="font-mono text-[11px] text-teal border border-hairline rounded px-1.5 py-0.5">
          {snippet.language}
        </span>
      </div>
      <pre className="font-mono text-xs text-fog m-0 overflow-hidden max-h-[76px]">
        {preview}
      </pre>
    </Link>
  );
}
