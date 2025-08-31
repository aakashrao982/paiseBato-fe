"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./home.module.scss";
import { BASE_URL } from "@/constants";
import useFetch from "@/hooks/useFetch";
import useMutation from "@/hooks/useMutation";
import Loader from "@/components/loader";

type GroupMemberUser = {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type GroupMember = {
  id: number;
  user: GroupMemberUser;
  role: string;
  balance: number;
  joinedAt: string;
};

export type Group = {
  id: number;
  name: string;
  description: string;
  category: string;
  totalExpense: number;
  isActive: boolean;
  createdAt: string;
  members: GroupMember[];
};

type CreateGroupPayload = {
  name: string;
  description: string;
  category: string;
};

export default function HomeView() {
  const groupsUrl = useMemo(() => `${BASE_URL}/api/groups`, []);
  const {
    fetch: refetchGroups,
    data: groupsData,
    error: groupsError,
    loading: loadingGroups,
  } = useFetch<{ data: Group[] }>(groupsUrl);

  const {
    mutateAsync: createGroup,
    data: createGroupData,
    error: createGroupError,
    loading: creatingGroup,
  } = useMutation<Group, CreateGroupPayload>(`${BASE_URL}/api/groups`, "POST");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (createGroupData != null) {
      setMessage("Group created successfully.");
      setName("");
      setDescription("");
      setCategory("");
      refetchGroups();
    }
  }, [createGroupData, refetchGroups]);

  useEffect(() => {
    if (createGroupError) {
      setMessage(createGroupError);
    }
  }, [createGroupError]);

  const handleCreateGroup = async () => {
    setMessage(null);
    if (!name || !description || !category) {
      setMessage("All fields are required.");
      return;
    }
    await createGroup({ name, description, category });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Groups</h1>

      {groupsError ? (
        <p className={styles.messageError}>{groupsError}</p>
      ) : null}

      <Loader show={loadingGroups} />

      <div className={styles.list}>
        {(groupsData?.data || []).map((g) => (
          <a
            key={g.id}
            className={styles.card}
            href={`/dashboard/group?groupId=${g.id}`}
          >
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{g.name}</h2>
              <span className={styles.badge}>{g.category}</span>
            </div>
            <p className={styles.cardDesc}>{g.description}</p>
            <div className={styles.cardMeta}>
              <span>Total: {g.totalExpense}</span>
              <span>Members: {g.members?.length ?? 0}</span>
            </div>
          </a>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>Create Group</h2>

        {message ? <p className={styles.messageInfo}>{message}</p> : null}

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Weekend Trip"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <input
              id="description"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mountain trip"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="category">
              Category
            </label>
            <input
              id="category"
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Travel"
            />
          </div>
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleCreateGroup}
            disabled={creatingGroup}
          >
            {creatingGroup ? "Creating..." : "Create Group"}
          </button>
        </div>
      </div>
    </div>
  );
}
