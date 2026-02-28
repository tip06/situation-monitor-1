/**
 * Analysis configuration - correlation topics, narrative patterns, source classification
 */

import type { Locale } from '$lib/i18n/types';
import type { NewsCategory } from '$lib/types';

export interface CorrelationTopic {
	id: string;
	patterns: RegExp[];
	category: string;
}

// Source credibility weights for weighted scoring
export const SOURCE_WEIGHTS: Record<string, number> = {
	// Tier 1: Major wire services (weight: 1.5)
	reuters: 1.5,
	ap: 1.5,
	afp: 1.5,

	// Tier 2: Major outlets (weight: 1.2)
	bbc: 1.2,
	nytimes: 1.2,
	wsj: 1.2,
	wapo: 1.2,
	guardian: 1.2,
	cnn: 1.2,
	ft: 1.2,
	economist: 1.2,

	// Tier 3: Standard outlets (weight: 1.0) - default
	// All unlisted sources get 1.0

	// Tier 4: Partisan/tabloid (weight: 0.7)
	breitbart: 0.7,
	dailymail: 0.7,
	nypost: 0.7,

	// Tier 5: Fringe (weight: 0.4)
	zerohedge: 0.4,
	infowars: 0.4,
	naturalnews: 0.4
};

export function getSourceWeight(source: string): number {
	const normalized = source.toLowerCase().replace(/[^a-z]/g, '');
	for (const [key, weight] of Object.entries(SOURCE_WEIGHTS)) {
		if (normalized.includes(key)) return weight;
	}
	return 1.0; // Default weight
}

// Compound patterns for cross-topic correlation detection
export interface CompoundPattern {
	id: string;
	topics: string[]; // Topic IDs that must co-occur
	minTopics: number; // Minimum topics required (default: all)
	name: string;
	keyJudgments: string[];
	indicators: string[]; // Concrete metrics/data points to monitor
	confirmationSignals: string[]; // How to confirm the pattern is active
	assumptions: string[];
	changeTriggers: string[];
	boostFactor: number; // Score multiplier when detected
}

export type CompoundPatternAdditionCategory =
	| 'keyJudgments'
	| 'confirmationSignals'
	| 'assumptions'
	| 'indicators'
	| 'changeTriggers';

export type CompoundPatternManualAdditions = Record<
	string,
	Partial<Record<CompoundPatternAdditionCategory, string[]>>
>;

export const COMPOUND_PATTERN_MANUAL_ADDITIONS_BY_LOCALE: Record<Locale, CompoundPatternManualAdditions> = {
	en: {},
	'pt-BR': {}
};

const COMPOUND_PATTERN_MANUAL_STORAGE_KEY = 'compoundPatternManualAdditions.v1';

function canUseLocalStorage(): boolean {
	return typeof localStorage !== 'undefined';
}

function mergeCompoundPatternAdditions(
	base: CompoundPatternManualAdditions,
	extra: CompoundPatternManualAdditions
): CompoundPatternManualAdditions {
	const merged: CompoundPatternManualAdditions = { ...base };
	for (const [id, additions] of Object.entries(extra)) {
		const existing = merged[id] ?? {};
		merged[id] = {
			keyJudgments: [...(existing.keyJudgments ?? []), ...(additions.keyJudgments ?? [])],
			confirmationSignals: [
				...(existing.confirmationSignals ?? []),
				...(additions.confirmationSignals ?? [])
			],
			assumptions: [...(existing.assumptions ?? []), ...(additions.assumptions ?? [])],
			indicators: [...(existing.indicators ?? []), ...(additions.indicators ?? [])],
			changeTriggers: [...(existing.changeTriggers ?? []), ...(additions.changeTriggers ?? [])]
		};
	}
	return merged;
}

function loadAllManualAdditionsFromStorage(): Record<string, CompoundPatternManualAdditions> {
	if (!canUseLocalStorage()) return {};
	try {
		const raw = localStorage.getItem(COMPOUND_PATTERN_MANUAL_STORAGE_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== 'object') return {};
		return parsed as Record<string, CompoundPatternManualAdditions>;
	} catch {
		return {};
	}
}

export function loadCompoundPatternManualAdditions(locale: Locale): CompoundPatternManualAdditions {
	const base = COMPOUND_PATTERN_MANUAL_ADDITIONS_BY_LOCALE[locale] ?? {};
	if (!canUseLocalStorage()) return base;
	const all = loadAllManualAdditionsFromStorage();
	const stored = all[locale] ?? {};
	return mergeCompoundPatternAdditions(base, stored);
}

export function saveCompoundPatternManualAdditions(
	locale: Locale,
	additions: CompoundPatternManualAdditions
): void {
	if (!canUseLocalStorage()) return;
	const all = loadAllManualAdditionsFromStorage();
	all[locale] = additions;
	try {
		localStorage.setItem(COMPOUND_PATTERN_MANUAL_STORAGE_KEY, JSON.stringify(all));
	} catch {
		// no-op
	}
}

export function appendCompoundPatternManualAddition(
	locale: Locale,
	id: string,
	category: CompoundPatternAdditionCategory,
	text: string
): CompoundPatternManualAdditions {
	const trimmed = text.trim();
	if (!trimmed) return loadCompoundPatternManualAdditions(locale);
	const current = loadCompoundPatternManualAdditions(locale);
	const updated = mergeCompoundPatternAdditions(current, {
		[id]: {
			[category]: [trimmed]
		}
	});
	saveCompoundPatternManualAdditions(locale, updated);
	return updated;
}

export const COMPOUND_PATTERNS: CompoundPattern[] = [
	{
		id: 'trade-war-escalation',
		topics: ['tariffs', 'china-tensions', 'supply-chain'],
		minTopics: 2,
		name: 'Trade War Escalation',
		keyJudgments: ['Escalating tariff rounds between the US, China, and EU are fragmenting global supply chains and forcing supplier diversification at elevated cost.', 'Brazil faces higher input costs for manufactured goods and commodity price volatility as trade flows redirect through alternative corridors.', 'Brazilian military should review import dependency on strategic technology components as procurement channels narrow.'],
		indicators: ['US-China and US-EU bilateral tariff rate schedules; WTO dispute filing frequency', 'Shanghai Containerized Freight Index (SCFI); Baltic Dry Index (BDI)', 'Brazilian customs revenue monthly variance; MDIC export diversion volume by partner'],
		confirmationSignals: ['Reciprocal tariff announcements or WTO dispute filings registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Container freight rates or trade finance spreads moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian export diversion volume or customs revenue data tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Neither bloc agrees to a verifiable tariff freeze or WTO-mediated truce within the near term remains operative: no verifiable tariff freeze or WTO-mediated truce has been agreed within the near term.', 'No rapid policy resolution emerges: a bilateral US-China phase deal that lifts core tariff schedules has not materialized.', 'Brazil\'s exposure channel is intact: Brazilian export and import partners have not fully decoupled from affected trade corridors.'],
		changeTriggers: ['US-China tariff announcements falls below detection threshold or major-bloc trade restrictions reverses course across three or more consecutive refresh cycles.', 'A bilateral trade framework achieves tariff rollback on at least 50% of contested goods categories on the disputed product schedules.', 'Brazilian trade balance with affected partners breaks correlation with global driver direction across three or more consecutive monitoring cycles.'],
		boostFactor: 1.5
	},
	{
		id: 'stagflation-risk',
		topics: ['inflation', 'fed-rates', 'layoffs'],
		minTopics: 2,
		name: 'Stagflation Risk',
		keyJudgments: ['Persistent above-target inflation alongside rising unemployment creates the dual-squeeze characteristic of stagflation, constraining both fiscal and monetary policy responses.', 'Brazil faces higher borrowing costs and weakened consumer demand simultaneously, compressing government revenue and household purchasing power.', 'Brazilian military should monitor defense budget stability as fiscal compression from stagflation may reduce procurement and readiness funding.'],
		indicators: ['US CPI (headline and core); PCE deflator; monthly initial jobless claims', 'US 2y/10y Treasury yield spread; 5-year breakeven inflation rate', 'Brazilian IPCA monthly print; Selic forward rate curve (B3 DI futures)'],
		confirmationSignals: ['CPI or PCE readings above central bank targets alongside rising initial jobless claims registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Yield curve flattening or long-term inflation expectations rising above 3% moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian IPCA trajectory or Selic rate guidance tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Inflation persistence remains operative: supply-side constraints or demand resilience prevents rapid price normalization without deep recession.', 'No rapid policy resolution emerges: no credible supply shock reversal or wage-price de-escalation pact has materialized in the primary economies.', 'Brazil\'s exposure channel is intact: Brazil\'s commodity-export revenues do not fully offset the household and fiscal cost pressures imported from advanced economies.'],
		changeTriggers: ['Core inflation falls below detection threshold or unemployment rate reverses course across three or more consecutive refresh cycles.', 'A coordinated G7 supply-side policy package achieves measurable CPI deceleration below 3% annualized in two consecutive quarters on the headline metric.', 'Brazilian IPCA breaks correlation with US-EU inflation trends across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'geopolitical-crisis',
		topics: ['russia-ukraine', 'israel-gaza', 'china-tensions'],
		minTopics: 2,
		name: 'Multi-Front Geopolitical Crisis',
		keyJudgments: ['Simultaneous active conflict theaters in Europe and the Middle East fragment global risk appetite, raise insurance premia, and divert NATO and US strategic attention.', 'Brazil faces higher commodity import costs and export insurance rates as markets price multi-theater conflict risk into freight and energy benchmarks.', 'Brazilian military should increase monitoring of maritime corridor security and coordinate contingency planning for potential supply disruption scenarios.'],
		indicators: ['CBOE VIX index; ACLED monthly conflict event count across active theaters', 'Brent crude spot price; global shipping insurance war-risk premium', 'Brazilian sovereign CDS 5-year spread; EMBI+ Brazil spread'],
		confirmationSignals: ['Battlefield escalation reports from two or more distinct conflict theaters registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'VIX or energy volatility indices moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian CDS spreads or logistics cost indices tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Active kinetic conflict in at least two theaters remains operative: no ceasefire or territorial settlement has been reached in either theater simultaneously.', 'No rapid policy resolution emerges: neither a Ukraine peace framework nor a Gaza ceasefire deal with broad international adherence has materialized.', 'Brazil\'s exposure channel is intact: global commodity and insurance markets continue to price multi-front conflict risk into rates affecting Brazilian importers.'],
		changeTriggers: ['Active conflict reporting from both theaters falls below detection threshold or both conflicts enter verified ceasefire across three or more consecutive refresh cycles.', 'A durable peace agreement achieves cessation of hostilities ratified by major parties on at least one of the two primary conflict theaters.', 'Brazilian freight and energy cost indices breaks correlation with multi-theater conflict intensity across three or more consecutive monitoring cycles.'],
		boostFactor: 2
	},
	{
		id: 'tech-regulatory-storm',
		topics: ['ai-regulation', 'big-tech', 'crypto'],
		minTopics: 2,
		name: 'Tech Regulatory Storm',
		keyJudgments: ['Concurrent antitrust, AI safety, and crypto enforcement actions across the US and EU are raising compliance burdens and constraining platform business models simultaneously.', 'Brazil faces indirect effects through delayed product rollouts, higher licensing costs for Brazilian tech firms dependent on US or EU platforms, and regulatory precedent diffusion.', 'Brazilian military should track AI governance developments affecting procurement and integration of commercial AI capabilities for defense applications.'],
		indicators: ['EU DMA/DSA enforcement action count; US DOJ/FTC antitrust filing volume', 'Nasdaq 100 tech sector P/E ratio; VC funding round volume', 'Brazilian ANPD enforcement notice count; ANATEL regulatory calendar'],
		confirmationSignals: ['Regulatory enforcement actions, fines, or binding legislation targeting AI, big tech, or crypto registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Tech equity valuations or VC investment levels in affected sectors moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian ANATEL, ANPD, or CGI regulatory alignment actions tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Regulatory momentum remains operative: legislative coalitions or agency enforcement priorities supporting concurrent action have not fragmented.', 'No rapid policy resolution emerges: no broad tech safe-harbor agreement or regulatory moratorium that pauses enforcement has materialized.', 'Brazil\'s exposure channel is intact: Brazilian tech sector dependency on regulated platforms or compliance cost pass-through remains significant.'],
		changeTriggers: ['AI enforcement actions falls below detection threshold or antitrust litigation volume reverses course across three or more consecutive refresh cycles.', 'A US-EU regulatory alignment agreement achieves a unified compliance framework reducing duplicative enforcement burden on at least two major platform categories.', 'Brazilian tech sector investment and regulatory posture breaks correlation with US-EU enforcement cycles across three or more consecutive monitoring cycles.'],
		boostFactor: 1.4
	},
	{
		id: 'financial-stress',
		topics: ['bank-crisis', 'fed-rates', 'housing'],
		minTopics: 2,
		name: 'Financial Sector Stress',
		keyJudgments: ['Rising interest rates combined with deteriorating housing collateral values are compressing bank net interest margins and increasing non-performing loan ratios in key markets.', 'Brazil faces tighter external financing conditions and potential capital outflows as global risk-off sentiment increases demand for safe-haven assets.', 'Brazilian military should monitor budgetary financing conditions as sovereign borrowing costs may rise in correlation with global financial stress.'],
		indicators: ['KBW Bank Index (BKX); SOFR-OIS spread', 'ICE BofA Investment Grade Corporate Bond spread; mortgage delinquency rate', 'Brazilian bank sector EMBI+; BACEN settlement failure count'],
		confirmationSignals: ['Bank equity sell-offs, deposit outflows, or credit default swap widening for systemically important financial institutions registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Investment-grade corporate bond spreads or interbank lending rates moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian bank stress indicators or EMBI+ Brazil spread tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Bank solvency pressure remains operative: central bank liquidity facilities have not fully backstopped the vulnerable institutions identified in market pricing.', 'No rapid policy resolution emerges: no coordinated emergency banking sector bailout or deposit guarantee expansion sufficient to restore confidence has materialized.', 'Brazil\'s exposure channel is intact: Brazilian banks\' cross-border exposure and external funding lines maintain correlation with stressed global banking conditions.'],
		changeTriggers: ['Bank solvency stress indicators falls below detection threshold or housing collateral values stabilize across three or more consecutive refresh cycles.', 'A central bank or treasury intervention achieves measurable normalization of interbank spreads and deposit flows within a 30-day window on the primary institutions.', 'Brazilian banking sector capital ratios and external funding costs breaks correlation with global banking stress indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'nuclear-escalation',
		topics: ['russia-ukraine', 'iran', 'nuclear'],
		minTopics: 2,
		name: 'Nuclear Escalation',
		keyJudgments: ['Explicit nuclear signaling by Russia or hardened Iranian enrichment timelines raise the probability of compelled deterrence responses and emergency diplomatic mobilization.', 'Brazil faces pronounced commodity and risk premium spikes as nuclear signaling events trigger global safe-haven flight and energy market repricing.', 'Brazilian military should maintain elevated strategic awareness and contribute to multilateral non-proliferation diplomatic signaling through appropriate forums.'],
		indicators: ['IAEA safeguards compliance status; nuclear enrichment level disclosures', 'Gold spot price (XAU/USD); CBOE VIX', 'Brazilian Itamaraty non-proliferation statement frequency; IAEA voting record'],
		confirmationSignals: ['Nuclear weapons deployment alerts, doctrine revision announcements, or IAEA threshold breaches registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Gold prices, oil benchmarks, or nuclear-sensitive equity sectors moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian foreign ministry or IAEA engagement posture tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Nuclear signaling escalation remains operative: no verified stand-down order, inspection agreement, or hotline communication has reduced threat posture.', 'No rapid policy resolution emerges: no bilateral nuclear risk reduction agreement between the signaling state and the US or NATO has materialized.', 'Brazil\'s exposure channel is intact: global commodity and risk markets continue to price nuclear signaling into benchmarks that affect Brazilian export and import prices.'],
		changeTriggers: ['Nuclear threat rhetoric falls below detection threshold or IAEA monitoring access is restored across three or more consecutive refresh cycles.', 'A verified nuclear risk reduction agreement achieves inspectable stand-down of specific deployed or enriched nuclear assets on the specific escalation timeline.', 'Brazilian sovereign risk and commodity export revenues breaks correlation with nuclear signaling intensity across three or more consecutive monitoring cycles.'],
		boostFactor: 2.5
	},
	{
		id: 'middle-east-escalation',
		topics: ['israel-gaza', 'iran'],
		minTopics: 2,
		name: 'Middle East Escalation',
		keyJudgments: ['Iran-backed proxy activation and direct Iran-Israel confrontation risk are converging, raising the probability of Strait of Hormuz disruption and Suez shipping slowdown.', 'Brazil faces oil price surges and elevated shipping insurance premiums as Mideast escalation pressures energy and freight markets critical to Brazilian imports.', 'Brazilian military should track maritime security developments in the Red Sea and Persian Gulf for implications to naval logistics and fuel supply planning.'],
		indicators: ['Brent crude spot price; Strait of Hormuz / Red Sea vessel transit counts', 'Tanker war-risk insurance premium (BIMCO); Lloyd\'s energy surcharges', 'Brazilian ANP weekly fuel import price; Petrobras crude acquisition cost'],
		confirmationSignals: ['Direct strikes, drone swarm attacks, or naval interdiction events in the Persian Gulf or Red Sea corridor registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Brent crude oil prices or tanker insurance rates moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian fuel import pricing or Petrobras hedging activity tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Iran regional force projection remains operative: IRGC and proxy forces maintain operational capacity and willingness to escalate beyond the current engagement level.', 'No rapid policy resolution emerges: no Iran-Israel backchannel ceasefire or US-Iran diplomatic reopening has materialized that would reduce proxy operations.', 'Brazil\'s exposure channel is intact: Brazilian energy imports remain priced against Brent benchmarks and shipping routes transiting the affected corridor.'],
		changeTriggers: ['Iranian proxy activity reports falls below detection threshold or Israel-Gaza combat operations reverses course across three or more consecutive refresh cycles.', 'A US-Iran diplomatic engagement achieves verifiable reduction in IRGC proxy activation on at least two active proxy fronts simultaneously.', 'Brazilian fuel import cost and tanker routing breaks correlation with Mideast escalation metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'energy-supply-shock',
		topics: ['russia-ukraine', 'iran', 'supply-chain'],
		minTopics: 2,
		name: 'Energy Supply Shock',
		keyJudgments: ['Conflict-driven disruption to Russian gas exports and Middle Eastern oil flows is removing supply cushion precisely as northern hemisphere demand peaks, triggering abrupt price spikes.', 'Brazil faces fuel and electricity cost increases that pass through to industrial production costs, transportation, and household utility bills.', 'Brazilian military should review operational fuel reserves and logistics supply chain resilience assumptions for sustained deployments.'],
		indicators: ['Henry Hub gas spot; TTF European gas price; Brent crude front-month', 'European gas storage fill rate (AGSI+); LNG cargo spot freight rate', 'Brazilian ANP weekly fuel price survey; ANEEL electricity tariff adjustment flag'],
		confirmationSignals: ['Gas storage drawdown warnings, OPEC+ emergency production announcements, or pipeline closure reports registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Henry Hub, TTF, or Brent spot prices moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian ANP fuel price data or electricity tariff adjustment announcements tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Supply route disruption remains operative: alternative pipeline or LNG supply expansion has not compensated for the disrupted volume within the assessment window.', 'No rapid policy resolution emerges: no emergency OPEC+ production increase or US strategic reserve release sufficient to fully offset the supply gap has materialized.', 'Brazil\'s exposure channel is intact: Brazilian energy pricing mechanisms maintain pass-through linkage to international benchmarks.'],
		changeTriggers: ['Pipeline or maritime energy flow disruption reports falls below detection threshold or OPEC+ production agreements reverse course across three or more consecutive refresh cycles.', 'A verified emergency supply agreement achieves restoration of at least 80% of disrupted supply volume on the specific affected corridor within 60 days.', 'Brazilian domestic fuel prices breaks correlation with international energy benchmarks across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'recession-signal',
		topics: ['layoffs', 'housing', 'fed-rates'],
		minTopics: 2,
		name: 'Recession Signal',
		keyJudgments: ['Simultaneous labor market softening, housing demand contraction, and restrictive monetary policy are aligning with the leading indicator profile that has historically preceded recessions.', 'Brazil faces weakened demand for commodity exports, reduced foreign direct investment inflows, and tighter domestic credit as US or EU recession reduces global growth.', 'Brazilian military should prepare for potential defense budget pressure if a global recession reduces government revenues and triggers fiscal austerity.'],
		indicators: ['US ISM Manufacturing/Services PMI; Conference Board Leading Economic Index', 'US 3m/10y Treasury yield spread inversion duration; Consumer Confidence Index', 'Brazilian trade surplus monthly (MDIC); BCB capital flow balance (IDP)'],
		confirmationSignals: ['Negative PMI readings, rising jobless claims, or inverted yield curve persistence registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Leading economic index declines or consumer confidence indices below recessionary thresholds moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian trade surplus compression or capital flow data tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Monetary policy transmission remains operative: rate hikes have not yet triggered sufficient demand destruction to resolve inflation without broader economic contraction.', 'No rapid policy resolution emerges: no emergency Fed rate cut cycle or major fiscal stimulus package sufficient to reflate growth has materialized.', 'Brazil\'s exposure channel is intact: Brazilian export revenues and foreign investment inflows maintain sensitivity to US or EU growth conditions.'],
		changeTriggers: ['Jobless claims falls below detection threshold or housing starts reverse course to positive territory across three or more consecutive refresh cycles.', 'A central bank pivot achieves measurable yield curve normalization and PMI recovery above 50 on two consecutive monthly readings on the primary leading indicators.', 'Brazilian GDP growth and trade volumes breaks correlation with US-EU economic cycle indicators across three or more consecutive monitoring cycles.'],
		boostFactor: 1.9
	},
	{
		id: 'inflation-spiral',
		topics: ['inflation', 'supply-chain', 'climate'],
		minTopics: 2,
		name: 'Inflation Spiral',
		keyJudgments: ['Climate-driven agricultural supply shocks and logistics bottlenecks are compounding monetary inflation, creating a self-reinforcing price feedback loop across food and energy.', 'Brazil faces elevated food export price volatility alongside domestic food inflation that compresses household purchasing power and increases social pressure.', 'Brazilian military should monitor procurement cost pressures for fuel, food, and maintenance inputs as inflation erodes operational budgets.'],
		indicators: ['FAO Food Price Index; IEA energy price composite', 'CBOT wheat, corn, and soybean front-month futures', 'Brazilian IPCA food basket sub-component; ANP diesel price index'],
		confirmationSignals: ['CPI readings accelerating above prior-month pace alongside freight cost index increases registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Agricultural commodity futures or energy input costs moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian IPCA food basket component tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Supply-demand imbalance remains operative: crop or logistics disruption has not resolved and no substitute supply source has emerged at scale.', 'No rapid policy resolution emerges: no emergency international food reserve release or logistics corridor restoration sufficient to break the spiral has materialized.', 'Brazil\'s exposure channel is intact: Brazilian food and fuel pricing remains linked to international commodity benchmarks through domestic pricing policy.'],
		changeTriggers: ['CPI acceleration falls below detection threshold or freight cost indices reverse course across three or more consecutive refresh cycles.', 'A coordinated international food reserve release achieves measurable agricultural price normalization within two consecutive monthly CPI cycles on the food basket component.', 'Brazilian IPCA food component breaks correlation with global agricultural commodity indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.6
	},
	{
		id: 'dollar-stress',
		topics: ['fed-rates', 'crypto', 'china-tensions'],
		minTopics: 2,
		name: 'Dollar Stress',
		keyJudgments: ['Simultaneous pressure from restrictive Fed policy, crypto market contagion, and US-China financial decoupling is creating uncertainty about dollar funding availability in global interbank markets.', 'Brazil faces currency depreciation pressure and higher dollar-denominated debt servicing costs as the Real weakens against a stressed but still dominant dollar.', 'Brazilian military should assess foreign-currency denominated procurement and debt obligations for refinancing risk if dollar funding conditions tighten.'],
		indicators: ['DXY US Dollar Index; Federal Reserve balance sheet weekly change', 'JPMorgan EM Currency Index (EMCI); US Treasury 10-year real yield', 'BRL/USD spot rate; BCB FX intervention volume'],
		confirmationSignals: ['DXY dollar index moves above 110 or dollar swap line activation reports from major central banks registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Emerging market currency declines or US Treasury yields moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Real exchange rate or BCB reserve intervention data tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Dollar funding scarcity remains operative: Fed balance sheet normalization has not been reversed and alternative reserve currencies have not achieved sufficient liquidity depth.', 'No rapid policy resolution emerges: no Fed pivot or coordinated central bank dollar swap line expansion sufficient to relieve EM funding stress has materialized.', 'Brazil\'s exposure channel is intact: Brazil\'s external debt profile and trade invoicing practices maintain significant sensitivity to dollar funding conditions.'],
		changeTriggers: ['Dollar funding stress indicators falls below detection threshold or DXY reverses course below 105 across three or more consecutive refresh cycles.', 'A Fed pivot or G10 coordinated swap line expansion achieves measurable normalization of EM currency and credit conditions within 30 days on the primary funding metrics.', 'Brazilian Real and external debt conditions breaks correlation with DXY and global dollar funding stress across three or more consecutive monitoring cycles.'],
		boostFactor: 1.5
	},
	{
		id: 'ai-disruption-wave',
		topics: ['ai-regulation', 'layoffs', 'big-tech'],
		minTopics: 2,
		name: 'AI Disruption Wave',
		keyJudgments: ['Rapid AI deployment by major tech employers is accelerating white-collar job displacement faster than workforce reskilling programs can absorb, creating structural unemployment in cognitive tasks.', 'Brazil faces a widening skills gap as domestic labor markets for administrative, legal, and analytical roles contract without adequate transition programs for affected workers.', 'Brazilian military should track AI labor displacement in technical and analytical roles relevant to cyber, intelligence, and logistics workforce planning.'],
		indicators: ['Stanford HAI AI Index enterprise adoption rate; global AI patent filing volume (WIPO)', 'US tech sector payroll change (BLS); enterprise AI capex spend', 'Brazilian SENAI AI reskilling enrollment; IBGE PNAD IT sector employment'],
		confirmationSignals: ['Mass tech sector layoff announcements explicitly citing AI automation as the driver registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'AI patent filings or enterprise AI adoption spending growth rates moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian IT sector employment data or SENAI/SENAC reskilling program demand tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['AI capability deployment rate remains operative: no regulatory pause or technical plateau has materially slowed enterprise AI adoption across the primary sectors.', 'No rapid policy resolution emerges: no comprehensive retraining program or AI labor transition fund at scale in the primary economies has materialized.', 'Brazil\'s exposure channel is intact: Brazilian labor markets in service, administrative, and analytical sectors remain exposed to displacement from AI tools developed abroad.'],
		changeTriggers: ['AI-driven layoff announcements falls below detection threshold or AI adoption rates reverse course across three or more consecutive refresh cycles.', 'A major economy implements a universal AI transition support program achieves measurable reduction in structural tech unemployment on the primary affected occupational categories.', 'Brazilian IT and service sector employment trends breaks correlation with global AI adoption and tech layoff cycles across three or more consecutive monitoring cycles.'],
		boostFactor: 1.6
	},
	{
		id: 'disinfo-storm',
		topics: ['deepfake', 'election', 'ai-regulation'],
		minTopics: 2,
		name: 'Disinfo Storm',
		keyJudgments: ['Election cycles are being exploited through coordinated synthetic media campaigns that combine deepfake video, AI-generated text, and inauthentic amplification networks to degrade public information quality.', 'Brazil faces elevated disinformation risk as its electoral calendar and social media penetration make it a high-value target for foreign influence operations and domestic political manipulation.', 'Brazilian military should strengthen communications verification protocols and support election security through lawful coordination with electoral authorities.'],
		indicators: ['EU DSA transparency report deepfake removal volume; Meta/Google coordinated inauthentic behavior takedown count', 'Election integrity NGO alert count (NDI, IRI, IFES)', 'Brazilian TSE platform content removal reports; ANPD data incident notifications'],
		confirmationSignals: ['Documented deepfake incidents targeting electoral candidates or verified coordinated inauthentic behavior takedowns registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Election integrity NGO alerts or EU disinformation monitoring system reports moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian TSE election monitoring reports or platform transparency reports on Brazil-specific coordinated behavior tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Adversarial actor intent remains operative: foreign state actors or domestic political networks retain motivation and capability to deploy synthetic media during the election window.', 'No rapid policy resolution emerges: no platform-wide deepfake detection mandate or international information integrity agreement sufficient to suppress campaign-scale synthetic media has materialized.', 'Brazil\'s exposure channel is intact: Brazilian social media users and media consumers remain exposed to synthetic content originating from or targeting Brazilian political discourse.'],
		changeTriggers: ['Deepfake incident frequency falls below detection threshold or coordinated inauthentic behavior campaigns reverse course across three or more consecutive refresh cycles.', 'A multi-platform verified synthetic media detection deployment achieves measurable reduction in election-targeted deepfake reach on the primary social platforms within the electoral cycle.', 'Brazilian electoral disinformation incident rates breaks correlation with global AI-enabled influence operation trends across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'pandemic-redux',
		topics: ['pandemic', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Pandemic Redux',
		keyJudgments: ['A high-transmissibility pathogen with partial immune evasion is progressing from localized outbreak to multi-country spread, triggering border and travel restriction discussions.', 'Brazil faces health system pressure and supply chain disruption as pharmaceutical imports, medical PPE, and essential goods logistics are prioritized by affected source countries.', 'Brazilian military should review pandemic response plans and assess capacity to support civil health authorities and maintain operational readiness under quarantine protocols.'],
		indicators: ['WHO Disease Outbreak News event count; R-effective estimate for novel pathogens', 'Global airline seat capacity (OAG) decline rate; pharmaceutical supply disruption tracker', 'Brazilian InfoGripe sentinel surveillance alert level; ANVISA emergency import authorization count'],
		confirmationSignals: ['WHO Phase 4 or higher outbreak declarations, or national emergency declarations in two or more countries simultaneously registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Global air passenger volume declines or pharmaceutical supply disruption alerts moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Ministry of Health alert level or ANVISA emergency import authorization activity tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Transmission potential remains operative: pathogen transmissibility and immune evasion characteristics have not materially worsened or improved from the initial assessment profile.', 'No rapid policy resolution emerges: no effective vaccine or antiviral has been deployed at population scale in the primary outbreak countries sufficient to break transmission chains.', 'Brazil\'s exposure channel is intact: Brazilian travel, trade, and pharmaceutical import links to affected countries maintain potential transmission of both disease burden and supply disruption.'],
		changeTriggers: ['WHO outbreak severity rating falls below detection threshold or transmission rate in primary countries reverses course across three or more consecutive refresh cycles.', 'Regulatory approval and deployment of an effective countermeasure achieves measurable case rate decline below pre-outbreak baseline in the primary affected country within 60 days.', 'Brazilian outbreak case rates breaks correlation with primary source country transmission trajectory across three or more consecutive monitoring cycles.'],
		boostFactor: 2
	},
	{
		id: 'climate-shock',
		topics: ['climate', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Climate Shock',
		keyJudgments: ['Intensified extreme weather events are causing simultaneous damage to agricultural output, transport infrastructure, and energy grid reliability across multiple regions.', 'Brazil faces direct exposure through crop damage in agricultural export regions, flooding of key river transport corridors, and power grid stress from heat waves.', 'Brazilian military should monitor potential demand for disaster response logistics support and assess resilience of military installations in high-exposure climate zones.'],
		indicators: ['NOAA/WMO global temperature anomaly; NDVI vegetation stress index', 'CME agricultural commodity futures; global freight disruption index', 'Brazilian INMET extreme weather event count; EMBRAPA crop yield forecast revision'],
		confirmationSignals: ['Category 4+ hurricanes, multi-state drought declarations, or concurrent wildfire and flood events in major agricultural regions registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Agricultural futures prices or freight logistics disruption indices moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian INMET extreme weather alerts or EMBRAPA crop yield forecast revisions tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Climate event intensity remains operative: the current season\'s extreme weather pattern has not reverted to historical average intensity.', 'No rapid policy resolution emerges: no emergency international climate adaptation funding or alternative supply corridor has been activated sufficient to offset the regional disruption.', 'Brazil\'s exposure channel is intact: Brazilian agricultural export regions and river transport infrastructure remain in active exposure zones for the climate events being tracked.'],
		changeTriggers: ['Extreme weather event frequency falls below detection threshold or agricultural damage assessments reverse course across three or more consecutive refresh cycles.', 'An emergency international supply reallocation achieves measurable restoration of affected agricultural output above 90% of baseline in the primary impacted region within two harvest cycles.', 'Brazilian agricultural production and logistics indices breaks correlation with global climate event severity metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.6
	},
	{
		id: 'social-pressure',
		topics: ['inflation', 'layoffs', 'immigration', 'election'],
		minTopics: 3,
		name: 'Social Pressure',
		keyJudgments: ['The simultaneous combination of cost-of-living pressure, rising unemployment, immigration backlash, and electoral polarization is creating conditions for sustained social instability across multiple democracies.', 'Brazil faces elevated risk of political violence and service disruption in urban centers where all four stressors overlap with existing inequality and governance deficits.', 'Brazilian military should maintain civil support readiness and coordinate with state security forces for potential escalation response under constitutional mandate.'],
		indicators: ['ACLED multi-country protest event count; EIU Political Stability Index', 'Consumer confidence composite (G7); electoral violence incident frequency', 'Brazilian IBGE social vulnerability index; PM public order operation count'],
		confirmationSignals: ['Multi-city protest events linked to at least three concurrent stress factors (inflation, unemployment, immigration, or election) registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Consumer confidence indices at multi-year lows or electoral violence incident counts moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian IBGE social vulnerability indices or state security incident reports tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Multi-factor stress convergence remains operative: all three required drivers are simultaneously elevated rather than sequentially rising and falling.', 'No rapid policy resolution emerges: no meaningful cost-of-living relief package, immigration policy reform, or electoral de-escalation agreement has materialized in the primary affected countries.', 'Brazil\'s exposure channel is intact: Brazil\'s urban inequality, political polarization, and economic stress levels maintain similar directionality to primary country trends.'],
		changeTriggers: ['Protest frequency falls below detection threshold or any two of the four social stress indicators reverse course across three or more consecutive refresh cycles.', 'A comprehensive social support package achieves measurable decline in hardship indices in at least two of the stress categories on primary measurement instruments within two quarters.', 'Brazilian social stability indicators breaks correlation with global social pressure composite indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'cyber-warfare-escalation',
		topics: ['state-hacking', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Cyber Warfare Escalation',
		keyJudgments: ['State-sponsored hacking groups operating with geopolitical backing are expanding targeting beyond espionage into disruptive attacks on critical infrastructure across NATO and partner nations.', 'Brazil faces elevated risk of opportunistic or retaliatory cyber intrusion targeting government networks, financial infrastructure, and energy systems as collateral spillover from geopolitical conflict.', 'Brazilian military should increase cyber readiness posture, accelerate threat-intelligence sharing with ANPD and CTIR.Gov, and review incident response protocols.'],
		indicators: ['CISA KEV catalog addition rate; Mandiant APT attribution report frequency', 'ENISA/CISA critical sector threat advisory rate; NTT Global Threat Intelligence volume', 'Brazilian CTIR.Gov monthly incident count; CERT.br attack source distribution'],
		confirmationSignals: ['Attribution reports linking major infrastructure intrusions to state-sponsored APT groups from Russia or China registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'CISA or EU ENISA emergency cyber threat advisories for critical sector operators moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian CTIR.Gov or CAIS incident volume reports tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['State actor operational authorization remains operative: geopolitical principals in Russia and China continue authorizing aggressive offensive cyber operations beyond peacetime espionage norms.', 'No rapid policy resolution emerges: no bilateral cyber norms agreement or escalation-limiting diplomatic channel has been activated to restrain infrastructure targeting.', 'Brazil\'s exposure channel is intact: Brazilian government and critical infrastructure networks remain connected to the global internet and use technology with known vulnerabilities being exploited in the primary conflict theaters.'],
		changeTriggers: ['State-attributed cyber incident frequency falls below detection threshold or Russian and Chinese APT group activity reverses course across three or more consecutive refresh cycles.', 'A verified bilateral cyber non-aggression framework achieves measurable reduction in state-attributed critical infrastructure targeting on a verifiable monitoring mechanism.', 'Brazilian government and critical infrastructure incident rates breaks correlation with global state-sponsored cyber tempo across three or more consecutive monitoring cycles.'],
		boostFactor: 2
	},
	{
		id: 'critical-infra-attack',
		topics: ['cyberattack', 'energy-transition', 'supply-chain'],
		minTopics: 2,
		name: 'Critical Infrastructure Attack',
		keyJudgments: ['The convergence of ransomware professionalization, state-sponsored targeting, and energy grid digitization is raising the probability of a high-impact infrastructure outage in a major economy.', 'Brazil faces grid, port, and water system vulnerability from the same attack vectors being demonstrated abroad, as critical infrastructure modernization outpaces cybersecurity investment.', 'Brazilian military should monitor critical infrastructure resilience and coordinate with ANEEL, ANA, and ANATEL on fallback operational capabilities for sustained outage scenarios.'],
		indicators: ['CISA ICS-CERT advisory count for OT/SCADA; industrial sector ransomware reports', 'Dragos/Claroty OT threat landscape incident frequency; cyber insurance premium index', 'Brazilian ANEEL grid incident log; ANTAQ port operational disruption count'],
		confirmationSignals: ['Power grid, water treatment, or port authority operational disruptions caused by confirmed cyber intrusion in a major economy registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Critical infrastructure sector insurance underwriting restrictions or national emergency declarations linked to cyber events moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian ANEEL or ANP grid incident alerts or port authority disruption reports tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Attacker capability and access remains operative: threat actors have pre-positioned access to critical infrastructure OT systems through prior espionage operations.', 'No rapid policy resolution emerges: no emergency national cybersecurity mandate or critical infrastructure segmentation sufficient to close known attack paths has been deployed.', 'Brazil\'s exposure channel is intact: Brazilian critical infrastructure systems share operational technology vendors and network architectures with systems successfully attacked in the primary theaters.'],
		changeTriggers: ['Critical infrastructure attack reports falls below detection threshold or disruptive intrusion campaigns reverse course across three or more consecutive refresh cycles.', 'A coordinated national critical infrastructure hardening program achieves verified closure of priority attack vectors on the primary OT systems within 90 days.', 'Brazilian critical infrastructure incident rates breaks correlation with global OT threat tempo across three or more consecutive monitoring cycles.'],
		boostFactor: 2.2
	},
	{
		id: 'cyber-financial-attack',
		topics: ['cyberattack', 'bank-crisis', 'credit-stress'],
		minTopics: 2,
		name: 'Cyber-Financial Attack',
		keyJudgments: ['Financial sector institutions under liquidity stress are simultaneously exposed to cyber intrusions that exploit reduced security staffing, distracted leadership, and degraded vendor management during crisis periods.', 'Brazil faces payment system disruption risk if a major correspondent bank or clearing system is compromised, as Brazilian financial institutions rely on international rails for dollar settlement.', 'Brazilian military should assess payroll and logistics payment systems for alternative routing if civilian financial infrastructure is disrupted.'],
		indicators: ['FS-ISAC threat bulletin rate; SWIFT Customer Security Programme attestation failures', 'Payment system downtime alerts (Visa/Mastercard/SWIFT); CISA financial sector advisory frequency', 'Brazilian BACEN PIX availability rate; BACEN RSFN settlement failure events'],
		confirmationSignals: ['Confirmed intrusions targeting systemically important financial institutions, payment clearinghouses, or SWIFT-connected banks registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Payment system downtime alerts or interbank settlement failure notices moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian BACEN PIX or RSFN incident reports or bank operational resilience notices tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Dual-stress conditions remain operative: targeted financial institutions are simultaneously managing cyber intrusion risk and financial solvency concerns, reducing incident response effectiveness.', 'No rapid policy resolution emerges: no emergency cross-sector cyber mutual aid protocol or financial sector isolation mechanism has been activated to contain spread.', 'Brazil\'s exposure channel is intact: Brazilian financial institutions\' correspondent banking relationships and SWIFT connectivity create exposure to disruption originating in targeted international institutions.'],
		changeTriggers: ['Cyber-financial incident reports falls below detection threshold or financial sector intrusion campaign reverses course across three or more consecutive refresh cycles.', 'An emergency financial sector resilience protocol achieves verified restoration of normal payment system operations and intrusion containment in the primary targeted institution within 72 hours.', 'Brazilian payment system reliability breaks correlation with global cyber-financial incident frequency across three or more consecutive monitoring cycles.'],
		boostFactor: 2
	},
	{
		id: 'energy-weaponization',
		topics: ['oil-opec', 'sanctions', 'russia-ukraine'],
		minTopics: 2,
		name: 'Energy Weaponization',
		keyJudgments: ['Major energy-exporting states are explicitly using supply control and pipeline diplomacy as coercive instruments, reducing the predictability of energy supply outside market mechanisms.', 'Brazil faces abrupt fuel cost spikes as energy weaponization events interrupt flows to European and Asian markets and redirect global demand toward alternative suppliers at higher prices.', 'Brazilian military should review fuel stock adequacy and supplier diversification options for extended operations if geopolitical energy disruptions persist beyond 90 days.'],
		indicators: ['AGSI+ European gas storage fill rate; government energy export restriction decree count', 'TTF gas spot price premium over Henry Hub; LNG diversion cargo count (KPLER)', 'Brazilian Petrobras crude import diversification index; ANP strategic petroleum reserve level'],
		confirmationSignals: ['Formal government declarations restricting energy exports to specific countries, or pipeline sabotage attributed to state actors registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'European gas storage drawdown rates or LNG spot price differentials moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Petrobras import diversification announcements or ANP fuel stock data tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Coercive energy policy intent remains operative: the exporting state retains both motivation and supply leverage sufficient to sustain the restriction without domestic economic penalty exceeding political benefit.', 'No rapid policy resolution emerges: no emergency alternative supply agreement, LNG capacity rerouting, or demand reduction program sufficient to offset the weaponized volume has materialized.', 'Brazil\'s exposure channel is intact: Brazilian energy pricing benchmarks maintain linkage to international markets affected by the weaponization event.'],
		changeTriggers: ['Energy export restriction announcements falls below detection threshold or pipeline flow restoration reverses course across three or more consecutive refresh cycles.', 'An alternative supply agreement achieves verified restoration of equivalent volume to the affected market at prices within 10% of pre-restriction levels on the primary impacted corridor.', 'Brazilian fuel import costs breaks correlation with the weaponized commodity\'s international price benchmark across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'resource-war',
		topics: ['rare-earths', 'china-tensions', 'sanctions'],
		minTopics: 2,
		name: 'Resource War',
		keyJudgments: ['Competition for rare earth elements, lithium, and critical semiconductors is intensifying into a structured geopolitical contest, with export controls, strategic reserve purchases, and industrial policy weaponized as tools of supply denial.', 'Brazil faces dual exposure: as a critical mineral producer attracting geopolitical interest, and as a technology importer dependent on processing capacity concentrated in China.', 'Brazilian military should monitor high-tech component procurement exposure and assess domestic rare earth development as a strategic resilience priority.'],
		indicators: ['Chinese MOFCOM critical mineral export quota announcements; USGS mineral supply disruption index', 'Semiconductor book-to-bill ratio; critical mineral spot prices (lithium, cobalt, REE)', 'Brazilian DNPM/SGM mineral policy bulletin; Chinese export quota impact on niobium/iron ore volumes'],
		confirmationSignals: ['Government-mandated export restrictions on specific critical minerals, or strategic reserve acquisition announcements by major consumer states registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Semiconductor supply allocation ratios or critical mineral spot prices moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian DNPM or MME mineral policy announcements or Chinese critical mineral export quota changes affecting Brazilian exports tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Supply concentration vulnerability remains operative: no alternative processing or mining capacity has come online at scale to reduce the contested mineral\'s geographic concentration.', 'No rapid policy resolution emerges: no multilateral critical minerals sharing agreement or WTO-compliant supply security framework has materialized.', 'Brazil\'s exposure channel is intact: Brazilian defense and technology industries remain dependent on imported processed critical minerals from contested supply chains.'],
		changeTriggers: ['Critical mineral export restriction reports falls below detection threshold or resource access disputes reverse course across three or more consecutive refresh cycles.', 'A multilateral critical minerals framework achieves verifiable diversification of processing capacity outside the single dominant supplier on at least two contested mineral categories.', 'Brazilian critical mineral import costs and supply security breaks correlation with the primary contested mineral\'s geopolitical risk premium across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'green-transition-shock',
		topics: ['energy-transition', 'rare-earths', 'china-tensions'],
		minTopics: 2,
		name: 'Green Transition Shock',
		keyJudgments: ['Critical mineral bottlenecks, Chinese manufacturing dominance in solar and battery supply chains, and policy uncertainty are slowing green energy deployment below the rates required to meet stated climate targets.', 'Brazil faces project delays and higher capital expenditures for renewable energy expansion as equipment costs remain elevated and supply chains for batteries and inverters stay concentrated.', 'Brazilian military should assess implications of delayed energy transition for grid reliability and fuel dependency in remote operational environments.'],
		indicators: ['BloombergNEF solar panel and battery price index; IEA clean energy investment tracker', 'Clean energy equity index (ICLN) P/E ratio; green bond spread', 'Brazilian ANEEL renewable energy auction clearing price; BNDES climate finance approval volume'],
		confirmationSignals: ['Solar panel or EV battery lead time extensions, or policy support withdrawal for green projects in major economies registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Green energy equity valuations or clean energy project financing costs moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian ANEEL renewable energy auction results or BNDES green financing approval rates tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Supply chain bottleneck remains operative: alternative battery chemistry or solar panel manufacturing capacity outside China has not achieved price parity with the constrained supply.', 'No rapid policy resolution emerges: no emergency international critical mineral supply agreement or accelerated domestic manufacturing investment program sufficient to break the bottleneck has materialized.', 'Brazil\'s exposure channel is intact: Brazilian renewable energy developers and grid operators maintain significant procurement dependency on constrained global supply chains.'],
		changeTriggers: ['Green technology supply disruption reports falls below detection threshold or renewable energy deployment rates reverse course upward across three or more consecutive refresh cycles.', 'An alternative supply source achieves cost parity with the constrained primary supplier on at least two critical green technology input categories within two manufacturing cycles.', 'Brazilian renewable energy project completion rates breaks correlation with global critical mineral and green technology supply constraint indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.5
	},
	{
		id: 'food-crisis-spiral',
		topics: ['food-security', 'extreme-weather', 'supply-chain'],
		minTopics: 2,
		name: 'Food Crisis Spiral',
		keyJudgments: ['Concurrent extreme weather events and logistics blockages are reducing global grain and vegetable oil availability at a pace that is outrunning emergency reserve drawdowns and humanitarian response.', 'Brazil faces food export price windfalls alongside domestic food inflation, creating political tension between export profitability and household food affordability.', 'Brazilian military should monitor potential emergency food distribution support requests and assess logistics capacity for food security operations in vulnerable regions.'],
		indicators: ['FAO Food Price Index; WFP Acute Food Insecurity country count (IPC Phase 3+)', 'CBOT wheat, corn, soybean futures; fertilizer spot price index', 'Brazilian CONAB crop production estimate; domestic IPCA food sub-index'],
		confirmationSignals: ['FAO Food Price Index readings above 130 or WFP emergency declarations for three or more countries simultaneously registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Wheat, corn, or soybean futures prices at 12-month highs moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian CONAB crop production estimates or domestic IPCA food component tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Supply shortfall remains operative: alternative crop sources, emergency reserves, or substitution crops have not compensated for the primary shortage within the assessment window.', 'No rapid policy resolution emerges: no coordinated international food reserve release or emergency import liberalization program sufficient to stabilize prices has materialized.', 'Brazil\'s exposure channel is intact: Brazilian domestic food prices remain linked to international commodity benchmarks through export parity pricing and logistics cost pass-through.'],
		changeTriggers: ['FAO Food Price Index falls below detection threshold or global grain supply forecasts reverse course above historical average across three or more consecutive refresh cycles.', 'An emergency international grain release achieves measurable stabilization of FAO Food Price Index below 115 in two consecutive monthly readings on the primary staple commodities.', 'Brazilian domestic food inflation breaks correlation with FAO global food price indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'climate-migration',
		topics: ['extreme-weather', 'refugee-crisis', 'civil-unrest'],
		minTopics: 2,
		name: 'Climate Migration Pressure',
		keyJudgments: ['Climate-driven displacement events are compressing large populations into border regions and urban reception areas faster than host government capacity can absorb, triggering humanitarian crises.', 'Brazil faces border pressure on its northern and northeastern frontiers as climate-displaced populations from Venezuela, the Caribbean, and West Africa seek legal and extralegal entry routes.', 'Brazilian military should assess border support contingencies and coordinate with CONARE, Força Nacional, and ACNUR for humanitarian assistance operations under climate migration scenarios.'],
		indicators: ['UNHCR Global Trends displacement figure; IOM Displacement Tracking Matrix active flows', 'ACLED climate-related conflict event count; host-country border processing backlog', 'Brazilian PF cross-border entry statistics; CONARE asylum application volume'],
		confirmationSignals: ['UNHCR or IOM displacement emergency declarations citing climate as primary driver in two or more active displacement corridors registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Host country border processing backlogs or emergency shelter capacity alerts moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Federal Police border crossing statistics or CONARE asylum application volume tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Climate displacement driver remains operative: the specific weather or environmental event causing displacement has not resolved sufficiently for displaced populations to return within the assessment window.', 'No rapid policy resolution emerges: no regional climate adaptation fund or coordinated resettlement program sufficient to reduce migration pressure in the primary source regions has materialized.', 'Brazil\'s exposure channel is intact: Brazil\'s geographic position and existing diaspora networks maintain it as a destination or transit country for climate-displaced populations from active displacement corridors.'],
		changeTriggers: ['Climate displacement emergency declarations falls below detection threshold or displaced population return rates reverse course across three or more consecutive refresh cycles.', 'A regional climate adaptation investment program achieves measurable improvement in environmental conditions and livelihood security in the primary source regions within two growing seasons.', 'Brazilian border crossing and asylum application statistics breaks correlation with UNHCR climate displacement tracking metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'agricultural-collapse',
		topics: ['agriculture', 'extreme-weather', 'inflation'],
		minTopics: 2,
		name: 'Agricultural Collapse Signal',
		keyJudgments: ['Simultaneous crop stress from extreme heat, drought, and fertilizer cost increases is converging on multiple major agricultural producing regions, raising systemic food supply risk beyond insurance or subsidy offsets.', 'Brazil faces rising domestic food inflation and potential export restriction pressure as major agricultural producers limit exports to protect domestic food security.', 'Brazilian military should monitor procurement cost pressures on rations and fuel as agricultural collapse signals pass through domestic food and logistics price chains.'],
		indicators: ['USDA WASDE crop production and stock-to-use ratio', 'DAP/Urea fertilizer spot price; agricultural credit default rate', 'Brazilian CONAB soybean and corn harvest estimate revision delta'],
		confirmationSignals: ['USDA or FAO crop yield revision downward for three or more major agricultural producers in a single season registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Fertilizer prices or agricultural production loan default rates moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian CONAB soybean or corn harvest estimate revisions tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Multi-region crop stress remains operative: the adverse weather or input cost conditions driving crop failure have not been resolved by precipitation normalization or fertilizer price correction.', 'No rapid policy resolution emerges: no emergency international fertilizer supply agreement or crop yield technology breakthrough sufficient to offset the production shortfall has materialized.', 'Brazil\'s exposure channel is intact: Brazilian agricultural sector pricing and export volumes remain linked to international commodity benchmarks affected by the primary producing regions.'],
		changeTriggers: ['Agricultural production crisis reports falls below detection threshold or crop yield forecasts reverse course above five-year average across three or more consecutive refresh cycles.', 'A verified record harvest in compensating producing regions achieves restoration of global grain reserve coverage above 60-day consumption equivalent on the primary affected staple.', 'Brazilian agricultural export revenues and domestic food inflation breaks correlation with global agricultural collapse signals across three or more consecutive monitoring cycles.'],
		boostFactor: 1.6
	},
	{
		id: 'sovereign-debt-crisis',
		topics: ['sovereign-debt', 'fed-rates', 'credit-stress'],
		minTopics: 2,
		name: 'Sovereign Debt Crisis',
		keyJudgments: ['Elevated global interest rates are increasing sovereign refinancing costs to unsustainable levels for over-leveraged economies, raising the probability of IMF intervention and disorderly debt restructuring.', 'Brazil faces higher external borrowing costs and potential capital flight as global risk appetite for emerging market sovereign debt contracts during primary country stress events.', 'Brazilian military should monitor defense budget sustainability and assess readiness funding assumptions if fiscal austerity measures are implemented during debt stabilization programs.'],
		indicators: ['Bloomberg Sovereign CDS Spread Monitor for EM; IMF Article IV consultation scheduling', 'JPMorgan EMBI+ spread index; EM sovereign credit rating action count', 'Brazilian NTN-B 10-year real yield spread over US TIPS; BCB external debt service ratio'],
		confirmationSignals: ['Sovereign CDS spreads above 500 basis points or IMF Article IV emergency consultations for a systemically significant economy registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Emerging market bond outflows or sovereign credit rating downgrades to sub-investment grade moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian sovereign CDS or NTN-B yield spreads tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Refinancing cost burden remains operative: the affected sovereign has not yet secured alternative concessional financing or achieved sufficient primary surplus to service debt at current rates.', 'No rapid policy resolution emerges: no IMF standby arrangement or multilateral debt restructuring agreement has been concluded with terms sufficient to restore market confidence.', 'Brazil\'s exposure channel is intact: Brazil\'s sovereign risk premium and external financing costs remain correlated with the primary country\'s debt stress metrics through EM risk appetite linkage.'],
		changeTriggers: ['Sovereign CDS spreads falls below detection threshold or IMF emergency consultation activity reverses course across three or more consecutive refresh cycles.', 'A multilateral debt restructuring agreement achieves market-accepted terms with creditor haircuts and IMF support on the primary affected sovereign within 90 days of program initiation.', 'Brazilian sovereign CDS and NTN-B yields breaks correlation with the primary country\'s debt stress trajectory across three or more consecutive monitoring cycles.'],
		boostFactor: 2
	},
	{
		id: 'credit-contagion',
		topics: ['credit-stress', 'bank-crisis', 'housing'],
		minTopics: 2,
		name: 'Credit Contagion',
		keyJudgments: ['Credit spread widening in corporate bonds is transmitting into mortgage and auto loan markets, creating a feedback loop where tighter lending standards reduce economic activity, which increases default rates.', 'Brazil faces tighter domestic credit availability and higher consumer borrowing costs as Brazilian banks raise provisions and reduce risk appetite in response to global credit stress.', 'Brazilian military should monitor government contractor payment cycles as credit contagion may affect defense supplier liquidity and contract performance.'],
		indicators: ['ICE BofA US High Yield OAS; Moody\'s speculative-grade default rate', 'Fed Senior Loan Officer Survey net tightening; consumer auto delinquency rate', 'Brazilian BACEN credit NPL ratio; BACEN SLOOS equivalent net tightening'],
		confirmationSignals: ['High-yield credit spread widening above 700 basis points or investment-grade spreads above 250 basis points registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Loan origination volume declines or consumer delinquency rate increases moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian non-performing loan ratios or BACEN credit conditions survey results tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Credit deterioration cascade remains operative: initial default stress in one sector has not been ring-fenced and is demonstrably transmitting to other credit categories.', 'No rapid policy resolution emerges: no emergency credit guarantee program or central bank asset purchase facility sufficient to prevent contagion transmission across sectors has been activated.', 'Brazil\'s exposure channel is intact: Brazilian bank credit portfolios and corporate bond markets maintain correlated risk metrics with the primary stressed credit sectors internationally.'],
		changeTriggers: ['High-yield credit spreads falls below detection threshold or loan origination volumes reverse course across three or more consecutive refresh cycles.', 'A central bank emergency credit facility achieves measurable spread normalization in the primary stressed sector below 500 basis points on two consecutive monthly readings on investment-grade credit.', 'Brazilian non-performing loan and credit spread metrics breaks correlation with global credit contagion indicators across three or more consecutive monitoring cycles.'],
		boostFactor: 1.9
	},
	{
		id: 'dedollarization-signal',
		topics: ['trade-blocs', 'sanctions', 'crypto'],
		minTopics: 2,
		name: 'Dedollarization Signal',
		keyJudgments: ['BRICS economies and sanctioned states are accelerating bilateral currency swap arrangements, local currency trade settlement, and CBDC interoperability as alternatives to SWIFT-based dollar payment rails.', 'Brazil faces structural decisions about currency diversification as its BRICS membership and commodity export orientation make it a target for both US dollar retention pressure and alternative settlement offers.', 'Brazilian military should assess implications of payment system fragmentation for foreign equipment procurement and dollar-denominated operational funding channels.'],
		indicators: ['IMF COFER dollar share of global FX reserves; SWIFT currency messaging share', 'BIS bilateral swap line activation count; BRICS payment system transaction volume', 'Brazilian Real bilateral trade settlement agreement count; BCB reserve currency composition'],
		confirmationSignals: ['Formal bilateral trade settlement agreements in non-dollar currencies or CBDC interoperability announcements between two or more major economies registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Dollar share of global reserves declining in IMF COFER data or SWIFT message volume declining for affected currencies moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Real bilateral swap agreement activity or BRICS payment system participation announcements tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Alternative settlement infrastructure remains operative: BRICS payment mechanisms or bilateral swap lines have not suffered technical failure or political collapse that would revert to dollar rails.', 'No rapid policy resolution emerges: no US policy response sufficient to reverse dedollarization momentum has materialized.', 'Brazil\'s exposure channel is intact: Brazil\'s commodity export revenues and BRICS diplomatic commitments maintain its relevance as a swing state in currency multipolarity arrangements.'],
		changeTriggers: ['Non-dollar trade settlement volume falls below detection threshold or BRICS payment system initiatives reverse course across three or more consecutive refresh cycles.', 'A US-led multilateral dollar liquidity expansion achieves measurable reversal of dollar reserve share decline in two consecutive COFER quarterly reports on the primary alternative reserve currencies.', 'Brazilian real bilateral trade and reserve diversification announcements breaks correlation with global dedollarization momentum metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.6
	},
	{
		id: 'social-tinderbox',
		topics: ['civil-unrest', 'inflation', 'layoffs'],
		minTopics: 2,
		name: 'Social Tinderbox',
		keyJudgments: ['Sustained inflation above wage growth is compressing real household incomes at the same time unemployment rises, removing the economic safety buffers that historically temper protest escalation.', 'Brazil faces concentrated urban tinderbox conditions in metropolitan peripheries where income stress, underemployment, and inadequate public services converge.', 'Brazilian military should maintain civil support readiness under constitutional mandate, with specific attention to metropolitan security coordination with state military police.'],
		indicators: ['Real wage growth vs. CPI in G20; ILO youth unemployment rate', 'Consumer sentiment at multi-year lows (Conference Board, GfK); ACLED social unrest count', 'Brazilian IBGE PNAD real household income per capita; Datafolha social discontent polling'],
		confirmationSignals: ['Street mobilization events exceeding 10,000 participants in three or more cities simultaneously, explicitly citing cost-of-living or unemployment grievances registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Real wage growth below zero for two consecutive quarters or consumer sentiment at decade lows moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian IBGE PNAD labor income data or Datafolha social discontent polling tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Grievance-mobilization gap remains operative: income and employment conditions have not improved sufficiently to reduce active organizing by social movements and unions.', 'No rapid policy resolution emerges: no targeted social transfer, emergency employment program, or inflation control measure sufficient to reduce household hardship below protest-triggering levels has been implemented.', 'Brazil\'s exposure channel is intact: Brazil\'s urban inequality, high consumer price inflation, and youth unemployment create independent domestic tinderbox conditions that reinforce rather than merely replicate international trends.'],
		changeTriggers: ['Large-scale protest event frequency falls below detection threshold or real wage growth reverses to positive territory across three or more consecutive refresh cycles.', 'A government social support program achieves measurable improvement in real household income and unemployment rate below 8% in two consecutive quarters on the primary hardship indicators.', 'Brazilian social unrest incidents breaks correlation with global inflation and unemployment composite stress indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.9
	},
	{
		id: 'democratic-stress',
		topics: ['election', 'political-violence', 'civil-unrest'],
		minTopics: 2,
		name: 'Democratic Stress',
		keyJudgments: ['Electoral disputes, political violence incidents, and institutional non-compliance are combining to erode public confidence in democratic processes, with implications for governance legitimacy and rule of law.', 'Brazil faces elevated risk from its history of contested electoral outcomes and political polarization, with potential for institutional stress to escalate around electoral calendar milestones.', 'Brazilian military should reinforce constitutional role clarity, support TSE election security operations, and maintain situational awareness to prevent institutional instrumentalization.'],
		indicators: ['V-Dem Liberal Democracy Index score change; Freedom House Nations in Transit score', 'ACLED political violence event count; election integrity NGO alert frequency', 'Brazilian TSE security incident log; ACLED Brazil political violence monthly count'],
		confirmationSignals: ['Documented electoral fraud allegations with legal filings, political violence incidents targeting candidates or voters, or executive branch non-compliance with judicial orders registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Democratic backsliding index scores or Freedom House annual rating changes moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian TSE security incident reports or political violence data from ACLED Brazil tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Institutional challenge remains operative: actors contesting electoral outcomes or engaging in political violence retain sufficient resources, networks, and public credibility to sustain pressure.', 'No rapid policy resolution emerges: no electoral court resolution, political violence perpetrator accountability action, or cross-party institutional commitment sufficient to de-escalate the democratic stress has materialized.', 'Brazil\'s exposure channel is intact: Brazil\'s political polarization, electoral dispute history, and institutional fragility maintain independent sensitivity to democratic stress that reinforces global patterns.'],
		changeTriggers: ['Electoral dispute filings falls below detection threshold or political violence incidents reverse course across three or more consecutive refresh cycles.', 'A verified electoral court resolution or political accountability process achieves measurable reduction in institutional contestation below pre-election baseline on the primary dispute mechanism.', 'Brazilian democratic stress indicators breaks correlation with global democratic backsliding indices across three or more consecutive monitoring cycles.'],
		boostFactor: 1.8
	},
	{
		id: 'global-protest-wave',
		topics: ['civil-unrest', 'food-security', 'inflation'],
		minTopics: 2,
		name: 'Global Protest Wave',
		keyJudgments: ['Cost-of-living shocks are synchronizing protest dynamics across low- and middle-income countries simultaneously, amplifying contagion through social media coordination and shared grievance frames.', 'Brazil faces risk of protest wave contagion as Brazilian social movements monitor international events for tactical inspiration and mobilization timing cues.', 'Brazilian military should maintain situational awareness of global protest movements with Brazilian followings and coordinate with public security for contingency planning.'],
		indicators: ['ACLED global protest event count (5+ countries simultaneous); ILO real wage growth', 'FAO Food Price Index; social media cross-border solidarity hashtag volume', 'Brazilian MST/CUT mobilization announcements; IBGE consumer price hardship composite'],
		confirmationSignals: ['Coordinated protest events exceeding 100,000 participants in five or more countries within a two-week window registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Food price indices at crisis levels or international social movement solidarity communications moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian social movement mobilization announcements citing international protest events tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Shared grievance coherence remains operative: the primary protest drivers (food costs, energy prices, or inequality) are simultaneously elevated across the participating countries rather than localized.', 'No rapid policy resolution emerges: no coordinated international response to cost-of-living pressure sufficient to dampen protest motivation has materialized.', 'Brazil\'s exposure channel is intact: Brazilian social movements maintain active international connections and monitoring of foreign protest tactics and timing that enable rapid mobilization mirroring.'],
		changeTriggers: ['Multi-country protest wave reports falls below detection threshold or global social movement coordination reverses course across three or more consecutive refresh cycles.', 'A coordinated international social support program achieves measurable cost-of-living reduction across at least five primary protest countries within two quarters on the primary grievance metric.', 'Brazilian protest mobilization rates breaks correlation with global protest wave intensity metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'arms-race-acceleration',
		topics: ['arms-race', 'nato-defense', 'russia-ukraine'],
		minTopics: 2,
		name: 'Arms Race Acceleration',
		keyJudgments: ['Accelerated defense procurement commitments among NATO members and Indo-Pacific allies are driving global defense industry capacity constraints, extending delivery timelines and raising unit costs across equipment categories.', 'Brazil faces higher equipment costs, extended lead times, and reduced supplier availability for defense modernization programs as priority Western clients absorb available industrial capacity.', 'Brazilian military should reassess procurement timelines, identify alternative suppliers, and prioritize domestic defense industrial capacity development to reduce dependency on constrained suppliers.'],
		indicators: ['SIPRI global defense spending growth rate; NATO member defense budget pledges (% GDP)', 'Defense sector equity index (ITA ETF) P/E; major contractor backlog-to-revenue ratio', 'Brazilian MD procurement announcement volume; Embraer Defense backlog delta'],
		confirmationSignals: ['NATO member defense spending pledges above 3% of GDP, or emergency procurement contract announcements for major weapons systems registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Defense industry equity prices or defense contractor backlog-to-revenue ratios moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian Embraer defense division order book or MD procurement delay announcements tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Defense spending acceleration remains operative: political consensus in NATO and Indo-Pacific partner countries for sustained above-baseline defense budgets has not eroded.', 'No rapid policy resolution emerges: no major diplomatic breakthrough sufficient to reduce the security anxiety driving procurement acceleration has materialized.', 'Brazil\'s exposure channel is intact: Brazilian defense industry customers and suppliers maintain significant linkage to global defense markets being reshaped by the procurement surge.'],
		changeTriggers: ['Defense procurement announcements falls below detection threshold or NATO spending trajectory reverses course across three or more consecutive refresh cycles.', 'A major multilateral arms control agreement achieves verifiable reduction in offensive military posture on the primary contested platform category in at least two major power dyads.', 'Brazilian defense procurement costs and timeline extensions breaks correlation with global defense industry capacity stress metrics across three or more consecutive monitoring cycles.'],
		boostFactor: 1.7
	},
	{
		id: 'multi-domain-conflict',
		topics: ['cyberattack', 'space-military', 'arms-race'],
		minTopics: 2,
		name: 'Multi-Domain Conflict',
		keyJudgments: ['Simultaneous offensive operations in cyber, space, and conventional military domains are eroding the conceptual boundaries between peacetime competition and conflict, increasing the risk of unintended escalation.', 'Brazil faces elevated exposure to satellite service disruption, financial system cyber intrusions, and GPS interference as collateral effects of multi-domain operations in contested theaters.', 'Brazilian military should integrate cross-domain alerting across cyber, space, and conventional intelligence streams and conduct joint response exercises to close inter-service coordination gaps.'],
		indicators: ['UCS Satellite Database military satellite count delta; Space Force/ESA anomaly reports', 'GPS/GNSS signal jamming incident reports; commercial satellite disruption notices', 'Brazilian AEB SpaceBR alert status; Air Force GPS integrity monitoring'],
		confirmationSignals: ['Verified counter-space capabilities demonstrations, coordinated cyber attacks on military networks, and conventional force positioning in a single theater registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Commercial satellite operator disruption reports or GPS accuracy degradation in contested regions moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian SpaceBR or ABIN multi-domain threat alert posture tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Multi-domain operational integration remains operative: the primary adversary maintains the command and control architecture to synchronize cyber, space, and kinetic operations rather than executing them independently.', 'No rapid policy resolution emerges: no verified stand-down of space or cyber offensive operations, or arms control framework covering multi-domain conflict, has been concluded.', 'Brazil\'s exposure channel is intact: Brazilian satellite communications, GPS-dependent logistics, and financial system connectivity maintain vulnerability to multi-domain operations in contested theaters.'],
		changeTriggers: ['Multi-domain attack incident reports falls below detection threshold or cross-domain offensive operations reverse course across three or more consecutive refresh cycles.', 'A verified multi-domain conflict norms agreement achieves inspectable restrictions on counter-space and offensive cyber operations in at least one contested theater.', 'Brazilian satellite service and cyber infrastructure reliability breaks correlation with global multi-domain conflict intensity across three or more consecutive monitoring cycles.'],
		boostFactor: 2.3
	},
	{
		id: 'escalation-ladder',
		topics: ['nuclear', 'arms-race', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Escalation Ladder',
		keyJudgments: ['Sequential escalatory moves — from nuclear signaling to conventional force surges to economic warfare — are advancing faster than diplomatic de-escalation mechanisms can respond, increasing the risk of miscalculation.', 'Brazil faces abrupt commodity, currency, and insurance market dislocations as each rung of the escalation ladder triggers flight-to-safety capital flows and supply-chain risk repricing.', 'Brazilian military should maintain elevated strategic intelligence monitoring and assess contingency plans for scenarios involving US or NATO force posture changes that affect Brazilian security partnerships.'],
		indicators: ['Nuclear Threat Initiative escalation index; ACLED cross-domain conflict co-occurrence rate', 'Gold spot price; oil front-month price during escalation windows', 'Brazilian BCB FX reserve drawdown rate; Itamaraty emergency diplomatic frequency'],
		confirmationSignals: ['Nuclear doctrine statements combined with conventional force repositioning and economic sanction escalation in the same 72-hour window registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Nuclear-sensitive commodity prices or allied defense readiness alerts moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian foreign ministry diplomatic communications or BCB reserve management actions tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Multi-domain escalation coherence remains operative: the primary adversarial parties are taking coordinated cross-domain escalatory steps rather than responding reactively to isolated provocations.', 'No rapid policy resolution emerges: no emergency summit, hotline communication, or back-channel agreement sufficient to halt escalation at the current rung has been concluded.', 'Brazil\'s exposure channel is intact: Brazil\'s diplomatic neutrality posture does not fully insulate it from commodity, currency, and security spillovers generated by great power escalation dynamics.'],
		changeTriggers: ['Cross-domain escalation tempo falls below detection threshold or nuclear signaling reverses course across three or more consecutive refresh cycles.', 'A verified summit outcome achieves mutual stand-down agreements covering at least two of the three escalation domains (nuclear posture, conventional positioning, economic warfare) simultaneously.', 'Brazilian commodity and sovereign risk metrics breaks correlation with global escalation ladder intensity composite indices across three or more consecutive monitoring cycles.'],
		boostFactor: 2.5
	},
	{
		id: 'systemic-fragility',
		topics: ['sovereign-debt', 'supply-chain', 'cyberattack', 'extreme-weather'],
		minTopics: 3,
		name: 'Systemic Fragility',
		keyJudgments: ['Concurrent shocks across sovereign debt, logistics, cyber, and climate domains are overloading the resilience buffers that modern economies rely on to absorb individual crises, raising the probability of cascading failures.', 'Brazil faces compounding exposure: climate stress on agricultural logistics intersects with fiscal pressure from global rate hikes, while cyber threats target the financial and energy infrastructure managing both.', 'Brazilian military should monitor multi-sector contingency demands simultaneously and review interoperability with civil defense, EMBRAPA, ANEEL, and financial authorities for coordinated response to cascading failures.'],
		indicators: ['BIS Global Risk Index composite; IMF WEO downside scenario probability', 'Cross-asset correlation spike index; NY Fed Global Supply Chain Pressure Index', 'Brazilian multi-sector stress composite (BACEN + ANEEL + CTIR.Gov + CONAB simultaneous alerts)'],
		confirmationSignals: ['Three or more of the following active simultaneously: sovereign CDS above 400bp in two countries, logistics index below 2019 baseline, critical infrastructure cyber incidents above monthly average, and climate disaster declarations in agricultural zones registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'Global systemic risk indicators from BIS or IMF Financial Stability Reports moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian multi-sector stress composite (BACEN + ANEEL + CTIR.Gov + CONAB) tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Cross-domain coupling remains operative: the four stressed domains are transmitting risk to each other rather than absorbing independent shocks in isolation.', 'No rapid policy resolution emerges: no emergency coordinated intervention across fiscal, logistics, cyber, and climate domains simultaneously sufficient to decouple the cascading effects has been activated.', 'Brazil\'s exposure channel is intact: Brazil\'s simultaneous exposure to external debt market conditions, logistics corridors, cybersecurity threats, and climate events creates genuine cross-domain coupling rather than coincidental co-occurrence.'],
		changeTriggers: ['Multi-domain stress co-occurrence falls below detection threshold or two or more of the four driver domains reverse course across three or more consecutive refresh cycles.', 'A coordinated multilateral emergency response achieves verified stabilization across at least three of the four stressed domains to below pre-crisis baseline levels simultaneously.', 'Brazilian multi-sector stress composite breaks correlation with global systemic fragility indicators across three or more consecutive monitoring cycles.'],
		boostFactor: 2.5
	},
	{
		id: 'polycrisis',
		topics: ['civil-unrest', 'food-security', 'inflation', 'extreme-weather', 'refugee-crisis'],
		minTopics: 3,
		name: 'Polycrisis',
		keyJudgments: ['Mutually reinforcing social, food, climate, and economic shocks are compounding faster than individual policy responses can address them, creating emergent risk that exceeds the sum of each crisis in isolation.', 'Brazil faces simultaneous humanitarian, inflation, governance, and climate management demands that strain institutional bandwidth across federal, state, and municipal levels.', 'Brazilian military should prepare for sustained multi-agency support demands and coordinate with civil defense, health, food security, and law enforcement agencies for concurrent crisis response.'],
		indicators: ['UN OCHA Global Humanitarian Overview funding gap %; active WFP + UNHCR + WHO simultaneous emergency count', 'IMF global growth downgrade magnitude; WFP + UNHCR simultaneous emergency overlap', 'Brazilian federal emergency decree activations across unrelated domains (concurrent count in 30-day window)'],
		confirmationSignals: ['WFP acute food insecurity, UNHCR displacement emergency, IMF fiscal stress, and climate disaster declarations all active simultaneously for two or more consecutive monitoring weeks registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation.', 'UN OCHA global humanitarian funding gap or multi-sector appeals exceeding 50% of global capacity moves in the same direction, ruling out isolated noise and confirming cross-domain transmission.', 'Brazilian federal emergency decree activations across two or more unrelated policy domains simultaneously tracks global driver direction, confirming the transmission pathway is open.'],
		assumptions: ['Multi-crisis interaction effects remain operative: each active crisis is measurably worsening at least one other active crisis rather than progressing independently.', 'No rapid policy resolution emerges: no emergency global governance response sufficient to address even two of the five simultaneous crises has materialized.', 'Brazil\'s exposure channel is intact: Brazil\'s geographic, demographic, and economic exposure creates independent polycrisis risk that amplifies global patterns rather than merely reflecting them.'],
		changeTriggers: ['Multi-domain crisis co-occurrence falls below detection threshold or any three of the five driver domains reverse course simultaneously across three or more consecutive refresh cycles.', 'A coordinated international emergency response achieves measurable de-escalation of at least three of the five active crisis domains below acute thresholds within 90 days.', 'Brazilian multi-sector emergency declaration frequency breaks correlation with global polycrisis composite indicators across three or more consecutive monitoring cycles.'],
		boostFactor: 3
	}
];

const COMPOUND_NAME_OVERRIDES_PT_BR: Record<string, string> = {
	'trade-war-escalation': 'Escalada da Guerra Comercial',
	'stagflation-risk': 'Risco de Estagflação',
	'geopolitical-crisis': 'Crise Geopolítica em Múltiplas Frentes',
	'tech-regulatory-storm': 'Tempestade Regulatória em Tecnologia',
	'financial-stress': 'Estresse no Setor Financeiro',
	'nuclear-escalation': 'Escalada Nuclear',
	'middle-east-escalation': 'Escalada no Oriente Médio',
	'energy-supply-shock': 'Choque de Oferta de Energia',
	'recession-signal': 'Sinal de Recessão',
	'inflation-spiral': 'Espiral Inflacionária',
	'dollar-stress': 'Estresse do Dólar',
	'ai-disruption-wave': 'Onda de Disrupção por IA',
	'disinfo-storm': 'Tempestade de Desinformação',
	'pandemic-redux': 'Retorno da Pandemia',
	'climate-shock': 'Choque Climático',
	'social-pressure': 'Pressão Social',
	'cyber-warfare-escalation': 'Escalada de Guerra Cibernética',
	'critical-infra-attack': 'Ataque à Infraestrutura Crítica',
	'cyber-financial-attack': 'Ataque Ciberfinanceiro',
	'energy-weaponization': 'Arma de Energia',
	'resource-war': 'Guerra por Recursos',
	'green-transition-shock': 'Choque da Transição Verde',
	'food-crisis-spiral': 'Espiral de Crise Alimentar',
	'climate-migration': 'Pressão Migratória Climática',
	'agricultural-collapse': 'Sinal de Colapso Agrícola',
	'sovereign-debt-crisis': 'Crise de Dívida Soberana',
	'credit-contagion': 'Contágio de Crédito',
	'dedollarization-signal': 'Sinal de Desdolarização',
	'social-tinderbox': 'Barril de Pólvora Social',
	'democratic-stress': 'Estresse Democrático',
	'global-protest-wave': 'Onda Global de Protestos',
	'arms-race-acceleration': 'Aceleração da Corrida Armamentista',
	'multi-domain-conflict': 'Conflito Multidomínio',
	'escalation-ladder': 'Escada de Escalada',
	'systemic-fragility': 'Fragilidade Sistêmica',
	polycrisis: 'Policrise'
};

const COMPOUND_PATTERNS_PT_BR_BY_ID: Record<
	string,
	Pick<
		CompoundPattern,
		'name' | 'keyJudgments' | 'indicators' | 'confirmationSignals' | 'assumptions' | 'changeTriggers'
	>
> = {
	'trade-war-escalation': {
		name: 'Escalada da Guerra Comercial',
		keyJudgments: [
			'Rodadas crescentes de tarifas entre EUA, China e UE estão fragmentando cadeias globais de suprimento e forçando diversificação de fornecedores com custo elevado.',
			'O Brasil enfrenta custos de insumos mais altos para manufaturados e volatilidade de preços de commodities à medida que fluxos comerciais são redirecionados por corredores alternativos.',
			'As Forças Armadas brasileiras devem revisar a dependência de importações de componentes tecnológicos estratégicos à medida que canais de aquisição se estreitam.'
		],
		indicators: [
			'Cronogramas de tarifas bilaterais EUA-China e EUA-UE; frequência de disputas na OMC',
			'Shanghai Containerized Freight Index (SCFI); Baltic Dry Index (BDI)',
			'Variação mensal da arrecadação aduaneira brasileira; volume de desvio de exportações do MDIC por parceiro'
		],
		confirmationSignals: [
			'Anúncios de tarifas recíprocas ou registros de disputas na OMC em múltiplos veículos confiáveis por dois ou mais ciclos consecutivos, confirmando a ativação do sinal.',
			'Movimento na mesma direção de fretes de contêineres ou spreads de trade finance, descartando ruído isolado e confirmando transmissão entre domínios.',
			'Volume de desvio de exportações ou dados de receita aduaneira do Brasil acompanham o vetor global, confirmando que o canal de transmissão está ativo.'
		],
		assumptions: [
			'A persistência do impasse tarifário permanece ativa: não houve trégua verificável de tarifas ou mediação efetiva pela OMC no curto prazo.',
			'Nenhuma resolução rápida se materializa: não ocorreu um acordo bilateral EUA-China que reverta os principais cronogramas tarifários.',
			'O canal de exposição do Brasil permanece intacto: parceiros de importação e exportação não se desacoplaram dos corredores comerciais afetados.'
		],
		changeTriggers: [
			'Anúncios tarifários EUA-China caem abaixo do limiar de detecção ou restrições comerciais de grandes blocos revertem curso por três ou mais ciclos consecutivos.',
			'Um arcabouço bilateral de comércio obtém rollback de tarifas em pelo menos 50% das categorias contestadas.',
			'O saldo comercial do Brasil com parceiros afetados rompe a correlação com a direção do vetor global por três ou mais ciclos de monitoramento.'
		]
	},
	'stagflation-risk': {
		name: 'Risco de Estagflação',
		keyJudgments: [
			'Inflação persistentemente acima da meta somada ao aumento do desemprego cria a compressão dupla típica da estagflação, limitando respostas fiscal e monetária.',
			'O Brasil enfrenta, simultaneamente, custo de financiamento mais alto e demanda do consumidor enfraquecida, comprimindo receita pública e poder de compra das famílias.',
			'As Forças Armadas brasileiras devem monitorar a estabilidade orçamentária de defesa, pois a compressão fiscal da estagflação pode reduzir financiamento de prontidão e aquisição.'
		],
		indicators: [
			'CPI e PCE dos EUA; pedidos iniciais de seguro-desemprego',
			'Inclinação da curva 2y/10y dos Treasuries; breakeven de inflação de 5 anos',
			'IPCA mensal; curva de juros Selic (DI B3)'
		],
		confirmationSignals: [
			'Leituras de CPI/PCE acima da meta junto com alta de pedidos de seguro-desemprego em múltiplos veículos confiáveis por dois ou mais ciclos consecutivos.',
			'Achatamento da curva de juros ou expectativas de inflação acima de 3% movem-se na mesma direção, confirmando transmissão entre domínios.',
			'Trajetória do IPCA ou orientação da Selic acompanha o vetor global, confirmando que o canal de transmissão está ativo.'
		],
		assumptions: [
			'A persistência inflacionária permanece ativa: restrições de oferta ou demanda resiliente impedem normalização rápida sem recessão profunda.',
			'Nenhuma resolução rápida se materializa: não houve reversão de choque de oferta nem pacto de desinflação salarial de grande escala.',
			'O canal de exposição do Brasil permanece intacto: receitas de commodities não compensam totalmente o custo doméstico importado.'
		],
		changeTriggers: [
			'Inflação núcleo cai abaixo do limiar de detecção ou o desemprego reverte curso por três ou mais ciclos consecutivos.',
			'Um pacote coordenado do G7 no lado da oferta resulta em desaceleração do CPI abaixo de 3% anualizado por dois trimestres consecutivos.',
			'O IPCA rompe a correlação com as tendências inflacionárias EUA-UE por três ou mais ciclos de monitoramento.'
		]
	},
	'geopolitical-crisis': {
		name: 'Crise Geopolítica em Múltiplas Frentes',
		keyJudgments: [
			'Conflitos simultâneos na Europa e no Oriente Médio fragmentam apetite a risco, elevam prêmios de seguro e desviam atenção estratégica de OTAN e EUA.',
			'O Brasil enfrenta custos mais altos de importação de commodities e seguros de exportação à medida que o risco de conflito em múltiplos teatros é precificado.',
			'As Forças Armadas brasileiras devem intensificar o monitoramento de corredores marítimos e coordenar planos de contingência para possíveis rupturas de suprimento.'
		],
		indicators: [
			'Índice VIX; contagem mensal de eventos do ACLED em teatros ativos',
			'Preço spot do Brent; prêmio de seguro de guerra no transporte marítimo',
			'CDS soberano do Brasil (5 anos); EMBI+ Brasil'
		],
		confirmationSignals: [
			'Relatos de escalada em dois ou mais teatros distintos em veículos confiáveis por dois ou mais ciclos consecutivos.',
			'VIX ou índices de volatilidade energética movem-se na mesma direção, confirmando transmissão entre domínios.',
			'CDS brasileiro ou custos logísticos seguem a direção do vetor global, confirmando que o canal de transmissão está ativo.'
		],
		assumptions: [
			'Conflito cinético ativo em pelo menos dois teatros permanece vigente: não houve cessar-fogo simultâneo.',
			'Nenhuma resolução rápida se materializa: não houve acordo de paz na Ucrânia nem cessar-fogo robusto em Gaza.',
			'O canal de exposição do Brasil permanece intacto: mercados globais continuam a precificar risco de múltiplos teatros.'
		],
		changeTriggers: [
			'Relatos de conflito ativo caem abaixo do limiar de detecção ou ambos os conflitos entram em cessar-fogo verificado por três ciclos.',
			'Um acordo de paz duradouro cessa hostilidades em pelo menos um dos teatros principais.',
			'Custos de frete e energia no Brasil rompem correlação com a intensidade do conflito por três ou mais ciclos.'
		]
	},
	'tech-regulatory-storm': {
		name: 'Tempestade Regulatória em Tecnologia',
		keyJudgments: [
			'Medidas antitruste, segurança em IA e enforcement cripto simultâneos nos EUA e UE elevam custos de conformidade e comprimem modelos de plataforma.',
			'O Brasil enfrenta efeitos indiretos via atrasos em lançamentos, custos de licenciamento e difusão de precedentes regulatórios.',
			'As Forças Armadas brasileiras devem acompanhar governança de IA que afete aquisição e integração de capacidades comerciais.'
		],
		indicators: [
			'Contagem de ações DMA/DSA na UE; volume de ações antitruste DOJ/FTC',
			'P/L do setor tech do Nasdaq 100; volume de rodadas de VC',
			'Notificações da ANPD; calendário regulatório da ANATEL'
		],
		confirmationSignals: [
			'Ações regulatórias, multas ou legislações vinculantes em IA, big tech ou cripto em veículos confiáveis por dois ou mais ciclos consecutivos.',
			'Valuações de tech ou nível de investimento de VC movem-se na mesma direção, confirmando transmissão entre domínios.',
			'Ações da ANATEL/ANPD/CGI acompanham o vetor global, confirmando o canal de transmissão.'
		],
		assumptions: [
			'Momentum regulatório permanece ativo: coalizões legislativas e prioridades de enforcement não se fragmentaram.',
			'Nenhuma resolução rápida se materializa: não houve safe-harbor amplo nem moratória regulatória.',
			'O canal de exposição do Brasil permanece intacto: dependência de plataformas reguladas e repasse de custos seguem relevantes.'
		],
		changeTriggers: [
			'Ações de enforcement em IA caem abaixo do limiar ou litígios antitruste revertem por três ciclos.',
			'Acordo EUA-UE cria framework unificado que reduz duplicidade de enforcement em duas categorias de plataforma.',
			'Investimento e postura regulatória no Brasil rompem correlação com os ciclos EUA-UE por três ciclos.'
		]
	},
	'financial-stress': {
		name: 'Estresse no Setor Financeiro',
		keyJudgments: [
			'Juros mais altos combinados à deterioração do colateral imobiliário comprimem margem financeira e elevam inadimplência.',
			'O Brasil enfrenta condições externas mais restritivas e possível saída de capital à medida que aumenta o apetite por porto seguro.',
			'As Forças Armadas brasileiras devem monitorar condições de financiamento orçamentário, pois custos de dívida soberana podem subir.'
		],
		indicators: [
			'KBW Bank Index (BKX); spread SOFR-OIS',
			'Spread de bond corporativo IG (ICE BofA); taxa de inadimplência hipotecária',
			'EMBI+ do setor bancário brasileiro; contagem de falhas de liquidação do BACEN'
		],
		confirmationSignals: [
			'Quedas de ações bancárias, saques de depósitos ou abertura de CDS em instituições sistêmicas por dois ciclos consecutivos.',
			'Spreads de crédito IG ou taxas interbancárias movem-se na mesma direção, confirmando transmissão.',
			'Indicadores de estresse bancário no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Pressão de solvência bancária permanece ativa: facilidades de liquidez não cobriram totalmente as instituições vulneráveis.',
			'Nenhuma resolução rápida se materializa: não houve resgate coordenado suficiente para restaurar confiança.',
			'O canal de exposição do Brasil permanece intacto: exposição externa e linhas de funding seguem correlacionadas.'
		],
		changeTriggers: [
			'Indicadores de estresse de solvência caem abaixo do limiar ou colateral imobiliário estabiliza por três ciclos.',
			'Intervenção de BC/Tesouro normaliza spreads interbancários e fluxos de depósitos em 30 dias.',
			'Indicadores bancários do Brasil rompem correlação com índices globais por três ciclos.'
		]
	},
	'nuclear-escalation': {
		name: 'Escalada Nuclear',
		keyJudgments: [
			'Sinalização nuclear explícita da Rússia ou aceleração do enriquecimento iraniano eleva a probabilidade de respostas de dissuasão e mobilização diplomática emergencial.',
			'O Brasil enfrenta aumento de prêmios de risco e preços de commodities à medida que eventos nucleares disparam busca por porto seguro.',
			'As Forças Armadas brasileiras devem manter elevada consciência estratégica e apoiar sinalização multilateral de não proliferação.'
		],
		indicators: [
			'Status de salvaguardas da AIEA; divulgações de níveis de enriquecimento',
			'Ouro spot (XAU/USD); VIX',
			'Frequência de notas do Itamaraty; votos do Brasil na AIEA'
		],
		confirmationSignals: [
			'Alertas de prontidão nuclear, revisão de doutrina ou violações da AIEA em veículos confiáveis por dois ciclos.',
			'Preços do ouro, petróleo ou setores sensíveis a risco nuclear movem-se na mesma direção.',
			'Postura do Itamaraty ou engajamento na AIEA acompanha o vetor global.'
		],
		assumptions: [
			'Escalada de sinalização nuclear permanece ativa: não houve recuo verificável ou acordo de inspeção.',
			'Nenhuma resolução rápida se materializa: não houve acordo bilateral de redução de risco nuclear.',
			'O canal de exposição do Brasil permanece intacto: mercados globais continuam precificando risco nuclear.'
		],
		changeTriggers: [
			'Retórica nuclear cai abaixo do limiar ou acesso de monitoramento da AIEA é restaurado por três ciclos.',
			'Acordo verificável reduz risco nuclear com desmobilização inspecionável.',
			'Risco soberano do Brasil e receitas de commodities rompem correlação com a intensidade nuclear.'
		]
	},
	'middle-east-escalation': {
		name: 'Escalada no Oriente Médio',
		keyJudgments: [
			'Ativação de proxies iranianos e risco de confronto direto Irã-Israel elevam a probabilidade de interrupção no Estreito de Ormuz e desaceleração no Suez.',
			'O Brasil enfrenta alta de preços de petróleo e seguro marítimo à medida que a escalada pressiona energia e frete.',
			'As Forças Armadas brasileiras devem acompanhar segurança marítima no Mar Vermelho e Golfo Pérsico.'
		],
		indicators: [
			'Brent spot; contagem de trânsito no Estreito de Ormuz/Mar Vermelho',
			'Prêmio de seguro de guerra de navios (BIMCO); sobretaxas Lloyd’s',
			'Preço de importação de combustíveis (ANP); custo de aquisição da Petrobras'
		],
		confirmationSignals: [
			'Ataques diretos, enxames de drones ou interdição naval no Golfo/Mar Vermelho em veículos confiáveis por dois ciclos.',
			'Brent ou taxas de seguro movem-se na mesma direção, confirmando transmissão.',
			'Preço de importação de combustíveis ou hedge da Petrobras acompanha o vetor global.'
		],
		assumptions: [
			'Projeção regional iraniana permanece ativa: IRGC e proxies mantêm capacidade e intenção.',
			'Nenhuma resolução rápida se materializa: não houve cessar-fogo ou reabertura diplomática eficaz.',
			'O canal de exposição do Brasil permanece intacto: importações de energia seguem precificadas em Brent.'
		],
		changeTriggers: [
			'Atividade de proxies cai abaixo do limiar ou operações Israel-Gaza revertem por três ciclos.',
			'Engajamento diplomático EUA-Irã reduz ativação de proxies em pelo menos duas frentes.',
			'Custos de importação e rotas rompem correlação com métricas de escalada.'
		]
	},
	'energy-supply-shock': {
		name: 'Choque de Oferta de Energia',
		keyJudgments: [
			'Disrupções de gás russo e petróleo do Oriente Médio removem folga de oferta durante pico de demanda, elevando preços.',
			'O Brasil enfrenta aumento de custos de combustível e eletricidade com repasse para produção industrial e transporte.',
			'As Forças Armadas brasileiras devem revisar reservas operacionais de combustível e resiliência logística.'
		],
		indicators: [
			'Henry Hub; TTF europeu; Brent front-month',
			'Taxa de armazenamento de gás na Europa (AGSI+); frete spot de LNG',
			'Pesquisa semanal de preços da ANP; bandeira tarifária da ANEEL'
		],
		confirmationSignals: [
			'Avisos de queda de estoque de gás, anúncios emergenciais da OPEP+ ou fechamento de dutos em veículos confiáveis por dois ciclos.',
			'Henry Hub, TTF ou Brent movem-se na mesma direção, confirmando transmissão.',
			'Preço de combustíveis ou anúncios tarifários no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Disrupção de rotas de suprimento permanece ativa: expansão alternativa não compensou o volume perdido.',
			'Nenhuma resolução rápida se materializa: não houve pacote emergencial de oferta suficiente.',
			'O canal de exposição do Brasil permanece intacto: preços domésticos seguem benchmarks internacionais.'
		],
		changeTriggers: [
			'Alertas de disrupção caem abaixo do limiar ou preços de energia revertem por três ciclos.',
			'Intervenção coordenada restaura oferta com normalização de preços em até 60 dias.',
			'Indicadores de energia no Brasil rompem correlação com benchmarks globais.'
		]
	},
	'recession-signal': {
		name: 'Sinal de Recessão',
		keyJudgments: [
			'Indicadores avançados e de atividade apontam desaceleração sincronizada, elevando risco de recessão.',
			'O Brasil enfrenta compressão de demanda externa e aperto financeiro, reduzindo exportações e investimento.',
			'As Forças Armadas brasileiras devem monitorar risco fiscal e pressões sobre orçamento de defesa.'
		],
		indicators: [
			'PMI ISM manufatura/serviços; Leading Economic Index (Conference Board)',
			'Inversão da curva 3m/10y; índice de confiança do consumidor',
			'Superávit comercial do Brasil (MDIC); fluxo de capital do BCB (IDP)'
		],
		confirmationSignals: [
			'PMIs negativos, alta de pedidos de desemprego ou inversão persistente da curva em veículos confiáveis por dois ciclos.',
			'LEI em queda ou confiança do consumidor abaixo de limiares recessivos movem-se na mesma direção.',
			'Superávit comercial ou fluxo de capitais no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Transmissão da política monetária permanece ativa: altas de juros ainda não foram neutralizadas.',
			'Nenhuma resolução rápida se materializa: não houve corte de juros ou estímulo fiscal amplo.',
			'O canal de exposição do Brasil permanece intacto: receitas de exportação seguem sensíveis ao ciclo global.'
		],
		changeTriggers: [
			'Pedidos de desemprego caem abaixo do limiar ou habitação reverte a positivo por três ciclos.',
			'Pivô de BC normaliza curva e PMI acima de 50 por dois meses.',
			'PIB e comércio do Brasil rompem correlação com indicadores EUA-UE.'
		]
	},
	'inflation-spiral': {
		name: 'Espiral Inflacionária',
		keyJudgments: [
			'Choques climáticos na oferta agrícola e gargalos logísticos amplificam inflação, criando ciclo de preços em energia e alimentos.',
			'O Brasil enfrenta volatilidade de preços de alimentos e pressão inflacionária doméstica.',
			'As Forças Armadas brasileiras devem monitorar pressões de custo em combustíveis, alimentos e manutenção.'
		],
		indicators: [
			'FAO Food Price Index; IEA energy price composite',
			'Futuros de trigo, milho e soja (CBOT)',
			'IPCA alimentos; índice de diesel da ANP'
		],
		confirmationSignals: [
			'CPI acelerando com aumento de fretes em veículos confiáveis por dois ciclos.',
			'Futuros agrícolas ou custos de energia movem-se na mesma direção.',
			'Componente de alimentos do IPCA acompanha o vetor global.'
		],
		assumptions: [
			'Desbalanceamento oferta-demanda permanece ativo: disrupções não se resolveram.',
			'Nenhuma resolução rápida se materializa: não houve liberação emergencial de estoques.',
			'O canal de exposição do Brasil permanece intacto: preços domésticos seguem benchmarks.'
		],
		changeTriggers: [
			'Aceleração do CPI cai abaixo do limiar ou fretes revertem por três ciclos.',
			'Liberação coordenada de estoques reduz preços agrícolas em dois ciclos.',
			'IPCA alimentos rompe correlação com índices globais por três ciclos.'
		]
	},
	'dollar-stress': {
		name: 'Estresse do Dólar',
		keyJudgments: [
			'Pressão simultânea de política do Fed, contágio cripto e desacoplamento financeiro EUA‑China cria incerteza sobre funding em dólar.',
			'O Brasil enfrenta pressão de depreciação cambial e maior custo de dívida em dólar.',
			'As Forças Armadas brasileiras devem avaliar riscos de passivos em moeda estrangeira.'
		],
		indicators: [
			'DXY; variação semanal do balanço do Fed',
			'JPMorgan EMCI; yield real do Treasury 10y',
			'BRL/USD; intervenções do BCB'
		],
		confirmationSignals: [
			'DXY acima de 110 ou ativação de linhas swap em veículos confiáveis por dois ciclos.',
			'Moedas emergentes ou yields dos Treasuries movem-se na mesma direção.',
			'Câmbio do real ou reservas do BCB acompanham o vetor global.'
		],
		assumptions: [
			'Escassez de funding em dólar permanece ativa: normalização do balanço do Fed não foi revertida.',
			'Nenhuma resolução rápida se materializa: não houve pivô do Fed ou expansão coordenada de swaps.',
			'O canal de exposição do Brasil permanece intacto: dívida externa e práticas de comércio seguem sensíveis ao dólar.'
		],
		changeTriggers: [
			'Indicadores de estresse em dólar caem abaixo do limiar ou DXY abaixo de 105 por três ciclos.',
			'Pivô do Fed ou expansão de swaps normaliza condições em 30 dias.',
			'Real e dívida externa rompem correlação com DXY por três ciclos.'
		]
	},
	'ai-disruption-wave': {
		name: 'Onda de Disrupção por IA',
		keyJudgments: [
			'Adoção rápida de IA por grandes empregadores acelera deslocamento de trabalho white-collar.',
			'O Brasil enfrenta aumento do gap de habilidades em funções administrativas, legais e analíticas.',
			'As Forças Armadas brasileiras devem acompanhar deslocamento de trabalho em funções técnicas e analíticas.'
		],
		indicators: [
			'Stanford HAI AI Index; patentes de IA (WIPO)',
			'Folha de pagamento do setor tech nos EUA (BLS); capex em IA',
			'Matrículas SENAI em requalificação de IA; emprego PNAD em TI'
		],
		confirmationSignals: [
			'Anúncios de demissões no setor tech citando IA por dois ciclos consecutivos.',
			'Patentes de IA ou gasto em adoção empresarial movem-se na mesma direção.',
			'Emprego em TI no Brasil ou demanda por requalificação acompanha o vetor global.'
		],
		assumptions: [
			'Ritmo de implantação de IA permanece ativo: não houve pausa regulatória.',
			'Nenhuma resolução rápida se materializa: não houve programa de transição em escala.',
			'O canal de exposição do Brasil permanece intacto: mercados de trabalho de serviços seguem expostos.'
		],
		changeTriggers: [
			'Anúncios de demissões por IA caem abaixo do limiar ou adoção reverte.',
			'Programa universal de transição reduz desemprego estrutural.',
			'Emprego em TI no Brasil rompe correlação com ciclos globais.'
		]
	},
	'disinfo-storm': {
		name: 'Tempestade de Desinformação',
		keyJudgments: [
			'Ciclos eleitorais são explorados por campanhas de mídia sintética combinando deepfakes, texto gerado por IA e amplificação inautêntica.',
			'O Brasil enfrenta risco elevado de desinformação dado calendário eleitoral e alta penetração de redes sociais.',
			'As Forças Armadas brasileiras devem fortalecer protocolos de verificação e apoiar segurança eleitoral.'
		],
		indicators: [
			'Relatórios DSA da UE sobre remoção de deepfakes; takedowns coordenados (Meta/Google)',
			'Alertas de integridade eleitoral (NDI, IRI, IFES)',
			'Reclamações do TSE; notificações de incidentes da ANPD'
		],
		confirmationSignals: [
			'Incidentes de deepfake contra candidatos ou takedowns coordenados em veículos confiáveis por dois ciclos.',
			'Alertas de integridade eleitoral movem-se na mesma direção.',
			'Relatórios do TSE ou de plataformas no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Intenção adversária permanece ativa: atores mantêm motivação e capacidade.',
			'Nenhuma resolução rápida se materializa: não houve mandato amplo de detecção de deepfakes.',
			'O canal de exposição do Brasil permanece intacto: usuários seguem expostos a conteúdo sintético.'
		],
		changeTriggers: [
			'Incidentes de deepfake caem abaixo do limiar ou campanhas coordenadas revertem.',
			'Implantação multi-plataforma reduz alcance de deepfakes no ciclo eleitoral.',
			'Taxas de incidentes no Brasil rompem correlação com tendências globais.'
		]
	},
	'pandemic-redux': {
		name: 'Retorno da Pandemia',
		keyJudgments: [
			'Patógeno de alta transmissibilidade e evasão imune progride de surto local para disseminação multinacional.',
			'O Brasil enfrenta pressão no sistema de saúde e disrupção de suprimentos farmacêuticos e de PPE.',
			'As Forças Armadas brasileiras devem revisar planos de resposta e prontidão sob protocolos de quarentena.'
		],
		indicators: [
			'Eventos WHO Disease Outbreak News; estimativa de R efetivo',
			'Capacidade aérea global (OAG); rastreador de disrupção farmacêutica',
			'Alertas InfoGripe; autorizações emergenciais da ANVISA'
		],
		confirmationSignals: [
			'Declarações de fase 4+ da OMS ou emergências nacionais em dois países por dois ciclos.',
			'Queda de volume aéreo ou alertas de disrupção farmacêutica movem-se na mesma direção.',
			'Nível de alerta do Ministério da Saúde ou autorizações da ANVISA acompanham o vetor global.'
		],
		assumptions: [
			'Potencial de transmissão permanece ativo: características não melhoraram materialmente.',
			'Nenhuma resolução rápida se materializa: vacina/antiviral não foi escalado.',
			'O canal de exposição do Brasil permanece intacto: vínculos de viagem e comércio seguem relevantes.'
		],
		changeTriggers: [
			'Gravidade da OMS cai abaixo do limiar ou transmissão reverte por três ciclos.',
			'Contramedida eficaz reduz casos abaixo do baseline em 60 dias.',
			'Casos no Brasil rompem correlação com o país fonte.'
		]
	},
	'climate-shock': {
		name: 'Choque Climático',
		keyJudgments: [
			'Eventos extremos intensificados causam danos simultâneos a produção agrícola, infraestrutura e redes de energia.',
			'O Brasil enfrenta exposição direta por danos em regiões agrícolas e estresse na malha logística.',
			'As Forças Armadas brasileiras devem monitorar demanda de apoio logístico e resiliência de instalações.'
		],
		indicators: [
			'Anomalia de temperatura NOAA/WMO; NDVI de estresse de vegetação',
			'Futuros agrícolas (CME); índice global de disrupção logística',
			'Eventos extremos do INMET; revisões de safra EMBRAPA'
		],
		confirmationSignals: [
			'Furacões categoria 4+, secas e eventos simultâneos em regiões-chave por dois ciclos.',
			'Preços agrícolas ou disrupção logística movem-se na mesma direção.',
			'Alertas INMET ou revisões EMBRAPA acompanham o vetor global.'
		],
		assumptions: [
			'Intensidade climática permanece ativa: padrão não retornou à média histórica.',
			'Nenhuma resolução rápida se materializa: não houve financiamento emergencial suficiente.',
			'O canal de exposição do Brasil permanece intacto: regiões exportadoras seguem expostas.'
		],
		changeTriggers: [
			'Frequência de eventos extremos cai abaixo do limiar por três ciclos.',
			'Realocação emergencial restaura produção acima de 90% em duas safras.',
			'Produção e logística no Brasil rompem correlação com métricas globais.'
		]
	},
	'social-pressure': {
		name: 'Pressão Social',
		keyJudgments: [
			'Combinação de custo de vida, desemprego, reação à imigração e polarização cria instabilidade social sustentada.',
			'O Brasil enfrenta maior risco de violência política e disrupção de serviços em centros urbanos.',
			'As Forças Armadas brasileiras devem manter prontidão de apoio civil e coordenação com forças estaduais.'
		],
		indicators: [
			'Eventos de protesto ACLED; Índice de Estabilidade Política (EIU)',
			'Confiança do consumidor (G7); incidentes de violência eleitoral',
			'Índice de vulnerabilidade IBGE; operações de ordem pública (PM)'
		],
		confirmationSignals: [
			'Protestos multi-cidade ligados a pelo menos três estressores por dois ciclos.',
			'Confiança do consumidor em mínimas ou violência eleitoral movem-se na mesma direção.',
			'Indicadores de estabilidade no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Convergência multi-fator permanece ativa: estressores seguem simultaneamente elevados.',
			'Nenhuma resolução rápida se materializa: não houve pacote de alívio ou pacto de desescalada.',
			'O canal de exposição do Brasil permanece intacto: níveis de desigualdade e polarização seguem elevados.'
		],
		changeTriggers: [
			'Frequência de protestos cai abaixo do limiar ou dois estressores revertem por três ciclos.',
			'Pacote social reduz índices de hardship em duas categorias em dois trimestres.',
			'Indicadores sociais no Brasil rompem correlação com o composto global.'
		]
	},
	'cyber-warfare-escalation': {
		name: 'Escalada de Guerra Cibernética',
		keyJudgments: [
			'Atividade cibernética de estados e ataques a infraestrutura crítica aumentam risco de escalada e interrupções sistêmicas.',
			'O Brasil enfrenta risco de spillover em setores financeiros, energia e comunicações.',
			'As Forças Armadas brasileiras devem elevar vigilância cibernética e coordenação com defesa civil e CERTs.'
		],
		indicators: [
			'Contagem de incidentes de ransomware/zero-day; alertas CISA/ENISA',
			'Anomalias em redes de energia e telecom; falhas de sistemas bancários',
			'Alertas do CTIR.Gov; incidentes setoriais no Brasil'
		],
		confirmationSignals: [
			'Incidentes cibernéticos de alto impacto em múltiplos setores por dois ciclos.',
			'Falhas de infraestrutura ou interrupções financeiras movem-se na mesma direção.',
			'Alertas nacionais acompanham o vetor global.'
		],
		assumptions: [
			'Pressão cibernética permanece ativa: atores estatais mantêm capacidade e intenção.',
			'Nenhuma resolução rápida se materializa: não houve acordo internacional efetivo.',
			'O canal de exposição do Brasil permanece intacto: infraestrutura crítica segue vulnerável.'
		],
		changeTriggers: [
			'Incidentes críticos caem abaixo do limiar por três ciclos.',
			'Medidas coordenadas reduzem severidade e frequência em 60 dias.',
			'Indicadores de risco no Brasil rompem correlação com o cenário global.'
		]
	},
	'critical-infra-attack': {
		name: 'Ataque à Infraestrutura Crítica',
		keyJudgments: [
			'Ataques direcionados a energia, água ou telecom elevam risco de disrupções sistêmicas e efeitos em cascata.',
			'O Brasil enfrenta risco de interrupções em serviços essenciais e cadeia logística.',
			'As Forças Armadas brasileiras devem reforçar proteção de infraestrutura crítica e planos de continuidade.'
		],
		indicators: [
			'Alertas de operadores de energia e água; incidentes de telecom',
			'Relatórios de falhas de rede e blecautes; interrupções logísticas',
			'Alertas do CTIR.Gov; falhas de infraestrutura registradas'
		],
		confirmationSignals: [
			'Incidentes confirmados em infraestrutura crítica por dois ciclos consecutivos.',
			'Quedas de serviço e interrupções logísticas movem-se na mesma direção.',
			'Relatórios nacionais acompanham o vetor global.'
		],
		assumptions: [
			'Risco de ataque permanece ativo: atores mantêm capacidade e acesso.',
			'Nenhuma resolução rápida se materializa: não houve mitigação sistêmica.',
			'O canal de exposição do Brasil permanece intacto: dependência de infraestrutura crítica é alta.'
		],
		changeTriggers: [
			'Incidentes em infraestrutura crítica caem abaixo do limiar por três ciclos.',
			'Medidas de resiliência reduzem interrupções em 60 dias.',
			'Indicadores nacionais rompem correlação com a tendência global.'
		]
	},
	'cyber-financial-attack': {
		name: 'Ataque Ciberfinanceiro',
		keyJudgments: [
			'Ataques coordenados a bancos e sistemas de pagamento elevam risco de crise de confiança financeira.',
			'O Brasil enfrenta vulnerabilidade a interrupções de liquidação e volatilidade de mercado.',
			'As Forças Armadas brasileiras devem monitorar impactos em infraestrutura de pagamentos e coordenação com o BACEN.'
		],
		indicators: [
			'Incidentes em SWIFT/clearing; alertas de segurança bancária',
			'Falhas de liquidação e indisponibilidade de canais de pagamento',
			'Relatórios do BACEN e de bancos brasileiros'
		],
		confirmationSignals: [
			'Incidentes ciber em bancos sistêmicos por dois ciclos.',
			'Interrupções de pagamento e volatilidade movem-se na mesma direção.',
			'Alertas do BACEN acompanham o vetor global.'
		],
		assumptions: [
			'Ameaça ciberfinanceira permanece ativa: atores mantém capacidade.',
			'Nenhuma resolução rápida se materializa: não houve defesa coordenada suficiente.',
			'O canal de exposição do Brasil permanece intacto: infraestrutura financeira é conectada globalmente.'
		],
		changeTriggers: [
			'Incidentes caem abaixo do limiar por três ciclos.',
			'Mitigações coordenadas reduzem indisponibilidade em 60 dias.',
			'Indicadores brasileiros rompem correlação com o global.'
		]
	},
	'energy-weaponization': {
		name: 'Arma de Energia',
		keyJudgments: [
			'Fornecedores energéticos usam preços e exportações como instrumento geopolítico, elevando instabilidade.',
			'O Brasil enfrenta pressão em custos de importação e volatilidade de preços internos.',
			'As Forças Armadas brasileiras devem monitorar riscos de suprimento e planejamento de contingência.'
		],
		indicators: [
			'Cortes de oferta OPEP+; anúncios de embargo',
			'Spreads de preços entre regiões; volatilidade de contratos futuros',
			'Custos de importação ANP; estoques estratégicos'
		],
		confirmationSignals: [
			'Anúncios de restrição de oferta por dois ciclos consecutivos.',
			'Spreads regionais e volatilidade movem-se na mesma direção.',
			'Custos de importação no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Instrumentalização energética permanece ativa: não houve reversão de política.',
			'Nenhuma resolução rápida se materializa: não houve compensação de oferta.',
			'O canal de exposição do Brasil permanece intacto: dependência de importações persiste.'
		],
		changeTriggers: [
			'Restrições de oferta caem abaixo do limiar por três ciclos.',
			'Realocação de oferta reduz volatilidade em 60 dias.',
			'Custos no Brasil rompem correlação com benchmarks globais.'
		]
	},
	'resource-war': {
		name: 'Guerra por Recursos',
		keyJudgments: [
			'Competição por recursos críticos (energia, minerais, água) intensifica tensões geopolíticas.',
			'O Brasil enfrenta pressão sobre preços de insumos e risco de restrições comerciais.',
			'As Forças Armadas brasileiras devem acompanhar cadeias de suprimento de minerais críticos.'
		],
		indicators: [
			'Preços de lítio, níquel e terras raras; restrições de exportação',
			'Contingências de mineração e logística; conflitos em regiões produtoras',
			'Dados de exportação e importação do Brasil (MDIC)'
		],
		confirmationSignals: [
			'Anúncios de restrição de exportação e conflitos em regiões produtoras por dois ciclos.',
			'Preços de minerais críticos movem-se na mesma direção.',
			'Fluxos comerciais do Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Competição por recursos permanece ativa: não houve diversificação suficiente.',
			'Nenhuma resolução rápida se materializa: acordos de fornecimento não foram ampliados.',
			'O canal de exposição do Brasil permanece intacto: cadeias de suprimento seguem sensíveis.'
		],
		changeTriggers: [
			'Restrição de exportação cai abaixo do limiar por três ciclos.',
			'Acordos multilaterais estabilizam oferta.',
			'Fluxos do Brasil rompem correlação com preços globais.'
		]
	},
	'green-transition-shock': {
		name: 'Choque da Transição Verde',
		keyJudgments: [
			'Aceleração regulatória e tecnológica na transição energética gera disrupções em setores tradicionais.',
			'O Brasil enfrenta volatilidade de investimentos e reprecificação de ativos fósseis.',
			'As Forças Armadas brasileiras devem avaliar impactos em infraestrutura e suprimentos energéticos.'
		],
		indicators: [
			'Preços de carbono; cronograma de descarbonização',
			'Investimentos em renováveis; custos de capital em energia fóssil',
			'Indicadores de transição energética no Brasil'
		],
		confirmationSignals: [
			'Novos mandatos regulatórios e mudanças de preços de carbono por dois ciclos.',
			'Investimento e custos de capital movem-se na mesma direção.',
			'Indicadores brasileiros acompanham o vetor global.'
		],
		assumptions: [
			'Ritmo de transição permanece ativo: políticas não recuaram.',
			'Nenhuma resolução rápida se materializa: não houve transição gradual suficiente.',
			'O canal de exposição do Brasil permanece intacto: matriz energética segue sensível.'
		],
		changeTriggers: [
			'Mandatos regulatórios caem abaixo do limiar por três ciclos.',
			'Pacotes de transição reduzem volatilidade em 60 dias.',
			'Indicadores do Brasil rompem correlação com a tendência global.'
		]
	},
	'food-crisis-spiral': {
		name: 'Espiral de Crise Alimentar',
		keyJudgments: [
			'Choques simultâneos de clima, logística e preços aceleram insegurança alimentar.',
			'O Brasil enfrenta pressão sobre preços domésticos e cadeias de suprimento de alimentos.',
			'As Forças Armadas brasileiras devem acompanhar riscos de abastecimento e logística humanitária.'
		],
		indicators: [
			'WFP/FAO alertas de insegurança alimentar; preços globais de alimentos',
			'Disrupções logísticas; custos de frete de grãos',
			'Preços ao consumidor de alimentos no Brasil; estoques CONAB'
		],
		confirmationSignals: [
			'Alertas de insegurança alimentar e alta de preços por dois ciclos.',
			'Fretes de grãos e preços movem-se na mesma direção.',
			'Preços no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Pressão alimentar permanece ativa: choques não foram resolvidos.',
			'Nenhuma resolução rápida se materializa: não houve liberação suficiente de estoques.',
			'O canal de exposição do Brasil permanece intacto: preços internos seguem benchmarks.'
		],
		changeTriggers: [
			'Alertas de crise alimentar caem abaixo do limiar por três ciclos.',
			'Intervenção internacional reduz preços em duas safras.',
			'Preços no Brasil rompem correlação com índices globais.'
		]
	},
	'climate-migration': {
		name: 'Pressão Migratória Climática',
		keyJudgments: [
			'Eventos climáticos extremos impulsionam deslocamentos populacionais e pressão sobre fronteiras.',
			'O Brasil enfrenta aumento de fluxos migratórios e pressão sobre serviços públicos.',
			'As Forças Armadas brasileiras devem monitorar rotas e capacidade de resposta humanitária.'
		],
		indicators: [
			'Deslocamentos climáticos (UNHCR/IOM); desastres declarados',
			'Fluxos em fronteiras regionais; pedidos de refúgio',
			'Indicadores de migração e abrigamento no Brasil'
		],
		confirmationSignals: [
			'Declarações de desastre e deslocamentos em dois ciclos consecutivos.',
			'Fluxos fronteiriços movem-se na mesma direção.',
			'Indicadores nacionais acompanham o vetor global.'
		],
		assumptions: [
			'Pressão migratória permanece ativa: eventos climáticos persistem.',
			'Nenhuma resolução rápida se materializa: não houve reassentamento em escala.',
			'O canal de exposição do Brasil permanece intacto: fronteiras e serviços seguem sensíveis.'
		],
		changeTriggers: [
			'Deslocamentos caem abaixo do limiar por três ciclos.',
			'Programa internacional reduz fluxos em 90 dias.',
			'Indicadores brasileiros rompem correlação com o global.'
		]
	},
	'agricultural-collapse': {
		name: 'Sinal de Colapso Agrícola',
		keyJudgments: [
			'Sequência de eventos climáticos extremos e pragas reduz produtividade agrícola em regiões-chave.',
			'O Brasil enfrenta risco de queda de produção e aumento de preços de alimentos.',
			'As Forças Armadas brasileiras devem avaliar capacidade logística para apoio ao abastecimento.'
		],
		indicators: [
			'Previsões de safra (USDA/CONAB); NDVI e estresse hídrico',
			'Preços futuros de grãos; custos de fertilizantes',
			'Índices de produtividade agrícola no Brasil'
		],
		confirmationSignals: [
			'Revisões negativas de safra e estresse hídrico por dois ciclos.',
			'Preços de grãos e fertilizantes movem-se na mesma direção.',
			'Produtividade brasileira acompanha o vetor global.'
		],
		assumptions: [
			'Choque agrícola permanece ativo: perdas não foram compensadas.',
			'Nenhuma resolução rápida se materializa: não houve recuperação de produtividade.',
			'O canal de exposição do Brasil permanece intacto: mercado interno segue sensível.'
		],
		changeTriggers: [
			'Revisões negativas caem abaixo do limiar por três ciclos.',
			'Recomposição de produtividade acima de 90% em duas safras.',
			'Indicadores do Brasil rompem correlação com preços globais.'
		]
	},
	'sovereign-debt-crisis': {
		name: 'Crise de Dívida Soberana',
		keyJudgments: [
			'Pressões de juros e desaceleração elevam risco de inadimplência soberana em múltiplos países.',
			'O Brasil enfrenta aumento de spreads e custos de refinanciamento.',
			'As Forças Armadas brasileiras devem monitorar impacto fiscal e estabilidade orçamentária.'
		],
		indicators: [
			'CDS soberano; spreads de títulos em dólar',
			'Leilões de dívida e rolagem em mercados emergentes',
			'EMBI+ Brasil; cronograma de dívida do Tesouro'
		],
		confirmationSignals: [
			'Abertura de spreads e deterioração de leilões por dois ciclos.',
			'CDS e yields movem-se na mesma direção.',
			'EMBI+ Brasil acompanha o vetor global.'
		],
		assumptions: [
			'Estresse de dívida soberana permanece ativo: condições de mercado seguem restritivas.',
			'Nenhuma resolução rápida se materializa: não houve backstop suficiente.',
			'O canal de exposição do Brasil permanece intacto: vulnerabilidade a spreads externos permanece.'
		],
		changeTriggers: [
			'Spreads soberanos caem abaixo do limiar por três ciclos.',
			'Intervenção multilateral estabiliza spreads em 60 dias.',
			'Spreads do Brasil rompem correlação com o global.'
		]
	},
	'credit-contagion': {
		name: 'Contágio de Crédito',
		keyJudgments: [
			'Alta de inadimplência e spreads indica contágio de crédito entre setores.',
			'O Brasil enfrenta risco de restrição de crédito e pressão sobre bancos.',
			'As Forças Armadas brasileiras devem monitorar condições de funding e impactos fiscais.'
		],
		indicators: [
			'Spreads IG e HY; taxas de default',
			'Índices de estresse de crédito; volume de reestruturações',
			'Spreads de crédito no Brasil; inadimplência bancária'
		],
		confirmationSignals: [
			'Abertura simultânea de spreads e aumento de defaults por dois ciclos.',
			'Índices de estresse movem-se na mesma direção.',
			'Spreads no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Contágio de crédito permanece ativo: aperto não foi revertido.',
			'Nenhuma resolução rápida se materializa: não houve suporte suficiente.',
			'O canal de exposição do Brasil permanece intacto: crédito doméstico é sensível.'
		],
		changeTriggers: [
			'Spreads caem abaixo do limiar por três ciclos.',
			'Programa de liquidez normaliza spreads em 60 dias.',
			'Spreads do Brasil rompem correlação com o global.'
		]
	},
	'dedollarization-signal': {
		name: 'Sinal de Desdolarização',
		keyJudgments: [
			'Movimentos para acordos comerciais em moedas locais e redução de reservas em dólar ganham tração.',
			'O Brasil enfrenta reprecificação de riscos cambiais e ajustes de fluxo comercial.',
			'As Forças Armadas brasileiras devem acompanhar impactos em compras externas e financiamento.'
		],
		indicators: [
			'Acordos bilaterais de comércio em moeda local; participação do dólar em reservas',
			'Pagamentos internacionais em moedas alternativas; swaps bilaterais',
			'Fluxos de comércio do Brasil por moeda de liquidação'
		],
		confirmationSignals: [
			'Anúncios de acordos em moeda local por dois ciclos.',
			'Participação do dólar em reservas cai na mesma direção.',
			'Fluxos do Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Tração da desdolarização permanece ativa: iniciativas não foram revertidas.',
			'Nenhuma resolução rápida se materializa: não houve retorno à dominância do dólar.',
			'O canal de exposição do Brasil permanece intacto: comércio é sensível a moedas de liquidação.'
		],
		changeTriggers: [
			'Acordos em moeda local caem abaixo do limiar por três ciclos.',
			'Participação do dólar nas reservas se recupera de forma consistente.',
			'Fluxos do Brasil rompem correlação com o vetor global.'
		]
	},
	'social-tinderbox': {
		name: 'Barril de Pólvora Social',
		keyJudgments: [
			'Combinação de tensões econômicas e polarização cria ambiente propenso a explosões sociais rápidas.',
			'O Brasil enfrenta risco de protestos abruptos e instabilidade local.',
			'As Forças Armadas brasileiras devem manter prontidão para apoio a segurança pública.'
		],
		indicators: [
			'Índices de inflação de alimentos; desemprego juvenil',
			'Violência política e incidentes de protesto',
			'Indicadores de risco social no Brasil'
		],
		confirmationSignals: [
			'Picos simultâneos de inflação e protestos por dois ciclos.',
			'Violência política e protestos movem-se na mesma direção.',
			'Indicadores no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Tensões sociais permanecem ativas: não houve alívio econômico suficiente.',
			'Nenhuma resolução rápida se materializa: não houve pactos de despolarização.',
			'O canal de exposição do Brasil permanece intacto: fatores locais amplificam o risco.'
		],
		changeTriggers: [
			'Protestos caem abaixo do limiar por três ciclos.',
			'Medidas de alívio reduzem tensões em 90 dias.',
			'Indicadores brasileiros rompem correlação com o global.'
		]
	},
	'democratic-stress': {
		name: 'Estresse Democrático',
		keyJudgments: [
			'Contestação eleitoral e erosão institucional aumentam a fragilidade democrática.',
			'O Brasil enfrenta maior risco de crises de legitimidade e polarização.',
			'As Forças Armadas brasileiras devem reforçar protocolos de neutralidade institucional.'
		],
		indicators: [
			'Relatórios de liberdade civil; índices de confiança institucional',
			'Disputas eleitorais e judicialização',
			'Indicadores do TSE e confiança pública no Brasil'
		],
		confirmationSignals: [
			'Contestações eleitorais em múltiplos países por dois ciclos.',
			'Queda de confiança institucional move-se na mesma direção.',
			'Indicadores no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Estresse democrático permanece ativo: polarização não recuou.',
			'Nenhuma resolução rápida se materializa: não houve pactos institucionais.',
			'O canal de exposição do Brasil permanece intacto: ambiente político segue sensível.'
		],
		changeTriggers: [
			'Contestações caem abaixo do limiar por três ciclos.',
			'Reformas institucionais elevam confiança em 90 dias.',
			'Indicadores brasileiros rompem correlação com o global.'
		]
	},
	'global-protest-wave': {
		name: 'Onda Global de Protestos',
		keyJudgments: [
			'Protestos simultâneos em múltiplos países indicam descontentamento sistêmico.',
			'O Brasil enfrenta risco de contágio social e mobilizações coordenadas.',
			'As Forças Armadas brasileiras devem acompanhar sinais de escalada e capacidade logística de resposta.'
		],
		indicators: [
			'Contagem de protestos ACLED; indicadores de estabilidade social',
			'Bloqueios e greves em setores críticos',
			'Eventos de protesto e greves no Brasil'
		],
		confirmationSignals: [
			'Picos de protestos em múltiplas regiões por dois ciclos.',
			'Greves e bloqueios movem-se na mesma direção.',
			'Eventos no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Onda de protestos permanece ativa: fatores estruturais persistem.',
			'Nenhuma resolução rápida se materializa: não houve pacotes de alívio.',
			'O canal de exposição do Brasil permanece intacto: tensões locais podem amplificar.'
		],
		changeTriggers: [
			'Frequência de protestos cai abaixo do limiar por três ciclos.',
			'Medidas de alívio reduzem protestos em 90 dias.',
			'Indicadores no Brasil rompem correlação com o global.'
		]
	},
	'arms-race-acceleration': {
		name: 'Aceleração da Corrida Armamentista',
		keyJudgments: [
			'Aumento simultâneo de gastos militares e modernização acelera competição estratégica.',
			'O Brasil enfrenta pressão por modernização e aumento de custos de defesa.',
			'As Forças Armadas brasileiras devem monitorar riscos de obsolescência e dependência tecnológica.'
		],
		indicators: [
			'Orçamentos de defesa; encomendas de armamentos',
			'Testes de mísseis e modernização nuclear',
			'Gastos e projetos de defesa no Brasil'
		],
		confirmationSignals: [
			'Anúncios de aumento de gastos militares por dois ciclos.',
			'Testes e modernizações movem-se na mesma direção.',
			'Indicadores no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Corrida armamentista permanece ativa: tensões estratégicas persistem.',
			'Nenhuma resolução rápida se materializa: não houve acordos de controle.',
			'O canal de exposição do Brasil permanece intacto: custos de defesa seguem sensíveis.'
		],
		changeTriggers: [
			'Gastos militares caem abaixo do limiar por três ciclos.',
			'Acordos de controle reduzem modernização em 90 dias.',
			'Indicadores brasileiros rompem correlação com o global.'
		]
	},
	'multi-domain-conflict': {
		name: 'Conflito Multidomínio',
		keyJudgments: [
			'Conflitos simultâneos em domínios terrestre, cibernético, espacial e informacional aumentam risco sistêmico.',
			'O Brasil enfrenta exposição indireta via logística, energia e ciberinfraestrutura.',
			'As Forças Armadas brasileiras devem coordenar inteligência entre domínios e resiliência crítica.'
		],
		indicators: [
			'Ataques cibernéticos e interferência em satélites; incidentes de guerra eletrônica',
			'Interrupções logísticas e de energia; escaladas militares',
			'Alertas de infraestrutura crítica e ciber no Brasil'
		],
		confirmationSignals: [
			'Incidentes em múltiplos domínios por dois ciclos consecutivos.',
			'Disrupções logísticas e cibernéticas movem-se na mesma direção.',
			'Alertas no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Conflito multidomínio permanece ativo: não houve redução coordenada.',
			'Nenhuma resolução rápida se materializa: não houve cessar-fogo abrangente.',
			'O canal de exposição do Brasil permanece intacto: infraestrutura crítica segue conectada.'
		],
		changeTriggers: [
			'Incidentes multidomínio caem abaixo do limiar por três ciclos.',
			'Acordos reduzem escaladas em 90 dias.',
			'Indicadores no Brasil rompem correlação com o global.'
		]
	},
	'escalation-ladder': {
		name: 'Escada de Escalada',
		keyJudgments: [
			'Sequência de respostas militares e políticas indica avanço de escalada entre grandes potências.',
			'O Brasil enfrenta aumento de risco geopolítico e volatilidade de mercados.',
			'As Forças Armadas brasileiras devem monitorar pontos de inflexão e preparar contingências.'
		],
		indicators: [
			'Posturas militares e exercícios; alertas de prontidão',
			'Sanções e retaliações; retórica diplomática',
			'Indicadores de risco geopolítico no Brasil'
		],
		confirmationSignals: [
			'Sequência de escaladas por dois ciclos consecutivos.',
			'Sanções e postura militar movem-se na mesma direção.',
			'Indicadores no Brasil acompanham o vetor global.'
		],
		assumptions: [
			'Escalada permanece ativa: não houve recuo verificável.',
			'Nenhuma resolução rápida se materializa: não houve acordo de desescalada.',
			'O canal de exposição do Brasil permanece intacto: mercado e segurança seguem sensíveis.'
		],
		changeTriggers: [
			'Escalada cai abaixo do limiar por três ciclos.',
			'Acordo de desescalada reduz tensão em 90 dias.',
			'Indicadores no Brasil rompem correlação com o global.'
		]
	},
	'systemic-fragility': {
		name: 'Fragilidade Sistêmica',
		keyJudgments: [
			'Choques simultâneos em dívida soberana, logística, ciber e clima sobrecarregam buffers de resiliência.',
			'O Brasil enfrenta exposição composta: estresse climático e pressão fiscal combinam-se com ameaças cibernéticas.',
			'As Forças Armadas brasileiras devem monitorar demandas de contingência multissetorial e interoperabilidade.'
		],
		indicators: [
			'BIS Global Risk Index; probabilidade de cenário adverso WEO (FMI)',
			'Índice de correlação entre ativos; NY Fed Global Supply Chain Pressure Index',
			'Compósito de estresse multissetorial brasileiro (BACEN + ANEEL + CTIR.Gov + CONAB)'
		],
		confirmationSignals: [
			'Três ou mais sinais simultâneos (CDS, logística, ciber, clima) por dois ciclos.',
			'Indicadores de risco sistêmico do BIS/FMI movem-se na mesma direção.',
			'Compósito multissetorial do Brasil acompanha o vetor global.'
		],
		assumptions: [
			'Acoplamento entre domínios permanece ativo: riscos se transmitem entre si.',
			'Nenhuma resolução rápida se materializa: não houve intervenção coordenada suficiente.',
			'O canal de exposição do Brasil permanece intacto: acoplamento multissetorial é real.'
		],
		changeTriggers: [
			'Coocorrência de estresse cai abaixo do limiar por três ciclos.',
			'Resposta multilateral estabiliza três de quatro domínios simultaneamente.',
			'Compósito do Brasil rompe correlação com fragilidade global.'
		]
	},
	'polycrisis': {
		name: 'Policrise',
		keyJudgments: [
			'Choques sociais, alimentares, climáticos e econômicos se reforçam, criando risco emergente acima da soma das crises isoladas.',
			'O Brasil enfrenta demandas simultâneas humanitárias, inflacionárias, de governança e climáticas.',
			'As Forças Armadas brasileiras devem preparar apoio multiagência e coordenação com defesa civil, saúde e segurança.'
		],
		indicators: [
			'Gap de financiamento OCHA; contagem simultânea WFP + UNHCR + WHO',
			'Downgrades de crescimento do FMI; sobreposição de emergências WFP/UNHCR',
			'Decretos federais de emergência em domínios não relacionados (janela 30 dias)'
		],
		confirmationSignals: [
			'Insegurança alimentar, deslocamentos, estresse fiscal e desastres climáticos ativos simultaneamente por dois ciclos.',
			'Gap humanitário global ou apelos multissetoriais acima de 50% da capacidade.',
			'Decretos federais no Brasil em dois ou mais domínios acompanham o vetor global.'
		],
		assumptions: [
			'Efeitos de interação multi-crise permanecem ativos: cada crise agrava as demais.',
			'Nenhuma resolução rápida se materializa: não houve resposta global suficiente.',
			'O canal de exposição do Brasil permanece intacto: risco interno amplifica padrões globais.'
		],
		changeTriggers: [
			'Coocorrência de crises cai abaixo do limiar por três ciclos.',
			'Resposta internacional reduz três de cinco crises em 90 dias.',
			'Frequência de emergência no Brasil rompe correlação com o compósito global.'
		]
	}
};

const SHOULD_VALIDATE_TRANSLATIONS =
	typeof import.meta !== 'undefined' &&
	typeof import.meta.env !== 'undefined' &&
	(import.meta.env.DEV || import.meta.env.MODE === 'test');

let compoundTranslationsValidated = false;
function validateCompoundPatternTranslations(): void {
	if (!SHOULD_VALIDATE_TRANSLATIONS || compoundTranslationsValidated) return;
	for (const pattern of COMPOUND_PATTERNS) {
		const translated = COMPOUND_PATTERNS_PT_BR_BY_ID[pattern.id];
		if (!translated) {
			throw new Error(`[analysis] Missing pt-BR compound translation for ${pattern.id}`);
		}
		if (translated.keyJudgments.length !== pattern.keyJudgments.length) {
			throw new Error(`[analysis] keyJudgments length mismatch for ${pattern.id}`);
		}
		if (translated.indicators.length !== pattern.indicators.length) {
			throw new Error(`[analysis] indicators length mismatch for ${pattern.id}`);
		}
		if (translated.confirmationSignals.length !== pattern.confirmationSignals.length) {
			throw new Error(`[analysis] confirmationSignals length mismatch for ${pattern.id}`);
		}
		if (translated.assumptions.length !== pattern.assumptions.length) {
			throw new Error(`[analysis] assumptions length mismatch for ${pattern.id}`);
		}
		if (translated.changeTriggers.length !== pattern.changeTriggers.length) {
			throw new Error(`[analysis] changeTriggers length mismatch for ${pattern.id}`);
		}
	}
	compoundTranslationsValidated = true;
}

export const COMPOUND_PATTERNS_PT_BR: CompoundPattern[] = COMPOUND_PATTERNS.map((pattern) => {
	const translated = COMPOUND_PATTERNS_PT_BR_BY_ID[pattern.id];
	if (!translated) return pattern;
	return {
		...pattern,
		...translated,
		name: COMPOUND_NAME_OVERRIDES_PT_BR[pattern.id] ?? translated.name ?? pattern.name
	};
});

export function getCompoundPatterns(locale: Locale): CompoundPattern[] {
	if (locale === 'pt-BR') {
		validateCompoundPatternTranslations();
		return COMPOUND_PATTERNS_PT_BR;
	}
	return COMPOUND_PATTERNS;
}

export interface NarrativePattern {
	id: string;
	keywords: string[];
	category: string;
	severity: 'watch' | 'emerging' | 'spreading' | 'disinfo';
}

export interface SourceTypes {
	fringe: string[];
	alternative: string[];
	mainstream: string[];
}

export const CORRELATION_TOPICS: CorrelationTopic[] = [
	{
		id: 'tariffs',
		patterns: [/tariff/i, /trade war/i, /import tax/i, /customs duty/i],
		category: 'Economy'
	},
	{
		id: 'fed-rates',
		patterns: [/federal reserve/i, /interest rate/i, /rate cut/i, /rate hike/i, /powell/i, /fomc/i],
		category: 'Economy'
	},
	{
		id: 'inflation',
		patterns: [/inflation/i, /cpi/i, /consumer price/i, /cost of living/i],
		category: 'Economy'
	},
	{
		id: 'ai-regulation',
		patterns: [/ai regulation/i, /artificial intelligence.*law/i, /ai safety/i, /ai governance/i],
		category: 'Tech'
	},
	{
		id: 'china-tensions',
		patterns: [/china.*taiwan/i, /south china sea/i, /us.*china/i, /beijing.*washington/i],
		category: 'Geopolitics'
	},
	{
		id: 'russia-ukraine',
		patterns: [/ukraine/i, /zelensky/i, /putin.*war/i, /crimea/i, /donbas/i],
		category: 'Conflict'
	},
	{
		id: 'israel-gaza',
		patterns: [/gaza/i, /hamas/i, /netanyahu/i, /israel.*attack/i, /hostage/i],
		category: 'Conflict'
	},
	{
		id: 'iran',
		patterns: [/iran.*nuclear/i, /tehran/i, /ayatollah/i, /iranian.*strike/i],
		category: 'Geopolitics'
	},
	{
		id: 'crypto',
		patterns: [/bitcoin/i, /crypto.*regulation/i, /ethereum/i, /sec.*crypto/i],
		category: 'Finance'
	},
	{
		id: 'housing',
		patterns: [/housing market/i, /mortgage rate/i, /home price/i, /real estate.*crash/i],
		category: 'Economy'
	},
	{
		id: 'layoffs',
		patterns: [/layoff/i, /job cut/i, /workforce reduction/i, /downsizing/i],
		category: 'Business'
	},
	{
		id: 'bank-crisis',
		patterns: [/bank.*fail/i, /banking crisis/i, /fdic/i, /bank run/i],
		category: 'Finance'
	},
	{
		id: 'election',
		patterns: [/election/i, /polling/i, /campaign/i, /ballot/i, /voter/i],
		category: 'Politics'
	},
	{
		id: 'immigration',
		patterns: [/immigration/i, /border.*crisis/i, /migrant/i, /deportation/i, /asylum/i],
		category: 'Politics'
	},
	{
		id: 'climate',
		patterns: [/climate change/i, /wildfire/i, /hurricane/i, /extreme weather/i, /flood/i],
		category: 'Environment'
	},
	{
		id: 'pandemic',
		patterns: [/pandemic/i, /outbreak/i, /virus.*spread/i, /who.*emergency/i, /bird flu/i],
		category: 'Health'
	},
	{
		id: 'nuclear',
		patterns: [/nuclear.*threat/i, /nuclear weapon/i, /atomic/i, /icbm/i],
		category: 'Security'
	},
	{
		id: 'supply-chain',
		patterns: [/supply chain/i, /shipping.*delay/i, /port.*congestion/i, /logistics.*crisis/i],
		category: 'Economy'
	},
	{
		id: 'big-tech',
		patterns: [/antitrust.*tech/i, /google.*monopoly/i, /meta.*lawsuit/i, /apple.*doj/i],
		category: 'Tech'
	},
	{
		id: 'deepfake',
		patterns: [/deepfake/i, /ai.*misinformation/i, /synthetic media/i],
		category: 'Tech'
	},

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
];

export const NARRATIVE_PATTERNS: NarrativePattern[] = [
	{
		id: 'deep-state',
		keywords: ['deep state', 'shadow government', 'permanent state'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'cbdc-control',
		keywords: ['cbdc control', 'digital currency surveillance', 'social credit'],
		category: 'Finance',
		severity: 'watch'
	},
	{
		id: 'wef-agenda',
		keywords: ['great reset', 'wef agenda', 'world economic forum plot'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'bio-weapon',
		keywords: ['lab leak', 'bioweapon', 'gain of function'],
		category: 'Health',
		severity: 'emerging'
	},
	{
		id: 'election-fraud',
		keywords: ['election fraud', 'rigged election', 'stolen election', 'mail ballot fraud'],
		category: 'Political',
		severity: 'watch'
	},
	{
		id: 'ai-doom',
		keywords: ['ai doom', 'ai extinction', 'superintelligence risk', 'agi danger'],
		category: 'Tech',
		severity: 'emerging'
	},
	{
		id: 'ai-consciousness',
		keywords: ['ai sentient', 'ai conscious', 'ai feelings', 'ai alive'],
		category: 'Tech',
		severity: 'emerging'
	},
	{
		id: 'robot-replacement',
		keywords: ['robots replacing', 'automation unemployment', 'job automation'],
		category: 'Economy',
		severity: 'spreading'
	},
	{
		id: 'china-invasion',
		keywords: ['china taiwan invasion', 'china war', 'south china sea conflict'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'nato-expansion',
		keywords: ['nato provocation', 'nato aggression', 'nato encirclement'],
		category: 'Geopolitical',
		severity: 'watch'
	},
	{
		id: 'dollar-collapse',
		keywords: ['dollar collapse', 'dedollarization', 'brics currency', 'petrodollar death'],
		category: 'Finance',
		severity: 'spreading'
	},
	{
		id: 'vaccine-injury',
		keywords: ['vaccine injury', 'vaccine side effect', 'vaccine death', 'turbo cancer'],
		category: 'Health',
		severity: 'watch'
	},
	{
		id: 'next-pandemic',
		keywords: ['next pandemic', 'disease x', 'bird flu pandemic'],
		category: 'Health',
		severity: 'emerging'
	},
	{
		id: 'depopulation',
		keywords: ['depopulation agenda', 'fertility crisis', 'population control'],
		category: 'Society',
		severity: 'disinfo'
	},
	{
		id: 'food-crisis',
		keywords: ['food shortage', 'engineered famine', 'food supply attack'],
		category: 'Economy',
		severity: 'emerging'
	},
	{
		id: 'energy-war',
		keywords: ['energy crisis manufactured', 'green agenda', 'energy shortage'],
		category: 'Economy',
		severity: 'spreading'
	},
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
];

// Mainstream narrative patterns with regex for better matching
export interface MainstreamNarrativePattern {
	id: string;
	name: string;
	patterns: RegExp[];
	category: string;
	region?: 'global' | 'brazil' | 'latam' | 'mena';
	sourceCategories?: NewsCategory[];
}

export const MAINSTREAM_NARRATIVE_PATTERNS: MainstreamNarrativePattern[] = [
	// === GLOBAL ECONOMIC ===
	{
		id: 'soft-landing',
		name: 'Soft Landing',
		patterns: [/soft landing/i, /goldilocks/i, /soft[\s-]?landing/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'recession-fears',
		name: 'Recession Fears',
		patterns: [/recession.{0,20}(risk|fear|warn|loom|threat)/i, /fear.{0,10}recession/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'rate-pivot',
		name: 'Fed Pivot',
		patterns: [/rate cut/i, /fed pivot/i, /dovish/i, /hawkish/i, /fed.{0,10}(pause|hold)/i],
		category: 'Economy',
		region: 'global'
	},
	{
		id: 'china-decoupling',
		name: 'China Decoupling',
		patterns: [
			/\b(china|beijing|prc)\b.{0,60}\b(decoupl|de-?risk(?:ing)?|friend-?shor(?:ing)?|supply chain shift|strategic autonomy)\b/i,
			/\b(decoupl|de-?risk(?:ing)?|friend-?shor(?:ing)?|supply chain shift|strategic autonomy)\b.{0,60}\b(china|beijing|prc)\b/i,
			/\b(us|usa|u\.s\.?|united states|eu|european union|g7|western)\b.{0,80}\b(china|beijing|prc)\b.{0,100}\b(export controls?|tariffs?|sanctions?|entity list|investment screening|chip (ban|restriction)|technology restriction|trade restriction)\b/i,
			/\b(china|beijing|prc)\b.{0,80}\b(export controls?|tariffs?|sanctions?|entity list|investment screening|chip (ban|restriction)|technology restriction|trade restriction)\b.{0,100}\b(us|usa|u\.s\.?|united states|eu|european union|g7|western)\b/i,
			/\b(us|usa|u\.s\.?|united states|eu|european union|g7|western)\b.{0,80}\b(export controls?|tariffs?|sanctions?|entity list|investment screening|chip (ban|restriction)|technology restriction|trade restriction)\b.{0,100}\b(china|beijing|prc)\b/i,
			/\b(china|beijing|prc)\b.{0,100}\b(export curbs?|rare earth|gallium|germanium|graphite)\b.{0,80}\b(us|usa|u\.s\.?|eu|europe|western|g7|decoupl|de-?risk(?:ing)?)\b/i,
			/\b(china|beijing|prc)\b.{0,80}\b(semiconductors?|chips?)\b.{0,80}\b(export controls?|ban|restriction|license)\b/i
		],
		category: 'Geopolitics',
		region: 'global',
		sourceCategories: ['politics', 'gov', 'finance']
	},

	// === TECH/AI ===
	{
		id: 'ai-hype',
		name: 'AI Hype Cycle',
		patterns: [
			/ai revolution/i,
			/generative ai/i,
			/ai boom/i,
			/ai gold rush/i,
			/chatgpt/i,
			/ai transform/i
		],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'ai-regulation',
		name: 'AI Regulation Push',
		patterns: [/ai.{0,20}(regulation|law|ban|rule|govern)/i, /regulat.{0,10}ai/i, /ai act/i],
		category: 'Tech',
		region: 'global'
	},
	{
		id: 'tech-layoffs',
		name: 'Tech Layoffs Wave',
		patterns: [/layoff/i, /job cut/i, /workforce reduction/i, /downsiz/i, /let go.{0,10}employee/i],
		category: 'Business',
		region: 'global'
	},

	// === POLITICAL ===
	{
		id: 'election-coverage',
		name: 'Global Election Coverage',
		patterns: [
			/election/i,
			/campaign/i,
			/polling/i,
			/ballot/i,
			/candidate/i,
			/vote.{0,5}count/i,
			/\brunoff\b/i,
			/\bincumbent\b/i,
			/\bopposition\b/i
		],
		category: 'Politics',
		region: 'global',
		sourceCategories: ['politics', 'gov']
	},
	{
		id: 'brazil-election-coverage',
		name: 'Brazil Election Coverage',
		patterns: [
			/\b(elei[cç][aã]o|eleitoral|presidencial|presidenci[aá]vel|pr[eé]-?candidat[oa]|campanha|segundo turno|urna|apura[cç][aã]o|tse|tribunal superior eleitoral)\b.{0,60}\b(brasil|brazil|pt|pl|psdb|mdb|uni[aã]o brasil|pdt|psb|psd|lula|bolsonaro|tarc[ií]sio|haddad|ciro gomes|simone tebet)\b/i,
			/\b(brasil|brazil|pt|pl|psdb|mdb|uni[aã]o brasil|pdt|psb|psd|lula|bolsonaro|tarc[ií]sio|haddad|ciro gomes|simone tebet)\b.{0,60}\b(elei[cç][aã]o|eleitoral|presidencial|presidenci[aá]vel|pr[eé]-?candidat[oa]|campanha|segundo turno|urna|apura[cç][aã]o|tse|tribunal superior eleitoral)\b/i
		],
		category: 'Politics',
		region: 'brazil'
	},

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
	{
		id: 'right-framing-global',
		name: 'Right Framing (Global)',
		patterns: [/esquerdistas?/i, /comunistas?/i, /marxistas?/i, /doutrina[çc][ãa]o/i, /ideologia de g[êe]nero/i, /vagabundos?/i, /mamata/i, /petralhas?/i, /bolivarianos?/i, /ditadura do judici[áa]rio/i, /ativismo judicial/i, /aparelhamento/i],
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

	// === BRAZIL ===
	{
		id: 'lula-government',
		name: 'Lula Government',
		patterns: [/lula/i, /planalto/i, /pt.{0,10}governo/i, /governo federal/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'bolsonaro-factor',
		name: 'Bolsonaro Factor',
		patterns: [/bolsonaro/i, /jan(eiro)?\s*8/i, /8 de janeiro/i, /inelegib/i],
		category: 'Politics',
		region: 'brazil'
	},
	{
		id: 'selic-rates',
		name: 'Selic Policy',
		patterns: [/selic/i, /banco central/i, /copom/i, /taxa de juros/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'real-pressure',
		name: 'Pressao no Real (FX)',
		patterns: [
			/\b(brl|real)\b.{0,20}\b(usd|d[oó]lar|dollar|c[âa]mbio|fx|exchange rate)\b/i,
			/\b(usd|d[oó]lar|dollar)\b.{0,20}\b(brl|real)\b/i,
			/\b(real|brl)\b.{0,20}\b(desvaloriza[çc][aã]o|desvaloriza|deprecia[çc][aã]o|depreciat|weakens?|enfraquece)\b/i,
			/\b(c[âa]mbio|fx|exchange rate)\b.{0,20}\b(real|brl)\b.{0,20}\b(alta|dispara|pressure|volatil|deprecia|desvaloriz)\b/i
		],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'real-pressure-drivers',
		name: 'Vetores de Pressao no Real',
		patterns: [
			/\b(sanctions?|san[cç][õo]es|embargo|export controls?)\b.{0,25}\b(us|u\.s\.|eua|estados unidos)\b.{0,40}\b(d[oó]lar|usd|commodity|commodit|brasil|brazil|real|brl)\b/i,
			/\b(infla[çc][aã]o|inflation|ipca)\b.{0,35}\b(brasil|brazil|real|brl|c[âa]mbio|d[oó]lar|usd)\b/i,
			/\b(arcabou[cç]o fiscal|meta fiscal|d[ée]ficit|rombo fiscal|risco fiscal|fiscal pressure|fiscal stress|public debt|d[íi]vida p[úu]blica)\b.{0,35}\b(brasil|brazil|real|brl|c[âa]mbio|d[oó]lar|usd)\b/i,
			/\b(commodit|commodity|soja|min[ée]rio|iron ore|petr[oó]leo|oil)\b.{0,30}\b(fall|queda|drop|deprecia|desvaloriza|slump)\b.{0,30}\b(brasil|brazil|real|brl|d[oó]lar|usd)\b/i,
			/\b(queda das commodities|commodity slump|commodities downturn)\b.{0,30}\b(real|brl|c[âa]mbio|brasil|brazil)\b/i
		],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'fiscal-framework',
		name: 'Fiscal Framework',
		patterns: [/arcabou[cç]o fiscal/i, /teto de gastos/i, /meta fiscal/i, /d[ée]ficit/i],
		category: 'Economy',
		region: 'brazil'
	},
	{
		id: 'amazon-watch',
		name: 'Amazon Watch',
		patterns: [/amaz[oô]nia/i, /desmatamento/i, /ibama/i, /floresta/i, /queimada/i],
		category: 'Environment',
		region: 'brazil'
	},
	{
		id: 'brics-brazil',
		name: 'BRICS Brazil',
		patterns: [/brics/i, /c[úu]pula/i, /sul.{0,5}sul/i, /novo banco/i],
		category: 'Geopolitics',
		region: 'brazil'
	},
	{
		id: 'brazil-crime',
		name: 'Organized Crime',
		patterns: [/pcc/i, /fac[çc][ãa]o/i, /mil[ií]cia/i, /seguran[çc]a p[úu]blica/i, /crime organizado/i],
		category: 'Security',
		region: 'brazil'
	},
	{
		id: 'military-smear',
		name: 'Armed Forces Smear',
		patterns: [
			/ex[ée]rcito.{0,15}(ataque|cr[ií]tica|pol[eê]mica)/i,
			/for[çc]as armadas.{0,15}cr[ií]tica/i,
			/generais.{0,15}pol[eê]mic/i,
			/militares.{0,15}investigad/i
		],
		category: 'Politics',
		region: 'brazil'
	},

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
		patterns: [
			/\b(esquerdistas?|comunistas?|marxistas?|doutrina[çc][ãa]o|ideologia de g[êe]nero|vagabundos?|mamata|petralhas?|bolivarianos?|ditadura do judici[áa]rio|ativismo judicial|aparelhamento)\b.{0,60}\b(brasil|brazil|planalto|stf|lula|bolsonaro|pt|pl|congresso|c[âa]mara dos deputados|senado|tse|governo federal)\b/i,
			/\b(brasil|brazil|planalto|stf|lula|bolsonaro|pt|pl|congresso|c[âa]mara dos deputados|senado|tse|governo federal)\b.{0,60}\b(esquerdistas?|comunistas?|marxistas?|doutrina[çc][ãa]o|ideologia de g[êe]nero|vagabundos?|mamata|petralhas?|bolivarianos?|ditadura do judici[áa]rio|ativismo judicial|aparelhamento)\b/i
		],
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

	// === LATIN AMERICA ===
	{
		id: 'argentina-milei',
		name: 'Milei Argentina',
		patterns: [/milei/i, /argentina.{0,15}econom/i, /peso argentino/i, /libertad avanza/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'argentina-crisis',
		name: 'Argentina Crisis',
		patterns: [/inflaci[oó]n argentina/i, /crisis argentina/i, /fmi.{0,10}argentina/i, /cepo/i],
		category: 'Economy',
		region: 'latam'
	},
	{
		id: 'mexico-amlo',
		name: 'AMLO/Sheinbaum',
		patterns: [/amlo/i, /sheinbaum/i, /morena/i, /mexico.{0,10}gobierno/i, /lópez obrador/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'mexico-cartel',
		name: 'Mexico Cartel Violence',
		patterns: [/cartel/i, /narco/i, /sinaloa/i, /violencia.{0,10}mexico/i, /cjng/i],
		category: 'Security',
		region: 'latam'
	},
	{
		id: 'venezuela-crisis',
		name: 'Venezuela Crisis',
		patterns: [/maduro/i, /venezuela.{0,15}crisis/i, /oposici[oó]n venezolana/i, /guaid[oó]/i],
		category: 'Politics',
		region: 'latam'
	},
	{
		id: 'latam-china',
		name: 'China in LatAm',
		patterns: [
			/china.{0,15}am[eé]rica latina/i,
			/inversi[oó]n china/i,
			/belt and road.{0,10}latam/i,
			/china.{0,10}infraestruct/i
		],
		category: 'Geopolitics',
		region: 'latam'
	},
	{
		id: 'latam-us',
		name: 'US-LatAm Relations',
		patterns: [
			/estados unidos.{0,15}am[eé]rica latina/i,
			/washington.{0,10}regi[oó]n/i,
			/us.{0,10}latin america/i
		],
		category: 'Geopolitics',
		region: 'latam'
	}
];

export const SOURCE_TYPES: SourceTypes = {
	fringe: [
		'zerohedge',
		'infowars',
		'naturalnews',
		'gateway',
		'breitbart',
		'epoch',
		'revolver',
		'dailycaller'
	],
	alternative: ['substack', 'rumble', 'bitchute', 'telegram', 'gab', 'gettr', 'truth social'],
	mainstream: [
		// Wire services
		'reuters',
		'ap news',
		'afp',
		// Major international
		'bbc',
		'cnn',
		'nytimes',
		'wsj',
		'wapo',
		'guardian',
		'abc',
		'nbc',
		'cbs',
		'fox',
		'al jazeera',
		'economist',
		'npr',
		// Business/Finance
		'bloomberg',
		'cnbc',
		'marketwatch',
		'financial times',
		'ft.com',
		'yahoo finance',
		'investing.com',
		// Politics
		'politico',
		'foreign affairs',
		'foreign policy',
		// Tech
		'hacker news',
		'ars technica',
		'verge',
		'mit tech',
		'openai',
		'arxiv',
		// Intel/Defense
		'defense one',
		'breaking defense',
		'war on the rocks',
		'defense news',
		'war zone',
		'realcleardefense',
		'csis',
		'bellingcat',
		'chatham house',
		'iiss',
		'military.com',
		'cfr',
		'brookings',
		'diplomat',
		'al-monitor',
		// Brazil
		'g1',
		'globo',
		'folha',
		'cnn brasil',
		'gazeta do povo',
		'poder360',
		'agencia brasil',
		'infomoney',
		'valor',
		'defesanet',
		'zona militar',
		// Latin America
		'americas quarterly',
		'el pais',
		'infobae',
		'caracas chronicles',
		'el nacional',
		'venezuelanalysis',
		// Middle East
		'tehran times',
		'radio farda',
		'mehr news',
		'isna',
		'ifp news',
		'iranwire',
		// Arctic
		'arctic today',
		'high north news',
		'arctic institute',
		'arctic council'
	]
};

// Main character patterns for tracking prominent figures
export interface PersonPattern {
	pattern: RegExp;
	name: string;
}

export const PERSON_PATTERNS: PersonPattern[] = [
	{ pattern: /\btrump\b/gi, name: 'Trump' },
	{ pattern: /\bbiden\b/gi, name: 'Biden' },
	{ pattern: /\belon\b|\bmusk\b/gi, name: 'Elon Musk' },
	{ pattern: /\bputin\b/gi, name: 'Putin' },
	{ pattern: /\bzelensky\b/gi, name: 'Zelensky' },
	{ pattern: /\bxi\s*jinping\b|\bxi\b/gi, name: 'Xi Jinping' },
	{ pattern: /\bnetanyahu\b/gi, name: 'Netanyahu' },
	{ pattern: /\bsam\s*altman\b/gi, name: 'Sam Altman' },
	{ pattern: /\bmark\s*zuckerberg\b|\bzuckerberg\b/gi, name: 'Zuckerberg' },
	{ pattern: /\bjeff\s*bezos\b|\bbezos\b/gi, name: 'Bezos' },
	{ pattern: /\btim\s*cook\b/gi, name: 'Tim Cook' },
	{ pattern: /\bsatya\s*nadella\b|\bnadella\b/gi, name: 'Satya Nadella' },
	{ pattern: /\bsundar\s*pichai\b|\bpichai\b/gi, name: 'Sundar Pichai' },
	{ pattern: /\bwarren\s*buffett\b|\bbuffett\b/gi, name: 'Warren Buffett' },
	{ pattern: /\bjanet\s*yellen\b|\byellen\b/gi, name: 'Janet Yellen' },
	{ pattern: /\bjerome\s*powell\b|\bpowell\b/gi, name: 'Jerome Powell' },
	{ pattern: /\bkamala\s*harris\b|\bharris\b/gi, name: 'Kamala Harris' },
	{ pattern: /\bnancy\s*pelosi\b|\bpelosi\b/gi, name: 'Nancy Pelosi' },
	{ pattern: /\bjensen\s*huang\b|\bhuang\b/gi, name: 'Jensen Huang' },
	{ pattern: /\bdario\s*amodei\b|\bamodei\b/gi, name: 'Dario Amodei' }
];
