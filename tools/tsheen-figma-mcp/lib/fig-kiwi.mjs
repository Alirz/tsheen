import zlib from "node:zlib";
import { compileSchema, decodeBinarySchema } from "kiwi-schema";
import { FIG_MAGIC, FIG_VERSION, MESSAGE_MAX_BYTES, SCHEMA_MAX_BYTES } from "./limits.mjs";

const ZSTD_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);

function readChunks(canvas) {
  if (canvas.length < 12 || canvas.subarray(0, 8).toString("ascii") !== FIG_MAGIC) {
    throw new Error("canvas.fig does not start with fig-kiwi.");
  }
  const version = canvas.readUInt32LE(8);
  if (version !== FIG_VERSION) {
    throw new Error("canvas.fig version is not supported.");
  }
  const chunks = [];
  let offset = 12;
  while (offset < canvas.length) {
    if (offset + 4 > canvas.length) {
      throw new Error("canvas.fig chunk header is truncated.");
    }
    const length = canvas.readUInt32LE(offset);
    offset += 4;
    if (length > canvas.length - offset) {
      throw new Error("canvas.fig chunk extends past the file.");
    }
    chunks.push(canvas.subarray(offset, offset + length));
    offset += length;
  }
  if (chunks.length < 2) {
    throw new Error("canvas.fig is missing the schema or message chunk.");
  }
  return chunks;
}

function decodeSchema(chunk) {
  if (chunk.length > SCHEMA_MAX_BYTES) {
    throw new Error("Schema chunk exceeds the size ceiling.");
  }
  const inflated = zlib.inflateRawSync(chunk, { maxOutputLength: SCHEMA_MAX_BYTES });
  if (inflated.length > SCHEMA_MAX_BYTES) {
    throw new Error("Inflated schema exceeds the size ceiling.");
  }
  const schema = decodeBinarySchema(new Uint8Array(inflated));
  if (!schema || !Array.isArray(schema.definitions)) {
    throw new Error("Kiwi schema could not be decoded.");
  }
  return { schema, inflatedBytes: inflated.length };
}

function decodeMessage(chunk, schema) {
  if (chunk.length < 4 || !chunk.subarray(0, 4).equals(ZSTD_MAGIC)) {
    throw new Error("Message chunk is not zstd.");
  }
  if (chunk.length > MESSAGE_MAX_BYTES) {
    throw new Error("Message chunk exceeds the size ceiling.");
  }
  const inflated = zlib.zstdDecompressSync(chunk, { maxOutputLength: MESSAGE_MAX_BYTES });
  if (inflated.length > MESSAGE_MAX_BYTES) {
    throw new Error("Inflated message exceeds the size ceiling.");
  }
  const message = compileSchema(schema).decodeMessage(new Uint8Array(inflated));
  if (!message || message.type !== "NODE_CHANGES" || !Array.isArray(message.nodeChanges)) {
    throw new Error("Decoded message is not NODE_CHANGES.");
  }
  return { message, inflatedBytes: inflated.length };
}

export function decodeCanvas(canvas) {
  const chunks = readChunks(canvas);
  const schemaResult = decodeSchema(chunks[0]);
  const messageResult = decodeMessage(chunks[1], schemaResult.schema);
  return {
    version: FIG_VERSION,
    definitionCount: schemaResult.schema.definitions.length,
    schemaInflatedBytes: schemaResult.inflatedBytes,
    messageInflatedBytes: messageResult.inflatedBytes,
    message: messageResult.message,
  };
}
