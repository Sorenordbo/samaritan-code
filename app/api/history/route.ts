import fs from "fs/promises";
import path from "path";
import os from "os";

const DATA_DIR = path.join(os.homedir(), ".samaritan-code");
const FILE = path.join(DATA_DIR, "history.json");

const RETENTION_DAYS = 30;
const MAX_CONVERSATIONS = 100;

async function read(): Promise<any[]> {
  try { return JSON.parse(await fs.readFile(FILE, "utf-8")); }
  catch { return []; }
}

function prune(history: any[]): any[] {
  const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
  return history
    .filter((c: any) => !c.createdAt || new Date(c.createdAt).getTime() > cutoff)
    .slice(0, MAX_CONVERSATIONS);
}

async function write(data: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  return Response.json(await read());
}

export async function POST(req: Request) {
  const chat = await req.json();
  const history = await read();
  const idx = history.findIndex((c: any) => c.id === chat.id);
  if (idx >= 0) history[idx] = chat; else history.unshift(chat);
  await write(prune(history));
  return Response.json(chat);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await write((await read()).filter((c: any) => c.id !== id));
  return Response.json({ ok: true });
}
