import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../../lib/openAi";
import { db } from "@/config/db";
import { sessionChatTable, usersTable } from "@/config/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const report_gen_prompt = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the doctor Ai agent info and conversation , generate a structured report with the following fields:
1. sessionId: a unique session identifier
2. agent: the medical specialist name (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timestamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7. symptoms: list of symptoms mentioned by the user
8. duration: how long the user has experienced the symptoms
9. severity: mild, moderate, or severe
10. medicationsMentioned: list of any medicines mentioned
11. recommendations: list of AI suggestions (e.g., rest, see a doctor)
 
Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"]
}

Only include valid fields. Respond with nothing else.
 
`

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    const { messages, doctorAgentDetails, sessionId, time } = await req.json();
    // console.log("In Gen Rep Api", messages, doctorAgentDetails, sessionId, time);
    try {
        const userInput = "Ai Doctor Agent Info : " + JSON.stringify(doctorAgentDetails) + ", Conversation : " + JSON.stringify(messages) + ", Duration : " + JSON.stringify(time)
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                { role: "system", content: report_gen_prompt },
                {
                    role: "user", content: userInput
                }
            ],
        })

        const rawResp = completion.choices[0].message
        // @ts-ignore
        const resp = rawResp.content.trim().replace('```json', '').replace('```', '')
        const JsonResp = JSON.parse(resp)

        // save report to db

        const res = await db.update(sessionChatTable).set({
            report: JsonResp,
            conversation: messages,
        }).where(eq(sessionChatTable.sessionId, sessionId))
        await db.update(usersTable).set({
            credits: sql`${usersTable.credits} - 1`,
            // @ts-ignore
        }).where(eq(usersTable.clerkUserId, userId))

        return NextResponse.json(JsonResp);
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Something went wrong",
        }, { status: 500 });
    }
}