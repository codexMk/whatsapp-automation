import * as bcrypt from "bcryptjs";
import { db } from "./db";

export type AuthUser = {
  id: string;
  email: string;
};

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  return db.user.findUnique({
    where: { email: normalizedEmail }
  });
}

