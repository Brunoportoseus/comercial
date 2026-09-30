import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./tools.js";

function createServer() {
  const server = new McpServer({ name: "google-analytics", version: "1.0.0" });
  registerTools(server);
  return server;
}

// Modo local (Claude Code no mesmo computador): `node src/server.js --stdio`
if (process.argv.includes("--stdio")) {
  await createServer().connect(new StdioServerTransport());
} else {
  startHttp();
}

function startHttp() {
  const secret = process.env.MCP_SECRET_PATH || "";
  if (secret.length < 24) {
    console.error("Defina MCP_SECRET_PATH com pelo menos 24 caracteres aleatórios (ex.: openssl rand -hex 24).");
    process.exit(1);
  }
  const port = Number(process.env.PORT) || 8080;
  const mcpPath = Buffer.from(`/mcp/${secret}`);

  const isMcpPath = (url) => {
    const p = Buffer.from((url || "").split("?")[0].replace(/\/+$/, ""));
    return p.length === mcpPath.length && timingSafeEqual(p, mcpPath);
  };

  const sendJson = (res, status, body) => {
    res.writeHead(status, { "content-type": "application/json" }).end(JSON.stringify(body));
  };

  http
    .createServer(async (req, res) => {
      if (req.method === "GET" && req.url === "/healthz") return res.writeHead(200).end("ok");
      if (!isMcpPath(req.url)) return res.writeHead(404).end();
      if (req.method !== "POST") {
        return sendJson(res, 405, { jsonrpc: "2.0", error: { code: -32000, message: "Method not allowed." }, id: null });
      }

      let body;
      try {
        const chunks = [];
        let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 1_000_000) return res.writeHead(413).end();
          chunks.push(chunk);
        }
        body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      } catch {
        return sendJson(res, 400, { jsonrpc: "2.0", error: { code: -32700, message: "Parse error" }, id: null });
      }

      const server = createServer();
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      try {
        await server.connect(transport);
        await transport.handleRequest(req, res, body);
      } catch (err) {
        console.error("Erro ao processar requisição MCP:", err);
        if (!res.headersSent) {
          sendJson(res, 500, { jsonrpc: "2.0", error: { code: -32603, message: "Internal server error" }, id: null });
        }
      }
    })
    .listen(port, () => console.log(`MCP Google Analytics ouvindo na porta ${port} (caminho /mcp/<segredo>)`));
}
