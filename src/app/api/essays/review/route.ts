import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const API_KEY =
  process.env.ANTHROPIC_API_KEY ||
  process.env.DASHSCOPE_API_KEY ||
  process.env.ANTHROPIC_AUTH_TOKEN;
const API_MODEL =
  process.env.DASHSCOPE_MODEL ||
  process.env.ANTHROPIC_MODEL ||
  "claude-haiku-4-5-20251001";
const API_BASE_URL =
  process.env.DASHSCOPE_BASE_URL ||
  process.env.ANTHROPIC_BASE_URL ||
  "https://api.anthropic.com";

const promptLabels: Record<string, string> = {
  "common-app": "Common App Personal Statement (650-word limit)",
  "why-us": "Why Us Essay",
  "supplemental": "Supplemental Essay",
  "scholarship": "Scholarship Essay",
  "ucas-personal": "UCAS Personal Statement (4000-character limit)",
};

export async function POST(request: NextRequest) {
  // Require authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "AI service is not configured" }, { status: 503 });
  }

  let essay: string;
  let promptType: string;

  try {
    ({ essay, promptType } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!essay || typeof essay !== "string" || essay.trim().length < 100) {
    return NextResponse.json({ error: "Essay too short. Please paste at least 100 characters." }, { status: 400 });
  }

  if (essay.length > 20000) {
    return NextResponse.json({ error: "Essay too long (max 20,000 characters)." }, { status: 400 });
  }

  const label = promptLabels[promptType] ?? "College Application Essay";

  const systemPrompt = `You are an expert college admissions essay coach with 10+ years of experience reading applications at top US universities.
You provide honest, specific, and actionable feedback that helps students improve their essays.

Your feedback is always:
- Specific to the actual content of the essay (reference specific lines or paragraphs)
- Constructive and encouraging while being honest about weaknesses
- Focused on narrative, authenticity, and clarity
- Formatted as structured JSON

You understand different essay types: Common App (650 words), Why Us essays, supplementals, UCAS personal statements, and scholarship essays.`;

  const userMessage = `Please review this ${label}:

---
${essay}
---

Return ONLY valid JSON in this exact structure (no markdown, no explanation outside the JSON):
{
  "overall": "2-3 sentence overall assessment",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["area 1", "area 2", "area 3"],
  "specific_suggestions": [
    "Specific suggestion referencing actual lines",
    "Another specific suggestion",
    "Third specific suggestion"
  ]
}`;

  try {
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
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`AI API error: status=${response.status} body=${errorText.slice(0, 300)}`);
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 502 });
    }

    const data = await response.json();

    // Extract text from response
    let text: string | undefined;
    const contentArray = data.content;
    if (Array.isArray(contentArray)) {
      for (const block of contentArray) {
        if (block.type === "text" && block.text) {
          text = block.text;
          break;
        }
      }
    } else if (typeof data.content === "string") {
      text = data.content;
    }

    if (!text) {
      return NextResponse.json({ error: "Could not parse AI response" }, { status: 500 });
    }

    // Parse the JSON feedback
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI returned invalid feedback format" }, { status: 500 });
    }

    const feedback = JSON.parse(jsonMatch[0]);

    // Validate structure
    if (!feedback.overall || !Array.isArray(feedback.strengths) || !Array.isArray(feedback.improvements)) {
      return NextResponse.json({ error: "AI returned incomplete feedback" }, { status: 500 });
    }

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("Essay review API error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
}
