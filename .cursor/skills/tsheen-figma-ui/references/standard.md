# Tsheen UI standard

Source of truth: `figma/tsheen.fig`, served by the project MCP `tsheen-figma` (`tools/tsheen-figma-mcp`). Tools: `get_tokens`, `get_typography`, `get_component` (optional catalog `name`), and `list_sections`. Tool arguments do not include a filesystem path.

This standard binds UI work only.

## Checked values

These values were returned by the project MCP from `figma/tsheen.fig`.

| Name | Value |
| --- | --- |
| `Radius/200` | float `8` (`var(--sds-size-radius-200)`) |
| `Page Title1-24 B` | family `Vazirmatn FD`, style `Bold`, size `24`, weight `700`, line height `24` PIXELS, letter spacing `0` |
| `active subtitle in menu` | FILL paint `#945511` |
| `Text/Default/Default` | alias of `Gray/900`, `#1e1e1e` (another mode aliases `White/1000`, `#ffffff`) |

`get_tokens` returned 176 variables and 40 fill styles. `get_typography` returned 21 text styles. `list_sections` returned 3 canvases and 19 sections. Use a value only when the tool returned it. An alias resolves only to a variable in this file. A missing alias stays unresolved.

Color variables can have more than one mode. The table shows the first mode. When that mode is an alias and the tool did not collapse one hex, the cell says `alias` plus the resolved name. The `apps/react` theme already matches the first mode that returned one hex or float, including `Text/Default/Default` `#1e1e1e`, `Radius/200` `8`, and the FILL paint `active subtitle in menu` `#945511`. `Miscellaneous/Sidebar Text - Selected` first mode aliases `Colors/Blue` without one hex; the theme token stays `#0088ff`, the first mode of the `Colors/Blue` variable that returns `#0088ff`. A second `Colors/Blue` variable returns `#007aff` first. Do not repaint that token from a later mode.

Vendor `Vazirmatn FD` locally. Do not load a font CDN. Do not set document `dir=rtl`.

## Tokens

| Name | CSS | First resolved value | Resolved name | Modes |
| --- | --- | --- | --- | --- |
| `Radius/200` | `var(--sds-size-radius-200)` | `8` |  | 1 |
| `Brand/800` | `var(--sds-color-brand-800)` | `#2c2c2c` |  | 1 |
| `Brand/100` | `var(--sds-color-brand-100)` | `#f5f5f5` |  | 1 |
| `Background/Brand/Default` | `var(--sds-color-background-brand-default)` | `#2c2c2c` | Brand/800 | 3 |
| `Gray/900` | `var(--sds-color-gray-900)` | `#1e1e1e` |  | 1 |
| `White/1000` | `var(--sds-color-white-1000)` | `#ffffff` |  | 1 |
| `Icon/Default/Default` | `var(--sds-color-icon-default-default)` | `#1e1e1e` | Gray/900 | 3 |
| `Radius/Full` | `var(--sds-size-radius-full)` | `9999` |  | 1 |
| `Schemes/On Surface` | `—` | `#1d1b20` |  | 32 |
| `Brand/900` | `var(--sds-color-brand-900)` | `#1e1e1e` |  | 1 |
| `Text/Brand/On Brand` | `var(--sds-color-text-brand-on-brand)` | `#f5f5f5` | Brand/100 | 3 |
| `Radius/400` | `var(--sds-size-radius-400)` | `16` |  | 1 |
| `Corner/Extra-large` | `—` | `28` |  | 1 |
| `Slate/1000` | `var(--sds-color-slate-1000)` | `#242424` |  | 1 |
| `Slate/100` | `var(--sds-color-slate-100)` | `#f3f3f3` |  | 1 |
| `Text/Neutral/On Neutral` | `var(--sds-color-text-neutral-on-neutral)` | `#f3f3f3` | Slate/100 | 3 |
| `Background/Default/Default` | `var(--sds-color-background-default-default)` | `#ffffff` | White/1000 | 3 |
| `Schemes/Secondary Container` | `—` | `#e8def8` |  | 32 |
| `Schemes/Outline` | `—` | `#79747e` |  | 32 |
| `Schemes/On Secondary Container` | `—` | `#4a4459` |  | 32 |
| `Static/Font/Plain` | `—` | `unresolved` |  | 2 |
| `Static/Label Large/Font` | `—` | `unresolved` | Static/Font/Plain | 1 |
| `Static/Weight/Medium` | `—` | `unresolved` |  | 2 |
| `Static/Label Large/Weight` | `—` | `unresolved` | Static/Weight/Medium | 1 |
| `Static/Label Large/Size` | `—` | `14` |  | 1 |
| `Static/Label Large/Tracking` | `—` | `0.10000000149011612` |  | 1 |
| `Static/Label Large/Line Height` | `—` | `20` |  | 1 |
| `State Layers/On Surface/Opacity-10` | `—` | `#1d1b201a` |  | 32 |
| `State Layers/On Secondary Container/Opacity-10` | `—` | `#4a44591a` |  | 32 |
| `State Layers/On Surface/Opacity-08` | `—` | `#1d1b2014` |  | 32 |
| `State Layers/On Secondary Container/Opacity-08` | `—` | `#4a445914` |  | 32 |
| `White/500` | `var(--sds-color-white-500)` | `#ffffffb2` |  | 1 |
| `Gray/500` | `var(--sds-color-gray-500)` | `#757575` |  | 1 |
| `Text/Default/Secondary` | `var(--sds-color-text-default-secondary)` | `#757575` | Gray/500 | 3 |
| `Schemes/Primary` | `—` | `#6750a4` |  | 32 |
| `State Layers/On Primary/Opacity-10` | `—` | `#ffffff1a` |  | 32 |
| `Schemes/On Primary` | `—` | `#ffffff` |  | 32 |
| `State Layers/On Primary/Opacity-08` | `—` | `#ffffff14` |  | 32 |
| `White/400` | `var(--sds-color-white-400)` | `#ffffff66` |  | 1 |
| `Gray/400` | `var(--sds-color-gray-400)` | `#b3b3b3` |  | 1 |
| `Text/Default/Tertiary` | `var(--sds-color-text-default-tertiary)` | `#b3b3b3` | Gray/400 | 3 |
| `Schemes/Surface Container Low` | `—` | `#f7f2fa` |  | 32 |
| `State Layers/Primary/Opacity-10` | `—` | `#6750a41a` |  | 32 |
| `State Layers/Primary/Opacity-08` | `—` | `#6750a414` |  | 32 |
| `Corner/Full` | `—` | `1000` |  | 1 |
| `Green/800` | `var(--sds-color-green-800)` | `#02542d` |  | 1 |
| `Corner/Large` | `—` | `16` |  | 1 |
| `Colors/Blue` | `—` | `#007aff` |  | 6 |
| `Slate/900` | `var(--sds-color-slate-900)` | `#303030` |  | 1 |
| `Slate/200` | `var(--sds-color-slate-200)` | `#e3e3e3` |  | 1 |
| `Background/Neutral/Tertiary` | `var(--sds-color-background-neutral-tertiary)` | `#e3e3e3` | Slate/200 | 3 |
| `Red/800` | `var(--sds-color-red-800)` | `#690807` |  | 1 |
| `Red/200` | `var(--sds-color-red-200)` | `#fdd3d0` |  | 1 |
| `Background/Danger/Secondary` | `var(--sds-color-background-danger-secondary)` | `#fdd3d0` | Red/200 | 2 |
| `Green/900` | `var(--sds-color-green-900)` | `#024023` |  | 1 |
| `Green/300` | `var(--sds-color-green-300)` | `#aff4c6` |  | 1 |
| `Background/Positive/Secondary Hover` | `var(--sds-color-background-positive-secondary-hover)` | `#aff4c6` | Green/300 | 3 |
| `Gray/700` | `var(--sds-color-gray-700)` | `#383838` |  | 1 |
| `Gray/100` | `var(--sds-color-gray-100)` | `#f5f5f5` |  | 1 |
| `Background/Default/Default Hover` | `var(--sds-color-background-default-default-hover)` | `#f5f5f5` | Gray/100 | 3 |
| `Gray/600` | `var(--sds-color-gray-600)` | `#444444` |  | 1 |
| `Gray/300` | `var(--sds-color-gray-300)` | `#d9d9d9` |  | 1 |
| `Border/Default/Default` | `var(--sds-color-border-default-default)` | `#d9d9d9` | Gray/300 | 3 |
| `Slate/400` | `var(--sds-color-slate-400)` | `#b2b2b2` |  | 1 |
| `Slate/600` | `var(--sds-color-slate-600)` | `#767676` |  | 1 |
| `Text/Neutral/Tertiary` | `var(--sds-color-text-neutral-tertiary)` | `#767676` | Slate/600 | 3 |
| `Border/Default/Secondary` | `var(--sds-color-border-default-secondary)` | `#757575` | Gray/500 | 2 |
| `Slate/700` | `var(--sds-color-slate-700)` | `#5a5a5a` |  | 1 |
| `Background/Neutral/Default` | `var(--sds-color-background-neutral-default)` | `#5a5a5a` | Slate/700 | 3 |
| `Schemes/On Surface Variant` | `—` | `#49454f` |  | 32 |
| `Slate/300` | `var(--sds-color-slate-300)` | `#cdcdcd` |  | 1 |
| `Text/Neutral/Secondary` | `var(--sds-color-text-neutral-secondary)` | `#5a5a5a` | Slate/700 | 3 |
| `Text/Default/Default` | `var(--sds-color-text-default-default)` | `#1e1e1e` | Gray/900 | 3 |
| `Gray/800` | `var(--sds-color-gray-800)` | `#2c2c2c` |  | 1 |
| `Background/Default/Secondary` | `var(--sds-color-background-default-secondary)` | `#f5f5f5` | Gray/100 | 3 |
| `Brand/500` | `var(--sds-color-brand-500)` | `#757575` |  | 1 |
| `Brand/300` | `var(--sds-color-brand-300)` | `#d9d9d9` |  | 1 |
| `Background/Brand/Secondary Hover` | `var(--sds-color-background-brand-secondary-hover)` | `#d9d9d9` | Brand/300 | 2 |
| `Text/Neutral/Default` | `var(--sds-color-text-neutral-default)` | `#303030` | Slate/900 | 3 |
| `Green/400` | `var(--sds-color-green-400)` | `#85e0a3` |  | 1 |
| `Green/600` | `var(--sds-color-green-600)` | `#009951` |  | 1 |
| `Icon/Small` | `var(--sds-size-icon-small)` | `24` |  | 1 |
| `Icon/Medium` | `var(--sds-size-icon-medium)` | `32` |  | 1 |
| `Corner/None` | `—` | `0` |  | 1 |
| `Red/500` | `var(--sds-color-red-500)` | `#ec221f` |  | 1 |
| `Text/Danger/Tertiary` | `var(--sds-color-text-danger-tertiary)` | `#ec221f` | Red/500 | 3 |
| `Brand B/800` | `var(--sds-color-brand-800)` | `#770000` |  | 1 |
| `Icon/Neutral/Secondary` | `var(--sds-color-icon-neutral-secondary)` | `#5a5a5a` | Slate/700 | 3 |
| `Green/500` | `var(--sds-color-green-500)` | `#14ae5c` |  | 1 |
| `Green/700` | `var(--sds-color-green-700)` | `#008043` |  | 1 |
| `Background/Positive/Default` | `var(--sds-color-background-positive-default)` | `#14ae5c` | Green/500 | 3 |
| `Icon/Danger/Tertiary` | `var(--sds-color-icon-danger-tertiary)` | `#ec221f` | Red/500 | 3 |
| `Icon/Positive/Secondary` | `var(--sds-color-icon-positive-secondary)` | `#009951` | Green/600 | 3 |
| `Icon/Neutral/On Neutral` | `var(--sds-color-icon-neutral-on-neutral)` | `#f3f3f3` | Slate/100 | 3 |
| `Red/400` | `var(--sds-color-red-400)` | `#f4776a` |  | 1 |
| `Red/600` | `var(--sds-color-red-600)` | `#c00f0c` |  | 1 |
| `Text/Danger/Secondary` | `var(--sds-color-text-danger-secondary)` | `#c00f0c` | Red/600 | 3 |
| `Yellow/600` | `var(--sds-color-yellow-600)` | `#bf6a02` |  | 1 |
| `Border/Warning/tertiary` | `var(--sds-color-border-warning-tertiary)` | `#bf6a02` | Yellow/600 | 3 |
| `Yellow/900` | `var(--sds-color-yellow-900)` | `#522504` |  | 1 |
| `Yellow/300` | `var(--sds-color-yellow-300)` | `#ffe8a3` |  | 1 |
| `Background/Warning/Secondary Hover` | `var(--sds-color-background-warning-secondary-hover)` | `#ffe8a3` | Yellow/300 | 3 |
| `Background/Neutral/Secondary Hover` | `var(--sds-color-background-neutral-secondary-hover)` | `#b2b2b2` | Slate/400 | 3 |
| `Icon/Default/Secondary` | `var(--sds-color-icon-default-secondary)` | `#757575` | Gray/500 | 3 |
| `Border/Neutral/tertiary` | `var(--sds-color-border-neutral-tertiary)` | `#b2b2b2` | Slate/400 | 3 |
| `Radius/100` | `var(--sds-size-radius-100)` | `4` |  | 1 |
| `Background/Default/Tertiary Hover` | `var(--sds-color-background-default-tertiary-hover)` | `#b3b3b3` | Gray/400 | 3 |
| `Text/Positive/Tertiary` | `var(--sds-color-text-positive-tertiary)` | `#14ae5c` | Green/500 | 3 |
| `Brand/600` | `var(--sds-color-brand-600)` | `#444444` |  | 1 |
| `Icon/Brand/Secondary` | `var(--sds-color-icon-brand-secondary)` | `#444444` | Brand/600 | 3 |
| `Border/Danger/Tertiary` | `var(--sds-color-border-danger-tertiary)` | `#ec221f` | Red/500 | 3 |
| `Green/200` | `var(--sds-color-green-200)` | `#cff7d3` |  | 1 |
| `Border/Positive/Default` | `var(--sds-color-border-positive-default)` | `#02542d` | Green/800 | 3 |
| `Background/Neutral/Secondary` | `var(--sds-color-background-neutral-secondary)` | `#cdcdcd` | Slate/300 | 3 |
| `Schemes/Surface Container High` | `—` | `#ece6f0` |  | 32 |
| `State Layers/On Surface Variant/Opacity-08` | `—` | `#49454f14` |  | 32 |
| `State Layers/On Surface Variant/Opacity-10` | `—` | `#49454f1a` |  | 32 |
| `Schemes/Outline Variant` | `—` | `#cac4d0` |  | 32 |
| `Static/Body Large/Font` | `—` | `unresolved` | Static/Font/Plain | 1 |
| `Static/Weight/Regular` | `—` | `unresolved` |  | 2 |
| `Static/Body Large/Weight` | `—` | `unresolved` | Static/Weight/Regular | 1 |
| `Static/Body Large/Size` | `—` | `16` |  | 1 |
| `Static/Body Large/Tracking` | `—` | `0.5` |  | 1 |
| `Static/Body Large/Line Height` | `—` | `24` |  | 1 |
| `Schemes/Primary Container` | `—` | `#eaddff` |  | 32 |
| `Schemes/On Primary Container` | `—` | `#4f378a` |  | 32 |
| `Border/Neutral/Default` | `var(--sds-color-border-neutral-default)` | `#303030` | Slate/900 | 3 |
| `Slate/500` | `var(--sds-color-slate-500)` | `#949494` |  | 1 |
| `Slate/800` | `var(--sds-color-slate-800)` | `#434343` |  | 1 |
| `Background/Neutral/Hover` | `var(--sds-color-background-neutral-hover)` | `#434343` | Slate/800 | 3 |
| `Icon/Positive/Tertiary` | `var(--sds-color-icon-positive-tertiary)` | `#14ae5c` | Green/500 | 3 |
| `Grays/White` | `—` | `#ffffff` |  | 4 |
| `Colors/Blue` | `—` | `#0088ff` |  | 4 |
| `Miscellaneous/Sidebar Text - Selected` | `—` | `alias Colors/Blue` | Colors/Blue | 4 |
| `Static/Font/Brand` | `—` | `unresolved` |  | 2 |
| `Static/Headline Large/Font` | `—` | `unresolved` | Static/Font/Brand | 1 |
| `Static/Headline Large/Weight` | `—` | `unresolved` | Static/Weight/Regular | 1 |
| `Static/Headline Large/Size` | `—` | `32` |  | 1 |
| `Static/Headline Large/Tracking` | `—` | `0` |  | 1 |
| `Static/Headline Large/Line Height` | `—` | `40` |  | 1 |
| `Static/Headline Small/Font` | `—` | `unresolved` | Static/Font/Brand | 1 |
| `Static/Headline Small/Weight` | `—` | `unresolved` | Static/Weight/Regular | 1 |
| `Static/Headline Small/Size` | `—` | `24` |  | 1 |
| `Static/Headline Small/Tracking` | `—` | `0` |  | 1 |
| `Static/Headline Small/Line Height` | `—` | `32` |  | 1 |
| `Static/Title Medium/Font` | `—` | `unresolved` | Static/Font/Plain | 1 |
| `Static/Title Medium/Weight` | `—` | `unresolved` | Static/Weight/Medium | 1 |
| `Static/Title Medium/Size` | `—` | `16` |  | 1 |
| `Static/Title Medium/Tracking` | `—` | `0.15000000596046448` |  | 1 |
| `Static/Title Medium/Line Height` | `—` | `24` |  | 1 |
| `Static/Title Large/Font` | `—` | `unresolved` | Static/Font/Brand | 1 |
| `Static/Title Large/Weight` | `—` | `unresolved` | Static/Weight/Regular | 1 |
| `Static/Title Large/Size` | `—` | `22` |  | 1 |
| `Static/Title Large/Tracking` | `—` | `0` |  | 1 |
| `Static/Title Large/Line Height` | `—` | `28` |  | 1 |
| `Static/Title Small/Font` | `—` | `unresolved` | Static/Font/Plain | 1 |
| `Static/Title Small/Weight` | `—` | `unresolved` | Static/Weight/Medium | 1 |
| `Static/Title Small/Size` | `—` | `14` |  | 1 |
| `Static/Title Small/Tracking` | `—` | `0.10000000149011612` |  | 1 |
| `Static/Title Small/Line Height` | `—` | `20` |  | 1 |
| `State Layers/Primary/Opacity-16` | `—` | `#6750a429` |  | 32 |
| `Schemes/Secondary` | `—` | `#625b71` |  | 32 |
| `Corner/Small` | `—` | `8` |  | 1 |
| `Background/Danger/Default` | `var(--sds-color-background-danger-default)` | `#ec221f` | Red/500 | 3 |
| `Corner/Large-increased` | `—` | `20` |  | 1 |
| `Icon/Neutral/Default` | `var(--sds-color-icon-neutral-default)` | `#303030` | Slate/900 | 3 |
| `Border/Default/tertiary` | `var(--sds-color-border-default-tertiary)` | `#383838` | Gray/700 | 3 |
| `Gray/200` | `var(--sds-color-gray-200)` | `#e6e6e6` |  | 1 |
| `Background/Default/Secondary Hover` | `var(--sds-color-background-default-secondary-hover)` | `#e6e6e6` | Gray/200 | 3 |
| `Icon/Brand/On Brand` | `var(--sds-color-icon-brand-on-brand)` | `#f5f5f5` | Brand/100 | 3 |
| `Border/Positive/tertiary` | `var(--sds-color-border-positive-tertiary)` | `#14ae5c` | Green/500 | 3 |
| `Border/Neutral/Secondary` | `var(--sds-color-border-neutral-secondary)` | `#767676` | Slate/600 | 3 |
| `Background/Positive/Secondary` | `var(--sds-color-background-positive-secondary)` | `#cff7d3` | Green/200 | 3 |
| `Text/Positive/Default` | `var(--sds-color-text-positive-default)` | `#02542d` | Green/800 | 3 |
| `Icon/Positive/Default` | `var(--sds-color-icon-positive-default)` | `#02542d` | Green/800 | 3 |
| `Corner/Extra-small` | `—` | `4` |  | 1 |

## Fill styles

`active subtitle in menu` is a FILL paint, not a color variable.

| Name | Hex |
| --- | --- |
| `M3/sys/light/on-surface` | `#1d1b20` |
| `M3/sys/light/secondary-container` | `#e8def8` |
| `M3/sys/light/outline` | `#79747e` |
| `M3/sys/light/on-secondary-container` | `#4a4459` |
| `M3/state-layers/light/on-surface/opacity-0.12` | `#1d1b20` |
| `M3/state-layers/light/on-secondary-container/opacity-0.12` | `#4a4459` |
| `M3/state-layers/light/on-surface/opacity-0.08` | `#1d1b20` |
| `M3/state-layers/light/on-secondary-container/opacity-0.08` | `#4a4459` |
| `M3/sys/light/primary` | `#65558f` |
| `M3/state-layers/light/on-primary/opacity-0.12` | `#ffffff` |
| `M3/sys/light/on-primary` | `#ffffff` |
| `M3/state-layers/light/on-primary/opacity-0.08` | `#ffffff` |
| `M3/sys/light/surface-container-low` | `#f7f2fa` |
| `M3/state-layers/light/primary/opacity-0.12` | `#65558f` |
| `M3/state-layers/light/primary/opacity-0.08` | `#65558f` |
| `fill_icon` | `#222222` |
| `gold back` | `` |
| `M3/sys/light/on-surface-variant` | `#49454f` |
| `icon` | `#4d3d2a` |
| `brown` | `#6b624d` |
| `Colors/Blue` | `#007aff` |
| `M3/sys/light/surface-container-high` | `#ece6f0` |
| `M3/state-layers/light/onSurface/opacity-0.08` | `#1d1b20` |
| `M3/state-layers/light/onSurface/opacity-0.10` | `#1d1b20` |
| `M3/state-layers/light/onSurfaceVariant/opacity-0.08` | `#49454f` |
| `M3/state-layers/light/onSurfaceVariant/opacity-0.10` | `#49454f` |
| `M3/sys/light/outline-variant` | `#cac4d0` |
| `M3/state-layers/light/onSecondaryContainer/opacity-0.08` | `#4a4459` |
| `M3/state-layers/light/onSecondaryContainer/opacity-0.10` | `#4a4459` |
| `M3/sys/light/primary` | `#6750a4` |
| `M3/state-layers/light/onPrimary/opacity-0.08` | `#ffffff` |
| `M3/state-layers/light/onPrimary/opacity-0.10` | `#ffffff` |
| `M3/sys/light/primary-container` | `#eaddff` |
| `M3/sys/light/on-primary-container` | `#4f378a` |
| `M3/black` | `#000000` |
| `M3/state-layers/light/primary/opacity-0.08` | `#6750a4` |
| `M3/state-layers/light/primary/opacity-0.10` | `#6750a4` |
| `M3/state-layers/light/primary/opacity-0.16` | `#6750a4` |
| `M3/sys/light/secondary-container` | `#e8def8` |
| `active subtitle in menu` | `#945511` |

## Typography

| Name | Family | Style | Size | Weight | Line height | Letter spacing |
| --- | --- | --- | --- | --- | --- | --- |
| `M3/label/large` | Roboto | Medium | 14 | 500 | 20 PIXELS | 0.10000000149011612 |
| `M3/body/large` | Roboto | Regular | 16 | 400 | 24 PIXELS | 0.5 |
| `Page Title1-24 B` | Vazirmatn FD | Bold | 24 | 700 | 24 PIXELS | 0 |
| `Section Title 1-18B` | Vazirmatn FD | Bold | 18 | 700 | 24 PIXELS | 0 |
| `Page Title1-24 SB` | Vazirmatn FD | SemiBold | 24 | 600 | 24 PIXELS | 0 |
| `Section Title2-18-M` | Vazirmatn FD | Medium | 18 | 500 | 24 PIXELS | 0 |
| `Subtitle1-16 M` | Vazirmatn FD | Medium | 16 | 500 | 24 PIXELS | 0 |
| `Subtitle2-16 R` | Vazirmatn FD | Regular | 16 | 400 | 24 PIXELS | 0 |
| `Body text-14 R` | Vazirmatn FD | Regular | 14 | 400 | 24 PIXELS | 0 |
| `Caption1-12 R` | Vazirmatn FD | Regular | 12 | 400 | 24 PIXELS | 0 |
| `Caption2-12 L` | Vazirmatn FD | Light | 12 | 300 | 24 PIXELS | 0 |
| `Button 1-14B` | Vazirmatn FD | Bold | 14 | 700 | 24 PIXELS | 0 |
| `Button 2-14 M` | Vazirmatn FD | Medium | 14 | 500 | 24 PIXELS | 0 |
| `Tag1-12 M` | Vazirmatn FD | Medium | 12 | 500 | 24 PIXELS | 0 |
| `Tag2-12SB` | Vazirmatn FD | SemiBold | 12 | 600 | 24 PIXELS | 0 |
| `M3/headline/large` | Roboto | Regular | 32 | 400 | 40 PIXELS | 0 |
| `M3/headline/small` | Roboto | Regular | 24 | 400 | 32 PIXELS | 0 |
| `M3/title/medium` | Roboto | Medium | 16 | 500 | 24 PIXELS | 0.15000000596046448 |
| `M3/label/large` | Roboto | Medium | 14 | 500 | 20 PIXELS | 0.10000000149011612 |
| `M3/title/large` | Roboto | Regular | 22 | 400 | 28 PIXELS | 0 |
| `M3/title/small` | Roboto | Medium | 14 | 500 | 20 PIXELS | 0.10000000149011612 |

The Tsheen UI family is `Vazirmatn FD`. Weight is `derivedTextData.fontMetaData[0].fontWeight` on the text node. The React theme uses the `Vazirmatn FD` rows. The `Roboto` rows are M3 styles from the same file.

## Canvases and sections

These are an inventory from `list_sections`. Do not add product routes for them.

| Canvas | Guid |
| --- | --- |
| `Internal Only Canvas` | `0/2` |
| `Page 1` | `1/2` |
| `نیکون` | `951/4255` |

| Section | Guid | Parent |
| --- | --- | --- |
| `انتقال مالکیت` | `600/852` | `1/2` |
| `ورود` | `601/853` | `1/2` |
| `داشبورد` | `650/2084` | `1/2` |
| `components` | `710/746` | `1/2` |
| `ثبت نام` | `722/1413` | `1/2` |
| `دریافت مالکیت` | `800/1580` | `1/2` |
| `کیف پول` | `812/1616` | `1/2` |
| `حساب کاربری` | `813/1907` | `1/2` |
| `امنیت` | `834/2705` | `1/2` |
| `افزایش موجودی` | `876/3132` | `812/1616` |
| `موجودی من` | `893/3906` | `812/1616` |
| `کارت های شتابی` | `905/3861` | `812/1616` |
| `خرید و فروش` | `905/3862` | `1/2` |
| `خرید شمش از تیشین` | `1002/4273` | `905/3862` |
| `رزرو شمش` | `1031/9318` | `905/3862` |
| `برداشت از موجودی` | `1039/7384` | `812/1616` |
| `فروش` | `1045/9039` | `905/3862` |
| `نقل و انتقالات` | `1051/7942` | `1/2` |
| `انتقال شمش` | `1131/9423` | `1051/7942` |

## Components

`get_component` reads this catalog. Reuse `apps/react/src/assets/figma/` when an image hash matches a file already there. The gold-bar hashes below are the bytes in `gold-bar-1.png`, `gold-bar-3.png`, and `gold-bar-5.png`. `CAPTCHA` image `e2793928f2712f1977e991e42cc9cf13c7b530ec` is `captcha-puzzle.png`. Do not draw a substitute illustration.

| Symbol | Guid | Type | Variants or image |
| --- | --- | --- | --- |
| `CAPTCHA` | `710/738` | SYMBOL | dark 1 `707/773`; Frame 239456 `707/774` |
| `OTP` | `710/755` | FRAME | Default `710/754`; fill otp `710/756`; wrong otp `710/775` |
| `text input` | `710/802` | FRAME | Default `710/797`; wrong `710/803`; pass `710/823`; wrong pass `710/839` |
| `input icon` | `732/1353` | FRAME | Default `722/1459`; wrong `732/1354` |
| `menu-dashboard` | `812/1710` | FRAME | Default `812/1709`; menu-profie `812/1759`; menu-wallet `813/1661`; menu-credit `813/1811`; menu-support `813/1861`; menu-security `832/2220`; menu-transfer `832/2264`; menu-buy.sell `813/1711` |
| `top bar` | `813/1977` | SYMBOL |  |
| `pageination` | `874/2921` | SYMBOL |  |
| `icon button` | `886/3106` | SYMBOL |  |
| `search` | `889/3309` | SYMBOL |  |
| `gold bar1/Default` | `885/3091` | SYMBOL | image `247fbbc5b2ae9316b4beb48c1c520c360c96a295` |
| `gold bar 3/Default` | `885/3092` | SYMBOL | image `27ed8c072749d22e960c12af3fe795746a8d6bb0` |
| `gold bar5/Default` | `885/3087` | SYMBOL | image `6575389844ff47ac86f01162d5605f80153bf0ca` |

Direct fills returned with those symbols: CAPTCHA `#f5f5f5` and `#ffffff`; menu-dashboard `#fff8e6`; top bar `#fff8e6`, `#945511`, and `#14ae5c`; pageination `#5a5a5a` and `#ffffff`; icon button `#cdcdcd`; search `#ffffff`. Paint `brown` is `#6b624d`. Paint `icon` is `#4d3d2a`. Paint `M3/sys/light/on-surface` is `#1d1b20`.
