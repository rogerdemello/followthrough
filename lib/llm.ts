import Anthropic from "@anthropic-ai/sdk";
import type { ZodType } from "zod";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  return (client ??= new Anthropic());
}

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5-5";

type CallToolOptions<T> = {
  system: string;
  user: string;
  toolName: string;
  toolDescription: string;
  inputSchema: Anthropic.Tool["input_schema"];
  parser: ZodType<T>;
};

/** Which provider is configured: any OpenAI-compatible endpoint (Gemini, Groq, OpenRouter) or Anthropic. */
function provider(): "openai-compatible" | "anthropic" {
  if (process.env.LLM_API_KEY && process.env.LLM_BASE_URL && process.env.LLM_MODEL) {
    return "openai-compatible";
  }
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  throw new Error(
    "No model configured. Set LLM_BASE_URL, LLM_API_KEY and LLM_MODEL (any OpenAI-compatible provider), or ANTHROPIC_API_KEY, in .env.local.",
  );
}

async function callAnthropic(opts: CallToolOptions<unknown>): Promise<unknown> {
  const res = await getClient().messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: opts.system,
    tools: [
      { name: opts.toolName, description: opts.toolDescription, input_schema: opts.inputSchema },
    ],
    tool_choice: { type: "tool", name: opts.toolName },
    messages: [{ role: "user", content: opts.user }],
  });
  const block = res.content.find((b) => b.type === "tool_use");
  if (!block || block.type !== "tool_use") throw new Error("The model returned no structured answer.");
  return block.input;
}

type ChatCompletion = {
  choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[];
  error?: { message?: string };
};

async function callOpenAICompatible(opts: CallToolOptions<unknown>): Promise<unknown> {
  const base = process.env.LLM_BASE_URL!.replace(/\/+$/, "");
  let res: Response | null = null;
  // Free tiers rate-limit and occasionally overload; retry briefly on 429/503.
  for (let i = 0; i < 3; i++) {
    res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LLM_MODEL,
        temperature: 0,
        messages: [
          { role: "system", content: opts.system },
          { role: "user", content: opts.user },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: opts.toolName,
              description: opts.toolDescription,
              parameters: opts.inputSchema,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: opts.toolName } },
      }),
    });
    if (res.status !== 429 && res.status !== 503) break;
    await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
  }
  const data = (await res!.json()) as ChatCompletion | ChatCompletion[];
  const body = Array.isArray(data) ? data[0] : data;
  if (!res!.ok) throw new Error(`Model request failed (${res!.status}): ${body?.error?.message ?? "unknown error"}`);
  const args = body.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("The model returned no structured answer.");
  return JSON.parse(args);
}

/** Forces the model to answer through one tool, validates the result, and retries once. */
export async function callTool<T>(opts: CallToolOptions<T>): Promise<T> {
  const which = provider();
  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = which === "anthropic" ? await callAnthropic(opts) : await callOpenAICompatible(opts);
      const parsed = opts.parser.safeParse(raw);
      if (parsed.success) return parsed.data;
      lastError = parsed.error;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Structured extraction failed.");
}
