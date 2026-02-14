# Analysis Engine Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Triple the analysis engine's coverage by adding 21 correlation topics, 20 compound signals, 15 fringe narratives, and 29 mainstream narratives to `src/lib/config/analysis.ts`.

**Architecture:** Config-only expansion — no logic changes. All new entries follow existing interfaces (`CorrelationTopic`, `CompoundPattern`, `NarrativePattern`, `MainstreamNarrativePattern`). The engines in `correlation.ts` and `narrative.ts` consume these arrays generically.

**Tech Stack:** TypeScript, Vitest

**Design doc:** `docs/plans/2026-02-13-analysis-expansion-design.md`

---

### Task 1: Verify baseline tests pass

**Files:**
- Read: `src/lib/analysis/correlation.test.ts`
- Read: `src/lib/analysis/narrative.test.ts`

**Step 1: Run existing tests**

Run: `npm run test:unit`
Expected: 147 tests pass, 12 files pass

**Step 2: Commit baseline (skip if clean)**

No changes yet — just verifying.

---

### Task 2: Write tests for new correlation topics

**Files:**
- Modify: `src/lib/analysis/correlation.test.ts`
- Read: `src/lib/config/analysis.ts`

**Step 1: Write failing tests for new topics**

Add this test block after the existing `describe('Compound Pattern Detection')` block in `correlation.test.ts`:

```typescript
describe('New Correlation Topics Coverage', () => {
	it('should detect cyberattack topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Major ransomware attack hits hospitals' }),
			createCorrelationNewsItem({ title: 'Data breach exposes millions' }),
			createCorrelationNewsItem({ title: 'Zero-day exploit discovered in router firmware' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'cyberattack');
		expect(pattern).toBeDefined();
		expect(pattern!.count).toBeGreaterThanOrEqual(3);
	});

	it('should detect sanctions topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'New sanctions imposed on Russian oligarchs' }),
			createCorrelationNewsItem({ title: 'Export control restrictions tighten on chip exports' }),
			createCorrelationNewsItem({ title: 'SWIFT ban extended to more banks' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'sanctions');
		expect(pattern).toBeDefined();
	});

	it('should detect food-security topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Food crisis worsens in East Africa' }),
			createCorrelationNewsItem({ title: 'Grain export ban causes price spike' }),
			createCorrelationNewsItem({ title: 'Famine warnings issued by UN' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'food-security');
		expect(pattern).toBeDefined();
	});

	it('should detect sovereign-debt topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Debt ceiling negotiations stall in Congress' }),
			createCorrelationNewsItem({ title: 'National debt reaches new milestone' }),
			createCorrelationNewsItem({ title: 'Bond yield spikes on fiscal deficit concerns' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'sovereign-debt');
		expect(pattern).toBeDefined();
	});

	it('should detect civil-unrest topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Massive protests erupt in capital' }),
			createCorrelationNewsItem({ title: 'Riot police deployed after demonstrations' }),
			createCorrelationNewsItem({ title: 'Civil unrest spreads to neighboring cities' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'civil-unrest');
		expect(pattern).toBeDefined();
	});

	it('should detect extreme-weather topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Record temperature breaks all-time high' }),
			createCorrelationNewsItem({ title: 'Devastating typhoon makes landfall' }),
			createCorrelationNewsItem({ title: 'Extreme weather batters coastal regions' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'extreme-weather');
		expect(pattern).toBeDefined();
	});

	it('should detect arms-race topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Major arms deal signed between allies' }),
			createCorrelationNewsItem({ title: 'Defense spending surges across NATO' }),
			createCorrelationNewsItem({ title: 'Military buildup accelerates near border' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'arms-race');
		expect(pattern).toBeDefined();
	});

	it('should detect energy-transition topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Renewable energy investment hits record' }),
			createCorrelationNewsItem({ title: 'Solar power capacity doubles in Asia' }),
			createCorrelationNewsItem({ title: 'Clean energy transition accelerates globally' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'energy-transition');
		expect(pattern).toBeDefined();
	});

	it('should detect rare-earths topic', () => {
		const news: NewsItem[] = [
			createCorrelationNewsItem({ title: 'Rare earth export restrictions spark concern' }),
			createCorrelationNewsItem({ title: 'Lithium shortage threatens EV production' }),
			createCorrelationNewsItem({ title: 'Critical mineral supply chain under pressure' })
		];
		const results = analyzeCorrelations(news);
		const pattern = results?.emergingPatterns.find((p) => p.id === 'rare-earths');
		expect(pattern).toBeDefined();
	});
});
```

Also add a helper function near the top of the file (after imports):

```typescript
function createCorrelationNewsItem(overrides: Partial<NewsItem> = {}): NewsItem {
	return {
		id: `news-${Math.random()}`,
		title: 'Test headline',
		link: 'https://example.com/news',
		timestamp: Date.now(),
		source: 'Reuters',
		category: 'politics',
		...overrides
	};
}
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:unit -- --reporter=verbose 2>&1 | grep -E "(FAIL|PASS|✓|✗|×)" | head -20`
Expected: New tests FAIL (topics don't exist yet)

---

### Task 3: Add new correlation topics to config

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 21 new topics to CORRELATION_TOPICS array**

Add the following entries after the existing `deepfake` topic (line ~312) in the `CORRELATION_TOPICS` array:

```typescript
	// === NEW DOMAINS ===

	// Cyber & InfoSec
	{
		id: 'cyberattack',
		patterns: [/cyberattack/i, /cyber attack/i, /data breach/i, /ransomware/i, /hacking/i, /zero.day/i],
		category: 'Security'
	},
	{
		id: 'state-hacking',
		patterns: [/state.sponsored/i, /\bapt\b/i, /cyber espionage/i, /cyber warfare/i],
		category: 'Security'
	},

	// Space & Satellites
	{
		id: 'space-military',
		patterns: [/space force/i, /satellite weapon/i, /anti.satellite/i, /space militariz/i, /orbital weapon/i],
		category: 'Security'
	},
	{
		id: 'space-race',
		patterns: [/space launch/i, /spacex/i, /moon mission/i, /mars mission/i, /space station/i],
		category: 'Tech'
	},

	// Energy & Resources
	{
		id: 'energy-transition',
		patterns: [/renewable energy/i, /\bsolar\b.*power/i, /wind power/i, /green energy/i, /clean energy/i, /energy transition/i],
		category: 'Environment'
	},
	{
		id: 'rare-earths',
		patterns: [/rare earth/i, /lithium/i, /cobalt/i, /critical mineral/i, /semiconductor supply/i],
		category: 'Economy'
	},
	{
		id: 'oil-opec',
		patterns: [/\bopec\b/i, /oil price/i, /oil production/i, /crude oil/i, /petroleum/i, /oil cut/i],
		category: 'Economy'
	},

	// Sanctions & Economic Warfare
	{
		id: 'sanctions',
		patterns: [/\bsanction/i, /swift ban/i, /asset freeze/i, /export control/i, /trade restriction/i, /\bembargo\b/i],
		category: 'Geopolitics'
	},
	{
		id: 'trade-blocs',
		patterns: [/\bbrics\b/i, /g7 summit/i, /\bg20\b/i, /trade agreement/i, /trade bloc/i, /economic alliance/i],
		category: 'Geopolitics'
	},

	// Food & Agriculture
	{
		id: 'food-security',
		patterns: [/food crisis/i, /crop failure/i, /grain export/i, /food price/i, /\bfamine\b/i, /food shortage/i],
		category: 'Economy'
	},
	{
		id: 'agriculture',
		patterns: [/fertilizer/i, /\bdrought\b/i, /\bharvest\b/i, /agriculture/i, /farming crisis/i],
		category: 'Environment'
	},

	// Debt & Fiscal
	{
		id: 'sovereign-debt',
		patterns: [/national debt/i, /debt ceiling/i, /fiscal deficit/i, /credit rating/i, /bond yield/i, /\btreasury\b/i],
		category: 'Economy'
	},
	{
		id: 'credit-stress',
		patterns: [/credit crunch/i, /default risk/i, /junk bond/i, /high yield/i, /credit spread/i],
		category: 'Finance'
	},

	// Social Unrest
	{
		id: 'civil-unrest',
		patterns: [/\bprotest/i, /\briot/i, /civil unrest/i, /demonstration/i, /\bstrike\b/i, /\buprising\b/i],
		category: 'Politics'
	},
	{
		id: 'political-violence',
		patterns: [/assassination/i, /political violence/i, /insurrection/i, /\bcoup\b/i, /\bextremism\b/i, /domestic terror/i],
		category: 'Security'
	},

	// Biotech & Health
	{
		id: 'biotech',
		patterns: [/gene therapy/i, /\bcrispr\b/i, /biotech breakthrough/i, /drug approval/i, /fda approval/i],
		category: 'Health'
	},
	{
		id: 'antimicrobial',
		patterns: [/antibiotic resistance/i, /superbug/i, /antimicrobial/i, /drug.resistant/i],
		category: 'Health'
	},

	// Migration & Demographics
	{
		id: 'refugee-crisis',
		patterns: [/\brefugee/i, /\bdisplaced\b/i, /humanitarian crisis/i, /refugee camp/i, /migration crisis/i],
		category: 'Politics'
	},
	{
		id: 'demographics',
		patterns: [/aging population/i, /birth rate/i, /fertility rate/i, /population decline/i, /brain drain/i],
		category: 'Economy'
	},

	// Military & Defense
	{
		id: 'arms-race',
		patterns: [/arms deal/i, /weapons sale/i, /military buildup/i, /defense spending/i, /arms race/i, /conscription/i],
		category: 'Security'
	},
	{
		id: 'nato-defense',
		patterns: [/nato spending/i, /nato expansion/i, /european defense/i, /military alliance/i, /collective defense/i],
		category: 'Geopolitics'
	},

	// Extreme Climate
	{
		id: 'extreme-weather',
		patterns: [/extreme weather/i, /heat wave/i, /polar vortex/i, /\btornado\b/i, /\btyphoon\b/i, /\bcyclone\b/i, /ice storm/i, /record temperature/i, /climate emergency/i, /weather disaster/i],
		category: 'Environment'
	}
```

**Step 2: Run tests to verify they pass**

Run: `npm run test:unit`
Expected: All tests pass including new correlation topic tests

**Step 3: Commit**

```bash
git add src/lib/config/analysis.ts src/lib/analysis/correlation.test.ts
git commit -m "feat: add 21 new correlation topics across 11 domains"
```

---

### Task 4: Write tests for new compound signals

**Files:**
- Modify: `src/lib/analysis/correlation.test.ts`

**Step 1: Write failing tests for new compound signals**

Add inside the existing `describe('Compound Pattern Detection')` block:

```typescript
	it('should detect cyber-warfare-escalation compound signal', () => {
		const topicStats: Record<string, TopicStats> = {
			'state-hacking': {
				count: 3, weightedCount: 3.6,
				sources: new Set(['BBC', 'CNN', 'NYT']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'russia-ukraine': {
				count: 2, weightedCount: 2.4,
				sources: new Set(['Reuters', 'AP']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			}
		};
		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const signal = signals.find((s) => s.id === 'cyber-warfare-escalation');
		expect(signal).toBeDefined();
		expect(signal!.activeTopics).toContain('state-hacking');
		expect(signal!.activeTopics).toContain('russia-ukraine');
	});

	it('should detect polycrisis compound signal requiring 3+ topics', () => {
		const topicStats: Record<string, TopicStats> = {
			'civil-unrest': {
				count: 3, weightedCount: 3.0,
				sources: new Set(['BBC']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'food-security': {
				count: 2, weightedCount: 2.0,
				sources: new Set(['Reuters']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'inflation': {
				count: 4, weightedCount: 4.0,
				sources: new Set(['CNN']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'extreme-weather': {
				count: 2, weightedCount: 2.0,
				sources: new Set(['NYT']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			}
		};
		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const signal = signals.find((s) => s.id === 'polycrisis');
		expect(signal).toBeDefined();
		expect(signal!.activeTopics.length).toBeGreaterThanOrEqual(3);
	});

	it('should NOT detect polycrisis with only 2 topics active', () => {
		const topicStats: Record<string, TopicStats> = {
			'civil-unrest': {
				count: 3, weightedCount: 3.0,
				sources: new Set(['BBC']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'food-security': {
				count: 2, weightedCount: 2.0,
				sources: new Set(['Reuters']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			}
		};
		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const signal = signals.find((s) => s.id === 'polycrisis');
		expect(signal).toBeUndefined();
	});

	it('should detect sovereign-debt-crisis compound signal', () => {
		const topicStats: Record<string, TopicStats> = {
			'sovereign-debt': {
				count: 3, weightedCount: 3.6,
				sources: new Set(['Bloomberg']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'fed-rates': {
				count: 2, weightedCount: 2.4,
				sources: new Set(['Reuters']), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			}
		};
		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const signal = signals.find((s) => s.id === 'sovereign-debt-crisis');
		expect(signal).toBeDefined();
		expect(signal!.score).toBe((3.6 + 2.4) * 2.0);
	});

	it('should apply 3.0 boost factor for polycrisis', () => {
		const topicStats: Record<string, TopicStats> = {
			'civil-unrest': {
				count: 2, weightedCount: 2.0,
				sources: new Set(), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'food-security': {
				count: 2, weightedCount: 2.0,
				sources: new Set(), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			},
			'inflation': {
				count: 2, weightedCount: 2.0,
				sources: new Set(), headlines: [],
				velocity: 0, acceleration: 0, zScore: 0
			}
		};
		const signals = detectCompoundPatterns(topicStats, COMPOUND_PATTERNS);
		const signal = signals.find((s) => s.id === 'polycrisis');
		expect(signal).toBeDefined();
		expect(signal!.score).toBe((2.0 + 2.0 + 2.0) * 3.0);
	});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:unit`
Expected: New compound signal tests FAIL

---

### Task 5: Add new compound signals to config

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 20 new compound patterns to COMPOUND_PATTERNS array**

Add after the existing `social-pressure` entry (line ~197) in the `COMPOUND_PATTERNS` array:

```typescript
	// === NEW COMPOUND SIGNALS ===

	// Cyber & Geopolitical
	{
		id: 'cyber-warfare-escalation',
		topics: ['state-hacking', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Cyber Warfare Escalation',
		prediction: 'State-sponsored cyber operations intensifying',
		boostFactor: 2.0
	},
	{
		id: 'critical-infra-attack',
		topics: ['cyberattack', 'energy-transition', 'supply-chain'],
		minTopics: 2,
		name: 'Critical Infrastructure Attack',
		prediction: 'Infrastructure vulnerability exposure rising',
		boostFactor: 2.2
	},
	{
		id: 'cyber-financial-attack',
		topics: ['cyberattack', 'bank-crisis', 'credit-stress'],
		minTopics: 2,
		name: 'Cyber-Financial Attack',
		prediction: 'Financial system cyber vulnerability detected',
		boostFactor: 2.0
	},

	// Energy & Geopolitical
	{
		id: 'energy-weaponization',
		topics: ['oil-opec', 'sanctions', 'russia-ukraine'],
		minTopics: 2,
		name: 'Energy Weaponization',
		prediction: 'Energy used as geopolitical leverage — price volatility expected',
		boostFactor: 1.8
	},
	{
		id: 'resource-war',
		topics: ['rare-earths', 'china-tensions', 'sanctions'],
		minTopics: 2,
		name: 'Resource War',
		prediction: 'Critical mineral supply under geopolitical pressure',
		boostFactor: 1.7
	},
	{
		id: 'green-transition-shock',
		topics: ['energy-transition', 'rare-earths', 'china-tensions'],
		minTopics: 2,
		name: 'Green Transition Shock',
		prediction: 'Energy transition supply chain bottleneck forming',
		boostFactor: 1.5
	},

	// Food & Climate
	{
		id: 'food-crisis-spiral',
		topics: ['food-security', 'extreme-weather', 'supply-chain'],
		minTopics: 2,
		name: 'Food Crisis Spiral',
		prediction: 'Climate-driven food supply disruption accelerating',
		boostFactor: 1.8
	},
	{
		id: 'climate-migration',
		topics: ['extreme-weather', 'refugee-crisis', 'civil-unrest'],
		minTopics: 2,
		name: 'Climate Migration Pressure',
		prediction: 'Climate displacement triggering social instability',
		boostFactor: 1.7
	},
	{
		id: 'agricultural-collapse',
		topics: ['agriculture', 'extreme-weather', 'inflation'],
		minTopics: 2,
		name: 'Agricultural Collapse Signal',
		prediction: 'Crop failures feeding inflation pipeline',
		boostFactor: 1.6
	},

	// Financial & Fiscal
	{
		id: 'sovereign-debt-crisis',
		topics: ['sovereign-debt', 'fed-rates', 'credit-stress'],
		minTopics: 2,
		name: 'Sovereign Debt Crisis',
		prediction: 'Government debt sustainability in question',
		boostFactor: 2.0
	},
	{
		id: 'credit-contagion',
		topics: ['credit-stress', 'bank-crisis', 'housing'],
		minTopics: 2,
		name: 'Credit Contagion',
		prediction: 'Credit stress spreading across sectors',
		boostFactor: 1.9
	},
	{
		id: 'dedollarization-signal',
		topics: ['trade-blocs', 'sanctions', 'crypto'],
		minTopics: 2,
		name: 'Dedollarization Signal',
		prediction: 'Alternative payment systems gaining traction',
		boostFactor: 1.6
	},

	// Social & Political
	{
		id: 'social-tinderbox',
		topics: ['civil-unrest', 'inflation', 'layoffs'],
		minTopics: 2,
		name: 'Social Tinderbox',
		prediction: 'Economic pain fueling civil unrest risk',
		boostFactor: 1.9
	},
	{
		id: 'democratic-stress',
		topics: ['election', 'political-violence', 'civil-unrest'],
		minTopics: 2,
		name: 'Democratic Stress',
		prediction: 'Political institutions under pressure',
		boostFactor: 1.8
	},
	{
		id: 'global-protest-wave',
		topics: ['civil-unrest', 'food-security', 'inflation'],
		minTopics: 2,
		name: 'Global Protest Wave',
		prediction: 'Cost-of-living protests spreading',
		boostFactor: 1.7
	},

	// Military & Escalation
	{
		id: 'arms-race-acceleration',
		topics: ['arms-race', 'nato-defense', 'russia-ukraine'],
		minTopics: 2,
		name: 'Arms Race Acceleration',
		prediction: 'Military spending and procurement surging',
		boostFactor: 1.7
	},
	{
		id: 'multi-domain-conflict',
		topics: ['cyberattack', 'space-military', 'arms-race'],
		minTopics: 2,
		name: 'Multi-Domain Conflict',
		prediction: 'Warfare expanding across cyber, space, and conventional domains',
		boostFactor: 2.3
	},
	{
		id: 'escalation-ladder',
		topics: ['nuclear', 'arms-race', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Escalation Ladder',
		prediction: 'Conflict intensity climbing across theaters',
		boostFactor: 2.5
	},

	// Cross-Domain Red Alert
	{
		id: 'systemic-fragility',
		topics: ['sovereign-debt', 'supply-chain', 'cyberattack', 'extreme-weather'],
		minTopics: 3,
		name: 'Systemic Fragility',
		prediction: 'Multiple system stress points converging — cascading failure risk',
		boostFactor: 2.5
	},
	{
		id: 'polycrisis',
		topics: ['civil-unrest', 'food-security', 'inflation', 'extreme-weather', 'refugee-crisis'],
		minTopics: 3,
		name: 'Polycrisis',
		prediction: 'Simultaneous crises reinforcing each other — monitor all fronts',
		boostFactor: 3.0
	}
```

**Step 2: Run tests to verify they pass**

Run: `npm run test:unit`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/lib/config/analysis.ts src/lib/analysis/correlation.test.ts
git commit -m "feat: add 20 new compound signals for cross-domain correlation"
```

---

### Task 6: Write tests for new fringe narratives

**Files:**
- Modify: `src/lib/analysis/narrative.test.ts`

**Step 1: Write failing tests for new fringe narratives**

Add a new `describe` block after the existing ones:

```typescript
describe('New fringe narrative patterns', () => {
	beforeEach(() => {
		clearNarrativeHistory();
	});

	it('should detect weather-manipulation disinfo narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'HAARP weather weapon conspiracy resurfaces', source: 'ZeroHedge' }),
			createNewsItem({ title: 'Chemtrail theory gains followers online', source: 'Infowars' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.disinfoSignals.find((n) => n.id === 'weather-manipulation');
		expect(narrative).toBeDefined();
		expect(narrative!.severity).toBe('disinfo');
	});

	it('should detect sovereignty-erosion emerging narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'WHO treaty threatens national sovereignty', source: 'Test' }),
			createNewsItem({ title: 'UN takeover fears grow among critics', source: 'Test2' })
		];
		const results = analyzeNarratives(news);
		const narrative =
			results!.emergingFringe.find((n) => n.id === 'sovereignty-erosion') ||
			results!.narrativeWatch.find((n) => n.id === 'sovereignty-erosion');
		expect(narrative).toBeDefined();
	});

	it('should detect 15-minute-city narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: '15 minute city plans spark backlash', source: 'Test' }),
			createNewsItem({ title: 'Climate lockdown conspiracy spreads', source: 'Test2' })
		];
		const results = analyzeNarratives(news);
		const narrative =
			results!.emergingFringe.find((n) => n.id === '15-minute-city') ||
			results!.narrativeWatch.find((n) => n.id === '15-minute-city');
		expect(narrative).toBeDefined();
	});

	it('should detect demographic-replacement as disinfo', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Great replacement theory spreads online', source: 'Infowars' }),
			createNewsItem({ title: 'Replacement migration claims debunked', source: 'BBC News' })
		];
		const results = analyzeNarratives(news);
		const inDisinfo = results!.disinfoSignals.find((n) => n.id === 'demographic-replacement');
		const inCrossover = results!.fringeToMainstream.find((n) => n.id === 'demographic-replacement');
		// Should appear in either disinfo or crossover (since BBC is mainstream)
		expect(inDisinfo || inCrossover).toBeDefined();
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:unit`
Expected: New fringe narrative tests FAIL

---

### Task 7: Add new fringe narratives to config

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 15 new entries to NARRATIVE_PATTERNS array**

Add after the existing `energy-war` entry (line ~412) in the `NARRATIVE_PATTERNS` array:

```typescript
	// === NEW FRINGE NARRATIVES ===
	{
		id: 'grid-collapse',
		keywords: ['grid collapse', 'power grid attack', 'blackout agenda', 'emp attack'],
		category: 'Economy',
		severity: 'emerging'
	},
	{
		id: 'water-wars',
		keywords: ['water privatization', 'water crisis engineered', 'water shortage agenda'],
		category: 'Economy',
		severity: 'watch'
	},
	{
		id: 'lab-grown-food',
		keywords: ['lab grown meat danger', 'fake food', 'synthetic food agenda', 'bug diet'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'weather-manipulation',
		keywords: ['weather weapon', 'haarp', 'geoengineering', 'chemtrail', 'weather control'],
		category: 'Environment',
		severity: 'disinfo'
	},
	{
		id: '15-minute-city',
		keywords: ['15 minute city', 'climate lockdown', 'movement restriction', 'open air prison'],
		category: 'Society',
		severity: 'spreading'
	},
	{
		id: 'digital-id-control',
		keywords: ['digital id', 'digital passport', 'biometric control', 'surveillance state'],
		category: 'Society',
		severity: 'watch'
	},
	{
		id: 'bank-bail-in',
		keywords: ['bail in', 'bank confiscation', 'savings seizure', 'bank theft'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'ai-takeover',
		keywords: ['ai takeover', 'ai control', 'ai overlord', 'machine uprising', 'skynet'],
		category: 'Tech',
		severity: 'watch'
	},
	{
		id: 'space-hoax',
		keywords: ['space fake', 'moon landing hoax', 'flat earth', 'nasa lie'],
		category: 'Tech',
		severity: 'disinfo'
	},
	{
		id: 'cyber-false-flag',
		keywords: ['cyber false flag', 'staged cyberattack', 'internet kill switch'],
		category: 'Security',
		severity: 'watch'
	},
	{
		id: 'demographic-replacement',
		keywords: ['great replacement', 'replacement migration', 'demographic engineering'],
		category: 'Society',
		severity: 'disinfo'
	},
	{
		id: 'pharma-conspiracy',
		keywords: ['big pharma conspiracy', 'suppressed cure', 'medical coverup'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'controlled-demolition',
		keywords: ['controlled demolition economy', 'planned collapse', 'intentional crash'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'sovereignty-erosion',
		keywords: ['sovereignty erosion', 'who treaty', 'un takeover', 'global governance'],
		category: 'Political',
		severity: 'emerging'
	}
```

**Step 2: Run tests to verify they pass**

Run: `npm run test:unit`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/lib/config/analysis.ts src/lib/analysis/narrative.test.ts
git commit -m "feat: add 15 new fringe narrative patterns"
```

---

### Task 8: Write tests for new mainstream narratives

**Files:**
- Modify: `src/lib/analysis/narrative.test.ts`

**Step 1: Write failing tests for new mainstream narratives**

Add new `describe` blocks:

```typescript
describe('New mainstream narrative patterns', () => {
	beforeEach(() => {
		clearNarrativeHistory();
	});

	it('should detect new-cold-war narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'New cold war rhetoric intensifies', source: 'Reuters' }),
			createNewsItem({ title: 'Great power competition reshapes global order', source: 'FP' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'new-cold-war');
		expect(narrative).toBeDefined();
		expect(narrative!.category).toBe('Geopolitics');
	});

	it('should detect debt-spiral narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Debt ceiling crisis looms in Washington', source: 'WSJ' }),
			createNewsItem({ title: 'National debt reaches unprecedented levels', source: 'Bloomberg' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'debt-spiral');
		expect(narrative).toBeDefined();
	});

	it('should detect climate-tipping-point narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Scientists warn of climate tipping point', source: 'BBC' }),
			createNewsItem({ title: 'Record heat wave breaks all-time temperature records', source: 'CNN' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'climate-tipping-point');
		expect(narrative).toBeDefined();
		expect(narrative!.category).toBe('Environment');
	});

	it('should detect de-globalization narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Reshoring trend accelerates in manufacturing', source: 'Reuters' }),
			createNewsItem({ title: 'Friend-shoring replaces global supply chains', source: 'FT' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'de-globalization');
		expect(narrative).toBeDefined();
	});

	it('should detect ai-arms-race narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'AI race between US and China intensifies', source: 'NYT' }),
			createNewsItem({ title: 'AI supremacy becomes national priority', source: 'Reuters' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'ai-arms-race');
		expect(narrative).toBeDefined();
		expect(narrative!.category).toBe('Tech');
	});
});

describe('Partisan framing and frame battle patterns', () => {
	beforeEach(() => {
		clearNarrativeHistory();
	});

	it('should detect conservative-framing narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Woke policies face growing backlash', source: 'NYPost' }),
			createNewsItem({ title: 'Radical left agenda pushes voters away', source: 'Fox' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'conservative-framing');
		expect(narrative).toBeDefined();
	});

	it('should detect progressive-framing narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Far-right groups rally in major cities', source: 'CNN' }),
			createNewsItem({ title: 'MAGA extremism concerns law enforcement', source: 'WaPo' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'progressive-framing');
		expect(narrative).toBeDefined();
	});

	it('should detect immigration frame battle (both sides)', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Border crisis worsens as crossings surge', source: 'Fox' }),
			createNewsItem({ title: 'Illegal crossing numbers hit record', source: 'AP' }),
			createNewsItem({ title: 'Asylum seeker rights at stake in new policy', source: 'NYT' }),
			createNewsItem({ title: 'Family separation reports emerge from border', source: 'CNN' })
		];
		const results = analyzeNarratives(news);
		const securityFrame = results!.trendingNarratives.find((n) => n.id === 'immigration-security-frame');
		const humanFrame = results!.trendingNarratives.find((n) => n.id === 'immigration-humanitarian-frame');
		expect(securityFrame).toBeDefined();
		expect(humanFrame).toBeDefined();
	});

	it('should detect AI framing battle', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'AI breakthrough transforms drug discovery', source: 'MIT' }),
			createNewsItem({ title: 'AI revolution creates new opportunities', source: 'Bloomberg' }),
			createNewsItem({ title: 'AI threat to jobs grows as automation spreads', source: 'CNN' }),
			createNewsItem({ title: 'AI danger warnings from leading researchers', source: 'NYT' })
		];
		const results = analyzeNarratives(news);
		const optimist = results!.trendingNarratives.find((n) => n.id === 'ai-optimist-frame');
		const alarmist = results!.trendingNarratives.find((n) => n.id === 'ai-alarmist-frame');
		expect(optimist).toBeDefined();
		expect(alarmist).toBeDefined();
	});
});

describe('Brazil partisan framing and frame battles', () => {
	beforeEach(() => {
		clearNarrativeHistory();
	});

	it('should detect brazil-right-framing narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Esquerdistas dominam universidades, diz relatório', source: 'Gazeta' }),
			createNewsItem({ title: 'Doutrinação nas escolas preocupa pais', source: 'Jovem Pan' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'brazil-right-framing');
		expect(narrative).toBeDefined();
		expect(narrative!.region).toBe('brazil');
	});

	it('should detect brazil-left-framing narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Golpistas enfrentam processo judicial', source: 'G1' }),
			createNewsItem({ title: 'Bolsonarismo ameaça instituições democráticas', source: 'Folha' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'brazil-left-framing');
		expect(narrative).toBeDefined();
	});

	it('should detect brazil security frame battle', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Armar o cidadão é direito fundamental, diz deputado', source: 'Test' }),
			createNewsItem({ title: 'Mão dura contra o crime organizado', source: 'Test2' }),
			createNewsItem({ title: 'Violência policial mata jovens nas periferias', source: 'Test3' }),
			createNewsItem({ title: 'Direitos humanos devem proteger todos', source: 'Test4' })
		];
		const results = analyzeNarratives(news);
		const hardline = results!.trendingNarratives.find((n) => n.id === 'brazil-security-hardline');
		const rights = results!.trendingNarratives.find((n) => n.id === 'brazil-security-rights');
		expect(hardline).toBeDefined();
		expect(rights).toBeDefined();
	});

	it('should detect brazil-corruption narrative', () => {
		const news: NewsItem[] = [
			createNewsItem({ title: 'Nova operação investiga corrupção no governo', source: 'G1' }),
			createNewsItem({ title: 'Delação premiada revela esquema de propina', source: 'Folha' })
		];
		const results = analyzeNarratives(news);
		const narrative = results!.trendingNarratives.find((n) => n.id === 'brazil-corruption');
		expect(narrative).toBeDefined();
		expect(narrative!.region).toBe('brazil');
	});
});
```

**Step 2: Run tests to verify they fail**

Run: `npm run test:unit`
Expected: New mainstream/framing tests FAIL

---

### Task 9: Add new mainstream narratives to config (global)

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 15 new global mainstream narrative patterns**

Add after the existing `election-coverage` entry in the `MAINSTREAM_NARRATIVE_PATTERNS` array (before the Brazil section):

```typescript
	// === NEW GLOBAL — Geopolitics & Security ===
	{
		id: 'new-cold-war',
		name: 'New Cold War',
		patterns: [/new cold war/i, /great power competition/i, /bloc rivalry/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'taiwan-contingency',
		name: 'Taiwan Contingency',
		patterns: [/taiwan strait/i, /taiwan invasion/i, /taiwan contingency/i, /cross.strait/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'arctic-competition',
		name: 'Arctic Competition',
		patterns: [/arctic race/i, /arctic military/i, /northern sea route/i, /arctic resource/i],
		category: 'Geopolitics',
		region: 'global'
	},
	{
		id: 'nuclear-posture',
		name: 'Nuclear Posture',
		patterns: [/nuclear deterrent/i, /nuclear moderniz/i, /nuclear treaty/i, /arms control/i],
		category: 'Security',
		region: 'global'
	},
	{
		id: 'cyber-threat-landscape',
		name: 'Cyber Threat Landscape',
		patterns: [/cyber threat/i, /ransomware wave/i, /state hacker/i, /cyber defense/i],
		category: 'Security',
		region: 'global'
	},

	// === NEW GLOBAL — Economy & Finance ===
	{
		id: 'debt-spiral',
		name: 'Debt Spiral',
		patterns: [/debt ceiling/i, /fiscal crisis/i, /national debt/i, /credit downgrade/i, /bond sell.off/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'de-globalization',
		name: 'De-Globalization',
		patterns: [/reshoring/i, /nearshoring/i, /friend.shoring/i, /onshoring/i, /supply chain diversif/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'crypto-regulation',
		name: 'Crypto Regulation',
		patterns: [/crypto regulat/i, /stablecoin law/i, /defi regulat/i, /sec.*crypto/i],
		category: 'Finance',
		region: 'global'
	},
	{
		id: 'commodity-super-cycle',
		name: 'Commodity Super Cycle',
		patterns: [/commodity boom/i, /super cycle/i, /commodity rally/i, /resource nationalism/i],
		category: 'Economy',
		region: 'global'
	},

	// === NEW GLOBAL — Climate & Energy ===
	{
		id: 'energy-security',
		name: 'Energy Security',
		patterns: [/energy security/i, /energy independence/i, /energy crisis/i, /grid resilience/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'climate-tipping-point',
		name: 'Climate Tipping Point',
		patterns: [/tipping point/i, /point of no return/i, /climate emergency/i, /record heat/i, /record warm/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'extreme-weather-impact',
		name: 'Extreme Weather Impact',
		patterns: [/extreme weather/i, /unprecedented storm/i, /record flood/i, /climate disaster/i, /weather catastrophe/i],
		category: 'Environment',
		region: 'global'
	},

	// === NEW GLOBAL — Tech & Society ===
	{
		id: 'ai-arms-race',
		name: 'AI Arms Race',
		patterns: [/ai race/i, /ai competition/i, /ai supremacy/i, /ai dominance/i, /ai lead/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'social-media-regulation',
		name: 'Social Media Regulation',
		patterns: [/social media ban/i, /platform regulation/i, /content moderation/i, /section 230/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'space-race-narrative',
		name: 'Space Race',
		patterns: [/space race/i, /moon race/i, /mars race/i, /commercial space/i, /space economy/i],
		category: 'Tech',
		region: 'global'
	},
```

**Step 2: Run tests to check progress**

Run: `npm run test:unit`
Expected: Global narrative tests pass, framing tests still fail

---

### Task 10: Add partisan framing and frame battle patterns to config

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 10 global framing patterns**

Add after the new global patterns (before Brazil section):

```typescript
	// === GLOBAL — Partisan Framing ===
	{
		id: 'conservative-framing',
		name: 'Conservative Framing',
		patterns: [/\bwoke\b/i, /radical left/i, /socialist agenda/i, /government overreach/i, /nanny state/i, /war on freedom/i, /cancel culture/i, /leftist mob/i, /virtue signal/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'progressive-framing',
		name: 'Progressive Framing',
		patterns: [/far.right/i, /maga extremis/i, /threat to democracy/i, /white nationalis/i, /climate denier/i, /book ban/i, /assault on rights/i, /\bfascis/i, /\bauthoritarian/i],
		category: 'Politics',
		region: 'global'
	},

	// === GLOBAL — Frame Battles ===
	{
		id: 'immigration-security-frame',
		name: 'Immigration Security Frame',
		patterns: [/border crisis/i, /illegal crossing/i, /illegal alien/i, /border invasion/i, /cartel threat/i, /migrant crime/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'immigration-humanitarian-frame',
		name: 'Immigration Humanitarian Frame',
		patterns: [/asylum seeker/i, /refugee rights/i, /family separation/i, /\bdreamer/i, /undocumented worker/i, /humanitarian border/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'climate-urgency-frame',
		name: 'Climate Urgency Frame',
		patterns: [/climate emergency/i, /climate crisis/i, /existential threat/i, /planet burning/i, /code red/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'climate-skeptic-frame',
		name: 'Climate Skeptic Frame',
		patterns: [/climate hoax/i, /climate alarmis/i, /green scam/i, /climate hysteria/i, /climate grift/i],
		category: 'Environment',
		region: 'global'
	},
	{
		id: 'gun-rights-frame',
		name: 'Gun Rights Frame',
		patterns: [/second amendment/i, /gun rights/i, /right to bear/i, /gun freedom/i, /armed citizen/i, /self defense/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'gun-control-frame',
		name: 'Gun Control Frame',
		patterns: [/gun violence epidemic/i, /mass shooting/i, /gun reform/i, /gun safety/i, /ban assault/i],
		category: 'Politics',
		region: 'global'
	},
	{
		id: 'ai-optimist-frame',
		name: 'AI Optimist Frame',
		patterns: [/ai breakthrough/i, /ai revolution/i, /ai opportunity/i, /ai potential/i, /ai benefit/i, /ai progress/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'ai-alarmist-frame',
		name: 'AI Alarmist Frame',
		patterns: [/ai threat/i, /ai danger/i, /ai risk/i, /ai destroy/i, /ai replace/i, /ai out of control/i, /ai unsafe/i],
		category: 'Tech',
		region: 'global'
	},
```

**Step 2: Run tests to check progress**

Run: `npm run test:unit`
Expected: Global framing tests now pass, Brazil tests still fail

---

### Task 11: Add Brazil-specific mainstream narratives to config

**Files:**
- Modify: `src/lib/config/analysis.ts`

**Step 1: Add 12 new Brazil mainstream narrative patterns**

Add after the existing `military-smear` entry (inside the Brazil section):

```typescript
	// === NEW BRAZIL ===
	{
		id: 'brazil-cyber',
		name: 'Brazil Cyber Threats',
		patterns: [/ciberataque/i, /vazamento de dados/i, /hacker.*brasil/i, /seguran[çc]a digital/i],
		category: 'Security',
		region: 'brazil'
	},
	{
		id: 'brazil-climate',
		name: 'Brazil Climate Events',
		patterns: [/\bseca\b/i, /enchente/i, /chuva extrema/i, /desastre clim[áa]tico/i, /evento extremo/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brazil-fiscal-crisis',
		name: 'Brazil Fiscal Pressure',
		patterns: [/d[íi]vida p[úu]blica/i, /risco fiscal/i, /nota de cr[ée]dito/i, /spread soberano/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-corruption',
		name: 'Institutional Corruption',
		patterns: [/corrup[çc][ãa]o/i, /propina/i, /lavagem de dinheiro/i, /desvio/i, /peculato/i, /improbidade/i, /dela[çc][ãa]o/i, /opera[çc][ãa]o.*policial federal/i, /licita[çc][ãa]o irregular/i, /superfaturamento/i, /caixa dois/i, /tr[áa]fico de influ[êe]ncia/i],
		category: 'Politics',
		region: 'brazil'
	},

	// === BRAZIL — Partisan Framing ===
	{
		id: 'brazil-right-framing',
		name: 'Brazil Right Framing',
		patterns: [/esquerdista/i, /comunista/i, /marxista/i, /doutrina[çc][ãa]o/i, /ideologia de g[êe]nero/i, /vagabundo/i, /mamata/i, /petralha/i, /bolivariano/i, /ditadura do judici[áa]rio/i, /ativismo judicial/i, /aparelhamento/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-left-framing',
		name: 'Brazil Left Framing',
		patterns: [/fascista/i, /golpista/i, /miliciano/i, /genocida/i, /negacionista/i, /bolsonarismo/i, /extrema direita/i, /amea[çc]a [àa] democracia/i, /discurso de [óo]dio/i, /ataque [àa]s institui[çc][õo]es/i, /desmatador/i, /entreguista/i],
		category: 'Politics',
		region: 'brazil'
	},

	// === BRAZIL — Frame Battles ===
	{
		id: 'brazil-security-hardline',
		name: 'Brazil Security Hardline',
		patterns: [/bandido bom [ée] bandido morto/i, /armar o cidad[ãa]o/i, /excludente de ilicitude/i, /redu[çc][ãa]o da maioridade/i, /toler[âa]ncia zero/i, /m[ãa]o dura/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-security-rights',
		name: 'Brazil Security Rights',
		patterns: [/viol[êe]ncia policial/i, /genoc[íi]dio da juventude negra/i, /encarceramento em massa/i, /desmilitariza[çc][ãa]o/i, /direitos humanos/i, /abuso de autoridade/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'brazil-economy-liberal',
		name: 'Brazil Free Market Frame',
		patterns: [/privatiza[çc][ãa]o/i, /estado inchado/i, /carga tribut[áa]ria/i, /livre mercado/i, /desburocratiza[çc][ãa]o/i, /menos estado/i, /reforma administrativa/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-economy-statist',
		name: 'Brazil Statist Frame',
		patterns: [/papel do estado/i, /investimento p[úu]blico/i, /programa social/i, /soberania nacional/i, /empresa estrat[ée]gica/i, /neoliberal/i, /privataria/i, /desmonte/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'brazil-environment-dev',
		name: 'Brazil Development Frame',
		patterns: [/soberania sobre amaz[ôo]nia/i, /progresso/i, /agroneg[óo]cio/i, /marco temporal/i, /minera[çc][ãa]o/i, /desenvolvimento sustent[áa]vel/i, /regulariza[çc][ãa]o fundi[áa]ria/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brazil-environment-prot',
		name: 'Brazil Environmentalist Frame',
		patterns: [/desmatamento recorde/i, /ecoc[íi]dio/i, /crime ambiental/i, /terra ind[íi]gena/i, /prote[çc][ãa]o ambiental/i, /garimpo ilegal/i, /destrui[çc][ãa]o ambiental/i],
		category: 'Environment',
		region: 'brazil'
	},
```

**Step 2: Run tests to verify all pass**

Run: `npm run test:unit`
Expected: ALL tests pass

**Step 3: Commit**

```bash
git add src/lib/config/analysis.ts src/lib/analysis/narrative.test.ts
git commit -m "feat: add 29 new mainstream narratives including framing patterns"
```

---

### Task 12: Run full test suite and verify

**Files:**
- Read: `src/lib/config/analysis.ts` (verify structure)

**Step 1: Run full test suite**

Run: `npm run test:unit`
Expected: All tests pass (original 147 + new tests)

**Step 2: Run type check**

Run: `npm run check`
Expected: No TypeScript errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No lint errors (may need `npm run format` first)

**Step 4: Verify counts**

Manually verify the config arrays have the expected counts:
- `CORRELATION_TOPICS`: 41 entries
- `COMPOUND_PATTERNS`: 36 entries
- `NARRATIVE_PATTERNS`: 31 entries
- `MAINSTREAM_NARRATIVE_PATTERNS`: 51 entries

**Step 5: Final commit if any formatting changes**

```bash
npm run format
git add -A
git commit -m "chore: format analysis config expansion"
```

---

### Summary

| Task | Description | Estimated Steps |
|---|---|---|
| 1 | Verify baseline | 1 |
| 2 | Write correlation topic tests | 2 |
| 3 | Add 21 correlation topics | 3 |
| 4 | Write compound signal tests | 2 |
| 5 | Add 20 compound signals | 3 |
| 6 | Write fringe narrative tests | 2 |
| 7 | Add 15 fringe narratives | 3 |
| 8 | Write mainstream narrative tests | 2 |
| 9 | Add 15 global mainstream narratives | 2 |
| 10 | Add 10 framing patterns | 2 |
| 11 | Add 12 Brazil narratives | 3 |
| 12 | Final verification | 5 |
| **Total** | | **30 steps** |
