import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "CURSOR_API_KEY is not configured. Add it to deploy env to enable SDK kickoff.",
      },
      { status: 503 }
    );
  }

  try {
    const { prompt } = (await request.json()) as { prompt?: string };
    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Agent prompt is required." },
        { status: 400 }
      );
    }

    const { Agent } = await import("@cursor/sdk");

    const result = await Agent.prompt(prompt, {
      apiKey,
      model: { id: "composer-2.5" },
      local: { cwd: process.cwd() },
    });

    return NextResponse.json({
      status: result.status,
      result: result.result,
      summary:
        result.status === "finished"
          ? "Agent run completed. Check your Cursor workspace for changes."
          : `Agent run ended with status: ${result.status}`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cursor SDK kickoff failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
