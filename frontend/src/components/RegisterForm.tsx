"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { register, ApiError, RegisterPayload } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ISO_4217_CURRENCIES, getCurrencySymbol } from "@/lib/currencies";

const initialForm: RegisterPayload = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  country: "",
  currency_code: "EUR",
};

export default function RegisterForm() {
  const { setSession } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  function update<K extends keyof RegisterPayload>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.password_confirmation ||
      !form.country ||
      !form.currency_code
    ) {
      setError({ message: "Please fill in all fields." });
      return;
    }

    setLoading(true);

    try {
      const result = await register(form);
      setSession(result);
      router.replace("/dashboard");
    } catch (err) {
      setError(err as ApiError);
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-[12px] border border-[#363636] bg-white/5 px-4 py-3 text-sm text-[#f4f1f1] placeholder:text-muted-default/60 outline-none transition-colors duration-200 focus:border-buzz-red focus:ring-2 focus:ring-buzz-red/20";
  const labelClassName = "mb-2 block text-sm font-medium text-muted-default";

  return (
    <div className="rounded-[24px] border border-[#363636] bg-white/[0.02] p-8">
      <h1 className="font-manrope text-2xl font-bold text-white">
        Create account
      </h1>
      <p className="mt-2 text-sm text-muted-dark">
        Create your BuzzPay account to submit and manage payment requests.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Alice Ferreira"
            className={inputClassName}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClassName}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="alice@example.com"
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="password" className={labelClassName}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="••••••••"
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="password_confirmation" className={labelClassName}>
              Confirm
            </label>
            <input
              id="password_confirmation"
              type="password"
              autoComplete="new-password"
              value={form.password_confirmation}
              onChange={(e) => update("password_confirmation", e.target.value)}
              placeholder="••••••••"
              className={inputClassName}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className={labelClassName}>
              Country
            </label>
            <input
              id="country"
              type="text"
              autoComplete="country-name"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="Brazil"
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="currency_code" className={labelClassName}>
              Currency
            </label>
            <select
              id="currency_code"
              value={form.currency_code}
              onChange={(e) => update("currency_code", e.target.value)}
              className={inputClassName}
            >
              {ISO_4217_CURRENCIES.map((code) => {
                const symbol = getCurrencySymbol(code);
                return (
                  <option key={code} value={code} className="bg-ink">
                    {symbol ? `${code} (${symbol})` : code}
                  </option>
                );
              })}
            </select>
          </div>
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
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </button>

        <p className="text-center text-sm text-muted-dark">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#f0eded] transition-colors hover:text-buzz-bright"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
