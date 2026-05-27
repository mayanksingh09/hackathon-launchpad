import { LaunchpadForm } from "@/components/launchpad-form";
import { Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-full bg-background">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-background to-background" />
      <main className="relative px-4 py-12 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Rocket className="size-3.5" />
            Cursor Hackathon Launchpad
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Idea → scoped MVP → Cursor kit
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Stop wasting 30 minutes on scope and rules. Describe your project,
            get a cut list, .cursor/rules, and an Agent prompt you can paste
            straight into Cursor.
          </p>
        </header>
        <LaunchpadForm />
      </main>
    </div>
  );
}
