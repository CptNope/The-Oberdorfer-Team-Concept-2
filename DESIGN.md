---
name: The Oberdorfer Team · Concept 2 "The Quadrangle"
description: Central Massachusetts read as a USGS quadrangle sheet — neatline, collar, contour terrain, legend, adjoining sheets.
colors:
  paper: "oklch(97.6% 0.006 135)"
  paper-deep: "oklch(94.4% 0.012 135)"
  woodland: "oklch(90.5% 0.04 140)"
  woodland-deep: "oklch(84% 0.055 142)"
  forest: "oklch(36% 0.068 158)"
  forest-deep: "oklch(27.5% 0.052 160)"
  forest-tint: "oklch(84% 0.045 150)"
  ink: "oklch(23% 0.018 245)"
  ink-soft: "oklch(41% 0.02 245)"
  ink-faint: "oklch(58% 0.015 245)"
  contour: "oklch(62% 0.095 52)"
  contour-ink: "oklch(48% 0.105 47)"
  clay: "oklch(90% 0.032 62)"
  water: "oklch(49% 0.1 242)"
  water-tint: "oklch(91% 0.028 235)"
  water-light: "oklch(74% 0.075 238)"
  route: "oklch(43% 0.14 27)"
  route-deep: "oklch(35% 0.12 27)"
  route-tint: "oklch(91% 0.03 30)"
  rule: "oklch(23% 0.018 245 / 0.16)"
  rule-strong: "oklch(23% 0.018 245 / 0.55)"
typography:
  display:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(3.25rem, 1.6rem + 6.2vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.035em"
  h1:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.5rem, 1.55rem + 3.6vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.03em"
  h2:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.85rem, 1.35rem + 1.9vw, 3rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  h3:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.3rem, 1.15rem + 0.55vw, 1.6rem)"
    fontWeight: 800
    lineHeight: 1.1
  lede:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.15rem, 1.06rem + 0.4vw, 1.375rem)"
    fontWeight: 400
    lineHeight: 1.5
  voice:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Overpass, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontFamily: "Overpass, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Overpass, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
  button:
    fontFamily: "Overpass, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "0.01em"
  town:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontWeight: 600
    letterSpacing: "0.32em"
  water-name:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontWeight: 400
  price:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(1.75rem, 1.45rem + 1.1vw, 2.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.02em"
    fontFeature: "lnum"
  address:
    fontFamily: "Besley, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 600
    lineHeight: 1.2
  facts:
    fontFamily: "Overpass, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
    fontFeature: "tnum, lnum"
  code:
    fontFamily: "'Overpass Mono', ui-monospace, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.04em"
rounded:
  none: "0"
  sm: "2px"
  full: "50%"
spacing:
  s-1: "0.25rem"
  s-2: "0.5rem"
  s-3: "0.75rem"
  s-4: "1rem"
  s-5: "1.5rem"
  s-6: "2rem"
  s-7: "3rem"
  s-8: "4rem"
  s-9: "6rem"
  s-10: "8rem"
  section: "clamp(4rem, 2.5rem + 6vw, 8rem)"
  collar: "clamp(10px, 2.6vw, 40px)"
  gutter: "clamp(16px, 2.2vw, 32px)"
  max: "1520px"
  measure: "66ch"
components:
  button-route:
    backgroundColor: "{colors.route}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7em 1.25em 0.62em"
    height: "48px"
  button-route-hover:
    backgroundColor: "{colors.route-deep}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.7em 1.25em 0.62em"
    height: "48px"
  button-line-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.forest-deep}"
    rounded: "{rounded.sm}"
    height: "48px"
  button-paper-hover:
    backgroundColor: "{colors.woodland}"
  button-small:
    padding: "0.5em 0.9em 0.42em"
    height: "40px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.35rem 0.85rem 0.3rem 0.6rem"
    height: "40px"
  chip-selected:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0 0.55rem"
    height: "48px"
  legend-entry:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "0.8rem 1rem"
    height: "56px"
  legend-entry-hover:
    backgroundColor: "{colors.paper-deep}"
  fav-button:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: "44px"
  fav-button-saved:
    textColor: "{colors.route}"
  map-pin:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "5px 8px 4px"
  map-pin-hot:
    backgroundColor: "{colors.route}"
    textColor: "{colors.paper}"
  frame-property:
    backgroundColor: "{colors.clay}"
    textColor: "{colors.contour-ink}"
  frame-place:
    backgroundColor: "{colors.woodland}"
    textColor: "{colors.forest}"
  frame-people:
    backgroundColor: "{colors.water-tint}"
    textColor: "{colors.water}"
  source-tag-voice:
    textColor: "{colors.forest}"
    padding: "0.35rem 0.5rem 0.3rem"
  source-tag-data:
    textColor: "{colors.water}"
    padding: "0.35rem 0.5rem 0.3rem"
  datablock-head:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink}"
    padding: "0.75rem 1rem"
  band-forest:
    backgroundColor: "{colors.forest}"
    textColor: "{colors.paper}"
---

# Design System: The Oberdorfer Team · Concept 2 "The Quadrangle"

## Overview

**Creative North Star: "The Quadrangle"**

Every page is a survey sheet of Central Massachusetts. The main content sits inside a neatline (a ruled frame) with coordinate ticks at its corners. Header and footer are the collar (the sheet's printed margin), so credits, brokerage and legal text live there. Choices are legend entries: a map symbol, a name and a note. Towns are lettered the way a topographic map letters populated places. Generated contour terrain is the ground under openings and town pages. Photography is not on hand, so every image slot is an art-directed frame that carries its shot brief, and the frames double as the photographer's shot list.

The density is a well-set atlas page: generous margins, shared ruled edges instead of floating cards, one red route through each view. The materials are paper, ink linework, contour clay, woodland tint, water blue and a drenched forest field. Motion only reveals the map or the place: contours draw in, a town's hill lifts, frames open like a print pulled from a tray.

Sources of truth: `assets/css/tokens.css` (custom properties, canonical OKLCH), `data/palette.json` (hex + measured contrast), and the generated `assets/brand/tokens.json` and `assets/brand/theme.json` (block-theme palette, fonts and spacing presets). The brand book (`brand/index.html`) renders live components from the same CSS.

**Key Characteristics:**
- A 1.5px ink neatline around `<main>`, inset by the collar margin; header and footer sit outside it.
- Besley (a county-atlas Clarendon) carries the voice; Overpass (Highway Gothic) carries the interface and data; Overpass Mono is kept for identifiers.
- Map lettering: towns in widely spaced roman caps, water names in blue italic, a paper halo over terrain.
- Contour terrain (seeded and illustrative, never survey data) as the ground of openings, town heads and the sheet index.
- Legends are the controls: homepage intents, discovery attributes and search filters all share one symbol vocabulary.
- Verified data and editorial voice are visibly separate, and each is labeled.
- 2px corners. Paper has corners.

## Colors

These are the layers of a printed quad sheet: near-white green-grey paper, ink linework, clay contours, woodland tint, water blue, a forest field, and one oxblood route. All colors are authored in OKLCH. The hex values below are fallbacks used in theme.json, print and email.

### Primary
- **Forest** (oklch(36% 0.068 158) · #17482f): the brand field. Fills whole bands: the "personally handled" statement band, the mobile nav sheet, and dark people frames. Also used for the mark, selected filter chips and stepper segments, the italic turn of the display headline ("*place.*"), the editorial drop cap, "Our part" labels and editorial-voice source tags. Paper on forest measures 9.83:1.
- **Forest Deep** (oklch(27.5% 0.052 160) · #0b2f1f): the deepest field (code blocks, people frames on forest) and the text color of paper buttons.
- **Forest Tint** (oklch(84% 0.045 150) · #b7d3bb): secondary text, labels, mark and form strokes on forest (6.55:1).

### Secondary
- **Route** (oklch(43% 0.14 27) · #8d2521): the primary route. Used for the main action button, the nav current/hover underline, the active town pin, the selected journey station, hot map pins, saved hearts, the open-house status dot, the focused find-field underline, form error text, and `accent-color`/`caret-color`. Paper on route measures 8.14:1.
- **Route Deep** (oklch(35% 0.12 27) · #6c1614): hover and pressed state for route.
- **Route Tint** (oklch(91% 0.03 30) · #f5dad6): the open-house alert field only.

### Tertiary
- **Water** (oklch(49% 0.1 242) · #206694): links, information, verified-data source tags, the focus ring, rivers and lake outlines, water lettering. 5.79:1 on paper.
- **Water Tint** (oklch(91% 0.028 235) · #d0e5f2): the people-frame plate.
- **Water Light** (oklch(74% 0.075 238) · #7db2d5): links and water on dark grounds (ink ribbon, toast, forest-deep).
- **Contour** (oklch(62% 0.095 52) · #b3754f): contour linework and the "Exploring" legend symbol. At 3.51:1 it is never used for text.
- **Contour Ink** (oklch(48% 0.105 47) · #8c4823): contour-colored text (6.37:1). Used for sample/synthetic tags, list numerals, chapter numbers, the property-frame ink, the town-lift linework and feature-list dashes.
- **Clay** (oklch(90% 0.032 62) · #eedac9): the property-frame plate and the hatch symbol.
- **Woodland** (oklch(90.5% 0.04 140) · #d2e7ce) / **Woodland Deep** (oklch(84% 0.055 142) · #b7d4b3): the place-frame plate, journey-profile ground, form success panel and matched sheet-index cells. Woodland Deep is the `::selection` background.

### Neutral
- **Paper** (oklch(97.6% 0.006 135) · #f5f8f4): the sheet. The default ground of every page, and the map-lettering halo.
- **Paper Deep** (oklch(94.4% 0.012 135) · #e9eee6): collar strips, data-block and market headers, hover on legend rows and table rows, the scrollbar track.
- **Ink** (oklch(23% 0.018 245) · #161e25): text, neatlines, form underlines, line buttons, the demo ribbon and the lightbox (15.76:1).
- **Ink Soft** (oklch(41% 0.02 245) · #424c55): secondary text, labels, meta, table heads (8.23:1).
- **Ink Faint** (oklch(58% 0.015 245) · #737b83): 3.99:1, so it is for large type, idle arrow icons, separators and the scrollbar thumb only.
- **Rule** (ink at 16%) / **Rule Strong** (ink at 55%): interior hairlines between rows and cells, and idle chip, fav and select borders.

### Named Rules
**The One Route Rule.** Route red marks the way forward and where you are on it: one primary action per view, plus the current position (nav current page, active town, selected station, hot pin). It is never a decorative fill. Its only tinted field is the open-house notice.

**The Field Color Rule.** Forest is drenched across whole bands or fills a chosen state. As text it appears only for the italic turn of a headline and for editorial-voice markers. Selected filters fill forest, not route.

**The Linework Rule.** Contour and ink-faint are for lines and marks. When text needs the contour color, use contour-ink.

**The Water Is Information Rule.** Water blue means link, source or focus. No button is ever filled with water.

## Typography

**Display Font:** Besley 400 / 400 italic / 600 / 800 / 800 italic (with Iowan Old Style, Georgia)
**Body Font:** Overpass, variable 100–900, roman + italic (with Helvetica Neue, Arial)
**Label/Mono Font:** Overpass Mono 500, used only for coordinates, photo codes, lens notes, MLS numbers, station numbers and scale bars

All three faces are self-hosted woff2 (`assets/fonts/`). Besley 800 and Overpass roman are preloaded. Overpass borrows Besley's middle dot (U+00B7) through a `unicode-range` face, because Overpass sets the middle dot tight against the next word.

**Character:** Besley is the nineteenth-century American printing voice: county atlases, deed plans, timetables. Overpass is the road-sign gothic you read on the way to see a house. The serif speaks; the sans works.

### Hierarchy
- **Display** (Besley 800, clamp 3.25→6rem, lh 0.9, -0.035em): the homepage "Find / your / *place.*", story heroes, agent names. The italic turn uses 800 italic in forest.
- **H1** (Besley 800, clamp 2.5→4.25rem, lh 0.98, -0.03em): page heads, the property title, forest-band and conversation heads. The second phrase is Besley italic 400.
- **H2** (Besley 800, clamp 1.85→3rem, lh 1.02, -0.025em): section heads spanning 7 of 12 columns, with a supporting note in the last 5.
- **H3** (Besley 800, clamp 1.3→1.6rem, lh 1.1): property sections, feature titles, journey panels.
- **Lede** (Besley 400, clamp 1.15→1.375rem, lh 1.45–1.5, max 31–40ch): the opening lede, page ledes, town ledes. Italic variant for story heroes and deks.
- **Voice** (Besley 400, 1.1875rem, lh 1.6, 62ch): property stories, town overviews and article bodies (lh 1.65). The first paragraph of a story gets a forest drop cap (Besley 800, 3.4em).
- **Body** (Overpass 400, 1.0625rem / 17px, lh 1.6, measure 66ch): UI copy, notes, forms.
- **Label** (Overpass 700, 0.8125rem, +0.08em, uppercase, ink-soft): legend titles, table heads, data-block dt, filter titles, footer column heads.
- **Code** (Overpass Mono 500, 0.6875rem, +0.02–0.04em): corner coordinates, frame codes (`PR-06`), lens (`28mm`), station numbers (`01`), gallery counts.

### Real-estate data hierarchy
Price is Besley 800 at `--t-price` with lining figures (2.25→3.5rem on the property title). Address is Besley 600 at 19px. Town is a map-lettered line (spaced caps). Facts are Overpass 600 tabular, with units (`bd`, `ba`, `sq ft`, `ac`) as `<abbr>` in 400 ink-soft. Status is Overpass 700 caps plus a map point symbol: Active = forest dot, Open house = route dot, Coming soon = water ring, Under agreement = ink-faint dot.

### Named Rules
**The Map Lettering Rule.** A place name on terrain or in navigation is lettered like a quad sheet: Besley 600, uppercase, letter-spacing 0.32em, with a negative right margin equal to the tracking so it optically centers. It drops to 0.22em or 0.16em at small sizes and to 0.12–0.24em for the giant town-page H1. Water names are Besley italic in water blue, rotated along the feature. Any label over terrain gets the paper halo (stacked `text-shadow` at 2/4/10/18px).

**The Two Voices Rule.** Besley speaks: headings, ledes, editorial copy, prices, addresses, legend names. Overpass works: controls, labels, facts, tables, forms. Mono only identifies. Never set data in the serif body voice, and never set a headline in Overpass.

**The Italic Turn Rule.** A headline turns on its second phrase in Besley italic ("Low roof, *long view*", "Ask about *this home*"). The turn is 400 weight, except at display size, where it stays 800 italic.

## Layout

- **The sheet.** `<main>` is `.sheet`: inset horizontally by `--collar` (clamp 10→40px), bordered by a 1.5px ink neatline, on paper. Four corner ticks in mono, each with a 1.5×10px ink tick, show the sheet bounds (`42°22′30″N 71°57′30″W` to `42°10′N 71°40′W`). The top ticks sit inside the frame and the bottom ticks hang below it. Ticks hide under 720px.
- **Grid.** 12 columns, gutter clamp 16→32px, `.wrap` max 1520px, reading measure 66ch. Asymmetric spans are the norm: 7/5 section heads, 8/4 property body, 5/6 conversation, 3/4/5 roster rows, 4+4+4 journey panels. The discovery grid staggers five spans (7, 5+offset, 5, 6+offset, 8) instead of uniform tiles.
- **Rhythm.** Sections pad `--section` (clamp 4→8rem) vertically, or ×0.6 for tight sections. The spacing scale has a 4px base (s-1…s-10 = 4, 8, 12, 16, 24, 32, 48, 64, 96, 128px). Section heads take s-7 below them.
- **Pace.** Paper, forest band and woodland field alternate. A dense table is followed by a quiet frame.
- **Opening sheet.** The full-viewport field of terrain is masked in from the left (22%). Text is left-weighted (max 46rem / 52%). A full-width legend strip runs below (6 columns: title + 5 intents), then a paper-deep collar credit strip with scale bar. Under 900px the terrain becomes a 1.6:1 map strip below the text, and the legend becomes stacked rows.
- **Search.** Filters 300px | list | map 0.9fr. The map column is sticky under the 72px header and the 66px search bar. At 1180px filters move into a right-hand dialog. At 860px a floating map/list toggle appears. The rows table stacks by container width (760px), not viewport.
- **Breakpoints observed:** 1180 (filters→dialog), 1080 (nav→menu sheet), 1100/900 (opening legend), 1000 (property sidebar unsticks), 960/900/860 (grids collapse to one column), 720 (ticks hide), 560/520 (forms, sheet index to 1 column). Frames, rows and the place card respond to container queries.
- **Scroll padding.** 88px for the sticky collar.

### Named Rules
**The Neatline Rule.** Content lives inside the sheet. Header, footer, credits, brokerage and legal live in the collar outside it. Nothing escapes the neatline except the lower corner ticks.

**The Shared Edge Rule.** Groups share rules like a sheet index: a 1.5px ink neatline outside, 1px ink or `rule` hairlines inside. Cells, rows and legend entries are divided by rules, never separated into floating rounded cards.

## Elevation & Depth

The page is flat paper. Depth comes from rules, tinted fields and the terrain beneath. Shadow is reserved for objects lifted off the sheet: the town place card, dialogs, the toast, map pins and the floating map toggle. Both lifts pair a 1–2px contact line with a long, negative-spread ambient shadow, like a card resting on a table.

### Shadow Vocabulary
- **Lift 1** (`box-shadow: 0 1px 0 oklch(23% 0.018 245 / 0.06), 0 6px 18px -10px oklch(23% 0.018 245 / 0.28)`): search map price pins.
- **Lift 2** (`box-shadow: 0 2px 0 oklch(23% 0.018 245 / 0.05), 0 22px 48px -24px oklch(23% 0.018 245 / 0.42)`): place card, modal, toast, mobile map toggle.
- **Halo** (`text-shadow: 0 0 2px/4px/10px/18px var(--paper)`): map lettering over terrain only.
- **Backdrops** (`oklch(23% 0.018 245 / 0.40–0.45)`): native `<dialog>` backdrops.

### Named Rules
**The Lifted Paper Rule.** If it isn't physically above the sheet (popover, dialog, pin, toast), it has no shadow. Hover never adds shadow; it shifts background to paper-deep, moves arrows 3–4px, or lifts a button by 1px.

## Shapes

Paper has corners: `--radius` 2px on buttons, chips, selects and steppers, and 0 on fields, frames, legends and data blocks. Circles are reserved for point symbols: the fav button (44px), the saved-count badge, status dots, journey stations, the minimap "here" target and the scrollbar thumb. Town pins are 9px squares (a map's populated-place symbol). They rotate 45° into a route-red diamond when active. The synthetic-data marker is a 7px outlined diamond. Line weights are part of the form language: neatline 1.5px, hair 1px, control borders 1.5px, focus 2.5px. Every SVG stroke uses `vector-effect: non-scaling-stroke`.

## Components

### Buttons
- **Shape:** squared (2px), min-height 48px (40px small, 44px icon-only), Overpass 700 at 0.9375rem.
- **Route (primary):** route fill, paper text. Hover route-deep, lift −1px, trailing arrow +3px. Use one per view: "Talk with us", form submits, "Schedule a showing".
- **Line:** transparent with ink border. Hover fills ink.
- **Paper / Ghost-paper:** for forest fields. Paper fill with forest-deep text (hover woodland), or transparent with a 50% paper border (hover paper fill).
- **Link-arrow:** Overpass 700 ink with a 1.5px route underline and an arrow. This is the secondary "next step" link everywhere.
- **Labels** name the human and the step ("Ask about this home", "Send to Kait"). Never "Submit", "Contact us" or "Learn more".

### Legend (signature)
- **Legend as choices:** a 1.5px-neatlined block with an uppercase label title, rows of `symbol (44×14) · Besley 600 name · Overpass note · arrow`, min-height 56px, paper-deep on hover.
- **Homepage intents:** Buying (solid route line), Selling (double ink line), Relocating (dashed route), Exploring (contour wave), Advice (dotted water). These five are the primary actions of the opening sheet.
- **Attribute symbols** for life-first discovery and filters: area (woodland), hatch (clay), solid, parcel (dashed outline), dot, ring, rail. All are drawn at `viewBox 0 0 52 14` from `sym()` in lib.mjs.
- **Chips** are legend entries as toggles: a 1.5px rule-strong border, 40px min-height, the symbol at 22×12, and forest fill when pressed or checked. A real input stretches over each chip, so focus shows the water ring on the chip.

### Inputs / Fields
- **Style:** survey-form fields with no box. Paper ground, a 1.5px ink bottom rule, 0 radius, min-height 48px, Overpass 500 at 1rem. Textareas get a full 1.5px ink border. Selects use a drawn CSS chevron.
- **Focus:** the rule turns route with a 1.5px route under-shadow. The find field's 2px ink underline thickens to route.
- **Error:** the rule turns route and route 600 error text appears below. Labels are Overpass 700 at 0.875rem in ink. Placeholders use ink-faint.
- **On forest:** labels are paper, strokes forest-tint, ground transparent.

### Navigation
- **Top collar:** sticky, 72px. Paper at 94% with a light blur, so terrain does not strobe under it. A hairline appears once scrolled. The left side holds the lockup: the mark, then "*The* **Oberdorfer** *Team*" with the attribution line beneath it.
- **Links:** Overpass 600 at 0.9375rem in ink, with a 2px route underline that scales in from the left on hover and on `aria-current`.
- **Header actions:** a Saved count badge (route when greater than 0) and the route "Talk with us" button.
- **Mobile (≤1080px):** a full-height forest `<dialog>` that wipes down via clip-path. Links are Besley 600 at 2–2.75rem with arrows, and town names are map-lettered in forest-tint below them.
- **Adjoining sheets:** town pages letter their N/E/S/W neighbors at the sheet edges (Besley 600 caps, 0.22em). East and west names are rotated 90°, and each name links to that town. The footer's "Towns on this sheet" row repeats them.

### Frames: art-directed photography slots (signature)
- **Plate:** an aspect-ratio box (`--ar`, default 3/2; 21/9 for the property hero, 4/5 for portraits, 1/1 for avatars) tinted by kind: **property** = clay + contour-ink, **place** = woodland + forest (with a cropped contour patch at 55%), **people** = water-tint + water (forest-deep + forest-tint on forest bands).
- **Mount:** an inner 1px rule at 30% frame-ink, inset clamp 14→34px, like a print on a mount. Four 14px L-shaped crop marks sit at 10px from the corners.
- **Storyboard guide (from the brief):** dashed rule-of-thirds lines (2 5, 35%), a horizon line (58% for place, 54% for property, none for people), a 9% subject mass (a house silhouette chosen from the listing style, an interior perspective box, a figure, or a ridge), and an × focal mark at a thirds intersection.
- **Text:** the frame code reads `KIND CODE ratio` in mono at the top left, the lens (`28mm`) sits bottom right, and the shot direction is set in Besley italic, clamp 0.875→1.375rem, max 34ch. Under 560px of container width the brief moves below the plate. At 150px and below only initials remain (people) and the crops shrink.
- **Accessibility:** the plate is `role="img"`, labelled "Photograph to come (kind): brief".
- **Motion:** the plate wipes open top-down (clip-path, 1.1s) once on entry.
- **Provisional (WP):** a `core/image` block style named "frame". When the real photo lands, the brief becomes the media-library image brief.

### Data vs editorial (signature)
- **Source tags:** Overpass 700 at 0.6875rem caps, +0.1em, 1px currentColor box. "Editorial · written by the team" is forest. "From the listing" and "Verified data · MLS PIN" are water. Each tag sits at the right end of its section heading.
- **Voice block:** Besley 400 at 1.1875rem, 62ch, forest drop cap, signed ("Written by **Kait Oberdorfer** after walking the house").
- **Data block:** a 1.5px ink neatline, a paper-deep head (label + synthetic tag), a 2-column `dl` with ink-soft dt and Overpass 700 tabular dd right-aligned, and a footer carrying listing courtesy, source and the MLS disclaimer. Key facts strip: label dt, Besley 800 1.5rem dd.
- **Synthetic marker:** `.synthetic`, a contour-ink 7px outlined diamond plus Overpass 700 at 0.75rem caps ("Sample data · fictional", "Example profile"). It is required on every invented listing, figure or bio.
- **Market figures** always carry their source and date. The market chart uses mono axes.

### Brokerage attribution
- **Text comes from `data/settings.json`** (a WP options page) by context: header (`at REWAP Brokerage`), collar (`Prepared by The Oberdorfer Team · Brokered by REWAP Brokerage LLC`), agent line, property line, listing courtesy, contact note, footer paragraph, disclosure.
- **Typography:** always Overpass, at label size (header: 700, 0.6875rem, +0.14em caps, ink-soft) or small body size, in ink-soft. Only the team name may take Besley.
- **Placement:** never larger than the team name, never in display serif, no brokerage logo. It sits in the collar or at the foot of a block, never above the team.

### Map components
- **Terrain:** an SVG sprite (`assets/terrain/terrain.svg`, seed 1874) holding `t-minor` (contour, 0.7px, 42%), `t-index` (contour, 1.25px, 78%), `t-lake` (water-tint/water-light mix with a water stroke) and `t-river` (water, 2px). Variants: `--quiet` (22/40%) for content backgrounds, `--dark` (forest-tint 16/30%) for forest bands. It is always labelled illustrative in the footer.
- **Town pin:** a 9px ink square with a paper border and ink outline, plus a map-lettered name. On hover or focus the square becomes a route diamond and the name turns route. A clip circle (r 190 in the 1600×1000 stage) reveals a contour-ink layer over 700ms (the town lift), and a place card (lift-2, 1.5px neatline, 16/9 frame) opens.
- **Search map pin:** a price tag (Overpass 700 at 0.75rem tabular) on paper with a 1.5px ink border and lift-1, plus a rotated-square pointer. It turns route when hot (hovering the linked row).
- **Sheet index:** towns as a 3×2 index of sheets with a shared neatline. Each cell holds terrain, map-lettered name, mono coordinates and a translucent label foot. Hover scales the terrain 1.06. Life-first matching fills matched cells woodland and dims the rest to 32%.
- **Journey profile:** stages drawn as an elevation profile (woodland ground, forest 2px ground line, dashed ink drops). Stations are 12px circles on a neatline, numbered in mono, and the selected station is route. Below 900px the profile turns vertical.
- **Collar strip:** a paper-deep strip with "Central Massachusetts Sheet" map-lettered, the credit, a 4-segment 120×7px scale bar marked "Schematic · not to scale", and the edition.

### Motion
- **Tokens:** ease-out `cubic-bezier(0.16, 1, 0.3, 1)`, ease-in-out `cubic-bezier(0.65, 0, 0.35, 1)`. Durations: fast 160ms (color), base 320ms (transforms, dialogs), slow 700ms (town lift), draw 1800ms (minor contours; index contours 2200ms after 240ms; water fades in at 900ms).
- **Other motions:** frame reveal 1100ms, rise 14px over 800ms, cross-document view transition 380ms, fav pulse 420ms.
- **Reduced motion:** everything is gated behind `prefers-reduced-motion: no-preference`, and content is visible by default.

## Do's and Don'ts

### Do:
- **Do** put every page's content inside the sheet: a 1.5px ink neatline inset by `--collar`, with the header, footer, credits and legal in the collar.
- **Do** present choices as legend entries (symbol, Besley name, Overpass note) and reuse the `sym()` vocabulary for intents, attributes and filters.
- **Do** letter towns in Besley 600 caps at 0.32em with a paper halo over terrain, and water in Besley italic water blue.
- **Do** spend route red once per view on the primary action, plus on current position. Fill selected filters with forest.
- **Do** label verified data (water source tag, data block) separately from editorial voice (forest source tag, signed Besley prose), and mark every invented item `.synthetic`.
- **Do** set brokerage attribution in Overpass at label or body size, pulled from settings, subordinate to the team name.
- **Do** give every photo slot an art-directed frame with code, aspect ratio, lens and a one-line brief until real photography replaces it.
- **Do** keep body text at ≥4.5:1 (ink, ink-soft, water, contour-ink, route on paper). Use the 2.5px water focus ring with a 3px offset (paper on forest and route), and 44px targets (40px for chips with spacing).

### Don't:
- **Don't** float rounded cards in a uniform grid; group with shared rules and stagger editorial spans.
- **Don't** use contour (#b3754f) or ink-faint (#737b83) for small text.
- **Don't** fill buttons with water blue, or use route red as decoration.
- **Don't** put shadow on anything that sits on the sheet. Lifts are for popovers, dialogs, pins and toasts.
- **Don't** set the brokerage in the serif, larger than the team, or with a logo. Don't present the team as an independent brokerage.
- **Don't** present the terrain as survey data or the schematic town positions as to scale.
- **Don't** add kicker labels above headings, bounce, parallax, scroll hijacking or staggered fade-ins on every section.
- **Don't** use black-and-gold, house-roof, key or handshake imagery, stock families, glassmorphism panels, purple gradients, or Inter/Poppins/Montserrat (brief-pinned refusals).
- **Don't** describe who lives somewhere. Discovery symbols and copy describe housing, lots, distance, transit and places only.
