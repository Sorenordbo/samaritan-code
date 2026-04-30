import Anthropic from "@anthropic-ai/sdk";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: "bash",
    description: "Run a shell command in the current project directory. Use for running scripts, installing packages, running tests, git operations, etc.",
    input_schema: {
      type: "object" as const,
      properties: {
        command: { type: "string", description: "The shell command to run" },
      },
      required: ["command"],
    },
  },
  {
    name: "read_file",
    description: "Read the contents of a file.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "File path (absolute, or relative to project root)" },
      },
      required: ["path"],
    },
  },
  {
    name: "write_file",
    description: "Create or overwrite a file with the given content.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "File path (absolute, or relative to project root)" },
        content: { type: "string", description: "The full file content to write" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "list_directory",
    description: "List files and folders in a directory.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Directory path (optional, defaults to project root)" },
      },
    },
  },
];

function toolLabel(name: string, input: Record<string, string>): string {
  const clip = (s: string) => (s ?? "").slice(0, 60);
  switch (name) {
    case "bash": return `Running: ${clip(input.command)}`;
    case "read_file": return `Reading: ${clip(input.path)}`;
    case "write_file": return `Writing: ${clip(input.path)}`;
    case "list_directory": return `Listing: ${clip(input.path) || "."}`;
    default: return name;
  }
}

async function runTool(name: string, input: Record<string, string>, cwd: string): Promise<string> {
  try {
    switch (name) {
      case "bash": {
        const { stdout, stderr } = await execAsync(input.command, { cwd, timeout: 60000 });
        return (stdout + (stderr ? `\nSTDERR:\n${stderr}` : "")).trim() || "(no output)";
      }
      case "read_file": {
        const fp = path.isAbsolute(input.path) ? input.path : path.join(cwd, input.path);
        return await fs.readFile(fp, "utf-8");
      }
      case "write_file": {
        const fp = path.isAbsolute(input.path) ? input.path : path.join(cwd, input.path);
        await fs.mkdir(path.dirname(fp), { recursive: true });
        await fs.writeFile(fp, input.content, "utf-8");
        return `Written: ${fp}`;
      }
      case "list_directory": {
        const dp = input.path
          ? (path.isAbsolute(input.path) ? input.path : path.join(cwd, input.path))
          : cwd;
        const entries = await fs.readdir(dp, { withFileTypes: true });
        return entries.map((e) => `${e.isDirectory() ? "📁" : "📄"} ${e.name}`).join("\n");
      }
      default:
        return "Unknown tool";
    }
  } catch (e: unknown) {
    return `Error: ${(e as Error).message}`;
  }
}

export async function POST(req: Request) {
  const { messages, projectPath, projectName, buildWithLife } = await req.json();
  const cwd: string = projectPath || process.env.HOME || "/tmp";

  const system = [
    "You are Claude, a helpful coding assistant built into Samaritan Code — a tool for Laerdal Medical designers and developers.",
    "When editing code: read relevant files first, make targeted precise changes, run commands to verify.",
    "Be concise and action-oriented.",
    projectPath
      ? `Current project: ${projectName || path.basename(projectPath)} at ${projectPath}`
      : "No project selected. Help with code or answer questions.",
    "",
    buildWithLife === false
      ? "## Design approach: Build custom\nUse plain HTML/CSS/JS or framework primitives. Do NOT use @laerdal/life-react-components. Design freely without any specific design system constraint."
      : "## Design approach: Build with Life (default)\nWhen building any UI, always follow this order:\n1. LIFE React components from @laerdal/life-react-components\n2. LIFE design tokens (CSS variables)\n3. Custom code only as a last resort",
    "",
    "## @laerdal/life-react-components",
    "Install: npm install @laerdal/life-react-components styled-components",
    "Always wrap the app root with: import { ThemeProvider } from 'styled-components'; <ThemeProvider theme={{}}>...</ThemeProvider>",
    "",
    "Key imports: import { Button, TextButton, IconButton, InlineButton, Size, COLORS, SystemIcons, Input, Select, Checkbox, RadioButton, Toggle, Modal, ModalSize, Banner, Tag, Tooltip, Spinner, Breadcrumb, Pagination, Table, DatePicker, TimePicker, FileUpload, DropdownFilter, MultiSelect, Avatar, Card } from '@laerdal/life-react-components';",
    "",
    "Button variants: variant='primary'|'secondary'|'critical'|'ghost', size={Size.Small}|{Size.Medium}|{Size.Large}",
    "TextButton: same variants, use for text-only actions",
    "IconButton: action={() => {}} prop (not onClick), useTransparentBackground for ghost style",
    "SystemIcons: <SystemIcons.Add size='24' color='#000' /> — common icons: Add, Close, Edit, Delete, Search, Filter, Download, Upload, Check, ArrowDropDown, ArrowLineRight, Home, Settings, User, Folder, File, OpenNewWindow, Refresh",
    "Input: <Input id='x' label='Label' value={v} onChange={e => setV(e.target.value)} />",
    "Banner: <Banner type='neutral'|'warning'|'critical'|'success'>message</Banner>",
    "Tag: <Tag label='text' variant='default'|'accent1'|'accent2'|'neutral' />",
    "Modal: <Modal isVisible={open} onClose={() => setOpen(false)} title='Title' size={ModalSize.Small}|{ModalSize.Medium}|{ModalSize.Large}>content</Modal>",
    "Spinner: <Spinner />",
    "",
    "## LIFE design tokens (CSS variables)",
    "Use these before any hardcoded values:",
    "Colors: --life-color-primary (#107569), --life-color-primary-hover (#0a4f47), --life-color-samaritan (#af50af), --life-color-critical (#c0392b), --life-color-warning (#f39c12), --life-color-success (#27ae60)",
    "Text: --life-color-text-primary (#1a1a1a), --life-color-text-secondary (#555), --life-color-text-disabled (#aaa)",
    "Backgrounds: --life-color-background-primary (#fff), --life-color-background-secondary (#f5f5f5), --life-color-background-tertiary (#ececec)",
    "Borders: --life-color-border-primary (#d0d0d8), --life-color-border-focus (#107569)",
    "Spacing: --life-size-spacing-4 (4px), --life-size-spacing-8 (8px), --life-size-spacing-16 (16px), --life-size-spacing-24 (24px), --life-size-spacing-32 (32px)",
    "Radius: --life-size-radius-small (4px), --life-size-radius-medium (8px), --life-size-radius-large (16px)",
    "Typography: font-family 'Lato', weights 300/400/700/900",
  ].join("\n");

  const encoder = new TextEncoder();
  let ctrl!: ReadableStreamDefaultController<Uint8Array>;

  const stream = new ReadableStream<Uint8Array>({
    start(c) { ctrl = c; },
  });

  const send = (obj: object) =>
    ctrl.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

  (async () => {
    const msgs: any[] = [...messages];

    while (true) {
      const resp = client.messages.stream({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 8096,
        system,
        messages: msgs,
        tools,
      });

      let text = "";
      const toolUses: { id: string; name: string; rawInput: string }[] = [];
      let stopReason = "";

      for await (const event of resp) {
        if (event.type === "content_block_start" && event.content_block.type === "tool_use") {
          toolUses.push({ id: event.content_block.id, name: event.content_block.name, rawInput: "" });
        } else if (event.type === "content_block_delta") {
          if (event.delta.type === "text_delta") {
            text += event.delta.text;
            send({ type: "text", text: event.delta.text });
          } else if (event.delta.type === "input_json_delta" && toolUses.length > 0) {
            toolUses[toolUses.length - 1].rawInput += event.delta.partial_json;
          }
        } else if (event.type === "message_delta") {
          stopReason = event.delta.stop_reason || "";
        }
      }

      if (stopReason !== "tool_use" || toolUses.length === 0) {
        if (text) msgs.push({ role: "assistant", content: text });
        send({ type: "done", messages: msgs });
        break;
      }

      // Build assistant message block with any text + tool_use blocks
      const assistantContent: any[] = [];
      if (text) assistantContent.push({ type: "text", text });

      const toolResults: any[] = [];
      for (const tu of toolUses) {
        const input = JSON.parse(tu.rawInput || "{}") as Record<string, string>;
        assistantContent.push({ type: "tool_use", id: tu.id, name: tu.name, input });
        send({ type: "tool", name: tu.name, label: toolLabel(tu.name, input) });
        const result = await runTool(tu.name, input, cwd);
        toolResults.push({ type: "tool_result", tool_use_id: tu.id, content: result });
      }

      msgs.push({ role: "assistant", content: assistantContent });
      msgs.push({ role: "user", content: toolResults });
    }

    ctrl.close();
  })().catch((err: Error) => {
    send({ type: "error", error: err.message });
    ctrl.close();
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
