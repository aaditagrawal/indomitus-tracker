import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { hashPassword } from "@/lib/auth";
import { teamOrganizers } from "@/db/schema";

export async function GET() {
  try {
    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Get organizers
    const organizers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.role, "ORGANIZER"));

    // Get team counts for each organizer
    const organizersWithTeamCounts = await Promise.all(
      organizers.map(async (organizer) => {
        const teamCount = await db
          .select({ count: sql`count(*)` })
          .from(teamOrganizers)
          .where(eq(teamOrganizers.organizer_id, organizer.id));

        return {
          ...organizer,
          teamsCount: teamCount[0].count || 0,
        };
      }),
    );

    await client.close();

    return NextResponse.json(organizersWithTeamCounts);
  } catch (error) {
    console.error("Error fetching organizers:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizers" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email, password, role } = data;

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 },
      );
    }

    // Only allow creating ORGANIZER role
    if (role !== "ORGANIZER") {
      return NextResponse.json(
        { error: "Only ORGANIZER role is allowed to be created" },
        { status: 400 },
      );
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser.length > 0) {
      await client.close();
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 },
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const result = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        role,
      })
      .returning();

    await client.close();

    // Return user data without password
    return NextResponse.json({
      id: result[0].id,
      email: result[0].email,
      role: result[0].role,
    });
  } catch (error) {
    console.error("Error creating organizer:", error);
    return NextResponse.json(
      { error: "Failed to create organizer" },
      { status: 500 },
    );
  }
}
