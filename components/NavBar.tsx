"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "./SignInModal";

export default function NavBar() {
  const { user, loading, signOut } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu on route change (link click)
  const closeMobile = () => setMobileOpen(false);

  // Close when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        ref={menuRef}
        className="sticky top-0 z-30 border-b border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_50px_-28px_rgba(0,0,0,0.55)]"
      >
        {/* Main bar */}
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 md:px-7 md:py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 font-semibold text-[15px] tracking-wide text-paper transition hover:text-amber"
            onClick={closeMobile}
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber/15 text-amber shadow-[0_10px_25px_-15px_rgba(232,163,61,0.8)]">
              {"</>"}
            </span>
            <span>Snippet Vault</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-fog transition">
            <Link className="transition hover:text-paper" href="/">
              Explore
            </Link>
            {user && (
              <Link className="transition hover:text-paper" href="/dashboard">
                My Snippets
              </Link>
            )}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
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

          {/* Hamburger button – mobile only */}
          <button
            className="relative flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-paper transition hover:bg-white/10"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">{mobileOpen ? "Close" : "Menu"}</span>
            {/* Animated hamburger → X */}
            <span className="flex flex-col items-center justify-center gap-[5px] w-[18px]">
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 ${
                  mobileOpen ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 origin-center ${
                  mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-white/10 px-5 pb-5 pt-4 flex flex-col gap-4">
            {/* Nav links */}
            <nav className="flex flex-col gap-3 text-sm text-fog">
              <Link
                className="transition hover:text-paper py-1"
                href="/"
                onClick={closeMobile}
              >
                Explore
              </Link>
              {user && (
                <Link
                  className="transition hover:text-paper py-1"
                  href="/dashboard"
                  onClick={closeMobile}
                >
                  My Snippets
                </Link>
              )}
            </nav>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Auth section */}
            <div className="flex flex-col gap-3">
              {loading ? null : user ? (
                <>
                  <span className="font-mono text-xs text-fog truncate">
                    {user.email}
                  </span>
                  <button
                    className="btn btn-ghost w-full"
                    onClick={() => { signOut(); closeMobile(); }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-amber w-full"
                  onClick={() => { setShowSignIn(true); closeMobile(); }}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
