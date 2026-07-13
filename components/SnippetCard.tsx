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
      className="group block glass-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/10"
    >
      <div className="flex justify-between items-center mb-4 gap-3">
        <span className="font-semibold text-sm text-paper">{snippet.title || "Untitled snippet"}</span>
        <span className="font-mono text-[11px] text-teal border border-white/10 rounded-full px-2 py-1">
          {snippet.language}
        </span>
      </div>
      <pre className="font-mono text-xs text-fog m-0 overflow-hidden max-h-[82px] leading-5 whitespace-pre-wrap break-words">
        {preview}
      </pre>
    </Link>
  );
}
