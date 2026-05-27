import { generateFallback } from "@/lib/fallback-generate";
import { generateWithLlm } from "@/lib/llm-generate";
import type { GenerateRequest, StackChoice } from "@/lib/types";
import { NextResponse } from "next/server";

function isValidStack(value: unknown): value is StackChoice {
  return value === "nextjs" || value === "python";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<GenerateRequest>;
    const idea = body.idea?.trim();

    if (!idea || idea.length < 10) {
      return NextResponse.json(
        { error: "Describe your project idea in at least 10 characters." },
        { status: 400 }
      );
    }

    const stack: StackChoice = isValidStack(body.stack) ? body.stack : "nextjs";
    const input: GenerateRequest = { idea, stack };

    const hasLlmKey =
      Boolean(process.env.ANTHROPIC_API_KEY) ||
      Boolean(process.env.OPENAI_API_KEY);

    let output;
    let source: "llm" | "fallback" = "fallback";

    if (hasLlmKey) {
      try {
        output = await generateWithLlm(input);
        source = "llm";
      } catch {
        output = generateFallback(input);
      }
    } else {
      output = generateFallback(input);
    }

    return NextResponse.json({ ...output, source });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate launchpad";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
