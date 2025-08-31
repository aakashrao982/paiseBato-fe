"use client";

import React, { useEffect, useState } from "react";
import styles from "./signUpForm.module.scss";
import { useAuth, type AuthData } from "@/context/AuthContext";
import { Button, ButtonType } from "@/components/button";
import useMutation from "@/hooks/useMutation";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import Loader from "@/components/loader";
import { PAGE_URLS } from "@/constants";

type SignUpResponse = unknown;
type RegisterPayload = { name: string; email: string; password: string };

export interface SignUpFormProps {
  onSuccess?: (data: SignUpResponse) => void;
}

export const SignUpForm = () => {
  const { setAuth } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // removed submitting local state
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { loading: loadingPageChange, routerPush } = useLoadingRouter();

  // To get what is stored in auth, you can use the `useAuth` hook which provides access to the current auth state.
  // For example:
  const { token, tokenType, user } = useAuth();
  // These variables will contain the current authentication token, token type, and user information.

  const {
    mutateAsync,
    data: mutationData,
    error: mutationError,
    loading: loadingRegister,
  } = useMutation<{ data: AuthData }, RegisterPayload>(
    "https://paisebato-production.up.railway.app/api/auth/register",
    "POST"
  );

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    mutateAsync({ name, email, password });
  };

  useEffect(() => {
    if (mutationData != null) {
      const auth = mutationData.data as AuthData;
      setAuth(auth);

      setMessage("Registration successful.");
      routerPush(PAGE_URLS.home);
    }
  }, [mutationData, setAuth]);

  useEffect(() => {
    if (mutationError) {
      console.error("Registration failed:", mutationError);
      setError(mutationError);
    }
  }, [mutationError]);

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        Welcome to Mayank and Aakash&apos;s project!
      </div>
      <div className={styles.form}>
        <Loader show={loadingPageChange || loadingRegister} />
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
            placeholder="John Doe"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            required
          />
        </div>

        {error ? (
          <p className={styles.messageError}>{error}</p>
        ) : message ? (
          <p className={styles.messageSuccess}>{message}</p>
        ) : null}

        <Button
          disabled={!name || !email || !password}
          className={styles.submitButton}
          onClick={handleSubmit}
          text="Create account"
          variant={ButtonType.Primary}
        />

        <Button
          className={styles.submitButton}
          onClick={() => {
            routerPush(PAGE_URLS.login);
          }}
          text="Login"
          variant={ButtonType.Primary}
        />
      </div>
    </div>
  );
};
export default SignUpForm;
