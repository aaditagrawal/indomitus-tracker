import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { createClient } from "@libsql/client";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { GET } from "../src/app/api/teams/route";

let directory: string;
const previousDatabase = process.env.DB_FILE_NAME;

beforeAll(async () => {
  directory = await mkdtemp(join(tmpdir(), "teams-counts-"));
  process.env.DB_FILE_NAME = join(directory, "fixture.db");
  const client = createClient({ url: `file:${process.env.DB_FILE_NAME}` });
  try {
    await client.executeMultiple(`
      CREATE TABLE teams (team_id INTEGER PRIMARY KEY, team_name TEXT, room_id INTEGER, team_leader_id INTEGER);
      CREATE TABLE rooms (room_id INTEGER PRIMARY KEY, room_name TEXT);
      CREATE TABLE participants (participant_id INTEGER PRIMARY KEY, team_id INTEGER);
      CREATE TABLE team_organizers (team_id INTEGER, organizer_id INTEGER);
      INSERT INTO rooms VALUES (1, 'One');
      INSERT INTO teams VALUES (1, 'Empty', 1, NULL), (2, 'Pair', 1, 1), (3, 'Missing room', 99, 3);
      INSERT INTO participants VALUES (1, 2), (2, 2), (3, 3), (4, 999);
      INSERT INTO team_organizers VALUES (2, 7), (3, 7), (1, 8);
    `);
  } finally {
    client.close();
  }
});

afterAll(async () => {
  if (previousDatabase === undefined) delete process.env.DB_FILE_NAME;
  else process.env.DB_FILE_NAME = previousDatabase;
  await rm(directory, { recursive: true, force: true });
});

async function getTeams(query = "") {
  const response = await GET(new Request(`http://localhost/api/teams${query}`));
  expect(response.status).toBe(200);
  return response.json();
}

describe("team participant counts", () => {
  test("includes zero-count teams and preserves room joins and response fields", async () => {
    expect(await getTeams()).toEqual([
      { team_id: 1, team_name: "Empty", room_id: 1, room_name: "One", team_leader_id: null, participant_count: 0 },
      { team_id: 2, team_name: "Pair", room_id: 1, room_name: "One", team_leader_id: 1, participant_count: 2 },
      { team_id: 3, team_name: "Missing room", room_id: 99, room_name: null, team_leader_id: 3, participant_count: 1 },
    ]);
  });

  test("preserves organizer filtering", async () => {
    const teams = await getTeams("?organizerId=7");
    expect(teams.map((team: { team_id: number; participant_count: number }) => [team.team_id, team.participant_count]))
      .toEqual([[2, 2], [3, 1]]);
    expect(await getTeams("?organizerId=999")).toEqual([]);
  });
});
