import { exec } from "child_process";

export async function POST(req: Request) {
  const { path } = await req.json();
  if (!path) return Response.json({ error: "Missing path" }, { status: 400 });
  exec(`open "${path.replace(/"/g, '\\"')}"`);
  return Response.json({ ok: true });
}
