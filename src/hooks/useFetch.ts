"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type UseFetchOptions = {
  immediate?: boolean;
  fetchOptions?: RequestInit;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
) {
  const { immediate = true, fetchOptions } = options;
  const { token, tokenType } = useAuth();

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async (): Promise<T | undefined> => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setError(null);
    try {
      setLoading(true);
      const headers = new Headers(fetchOptions?.headers || {});
      if (token && tokenType) {
        headers.set("Authorization", `${tokenType} ${token}`);
      }
      const response = await fetch(url, {
        method: "GET",
        ...(fetchOptions || {}),
        headers,
        signal: controller.signal,
      });

      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const body: unknown = isJson
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          (isJson &&
            isRecord(body) &&
            typeof (body as { message?: unknown }).message === "string" &&
            (body as { message?: string }).message) ||
          (typeof body === "string"
            ? body
            : `Request failed with ${response.status}`);
        throw new Error(message);
      }

      setData(body as T);
      return body as T;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return undefined;
      }
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [url, fetchOptions, token, tokenType]);

  useEffect(() => {
    if (!immediate) return;
    refetch();
    return () => {
      abortRef.current?.abort();
    };
  }, [immediate, refetch]);

  return { fetch: refetch, data, error, loading } as const;
}
