import fs from "fs/promises";
import path from "path";
import os from "os";

const DATA_DIR = path.join(os.homedir(), ".samaritan-code");
const FILE = path.join(DATA_DIR, "preview-ports.json");

async function readPorts(): Promise<Record<string, string>> {
  try { return JSON.parse(await fs.readFile(FILE, "utf-8")); }
  catch { return {}; }
}
async function writePorts(data: Record<string, string>) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2));
}

// Auto-detect port from a project's config files
async function detectProjectPort(projectPath: string): Promise<string | null> {
  // Check vite.config for a port setting
  for (const name of ["vite.config.ts", "vite.config.js", "vite.config.mjs"]) {
    try {
      const content = await fs.readFile(path.join(projectPath, name), "utf-8");
      const match = content.match(/port\s*:\s*(\d+)/);
      if (match) return `http://localhost:${match[1]}`;
      // Vite default is 5173
      return "http://localhost:5173";
    } catch {}
  }

  // Check next.config for a port, or default to 3000
  for (const name of ["next.config.ts", "next.config.js", "next.config.mjs"]) {
    try {
      await fs.access(path.join(projectPath, name));
      // Check package.json dev script for --port flag
      try {
        const pkg = JSON.parse(await fs.readFile(path.join(projectPath, "package.json"), "utf-8"));
        const devScript: string = pkg?.scripts?.dev ?? "";
        const portMatch = devScript.match(/--port[=\s]+(\d+)/);
        if (portMatch) return `http://localhost:${portMatch[1]}`;
      } catch {}
      return "http://localhost:3000";
    } catch {}
  }

  // Check package.json dev script as fallback
  try {
    const pkg = JSON.parse(await fs.readFile(path.join(projectPath, "package.json"), "utf-8"));
    const devScript: string = pkg?.scripts?.dev ?? "";
    const portMatch = devScript.match(/--port[=\s]+(\d+)/);
    if (portMatch) return `http://localhost:${portMatch[1]}`;
    // If it has a dev script with vite, default to 5173
    if (devScript.includes("vite")) return "http://localhost:5173";
    // If it has next, default to 3000
    if (devScript.includes("next")) return "http://localhost:3000";
  } catch {}

  return null;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectPath = searchParams.get("path");
  if (!projectPath) return Response.json({ url: null });

  const ports = await readPorts();

  // Return saved port if exists
  if (ports[projectPath]) return Response.json({ url: ports[projectPath] });

  // Otherwise auto-detect from project config
  const detected = await detectProjectPort(projectPath);
  return Response.json({ url: detected, detected: true });
}

export async function POST(req: Request) {
  const { projectPath, url } = await req.json();
  if (!projectPath) return Response.json({ ok: false });
  // Validate URL before saving
  if (url !== null) {
    try { new URL(url); } catch { return Response.json({ ok: false, error: "Invalid URL" }); }
  }
  const ports = await readPorts();
  if (url === null) {
    delete ports[projectPath];
  } else {
    ports[projectPath] = url;
  }
  await writePorts(ports);
  return Response.json({ ok: true });
}
