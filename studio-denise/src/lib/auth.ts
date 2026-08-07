import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import type { Role } from "./domain";
import { STAFF_ROLES } from "./domain";

const COOKIE_NAME = "clube_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET || "dev-insecure-secret-change-me-please-32b";
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  sub: string; // user id
  role: Role;
  name: string;
};

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function destroySession(): void {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

/** Lê e valida a sessão do cookie. Retorna null se ausente/inválida. */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Carrega o usuário completo da sessão (ou null). */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: session.sub } });
}

export function isStaff(role: Role | undefined | null): boolean {
  return !!role && STAFF_ROLES.includes(role);
}
