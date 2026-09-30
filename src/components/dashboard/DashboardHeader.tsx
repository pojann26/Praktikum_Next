"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionUser } from "@/lib/session";
import { logoutAction } from "@/app/actions/authActions";
import { motion, useScroll, useTransform } from "framer-motion";
import { LayoutDashboard, LogOut, PiggyBank, ShieldCheck, Wallet } from "lucide-react";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/preferences/ThemeToggle";

interface DashboardHeaderProps {
  user: SessionUser;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(240, 244, 255, 0)", "rgba(240, 244, 255, 0.72)"]
  );
  const headerBlur = useTransform(scrollY, [0, 80], ["blur(0px)", "blur(16px)"]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);

  return (
    <motion.header
      style={{
        backgroundColor: headerBg,
        backdropFilter: headerBlur,
        borderBottomColor: `rgba(0,0,0,${borderOpacity.get() * 0.1})`,
      }}
      className="sticky top-0 z-40 w-full border-b border-white/10"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg shadow-indigo-600/40"
          >
            <Wallet size={20} />
          </motion.div>
          <div>
            <motion.p
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-lg font-bold tracking-tight text-white"
            >
              Halo, {user.name.split(" ")[0]}
            </motion.p>
            <p className="flex items-center gap-1 text-xs text-emerald-400">
              <ShieldCheck size={12} />
              Sesi terverifikasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              {getInitials(user.name)}
            </span>
            <span className="text-sm text-zinc-300">{user.email}</span>
          </div>
          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            <NavTab
              href="/dashboard"
              label="Dashboard"
              icon={<LayoutDashboard size={14} />}
              active={pathname === "/dashboard"}
            />
            <NavTab
              href="/budget"
              label="Budget"
              icon={<PiggyBank size={14} />}
              active={pathname.startsWith("/budget")}
            />
          </nav>
          <ThemeToggle />
          <form action={logoutAction}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-900/50"
            >
              <LogOut size={16} />
              Logout
            </motion.button>
          </form>
        </div>
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
      className="glass-card p-6"
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 text-xl font-bold text-white shadow-lg shadow-indigo-950/40">
          {getInitials(user.name)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-black/25 p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">ID Pengguna</span>
          <span className="font-mono text-indigo-300">{user.userId}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Tipe Sesi</span>
          <span className="font-medium text-emerald-400">JWT Signed (HS256)</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-zinc-400">Cookie Sesi</span>
          <span className="font-medium text-indigo-300">HttpOnly, SameSite=Lax</span>
        </div>
      </div>
    </motion.section>
  );
}

interface NavTabProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
}

function NavTab({ href, label, icon, active }: NavTabProps) {
  return (
    <Link
      href={href}
      className={`relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors
        ${active
          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
        }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export function CookieStatusCard() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.45 }}
      className="glass-card flex h-full flex-col p-6"
    >
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-lg">
          🔒
        </span>
        <h2 className="text-lg font-bold text-white">Proteksi Cookie</h2>
      </div>
      <p className="mb-6 text-sm leading-6 text-zinc-400">
        Cookie sesi memakai flag <strong className="text-white">HttpOnly</strong> sehingga tidak bisa dibaca script XSS.
      </p>
      <div className="mt-auto rounded-xl border border-amber-500/30 bg-amber-950/30 px-4 py-3 text-sm text-amber-300">
        Cookie <strong>session</strong> aktif di browser
      </div>
    </motion.section>
  );
}
