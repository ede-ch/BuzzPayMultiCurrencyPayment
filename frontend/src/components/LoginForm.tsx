"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Loader2, AlertCircle } from "lucide-react";
import { login, ApiError, LoginResponse } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import AuthSuccessCard from "@/components/AuthSuccessCard";

export default function LoginForm() {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [success, setSuccess] = useState<LoginResponse | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError({ message: "Please enter your email and password." });
      return;
    }

    setLoading(true);

    try {
      const result = await login(email, password);
      setSession(result);
      setSuccess(result);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <AuthSuccessCard
        title="Login successful"
        subtitle={`Welcome back, ${success.user.name}.`}
        result={success}
      />
    );
  }

  return (
    <div className="rounded-[24px] border border-[#363636] bg-white/[0.02] p-8">
      <h1 className="font-manrope text-2xl font-bold text-white">Sign in</h1>
      <p className="mt-2 text-sm text-muted-dark">
        Access your BuzzPay account to manage your payment requests.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-muted-default"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alice@example.com"
            className="w-full rounded-[12px] border border-[#363636] bg-white/5 px-4 py-3 text-sm text-[#f4f1f1] placeholder:text-muted-default/60 outline-none transition-colors duration-200 focus:border-buzz-red focus:ring-2 focus:ring-buzz-red/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-muted-default"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-[12px] border border-[#363636] bg-white/5 px-4 py-3 text-sm text-[#f4f1f1] placeholder:text-muted-default/60 outline-none transition-colors duration-200 focus:border-buzz-red focus:ring-2 focus:ring-buzz-red/20"
          />
        </div>

        {error && (
          <div className="flex items-start gap-3 rounded-[12px] border border-buzz-red/30 bg-buzz-red/10 px-4 py-3 text-sm text-[#f4f1f1]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-buzz-bright" />
            <div>
              <p>{error.message}</p>
              {error.errors && (
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-dark">
                  {Object.values(error.errors)
                    .flat()
                    .map((message) => (
                      <li key={message}>{message}</li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border-none px-[20px] py-[15px] text-[15px] font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
          style={{
            background: "linear-gradient(5deg, #C60402, #C60402)",
            boxShadow: "0 1px 30px rgba(224,26,26,0.40)",
          }}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>

        <p className="text-center text-sm text-muted-dark">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#f0eded] transition-colors hover:text-buzz-bright"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
