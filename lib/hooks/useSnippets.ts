"use client";

import { useEffect, useState, useCallback } from "react";
import { Snippet, getUserSnippets, getPublicSnippets } from "../firestore";

export function useUserSnippets(userId: string | undefined) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) {
      setSnippets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getUserSnippets(userId);
      setSnippets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load snippets");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { snippets, loading, error, refresh };
}

export function usePublicSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPublicSnippets();
      setSnippets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load snippets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { snippets, loading, error, refresh };
}
