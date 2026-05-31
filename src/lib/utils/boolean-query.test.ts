import { describe, expect, it } from 'vitest';
import {
	evaluateBooleanQuery,
	extractBooleanQueryTerms,
	keywordsToBooleanQuery,
	validateBooleanQuery
} from './boolean-query';

describe('boolean monitor queries', () => {
	it('treats commas as OR for legacy keyword input', () => {
		expect(evaluateBooleanQuery('Zelensky visits Kyiv', 'ukraine, zelensky').matches).toBe(true);
		expect(evaluateBooleanQuery('Tech stocks rise', 'ukraine, zelensky').matches).toBe(false);
	});

	it('supports AND, OR, NOT, and parentheses', () => {
		const query = 'ukraine AND (kyiv OR zelensky) NOT sports';

		expect(evaluateBooleanQuery('Ukraine says Zelensky met allies', query).matches).toBe(true);
		expect(evaluateBooleanQuery('Ukraine sports minister visits Kyiv', query).matches).toBe(false);
		expect(evaluateBooleanQuery('Zelensky gives unrelated interview', query).matches).toBe(false);
	});

	it('supports quoted phrases', () => {
		const result = evaluateBooleanQuery(
			'Power grid disruption reported after strike',
			'"power grid" AND disruption'
		);

		expect(result.matches).toBe(true);
		expect(result.matchedTerms).toEqual(['power grid', 'disruption']);
	});

	it('validates invalid expressions', () => {
		expect(validateBooleanQuery('ukraine AND')).toBe('Expected search term in monitor query');
		expect(validateBooleanQuery('(ukraine OR kyiv')).toBe(
			'Missing closing parenthesis in monitor query'
		);
	});

	it('extracts terms for monitor chips and persistence', () => {
		expect(
			extractBooleanQueryTerms('Iran AND ("strait of hormuz" OR tanker) NOT football')
		).toEqual(['iran', 'strait of hormuz', 'tanker', 'football']);
	});

	it('converts legacy keyword arrays to OR queries', () => {
		expect(keywordsToBooleanQuery(['ukraine', 'kyiv', 'power grid'])).toBe(
			'ukraine OR kyiv OR "power grid"'
		);
	});
});
