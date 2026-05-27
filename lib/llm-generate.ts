import { buildCursorRules } from "./rules-skeleton";
import type { GenerateRequest, LaunchpadOutput } from "./types";

const SYSTEM_PROMPT = `You are a hackathon scoping assistant. Given a project idea and stack, output ONLY valid JSON matching this schema:

{
  "projectName": "string — short PascalCase name",
  "elevatorPitch": "string — one sentence",
  "mvp": {
    "mustHave": ["exactly 3 strings — demoable features for a 2-hour build"],
    "cutList": ["4-5 strings — features to explicitly NOT build"],
    "demoScript": "string — 90-second demo narration"
  },
  "projectSpecificRules": ["2-4 strings — Cursor rules specific to this project"],
  "agentPrompt": "string — full paste-ready prompt for Cursor Agent to build the MVP"
}

Rules:
- Scope aggressively for a 2-hour hackathon
- mustHave items must be concrete and demoable
- cutList should prevent scope creep
- agentPrompt should include Must ship, Explicitly cut, and Stack sections
- No markdown fences, no commentary — JSON only`;

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) return fenceMatch[1].trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);
  return trimmed;
}

type LlmPayload = {
  projectName: string;
  elevatorPitch: string;
  mvp: LaunchpadOutput["mvp"];
  projectSpecificRules: string[];
  agentPrompt: string;
};

function buildAgentsMd(projectName: string, elevatorPitch: string, mustHave: string[]): string {
  return `# ${projectName}

## Goal
${elevatorPitch}

## MVP scope
${mustHave.map((f) => `- ${f}`).join("\n")}

## Hackathon notes
- 2-hour build window; polish demo path over breadth
- Include a hardcoded demo preset
- Document Cursor integration in README
`;
}

async function callAnthropic(idea: string, stack: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Project idea: ${idea}\nStack: ${stack}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    content: Array<{ type: string; text?: string }>;
  };
  const text = data.content.find((c) => c.type === "text")?.text;
  if (!text) throw new Error("No text in Anthropic response");
  return text;
}

async function callOpenAI(idea: string, stack: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Project idea: ${idea}\nStack: ${stack}` },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "";
}

export async function generateWithLlm(
  input: GenerateRequest
): Promise<LaunchpadOutput> {
  const stackLabel = input.stack === "nextjs" ? "Next.js + TypeScript + Tailwind" : "Python FastAPI";
  const raw =
    process.env.ANTHROPIC_API_KEY
      ? await callAnthropic(input.idea, stackLabel)
      : process.env.OPENAI_API_KEY
        ? await callOpenAI(input.idea, stackLabel)
        : null;

  if (!raw) {
    throw new Error("No LLM API key configured");
  }

  const parsed = JSON.parse(extractJson(raw)) as LlmPayload;

  return {
    projectName: parsed.projectName,
    elevatorPitch: parsed.elevatorPitch,
    mvp: parsed.mvp,
    cursorRules: buildCursorRules(
      input.stack,
      parsed.projectSpecificRules ?? []
    ),
    agentPrompt: parsed.agentPrompt,
    agentsMd: buildAgentsMd(
      parsed.projectName,
      parsed.elevatorPitch,
      parsed.mvp.mustHave
    ),
  };
}
