// src/drizzles/schema.ts
import { int, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull(), // Allowed values: "SUPERADMIN", "ADMIN", "ORGANIZER"
});

export const teams = sqliteTable("teams", {
  team_id: int("team_id").primaryKey({ autoIncrement: true }),
  team_name: text("team_name").notNull(),
  room_id: int("room_id").notNull(),
  team_leader_id: int("team_leader_id"), // Will be set to one of the participants
});

export const participants = sqliteTable("participants", {
  participant_id: int("participant_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone_number: text("phone_number"),
  email: text("email"),
  college: text("college"),
  gender: text("gender"), // Add gender field
  discord_id: text("discord_id"), // Add Discord ID field
  team_id: int("team_id").notNull(),
});

export const rooms = sqliteTable("rooms", {
  room_id: int("room_id").primaryKey({ autoIncrement: true }),
  room_name: text("room_name").notNull(),
});

// New: Table for the Arrival event
export const arrivalEvents = sqliteTable("arrival_events", {
  event_id: int("event_id").primaryKey({ autoIncrement: true }),
  team_id: int("team_id").notNull(), // foreign key to teams.team_id
  arrived: int("arrived").notNull().$type<0 | 1>(), // indicates whether the team has arrived
  timestamp: text("timestamp").notNull(), // user-input timestamp (in ISO format, for example)
});

// New: Table for Ticket IDs (multiple tickets per team)
export const tickets = sqliteTable("tickets", {
  ticket_id: int("ticket_id").primaryKey({ autoIncrement: true }),
  team_id: int("team_id").notNull(), // foreign key to teams.team_id
  ticket_code: text("ticket_code").notNull(), // the ticket identifier
});

// New: Junction table for assigning organizers to teams
export const teamOrganizers = sqliteTable(
  "team_organizers",
  {
    team_id: int("team_id").notNull(), // foreign key to teams.team_id
    organizer_id: int("organizer_id").notNull(), // foreign key to users.id (with role ORGANIZER/ADMIN)
  },
  (table) => ({
    pk: primaryKey(table.team_id, table.organizer_id),
  }),
);
