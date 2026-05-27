# Hackathon Launchpad

Turn a hackathon project idea into a scoped MVP, `.cursor/rules`, and a paste-ready Cursor Agent prompt — in seconds.

**Live demo flow:** Describe idea → Generate → copy Agent prompt → paste into Cursor → download zip of rules.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY or OPENAI_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Load demo preset** for a reliable offline demo.

## Features

- **Scoped MVP** — 3 must-have features + explicit cut list + 90s demo script
- **Cursor rules** — stack-aware `.cursor/rules` merged from a fixed skeleton
- **Agent prompt** — copy-paste block to kick off a Cursor Agent build
- **Zip export** — `.cursor/rules`, `AGENTS.md`, `PROMPT.md`
- **Demo preset** — hardcoded example, no API required
- **SDK kickoff** (optional) — `POST /api/kickoff` runs `@cursor/sdk` `Agent.prompt()`

## Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | No | LLM generation (preferred) |
| `OPENAI_API_KEY` | No | LLM fallback if Anthropic unset |
| `CURSOR_API_KEY` | No | Enable "Kick off agent" button |

Without API keys, generation uses deterministic template fallback — still fully demoable.

## Cursor Integration

This project was built with Cursor and is designed to showcase Cursor workflows:

### Rules used during build
- [`.cursor/rules`](.cursor/rules) — hackathon scoping, Next.js stack conventions, demo-first constraints

### Agent prompts used
1. **Initial scaffold** — Next.js + shadcn setup via `create-next-app` and shadcn CLI
2. **Core implementation** — build `/api/generate`, artifact tabs, zip download, demo preset per the hackathon plan
3. **Self-dogfooding** — the demo preset's Agent prompt describes building this exact app

### How AI is used in the product
- **`POST /api/generate`** — calls Claude or GPT to produce scoped MVP JSON, then merges project-specific rules into a fixed skeleton server-side (reduces malformed rule files)
- **Fallback templates** — deterministic generator when no API key is set or LLM fails
- **`POST /api/kickoff`** — optional `@cursor/sdk` one-shot `Agent.prompt()` to start building from the generated prompt

### Demo script (90 seconds)
1. *Hook:* "Every hackathon, we lose 30 minutes on scope and Cursor rules."
2. *Live:* Load demo preset → show MVP + cut list → copy Agent prompt
3. *Meta:* "This repo was built using the output of Hackathon Launchpad."
4. *Close:* Download zip, show deployed URL

## Deploy

**Live:** [https://hackathon-advicehub.vercel.app](https://hackathon-advicehub.vercel.app)  
**Repo:** [https://github.com/mayanksingh09/hackathon-launchpad](https://github.com/mayanksingh09/hackathon-launchpad)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mayanksingh09/hackathon-launchpad)

```bash
npm run build
```

Set env vars in Vercel dashboard for LLM generation and SDK kickoff.

## Project structure

```
app/
  api/generate/route.ts   # LLM + fallback generation
  api/kickoff/route.ts    # Cursor SDK one-shot (optional)
  page.tsx                # Landing + form
components/
  launchpad-form.tsx      # Main client UI
  artifact-panel.tsx      # Tabs, copy, download
lib/
  types.ts
  demo-preset.ts          # Hardcoded demo
  fallback-generate.ts    # No-API fallback
  llm-generate.ts         # Anthropic / OpenAI
  rules-skeleton.ts       # Fixed rules template
  zip-download.ts         # Client zip export
```

## License

MIT
