import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users, teamOrganizers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const organizerId = parseInt(params.id);

    if (isNaN(organizerId)) {
      return NextResponse.json(
        { error: "Invalid organizer ID" },
        { status: 400 },
      );
    }

    const client = createClient({
      url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
    });

    const db = drizzle(client);

    // Delete in a transaction to maintain referential integrity
    await db.transaction(async (tx) => {
      // First remove any team assignments
      await tx
        .delete(teamOrganizers)
        .where(eq(teamOrganizers.organizer_id, organizerId));

      // Then delete the user
      await tx.delete(users).where(eq(users.id, organizerId));
    });

    await client.close();

    return NextResponse.json({
      success: true,
      message: "Organizer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organizer:", error);
    return NextResponse.json(
      { error: "Failed to delete organizer" },
      { status: 500 },
    );
  }
}
