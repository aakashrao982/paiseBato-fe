"use client";

import React, { useEffect, useState } from "react";
import styles from "./loginForm.module.scss";
import useMutation from "@/hooks/useMutation";
import { Button } from "@/components/button";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import Loader from "@/components/loader";
import { PAGE_URLS } from "@/constants";
import { useAuth, type AuthData } from "@/context/AuthContext";

type LoginResponse = unknown;
type LoginPayload = { email: string; password: string };

export interface LoginFormProps {
  onSuccess?: (data: LoginResponse) => void;
}

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { routerPush, loading: loadingPageChange } = useLoadingRouter();

  const {
    mutateAsync,
    data: mutationData,
    error: mutationError,
    loading: loadingLogin,
  } = useMutation<{ data: AuthData }, LoginPayload>("/api/auth/login", "POST");

  const handleSubmit = async () => {
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      await mutateAsync({ email, password });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (mutationData != null) {
      const auth = mutationData.data as AuthData;
      setAuth(auth);
      setMessage("Login successful.");
      onSuccess?.(mutationData);
      routerPush(PAGE_URLS.home);
    }
  }, [mutationData, onSuccess]);

  useEffect(() => {
    if (mutationError) {
      console.error("Login failed:", mutationError);
      setError(mutationError);
    }
  }, [mutationError]);

  return (
    <div className={styles.container}>
      <div className={styles.welcome}>
        Welcome to Mayank and Aakash's project!
      </div>
      <div className={styles.form}>
        <Loader show={loadingPageChange} />
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
            autoComplete="current-password"
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

        <Loader show={loadingPageChange || loadingLogin} />
        <Button
          disabled={isSubmitting || loadingLogin}
          className={styles.submitButton}
          onClick={handleSubmit}
          text={loadingLogin ? "Logging in..." : "Log in"}
        />
        <Button
          className={styles.submitButton}
          onClick={() => {
            routerPush(PAGE_URLS.signUp);
          }}
          text="Sign up"
        />
      </div>
    </div>
  );
};

export default LoginForm;
