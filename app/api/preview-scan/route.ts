import net from "net";

const PORTS = [3001, 3002, 3003, 4000, 4001, 5173, 5174, 5175, 8000, 8080, 8888];

function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(300);
    socket.on("connect", () => { socket.destroy(); resolve(true); });
    socket.on("error", () => resolve(false));
    socket.on("timeout", () => { socket.destroy(); resolve(false); });
    socket.connect(port, "127.0.0.1");
  });
}

export async function GET() {
  const results = await Promise.all(
    PORTS.map(async (port) => ({ port, open: await isPortOpen(port) }))
  );
  return Response.json(results.filter((r) => r.open).map((r) => r.port));
}
