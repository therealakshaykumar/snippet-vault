"use client";

import { useState, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "./SignInModal";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  if (loading) {
    return <div className="text-fog text-center py-20 px-5">Loading…</div>;
  }

  if (!user) {
    return (
      <>
        <div className="flex flex-col items-center gap-3.5 py-20 px-5 text-fog text-center">
          <p>Sign in to manage your snippets.</p>
          <button className="btn btn-amber" onClick={() => setShowSignIn(true)}>
            Sign in
          </button>
        </div>
        {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
      </>
    );
  }

  return <>{children}</>;
}
