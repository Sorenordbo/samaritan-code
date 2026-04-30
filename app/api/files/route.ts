import fs from "fs/promises";
import path from "path";

const HIDDEN = new Set([".git", ".next", "node_modules", ".DS_Store", ".env", ".env.local"]);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dir = searchParams.get("path");
  if (!dir) return Response.json({ error: "Missing path" }, { status: 400 });

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const items = await Promise.all(
      entries
        .filter((e) => !HIDDEN.has(e.name) && !e.name.startsWith("."))
        .map(async (e) => {
          const fullPath = path.join(dir, e.name);
          const isDir = e.isDirectory();
          let size: number | null = null;
          let modified: string | null = null;
          try {
            const stat = await fs.stat(fullPath);
            size = isDir ? null : stat.size;
            modified = stat.mtime.toISOString();
          } catch {}
          return { name: e.name, path: fullPath, isDir, size, modified };
        })
    );
    // Folders first, then files, both alphabetical
    items.sort((a, b) => {
      if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    return Response.json(items);
  } catch {
    return Response.json({ error: "Cannot read directory" }, { status: 500 });
  }
}
