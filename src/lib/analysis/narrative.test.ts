/**
 * Tests for narrative tracker
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
	analyzeNarratives,
	getNarrativeSummary,
	clearNarrativeHistory,
	type NarrativeResults
} from './narrative';
import type { NewsItem } from '$lib/types';

// Helper to create mock news items
function createNewsItem(overrides: Partial<NewsItem> = {}): NewsItem {
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

describe('Narrative Tracker', () => {
	beforeEach(() => {
		clearNarrativeHistory();
	});

	describe('basic functionality', () => {
		it('should return null for empty news', () => {
			expect(analyzeNarratives([])).toBeNull();
			expect(analyzeNarratives(null as unknown as NewsItem[])).toBeNull();
		});

		it('should detect narrative patterns', () => {
			const news: NewsItem[] = [
				createNewsItem({
					id: '1',
					title: 'Deep state allegations surface',
					source: 'Test'
				}),
				createNewsItem({
					id: '2',
					title: 'Shadow government concerns',
					source: 'Test2'
				})
			];

			const results = analyzeNarratives(news);

			expect(results).not.toBeNull();
			const deepState =
				results!.emergingFringe.find((n) => n.id === 'deep-state') ||
				results!.narrativeWatch.find((n) => n.id === 'deep-state');

			expect(deepState).toBeDefined();
			expect(deepState!.count).toBe(2);
		});

		it('should classify disinfo patterns', () => {
			const news: NewsItem[] = [
				createNewsItem({
					id: '1',
					title: 'Depopulation agenda exposed',
					source: 'Fringe'
				})
			];

			const results = analyzeNarratives(news);

			expect(results!.disinfoSignals.length).toBeGreaterThan(0);
			expect(results!.disinfoSignals.find((n) => n.id === 'depopulation')).toBeDefined();
		});
	});

	describe('mainstream narrative patterns', () => {
		it('should detect Fed pivot narratives in titles', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'Fed signals rate cut coming next month', source: 'Bloomberg' }),
				createNewsItem({
					title: 'Markets rally on hopes of rate cut in September',
					source: 'Reuters'
				}),
				createNewsItem({ title: 'Powell hints at dovish stance', source: 'CNBC' })
			];

			const results = analyzeNarratives(news);
			expect(results).not.toBeNull();
			expect(results!.trendingNarratives.length).toBeGreaterThan(0);

			const ratePivot = results!.trendingNarratives.find((n) => n.id === 'rate-pivot');
			expect(ratePivot).toBeDefined();
			expect(ratePivot!.count).toBeGreaterThanOrEqual(2);
		});

		it('should detect patterns in description field', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Economic outlook',
					description: 'Soft landing appears more likely as inflation cools',
					source: 'WSJ'
				}),
				createNewsItem({
					title: 'Fed Watch',
					description: 'The goldilocks scenario materializes',
					source: 'Bloomberg'
				})
			];

			const results = analyzeNarratives(news);
			expect(results).not.toBeNull();

			const softLanding = results!.trendingNarratives.find((n) => n.id === 'soft-landing');
			expect(softLanding).toBeDefined();
			expect(softLanding!.count).toBe(2);
		});

		it('should detect AI hype narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'AI revolution transforms healthcare', source: 'MIT Tech' }),
				createNewsItem({ title: 'Generative AI boom continues', source: 'Ars Technica' }),
				createNewsItem({ title: 'ChatGPT reaches new milestone', source: 'The Verge' })
			];

			const results = analyzeNarratives(news);
			const aiHype = results!.trendingNarratives.find((n) => n.id === 'ai-hype');
			expect(aiHype).toBeDefined();
			expect(aiHype!.category).toBe('Tech');
		});

		it('should require minimum mentions for trending narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'One mention of soft landing', source: 'Reuters' })
			];

			const results = analyzeNarratives(news);
			expect(results).not.toBeNull();

			const softLanding = results!.trendingNarratives.find((n) => n.id === 'soft-landing');
			expect(softLanding).toBeUndefined();
		});
	});

	describe('Brazil-specific narratives', () => {
		it('should detect Lula government narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Lula anuncia novo programa social',
					source: 'G1',
					category: 'brazil'
				}),
				createNewsItem({
					title: 'Planalto prepara medidas econômicas',
					source: 'Folha',
					category: 'brazil'
				})
			];

			const results = analyzeNarratives(news);
			const lulaGov = results!.trendingNarratives.find((n) => n.id === 'lula-government');
			expect(lulaGov).toBeDefined();
			expect(lulaGov!.region).toBe('brazil');
		});

		it('should detect Bolsonaro factor narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Bolsonaro é alvo de nova investigação',
					source: 'G1',
					category: 'brazil'
				}),
				createNewsItem({
					title: 'Manifestações de 8 de janeiro completam um ano',
					source: 'Globo',
					category: 'brazil'
				})
			];

			const results = analyzeNarratives(news);
			const bolsonaro = results!.trendingNarratives.find((n) => n.id === 'bolsonaro-factor');
			expect(bolsonaro).toBeDefined();
		});

		it('should detect Selic/economic narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Copom mantém Selic em 10,5%',
					source: 'InfoMoney',
					category: 'brazil'
				}),
				createNewsItem({
					title: 'Banco Central sinaliza cautela',
					source: 'Valor',
					category: 'brazil'
				})
			];

			const results = analyzeNarratives(news);
			const selic = results!.trendingNarratives.find((n) => n.id === 'selic-rates');
			expect(selic).toBeDefined();
			expect(selic!.category).toBe('Economy');
		});
	});

	describe('Latin America narratives', () => {
		it('should detect Milei Argentina narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Milei announces radical reforms',
					source: 'Reuters',
					category: 'latam'
				}),
				createNewsItem({
					title: 'Argentina economy shows signs of stabilization',
					source: 'Bloomberg',
					category: 'latam'
				})
			];

			const results = analyzeNarratives(news);
			const milei = results!.trendingNarratives.find((n) => n.id === 'argentina-milei');
			expect(milei).toBeDefined();
			expect(milei!.region).toBe('latam');
		});

		it('should detect Venezuela crisis narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Venezuela crisis deepens as Maduro cracks down',
					source: 'Al Jazeera',
					category: 'latam'
				}),
				createNewsItem({
					title: 'Maduro rejects election results',
					source: 'BBC',
					category: 'latam'
				})
			];

			const results = analyzeNarratives(news);
			const venezuela = results!.trendingNarratives.find((n) => n.id === 'venezuela-crisis');
			expect(venezuela).toBeDefined();
		});
	});

	describe('sentiment calculation', () => {
		it('should detect positive sentiment', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'AI revolution drives market surge', source: 'CNBC' }),
				createNewsItem({ title: 'AI breakthrough boosts tech gains', source: 'Bloomberg' }),
				createNewsItem({ title: 'Generative AI success stories multiply', source: 'MIT Tech' })
			];

			const results = analyzeNarratives(news);
			const aiHype = results!.trendingNarratives.find((n) => n.id === 'ai-hype');
			expect(aiHype?.sentiment).toBe('positive');
		});

		it('should detect negative sentiment', () => {
			const news: NewsItem[] = [
				createNewsItem({
					title: 'Recession fears grow as data weakens',
					source: 'Reuters'
				}),
				createNewsItem({
					title: 'Recession risk looms over economy',
					source: 'Bloomberg'
				})
			];

			const results = analyzeNarratives(news);
			const recession = results!.trendingNarratives.find((n) => n.id === 'recession-fears');
			expect(recession?.sentiment).toBe('negative');
		});
	});

	describe('fringe-to-mainstream crossover', () => {
		it('should detect crossover from fringe to mainstream', () => {
			const news: NewsItem[] = [
				createNewsItem({
					id: '1',
					title: 'Lab leak theory gains traction',
					source: 'ZeroHedge'
				}),
				createNewsItem({
					id: '2',
					title: 'Lab leak investigation continues',
					source: 'BBC News'
				}),
				createNewsItem({
					id: '3',
					title: 'Bioweapon research concerns',
					source: 'CNN'
				})
			];

			const results = analyzeNarratives(news);

			// Should detect the bio-weapon narrative crossing from fringe to mainstream
			expect(results!.fringeToMainstream.length).toBeGreaterThan(0);
		});

		it('should classify source types correctly', () => {
			const news: NewsItem[] = [
				createNewsItem({
					id: '1',
					title: 'Dollar collapse imminent',
					source: 'ZeroHedge'
				}),
				createNewsItem({
					id: '2',
					title: 'Dedollarization fears',
					source: 'Infowars'
				})
			];

			const results = analyzeNarratives(news);

			const dollarNarrative = results!.emergingFringe.find((n) => n.id === 'dollar-collapse');

			expect(dollarNarrative).toBeDefined();
			expect(dollarNarrative!.fringeCount).toBeGreaterThan(0);
		});
	});

	describe('momentum calculation', () => {
		it('should start with stable momentum', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'Election results update', source: 'Reuters' }),
				createNewsItem({ title: 'Campaign trail coverage', source: 'BBC' })
			];

			const results = analyzeNarratives(news);
			const election = results!.trendingNarratives.find((n) => n.id === 'election-coverage');
			expect(election?.momentum).toBe('stable');
		});
	});

	describe('getNarrativeSummary', () => {
		it('should return NO DATA status for null results', () => {
			expect(getNarrativeSummary(null)).toEqual({ total: 0, status: 'NO DATA' });
		});

		it('should return MONITORING status when no narratives', () => {
			const results: NarrativeResults = {
				trendingNarratives: [],
				emergingFringe: [],
				fringeToMainstream: [],
				narrativeWatch: [],
				disinfoSignals: []
			};

			const summary = getNarrativeSummary(results);
			expect(summary.total).toBe(0);
			expect(summary.status).toBe('MONITORING');
		});

		it('should count all narrative types in total', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'Fed rate cut expected', source: 'Reuters' }),
				createNewsItem({ title: 'Rate cut coming soon', source: 'Bloomberg' }),
				createNewsItem({ title: 'Deep state conspiracy', source: 'ZeroHedge' }),
				createNewsItem({ title: 'Deep state exposed', source: 'Infowars' })
			];

			const results = analyzeNarratives(news);
			const summary = getNarrativeSummary(results);

			expect(summary.total).toBeGreaterThan(0);
			expect(summary.status).toMatch(/ACTIVE/);
		});
	});

	describe('keywords and headlines', () => {
		it('should track keywords and headlines for fringe narratives', () => {
			const news: NewsItem[] = [
				createNewsItem({
					id: '1',
					title: 'AI doom predictions increase',
					source: 'Tech'
				}),
				createNewsItem({
					id: '2',
					title: 'AI extinction risk debated',
					source: 'Tech2'
				})
			];

			const results = analyzeNarratives(news);

			const aiDoom =
				results!.emergingFringe.find((n) => n.id === 'ai-doom') ||
				results!.narrativeWatch.find((n) => n.id === 'ai-doom');

			expect(aiDoom).toBeDefined();
			expect(aiDoom!.keywords).toContain('ai doom');
			expect(aiDoom!.headlines.length).toBeGreaterThan(0);
		});

		it('should limit sources to 5', () => {
			const news: NewsItem[] = Array.from({ length: 10 }, (_, i) =>
				createNewsItem({
					id: String(i),
					title: 'Deep state news',
					source: `Source${i}`
				})
			);

			const results = analyzeNarratives(news);

			const deepState =
				results!.emergingFringe.find((n) => n.id === 'deep-state') ||
				results!.narrativeWatch.find((n) => n.id === 'deep-state');

			expect(deepState!.sources.length).toBeLessThanOrEqual(5);
		});
	});

	describe('clearNarrativeHistory', () => {
		it('should clear narrative history', () => {
			const news: NewsItem[] = [
				createNewsItem({ title: 'Election news update', source: 'Reuters' }),
				createNewsItem({ title: 'Campaign coverage', source: 'BBC' })
			];

			// Run analysis to populate history
			analyzeNarratives(news);

			// Clear and run again
			clearNarrativeHistory();
			const results = analyzeNarratives(news);

			// Should still work after clearing
			expect(results).not.toBeNull();
		});
	});

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
});
