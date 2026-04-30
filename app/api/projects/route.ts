import fs from "fs/promises";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const CLAUDE_FOLDER = path.join(os.homedir(), "claude_code");
const DATA_DIR = path.join(os.homedir(), ".samaritan-code");
const PORTS_FILE = path.join(DATA_DIR, "preview-ports.json");

async function hasFiles(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.some((e) => e.isFile());
  } catch {
    return false;
  }
}

async function isMobileNative(dirPath: string): Promise<boolean> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const names = entries.map((e) => e.name);
    // Flutter
    if (names.includes("pubspec.yaml")) return true;
    // iOS native
    if (names.some((n) => n.endsWith(".xcodeproj") || n.endsWith(".xcworkspace"))) return true;
    // Android native
    if (names.includes("build.gradle") || names.includes("settings.gradle")) return true;
    // Capacitor / Ionic
    if (names.includes("capacitor.config.json") || names.includes("capacitor.config.ts") || names.includes("ionic.config.json")) return true;
    // React Native — check package.json for react-native dependency
    if (names.includes("package.json")) {
      try {
        const pkg = JSON.parse(await fs.readFile(path.join(dirPath, "package.json"), "utf-8"));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        if ("react-native" in deps || "@react-native-community/cli" in deps) return true;
      } catch {}
    }
    return false;
  } catch {
    return false;
  }
}

async function readPorts(): Promise<Record<string, string>> {
  try { return JSON.parse(await fs.readFile(PORTS_FILE, "utf-8")); }
  catch { return {}; }
}

// Map project paths to running localhost ports by inspecting process commands
function detectRunningPorts(projectPaths: string[]): Record<string, string> {
  try {
    const output = execSync("lsof -iTCP -sTCP:LISTEN -n -P", { encoding: "utf-8", timeout: 3000 });
    const result: Record<string, string> = {};
    const assignedPorts = new Set<string>(); // each port can only go to one project

    // Collect unique (pid, port) pairs — deduplicate same pid on IPv4+IPv6
    const seen = new Set<string>();
    const lines: { pid: string; port: string }[] = [];
    for (const line of output.split("\n").slice(1)) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 9) continue;
      const pid = parts[1];
      const addr = parts[8];
      const portMatch = addr.match(/:(\d+)$/);
      if (!portMatch) continue;
      const port = portMatch[1];
      if (!/^\d+$/.test(port)) continue;
      if (port === "3000") continue; // skip samaritan-code itself
      const key = `${pid}:${port}`;
      if (seen.has(key)) continue;
      seen.add(key);
      lines.push({ pid, port });
    }

    for (const { pid, port } of lines) {
      if (assignedPorts.has(port)) continue; // port already claimed by another project
      try {
        const cmd = execSync(`ps -p ${pid} -o command=`, { encoding: "utf-8", timeout: 1000 }).trim();
        for (const projectPath of projectPaths) {
          if ((cmd.includes(projectPath + "/") || cmd.includes(projectPath + " ")) && !result[projectPath]) {
            result[projectPath] = `http://localhost:${port}`;
            assignedPorts.add(port); // mark port as taken
            break;
          }
        }
      } catch {}
    }
    return result;
  } catch {
    return {};
  }
}

export async function GET() {
  try {
    const [entries, savedPorts] = await Promise.all([
      fs.readdir(CLAUDE_FOLDER, { withFileTypes: true }),
      readPorts(),
    ]);

    const dirs = entries.filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "samaritan-code");
    const projectPaths = dirs.map((e) => path.join(CLAUDE_FOLDER, e.name));

    // Detect which projects have running dev servers
    const runningPorts = detectRunningPorts(projectPaths);

    const projects = await Promise.all(
      dirs.map(async (e) => {
        const p = path.join(CLAUDE_FOLDER, e.name);
        if (!(await hasFiles(p))) return null;
        const previewUrl = savedPorts[p] ?? runningPorts[p] ?? null;
        const mobile = await isMobileNative(p);
        return { id: p, name: e.name, path: p, previewUrl, mobile };
      })
    );

    return Response.json(projects.filter(Boolean));
  } catch {
    return Response.json([]);
  }
}
