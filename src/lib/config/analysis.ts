/**
 * Analysis configuration - correlation topics, narrative patterns, source classification
 */

import type { Locale } from '$lib/i18n/types';

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

function translateCompoundIntelText(text: string): string {
	const phraseReplacements: Array<[RegExp, string]> = [
		[
			/appears in multi-source daily coverage for at least two consecutive refresh windows\./gi,
			'aparece em cobertura diária de múltiplas fontes por pelo menos duas janelas consecutivas de atualização.'
		],
		[
			/is accompanied by cross-market stress signals \(energy, freight, credit, or policy risk premium\)\./gi,
			'é acompanhado por sinais de estresse entre mercados (energia, frete, crédito ou prêmio de risco de política).'
		],
		[
			/reinforces (.+?) rather than decoupling from the first two drivers\./gi,
			'reforça $1, em vez de desacoplar dos dois primeiros vetores.'
		],
		[
			/Primary drivers behind (.+?) remain active without a credible de-escalation agreement\./gi,
			'Os vetores primários por trás de $1 permanecem ativos sem um acordo de desescalada crível.'
		],
		[
			/Policy responses stay incremental and do not immediately neutralize (.+?) plus (.+?) pressure\./gi,
			'As respostas de política permanecem incrementais e não neutralizam imediatamente a pressão de $1 mais $2.'
		],
		[
			/Two core drivers of (.+?) fall below activation threshold across consecutive cycles\./gi,
			'Dois vetores centrais de $1 caem abaixo do limiar de ativação em ciclos consecutivos.'
		],
		[
			/A verifiable diplomatic, regulatory, or security breakthrough materially reduces (.+?) and (.+?) stress\./gi,
			'Um avanço verificável diplomático, regulatório ou de segurança reduz materialmente o estresse de $1 e $2.'
		],
		[
			/Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway\./gi,
			'Indicadores específicos do Brasil desacoplam da direção da tendência global, invalidando o atual caminho de transmissão.'
		],
		[
			/Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover\./gi,
			'O impacto para as Forças Armadas brasileiras permanece indireto; continuar monitorando efeitos de transbordamento em logística, ciber e infraestrutura crítica.'
		],
		[
			/Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness\./gi,
			'As instituições militares e civis brasileiras mantêm capacidade de coordenação para monitoramento de transbordamentos e prontidão de resposta.'
		],
		[
			/Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption\./gi,
			'O Brasil absorve efeitos de segunda ordem por canais econômicos e de governança, sem disrupção imediata de segurança em escala nacional.'
		],
		[
			/registers across multiple credible outlets for two or more consecutive refresh cycles, confirming signal activation\./gi,
			'registra-se em múltiplos veículos confiáveis por dois ou mais ciclos consecutivos de atualização, confirmando ativação do sinal.'
		],
		[
			/moves in the same direction, ruling out isolated noise and confirming cross-domain transmission\./gi,
			'move-se na mesma direção, descartando ruído isolado e confirmando transmissão entre domínios.'
		],
		[
			/tracks global driver direction, confirming the transmission pathway is open\./gi,
			'acompanha a direção do vetor global, confirmando que o canal de transmissão está ativo.'
		],
		[
			/remains operative: (.+)/gi,
			'permanece ativo: $1'
		],
		[
			/No rapid policy resolution emerges: (.+)/gi,
			'Nenhuma resolução política rápida se materializa: $1'
		],
		[
			/Brazil's exposure channel is intact: (.+)/gi,
			'O canal de exposição do Brasil está intacto: $1'
		],
		[
			/falls below detection threshold or (.+?) reverses course across three or more consecutive refresh cycles\./gi,
			'cai abaixo do limiar de detecção ou $1 reverte curso em três ou mais ciclos consecutivos de atualização.'
		],
		[
			/achieves (.+?) on (.+)/gi,
			'alcança $1 em $2'
		],
		[
			/breaks correlation with (.+?) across three or more consecutive monitoring cycles\./gi,
			'rompe a correlação com $1 em três ou mais ciclos consecutivos de monitoramento.'
		],
		[
			/Brazil faces (.+?) as (.+?) transmits through (.+)/gi,
			'O Brasil enfrenta $1 à medida que $2 se transmite por $3'
		],
		[
			/Brazilian military should (.+?) as (.+)/gi,
			'As Forças Armadas brasileiras devem $1 à medida que $2'
		],
		[/Brazilian military should/gi, 'As Forças Armadas brasileiras devem'],
		[/Brazil should/gi, 'O Brasil deve'],
		[/Brazil faces/gi, 'O Brasil enfrenta'],
		[/cross-market stress signals/gi, 'sinais de estresse entre mercados'],
		[/de-escalation/gi, 'desescalada'],
		[/activation threshold/gi, 'limiar de ativação'],
		[/consecutive cycles/gi, 'ciclos consecutivos'],
		[/spillover/gi, 'transbordamento']
	];

	let translated = text;
	for (const [pattern, replacement] of phraseReplacements) {
		translated = translated.replace(pattern, replacement);
	}
	return translated;
}

const COMPOUND_PATTERNS_PT_BR: CompoundPattern[] = COMPOUND_PATTERNS.map((pattern) => ({
	...pattern,
	name: COMPOUND_NAME_OVERRIDES_PT_BR[pattern.id] ?? pattern.name,
	keyJudgments: pattern.keyJudgments.map(translateCompoundIntelText),
	indicators: pattern.indicators.map(translateCompoundIntelText),
	confirmationSignals: pattern.confirmationSignals.map(translateCompoundIntelText),
	assumptions: pattern.assumptions.map(translateCompoundIntelText),
	changeTriggers: pattern.changeTriggers.map(translateCompoundIntelText)
}));

export function getCompoundPatterns(locale: Locale): CompoundPattern[] {
	return locale === 'pt-BR' ? COMPOUND_PATTERNS_PT_BR : COMPOUND_PATTERNS;
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
		patterns: [/decouple/i, /chip ban/i, /tech war/i, /decoupling/i, /china.{0,20}restrict/i],
		category: 'Geopolitics',
		region: 'global'
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
		name: 'Election Coverage',
		patterns: [/election/i, /campaign/i, /polling/i, /ballot/i, /candidate/i, /vote.{0,5}count/i],
		category: 'Politics',
		region: 'global'
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
		name: 'Real Currency',
		patterns: [/dolar.{0,10}real/i, /cambio/i, /desvaloriza/i, /real.{0,10}dolar/i],
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
