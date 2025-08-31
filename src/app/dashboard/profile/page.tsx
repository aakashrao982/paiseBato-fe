"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { PAGE_URLS } from "@/constants";
import useLoadingRouter from "@/hooks/useLoadingRouter";

export default function Page() {
  const { user, clearAuth } = useAuth();
  const { routerPush } = useLoadingRouter();

  const handleLogout = () => {
    clearAuth();
    routerPush(PAGE_URLS.login);
  };

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto" }}>
      <h1
        style={{
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 16,
          color: "#000",
        }}
      >
        Profile
      </h1>
      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div>
          <label style={{ fontWeight: 500, color: "#000" }}>Name</label>
          <input
            value={user?.name ?? ""}
            readOnly
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              color: "#000",
            }}
          />
        </div>
        <div>
          <label style={{ fontWeight: 500, color: "#000" }}>Email</label>
          <input
            value={user?.email ?? ""}
            readOnly
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "1px solid #e5e7eb",
              color: "#000",
            }}
          />
        </div>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        style={{
          marginTop: 16,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          background: "#000",
          color: "#fff",
          padding: "8px 12px",
          fontSize: 14,
          fontWeight: 500,
        }}
      >
        Log out
      </button>
    </div>
  );
}
