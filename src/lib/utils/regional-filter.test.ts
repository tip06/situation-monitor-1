import { describe, it, expect } from 'vitest';
import { classifyRegionalItem, isRegionalHighSignal } from './regional-filter';

describe('regional-filter', () => {
	it('accepts brazil governance/economy headlines with geo + policy signals', () => {
		const decision = classifyRegionalItem({
			category: 'brazil',
			title: 'Congresso do Brasil aprova reforma fiscal após votação no Senado',
			description: 'Governo e Banco Central discutem inflação e política econômica'
		});

		expect(decision.accepted).toBe(true);
		expect(decision.reasons).toContain('geo-policy-match');
	});

	it('accepts latam policy headlines with regional anchor', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'Mercosur summit discusses trade and security in Latin America',
			description: 'Argentina, Brazil and Chile negotiate tariff and defense coordination'
		});

		expect(decision.accepted).toBe(true);
		expect(decision.matchedGeoTerms?.length).toBeGreaterThan(0);
		expect(decision.matchedPolicyTerms?.length).toBeGreaterThan(0);
	});

	it('accepts spanish latam governance headlines', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'América Latina: presidentes debaten reforma económica en cumbre regional',
			description: 'El congreso y el banco central analizan inflación y comercio exterior'
		});

		expect(decision.accepted).toBe(true);
		expect(decision.reasons).toContain('geo-policy-match');
	});

	it('rejects sports even when geo terms are present', () => {
		const decision = classifyRegionalItem({
			category: 'brazil',
			title: 'Brazil wins football match in Sao Paulo',
			description: 'Team secures victory in Serie A'
		});

		expect(decision.accepted).toBe(false);
		expect(decision.reasons).toContain('blocklist');
	});

	it('rejects geo-only stories without policy/economy/security context', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'Best travel destinations in Colombia and Peru this summer',
			description: 'Lifestyle tips for travelers across Latin America'
		});

		expect(decision.accepted).toBe(false);
		expect(decision.reasons).toContain('blocklist');
	});

	it('rejects policy-only stories without regional anchor', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'Central bank announces inflation policy update',
			description: 'Officials discuss interest rates and fiscal reform'
		});

		expect(decision.accepted).toBe(false);
		expect(decision.reasons).toContain('missing-geo');
	});

	it('rejects spanish low-signal entertainment content', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'Celebridad famosa causa furor en espectáculo de moda',
			description: 'Notas de farándula y entretenimiento en América Latina'
		});

		expect(decision.accepted).toBe(false);
		expect(decision.reasons).toContain('blocklist');
		expect(decision.matchedBlockTerms?.length).toBeGreaterThan(0);
	});

	it('accepts latinoamerica variant as geo anchor', () => {
		const decision = classifyRegionalItem({
			category: 'latam',
			title: 'Latinoamerica enfrenta nueva ronda de sanciones comerciales',
			description: 'Gobierno y congreso negocian tratado de seguridad energética'
		});

		expect(decision.accepted).toBe(true);
	});

	it('passes through non-regional categories unchanged', () => {
		const decision = classifyRegionalItem({
			category: 'politics',
			title: 'US Congress debates fiscal package',
			description: 'Lawmakers vote this week'
		});

		expect(decision.accepted).toBe(true);
		expect(decision.reasons).toContain('non-regional-category');
	});

	it('exposes a boolean helper for panel/api usage', () => {
		expect(
			isRegionalHighSignal({
				category: 'brazil',
				title: 'Brasil e Mercosul discutem acordo comercial e segurança',
				description: 'Ministros de governo defendem nova política'
			})
		).toBe(true);
	});
});
