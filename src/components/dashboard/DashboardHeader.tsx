"use client";

import { SessionUser } from "@/lib/session";
import { logoutAction } from "@/app/actions/authActions";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogOut, Bell, LockKeyhole, ArrowUpRight } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  user: SessionUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.72)"]
  );
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(24px)"]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        borderBottomColor: `rgba(255,255,255,${borderOpacity.get() * 0.1})`,
      }}
      className="sticky top-0 z-40 w-full border-b border-white/10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Left: Greeting with sun emoji */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-3"
        >
          <span className="text-3xl">☀️</span>
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Hello. {user.name.split(" ")[0]}
            </p>
            <p className="text-xs text-teal-400/80">Welcome back</p>
          </div>
        </motion.div>

        {/* Right: Email badge, notification bell, logout button */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="flex items-center gap-3"
        >
          {/* Email badge */}
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:flex backdrop-blur-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-purple-600 text-xs font-bold text-white">
              {getInitials(user.name)}
            </span>
            <span className="text-sm text-white/90">{user.email}</span>
          </div>

          {/* Notification bell */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:text-white/90"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-teal-400" />
          </motion.button>

          {/* Logout button */}
          <form action={logoutAction}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 hover:border-purple-500/50"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.header>
  );
}

interface UserSessionCardProps {
  user: SessionUser;
}

export function UserSessionCard({ user }: UserSessionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.45 }}
      className="glass-card overflow-hidden p-0"
    >
      <div className="border-b border-white/10 bg-gradient-to-r from-teal-500/10 via-transparent to-violet-500/10 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-teal-300/20 bg-gradient-to-br from-teal-400 to-violet-600 text-xl font-bold text-white shadow-lg shadow-teal-950/40">
            {getInitials(user.name)}
          </div>
          <div className="min-w-0 pt-1">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-300">
              Profil Anda
            </p>
            <h2 className="truncate text-xl font-bold text-white">{user.name}</h2>
            <p className="truncate text-sm text-slate-400">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-sm font-semibold text-white">Transaksi Terbaru</h3>
          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2.5 py-1 text-xs font-medium text-violet-200">
            Aktivitas akun
          </span>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/35 p-4">
          <p className="text-sm text-slate-400">
            Belum ada transaksi terbaru untuk ditampilkan.
          </p>
        </div>

        <dl className="mt-4 grid gap-3 border-t border-white/10 pt-4 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">ID Pengguna</dt>
            <dd className="max-w-[58%] truncate font-mono text-violet-300" title={user.userId}>
              {user.userId}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Tipe Sesi</dt>
            <dd className="font-medium text-teal-300">JWT Signed (HS256)</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Cookie Sesi</dt>
            <dd className="font-medium text-violet-300">HttpOnly, SameSite=Lax</dd>
          </div>
        </dl>
      </div>
    </motion.section>
  );
}

export function CookieStatusCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="glass-card flex h-full flex-col rounded-2xl border border-teal-400/20 bg-teal-950/20 p-5 shadow-lg shadow-teal-950/20"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-300/20 bg-teal-400/15 text-teal-300 shadow-inner shadow-teal-200/10">
            <LockKeyhole size={18} aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-300/80">Security</p>
            <h2 className="text-base font-bold text-white">Proksi Kunci</h2>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full border border-teal-300/20 bg-teal-400/10 px-2.5 py-1 text-[11px] font-semibold text-teal-200">
          Aktif
          <span className="h-1.5 w-1.5 rounded-full bg-teal-300" />
        </span>
      </div>

      <p className="mt-4 text-sm leading-6 text-zinc-300">
        Cookie sesi memakai flag <strong className="font-semibold text-white">HttpOnly</strong> sehingga tidak bisa dibaca script XSS.
      </p>

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-teal-300/25 bg-teal-400/10 px-3.5 py-2.5 text-sm font-semibold text-teal-200 transition hover:border-teal-300/40 hover:bg-teal-400/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300"
      >
        Detail keamanan
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
    </motion.section>
  );
}
