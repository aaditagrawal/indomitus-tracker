import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { users, teamOrganizers } from "@/db/schema";
import { eq } from "drizzle-orm";

type RouteParams = Promise<{ id: string }>;

export async function DELETE(
  request: Request,
  { params }: { params: RouteParams },
) {
  const { id }: { id: string } = await params;

  const client = createClient({
    url: `file:${process.env.DB_FILE_NAME || "./indomitus.db"}`,
  });

  const db = drizzle(client);
  const organizerId = parseInt(id);

  if (isNaN(organizerId)) {
    await client.close();
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(teamOrganizers)
        .where(eq(teamOrganizers.organizer_id, organizerId));

      await tx.delete(users).where(eq(users.id, organizerId));
    });

    await client.close();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting organizer:", err);
    await client.close();
    return NextResponse.json(
      { error: "Failed to delete organizer" },
      { status: 500 },
    );
  }
}
