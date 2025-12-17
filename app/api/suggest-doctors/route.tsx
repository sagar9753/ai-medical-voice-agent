import { AIDoctorAgents } from "@/lib/list";
import { openai } from "@/lib/openAi";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const { detail } = await req.json();

    try {
        
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-oss-20b:free",
            messages: [
                { role: "system", content: JSON.stringify(AIDoctorAgents) },
                {
                    role: "user", content: `User Notes/Symptoms : ${detail}, Depends on user notes/symptoms, suggest list of doctors who can give treatment, Return ONLY valid JSON. No markdown, no code blocks, no explanations.

                                                You are given a list of doctor objects:
                                                {{AIDoctorAgents}}

                                                Based on the user's symptoms, return:
                                                {
                                                [ ...matching full doctor objects... ]
                                                }

                                                Rules:
                                                - Use only objects from the provided list.
                                                - The suggested Doctor should not not wrong 
                                                - Do NOT modify, rename, or add fields.
                                                - Return full objects exactly as they appear.` }
            ],
        })

        const rawResp = completion.choices[0].message
        // @ts-ignore
        const resp = rawResp.content.trim().replace('```json', '').replace('```', '')
        const JsonResp = JSON.parse(resp)

        // console.log("sssss", JsonResp);
        return NextResponse.json(JsonResp)
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            status: error.response?.status || 500,
            message: error.response?.data?.error?.message || "Something went wrong",
            providerError: error.response?.data?.error || null,
        }, { status: error.response?.status || 500 });
    }
}