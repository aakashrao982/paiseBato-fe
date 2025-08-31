"use client";

import { useCallback, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

type UseMutationOptions = {
  fetchOptions?: RequestInit;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export default function useMutation<TResponse = unknown, TPayload = unknown>(
  url: string,
  method: HttpMethod,
  options: UseMutationOptions = {}
) {
  const { fetchOptions } = options;
  const { token, tokenType } = useAuth();

  const [data, setData] = useState<TResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const mutateAsync = useCallback(
    async (payload: TPayload): Promise<TResponse | undefined> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setError(null);
      try {
        setLoading(true);
        const isFormData =
          typeof FormData !== "undefined" && payload instanceof FormData;
        const headers = new Headers(fetchOptions?.headers || {});
        if (token && tokenType) {
          headers.set("Authorization", `${tokenType} ${token}`);
        }
        if (!isFormData) {
          if (!headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
          }
        } else {
          headers.delete("Content-Type");
        }

        console.info("[useMutation] Request", method, url, payload);
        const response = await fetch(url, {
          method,
          ...(fetchOptions || {}),
          headers,
          body: isFormData
            ? (payload as unknown as BodyInit)
            : payload == null
            ? null
            : JSON.stringify(payload),
          signal: controller.signal,
        } as RequestInit);
        console.info(
          "[useMutation] Response",
          method,
          url,
          response.status,
          response.ok
        );

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

        setData(body as TResponse);
        return body as TResponse;
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
    },
    [url, method, fetchOptions, token, tokenType]
  );

  return { mutateAsync, data, error, loading } as const;
}
