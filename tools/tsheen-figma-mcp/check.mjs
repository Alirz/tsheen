import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { COMPONENT_CATALOG } from "./lib/limits.mjs";
import { loadDesign } from "./lib/design.mjs";
import { callTool, tools } from "./lib/tools.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const failures = [];

function expect(condition, message) {
  if (!condition) failures.push(message);
}

function hasKey(value, key, seen = new Set()) {
  if (!value || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((item) => hasKey(item, key, seen));
  if (Object.prototype.hasOwnProperty.call(value, key)) return true;
  return Object.values(value).some((item) => hasKey(item, key, seen));
}

const design = loadDesign();
const radius = design.variables.find((item) => item.name === "Radius/200");
const title = design.textStyles.find((item) => item.name === "Page Title1-24 B");
const subtitle = design.paintStyles.find((item) => item.name === "active subtitle in menu");
const textDefault = design.variables.find((item) => item.name === "Text/Default/Default");
const radiusValue = radius?.modes?.[0]?.value?.floatValue;
const titleWeight = title?.fontWeight;

console.log(`decoded NODE_CHANGES definitions ${design.definitionCount} nodeChanges ${design.nodeCount}`);
console.log(`Radius/200 float ${radiusValue}`);
console.log(
  `Page Title1-24 B family ${title?.family} style ${title?.style} size ${title?.fontSize} weight ${titleWeight}`,
);
console.log(`active subtitle in menu ${subtitle?.hex}`);

expect(design.definitionCount === 637, `definition count ${design.definitionCount}`);
expect(design.nodeCount === 19523, `node count ${design.nodeCount}`);
expect(design.variableNodeCount === 206, `variable node count ${design.variableNodeCount}`);
expect(radiusValue === 8, "Radius/200 float was not 8");
expect(title?.family === "Vazirmatn FD", "Page Title1-24 B family was not Vazirmatn FD");
expect(title?.style === "Bold", "Page Title1-24 B style was not Bold");
expect(title?.fontSize === 24, "Page Title1-24 B size was not 24");
expect(titleWeight === 700, "Page Title1-24 B weight was not 700");
expect(title?.lineHeight?.value === 24 && title?.lineHeight?.units === "PIXELS", "line height was not 24 PIXELS");
expect(title?.letterSpacing?.value === 0, "letter spacing was not 0");
expect(subtitle?.hex === "#945511", `active subtitle hex was ${subtitle?.hex}`);

const alias = textDefault?.modes?.[0]?.value;
expect(alias?.aliasKey === "b2af4f4cdbe28305ddc05397d30a54e85624a91c", "Text/Default/Default alias key mismatch");
expect(alias?.resolvedName === "Gray/900", "Text/Default/Default did not resolve to Gray/900");
expect(alias?.unresolved !== true && alias?.hex === "#1e1e1e", "alias color was not the resolved Gray/900 value");

const missing = design.resolveAlias("ffffffffffffffffffffffffffffffffffffffff");
expect(missing?.unresolved === true, "missing alias was not unresolved");
expect(!Object.prototype.hasOwnProperty.call(missing, "hex"), "missing alias filled a color");
expect(missing?.resolvedName == null, "missing alias invented a variable name");

const corner = design.variables.find((item) => item.name === "Corner/Extra-small");
expect(corner?.modes?.[0]?.value?.floatValue === 4, "Corner/Extra-small float was not 4");

for (const spec of COMPONENT_CATALOG) {
  const component = design.components.find((item) => item.guid === `${spec.sessionID}/${spec.localID}`);
  expect(component?.name === spec.name && component.missing !== true, `missing component ${spec.name}`);
}
expect(design.canvases.length === 3, `canvas count ${design.canvases.length}`);
expect(design.sections.length === 19, `section count ${design.sections.length}`);

const forbiddenInputs = new Set(["path", "file", "filepath", "filename", "uri", "directory"]);
for (const tool of tools) {
  const properties = Object.keys(tool.inputSchema?.properties ?? {});
  for (const property of properties) {
    expect(!forbiddenInputs.has(property.toLowerCase()), `${tool.name} accepts ${property}`);
  }
  expect(tool.inputSchema.additionalProperties === false, `${tool.name} allows extra arguments`);
}

const tokenPayload = callTool("get_tokens", { name: "Radius/200" });
const typePayload = callTool("get_typography", { name: "Page Title1-24 B" });
const paintPayload = callTool("get_tokens", { name: "active subtitle in menu" });
expect(tokenPayload.source === "figma/tsheen.fig", "get_tokens source was not figma/tsheen.fig");
expect(tokenPayload.variables[0]?.modes?.[0]?.value?.floatValue === 8, "get_tokens did not return Radius/200 as 8");
expect(typePayload.source === "figma/tsheen.fig", "get_typography source was not figma/tsheen.fig");
expect(typePayload.textStyles[0]?.family === "Vazirmatn FD", "get_typography did not return Vazirmatn FD");
expect(typePayload.textStyles[0]?.style === "Bold", "get_typography style was not Bold");
expect(typePayload.textStyles[0]?.fontSize === 24, "get_typography size was not 24");
expect(typePayload.textStyles[0]?.fontWeight === 700, "get_typography did not return weight 700");
expect(
  typePayload.textStyles[0]?.lineHeight?.value === 24 && typePayload.textStyles[0]?.lineHeight?.units === "PIXELS",
  "get_typography line height was not 24 PIXELS",
);
expect(paintPayload.source === "figma/tsheen.fig", "paint source was not figma/tsheen.fig");
expect(paintPayload.paintStyles[0]?.hex === "#945511", "get_tokens did not return #945511");
const sectionsPayload = callTool("list_sections", {});
expect(sectionsPayload.source === "figma/tsheen.fig", "list_sections source was not figma/tsheen.fig");
expect(sectionsPayload.canvases?.length === 3, "list_sections did not return 3 canvases");
expect(sectionsPayload.sections?.length === 19, "list_sections did not return 19 sections");
expect(
  !hasKey(tokenPayload, "pluginData") &&
    !hasKey(typePayload, "pluginData") &&
    !hasKey(paintPayload, "pluginData") &&
    !hasKey(sectionsPayload, "pluginData"),
  "pluginData leaked",
);

let pathRejected = false;
try {
  callTool("get_tokens", { path: "figma/tsheen.fig" });
} catch {
  pathRejected = true;
}
expect(pathRejected, "a path argument was accepted");

const mcp = JSON.parse(fs.readFileSync(path.resolve(here, "../../.cursor/mcp.json"), "utf8"));
const registration = mcp.mcpServers?.["tsheen-figma"];
expect(registration?.command === "node", "mcpServers entry does not use node");
expect(
  Array.isArray(registration?.args) && registration.args.some((arg) => String(arg).endsWith("tools/tsheen-figma-mcp/server.mjs")),
  "mcpServers args do not start the server",
);

const child = spawn(process.execPath, ["server.mjs"], {
  cwd: here,
  stdio: ["pipe", "pipe", "pipe"],
});
let stdout = "";
let stderr = "";
child.stdout.setEncoding("utf8");
child.stderr.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  stdout += chunk;
});
child.stderr.on("data", (chunk) => {
  stderr += chunk;
});

function request(id, method, params) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timed out waiting for ${method}`)), 60000);
    const onData = () => {
      const lines = stdout.split(/\n/);
      for (const line of lines) {
        if (!line.trim()) continue;
        let message;
        try {
          message = JSON.parse(line);
        } catch {
          continue;
        }
        if (message.id !== id) continue;
        clearTimeout(timer);
        child.stdout.off("data", onData);
        resolve(message);
        return;
      }
    };
    child.stdout.on("data", onData);
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
    onData();
  });
}

function payloadOf(response) {
  const text = response?.result?.content?.[0]?.text;
  return text ? JSON.parse(text) : null;
}

try {
  const initialized = await request(1, "initialize", {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "tsheen-check", version: "1.0.0" },
  });
  expect(initialized.result?.serverInfo?.name === "tsheen-figma", "initialize did not return the server");
  child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" })}\n`);
  const listed = await request(2, "tools/list", {});
  const listedNames = (listed.result?.tools ?? []).map((tool) => tool.name);
  expect(
    ["get_tokens", "get_typography", "get_component", "list_sections"].every((name) => listedNames.includes(name)),
    `tools/list returned ${listedNames.join(",")}`,
  );
  for (const tool of listed.result?.tools ?? []) {
    const properties = Object.keys(tool.inputSchema?.properties ?? {});
    expect(properties.every((property) => !forbiddenInputs.has(property.toLowerCase())), `${tool.name} lists a filesystem input`);
  }
  const tokenResponse = await request(3, "tools/call", { name: "get_tokens", arguments: { name: "Radius/200" } });
  const typeResponse = await request(4, "tools/call", { name: "get_typography", arguments: { name: "Page Title1-24 B" } });
  const paintResponse = await request(5, "tools/call", {
    name: "get_tokens",
    arguments: { name: "active subtitle in menu" },
  });
  const pathResponse = await request(6, "tools/call", {
    name: "get_tokens",
    arguments: { path: "figma/tsheen.fig" },
  });
  expect(payloadOf(tokenResponse)?.variables?.[0]?.modes?.[0]?.value?.floatValue === 8, "stdio Radius/200 was not 8");
  expect(payloadOf(typeResponse)?.textStyles?.[0]?.family === "Vazirmatn FD", "stdio family was not Vazirmatn FD");
  expect(payloadOf(typeResponse)?.textStyles?.[0]?.style === "Bold", "stdio style was not Bold");
  expect(payloadOf(typeResponse)?.textStyles?.[0]?.fontSize === 24, "stdio size was not 24");
  expect(payloadOf(typeResponse)?.textStyles?.[0]?.fontWeight === 700, "stdio weight was not 700");
  expect(payloadOf(paintResponse)?.paintStyles?.[0]?.hex === "#945511", "stdio subtitle was not #945511");
  expect(pathResponse.result?.isError === true, "stdio accepted a filesystem path");
  expect(!hasKey(payloadOf(tokenResponse), "pluginData"), "stdio payload contained pluginData");
} catch (error) {
  failures.push(error instanceof Error ? error.message : "stdio check failed");
} finally {
  child.stdin.end();
  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill();
      resolve();
    }, 2000);
    child.on("close", () => {
      clearTimeout(timer);
      resolve();
    });
  });
}

if (stderr.trim()) {
  console.error(stderr.trim());
}
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}
console.log("check passed");
