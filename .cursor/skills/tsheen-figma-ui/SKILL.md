---
name: tsheen-figma-ui
description: >-
  Tsheen UI standard from figma/tsheen.fig through the project MCP. Agents must
  load this skill before UI work in apps/react or any Figma-derived interface.
---

# Tsheen Figma UI

Agents must load this skill before UI work.

## Instructions

1. Read `.cursor/skills/tsheen-figma-ui/references/standard.md` and use it as the UI standard.
2. This skill binds UI work only. Leave backend, `src/`, and `test/` alone unless a task says otherwise.
3. Read `figma/tsheen.fig` through the project MCP `tsheen-figma` (`tools/tsheen-figma-mcp`). Call `get_tokens`, `get_typography`, `get_component` (optional catalog `name`), and `list_sections`. These tools take no filesystem path.
4. Use a value only when that tool returned it. Do not invent tokens. An alias with no matching variable stays unresolved.
5. Keep local Vazirmatn FD under `apps/react/src/assets/fonts/`. Do not load a font CDN. Do not set document `dir=rtl`. Do not add product routes for sections returned by `list_sections`.

## Examples

- Restyling a React control: load this skill, read the standard, then call `get_component` with that catalog name.
- Aligning a color or radius: call `get_tokens` for the variable or fill-style name and use the returned value.

## Performance Notes

- The server caches the decoded file after the first call. Request the tool you need instead of reading the whole archive from a path.

## Troubleshooting

- If `get_tokens` returns an alias and does not collapse one hex, use the resolved name's own modes. Do not paint a later mode over the first.
- When a gold-bar image hash from `get_component` matches a file in `apps/react/src/assets/figma/`, reuse that file. Do not draw a substitute illustration.
