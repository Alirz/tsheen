import fs from "node:fs";
import zlib from "node:zlib";
import {
  CANVAS_MAX_BYTES,
  META_MAX_BYTES,
  assertSafeZipName,
  isAllowedZipEntry,
} from "./limits.mjs";

const EOCD_SIGNATURE = 0x06054b50;
const CD_SIGNATURE = 0x02014b50;
const LOCAL_SIGNATURE = 0x04034b50;
const ZIP64_MAGIC = 0xffffffff;
const FLAG_ENCRYPTED = 0x1;

/**
 * Figma exports also store a preview and an images directory marker.
 * Those names are not read. Any other name, and every `..` name, refuses the archive.
 */
const UNREAD_EXPORT_NAMES = new Set(["thumbnail.png", "images/"]);

function readExact(fd, length, position) {
  const buffer = Buffer.alloc(length);
  let offset = 0;
  while (offset < length) {
    const read = fs.readSync(fd, buffer, offset, length - offset, position + offset);
    if (read === 0) {
      throw new Error("Zip ended before the expected bytes.");
    }
    offset += read;
  }
  return buffer;
}

function findEocd(fd, fileSize) {
  const tailLen = Math.min(fileSize, 22 + 65535);
  const tail = readExact(fd, tailLen, fileSize - tailLen);
  for (let index = tail.length - 22; index >= 0; index -= 1) {
    if (tail.readUInt32LE(index) !== EOCD_SIGNATURE) {
      continue;
    }
    const commentLength = tail.readUInt16LE(index + 20);
    if (index + 22 + commentLength !== tail.length) {
      continue;
    }
    return {
      entryCount: tail.readUInt16LE(index + 10),
      directorySize: tail.readUInt32LE(index + 12),
      directoryOffset: tail.readUInt32LE(index + 16),
    };
  }
  throw new Error("Zip directory was not found.");
}

function inflateMember(compressed, method, maxBytes) {
  if (compressed.length > maxBytes) {
    throw new Error("Zip member exceeds the size ceiling.");
  }
  if (method === 0) {
    return Buffer.from(compressed);
  }
  if (method !== 8) {
    throw new Error("Zip member uses an unsupported compression method.");
  }
  const inflated = zlib.inflateRawSync(compressed, { maxOutputLength: maxBytes });
  if (inflated.length > maxBytes) {
    throw new Error("Zip member exceeds the size ceiling.");
  }
  return inflated;
}

function readMember(fd, entry, maxBytes) {
  if (entry.compressedSize === ZIP64_MAGIC || entry.uncompressedSize === ZIP64_MAGIC) {
    throw new Error("Zip64 members are refused.");
  }
  if (entry.compressedSize > maxBytes || entry.uncompressedSize > maxBytes) {
    throw new Error("Zip member exceeds the size ceiling.");
  }
  const header = readExact(fd, 30, entry.localOffset);
  if (header.readUInt32LE(0) !== LOCAL_SIGNATURE) {
    throw new Error("Zip local header is missing.");
  }
  const flags = header.readUInt16LE(6);
  if ((flags & FLAG_ENCRYPTED) !== 0) {
    throw new Error("Encrypted zip members are refused.");
  }
  const nameLength = header.readUInt16LE(26);
  const extraLength = header.readUInt16LE(28);
  const dataOffset = entry.localOffset + 30 + nameLength + extraLength;
  const compressed = readExact(fd, entry.compressedSize, dataOffset);
  const bytes = inflateMember(compressed, entry.method, maxBytes);
  if (entry.uncompressedSize !== 0 && bytes.length !== entry.uncompressedSize) {
    throw new Error("Zip member size does not match the directory.");
  }
  return bytes;
}

/**
 * Reads the fixed design archive. Only canvas.fig and meta.json bytes are returned.
 * Image hash names are acknowledged and not opened. `..` refuses the archive.
 */
export function readDesignArchive(filePath) {
  const fileSize = fs.statSync(filePath).size;
  const fd = fs.openSync(filePath, "r");
  try {
    const eocd = findEocd(fd, fileSize);
    if (eocd.entryCount > 10000 || eocd.directorySize > 1024 * 1024) {
      throw new Error("Zip directory exceeds the size ceiling.");
    }
    if (
      eocd.directoryOffset > fileSize ||
      eocd.directorySize > fileSize ||
      eocd.directoryOffset + eocd.directorySize > fileSize
    ) {
      throw new Error("Zip directory is outside the archive.");
    }
    const directory = readExact(fd, eocd.directorySize, eocd.directoryOffset);
    const entries = [];
    let offset = 0;
    while (offset + 46 <= directory.length) {
      if (directory.readUInt32LE(offset) !== CD_SIGNATURE) {
        break;
      }
      const flags = directory.readUInt16LE(offset + 8);
      const method = directory.readUInt16LE(offset + 10);
      const compressedSize = directory.readUInt32LE(offset + 20);
      const uncompressedSize = directory.readUInt32LE(offset + 24);
      const nameLength = directory.readUInt16LE(offset + 28);
      const extraLength = directory.readUInt16LE(offset + 30);
      const commentLength = directory.readUInt16LE(offset + 32);
      const localOffset = directory.readUInt32LE(offset + 42);
      const nameStart = offset + 46;
      const nameEnd = nameStart + nameLength;
      if (nameEnd + extraLength + commentLength > directory.length) {
        throw new Error("Zip directory entry is truncated.");
      }
      const name = directory.subarray(nameStart, nameEnd).toString("utf8");
      assertSafeZipName(name);
      if ((flags & FLAG_ENCRYPTED) !== 0) {
        throw new Error("Encrypted zip members are refused.");
      }
      entries.push({
        name,
        flags,
        method,
        compressedSize,
        uncompressedSize,
        localOffset,
      });
      offset = nameEnd + extraLength + commentLength;
    }
    if (entries.length !== eocd.entryCount) {
      throw new Error("Zip directory count does not match the entries read.");
    }

    const seen = new Set();
    let canvas = null;
    let meta = null;
    const imageHashes = [];
    for (const entry of entries) {
      if (seen.has(entry.name)) {
        throw new Error("Duplicate zip entry is refused.");
      }
      seen.add(entry.name);
      if (entry.name === "canvas.fig") {
        canvas = readMember(fd, entry, CANVAS_MAX_BYTES);
        continue;
      }
      if (entry.name === "meta.json") {
        meta = readMember(fd, entry, META_MAX_BYTES);
        continue;
      }
      if (isAllowedZipEntry(entry.name)) {
        imageHashes.push(entry.name.slice("images/".length));
        continue;
      }
      if (UNREAD_EXPORT_NAMES.has(entry.name)) {
        continue;
      }
      throw new Error("Zip entry is not on the allowlist.");
    }
    if (!canvas || !meta) {
      throw new Error("Design archive is missing canvas.fig or meta.json.");
    }
    return { canvas, meta, imageHashes };
  } finally {
    fs.closeSync(fd);
  }
}
