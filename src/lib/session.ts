import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_super_secret_jwt_key_nextjs_praktikum_2026"
);

export interface SessionUser {
  userId: string;
  email: string;
  name: string;
}

/**
 * Creates a signed JWT session token.
 */
export async function createSessionToken(
  payload: SessionUser
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET_KEY);
}

/**
 * Verifies a JWT session token and returns the decoded payload if valid.
 */
export async function verifySessionToken(
  token: string
): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

/**
 * Sets an HttpOnly secure session cookie in Next.js response context.
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day in seconds
  });
}

/**
 * Deletes the session cookie (logout).
 */
export async function deleteSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Retrieves and validates current logged-in user session from cookies.
 */
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!sessionToken) return null;

  return verifySessionToken(sessionToken);
}

// ==========================================
// P1 Task: Budget Session Helpers
// ==========================================

/**
 * Helper untuk mengambil userId dari sesi aktif.
 * Mengembalikan string userId jika user terautentikasi, atau null jika tidak ada sesi.
 */
export async function getAuthUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * Helper otentikasi ketat untuk Server Actions (Budget, Transaksi, dll).
 * Mengembalikan userId jika valid, atau melempar Error 'Unauthorized' jika sesi tidak ditemukan/kadaluarsa.
 */
export async function requireAuthUserId(): Promise<string> {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error(
      "Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali."
    );
  }
  return session.userId;
}

/**
 * Helper untuk mengambil data profil lengkap pengguna yang sedang login.
 * Melempar error jika belum terotentikasi.
 */
export async function requireAuthUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error(
      "Unauthorized: Sesi tidak valid atau telah berakhir. Silakan login kembali."
    );
  }
  return session;
}

