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
