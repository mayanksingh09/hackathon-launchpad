import { buildCursorRules } from "./rules-skeleton";
import type { LaunchpadOutput } from "./types";

export const DEMO_IDEA =
  "A web app that turns a hackathon project idea into scoped MVP plans, Cursor rules, and agent prompts";

export const DEMO_PRESET: LaunchpadOutput = {
  projectName: "Hackathon Launchpad",
  elevatorPitch:
    "Describe your hackathon idea and get a scoped MVP, Cursor rules, and a master Agent prompt in seconds.",
  mvp: {
    mustHave: [
      "Single-page form: project idea + stack selector",
      "Generate scoped MVP with must-have features and explicit cut list",
      "Export .cursor/rules, AGENTS.md, and master Agent prompt with copy + zip download",
    ],
    cutList: [
      "User accounts and persistence",
      "Multi-agent orchestration or streaming agent UI",
      "GitHub OAuth integration",
      "More than two stack templates",
    ],
    demoScript:
      "Type a project idea → click Generate → show MVP + cut list → copy Agent prompt → paste into Cursor Agent → show code being built. Close with zip download of rules.",
  },
  cursorRules: buildCursorRules("nextjs", [
    "Dark theme UI with monospace artifact panels",
    "POST /api/generate returns structured JSON artifacts",
    "Include a demo preset button for reliable live demos",
  ]),
  agentPrompt: `Build Hackathon Launchpad — a Next.js 15 app that helps hackathon participants scope their project.

## Must ship (2-hour MVP)
1. Single page with idea textarea + stack select (Next.js / Python)
2. POST /api/generate that returns JSON: projectName, elevatorPitch, mvp (mustHave, cutList, demoScript), cursorRules, agentPrompt, agentsMd
3. Tabbed UI showing MVP plan, Cursor rules, and Agent prompt with copy buttons
4. Download zip containing .cursor/rules, AGENTS.md, PROMPT.md
5. Demo preset button that loads a pre-built example without API call
6. Dark polished UI using Tailwind + shadcn/ui

## Explicitly cut
- Auth, database, user accounts
- Streaming or multi-agent flows
- GitHub integration

## Stack
Next.js App Router, TypeScript, Tailwind, shadcn/ui. Fallback to static templates if no API key.

Start with the API route and types, then the main page UI. Keep diffs minimal.`,
  agentsMd: `# Hackathon Launchpad

## Goal
Turn a hackathon idea into scoped artifacts for Cursor in one click.

## Architecture
- \`app/page.tsx\` — client UI with form and artifact tabs
- \`app/api/generate/route.ts\` — LLM or fallback template generation
- \`lib/\` — types, rules skeleton, demo preset

## Demo path
1. Click "Load demo preset"
2. Show MVP tab with must-haves and cut list
3. Copy Agent prompt → paste into Cursor
4. Download zip of rules

## Constraints
2-hour hackathon scope. Polish the demo path over feature breadth.
`,
};
