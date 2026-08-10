import { hashPassword, verifyPassword } from "./passwordService";

const PIN_PATTERN = /^\d{6}$/;

export function isValidPinFormat(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

// Reuses the same bcrypt + pepper scheme as passwordService - a PIN is just
// another secret the user proves knowledge of, hashed the same way.
export async function hashPin(pin: string): Promise<string> {
  return hashPassword(pin);
}

export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return verifyPassword(pin, pinHash);
}
