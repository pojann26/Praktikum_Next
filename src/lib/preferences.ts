import { cookies } from "next/headers";

export const PREFERENCE_COOKIE_NAME = "user_preference";

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  language: "id" | "en";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "dark",
  language: "id",
};

/**
 * Reads user preferences from cookie.
 */
export async function getUserPreferences(): Promise<UserPreferences> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(PREFERENCE_COOKIE_NAME)?.value;
  if (!rawValue) return DEFAULT_PREFERENCES;

  try {
    const parsed = JSON.parse(rawValue);
    return {
      theme: ["dark", "light", "system"].includes(parsed.theme)
        ? parsed.theme
        : DEFAULT_PREFERENCES.theme,
      language: ["id", "en"].includes(parsed.language)
        ? parsed.language
        : DEFAULT_PREFERENCES.language,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Saves user preferences to cookie.
 */
export async function setUserPreferences(
  preferences: Partial<UserPreferences>
): Promise<UserPreferences> {
  const current = await getUserPreferences();
  const updated: UserPreferences = { ...current, ...preferences };

  const cookieStore = await cookies();
  cookieStore.set(PREFERENCE_COOKIE_NAME, JSON.stringify(updated), {
    httpOnly: false, // accessible client-side if needed for theme toggle scripts
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return updated;
}

// ==========================================
// P1 Task: Budget Period Preference Cookies
// ==========================================
export const BUDGET_PERIOD_COOKIE_NAME = "budget_period";

export interface BudgetPeriodPreference {
  month: number; // 1 - 12
  year: number;  // Contoh: 2026
}

export function getDefaultBudgetPeriod(): BudgetPeriodPreference {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };
}

/**
 * Membaca preferensi periode bulan & tahun anggaran dari cookie 'budget_period'.
 * Mengembalikan bulan berjalan jika cookie belum ada.
 */
export async function getBudgetPeriodPreference(): Promise<BudgetPeriodPreference> {
  const cookieStore = await cookies();
  const rawValue = cookieStore.get(BUDGET_PERIOD_COOKIE_NAME)?.value;
  if (!rawValue) return getDefaultBudgetPeriod();

  try {
    const parsed = JSON.parse(rawValue);
    const month = Number(parsed.month);
    const year = Number(parsed.year);

    if (month >= 1 && month <= 12 && year >= 2000 && year <= 2100) {
      return { month, year };
    }
    return getDefaultBudgetPeriod();
  } catch {
    return getDefaultBudgetPeriod();
  }
}

/**
 * Menyimpan preferensi bulan & tahun anggaran ke cookie 'budget_period'.
 */
export async function setBudgetPeriodPreference(
  period: Partial<BudgetPeriodPreference>
): Promise<BudgetPeriodPreference> {
  const current = await getBudgetPeriodPreference();
  const month = period.month !== undefined ? Number(period.month) : current.month;
  const year = period.year !== undefined ? Number(period.year) : current.year;

  const validMonth = month >= 1 && month <= 12 ? month : current.month;
  const validYear = year >= 2000 && year <= 2100 ? year : current.year;

  const updated: BudgetPeriodPreference = { month: validMonth, year: validYear };

  const cookieStore = await cookies();
  cookieStore.set(BUDGET_PERIOD_COOKIE_NAME, JSON.stringify(updated), {
    httpOnly: false, // Dapat diakses client-side untuk sinkronisasi MonthPicker
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 tahun
  });

  return updated;
}

