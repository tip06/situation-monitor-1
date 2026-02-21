import { describe, expect, it } from 'vitest';
import { detectRegion, detectTopics } from './keywords';

describe('keyword detection', () => {
	it('avoids substring false positives for conflict keywords', () => {
		expect(detectTopics('Microsoft announces software update for Windows')).not.toContain(
			'CONFLICT'
		);
		expect(detectTopics('Hardware demand rises in Q4')).not.toContain('CONFLICT');
		expect(detectTopics('Award ceremony celebrates innovation')).not.toContain('CONFLICT');
	});

	it('detects true conflict headlines', () => {
		const topics = detectTopics('Ukraine war escalates with missile strike');
		expect(topics).toContain('CONFLICT');
	});

	it('detects regions and non-conflict topics in normal headlines', () => {
		expect(detectRegion('Russia and EU discuss sanctions')).toBe('EUROPE');
		expect(detectTopics('US election campaign heats up')).toContain('ELECTIONS');
	});
});
