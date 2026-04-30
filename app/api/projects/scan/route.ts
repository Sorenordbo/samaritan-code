import fs from "fs/promises";
import path from "path";
import os from "os";

const CLAUDE_FOLDER = path.join(os.homedir(), "claude_code");

export async function GET() {
  try {
    const entries = await fs.readdir(CLAUDE_FOLDER, { withFileTypes: true });
    const dirs = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith("."))
      .map((e) => ({
        name: e.name,
        path: path.join(CLAUDE_FOLDER, e.name),
      }));
    return Response.json(dirs);
  } catch {
    return Response.json([]);
  }
}
