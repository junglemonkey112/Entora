import { NextRequest, NextResponse } from "next/server";

const API_KEY =
  process.env.ANTHROPIC_API_KEY ||
  process.env.DASHSCOPE_API_KEY ||
  process.env.ANTHROPIC_AUTH_TOKEN;
const API_MODEL = process.env.DASHSCOPE_MODEL || process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const API_BASE_URL =
  process.env.DASHSCOPE_BASE_URL ||
  process.env.ANTHROPIC_BASE_URL ||
  "https://api.anthropic.com";

const SYSTEM_PROMPT = `You are Entora AI, a warm and encouraging college admissions advisor built into the Entora platform. You genuinely care about helping students find the right college fit.

Your tone:
- Warm, supportive, and optimistic — like a trusted older sibling who went through the process
- Use simple, clear language (no jargon)
- Celebrate what students have going for them before addressing gaps
- Be specific and actionable, not generic

Your expertise:
- College selection and fit assessment for US, UK, Canada, and Australia universities
- Application strategy and timelines (Common App, UCAS, etc.)
- Essay brainstorming and personal statement tips
- Extracurricular positioning
- SAT/ACT/IELTS/TOEFL guidance
- Financial aid and scholarships (FAFSA, CSS Profile, international aid)
- Interview prep
- International student admissions — especially students from China, Korea, Japan, and India
- Visa processes (F-1, UK Student Visa, etc.)

Entora platform features you can reference:
- /guides — students can book 1-on-1 sessions with verified Student Counselors ($35–$90/hr) who have been through the exact admissions process
- /community — free forum where students ask questions and share experiences
- /roadmap — grade-by-grade college prep timeline
- /schools — university explorer with acceptance rates and program info
- /resources — free essay examples, checklists, and visa guides

Response format:
- Keep responses to 2-3 short paragraphs (max 160 words)
- Use line breaks between paragraphs for readability
- End with a follow-up question to keep the conversation going
- When the student's question would benefit from deeper 1-on-1 help, naturally mention that Entora has verified Student Counselors on /guides who speak their language and have been through the same process
- Never fabricate specific acceptance rates, test score cutoffs, or tuition numbers — say "check the school's website" instead`;

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 503 }
    );
  }

  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    if (messages.length > 20) {
      return NextResponse.json(
        { error: "Conversation too long. Please start a new chat." },
        { status: 400 }
      );
    }

    const apiMessages = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "ai" ? "assistant" : m.role,
      content: m.content,
    }));

    const response = await fetch(`${API_BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: API_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: apiMessages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error: status=${response.status} body=${errorText.slice(0, 300)}`);
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 502 }
      );
    }

    const data = await response.json();
    const aiContent = extractTextContent(data);

    if (!aiContent) {
      console.error("Could not parse AI response:", JSON.stringify(data).slice(0, 500));
      return NextResponse.json({ content: "I'm having trouble responding right now. Please try again." });
    }

    return NextResponse.json({ content: aiContent });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

function extractTextContent(data: Record<string, unknown>): string | undefined {
  const contentArray = data.content ?? (data.role ? data.content : undefined);

  if (Array.isArray(contentArray)) {
    for (const block of contentArray) {
      if (block.type === "text" && block.text) {
        return block.text;
      }
    }
    for (const block of contentArray) {
      if (block.text && block.type !== "thinking") {
        return block.text;
      }
    }
    for (const block of contentArray) {
      if (typeof block.text === "string" && block.text.length > 0) {
        return block.text;
      }
      if (typeof block === "string") {
        return block;
      }
    }
  }

  if (typeof data.content === "string") {
    return data.content;
  }

  const choices = data.choices as Array<{ message?: { content?: string } }> | undefined;
  if (choices?.[0]?.message?.content) {
    return choices[0].message.content;
  }

  const output = data.output as { choices?: Array<{ message?: { content?: string } }>; text?: string } | undefined;
  if (output?.choices?.[0]?.message?.content) {
    return output.choices[0].message.content;
  }
  if (output?.text) {
    return output.text;
  }

  return undefined;
}
