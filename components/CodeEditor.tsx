"use client";

import Editor, { OnMount } from "@monaco-editor/react";
import { Language } from "@/lib/firestore";

interface CodeEditorProps {
  value: string;
  language: Language;
  onChange: (value: string) => void;
  height?: string;
}

export default function CodeEditor({
  value,
  language,
  onChange,
  height = "420px",
}: CodeEditorProps) {
  const handleMount: OnMount = (editor, monaco) => {
    monaco.editor.defineTheme("vault-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#17181c",
        "editor.lineHighlightBackground": "#1f2126",
        "editorLineNumber.foreground": "#5a5e66",
        "editorCursor.foreground": "#e8a33d",
      },
    });
    monaco.editor.setTheme("vault-dark");
  };

  return (
    <div className="border border-hairline rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        theme="vault-dark"
        options={{
          fontFamily: "var(--font-fira-code), 'Fira Code', monospace",
          fontLigatures: true,
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
          renderLineHighlight: "all",
          smoothScrolling: true,
        }}
      />
    </div>
  );
}
