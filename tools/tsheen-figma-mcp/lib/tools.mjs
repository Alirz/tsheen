import { COMPONENT_CATALOG, DESIGN_FILE_NAME } from "./limits.mjs";
import { loadDesign } from "./design.mjs";

const componentNames = COMPONENT_CATALOG.map((item) => item.name);

const nameFilter = {
  type: "string",
  minLength: 1,
  maxLength: 200,
  description: "Decoded design name. Not a filesystem path.",
};

export const tools = [
  {
    name: "get_tokens",
    description: `Read color, number, and fill-style tokens decoded from ${DESIGN_FILE_NAME}. An alias resolves only to a variable in that same file.`,
    inputSchema: {
      type: "object",
      properties: {
        name: {
          ...nameFilter,
          description: "Variable name, historical variable name, CSS name, or fill-style name.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_typography",
    description: `Read text styles decoded from TEXT nodes in ${DESIGN_FILE_NAME}. Weight comes from the text node's font metadata.`,
    inputSchema: {
      type: "object",
      properties: {
        name: { ...nameFilter, description: "Text style name." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component",
    description: `Read one catalogued component decoded from ${DESIGN_FILE_NAME}.`,
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          enum: componentNames,
          description: "Component name from the decoded catalog.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_sections",
    description: `List canvases and flow sections decoded from ${DESIGN_FILE_NAME}.`,
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
];

const allowedArguments = new Map(tools.map((tool) => [tool.name, new Set(Object.keys(tool.inputSchema.properties ?? {}))]));

function rejectPath(name) {
  if (name.includes("..") || name.includes("\\") || /^[A-Za-z]:/.test(name)) {
    throw new Error("Filesystem paths are not accepted.");
  }
}

function readArguments(toolName, args) {
  const allowed = allowedArguments.get(toolName);
  if (!allowed) throw new Error("Unknown tool.");
  if (args == null) return {};
  if (typeof args !== "object" || Array.isArray(args)) {
    throw new Error("Tool arguments must be an object.");
  }
  for (const key of Object.keys(args)) {
    if (!allowed.has(key)) throw new Error("Unexpected tool argument.");
  }
  if (args.name !== undefined) {
    if (typeof args.name !== "string" || args.name.length < 1 || args.name.length > 200) {
      throw new Error("The name filter is invalid.");
    }
    rejectPath(args.name);
  }
  return args;
}

function matchesName(record, name) {
  if (!name) return true;
  if (record.name === name) return true;
  if (Array.isArray(record.names) && record.names.includes(name)) return true;
  if (Array.isArray(record.cssNames) && record.cssNames.includes(name)) return true;
  return false;
}

let cached;

function design() {
  if (!cached) {
    try {
      cached = { ok: true, value: loadDesign() };
    } catch (error) {
      cached = { ok: false, error };
    }
  }
  if (!cached.ok) throw cached.error;
  return cached.value;
}

export function callTool(toolName, args) {
  const input = readArguments(toolName, args);
  const loaded = design();
  if (toolName === "get_tokens") {
    return {
      source: loaded.source,
      variables: loaded.variables.filter((item) => matchesName(item, input.name)),
      paintStyles: loaded.paintStyles.filter((item) => matchesName(item, input.name)),
    };
  }
  if (toolName === "get_typography") {
    return {
      source: loaded.source,
      textStyles: loaded.textStyles.filter((item) => matchesName(item, input.name)),
    };
  }
  if (toolName === "get_component") {
    const components = loaded.components.filter((item) => matchesName(item, input.name));
    if (input.name && components.length === 0) {
      throw new Error("Component was not in the decoded file.");
    }
    return { source: loaded.source, components };
  }
  if (toolName === "list_sections") {
    return { source: loaded.source, canvases: loaded.canvases, sections: loaded.sections };
  }
  throw new Error("Unknown tool.");
}

export function stripPluginData(value) {
  if (Array.isArray(value)) return value.map(stripPluginData);
  if (value && typeof value === "object") {
    const out = {};
    for (const [key, item] of Object.entries(value)) {
      if (key === "pluginData") continue;
      out[key] = stripPluginData(item);
    }
    return out;
  }
  return value;
}
