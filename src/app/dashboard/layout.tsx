"use client";

import React from "react";
import Link from "next/link";
import { PAGE_URLS } from "@/constants";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{ width: "100vw", margin: "0 auto", padding: 16, height: "100vh" }}
    >
      <nav
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 16,
          borderBottom: "1px solid #e5e7eb",
          paddingBottom: 8,
        }}
      >
        <Link
          href={PAGE_URLS.home}
          style={{ fontWeight: 700, color: "#000000" }}
        >
          Home
        </Link>
        <Link
          href={PAGE_URLS.profile}
          style={{ fontWeight: 700, color: "#000000" }}
        >
          Profile
        </Link>
      </nav>
      {children}
    </div>
  );
}
