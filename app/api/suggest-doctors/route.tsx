import { AIDoctorAgents } from "@/lib/list";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: NextRequest) {
    const { detail } = await req.json();

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: `${JSON.stringify(AIDoctorAgents)}

User Notes/Symptoms : ${detail}, Depends on user notes/symptoms, suggest list of doctors who can give treatment, Return ONLY valid JSON. No markdown, no code blocks, no explanations.

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
- Return full objects exactly as they appear.
              `,
                        },
                    ],
                },
            ],
        });
        const rawResp = result?.text;

        const cleaned = rawResp!
            .trim()
            .replace("```json", "")
            .replace("```", "");

        const JsonResp = JSON.parse(cleaned);

        return NextResponse.json(JsonResp);
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                status: 500,
                message: error.message || "Something went wrong",
                providerError: error || null,
            },
            { status: 500 }
        );
    }
}
