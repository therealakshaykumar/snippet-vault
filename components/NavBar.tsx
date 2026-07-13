"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "./SignInModal";

export default function NavBar() {
  const { user, loading, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-28px_rgba(0,0,0,0.55)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-7 py-4">
          <Link href="/" className="flex items-center gap-3 font-semibold text-[15px] tracking-wide text-paper transition hover:text-amber">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber/15 text-amber shadow-[0_10px_25px_-15px_rgba(232,163,61,0.8)]">
              {"</>"}
            </span>
            <span>Snippet Vault</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-fog transition">
            <Link className="transition hover:text-paper" href="/">
              Explore
            </Link>
            {user && (
              <Link className="transition hover:text-paper" href="/dashboard">
                My Snippets
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {loading ? null : user ? (
              <>
                <span className="font-mono text-xs text-fog truncate max-w-[160px]">
                  {user.email}
                </span>
                <button className="btn btn-ghost" onClick={() => signOut()}>
                  Sign out
                </button>
              </>
            ) : (
              <button className="btn btn-amber" onClick={() => setShowSignIn(true)}>
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
