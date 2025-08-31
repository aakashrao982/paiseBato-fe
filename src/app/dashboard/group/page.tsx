"use client";

import React, { Suspense } from "react";
import GroupView from "@/modules/group/GroupView";
import { useSearchParams } from "next/navigation";

function GroupPageInner() {
  const groupId = useSearchParams().get("groupId") ?? "";
  return groupId ? (
    <GroupView groupId={groupId} />
  ) : (
    <div>Invalid group id</div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading group...</div>}>
      <GroupPageInner />
    </Suspense>
  );
}
