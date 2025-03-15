import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../db/schema";
import { users } from "../db/schema";
import { hashPassword } from "../lib/auth";
import "dotenv/config";

// Use the environment variable or default
const dbFilePath = process.env.DB_FILE_NAME || "./indomitus.db";

async function initDb() {
  console.log(`Initializing database at: ${dbFilePath}`);

  // Create client and connect to the database
  const client = createClient({
    url: `file:${dbFilePath}`,
  });

  const db = drizzle(client, { schema });

  // Hash the password
  const hashedPassword = await hashPassword("superadmin123"); // Use a strong password

  try {
    // Insert superadmin user
    const result = await db
      .insert(users)
      .values({
        email: "superadmin@indomitus.com",
        password: hashedPassword,
        role: "SUPERADMIN",
      })
      .returning();

    console.log("Superadmin created successfully:", result);
  } catch (error) {
    console.error("Failed to insert superadmin:", error);
  } finally {
    await client.close();
  }
}

initDb().catch(console.error);
