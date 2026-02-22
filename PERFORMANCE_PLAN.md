# Performance Optimization Plan: Situation Monitor

## Context

The app takes 4-5 minutes to load, sometimes freezes tabs, and needs multiple refreshes to work. Root causes:

1. **~142 concurrent HTTP requests per refresh** — 99 RSS feeds + 22 Finnhub + GDELT + CoinGecko + Polymarket, all from the browser through a single Cloudflare Worker CORS proxy
2. **No persistent cache** — memory cache (100 entries) lost on reload; localStorage has 5-10MB quota issues
3. **ServiceClient is completely bypassed** — the API layer uses raw `fetch()`, ignoring the built-in caching, circuit breaking, and deduplication
4. **30s per-feed timeout** — a single dead feed delays its entire category
5. **22 Finnhub requests fire simultaneously** against a 60 calls/min free tier
6. **No incremental refresh** — every refresh re-fetches the full 7-day window

**Solution:** Move all data fetching to the server side with SQLite caching. The server fetches RSS feeds directly (no CORS proxy needed), caches results in SQLite, and serves pre-aggregated data to the browser instantly. A background worker refreshes feeds on a configurable schedule.

**Deployment:** Raspberry Pi (production), MacBook (development). Both support `better-sqlite3` and the Node adapter.

---

## Phase 1: Switch to Node Adapter + SQLite Foundation

**Goal:** Set up server-side infrastructure: Node adapter, SQLite database, and basic API routes.

### 1.1 Install dependencies
```
npm install @sveltejs/adapter-node better-sqlite3
npm install -D @types/better-sqlite3
npm uninstall @sveltejs/adapter-static
```
- `better-sqlite3`: Synchronous SQLite driver. Fast, cross-platform (macOS + ARM Linux/Pi). ~2MB.
- `@sveltejs/adapter-node`: SvelteKit Node.js server adapter.

### 1.2 Switch adapter
**Modify: `svelte.config.js`**
- Replace `adapter-static` import with `adapter-node`
- Change adapter config:
```js
adapter: adapter({
  out: 'build',
  precompress: false
})
```

**Modify: `src/routes/+layout.ts`**
- Remove `export const prerender = true;` (can't prerender with dynamic server routes)
- Keep `export const ssr = false;` (client-side rendering for now; the SPA behavior stays the same)

### 1.3 Create SQLite database layer
**New file: `src/lib/server/db.ts`**
- Initialize SQLite database at `data/situation-monitor.db` (relative to project root)
- Auto-create directory if it doesn't exist
- Schema:
```sql
CREATE TABLE IF NOT EXISTS news (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  link TEXT NOT NULL,
  pub_date TEXT,
  timestamp INTEGER NOT NULL,
  description TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL,
  is_alert INTEGER DEFAULT 0,
  alert_keyword TEXT,
  region TEXT,
  topics TEXT,  -- JSON array
  created_at INTEGER DEFAULT (unixepoch() * 1000)
);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_timestamp ON news(timestamp);
CREATE INDEX IF NOT EXISTS idx_news_category_timestamp ON news(category, timestamp DESC);

CREATE TABLE IF NOT EXISTS markets (
  key TEXT PRIMARY KEY,          -- 'indices', 'sectors', 'commodities', 'crypto'
  data TEXT NOT NULL,            -- JSON blob
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,          -- 'checkpoint:politics', 'feedHealth:BBC_World', etc.
  value TEXT NOT NULL,           -- JSON blob
  updated_at INTEGER NOT NULL
);
```
- Export `getDb()` singleton function
- Add `deleteOldNews(maxAgeDays: number)` — deletes items where `timestamp < now - maxAgeDays * 86400000`
- Add `.gitignore` entry for `data/` directory

### 1.4 Create server-side data fetching module
**New file: `src/lib/server/fetcher.ts`**
- Move the core fetching logic from `src/lib/api/news.ts` to the server:
  - `fetchRssFeedServer(url, sourceName, category, timeoutMs)` — fetches RSS directly via `fetch()` (no CORS proxy needed on server!)
  - `fetchGdeltNewsServer(category, timespanMinutes)` — fetches GDELT with configurable timespan
  - `fetchCategoryNewsServer(category)` — orchestrates RSS + GDELT for a category
  - `fetchAllMarketsServer()` — fetches Finnhub (staggered, 100ms between) + CoinGecko
- Reuse existing parsing logic: `parseRssFeed()`, `transformGdeltArticle()`, `parseGdeltDate()`, `hashCode()`, `classifyRegionalItem()` — these are pure functions that work on both client and server
- Extract shared pure functions into `src/lib/shared/news-parser.ts` (imported by both server and client code)
- **Per-feed timeout: 8s** (down from 30s)
- **Concurrency: 5 feeds per category** (down from all-at-once)
- **Finnhub stagger: 100ms between requests** (stays under 60/min limit)
- **Finnhub timeout: 10s** per request

### 1.5 Create API routes
**New file: `src/routes/api/news/[category]/+server.ts`**
- `GET /api/news/:category` — returns news items from SQLite for the given category
- Query params: `since` (optional timestamp, for incremental fetch)
- If `since` provided: return only items with `timestamp > since`
- If no data in SQLite: trigger a server-side fetch for that category, store results, return them
- Response: `{ items: NewsItem[], checkpoint: number }`

**New file: `src/routes/api/news/+server.ts`**
- `GET /api/news?categories=politics,tech,finance` — batch endpoint for multiple categories
- Returns `{ categories: Record<category, NewsItem[]>, checkpoints: Record<category, number> }`

**New file: `src/routes/api/markets/+server.ts`**
- `GET /api/markets` — returns cached market data from SQLite
- If stale (> 1 min): trigger server-side fetch, update SQLite, return fresh data
- Response: `{ indices, sectors, commodities, crypto, updatedAt }`

**New file: `src/routes/api/refresh/+server.ts`**
- `POST /api/refresh` — triggers a full server-side refresh
- Optional body: `{ categories?: string[] }` to refresh specific categories
- Returns: `{ success: boolean, duration: number, errors: string[] }`

**New file: `src/routes/api/health/+server.ts`**
- `GET /api/health` — returns feed health stats, DB size, last refresh time

### 1.6 Server hooks for background worker
**New file: `src/hooks.server.ts`**
- On server startup: start a background refresh interval
- Default interval: 15 minutes (configurable via env `REFRESH_INTERVAL_MS`)
- Each tick: fetch all categories sequentially (not parallel, to be gentle on the Pi)
- Clean up old news items (> 7 days) after each refresh cycle
- On server shutdown: clear the interval

---

## Phase 2: Client-Side Simplification

**Goal:** Replace client-side direct-fetch logic with simple calls to the local server API.

### 2.1 Rewrite client API layer
**Modify: `src/lib/api/news.ts`**
- Replace `fetchRssFeed()`, `fetchGdeltNews()`, `fetchCategoryNews()`, `fetchRssNews()`, `fetchEdgeNewsSnapshot()`, and `refreshAllNewsProgressive()` with:
```typescript
export async function fetchCategoryFromServer(
  category: NewsCategory,
  since?: number
): Promise<{ items: NewsItem[]; checkpoint: number }> {
  const url = since
    ? `/api/news/${category}?since=${since}`
    : `/api/news/${category}`;
  const res = await fetch(url);
  return res.json();
}

export async function fetchAllNewsFromServer(
  categories: NewsCategory[],
  sinceByCategory?: Record<string, number>
): Promise<Record<NewsCategory, NewsItem[]>> {
  const params = new URLSearchParams();
  params.set('categories', categories.join(','));
  if (sinceByCategory) params.set('since', JSON.stringify(sinceByCategory));
  const res = await fetch(`/api/news?${params}`);
  return res.json();
}
```
- Keep the existing function signatures as wrappers for backward compatibility, but internally call the server API
- Remove all `fetchWithProxy()` usage from client-side news code
- Remove CORS proxy imports

**Modify: `src/lib/api/markets.ts`**
- Replace `fetchAllMarkets()` internals with:
```typescript
export async function fetchAllMarkets(): Promise<AllMarketsData> {
  const res = await fetch('/api/markets');
  return res.json();
}
```
- Remove all Finnhub direct calls from client
- Finnhub API key no longer exposed to browser (security win)

### 2.2 Simplify page load
**Modify: `src/routes/+page.svelte`** (lines 220-247)
```
1. Load visible tab categories from server API (instant if server cache is warm)
2. Load markets from server API
3. Run alert detection
4. Defer remaining categories to background
```
- The server API returns cached data from SQLite, so response is near-instant
- No more 30s feed timeouts blocking the UI
- No more CORS proxy round-trips

### 2.3 Incremental refresh via checkpoints
**Modify: `src/routes/+page.svelte`**
- Store per-category checkpoints in component state (from server response)
- On `handleRefresh()`: pass `since` timestamps to server API
- Server only returns items newer than the checkpoint
- Merge with existing store items using existing `mergeNewsItems()` logic

### 2.4 Store checkpoint in localStorage for cross-session persistence
- On each successful news load, save `{ [category]: checkpoint }` to localStorage
- On page load, read checkpoints from localStorage and pass as `since` to server API
- Server returns only new items since last visit → fast delta loads

---

## Phase 3: Request Optimization on Server

**Goal:** Make the server-side fetching robust and efficient.

### 3.1 Circuit breaker for feeds
**New file: `src/lib/server/circuit-breaker.ts`** (server-side version)
- Reuse the existing `CircuitBreaker` pattern from `src/lib/services/circuit-breaker.ts`
- Or directly import it if it has no browser dependencies (it uses no browser APIs — verify)
- Config per feed: threshold 2 failures, reset timeout 5 minutes
- Feeds that consistently fail get automatically skipped

### 3.2 Feed concurrency pool
**In: `src/lib/server/fetcher.ts`**
- `promisePool<T>(tasks, concurrency)` utility — limits concurrent feeds to 5 per category
- Between category batches: 500ms delay (reuse existing `API_DELAYS.betweenCategories`)

### 3.3 GDELT delta queries
**In: `src/lib/server/fetcher.ts`**
- Read per-category checkpoint from SQLite `meta` table
- Compute `timespan` as `max(15min, timeSinceCheckpoint)` instead of always `7d`
- First fetch uses `7d`; subsequent refreshes use delta window

### 3.4 Finnhub rate limiting
**In: `src/lib/server/fetcher.ts`**
- Sequential fetching with 100ms stagger between Finnhub API calls
- 10s timeout per request via `AbortController`
- Circuit breaker for Finnhub (threshold 3, reset 60s)

### 3.5 Feed health tracking
**In: `src/lib/server/fetcher.ts`** + SQLite `meta` table
- Record per-feed: lastAttempt, lastSuccess, consecutiveFailures, avgResponseTimeMs, lastError
- Store as JSON in `meta` table with key `feedHealth:{category}:{sourceName}`
- Auto-skip feeds with 5+ consecutive failures (retry after 1 hour)
- Exposed via `GET /api/health`

---

## Phase 4: Lazy Tab Loading with Skeleton UI

**Goal:** Only request data for the active tab; fetch other tabs on-demand.

### 4.1 Tab-aware loading
**Modify: `src/routes/+page.svelte`**
- On initial load: fetch only visible tab categories + markets
- Defer remaining categories to 5s after visible tab loads (or on tab switch)
- Since server responses are fast (SQLite reads), this is more about avoiding UI churn

### 4.2 On-tab-switch loading
**Modify: `src/routes/+page.svelte`**
- Add `$effect` watching `$activeTab`
- When switching to a tab with no loaded data → fetch from server API
- Server responds instantly (SQLite cache), so no visible delay

### 4.3 Skeleton loading component
**New file: `src/lib/components/common/PanelSkeleton.svelte`**
- Animated skeleton placeholder matching NewsPanel layout
- Tailwind-based pulse animation
- Shows while a tab's data is being fetched

**Modify: `src/lib/components/panels/NewsPanel.svelte`**
- When `loading && items.length === 0` → show PanelSkeleton
- When `loading && items.length > 0` → show existing items with subtle refresh indicator

---

## Phase 5: Feed Health Diagnostics UI

**Goal:** Identify dead/slow feeds from the browser.

### 5.1 Diagnostics panel
**New file: `src/lib/components/modals/FeedDiagnostics.svelte`**
- Fetches data from `GET /api/health`
- Table: feed name, category, status (green/yellow/red), avg response time, success rate, consecutive failures, last error
- "Test Feed" button: calls `POST /api/refresh` with a single category
- "Disable Feed" toggle: wired to sources store

**Modify: `src/lib/components/modals/SettingsModal.svelte`**
- Add "Feed Health" tab that renders FeedDiagnostics

---

## Shared Code Extraction

To reuse parsing logic between server and client without duplication:

**New file: `src/lib/shared/news-parser.ts`**
Move from `src/lib/api/news.ts`:
- `hashCode()`
- `parseRssFeed()`
- `parseGdeltDate()`
- `transformGdeltArticle()`
- `filterByAge()`
- `mergeNewsItems()`
- `GDELT_QUERIES`

These are pure functions with no browser/server-specific dependencies. Both `src/lib/server/fetcher.ts` and `src/lib/api/news.ts` import from here.

**Note:** `classifyRegionalItem`, `containsAlertKeyword`, `detectRegion`, `detectTopics` are in `src/lib/config/keywords.ts` and `src/lib/utils/regional-filter.ts` — verify they have no browser deps. If clean, import directly from server code.

---

## Files Summary

| File | Action | Phase |
|---|---|---|
| `svelte.config.js` | MODIFY (adapter-static → adapter-node) | 1 |
| `src/routes/+layout.ts` | MODIFY (remove prerender) | 1 |
| `package.json` | MODIFY (swap adapter, add better-sqlite3) | 1 |
| `.gitignore` | MODIFY (add `data/`) | 1 |
| `src/lib/server/db.ts` | CREATE | 1 |
| `src/lib/server/fetcher.ts` | CREATE | 1, 3 |
| `src/lib/server/circuit-breaker.ts` | CREATE (or reuse existing) | 3 |
| `src/lib/shared/news-parser.ts` | CREATE (extract from news.ts) | 1 |
| `src/routes/api/news/[category]/+server.ts` | CREATE | 1 |
| `src/routes/api/news/+server.ts` | CREATE | 1 |
| `src/routes/api/markets/+server.ts` | CREATE | 1 |
| `src/routes/api/refresh/+server.ts` | CREATE | 1 |
| `src/routes/api/health/+server.ts` | CREATE | 3, 5 |
| `src/hooks.server.ts` | CREATE | 1 |
| `src/lib/api/news.ts` | MODIFY (call server API instead of direct fetch) | 2 |
| `src/lib/api/markets.ts` | MODIFY (call server API) | 2 |
| `src/routes/+page.svelte` | MODIFY (simplified loading) | 2, 4 |
| `src/lib/components/common/PanelSkeleton.svelte` | CREATE | 4 |
| `src/lib/components/panels/NewsPanel.svelte` | MODIFY | 4 |
| `src/lib/components/modals/FeedDiagnostics.svelte` | CREATE | 5 |
| `src/lib/components/modals/SettingsModal.svelte` | MODIFY | 5 |

## Expected Performance Summary

| Metric | Current | After Phase 1+2 | After All Phases |
|---|---|---|---|
| Page load (warm cache) | 4-5 min | < 1s | < 1s |
| Page load (cold, server cache warm) | 4-5 min | 1-3s | 1-3s |
| Page load (cold, first ever) | 4-5 min | 30-60s (server fetches) | 30-60s |
| Background refresh (server) | N/A | 30-60s (sequential) | 15-30s |
| Browser HTTP requests | ~142 | ~5 (to local server) | ~3 (visible tab only) |
| CORS proxy requests | ~120 | 0 | 0 |
| Tab-freeze risk | High | None | None |
| Finnhub rate limit risk | High | None (server-side stagger) | None |

## Verification

After each phase:
1. `npm run check` — TypeScript passes
2. `npm run test:unit` — existing unit tests pass
3. `npm run build` — production build succeeds (now outputs Node server)
4. `npm run dev` — manual testing on MacBook:
   - Load app → first content in < 3s (if server has cached data)
   - Check Network tab → only `/api/*` requests, no CORS proxy calls
   - Trigger refresh → server fetches feeds, browser gets results
   - Switch tabs → instant (server cache)
   - `sqlite3 data/situation-monitor.db "SELECT COUNT(*) FROM news"` → verify data stored
5. `npm run test:e2e` — E2E tests pass
6. Deploy to Pi → verify same behavior

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REFRESH_INTERVAL_MS` | `900000` (15 min) | Background refresh interval |
| `VITE_FINNHUB_API_KEY` | (required) | Finnhub API key (now server-side only) |
| `VITE_FRED_API_KEY` | (optional) | FRED API key |
| `DB_PATH` | `data/situation-monitor.db` | SQLite database path |
| `PORT` | `3000` | Server port |

---

## Raspberry Pi Deployment Instructions

After pushing changes from your MacBook to the Pi, follow these steps:

### Prerequisites (one-time setup)

```bash
# Ensure Node.js 18+ is installed on the Pi
node --version  # Should be >= 18

# Install build tools for better-sqlite3 native compilation
sudo apt-get update
sudo apt-get install -y build-essential python3
```

### After each `git pull`

```bash
# 1. Pull latest changes
cd /path/to/situation-monitor
git pull

# 2. Install dependencies (better-sqlite3 compiles native bindings for ARM)
npm install

# 3. Build the SvelteKit app (outputs Node server to build/)
npm run build

# 4. Create data directory for SQLite (if it doesn't exist)
mkdir -p data
```

### Running the server

```bash
# Option A: Direct run (for testing)
PORT=3000 VITE_FINNHUB_API_KEY=your_key_here node build

# Option B: With environment file
# Create .env file in project root:
cat > .env << 'EOF'
PORT=3000
VITE_FINNHUB_API_KEY=your_finnhub_key
VITE_FRED_API_KEY=your_fred_key
REFRESH_INTERVAL_MS=900000
DB_PATH=data/situation-monitor.db
EOF

# Then run:
node build
```

### Running as a service (recommended for production)

```bash
# Create a systemd service file
sudo tee /etc/systemd/system/situation-monitor.service > /dev/null << 'EOF'
[Unit]
Description=Situation Monitor
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/path/to/situation-monitor
ExecStart=/usr/bin/node build
Restart=on-failure
RestartSec=10
Environment=PORT=3000
Environment=VITE_FINNHUB_API_KEY=your_finnhub_key
Environment=VITE_FRED_API_KEY=your_fred_key
Environment=REFRESH_INTERVAL_MS=900000
Environment=DB_PATH=data/situation-monitor.db
# Or use EnvironmentFile instead:
# EnvironmentFile=/path/to/situation-monitor/.env

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable situation-monitor
sudo systemctl start situation-monitor

# Check status
sudo systemctl status situation-monitor

# View logs
journalctl -u situation-monitor -f
```

### Updating the Pi after code changes

```bash
# Pull, install, build, restart
cd /path/to/situation-monitor
git pull
npm install
npm run build
sudo systemctl restart situation-monitor
```

### Nginx reverse proxy (optional, if you want HTTPS or custom domain)

```nginx
server {
    listen 80;
    server_name situationmonitor.local;  # or your domain

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Verifying the deployment

```bash
# Check the server is running
curl http://localhost:3000/api/health

# Check the SQLite database
sqlite3 data/situation-monitor.db "SELECT category, COUNT(*) FROM news GROUP BY category;"

# Check background refresh is working (wait 15 min, then)
sqlite3 data/situation-monitor.db "SELECT key, updated_at FROM meta WHERE key LIKE 'checkpoint:%';"

# Monitor feed health
curl http://localhost:3000/api/health | python3 -m json.tool
```

### Troubleshooting

| Issue | Fix |
|---|---|
| `better-sqlite3` fails to install | `sudo apt-get install build-essential python3` then `npm rebuild better-sqlite3` |
| Permission denied on `data/` | `chmod 755 data/` and ensure the service user owns it |
| Port already in use | `lsof -i :3000` to find the process, or change `PORT` env var |
| Out of memory on Pi | Set `NODE_OPTIONS=--max-old-space-size=256` in the service env |
| Database locked errors | Only one process should access the DB; check for stale processes |
