"use server";

import { redirect } from "next/navigation";
import { hashPassword, verifyPassword } from "@/lib/auth";
import {
  createSessionToken,
  setSessionCookie,
  deleteSessionCookie,
} from "@/lib/session";
import { setUserPreferences } from "@/lib/preferences";
import { findUserByEmail, createUser } from "@/lib/userStore";

export interface FormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

/**
 * Server Action for User Registration
 */
export async function registerAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get("name")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const confirmPassword = formData.get("confirmPassword")?.toString() || "";

  const errors: Record<string, string> = {};

  if (!name.trim()) errors.name = "Nama lengkap wajib diisi";
  if (!email.trim() || !email.includes("@")) errors.email = "Email tidak valid";
  if (password.length < 6)
    errors.password = "Password minimal harus 6 karakter";
  if (password !== confirmPassword)
    errors.confirmPassword = "Konfirmasi password tidak cocok";

  if (Object.keys(errors).length > 0) {
    return { success: false, message: "Validasi gagal. Periksa input Anda.", errors };
  }

  // Check if user already exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: "Email ini sudah terdaftar. Silakan login.",
      errors: { email: "Email sudah digunakan" },
    };
  }

  // Encrypt password using bcrypt
  const hashedPassword = await hashPassword(password);

  // Save new user
  await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return {
    success: true,
    message: "Pendaftaran berhasil! Silakan login dengan akun Anda.",
  };
}

/**
 * Server Action for User Login
 */
export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return {
      success: false,
      message: "Email dan password wajib diisi.",
    };
  }

  // Find user by email
  const user = await findUserByEmail(email);
  if (!user) {
    return {
      success: false,
      message: "Email atau password salah.",
    };
  }

  // Verify encrypted password
  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return {
      success: false,
      message: "Email atau password salah.",
    };
  }

  // Create JWT session and set HttpOnly cookie
  const sessionToken = await createSessionToken({
    userId: user.id,
    email: user.email,
    name: user.name,
  });

  await setSessionCookie(sessionToken);

  redirect("/dashboard");
}

/**
 * Server Action for User Logout
 */
export async function logoutAction(): Promise<void> {
  await deleteSessionCookie();
  redirect("/login");
}

/**
 * Server Action to update user preference cookies
 */
export async function updatePreferencesAction(
  theme: "dark" | "light" | "system",
  language: "id" | "en"
): Promise<FormState> {
  await setUserPreferences({ theme, language });
  return {
    success: true,
    message: "Preferensi pengguna berhasil diperbarui.",
  };
}
