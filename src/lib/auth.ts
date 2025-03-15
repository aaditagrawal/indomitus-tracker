import * as crypto from "crypto";

// Hash a password with a randomly generated salt
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Generate a random salt
    const salt = crypto.randomBytes(16).toString("hex");

    // Hash the password with the salt
    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);

      // Return the salt and hash combined
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

// Verify a password against a hash
export async function verifyPassword(
  password: string,
  hashWithSalt: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, hash] = hashWithSalt.split(":");

    crypto.pbkdf2(password, salt, 1000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);

      resolve(derivedKey.toString("hex") === hash);
    });
  });
}
