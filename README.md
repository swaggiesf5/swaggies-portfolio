# Swaggies

Personal portfolio styled as a console memory-card browser: a low-res three.js city behind a
CRT overlay, a boot intro, and project "saves" you browse with the mouse or arrow keys.

Vite + strict TypeScript, no UI framework. The only runtime dependency is `three`.
`reference/original.html` is the single-file version this was ported from, kept as the
visual and behavioural spec.

## Develop

```sh
npm i
npm run dev       # http://localhost:5173
npm run build     # type-check + lint + production build into dist/
npm run preview   # serve dist/ locally
npm run format    # prettier
```

`npm run build` fails on any type or lint error.

## Editing content

All project content lives in **`src/data/saves.ts`**, one `Save` object per slot. Order in the
array is order on screen; the first save is selected on load.

| Field    | What it controls                                                               |
| -------- | ------------------------------------------------------------------------------ |
| `id`     | DOM id of the slot (`slot-<id>`), must be unique                               |
| `name`   | Label under the cube                                                           |
| `size`   | Small dim line under the label                                                 |
| `glyph`  | 1–2 letters on the cube's front and back                                       |
| `c1`     | Cube front/back/top/bottom colour                                              |
| `c2`     | Cube sides, glyph glow, and the 3D background's tower-cap colour when selected |
| `title`  | Heading in the data panel                                                      |
| `meta`   | Label/value rows; add `href` to make the value an external link                |
| `sum`    | Summary paragraph (empty string shows a "not yet written" placeholder)         |
| `groups` | Titled bullet lists                                                            |
| `links`  | Optional link buttons                                                          |
| `stack`  | Tech chips at the bottom                                                       |

The save count in the BIOS text and section header updates automatically.

Skills cards are in `src/data/skills.ts`. The hero text and footer are plain HTML in
`index.html`.

## Layout

```
index.html              static shell, SEO/OG tags, fonts
public/favicon.svg
src/main.ts             wires scene, intro, memory card, skills and sound together
src/data/               saves + skills content
src/scene/background.ts three.js scene (towers, orbs, motes, stars, camera)
src/intro/intro.ts      BIOS → wordmark → PRESS START
src/ui/                 memory card + skills rendering
src/audio/synth.ts      WebAudio drone/blip/chime, off until SOUND is pressed
src/styles/             tokens, base, crt, intro, memory-card
```

## Deploy

Import the repo in Vercel; the Vite preset builds to `dist/` with no extra config.
