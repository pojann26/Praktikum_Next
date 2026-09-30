"use client";

import { motion } from "framer-motion";

export function AnimatedMeshBackground() {
  const blobVariantsDark = {
    animate: {
      x: [0, 50, -30, 0],
      y: [0, -40, 30, 0],
      scale: [1, 1.1, 0.95, 1],
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  const blobVariantsLight = {
    animate: {
      x: [0, -60, 40, 0],
      y: [0, 50, -20, 0],
      scale: [1, 1.05, 0.9, 1],
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 2,
      },
    },
  };

  const blobVariants3Dark = {
    animate: {
      x: [0, 30, -40, 0],
      y: [0, -30, 50, 0],
      scale: [1, 1.08, 0.92, 1],
      transition: {
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 4,
      },
    },
  };

  const blobVariants3Light = {
    animate: {
      x: [0, 30, -40, 0],
      y: [0, -30, 50, 0],
      scale: [1, 1.08, 0.92, 1],
      transition: {
        duration: 18,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 4,
      },
    },
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Static mesh gradient */}
      <div className="absolute inset-0 mesh-bg" />
      
      {/* Floating Animated Blobs - Dark Mode */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl"
        variants={blobVariantsDark}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/3 right-1/5 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/15 blur-3xl"
        variants={blobVariantsDark}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl"
        variants={blobVariants3Dark}
        animate="animate"
      />
      
      {/* Floating Animated Blobs - Light Mode */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/20 blur-3xl"
        variants={blobVariantsLight}
        animate="animate"
      />
      <motion.div
        className="absolute top-1/3 right-1/5 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/15 blur-3xl"
        variants={blobVariantsLight}
        animate="animate"
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-300/10 blur-3xl"
        variants={blobVariants3Light}
        animate="animate"
      />
      
      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='currentColor' fillOpacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
    </div>
  );
}