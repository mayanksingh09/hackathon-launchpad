import JSZip from "jszip";
import type { LaunchpadOutput } from "./types";

export async function downloadLaunchpadZip(output: LaunchpadOutput): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder(".cursor");
  folder?.file("rules", output.cursorRules);
  zip.file("AGENTS.md", output.agentsMd);
  zip.file("PROMPT.md", output.agentPrompt);

  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${output.projectName.toLowerCase().replace(/\s+/g, "-")}-cursor-kit.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}
