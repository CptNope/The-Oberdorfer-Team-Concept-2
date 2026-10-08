# The Oberdorfer Team · Concept 2 · The Quadrangle

A brand book and website concept for **The Oberdorfer Team**, a Central Massachusetts real estate team at **REWAP Brokerage LLC**.

The idea is *framing place*. Every page is drawn as a survey sheet of Central Massachusetts, with the same parts:

- a neatline around the ground
- a collar that carries the credits and the brokerage
- a legend that holds the visitor's choices
- adjoining sheets that lead to the neighboring towns

The team itself is part of the product. Every page ends with a named person and a next step.

| | |
|---|---|
| **Concept index** | [`index.html`](index.html) |
| **Brand book** | [`brand/`](brand/) |
| **Website** | [`site/`](site/) |
| **Design spec for builders** | [`DESIGN.md`](DESIGN.md) · tokens: [`assets/css/tokens.css`](assets/css/tokens.css), [`assets/brand/tokens.json`](assets/brand/tokens.json), [`assets/brand/theme.json`](assets/brand/theme.json) |
| **Product record** | [`PRODUCT.md`](PRODUCT.md) |

GitHub Pages: enable Pages on `main` / root. The concept index is at `https://cptnope.github.io/The-Oberdorfer-Team-Concept-2/`.

> **Everything factual here is a labeled sample.** That includes every listing, address, price, market figure, phone number (555-01xx), bio and the example agent "Jane Smith". Photography slots are *art-directed frames*: tinted plates that carry each photograph's code, aspect, lens, a storyboard guide and a one-line brief. Together they are the shot list for a real shoot. The contour terrain is generated (seeded) and illustrative. It is not survey data.

## What's in the concept

**Brand book** (`brand/`, 18 chapters):
- purpose, positioning, audience, personality and values
- voice and tone, with do/don't pairs
- messaging hierarchy (idea → tagline → promise → pillars → action vocabulary)
- logo construction, lockups, misuse and SVG downloads
- brokerage attribution by context
- typography, color with measured contrast, photography with the full shot list
- the cartographic system, layout and grid, live components, motion
- accessibility and fair housing
- design tokens, and the WordPress content model

**Website** (`site/`, 37 pages, generated from `data/*.json`):
- **Home:** the opening sheet has a contour field and six towns. Hovering or focusing a town lifts its hill and previews the place. A legend offers five paths: Buying, Selling, Relocating, Exploring and Advice. Below that come a "personally handled" band, a property story next to search-mode rows, and a life-first town index filtered by neutral housing and location attributes. The buying and selling routes are drawn as elevation profiles, followed by the Field Guide and a contact block that names who replies.
- **Search** (`site/search/`):
  - Search mode: fast rows, filters, sort, and a map that fits itself to the results and can be dragged.
  - Discover mode: editorial frames, with property stories first.
  - Favorites, saved searches, open houses, an empty state, and a mobile map/list toggle.
- **Property pages** (`site/homes/…`):
  - Highlighted homes get a story hero. The editorial text ("In our words", signed) is visibly separated from verified data ("The facts", MLS source, sample tag).
  - Each page also has a gallery with a lightbox, a location sheet and community context.
  - A sticky "Ask about this home / Schedule a showing" card carries the agent's name, followed by related homes and the disclosures.
- **Town sheets** (`site/communities/…`): Worcester, Shrewsbury, Grafton, Holden, Auburn and Millbury. Each has:
  - neighboring towns lettered at the N/E/S/W edges as navigation
  - housing character, places and getting around
  - homes, plus market context labeled as illustrative
  - guides and a town-specific contact form
- **Team** (`site/agents/`): a directory plus one profile per agent, built from a single data entry each. Profiles cover areas, specialties, credentials, listings, writing and attribution.
- **Buying and Selling** (`site/buying/`, `site/selling/`): the routes stop by stop, plus a pricing-conversation request (not an instant estimate).
- **Also:** Relocating, the Field Guide (6 articles), Contact, Saved, Accessibility and Privacy pages.

**Lead routing:** every form captures intent, agent, listing, community, source page and first-touch UTM. On submit, the demo shows the exact payload the live site would send to the **Follow Up Boss** Events API: person, type, property, campaign and a routing block. Nothing is actually sent.

**Structured data:**
- The team appears as a `RealEstateAgent` with `parentOrganization` REWAP Brokerage.
- Each agent is a `Person` that is `memberOf` the team and `worksFor` the brokerage.
- Listings are `RealEstateListing`, towns are `City`, and guides are `Article`. Every page also has breadcrumbs.

## Portability (brokerage-independent)

All brokerage wording lives in **`data/settings.json`**: header line, footer, agent, property, listing courtesy, contact, disclosure, IDX disclaimer and fair-housing text. In WordPress this becomes one options page. If the affiliation ever changes, you edit settings, not templates.

The site's search, map, filters, saved listings and lead routing take normalized listing JSON. The IDX vendor is an adapter, not the foundation.

## Production mapping (WordPress FSE)

| Concept | WordPress |
|---|---|
| `data/agents.json` | CPT `agent` → `/agents/{slug}/`, relations to `community`, author of posts |
| `data/communities.json` | CPT `community` + neutral `attribute` taxonomy, sheet position meta |
| `data/listings.json` | IDX normalized records; optional team-written Story (meta) |
| `data/guides.json` | Posts + `category`; author → agent |
| market figures | CPT `market_update` (source + date required) |
| `data/settings.json` | Options page: brokerage and compliance |
| `assets/brand/theme.json` | theme.json palette, fonts, spacing presets |
| `tools/lib.mjs` templates | block templates and patterns (frame, legend, data block, person line, journey profile) |

## Build

The HTML is generated; the output is committed, so Pages needs no build.

```bash
cd tools
npm install
node terrain.mjs   # contour terrain (seed 1874) → assets/terrain/
node logo.mjs      # outlined logo SVGs → assets/brand/
node colors.mjs    # palette hex + contrast → data/palette.json
node build.mjs     # site/**
node brand.mjs     # brand/, index.html, tokens.json, theme.json
```

Fonts are self-hosted from Fontsource: Besley (SIL OFL), Overpass and Overpass Mono (SIL OFL).

## Accessibility and fairness

The concept targets WCAG 2.2 AA:
- keyboard paths through journeys, filters, galleries and dialogs (native `<dialog>`)
- visible focus
- 44px targets
- reduced-motion support
- live regions for results and form status
- every photo slot announced with its brief

Discovery uses housing and location attributes only. No demographic descriptions anywhere.

---

To approve before launch:
- the copy and bios, written as drafts in each person's voice
- Kait's role and licensing
- the tagline proposal ("Let's find your place.")
- compliance wording
- domain
- IDX vendor
- photography shoot
