import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';

const panelSource = readFileSync('src/lib/components/panels/NewsPanel.svelte', 'utf8');

describe('NewsPanel expansion rendering', () => {
	it('renders expandable panel action with localization keys', () => {
		expect(panelSource).toContain("{#snippet actions()}");
		expect(panelSource).toContain("t($language, 'panel.expand')");
		expect(panelSource).toContain("t($language, 'panel.collapse')");
		expect(panelSource).toContain('class="expand-btn"');
	});

	it('supports centered overlay mode with backdrop and escape close', () => {
		expect(panelSource).toContain('isExpanded');
		expect(panelSource).toContain('class="expand-backdrop"');
		expect(panelSource).toContain("event.key === 'Escape'");
		expect(panelSource).toContain('news-panel-shell.expanded');
	});

	it('uses a direct derived items filter without nested derived indirection', () => {
		expect(panelSource).toContain('const items = $derived.by(() => {');
		expect(panelSource).not.toContain('const filteredItems = $derived(() => {');
		expect(panelSource).not.toContain('const items = $derived(filteredItems())');
	});
});
