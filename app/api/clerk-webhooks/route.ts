import { Webhook } from "svix";
import { headers } from "next/headers";
import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("🔔 Clerk webhook hit");

  // 1️⃣ Raw body
  const payload = await req.text();

  // 2️⃣ Await headers()
  const headerList = await headers();

  const svixId = headerList.get("svix-id");
  const svixTimestamp = headerList.get("svix-timestamp");
  const svixSignature = headerList.get("svix-signature");

  // 3️⃣ Validate required headers (IMPORTANT)
  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("❌ Missing Svix headers");
    return new Response("Missing Svix headers", { status: 400 });
  }

  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixTimestamp,
    "svix-signature": svixSignature,
  };

  // 4️⃣ Verify webhook
  const wh = new Webhook(clerkWebhookSecret);
  let event: any;

  try {
    event = wh.verify(payload, svixHeaders);
    console.log("✅ Event verified:", event.type);
  } catch (error) {
    console.error("❌ Webhook verification failed:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error
          ? error.message
          : "Something went wrong",
  }, { status: 500 });
  }

  // 5️⃣ Handle subscription.created
  if (event.type === "subscription.active" || event.type === "subscription.created") {
    const clerkUserId = event.data.user_id;

    await db
      .update(usersTable)
      .set({
        credits: sql`${usersTable.credits} + 30`,
      })
      .where(eq(usersTable.clerkUserId, clerkUserId));

    console.log("🎉 30 credits added");
  }

  return new Response("Webhook processed", { status: 200 });
}
