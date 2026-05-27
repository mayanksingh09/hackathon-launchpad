import type { StackChoice } from "./types";

const STACK_HINTS: Record<StackChoice, string> = {
  nextjs: `- Use Next.js App Router, TypeScript, and Tailwind CSS
- Prefer server components; use client components only when needed
- Keep API routes thin; validate inputs at the boundary
- Use shadcn/ui for polished UI components`,
  python: `- Use Python 3.11+ with type hints
- Prefer FastAPI for HTTP APIs; keep handlers thin
- Use pydantic models for request/response validation
- Structure as src/ with clear module boundaries`,
};

export function buildCursorRules(
  stack: StackChoice,
  projectSpecificRules: string[]
): string {
  const hints = STACK_HINTS[stack];
  const custom =
    projectSpecificRules.length > 0
      ? projectSpecificRules.map((r) => `- ${r}`).join("\n")
      : "- Ship the smallest demoable slice first";

  return `# Hackathon Launchpad — Cursor Rules

## Scope
- Build only what is needed for a 2-hour hackathon demo
- Cut features aggressively; polish the demo path over breadth
- No auth, no database, no payments unless explicitly required

## Stack
${hints}

## Project-specific
${custom}

## Code style
- Match existing patterns in the repo
- Minimal diffs; no drive-by refactors
- Self-explanatory code; comments only for non-obvious logic

## Demo readiness
- Include one hardcoded demo preset that works offline
- Every feature must be visible in a 90-second demo
`;
}
