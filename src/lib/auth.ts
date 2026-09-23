import bcrypt from "bcryptjs";

/**
 * Encrypts a plain-text password using bcrypt with salt rounds = 10.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Compares a plain-text password with a bcrypt hashed password.
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
