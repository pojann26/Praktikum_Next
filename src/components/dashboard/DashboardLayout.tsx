import { ReactNode } from "react";
import { AnimatedMeshBackground } from "./AnimatedMeshBackground";

interface DashboardLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-950 text-zinc-50">
      <AnimatedMeshBackground />
      {header}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
