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
      <header className="flex items-center justify-between px-7 py-3.5 border-b border-hairline bg-ink sticky top-0 z-20">
        <Link href="/" className="flex items-center gap-2 font-semibold text-[15px] tracking-wide">
          <span className="font-mono text-amber">{"</>"}</span>
          Snippet Vault
        </Link>

        <nav className="flex gap-[22px] text-sm text-fog [&_a:hover]:text-paper">
          <Link href="/">Explore</Link>
          {user && <Link href="/dashboard">My Snippets</Link>}
        </nav>

        <div className="flex items-center gap-3.5">
          {loading ? null : user ? (
            <>
              <span className="font-mono text-xs text-fog">{user.email}</span>
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
      </header>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
