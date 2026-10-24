import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { decodeCanvas } from "./fig-kiwi.mjs";
import { COMPONENT_CATALOG, DESIGN_FILE_NAME } from "./limits.mjs";
import { readDesignArchive } from "./zip.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(packageRoot, "../..");
const designPath = path.join(repoRoot, "figma", "tsheen.fig");

function guidOf(guid) {
  if (!guid || typeof guid.sessionID !== "number" || typeof guid.localID !== "number") {
    return null;
  }
  return `${guid.sessionID}/${guid.localID}`;
}

function channelByte(channel) {
  if (typeof channel !== "number" || !Number.isFinite(channel)) {
    return null;
  }
  const rounded = Math.round(channel * 255);
  if (rounded < 0 || rounded > 255) {
    return null;
  }
  return rounded;
}

export function hexFromColor(color) {
  if (!color) return null;
  const red = channelByte(color.r);
  const green = channelByte(color.g);
  const blue = channelByte(color.b);
  if (red === null || green === null || blue === null) return null;
  const hex = `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
  const alpha = channelByte(color.a);
  if (alpha === null || alpha === 255) return hex;
  return `${hex}${alpha.toString(16).padStart(2, "0")}`;
}

function hashToHex(hash) {
  if (!hash) return null;
  const bytes = hash instanceof Uint8Array ? [...hash] : Array.from({ length: 20 }, (_, index) => hash[index]);
  if (bytes.length !== 20 || bytes.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return null;
  }
  return Buffer.from(bytes).toString("hex");
}

function preferVariable(current, next) {
  if (!current) return next;
  const nextHasValues = Boolean(next.variableDataValues?.entries?.length);
  const currentHasValues = Boolean(current.variableDataValues?.entries?.length);
  if (nextHasValues || !currentHasValues) return next;
  return current;
}

export function resolveVariableData(variableData, variablesByKey, stack = new Set()) {
  if (!variableData || typeof variableData !== "object") {
    return { unresolved: true };
  }
  const dataType = variableData.dataType ?? null;
  if (dataType === "FLOAT") {
    const floatValue = variableData.value?.floatValue;
    if (typeof floatValue !== "number") return { dataType, unresolved: true };
    return { dataType, floatValue };
  }
  if (dataType === "COLOR") {
    const hex = hexFromColor(variableData.value?.colorValue);
    if (!hex) return { dataType, unresolved: true };
    return { dataType, hex };
  }
  if (dataType === "ALIAS") {
    const aliasKey = variableData.value?.alias?.assetRef?.key ?? null;
    if (typeof aliasKey !== "string" || aliasKey.length === 0 || stack.has(aliasKey)) {
      return { dataType, aliasKey, unresolved: true };
    }
    const target = variablesByKey.get(aliasKey);
    if (!target || target.type !== "VARIABLE") {
      return { dataType, aliasKey, unresolved: true };
    }
    stack.add(aliasKey);
    const resolvedModes = (target.variableDataValues?.entries ?? []).map((entry) => ({
      mode: guidOf(entry.modeID),
      value: resolveVariableData(entry.variableData, variablesByKey, stack),
    }));
    stack.delete(aliasKey);
    const concrete = resolvedModes
      .map((mode) => mode.value)
      .filter((value) => value && value.unresolved !== true && (value.hex || typeof value.floatValue === "number"));
    const result = {
      dataType,
      aliasKey,
      unresolved: concrete.length === 0,
      resolvedName: target.name ?? null,
      resolvedKey: aliasKey,
      resolvedModes,
    };
    const hexes = [...new Set(concrete.map((value) => value.hex).filter(Boolean))];
    const floats = [...new Set(concrete.map((value) => value.floatValue).filter((value) => typeof value === "number"))];
    if (hexes.length === 1) result.hex = hexes[0];
    if (floats.length === 1) result.floatValue = floats[0];
    return result;
  }
  return { dataType, unresolved: true };
}

function cssNamesOf(node) {
  const entries = node.codeSyntax?.entries ?? [];
  return entries.filter((entry) => entry?.platform === "WEB" && typeof entry.value === "string").map((entry) => entry.value);
}

function summarizeVariable(node, variablesByKey, names) {
  return {
    name: node.name ?? null,
    names,
    key: node.key ?? null,
    guid: guidOf(node.guid),
    resolvedType: node.variableResolvedType ?? null,
    cssNames: cssNamesOf(node),
    scopes: Array.isArray(node.variableScopes) ? node.variableScopes : [],
    modes: (node.variableDataValues?.entries ?? []).map((entry) => ({
      mode: guidOf(entry.modeID),
      value: resolveVariableData(entry.variableData, variablesByKey, new Set()),
    })),
  };
}

function summarizeTextStyle(node) {
  const fontWeight = node.derivedTextData?.fontMetaData?.[0]?.fontWeight;
  const summary = {
    name: node.name ?? null,
    guid: guidOf(node.guid),
    family: node.fontName?.family ?? null,
    style: node.fontName?.style ?? null,
    fontSize: typeof node.fontSize === "number" ? node.fontSize : null,
    lineHeight: node.lineHeight
      ? { value: node.lineHeight.value ?? null, units: node.lineHeight.units ?? null }
      : null,
    letterSpacing: node.letterSpacing
      ? { value: node.letterSpacing.value ?? null, units: node.letterSpacing.units ?? null }
      : null,
  };
  if (typeof fontWeight === "number") summary.fontWeight = fontWeight;
  return summary;
}

function summarizeFills(node, variablesByKey) {
  return (node.fillPaints ?? []).map((paint) => {
    const fill = { type: paint.type ?? null };
    if (typeof paint.opacity === "number") fill.opacity = paint.opacity;
    if (typeof paint.visible === "boolean") fill.visible = paint.visible;
    if (paint.color) {
      const hex = hexFromColor(paint.color);
      if (hex) fill.hex = hex;
    }
    const imageHash = hashToHex(paint.image?.hash);
    if (imageHash) fill.imageHash = imageHash;
    if (paint.colorVar) {
      fill.colorVariable = resolveVariableData(paint.colorVar, variablesByKey, new Set());
    }
    return fill;
  });
}

function summarizePaintStyle(node, variablesByKey) {
  const fills = summarizeFills(node, variablesByKey);
  return {
    name: node.name ?? null,
    guid: guidOf(node.guid),
    styleType: node.styleType ?? null,
    hex: fills.find((fill) => fill.hex)?.hex ?? null,
    fills,
  };
}

function childrenByParent(nodes) {
  const grouped = new Map();
  for (const node of nodes) {
    const parent = guidOf(node.parentIndex?.guid);
    if (!parent) continue;
    const list = grouped.get(parent) ?? [];
    list.push(node);
    grouped.set(parent, list);
  }
  return grouped;
}

function summarizeComponent(spec, nodesByGuid, childrenOf, variablesByKey) {
  const guid = `${spec.sessionID}/${spec.localID}`;
  const node = nodesByGuid.get(guid) ?? null;
  if (!node) {
    return { name: spec.name, guid, missing: true };
  }
  const children = (childrenOf.get(guid) ?? []).map((child) => ({
    name: child.name ?? null,
    type: child.type ?? null,
    guid: guidOf(child.guid),
    fills: summarizeFills(child, variablesByKey),
  }));
  return {
    name: node.name ?? spec.name,
    guid,
    type: node.type ?? null,
    width: typeof node.size?.x === "number" ? node.size.x : null,
    height: typeof node.size?.y === "number" ? node.size.y : null,
    fills: summarizeFills(node, variablesByKey),
    children,
  };
}

export function designFileLocation() {
  return designPath;
}

let cachedDesign;

export function loadDesign() {
  if (cachedDesign) return cachedDesign;
  if (!fs.existsSync(designPath)) {
    throw new Error(`Design file ${DESIGN_FILE_NAME} is missing.`);
  }
  const archive = readDesignArchive(designPath);
  const decoded = decodeCanvas(archive.canvas);
  const nodes = decoded.message.nodeChanges;
  const namesByKey = new Map();
  const variablesByKey = new Map();
  for (const node of nodes) {
    if (node.type !== "VARIABLE" || typeof node.key !== "string") continue;
    const names = namesByKey.get(node.key) ?? [];
    if (node.name && !names.includes(node.name)) names.push(node.name);
    namesByKey.set(node.key, names);
    variablesByKey.set(node.key, preferVariable(variablesByKey.get(node.key), node));
  }
  const variables = [...variablesByKey.values()].map((node) =>
    summarizeVariable(node, variablesByKey, namesByKey.get(node.key) ?? [node.name].filter(Boolean)),
  );
  const textStyles = nodes.filter((node) => node.type === "TEXT" && node.styleType === "TEXT").map(summarizeTextStyle);
  const paintStyles = nodes
    .filter((node) => node.styleType === "FILL")
    .map((node) => summarizePaintStyle(node, variablesByKey));
  const nodesByGuid = new Map();
  for (const node of nodes) {
    const guid = guidOf(node.guid);
    if (guid && !nodesByGuid.has(guid)) nodesByGuid.set(guid, node);
  }
  const childrenOf = childrenByParent(nodes);
  const components = COMPONENT_CATALOG.map((spec) => summarizeComponent(spec, nodesByGuid, childrenOf, variablesByKey));
  const canvases = nodes
    .filter((node) => node.type === "CANVAS")
    .map((node) => ({ name: node.name ?? null, guid: guidOf(node.guid), type: "CANVAS" }));
  const sections = nodes
    .filter((node) => node.type === "SECTION")
    .map((node) => ({
      name: node.name ?? null,
      guid: guidOf(node.guid),
      type: "SECTION",
      parentGuid: guidOf(node.parentIndex?.guid),
    }));
  cachedDesign = {
    source: DESIGN_FILE_NAME,
    definitionCount: decoded.definitionCount,
    nodeCount: nodes.length,
    variableNodeCount: nodes.filter((node) => node.type === "VARIABLE").length,
    variables,
    textStyles,
    paintStyles,
    components,
    canvases,
    sections,
    resolveAlias(key) {
      return resolveVariableData(
        { dataType: "ALIAS", value: { alias: { assetRef: { key } } } },
        variablesByKey,
        new Set(),
      );
    },
  };
  return cachedDesign;
}
