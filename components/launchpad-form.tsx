"use client";

import { ArtifactPanel } from "@/components/artifact-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DEMO_IDEA, DEMO_PRESET } from "@/lib/demo-preset";
import type { LaunchpadOutput, StackChoice } from "@/lib/types";
import { downloadLaunchpadZip } from "@/lib/zip-download";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { useCallback, useState } from "react";

type GenerateResponse = LaunchpadOutput & {
  source?: "llm" | "fallback";
  error?: string;
};

export function LaunchpadForm() {
  const [idea, setIdea] = useState("");
  const [stack, setStack] = useState<StackChoice>("nextjs");
  const [output, setOutput] = useState<LaunchpadOutput | null>(null);
  const [source, setSource] = useState<"llm" | "fallback" | "preset" | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kickoffLoading, setKickoffLoading] = useState(false);
  const [kickoffMessage, setKickoffMessage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setKickoffMessage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, stack }),
      });
      const data = (await res.json()) as GenerateResponse;

      if (!res.ok) {
        throw new Error(data.error ?? "Generation failed");
      }

      const { source: responseSource, ...artifacts } = data;
      setOutput(artifacts);
      setSource(responseSource ?? "fallback");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [idea, stack]);

  const handleDemoPreset = useCallback(() => {
    setIdea(DEMO_IDEA);
    setStack("nextjs");
    setOutput(DEMO_PRESET);
    setSource("preset");
    setError(null);
    setKickoffMessage(null);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!output) return;
    await downloadLaunchpadZip(output);
  }, [output]);

  const handleKickoff = useCallback(async () => {
    if (!output) return;
    setKickoffLoading(true);
    setKickoffMessage(null);

    try {
      const res = await fetch("/api/kickoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: output.agentPrompt }),
      });
      const data = (await res.json()) as { error?: string; summary?: string };

      if (!res.ok) {
        throw new Error(data.error ?? "Kickoff failed");
      }

      setKickoffMessage(data.summary ?? "Agent kickoff started.");
    } catch (err) {
      setKickoffMessage(
        err instanceof Error ? err.message : "Could not start agent"
      );
    } finally {
      setKickoffLoading(false);
    }
  }, [output]);

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <Card className="border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="size-5 text-violet-400" />
            Describe your hackathon idea
          </CardTitle>
          <CardDescription>
            Get a scoped MVP, Cursor rules, and a paste-ready Agent prompt in
            seconds.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idea">Project idea</Label>
            <Textarea
              id="idea"
              placeholder="e.g. A voice-powered todo app that reads tasks aloud and lets you add items by speaking"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={4}
              className="resize-none font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Stack</Label>
            <Select
              value={stack}
              onValueChange={(value) => setStack(value as StackChoice)}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Choose stack" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nextjs">Next.js + TypeScript</SelectItem>
                <SelectItem value="python">Python FastAPI</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleGenerate}
              disabled={loading || idea.trim().length < 10}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <Wand2 className="size-4" />
                  Generate launchpad
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleDemoPreset}>
              Load demo preset
            </Button>
          </div>
        </CardContent>
      </Card>

      {output && (
        <ArtifactPanel
          output={output}
          source={source}
          onDownload={handleDownload}
          onKickoff={handleKickoff}
          kickoffLoading={kickoffLoading}
          kickoffMessage={kickoffMessage}
        />
      )}
    </div>
  );
}
