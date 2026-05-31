import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const pageSource = readFileSync('src/routes/+page.svelte', 'utf8');

describe('custom monitor scan integration', () => {
	it('schedules monitor scans from page-level news and monitor changes', () => {
		expect(pageSource).toContain('const monitorDefinitionScanKey = $derived(');
		expect(pageSource).toContain('const newsMonitorScanKey = $derived(');
		expect(pageSource).toContain('function scheduleMonitorScan(signature: string)');
		expect(pageSource).toContain('monitors.scanForMatches(get(allNewsItems))');
		expect(pageSource).toContain(
			'scheduleMonitorScan(`${monitorDefinitionScanKey}::${newsMonitorScanKey}`)'
		);
	});

	it('cleans up pending monitor scans when the page unmounts', () => {
		expect(pageSource).toContain('function cancelMonitorScan()');
		expect(pageSource).toContain('cancelMonitorScan();');
	});
});
