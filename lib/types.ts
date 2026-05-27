export type StackChoice = "nextjs" | "python";

export type LaunchpadOutput = {
  projectName: string;
  elevatorPitch: string;
  mvp: {
    mustHave: string[];
    cutList: string[];
    demoScript: string;
  };
  cursorRules: string;
  agentPrompt: string;
  agentsMd: string;
};

export type GenerateRequest = {
  idea: string;
  stack: StackChoice;
};
