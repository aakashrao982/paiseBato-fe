"use client";

import React, { useEffect, useMemo, useState } from "react";
import styles from "./group.module.scss";
import { BASE_URL } from "@/constants";
import useFetch from "@/hooks/useFetch";
import useMutation from "@/hooks/useMutation";
import Loader from "@/components/loader";
import { Button } from "@/components/button";

type User = {
  id: number;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
};

type Split = {
  id: number;
  user: User;
  amount: number;
  isPaid: boolean;
};

export type Expense = {
  id: number;
  description: string;
  amount: number;
  category: string;
  paidBy: User;
  splitType: string;
  splits: Split[];
  createdAt: string;
};

type CreateExpensePayload = {
  description: string;
  amount: number;
  category: string;
  groupId: string;
  splitType: "EQUAL";
};

type AddMemberPayload = {
  groupId: string;
  email: string;
};

export default function GroupView({ groupId }: { groupId: string }) {
  const expensesUrl = useMemo(
    () => `${BASE_URL}/api/expenses/group/${groupId}`,
    [groupId]
  );
  const {
    fetch: refetchExpenses,
    data: expensesData,
    error: expensesError,
    loading: loadingExpenses,
  } = useFetch<{ data: Expense[] }>(expensesUrl);

  type UserBalance = {
    userId: number;
    userName: string;
    userEmail: string;
    balance: number;
    balanceStatus: "OWES" | "OWED" | string;
  };

  type SuggestedSettlement = {
    payerId: number;
    payerName: string;
    payerEmail: string;
    receiverId: number;
    receiverName: string;
    receiverEmail: string;
    amount: number;
    description: string;
  };

  type GroupBalancesResponse = {
    groupId: number;
    groupName: string;
    totalGroupExpenses: number;
    userBalances: UserBalance[];
    suggestedSettlements: SuggestedSettlement[];
    totalTransactionsNeeded: number;
    summary: string;
    groupSettled: boolean;
  };

  const balancesUrl = useMemo(
    () => `${BASE_URL}/api/expenses/balances/group/${groupId}`,
    [groupId]
  );
  const {
    fetch: refetchBalances,
    data: balancesData,
    error: balancesError,
    loading: loadingBalances,
  } = useFetch<{ data: GroupBalancesResponse }>(balancesUrl);

  const {
    mutateAsync: createExpense,
    data: createExpenseData,
    error: createExpenseError,
    loading: creatingExpense,
  } = useMutation<{ data: Expense }, CreateExpensePayload>(
    `${BASE_URL}/api/expenses`,
    "POST"
  );

  const {
    mutateAsync: addMember,
    data: addMemberData,
    error: addMemberError,
    loading: addingMember,
  } = useMutation<unknown, AddMemberPayload>(
    `${BASE_URL}/api/groups/add-member`,
    "POST"
  );

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (createExpenseData != null) {
      setMessage("Expense created successfully.");
      setDescription("");
      setAmount("");
      setCategory("");
      refetchExpenses();
      refetchBalances();
    }
  }, [createExpenseData, refetchExpenses]);

  useEffect(() => {
    if (addMemberData != null) {
      setMessage("Member added successfully.");
      setEmail("");
    }
  }, [addMemberData]);

  useEffect(() => {
    if (createExpenseError) setMessage(createExpenseError);
  }, [createExpenseError]);

  useEffect(() => {
    if (addMemberError) setMessage(addMemberError);
  }, [addMemberError]);

  const handleCreateExpense = async () => {
    setMessage(null);
    const parsedAmount = parseFloat(amount);
    if (!description || !amount || Number.isNaN(parsedAmount) || !category) {
      setMessage("Please provide description, amount and category.");
      return;
    }
    await createExpense({
      description,
      amount: parsedAmount,
      category,
      groupId,
      splitType: "EQUAL",
    });
  };

  const handleAddMember = async () => {
    setMessage(null);
    if (!email) {
      setMessage("Email is required.");
      return;
    }
    await addMember({ groupId, email });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {" "}
        {balancesData?.data?.groupName ?? "Name not available"}
      </h1>

      {expensesError ? (
        <p className={styles.messageError}>{expensesError}</p>
      ) : null}
      <div className={styles.section}>
        <h2 className={styles.subheading}>Balances & Settlements</h2>
        {balancesError ? (
          <p className={styles.messageError}>{balancesError}</p>
        ) : null}
        <Loader show={loadingBalances} />

        {balancesData?.data ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                {balancesData.data.groupName}
              </h2>
              <span className={styles.badge}>
                {balancesData.data.groupSettled ? "Settled" : "Unsettled"}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span>Total: {balancesData.data.totalGroupExpenses}</span>
              <span>
                Transactions: {balancesData.data.totalTransactionsNeeded}
              </span>
            </div>

            <div className={styles.splits}>
              {(balancesData.data.userBalances || []).map((b) => (
                <div key={b.userId} className={styles.splitRow}>
                  <span>{b.userName}</span>
                  <span>{b.balance}</span>
                  <span>{b.balanceStatus}</span>
                </div>
              ))}
            </div>

            <div className={styles.splits}>
              {(balancesData.data.suggestedSettlements || []).map((s, idx) => (
                <div key={idx} className={styles.splitRow}>
                  <span>
                    {s.payerName}  {s.receiverName}
                  </span>
                  <span>{s.amount}</span>
                  <span>{s.description}</span>
                </div>
              ))}
            </div>

            <p className={styles.messageInfo}>{balancesData.data.summary}</p>
          </div>
        ) : null}
      </div>
      <Loader show={loadingExpenses} />

      <div className={styles.list}>
        {(expensesData?.data || []).map((e) => (
          <div key={e.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>{e.description}</h2>
              <span className={styles.badge}>{e.category}</span>
            </div>
            <div className={styles.cardMeta}>
              <span>Amount: {e.amount}</span>
              <span>Paid by: {e.paidBy?.name}</span>
              <span>Split: {e.splitType}</span>
            </div>
            <div className={styles.splits}>
              {(e.splits || []).map((s) => (
                <div key={s.id} className={styles.splitRow}>
                  <span>{s.user?.name}</span>
                  <span>{s.amount}</span>
                  <span>{s.isPaid ? "Paid" : "Unpaid"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {message ? <p className={styles.messageInfo}>{message}</p> : null}

      <div className={styles.section}>
        <h2 className={styles.subheading}>Create Expense</h2>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="desc">
              Description
            </label>
            <input
              id="desc"
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="car"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="amount">
              Amount
            </label>
            <input
              id="amount"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500"
              inputMode="decimal"
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
              placeholder="Accommodation"
            />
          </div>
          <Button
            onClick={handleCreateExpense}
            disabled={creatingExpense}
            text={creatingExpense ? "Creating..." : "Create Expense"}
            className={styles.submitButton}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.subheading}>Add Member</h2>
        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mayank@gmail.com"
            />
          </div>
          <Button
            onClick={handleAddMember}
            disabled={addingMember}
            text={addingMember ? "Adding..." : "Add Member"}
            className={styles.submitButton}
          />
        </div>
      </div>
    </div>
  );
}
