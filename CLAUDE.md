# Overview

## Build & Development Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build to /build directory
npm run preview      # Preview production build (localhost:4173)
npm run check        # TypeScript type checking
npm run check:watch  # Type checking in watch mode
npm run test         # Run Vitest in watch mode
npm run test:unit    # Run unit tests once
npm run test:e2e     # Run Playwright E2E tests (requires preview server)
npm run lint         # ESLint + Prettier check
npm run format       # Auto-format with Prettier
```

## Technology Stack

- **SvelteKit 2.0** with Svelte 5 reactivity (`$state`, `$derived`, `$effect` runes)
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** with custom dark theme
- **Vitest** (unit) + **Playwright** (E2E) for testing
- **Static adapter** - deploys as pure static site to GitHub Pages

## Project Architecture

### Core Directories (`src/lib/`)

- **`analysis/`** - Pattern correlation, narrative tracking, main character detection across news items
- **`api/`** - Data fetching from GDELT, RSS feeds (30+ sources), market APIs, CoinGecko
- **`components/`** - Svelte components organized into layout/, panels/, modals/, common/
- **`config/`** - Centralized configuration for feeds, keywords, analysis patterns, panels, map hotspots
- **`services/`** - Resilience layer: CacheManager, CircuitBreaker, RequestDeduplicator, ServiceClient
- **`stores/`** - Svelte stores for settings, news, markets, monitors, refresh orchestration
- **`types/`** - TypeScript interfaces

### Path Aliases

```typescript
$lib        → src/lib
$components → src/lib/components
$stores     → src/lib/stores
$services   → src/lib/services
$config     → src/lib/config
$types      → src/lib/types
```

## Key Architectural Patterns

### Service Layer (`src/lib/services/`)

All HTTP requests go through `ServiceClient` which integrates:

- **CacheManager**: Per-service caching with TTL
- **CircuitBreaker**: Prevents cascading failures
- **RequestDeduplicator**: Prevents concurrent duplicate requests

### Multi-Stage Refresh (`src/lib/stores/refresh.ts`)

Data fetches happen in 3 stages with staggered delays:

1. Critical (0ms): News, markets, alerts
2. Secondary (2s): Crypto, commodities, intel
3. Tertiary (4s): Contracts, whales, layoffs, polymarket

### Analysis Engine (`src/lib/analysis/`)

Unique business logic for intelligence analysis:

- Correlation detection across disparate news items
- Narrative tracking (fringe → mainstream progression)
- Entity prominence calculation ("main character" analysis)
- All use configurable regex patterns from `src/lib/config/analysis.ts`

**Compound signals** are predefined in `src/lib/config/analysis.ts` and evaluated by the logic in `src/lib/analysis/correlation.ts`.

### Configuration-Driven Design (`src/lib/config/`)

- `feeds.ts`: 30+ RSS sources across 6 categories (politics, tech, finance, gov, ai, intel)
- `keywords.ts`: Alert keywords, region detection, topic detection
- `analysis.ts`: Correlation topics and narrative patterns with severity levels

#### Analysis Coverage (as of 2026-02-13)

| Category | Count |
|---|---|
| Correlation Topics | 42 |
| Compound Signals | 36 |
| Fringe Narratives | 30 |
| Mainstream Narratives | 61 |
| **Total** | **169** |
- `panels.ts`: Panel registry with display order
- `map.ts`: Geopolitical hotspots, conflict zones, strategic locations

## Testing

**Unit tests**: Located alongside source as `*.test.ts` or `*.spec.ts`
**E2E tests**: In `tests/e2e/*.spec.ts`, run against preview server

## External Dependencies

- **D3.js** for interactive map visualization
- **CORS proxy** (Cloudflare Worker) for RSS feed parsing
- **CoinGecko API** for cryptocurrency data

## Cloudflare Worker (`workers/cors-proxy.js`)

Deployed at: `https://situation-monitor-proxy.projetip.workers.dev`

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/?url=<encoded>` | CORS proxy for RSS/external feeds |
| POST | `/news/refresh` | Trigger cached news refresh in KV |
| POST | `/ai/brief` | Generate LLM brief via Groq (body: `{ headlines: string[] }`) |
| POST | `/stability/snapshot` | Fetch country stability scores from GDELT |

### Deploy & Secrets (run from repo root)

```bash
wrangler deploy workers/cors-proxy.js        # redeploy after changes
wrangler secret put GROQ_API_KEY             # set/rotate Groq API key
wrangler secret list                         # verify secrets are present
```

Get a Groq API key at: https://console.groq.com
Model in use: `llama-3.3-70b-versatile`

### Verify Worker Endpoints

```bash
# AI Brief (sends headlines; worker uses them directly)
curl https://situation-monitor-proxy.projetip.workers.dev/ai/brief \
  -X POST -H "Content-Type: application/json" \
  -d '{"headlines":["Test headline one","Test headline two"]}'

# Country Stability (no body required)
curl https://situation-monitor-proxy.projetip.workers.dev/stability/snapshot -X POST
```

### KV Namespace

The worker uses a KV namespace (`SITUATION_STORE`) for caching:
- `ai:brief` — cached AI brief (6-hour TTL, regenerated when headlines are sent)
- `stability:snapshot` — cached stability scores (1-hour TTL)
- `news:<category>` — cached RSS news per category

## TODO

- Improve map interface. use glint as inspiration (1-2)
- check out world monitor for ideas (1-2)
- alerts for economic indicators (2-3)
- make a cool loading screen (2-3)
- create rss feeds from social media (1)

## Frontend / Dashboard

After implementing UI components in Svelte 5, verify correct rune syntax ($state, $derived, etc.) and check that tooltips/overlays aren't clipped by parent overflow:hidden.

## API Integration

When integrating with external APIs (Polymarket, Cloudflare, etc.), always check for CORS restrictions first and verify field names from actual API responses before implementing — don't assume field names from documentation.

## General Guidance

- Always ask before deleting content.
- Do not commit changes yourself. Instead, remind the user to commit when a task is complete.
