/** Inflated schema chunk ceiling (256 KiB). */
export const SCHEMA_MAX_BYTES = 256 * 1024;

/** Inflated message chunk ceiling (24 MiB). */
export const MESSAGE_MAX_BYTES = 24 * 1024 * 1024;

/** Stored or inflated zip member ceiling for canvas.fig. */
export const CANVAS_MAX_BYTES = 8 * 1024 * 1024;

/** Inflated meta.json ceiling. */
export const META_MAX_BYTES = 64 * 1024;

export const FIG_MAGIC = "fig-kiwi";
export const FIG_VERSION = 106;

export const DESIGN_FILE_NAME = "figma/tsheen.fig";

export const COMPONENT_CATALOG = [
  { name: "CAPTCHA", sessionID: 710, localID: 738 },
  { name: "OTP", sessionID: 710, localID: 755 },
  { name: "text input", sessionID: 710, localID: 802 },
  { name: "input icon", sessionID: 732, localID: 1353 },
  { name: "menu-dashboard", sessionID: 812, localID: 1710 },
  { name: "top bar", sessionID: 813, localID: 1977 },
  { name: "pageination", sessionID: 874, localID: 2921 },
  { name: "icon button", sessionID: 886, localID: 3106 },
  { name: "search", sessionID: 889, localID: 3309 },
  { name: "gold bar1/Default", sessionID: 885, localID: 3091 },
  { name: "gold bar 3/Default", sessionID: 885, localID: 3092 },
  { name: "gold bar5/Default", sessionID: 885, localID: 3087 },
];

const IMAGE_ENTRY = /^images\/[0-9a-f]{40}$/;

export function isAllowedZipEntry(name) {
  return name === "canvas.fig" || name === "meta.json" || IMAGE_ENTRY.test(name);
}

export function assertSafeZipName(name) {
  if (typeof name !== "string" || name.length === 0 || name.includes("\0")) {
    throw new Error("Zip entry name is empty or contains a null byte.");
  }
  if (name.includes("..") || name.includes("\\") || name.startsWith("/")) {
    throw new Error("Zip entry name is refused.");
  }
}
