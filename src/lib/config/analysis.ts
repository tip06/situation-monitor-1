/**
 * Analysis configuration - correlation topics, narrative patterns, source classification
 */

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
	indicators: string[];
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
		keyJudgments: ['Tariff expansion between major blocs disrupts shipping routes and supplier lead times.', 'Export planning should expect commodity price swings and imported input volatility.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Tariff And Trade Barrier Announcements appears in multi-source daily coverage for at least two consecutive refresh windows.', 'US-China Strategic Friction is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Logistics Disruption And Port Congestion reinforces trade war escalation rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind trade war escalation remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize tariff and trade barrier announcements plus US-China strategic friction pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of trade war escalation fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces tariff and trade barrier announcements and US-China strategic friction stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.5
	},
	{
		id: 'stagflation-risk',
		topics: ['inflation', 'fed-rates', 'layoffs'],
		minTopics: 2,
		name: 'Stagflation Risk',
		keyJudgments: ['Sticky inflation with weaker labor conditions raises probability of low-growth, high-cost conditions.', 'Household pressure can rise through higher financing costs, weaker growth, and lower purchasing power.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Headline And Core Inflation Persistence appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Restrictive Central Bank Rate Guidance is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Broad Labor Market Downsizing reinforces stagflation risk rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind stagflation risk remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize headline and core inflation persistence plus restrictive central bank rate guidance pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of stagflation risk fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces headline and core inflation persistence and restrictive central bank rate guidance stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'geopolitical-crisis',
		topics: ['russia-ukraine', 'israel-gaza', 'china-tensions'],
		minTopics: 2,
		name: 'Multi-Front Geopolitical Crisis',
		keyJudgments: ['Simultaneous conflict theaters increase chance of supply disruptions and market risk-off behavior.', 'Brazil should prepare for volatility in energy, freight, and agricultural export channels.', 'Brazilian military should increase monitoring of maritime and cyber spillover risks.'],
		indicators: ['Russia-Ukraine Battlefield Escalation appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Israel-Gaza Conflict Escalation is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'US-China Strategic Friction reinforces multi-front geopolitical crisis rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind multi-front geopolitical crisis remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize Russia-Ukraine battlefield escalation plus Israel-Gaza conflict escalation pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of multi-front geopolitical crisis fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces Russia-Ukraine battlefield escalation and Israel-Gaza conflict escalation stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2
	},
	{
		id: 'tech-regulatory-storm',
		topics: ['ai-regulation', 'big-tech', 'crypto'],
		minTopics: 2,
		name: 'Tech Regulatory Storm',
		keyJudgments: ['Parallel regulatory moves on AI, platforms, and crypto tighten compliance and licensing conditions.', 'Digital businesses may face compliance cost increases and slower product launch cycles.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['AI Policy And Enforcement Actions appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Antitrust And Platform Litigation is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Crypto Market And Regulation Shocks reinforces tech regulatory storm rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind tech regulatory storm remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize AI policy and enforcement actions plus antitrust and platform litigation pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of tech regulatory storm fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces AI policy and enforcement actions and antitrust and platform litigation stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.4
	},
	{
		id: 'financial-stress',
		topics: ['bank-crisis', 'fed-rates', 'housing'],
		minTopics: 2,
		name: 'Financial Sector Stress',
		keyJudgments: ['Rate pressure and housing weakness elevate probability of banking liquidity strain.', 'Credit conditions may tighten and external funding costs can rise for firms and households.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Bank Solvency And Liquidity Stress appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Restrictive Central Bank Rate Guidance is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Housing Financing Deterioration reinforces financial sector stress rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind financial sector stress remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize bank solvency and liquidity stress plus restrictive central bank rate guidance pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of financial sector stress fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces bank solvency and liquidity stress and restrictive central bank rate guidance stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'nuclear-escalation',
		topics: ['russia-ukraine', 'iran', 'nuclear'],
		minTopics: 2,
		name: 'Nuclear Escalation',
		keyJudgments: ['Escalatory nuclear signaling increases global crisis probability and emergency diplomacy pressure.', 'Brazil should expect renewed volatility in commodities and global transport risk perception.', 'Brazilian military should maintain elevated strategic awareness and contingency coordination.'],
		indicators: ['Russia-Ukraine Battlefield Escalation appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Iran Regional Escalation Posture is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Nuclear Signaling And Doctrine Hardening reinforces nuclear escalation rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind nuclear escalation remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize Russia-Ukraine battlefield escalation plus Iran regional escalation posture pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of nuclear escalation fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces Russia-Ukraine battlefield escalation and Iran regional escalation posture stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2.5
	},
	{
		id: 'middle-east-escalation',
		topics: ['israel-gaza', 'iran'],
		minTopics: 2,
		name: 'Middle East Escalation',
		keyJudgments: ['Regional conflict broadens through proxy activity and maritime chokepoint pressure.', 'Oil-linked inflation and shipping insurance costs can increase for Brazilian importers.', 'Brazilian military should track maritime security implications for logistics and fuel planning.'],
		indicators: ['Israel-Gaza Conflict Escalation appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Iran Regional Escalation Posture is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Brazil-specific risk signals (pricing, logistics, governance, or cyber) track in the same direction as middle east escalation.'],
		assumptions: ['Primary drivers behind middle east escalation remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize Israel-Gaza conflict escalation plus Iran regional escalation posture pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of middle east escalation fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces Israel-Gaza conflict escalation and Iran regional escalation posture stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'energy-supply-shock',
		topics: ['russia-ukraine', 'iran', 'supply-chain'],
		minTopics: 2,
		name: 'Energy Supply Shock',
		keyJudgments: ['Conflict-driven supply interruptions create abrupt upward pressure on fuel benchmarks.', 'Fuel, freight, and electricity cost pressure can pass through to inflation and production.', 'Brazilian military should review fuel stock and logistics resilience assumptions.'],
		indicators: ['Russia-Ukraine Battlefield Escalation appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Iran Regional Escalation Posture is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Logistics Disruption And Port Congestion reinforces energy supply shock rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind energy supply shock remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize Russia-Ukraine battlefield escalation plus Iran regional escalation posture pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of energy supply shock fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces Russia-Ukraine battlefield escalation and Iran regional escalation posture stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'recession-signal',
		topics: ['layoffs', 'housing', 'fed-rates'],
		minTopics: 2,
		name: 'Recession Signal',
		keyJudgments: ['Labor softening, housing stress, and restrictive rates align with downturn conditions.', 'Brazil may face weaker demand, slower investment flows, and greater household stress.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Broad Labor Market Downsizing appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Housing Financing Deterioration is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Restrictive Central Bank Rate Guidance reinforces recession signal rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind recession signal remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize broad labor market downsizing plus housing financing deterioration pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of recession signal fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces broad labor market downsizing and housing financing deterioration stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.9
	},
	{
		id: 'inflation-spiral',
		topics: ['inflation', 'supply-chain', 'climate'],
		minTopics: 2,
		name: 'Inflation Spiral',
		keyJudgments: ['Climate disruption and logistics friction reinforce persistent consumer and producer price pressure.', 'Food and transport inflation can intensify and reduce household purchasing power.', 'Brazilian military should monitor procurement cost pressures on sustained operations.'],
		indicators: ['Headline And Core Inflation Persistence appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Logistics Disruption And Port Congestion is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Climate-Driven Disaster Intensity reinforces inflation spiral rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind inflation spiral remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize headline and core inflation persistence plus logistics disruption and port congestion pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of inflation spiral fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces headline and core inflation persistence and logistics disruption and port congestion stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.6
	},
	{
		id: 'dollar-stress',
		topics: ['fed-rates', 'crypto', 'china-tensions'],
		minTopics: 2,
		name: 'Dollar Stress',
		keyJudgments: ['Dollar funding stress and payment-route uncertainty increase currency volatility risk.', 'FX volatility can pressure import pricing, debt servicing, and corporate hedging costs.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Restrictive Central Bank Rate Guidance appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Crypto Market And Regulation Shocks is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'US-China Strategic Friction reinforces dollar stress rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind dollar stress remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize restrictive central bank rate guidance plus crypto market and regulation shocks pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of dollar stress fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces restrictive central bank rate guidance and crypto market and regulation shocks stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.5
	},
	{
		id: 'ai-disruption-wave',
		topics: ['ai-regulation', 'layoffs', 'big-tech'],
		minTopics: 2,
		name: 'AI Disruption Wave',
		keyJudgments: ['Rapid automation and restructuring in major tech employers accelerate labor displacement trends.', 'Brazilian service and tech labor markets may see faster skill mismatch and wage dispersion.', 'Brazilian military should track AI labor shifts relevant to cyber and technical recruitment.'],
		indicators: ['AI Policy And Enforcement Actions appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Broad Labor Market Downsizing is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Antitrust And Platform Litigation reinforces ai disruption wave rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind ai disruption wave remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize AI policy and enforcement actions plus broad labor market downsizing pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of ai disruption wave fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces AI policy and enforcement actions and broad labor market downsizing stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.6
	},
	{
		id: 'disinfo-storm',
		topics: ['deepfake', 'election', 'ai-regulation'],
		minTopics: 2,
		name: 'Disinfo Storm',
		keyJudgments: ['Election narratives face higher manipulation volume through synthetic media and coordinated amplification.', 'Public trust and institutional communication can degrade during sensitive political periods.', 'Brazilian military should strengthen verification and information integrity monitoring.'],
		indicators: ['Synthetic Media Abuse Incidents appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Electoral Legitimacy And Security Stress is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'AI Policy And Enforcement Actions reinforces disinfo storm rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind disinfo storm remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize synthetic media abuse incidents plus electoral legitimacy and security stress pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of disinfo storm fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces synthetic media abuse incidents and electoral legitimacy and security stress stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'pandemic-redux',
		topics: ['pandemic', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Pandemic Redux',
		keyJudgments: ['Health-system stress combines with logistics disruption, reviving inflationary supply shocks.', 'Health and transport bottlenecks can raise costs and strain local service capacity.', 'Brazilian military should prepare to support logistics and emergency response if requested.'],
		indicators: ['High-Concern Outbreak Progression appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Logistics Disruption And Port Congestion is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Headline And Core Inflation Persistence reinforces pandemic redux rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind pandemic redux remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize high-concern outbreak progression plus logistics disruption and port congestion pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of pandemic redux fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces high-concern outbreak progression and logistics disruption and port congestion stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2
	},
	{
		id: 'climate-shock',
		topics: ['climate', 'supply-chain', 'inflation'],
		minTopics: 2,
		name: 'Climate Shock',
		keyJudgments: ['Severe weather events damage infrastructure and interrupt freight corridors.', 'Agriculture, roads, and port operations may experience recurrent disruption and cost escalation.', 'Brazilian military should monitor potential demand for disaster logistics support.'],
		indicators: ['Climate-Driven Disaster Intensity appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Logistics Disruption And Port Congestion is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Headline And Core Inflation Persistence reinforces climate shock rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind climate shock remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize climate-driven disaster intensity plus logistics disruption and port congestion pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of climate shock fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces climate-driven disaster intensity and logistics disruption and port congestion stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.6
	},
	{
		id: 'social-pressure',
		topics: ['inflation', 'layoffs', 'immigration', 'election'],
		minTopics: 3,
		name: 'Social Pressure',
		keyJudgments: ['Economic strain and political polarization increase probability of localized unrest events.', 'Urban service continuity and political volatility risk can rise in high-pressure regions.', 'Brazilian military should maintain situational awareness for civil support contingencies.'],
		indicators: ['Headline And Core Inflation Persistence appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Broad Labor Market Downsizing is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Immigration reinforces social pressure rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind social pressure remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize headline and core inflation persistence plus broad labor market downsizing pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of social pressure fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces headline and core inflation persistence and broad labor market downsizing stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'cyber-warfare-escalation',
		topics: ['state-hacking', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Cyber Warfare Escalation',
		keyJudgments: ['State-linked cyber campaigns expand targeting of critical public and private infrastructure.', 'Critical sectors can face higher operational disruption and incident response costs.', 'Brazilian military should increase cyber readiness and interagency threat-sharing cadence.'],
		indicators: ['State-Aligned Cyber Intrusion Tempo appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Russia-Ukraine Battlefield Escalation is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'US-China Strategic Friction reinforces cyber warfare escalation rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind cyber warfare escalation remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize state-aligned cyber intrusion tempo plus Russia-Ukraine battlefield escalation pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of cyber warfare escalation fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces state-aligned cyber intrusion tempo and Russia-Ukraine battlefield escalation stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2
	},
	{
		id: 'critical-infra-attack',
		topics: ['cyberattack', 'energy-transition', 'supply-chain'],
		minTopics: 2,
		name: 'Critical Infrastructure Attack',
		keyJudgments: ['Cyber and supply-chain pressure raises risk of interruptions in power and logistics systems.', 'Grid and transport disruptions can affect industrial output and public services.', 'Brazilian military should monitor critical infrastructure resilience and fallback operations.'],
		indicators: ['Critical Cyber Incident Frequency appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Energy-Transition Bottlenecks is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Logistics Disruption And Port Congestion reinforces critical infrastructure attack rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind critical infrastructure attack remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize critical cyber incident frequency plus energy-transition bottlenecks pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of critical infrastructure attack fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces critical cyber incident frequency and energy-transition bottlenecks stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2.2
	},
	{
		id: 'cyber-financial-attack',
		topics: ['cyberattack', 'bank-crisis', 'credit-stress'],
		minTopics: 2,
		name: 'Cyber-Financial Attack',
		keyJudgments: ['Financial institutions face concurrent cyber intrusion and liquidity stress conditions.', 'Payment reliability and confidence in digital banking rails may come under pressure.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Critical Cyber Incident Frequency appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Bank Solvency And Liquidity Stress is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Credit Spread Widening And Defaults reinforces cyber-financial attack rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind cyber-financial attack remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize critical cyber incident frequency plus bank solvency and liquidity stress pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of cyber-financial attack fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces critical cyber incident frequency and bank solvency and liquidity stress stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2
	},
	{
		id: 'energy-weaponization',
		topics: ['oil-opec', 'sanctions', 'russia-ukraine'],
		minTopics: 2,
		name: 'Energy Weaponization',
		keyJudgments: ['Energy exports are used as bargaining leverage, increasing abrupt supply repricing risk.', 'Fuel and transport costs can surge, pressuring inflation and fiscal management.', 'Brazilian military should review fuel availability assumptions for sustained deployments.'],
		indicators: ['Oil Production Constraint Signals appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Sanctions Expansion And Enforcement is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Russia-Ukraine Battlefield Escalation reinforces energy weaponization rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind energy weaponization remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize oil production constraint signals plus sanctions expansion and enforcement pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of energy weaponization fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces oil production constraint signals and sanctions expansion and enforcement stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'resource-war',
		topics: ['rare-earths', 'china-tensions', 'sanctions'],
		minTopics: 2,
		name: 'Resource War',
		keyJudgments: ['Critical mineral access tightens through sanctions, export controls, and bloc competition.', 'Industrial and energy-transition projects may face input shortages and higher procurement costs.', 'Brazilian military should monitor procurement exposure for high-tech components.'],
		indicators: ['Critical Mineral Export Restriction Risk appears in multi-source daily coverage for at least two consecutive refresh windows.', 'US-China Strategic Friction is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Sanctions Expansion And Enforcement reinforces resource war rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind resource war remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize critical mineral export restriction risk plus US-China strategic friction pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of resource war fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces critical mineral export restriction risk and US-China strategic friction stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'green-transition-shock',
		topics: ['energy-transition', 'rare-earths', 'china-tensions'],
		minTopics: 2,
		name: 'Green Transition Shock',
		keyJudgments: ['Energy-transition deployment slows as critical inputs and manufacturing capacity tighten.', 'Renewable projects can face schedule delays and higher capex requirements.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Energy-Transition Bottlenecks appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Critical Mineral Export Restriction Risk is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'US-China Strategic Friction reinforces green transition shock rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind green transition shock remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize energy-transition bottlenecks plus critical mineral export restriction risk pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of green transition shock fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces energy-transition bottlenecks and critical mineral export restriction risk stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.5
	},
	{
		id: 'food-crisis-spiral',
		topics: ['food-security', 'extreme-weather', 'supply-chain'],
		minTopics: 2,
		name: 'Food Crisis Spiral',
		keyJudgments: ['Weather shocks and logistics constraints reduce food availability and increase price pressure.', 'Food inflation and regional supply instability can intensify social vulnerability.', 'Brazilian military should monitor potential support demand for emergency distribution.'],
		indicators: ['Food Availability And Affordability Strain appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Extreme Weather Disruption Footprint is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Logistics Disruption And Port Congestion reinforces food crisis spiral rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind food crisis spiral remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize food availability and affordability strain plus extreme weather disruption footprint pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of food crisis spiral fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces food availability and affordability strain and extreme weather disruption footprint stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'climate-migration',
		topics: ['extreme-weather', 'refugee-crisis', 'civil-unrest'],
		minTopics: 2,
		name: 'Climate Migration Pressure',
		keyJudgments: ['Climate-linked displacement increases pressure on border areas and urban service capacity.', 'Municipal infrastructure and social services can face concentrated demand shocks.', 'Brazilian military should track border and humanitarian support contingency needs.'],
		indicators: ['Extreme Weather Disruption Footprint appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Cross-Border Displacement Flows is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Street Mobilization And Protest Intensity reinforces climate migration pressure rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind climate migration pressure remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize extreme weather disruption footprint plus cross-border displacement flows pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of climate migration pressure fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces extreme weather disruption footprint and cross-border displacement flows stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'agricultural-collapse',
		topics: ['agriculture', 'extreme-weather', 'inflation'],
		minTopics: 2,
		name: 'Agricultural Collapse Signal',
		keyJudgments: ['Crop stress and climate volatility increase food-price pass-through across supply chains.', 'Agribusiness margins and domestic food affordability can deteriorate simultaneously.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Crop And Fertilizer Stress appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Extreme Weather Disruption Footprint is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Headline And Core Inflation Persistence reinforces agricultural collapse signal rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind agricultural collapse signal remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize crop and fertilizer stress plus extreme weather disruption footprint pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of agricultural collapse signal fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces crop and fertilizer stress and extreme weather disruption footprint stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.6
	},
	{
		id: 'sovereign-debt-crisis',
		topics: ['sovereign-debt', 'fed-rates', 'credit-stress'],
		minTopics: 2,
		name: 'Sovereign Debt Crisis',
		keyJudgments: ['Higher refinancing costs and credit risk repricing increase sovereign funding stress.', 'Fiscal tradeoffs may tighten and borrowing costs can rise across the public sector.', 'Brazilian military should monitor budgetary pressure on capability and readiness programs.'],
		indicators: ['Sovereign Refinancing Stress appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Restrictive Central Bank Rate Guidance is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Credit Spread Widening And Defaults reinforces sovereign debt crisis rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind sovereign debt crisis remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize sovereign refinancing stress plus restrictive central bank rate guidance pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of sovereign debt crisis fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces sovereign refinancing stress and restrictive central bank rate guidance stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2
	},
	{
		id: 'credit-contagion',
		topics: ['credit-stress', 'bank-crisis', 'housing'],
		minTopics: 2,
		name: 'Credit Contagion',
		keyJudgments: ['Credit deterioration spreads from financial institutions into housing and corporate borrowers.', 'Consumer and business financing can contract, weakening growth and employment conditions.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Credit Spread Widening And Defaults appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Bank Solvency And Liquidity Stress is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Housing Financing Deterioration reinforces credit contagion rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind credit contagion remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize credit spread widening and defaults plus bank solvency and liquidity stress pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of credit contagion fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces credit spread widening and defaults and bank solvency and liquidity stress stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.9
	},
	{
		id: 'dedollarization-signal',
		topics: ['trade-blocs', 'sanctions', 'crypto'],
		minTopics: 2,
		name: 'Dedollarization Signal',
		keyJudgments: ['Trade blocs accelerate settlement alternatives outside dollar-dominant rails.', 'Trade invoicing practices may diversify, affecting FX management and payment operations.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Bloc-Level Settlement Realignment appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Sanctions Expansion And Enforcement is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Crypto Market And Regulation Shocks reinforces dedollarization signal rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind dedollarization signal remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize bloc-level settlement realignment plus sanctions expansion and enforcement pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of dedollarization signal fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces bloc-level settlement realignment and sanctions expansion and enforcement stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.6
	},
	{
		id: 'social-tinderbox',
		topics: ['civil-unrest', 'inflation', 'layoffs'],
		minTopics: 2,
		name: 'Social Tinderbox',
		keyJudgments: ['Income stress and unemployment concentration raise risk of frequent protest episodes.', 'Public-order management pressure can increase in urban and transport hubs.', 'Brazilian military should maintain readiness for support requests under legal mandate.'],
		indicators: ['Street Mobilization And Protest Intensity appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Headline And Core Inflation Persistence is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Broad Labor Market Downsizing reinforces social tinderbox rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind social tinderbox remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize street mobilization and protest intensity plus headline and core inflation persistence pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of social tinderbox fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces street mobilization and protest intensity and headline and core inflation persistence stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.9
	},
	{
		id: 'democratic-stress',
		topics: ['election', 'political-violence', 'civil-unrest'],
		minTopics: 2,
		name: 'Democratic Stress',
		keyJudgments: ['Election disputes and violence indicators increase institutional trust and governance stress.', 'Institutional communication and public confidence can become more fragile during contested events.', 'Brazilian military should reinforce situational awareness and constitutional role clarity.'],
		indicators: ['Electoral Legitimacy And Security Stress appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Political Violence Escalation is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Street Mobilization And Protest Intensity reinforces democratic stress rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind democratic stress remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize electoral legitimacy and security stress plus political violence escalation pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of democratic stress fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces electoral legitimacy and security stress and political violence escalation stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.8
	},
	{
		id: 'global-protest-wave',
		topics: ['civil-unrest', 'food-security', 'inflation'],
		minTopics: 2,
		name: 'Global Protest Wave',
		keyJudgments: ['Cost-of-living shocks synchronize protest dynamics across multiple regions.', 'Risk of contagion in protest narratives can increase pressure on local governance and transport.', 'Brazilian military impact remains indirect; continue monitoring logistics, cyber, and critical infrastructure spillover.'],
		indicators: ['Street Mobilization And Protest Intensity appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Food Availability And Affordability Strain is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Headline And Core Inflation Persistence reinforces global protest wave rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind global protest wave remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize street mobilization and protest intensity plus food availability and affordability strain pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of global protest wave fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces street mobilization and protest intensity and food availability and affordability strain stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'arms-race-acceleration',
		topics: ['arms-race', 'nato-defense', 'russia-ukraine'],
		minTopics: 2,
		name: 'Arms Race Acceleration',
		keyJudgments: ['Defense procurement acceleration among major powers shifts supply and technology priorities.', 'Global defense demand can affect acquisition lead times and pricing for strategic equipment.', 'Brazilian military should reassess procurement timelines and supplier concentration risks.'],
		indicators: ['Accelerated Defense Procurement Cycles appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Alliance Posture And Force Commitments is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Russia-Ukraine Battlefield Escalation reinforces arms race acceleration rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind arms race acceleration remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize accelerated defense procurement cycles plus alliance posture and force commitments pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of arms race acceleration fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces accelerated defense procurement cycles and alliance posture and force commitments stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 1.7
	},
	{
		id: 'multi-domain-conflict',
		topics: ['cyberattack', 'space-military', 'arms-race'],
		minTopics: 2,
		name: 'Multi-Domain Conflict',
		keyJudgments: ['Conflict pressure expands across cyber, space, and conventional domains at the same time.', 'National critical services may face higher exposure to hybrid tactics and disruption attempts.', 'Brazilian military should integrate cross-domain alerting and response coordination drills.'],
		indicators: ['Critical Cyber Incident Frequency appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Counter-Space Capability Signaling is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Accelerated Defense Procurement Cycles reinforces multi-domain conflict rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind multi-domain conflict remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize critical cyber incident frequency plus counter-space capability signaling pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of multi-domain conflict fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces critical cyber incident frequency and counter-space capability signaling stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2.3
	},
	{
		id: 'escalation-ladder',
		topics: ['nuclear', 'arms-race', 'russia-ukraine', 'china-tensions'],
		minTopics: 2,
		name: 'Escalation Ladder',
		keyJudgments: ['Sequential escalatory steps across theaters increase probability of wider strategic confrontation.', 'External volatility can raise insurance, freight, and commodity risk premiums.', 'Brazilian military should monitor strategic escalation indicators and readiness implications.'],
		indicators: ['Nuclear Signaling And Doctrine Hardening appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Accelerated Defense Procurement Cycles is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Russia-Ukraine Battlefield Escalation reinforces escalation ladder rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind escalation ladder remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize nuclear signaling and doctrine hardening plus accelerated defense procurement cycles pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of escalation ladder fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces nuclear signaling and doctrine hardening and accelerated defense procurement cycles stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2.5
	},
	{
		id: 'systemic-fragility',
		topics: ['sovereign-debt', 'supply-chain', 'cyberattack', 'extreme-weather'],
		minTopics: 3,
		name: 'Systemic Fragility',
		keyJudgments: ['Concurrent shocks across finance, logistics, cyber, and climate increase cascading disruption risk.', 'Cross-sector stress can reduce resilience in transport, food, energy, and public services.', 'Brazilian military should monitor multi-sector contingency demands and interoperability readiness.'],
		indicators: ['Sovereign Refinancing Stress appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Logistics Disruption And Port Congestion is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Critical Cyber Incident Frequency reinforces systemic fragility rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind systemic fragility remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize sovereign refinancing stress plus logistics disruption and port congestion pressure.', 'Brazilian military and civilian institutions retain coordination bandwidth for spillover monitoring and response readiness.'],
		changeTriggers: ['Two core drivers of systemic fragility fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces sovereign refinancing stress and logistics disruption and port congestion stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 2.5
	},
	{
		id: 'polycrisis',
		topics: ['civil-unrest', 'food-security', 'inflation', 'extreme-weather', 'refugee-crisis'],
		minTopics: 3,
		name: 'Polycrisis',
		keyJudgments: ['Interacting social, food, climate, and economic shocks amplify one another across regions.', 'Compound stress can raise humanitarian, inflation, and governance management burdens simultaneously.', 'Brazilian military should prepare for multi-agency support demands under concurrent crises.'],
		indicators: ['Street Mobilization And Protest Intensity appears in multi-source daily coverage for at least two consecutive refresh windows.', 'Food Availability And Affordability Strain is accompanied by cross-market stress signals (energy, freight, credit, or policy risk premium).', 'Headline And Core Inflation Persistence reinforces polycrisis rather than decoupling from the first two drivers.'],
		assumptions: ['Primary drivers behind polycrisis remain active without a credible de-escalation agreement.', 'Policy responses stay incremental and do not immediately neutralize street mobilization and protest intensity plus food availability and affordability strain pressure.', 'Brazil absorbs second-order effects through economic and governance channels without immediate nationwide security disruption.'],
		changeTriggers: ['Two core drivers of polycrisis fall below activation threshold across consecutive cycles.', 'A verifiable diplomatic, regulatory, or security breakthrough materially reduces street mobilization and protest intensity and food availability and affordability strain stress.', 'Brazil-specific indicators decouple from global trend direction, invalidating the current transmission pathway.'],
		boostFactor: 3
	}
];

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
