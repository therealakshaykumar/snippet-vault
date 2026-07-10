"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

export default function SignInModal({ onClose }: { onClose: () => void }) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100]"
      onClick={onClose}
    >
      <div
        className="w-[340px] bg-panel border border-hairline rounded-[10px] p-[22px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center font-semibold mb-[18px]">
          <span>{mode === "signin" ? "Sign in" : "Create account"}</span>
          <button
            className="bg-transparent border-none text-fog text-xl cursor-pointer leading-none hover:text-paper"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <button className="btn w-full text-center" onClick={handleGoogle} disabled={busy}>
          Continue with Google
        </button>

        <div className="flex items-center gap-2.5 my-4 text-fog-dim text-xs before:content-[''] before:flex-1 before:h-px before:bg-hairline after:content-[''] after:flex-1 after:h-px after:bg-hairline">
          <span>or</span>
        </div>

        <form onSubmit={handleEmailSubmit} className="flex flex-col gap-2.5">
          <input
            className="input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="text-red text-[13px] m-0">{error}</p>}
          <button className="btn btn-amber" type="submit" disabled={busy}>
            {mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          className="bg-transparent border-none text-fog text-xs mt-3.5 cursor-pointer w-full text-center hover:text-paper"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin"
            ? "Need an account? Sign up"
            : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
