"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LaunchpadOutput } from "@/lib/types";
import { Check, Copy, Download, Rocket } from "lucide-react";
import { useCallback, useState } from "react";

type ArtifactPanelProps = {
  output: LaunchpadOutput;
  source?: "llm" | "fallback" | "preset";
  onDownload: () => void;
  onKickoff?: () => void;
  kickoffLoading?: boolean;
  kickoffMessage?: string | null;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="size-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="size-4" />
          Copy
        </>
      )}
    </Button>
  );
}

function CodeBlock({ content }: { content: string }) {
  return (
    <pre className="max-h-[420px] overflow-auto rounded-lg border border-border/60 bg-muted/40 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">
      {content}
    </pre>
  );
}

export function ArtifactPanel({
  output,
  source,
  onDownload,
  onKickoff,
  kickoffLoading,
  kickoffMessage,
}: ArtifactPanelProps) {
  return (
    <Card className="border-border/60 bg-card/80 backdrop-blur">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-xl">{output.projectName}</CardTitle>
            {source && (
              <Badge variant="secondary">
                {source === "llm"
                  ? "AI generated"
                  : source === "preset"
                    ? "Demo preset"
                    : "Template fallback"}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{output.elevatorPitch}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="size-4" />
            Download zip
          </Button>
          {onKickoff && (
            <Button size="sm" onClick={onKickoff} disabled={kickoffLoading}>
              <Rocket className="size-4" />
              {kickoffLoading ? "Starting agent…" : "Kick off agent"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {kickoffMessage && (
          <p className="mb-4 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm text-muted-foreground">
            {kickoffMessage}
          </p>
        )}
        <Tabs defaultValue="mvp">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="mvp">Scoped MVP</TabsTrigger>
            <TabsTrigger value="rules">Cursor rules</TabsTrigger>
            <TabsTrigger value="prompt">Agent prompt</TabsTrigger>
            <TabsTrigger value="agents">AGENTS.md</TabsTrigger>
          </TabsList>

          <TabsContent value="mvp" className="mt-4 space-y-4">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-medium">Must have (2-hour MVP)</h3>
              </div>
              <ul className="space-y-2">
                {output.mvp.mustHave.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-sm"
                  >
                    <span className="text-emerald-400">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">Cut list</h3>
              <ul className="space-y-2">
                {output.mvp.cutList.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-sm text-muted-foreground"
                  >
                    <span className="text-red-400">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-2 text-sm font-medium">90-second demo script</h3>
              <CodeBlock content={output.mvp.demoScript} />
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-4 space-y-2">
            <div className="flex justify-end">
              <CopyButton text={output.cursorRules} />
            </div>
            <CodeBlock content={output.cursorRules} />
          </TabsContent>

          <TabsContent value="prompt" className="mt-4 space-y-2">
            <div className="flex justify-end">
              <CopyButton text={output.agentPrompt} />
            </div>
            <CodeBlock content={output.agentPrompt} />
          </TabsContent>

          <TabsContent value="agents" className="mt-4 space-y-2">
            <div className="flex justify-end">
              <CopyButton text={output.agentsMd} />
            </div>
            <CodeBlock content={output.agentsMd} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
