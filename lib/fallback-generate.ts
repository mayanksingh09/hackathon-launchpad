import { buildCursorRules } from "./rules-skeleton";
import type { GenerateRequest, LaunchpadOutput, StackChoice } from "./types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferFeatures(idea: string): string[] {
  const lower = idea.toLowerCase();
  const features: string[] = [
    "Single-page UI with one clear demo flow",
    "Core API or logic that powers the main user action",
    "Copy-to-clipboard or export for the primary output",
  ];

  if (lower.includes("voice") || lower.includes("audio")) {
    features[1] = "Voice input/output integration for the core interaction";
  }
  if (lower.includes("chat") || lower.includes("agent")) {
    features[1] = "Chat or agent interface with streaming responses";
  }
  if (lower.includes("dashboard") || lower.includes("analytics")) {
    features[1] = "Dashboard showing key metrics with sample data";
  }

  return features;
}

function defaultCutList(): string[] {
  return [
    "User authentication and accounts",
    "Database persistence and multi-user sync",
    "Payment processing",
    "Mobile apps or native clients",
    "Admin panels and role-based access",
  ];
}

function buildAgentPrompt(
  projectName: string,
  idea: string,
  stack: StackChoice,
  mustHave: string[]
): string {
  const stackLabel = stack === "nextjs" ? "Next.js 15 App Router + TypeScript + Tailwind" : "Python FastAPI + TypeScript frontend or CLI";
  const featureList = mustHave.map((f, i) => `${i + 1}. ${f}`).join("\n");

  return `Build ${projectName} for a 2-hour hackathon demo.

## Idea
${idea}

## Must ship
${featureList}

## Explicitly cut
- Auth, database, payments unless core to the idea
- Features not visible in a 90-second demo
- Over-engineering; keep the smallest working slice

## Stack
${stackLabel}

## Instructions
- Start with types and the core data flow
- Add a demo preset with hardcoded sample data
- Polish the demo path: dark UI, loading states, copy buttons
- Match existing repo conventions; minimal diffs`;
}

function buildAgentsMd(projectName: string, idea: string): string {
  return `# ${projectName}

## Goal
${idea}

## Hackathon constraints
- 2-hour build window
- One killer demo flow beats feature breadth
- Include offline demo preset

## Next steps
1. Scaffold core UI and API
2. Wire the happy-path demo
3. Add copy/export affordances
4. Deploy and record 90s demo
`;
}

export function generateFallback(input: GenerateRequest): LaunchpadOutput {
  const projectName = slugify(input.idea) || "Hackathon Project";
  const mustHave = inferFeatures(input.idea);
  const cutList = defaultCutList();
  const stack = input.stack;

  return {
    projectName,
    elevatorPitch: `${projectName}: ${input.idea.slice(0, 120)}${input.idea.length > 120 ? "…" : ""}`,
    mvp: {
      mustHave,
      cutList,
      demoScript: `Open the app → enter "${input.idea.slice(0, 40)}…" → generate → walk through the 3 must-have features in under 90 seconds.`,
    },
    cursorRules: buildCursorRules(stack, [
      `Focus the build on: ${input.idea.slice(0, 80)}`,
      "Include a hardcoded demo preset for reliable presentations",
    ]),
    agentPrompt: buildAgentPrompt(projectName, input.idea, stack, mustHave),
    agentsMd: buildAgentsMd(projectName, input.idea),
  };
}
