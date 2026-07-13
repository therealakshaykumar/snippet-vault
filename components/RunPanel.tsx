"use client";

import { useRef, useState, useCallback } from "react";
import { Language } from "@/lib/firestore";

type LogEntry = {
  kind: "log" | "error" | "warn" | "result";
  text: string;
};

const TIMEOUT_MS = 3000;

// The document injected into the sandboxed iframe. It has no access to the
// parent page (no allow-same-origin), so it can't touch app state, cookies,
// or storage — it can only run the pasted code and postMessage results back.
const SANDBOX_HTML = `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body>
<script>
  const send = (kind, args) => {
    const text = args.map(a => {
      if (a instanceof Error) return a.message;
      if (typeof a === "object") {
        try { return JSON.stringify(a, null, 2); } catch { return String(a); }
      }
      return String(a);
    }).join(" ");
    parent.postMessage({ kind, text }, "*");
  };

  console.log = (...args) => send("log", args);
  console.error = (...args) => send("error", args);
  console.warn = (...args) => send("warn", args);

  window.addEventListener("message", (event) => {
    if (event.data?.type !== "run") return;
    try {
      const result = new Function(event.data.code)();
      if (result !== undefined) send("result", [result]);
      parent.postMessage({ kind: "done" }, "*");
    } catch (err) {
      send("error", [err]);
      parent.postMessage({ kind: "done" }, "*");
    }
  });

  parent.postMessage({ kind: "ready" }, "*");
</` + `script>
</body></html>
`;

export default function RunPanel({
  code,
  language,
}: {
  code: string;
  language: Language;
}) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupIframe = useCallback(() => {
    if (iframeRef.current) {
      iframeRef.current.remove();
      iframeRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    window.removeEventListener("message", handleMessageRef.current);
  }, []);

  // Kept in a ref so cleanupIframe can remove the exact same listener instance
  const handleMessageRef = useRef<(e: MessageEvent) => void>(() => {});

  const run = useCallback(async () => {
    setLogs([]);
    setRunning(true);

    let transpiled = code;
    if (language === "typescript") {
      try {
        const Babel = (await import("@babel/standalone")).default;
        const output = Babel.transform(code, {
          presets: ["typescript"],
          filename: "snippet.ts",
        }).code;
        transpiled = output ?? "";
      } catch (err) {
        setLogs([
          {
            kind: "error",
            text: err instanceof Error ? `TypeScript compile error: ${err.message}` : "TypeScript compile error",
          },
        ]);
        setRunning(false);
        return;
      }
    }

    const iframe = document.createElement("iframe");
    iframe.sandbox.add("allow-scripts");
    iframe.style.display = "none";
    iframe.srcdoc = SANDBOX_HTML;
    document.body.appendChild(iframe);
    iframeRef.current = iframe;

    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframe.contentWindow) return;
      const { kind, text } = event.data || {};
      if (kind === "ready") {
        iframe.contentWindow?.postMessage({ type: "run", code: transpiled }, "*");
        timeoutRef.current = setTimeout(() => {
          setLogs((prev) => [
            ...prev,
            { kind: "error", text: `Execution timed out after ${TIMEOUT_MS / 1000}s (possible infinite loop)` },
          ]);
          setRunning(false);
          cleanupIframe();
        }, TIMEOUT_MS);
      } else if (kind === "done") {
        setRunning(false);
        cleanupIframe();
      } else if (kind) {
        setLogs((prev) => [...prev, { kind, text }]);
      }
    };

    handleMessageRef.current = onMessage;
    window.addEventListener("message", onMessage);
  }, [code, language, cleanupIframe]);

  const clear = () => setLogs([]);

  return (
    <div className="glass-panel overflow-hidden border border-white/10">
      <div className="flex flex-wrap gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
        <button className="btn btn-amber" onClick={run} disabled={running}>
          {running ? "Running…" : "▶ Run"}
        </button>
        <button className="btn btn-ghost" onClick={clear} disabled={logs.length === 0}>
          Clear
        </button>
      </div>

      <div className="bg-[#06070a]/95 font-mono text-[13px] px-4 py-4 min-h-[140px] max-h-[320px] overflow-y-auto">
        <div className="text-teal mb-3 leading-relaxed whitespace-pre-wrap break-words">
          <span className="text-amber">&gt;</span> run snippet.{language === "typescript" ? "ts" : "js"}
          {running && (
            <span
              className="inline-block w-[7px] h-[13px] bg-amber ml-2 align-middle"
              style={{ animation: "blink 1s steps(1) infinite" }}
            />
          )}
        </div>
        {logs.length === 0 && !running && (
          <div className="text-fog-dim leading-relaxed whitespace-pre-wrap break-words">
            No output yet — press Run.
          </div>
        )}
        {logs.map((entry, i) => (
          <div
            key={i}
            className={`leading-relaxed whitespace-pre-wrap break-words ${
              entry.kind === "error"
                ? "text-red"
                : entry.kind === "warn"
                ? "text-amber"
                : entry.kind === "result"
                ? "text-fog"
                : "text-paper"
            }`}
          >
            {entry.kind === "error" ? "✗ " : entry.kind === "result" ? "← " : ""}
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
}
