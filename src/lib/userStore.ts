import { prisma } from "@/lib/prisma";

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string; // bcrypt hashed
  createdAt: Date;
}

// Global in-memory fallback store when PostgreSQL server is offline
const memoryUsers = new Map<string, UserRecord>();

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = email.toLowerCase().trim();
  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (user) return user;
  } catch (error) {
    console.warn("Prisma DB unavailable, checking fallback memory store:", error);
  }

  // Fallback to memory store
  return memoryUsers.get(normalizedEmail) || null;
}

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}): Promise<UserRecord> {
  const normalizedEmail = data.email.toLowerCase().trim();

  try {
    const newUser = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: normalizedEmail,
        password: data.password,
      },
    });
    return newUser;
  } catch (error) {
    console.warn("Prisma DB write failed, storing in memory fallback:", error);
    const fallbackUser: UserRecord = {
      id: "mem_" + Math.random().toString(36).substring(2, 9),
      name: data.name.trim(),
      email: normalizedEmail,
      password: data.password,
      createdAt: new Date(),
    };
    memoryUsers.set(normalizedEmail, fallbackUser);
    return fallbackUser;
  }
}
