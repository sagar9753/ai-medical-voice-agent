import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    const { detail, selectedDoctor } = await req.json()
    const user = await currentUser()
    // console.log(detail, selectedDoctor);


    try {
        const sessionId = uuidv4()
        const res = await db.insert(sessionChatTable).values({
            sessionId: sessionId,
            createdBy: user?.primaryEmailAddress?.emailAddress,
            detail: detail,
            selectedDoctor: selectedDoctor,
            createdOn: (new Date()).toString()
        }).returning()

        return NextResponse.json(res[0])
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong while saving te session data",
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const sessionId = searchParams.get('sessionId')
        const user = await currentUser();

        if (sessionId == 'all') {
            const res = await db.select().from(sessionChatTable).where(
                // @ts-ignore
                eq(sessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress)
            ).orderBy(desc(sessionChatTable.id))

            return NextResponse.json(res)
        } else {
            const res = await db.select().from(sessionChatTable).where(
                // @ts-ignore
                eq(sessionChatTable.sessionId, sessionId)
            )
            return NextResponse.json(res[0]);
        }
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong while fatching session data",
        }, { status: 500 });
    }
}