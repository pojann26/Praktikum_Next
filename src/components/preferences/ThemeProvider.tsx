"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { UserPreferences } from "@/types";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_COOKIE_NAME = "user_preference_theme";
const LANGUAGE_COOKIE_NAME = "user_preference_language";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

function setCookie(name: string, value: string, days: number = 365): void {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguageState] = useState<"id" | "en">("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = (getCookie(THEME_COOKIE_NAME) as "light" | "dark") || "dark";
    const savedLanguage = (getCookie(LANGUAGE_COOKIE_NAME) as "id" | "en") || "id";

    setTheme(savedTheme);
    setLanguageState(savedLanguage);
    setMounted(true);

    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setCookie(THEME_COOKIE_NAME, newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const setLanguage = (lang: "id" | "en") => {
    setLanguageState(lang);
    setCookie(LANGUAGE_COOKIE_NAME, lang);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, setLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
