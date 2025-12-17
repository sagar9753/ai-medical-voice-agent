import { db } from "@/config/db"
import { usersTable } from "@/config/schema"
import { currentUser } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const user = await currentUser()

    try {
        // if user exist
        const existingUser = await db.select().from(usersTable)
            .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress ?? ''))
        // console.log(existingUser, "jjjjj");

        // if user does not exist
        if (existingUser.length == 0) {
            // @ts-ignore
            const res = await db.insert(usersTable).values({
                name: user?.fullName!,
                email: user?.primaryEmailAddress?.emailAddress!,
                clerkUserId: user?.id,
            }).returning()
            return NextResponse.json(res[0])
        }
        return NextResponse.json(existingUser[0])
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        }, { status: 500 });
    }
}
export async function GET(req:NextRequest) {
    const user = await currentUser()
    try {
        const res = await db
        .select({ credits: usersTable.credits })
        .from(usersTable)
        // @ts-ignore
        .where(eq(usersTable.clerkUserId, user?.id))


        return NextResponse.json(res[0])
      
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        }, { status: 500 });
    }
}