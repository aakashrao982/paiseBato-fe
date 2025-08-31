"use client";

import GroupView from "@/modules/group/GroupView";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const groupId = useSearchParams().get("groupId") ?? "";

  return groupId ? (
    <GroupView groupId={groupId} />
  ) : (
    <div>Invalid group id</div>
  );
}
