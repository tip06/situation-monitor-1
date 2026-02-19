import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const panelSource = readFileSync('src/lib/components/panels/CorrelationPanel.svelte', 'utf8');

describe('CorrelationPanel compound signal rendering', () => {
	it('renders top 5 compound signals', () => {
		expect(panelSource).toContain('analysis.compoundSignals.slice(0, 5)');
	});

	it('renders structured intelligence sections', () => {
		expect(panelSource).toContain('Key Judgments');
		expect(panelSource).toContain('Indicators');
		expect(panelSource).toContain('Assumptions');
		expect(panelSource).toContain('Change Triggers');
		expect(panelSource).toContain('Show intelligence');
		expect(panelSource).toContain('View headlines');
		expect(panelSource).toContain('signal.keyJudgments');
		expect(panelSource).toContain('signal.indicators');
		expect(panelSource).toContain('signal.assumptions');
		expect(panelSource).toContain('signal.changeTriggers');
		expect(panelSource).toContain('indicator-chip');
	});
});
