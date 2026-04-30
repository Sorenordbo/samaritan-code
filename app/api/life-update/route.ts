import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

const PKG_PATH = path.join(process.cwd(), "node_modules/@laerdal/life-react-components/package.json");
const PROJECT_ROOT = process.cwd();

async function getInstalledVersion(): Promise<string | null> {
  try {
    const pkg = JSON.parse(await fs.readFile(PKG_PATH, "utf-8"));
    return pkg.version ?? null;
  } catch { return null; }
}

async function getLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch("https://registry.npmjs.org/@laerdal/life-react-components/latest", {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });
    const data = await res.json();
    return data.version ?? null;
  } catch { return null; }
}

const FAKE_UPDATE = true; // temporary — remove to restore real check

export async function GET() {
  if (FAKE_UPDATE) {
    const installed = await getInstalledVersion();
    return Response.json({ installed, latest: "6.2.0", updateAvailable: true });
  }
  const [installed, latest] = await Promise.all([getInstalledVersion(), getLatestVersion()]);
  return Response.json({ installed, latest, updateAvailable: !!installed && !!latest && installed !== latest });
}

export async function POST() {
  try {
    execSync("npm install @laerdal/life-react-components@latest", {
      cwd: PROJECT_ROOT,
      timeout: 120_000,
      stdio: "pipe",
    });
    const installed = await getInstalledVersion();
    return Response.json({ ok: true, installed });
  } catch (err: any) {
    return Response.json({ ok: false, error: err.message }, { status: 500 });
  }
}
