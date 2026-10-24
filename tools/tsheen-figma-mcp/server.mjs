import { callTool, stripPluginData, tools } from "./lib/tools.mjs";

const serverInfo = { name: "tsheen-figma", version: "1.0.0" };

function writeMessage(message) {
  process.stdout.write(`${JSON.stringify(message)}\n`);
}

function toolResult(payload, isError = false) {
  return {
    content: [{ type: "text", text: JSON.stringify(stripPluginData(payload)) }],
    isError,
  };
}

function handleMessage(message) {
  const id = Object.prototype.hasOwnProperty.call(message, "id") ? message.id : undefined;
  const method = message.method;
  if (typeof method !== "string") {
    if (id !== undefined) {
      writeMessage({ jsonrpc: "2.0", id, error: { code: -32600, message: "Invalid request" } });
    }
    return;
  }
  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return;
  }
  if (id === undefined) return;

  if (method === "initialize") {
    const requested = message.params?.protocolVersion;
    const protocolVersion = typeof requested === "string" && /^\d{4}-\d{2}-\d{2}$/.test(requested) ? requested : "2025-03-26";
    writeMessage({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo,
      },
    });
    return;
  }
  if (method === "ping") {
    writeMessage({ jsonrpc: "2.0", id, result: {} });
    return;
  }
  if (method === "tools/list") {
    writeMessage({ jsonrpc: "2.0", id, result: { tools } });
    return;
  }
  if (method === "tools/call") {
    const name = message.params?.name;
    try {
      const result = callTool(name, message.params?.arguments);
      writeMessage({ jsonrpc: "2.0", id, result: toolResult(result) });
    } catch (error) {
      writeMessage({
        jsonrpc: "2.0",
        id,
        result: toolResult({ error: error instanceof Error ? error.message : "Tool call failed" }, true),
      });
    }
    return;
  }
  writeMessage({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
}

let buffer = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  let newline = buffer.indexOf("\n");
  while (newline !== -1) {
    const line = buffer.slice(0, newline).replace(/\r$/, "");
    buffer = buffer.slice(newline + 1);
    newline = buffer.indexOf("\n");
    if (!line.trim()) continue;
    try {
      handleMessage(JSON.parse(line));
    } catch {
      writeMessage({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
    }
  }
});
