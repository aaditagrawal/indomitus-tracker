import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../db/schema";
import { users } from "../db/schema"; // Import all table definitions
import { hashPassword } from "@/lib/auth";
import "dotenv/config";
import fs from "node:fs";

// Use the environment variable or default
const dbFilePath = process.env.DB_FILE_NAME || "./indomitus.db";

async function initDb() {
  console.log(`Initializing database at: ${dbFilePath}`);

  // Ensure the directory exists
  const dbDir = dbFilePath.substring(0, dbFilePath.lastIndexOf("/"));
  if (dbDir) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Check if the database file already exists and delete it if it does
  if (fs.existsSync(dbFilePath)) {
    console.log("Deleting existing database file to create a new one...");
    fs.unlinkSync(dbFilePath);
    console.log("Old database file deleted.");
  } else {
    console.log("No existing database file found, creating a new one.");
  }

  // Create client and connect to the database
  const client = createClient({
    url: `file:${dbFilePath}`,
  });

  const db = drizzle(client, { schema });

  try {
    console.log("Creating database schema directly from schema.ts...");

    // Directly create tables using raw SQL for each table in your schema
    await db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS rooms (
                room_id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_name TEXT NOT NULL
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS teams (
                team_id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_name TEXT NOT NULL,
                room_id INTEGER NOT NULL,
                team_leader_id INTEGER
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS participants (
                participant_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                phone_number TEXT,
                email TEXT,
                college TEXT,
                gender TEXT,
                discord_id TEXT,
                team_id INTEGER NOT NULL
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS arrival_events (
                event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id INTEGER NOT NULL,
                arrived INTEGER NOT NULL,
                timestamp TEXT NOT NULL
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS tickets (
                ticket_id INTEGER PRIMARY KEY AUTOINCREMENT,
                team_id INTEGER NOT NULL,
                ticket_code TEXT NOT NULL
            );
        `);
    await db.run(`
            CREATE TABLE IF NOT EXISTS team_organizers (
                team_id INTEGER NOT NULL,
                organizer_id INTEGER NOT NULL,
                PRIMARY KEY (team_id, organizer_id)
            );
        `);

    console.log("Database schema created.");

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
    } catch (superAdminError) {
      console.error("Failed to insert superadmin:", superAdminError);
      throw superAdminError; // Re-throw to halt initialization on superadmin creation failure
    }
  } catch (schemaError) {
    console.error(
      "Database initialization failed during schema creation:",
      schemaError,
    );
    throw schemaError; // Re-throw to halt initialization on schema creation failure
  } finally {
    await client.close();
    console.log("Database initialization process finished.");
  }
}

initDb().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1); // Exit with an error code to indicate failure
});
