import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../db/schema";
import { users } from "../db/schema";
import { hashPassword } from "../lib/auth"; // We'll create this next
import "dotenv/config";

// Make sure DB_FILE_NAME is set in your .env
const dbFilePath = process.env.DB_FILE_NAME;

if (!dbFilePath) {
  console.error("DB_FILE_NAME environment variable is not set");
  process.exit(1);
}

async function initDb() {
  // Create client and connect to the database
  const client = createClient({
    url: `file:${dbFilePath}`,
  });

  const db = drizzle(client, { schema });

  // Hash the password - we'll create this utility function
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
