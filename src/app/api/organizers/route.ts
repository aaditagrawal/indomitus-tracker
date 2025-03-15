import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users } from "@/db/schema";
import { eq, sql, or } from "drizzle-orm"; // Import 'or' function from drizzle-orm
import { hashPassword } from "@/lib/auth";
import { teamOrganizers } from "@/db/schema";

export async function GET() {
  try {
    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Get organizers, admins, and superadmins
    const organizers = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(
        or(
          // Use 'or' to include different roles
          eq(users.role, "ORGANIZER"),
          eq(users.role, "ADMIN"),
          eq(users.role, "SUPERADMIN"),
        ),
      );

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

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Default to ORGANIZER if role not specified
    const userRole = role || "ORGANIZER";

    // Only allow creating ORGANIZER or ADMIN roles
    if (userRole !== "ORGANIZER" && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 },
      );
    }

    // For creating ADMIN accounts, we should check if the current user is a SUPERADMIN
    // Since we don't have session middleware, we need to get this from request headers
    // In a real app, this would be handled by authentication middleware
    // For now, we'll trust the client-side checks (not ideal for production)

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
        role: userRole,
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
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}
