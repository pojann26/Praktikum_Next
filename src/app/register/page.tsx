"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, FormState } from "@/app/actions/authActions";

const initialState: FormState = {
  success: false,
  message: "",
};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(
    registerAction,
    initialState
  );

  const [password, setPassword] = useState("");

  const getPasswordStrength = (pass: string) => {
    if (pass.length === 0) return { label: "", color: "" };
    if (pass.length < 6) return { label: "Lemah (Min. 6 Karakter)", color: "bg-red-500" };
    if (pass.length < 10) return { label: "Sedang", color: "bg-yellow-500" };
    return { label: "Sangat Kuat", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Buat Akun Baru
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Daftar untuk mengakses modul autentikasi Next.js
          </p>
        </div>

        {state.message && (
          <div
            className={`p-4 mb-6 rounded-xl text-sm font-medium border ${
              state.success
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            {state.message}
            {state.success && (
              <div className="mt-2">
                <Link
                  href="/login"
                  className="inline-block text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-lg transition"
                >
                  Lanjut ke Halaman Login &rarr;
                </Link>
              </div>
            )}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ahmad Fauzi"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state.errors?.name && (
              <p className="text-xs text-red-400 mt-1">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Alamat Email
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="nama@domain.com"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state.errors?.email && (
              <p className="text-xs text-red-400 mt-1">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Password (Akan dienkripsi dengan bcrypt)
            </label>
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {strength.label && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-300`}
                    style={{
                      width:
                        password.length < 6
                          ? "33%"
                          : password.length < 10
                          ? "66%"
                          : "100%",
                    }}
                  />
                </div>
                <span className="text-xs text-zinc-400 font-medium">
                  {strength.label}
                </span>
              </div>
            )}
            {state.errors?.password && (
              <p className="text-xs text-red-400 mt-1">
                {state.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Konfirmasi Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700/80 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {state.errors?.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">
                {state.errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full mt-6 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Mendaftarkan...</span>
              </>
            ) : (
              "Daftar Sekarang"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          Sudah memiliki akun?{" "}
          <Link
            href="/login"
            className="text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
          >
            Login di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
