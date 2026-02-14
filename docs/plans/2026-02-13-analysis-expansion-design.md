# Analysis Engine Expansion Design

**Date:** 2026-02-13
**Scope:** Expand correlation topics, compound signals, and narrative patterns in `src/lib/config/analysis.ts`
**Approach:** Domain-driven expansion — no logic changes required

## Summary

Triple the analysis engine's coverage by adding 21 correlation topics, 20 compound signals, 15 fringe narratives, and 29 mainstream narratives. All changes are config-only in `src/lib/config/analysis.ts`. The existing engines in `correlation.ts` and `narrative.ts` consume these arrays generically.

## New Correlation Topics (20 → 41)

21 new topics across 11 domains:

### Cyber & InfoSec
- `cyberattack` — cyberattack, cyber attack, data breach, ransomware, hacking, zero-day (Security)
- `state-hacking` — state-sponsored, apt, cyber espionage, cyber warfare (Security)

### Space & Satellites
- `space-military` — space force, satellite weapon, anti-satellite, space militarization, orbital weapon (Security)
- `space-race` — space launch, spacex, moon mission, mars mission, space station (Tech)

### Energy & Resources
- `energy-transition` — renewable energy, solar, wind power, green energy, clean energy, energy transition (Environment)
- `rare-earths` — rare earth, lithium, cobalt, critical mineral, semiconductor supply (Economy)
- `oil-opec` — opec, oil price, oil production, crude oil, petroleum, oil cut (Economy)

### Sanctions & Economic Warfare
- `sanctions` — sanction, swift ban, asset freeze, export control, trade restriction, embargo (Geopolitics)
- `trade-blocs` — brics, g7 summit, g20, trade agreement, trade bloc, economic alliance (Geopolitics)

### Food & Agriculture
- `food-security` — food crisis, crop failure, grain export, food price, famine, food shortage (Economy)
- `agriculture` — fertilizer, drought, harvest, agriculture, farming crisis (Environment)

### Debt & Fiscal
- `sovereign-debt` — national debt, debt ceiling, fiscal deficit, credit rating, bond yield, treasury (Economy)
- `credit-stress` — credit crunch, default risk, junk bond, high yield, credit spread (Finance)

### Social Unrest
- `civil-unrest` — protest, riot, civil unrest, demonstration, strike, uprising (Politics)
- `political-violence` — assassination, political violence, insurrection, coup, extremism, domestic terror (Security)

### Biotech & Health
- `biotech` — gene therapy, crispr, biotech breakthrough, drug approval, fda approval (Health)
- `antimicrobial` — antibiotic resistance, superbug, antimicrobial, drug-resistant (Health)

### Migration & Demographics
- `refugee-crisis` — refugee, displaced, humanitarian crisis, refugee camp, migration crisis (Politics)
- `demographics` — aging population, birth rate, fertility rate, population decline, brain drain (Economy)

### Military & Defense
- `arms-race` — arms deal, weapons sale, military buildup, defense spending, arms race, conscription (Security)
- `nato-defense` — nato spending, nato expansion, european defense, military alliance, collective defense (Geopolitics)

### Extreme Climate
- `extreme-weather` — extreme weather, heat wave, polar vortex, tornado, typhoon, cyclone, ice storm, record temperature, climate emergency, weather disaster (Environment)

## New Compound Signals (16 → 36)

20 new cross-domain signals:

### Cyber & Geopolitical
- `cyber-warfare-escalation` — state-hacking + russia-ukraine + china-tensions (min 2, boost 2.0) — "State-sponsored cyber operations intensifying"
- `critical-infra-attack` — cyberattack + energy-transition + supply-chain (min 2, boost 2.2) — "Infrastructure vulnerability exposure rising"
- `cyber-financial-attack` — cyberattack + bank-crisis + credit-stress (min 2, boost 2.0) — "Financial system cyber vulnerability detected"

### Energy & Geopolitical
- `energy-weaponization` — oil-opec + sanctions + russia-ukraine (min 2, boost 1.8) — "Energy used as geopolitical leverage — price volatility expected"
- `resource-war` — rare-earths + china-tensions + sanctions (min 2, boost 1.7) — "Critical mineral supply under geopolitical pressure"
- `green-transition-shock` — energy-transition + rare-earths + china-tensions (min 2, boost 1.5) — "Energy transition supply chain bottleneck forming"

### Food & Climate
- `food-crisis-spiral` — food-security + extreme-weather + supply-chain (min 2, boost 1.8) — "Climate-driven food supply disruption accelerating"
- `climate-migration` — extreme-weather + refugee-crisis + civil-unrest (min 2, boost 1.7) — "Climate displacement triggering social instability"
- `agricultural-collapse` — agriculture + extreme-weather + inflation (min 2, boost 1.6) — "Crop failures feeding inflation pipeline"

### Financial & Fiscal
- `sovereign-debt-crisis` — sovereign-debt + fed-rates + credit-stress (min 2, boost 2.0) — "Government debt sustainability in question"
- `credit-contagion` — credit-stress + bank-crisis + housing (min 2, boost 1.9) — "Credit stress spreading across sectors"
- `dedollarization-signal` — trade-blocs + sanctions + crypto (min 2, boost 1.6) — "Alternative payment systems gaining traction"

### Social & Political
- `social-tinderbox` — civil-unrest + inflation + layoffs (min 2, boost 1.9) — "Economic pain fueling civil unrest risk"
- `democratic-stress` — election + political-violence + civil-unrest (min 2, boost 1.8) — "Political institutions under pressure"
- `global-protest-wave` — civil-unrest + food-security + inflation (min 2, boost 1.7) — "Cost-of-living protests spreading"

### Military & Escalation
- `arms-race-acceleration` — arms-race + nato-defense + russia-ukraine (min 2, boost 1.7) — "Military spending and procurement surging"
- `multi-domain-conflict` — cyberattack + space-military + arms-race (min 2, boost 2.3) — "Warfare expanding across cyber, space, and conventional domains"
- `escalation-ladder` — nuclear + arms-race + russia-ukraine + china-tensions (min 2, boost 2.5) — "Conflict intensity climbing across theaters"

### Cross-Domain Red Alert
- `systemic-fragility` — sovereign-debt + supply-chain + cyberattack + extreme-weather (min 3, boost 2.5) — "Multiple system stress points converging — cascading failure risk"
- `polycrisis` — civil-unrest + food-security + inflation + extreme-weather + refugee-crisis (min 3, boost 3.0) — "Simultaneous crises reinforcing each other — monitor all fronts"

## New Fringe Narratives (16 → 31)

15 new entries:

- `grid-collapse` — grid collapse, power grid attack, blackout agenda, emp attack (Economy, emerging)
- `water-wars` — water privatization, water crisis engineered, water shortage agenda (Economy, watch)
- `lab-grown-food` — lab grown meat danger, fake food, synthetic food agenda, bug diet (Health, watch)
- `weather-manipulation` — weather weapon, haarp, geoengineering, chemtrail, weather control (Environment, **disinfo**)
- `15-minute-city` — 15 minute city, climate lockdown, movement restriction, open air prison (Society, spreading)
- `digital-id-control` — digital id, digital passport, biometric control, surveillance state (Society, watch)
- `bank-bail-in` — bail in, bank confiscation, savings seizure, bank theft (Finance, watch)
- `ai-takeover` — ai takeover, ai control, ai overlord, machine uprising, skynet (Tech, watch)
- `space-hoax` — space fake, moon landing hoax, flat earth, nasa lie (Tech, **disinfo**)
- `cyber-false-flag` — cyber false flag, staged cyberattack, internet kill switch (Security, watch)
- `demographic-replacement` — great replacement, replacement migration, demographic engineering (Society, **disinfo**)
- `pharma-conspiracy` — big pharma conspiracy, suppressed cure, medical coverup (Health, watch)
- `controlled-demolition` — controlled demolition economy, planned collapse, intentional crash (Finance, watch)
- `sovereignty-erosion` — sovereignty erosion, who treaty, un takeover, global governance (Political, emerging)

## New Mainstream Narratives (22 → 51)

29 new entries:

### Global — Geopolitics & Security
- `new-cold-war` — new cold war, great power competition, bloc rivalry (Geopolitics)
- `taiwan-contingency` — taiwan strait, taiwan invasion, taiwan contingency, cross-strait (Geopolitics)
- `arctic-competition` — arctic race, arctic military, northern sea route, arctic resource (Geopolitics)
- `nuclear-posture` — nuclear deterrent, nuclear modernization, nuclear treaty, arms control (Security)
- `cyber-threat-landscape` — cyber threat, ransomware wave, state hacker, cyber defense (Security)

### Global — Economy & Finance
- `debt-spiral` — debt ceiling, fiscal crisis, national debt, credit downgrade, bond sell-off (Economy)
- `de-globalization` — reshoring, nearshoring, friend-shoring, onshoring, supply chain diversif (Economy)
- `crypto-regulation` — crypto regulation, stablecoin law, defi regulation, sec crypto (Finance)
- `commodity-super-cycle` — commodity boom, super cycle, commodity rally, resource nationalism (Economy)

### Global — Climate & Energy
- `energy-security` — energy security, energy independence, energy crisis, grid resilience (Economy)
- `climate-tipping-point` — tipping point, point of no return, climate emergency, record heat, record warm (Environment)
- `extreme-weather-impact` — extreme weather, unprecedented storm, record flood, climate disaster, weather catastrophe (Environment)

### Global — Tech & Society
- `ai-arms-race` — ai race, ai competition, ai supremacy, ai dominance, ai lead (Tech)
- `social-media-regulation` — social media ban, platform regulation, content moderation, section 230 (Tech)
- `space-race` — space race, moon race, mars race, commercial space, space economy (Tech)

### Global — Partisan Framing (Option A)
- `conservative-framing` — woke, radical left, socialist agenda, government overreach, nanny state, war on freedom, cancel culture, leftist mob, virtue signal (Politics)
- `progressive-framing` — far-right, maga extremis, threat to democracy, white nationalis, climate denier, book ban, assault on rights, fascis, authoritarian (Politics)

### Global — Frame Battles (Option B)
- `immigration-security-frame` — border crisis, illegal crossing, illegal alien, border invasion, cartel threat, migrant crime (Politics)
- `immigration-humanitarian-frame` — asylum seeker, refugee rights, family separation, dreamer, undocumented worker, humanitarian border (Politics)
- `climate-urgency-frame` — climate emergency, climate crisis, existential threat, planet burning, code red (Environment)
- `climate-skeptic-frame` — climate hoax, climate alarmis, green scam, climate hysteria, climate grift (Environment)
- `gun-rights-frame` — second amendment, gun rights, right to bear, gun freedom, armed citizen, self defense (Politics)
- `gun-control-frame` — gun violence epidemic, mass shooting, gun reform, gun safety, ban assault (Politics)
- `ai-optimist-frame` — ai breakthrough, ai revolution, ai opportunity, ai potential, ai benefit, ai progress (Tech)
- `ai-alarmist-frame` — ai threat, ai danger, ai risk, ai destroy, ai replace, ai out of control, ai unsafe (Tech)

### Brazil Specific
- `brazil-cyber` — ciberataque, vazamento de dados, hacker brasil, segurança digital (Security)
- `brazil-climate` — seca, enchente, chuva extrema, desastre climático, evento extremo (Environment)
- `brazil-fiscal-crisis` — dívida pública, risco fiscal, nota de crédito, spread soberano (Economy)
- `brazil-corruption` — corrupção, propina, lavagem de dinheiro, desvio, peculato, improbidade, delação, operação policial federal, licitação irregular, superfaturamento, caixa dois, tráfico de influência (Politics)

### Brazil — Partisan Framing
- `brazil-right-framing` — esquerdista, comunista, marxista, doutrinação, ideologia de gênero, vagabundo, mamata, petralha, bolivariano, ditadura do judiciário, ativismo judicial, aparelhamento (Politics)
- `brazil-left-framing` — fascista, golpista, miliciano, genocida, negacionista, bolsonarismo, extrema direita, ameaça à democracia, discurso de ódio, ataque às instituições, desmatador, entreguista (Politics)

### Brazil — Frame Battles
- `brazil-security-hardline` — bandido bom é bandido morto, armar o cidadão, excludente de ilicitude, redução da maioridade, tolerância zero, mão dura (Politics)
- `brazil-security-rights` — violência policial, genocídio da juventude negra, encarceramento em massa, desmilitarização, direitos humanos, abuso de autoridade (Politics)
- `brazil-economy-liberal` — privatização, estado inchado, carga tributária, livre mercado, desburocratização, menos estado, reforma administrativa (Economy)
- `brazil-economy-statist` — papel do estado, investimento público, programa social, soberania nacional, empresa estratégica, neoliberal, privataria, desmonte (Economy)
- `brazil-environment-dev` — soberania sobre amazônia, progresso, agronegócio, marco temporal, mineração, desenvolvimento sustentável, regularização fundiária (Environment)
- `brazil-environment-prot` — desmatamento recorde, ecocídio, crime ambiental, terra indígena, proteção ambiental, garimpo ilegal, destruição ambiental (Environment)

## What Stays Unchanged

- All analysis logic (`correlation.ts`, `narrative.ts`, `main-character.ts`)
- Person patterns (20 entries)
- Source weights and source types
- UI components and type definitions

## Risks

- **False positives from broad regex**: Mitigated by multi-word patterns and 2+ mention thresholds
- **Config file size growth**: ~18KB → ~35KB estimated, still trivial
- **Frame battle noise**: Partisan terms are frequent; existing minimum thresholds self-regulate

## Final Tally

| Category | Before | After | Added |
|---|---|---|---|
| Correlation Topics | 20 | 41 | +21 |
| Compound Signals | 16 | 36 | +20 |
| Fringe Narratives | 16 | 31 | +15 |
| Mainstream Narratives | 22 | 51 | +29 |
| **Total entries** | **74** | **159** | **+85** |
