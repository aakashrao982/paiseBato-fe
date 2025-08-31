"use client";

import useFetch from "@/hooks/useFetch";
import Loader from "@/components/loader";

export default function Page() {
  const {
    fetch: refetch,
    data,
    error,
    loading,
  } = useFetch<Record<string, unknown>>(
    "https://jsonplaceholder.typicode.com/todos/1"
  );

  return (
    <div
      style={{
        maxWidth: 640,
        margin: "2rem auto",
        fontFamily: "ui-sans-serif, system-ui",
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>
        useFetch demo
      </h1>
      <button
        onClick={refetch}
        style={{
          padding: "8px 12px",
          borderRadius: 6,
          background: "#000",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          marginBottom: 12,
        }}
      >
        Refetch
      </button>
      <Loader show={loading} />
      {error && (
        <p style={{ color: "#dc2626", marginBottom: 12 }}>Error: {error}</p>
      )}
      <pre
        style={{
          background: "#f5f5f5",
          padding: 12,
          borderRadius: 6,
          overflowX: "auto",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
