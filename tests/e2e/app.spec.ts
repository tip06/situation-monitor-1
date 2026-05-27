import { test, expect } from '@playwright/test';

test.describe('Situation Monitor - SvelteKit App', () => {
	test('defaults to English and can toggle to Portuguese', async ({ page }) => {
		await page.goto('/');

		// Check page title
		await expect(page).toHaveTitle('Situation Monitor');

		// Check header is visible
		await expect(page.locator('h1')).toHaveText('SITUATION MONITOR');

		// Default English UI
		await expect(page.locator('text=Global')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Map' })).toBeVisible();
		await expect(page.locator('text=Regional')).toBeVisible();
		await expect(page.locator('text=Economy')).toBeVisible();

		// Toggle to Portuguese
		await page.getByRole('button', { name: 'Settings' }).click();
		await page.getByRole('button', { name: 'Portuguese' }).click();
		await expect(page.locator('text=Economia')).toBeVisible();
		await expect(page.locator('text=Tendências e análise')).toBeVisible();
	});

	test('loads the map on its own route', async ({ page }) => {
		await page.goto('/');

		await expect(page.locator('.map-container')).toHaveCount(0);

		await page.getByRole('link', { name: 'Map' }).click();
		await expect(page).toHaveURL('/map');
		await expect(page.locator('.map-container')).toBeVisible();

		await page.getByRole('button', { name: 'Economy' }).click();
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('button', { name: 'Economy' })).toHaveClass(/active/);
	});

	test('can switch navigation to the desktop sidebar preference', async ({ page }) => {
		await page.setViewportSize({ width: 1280, height: 800 });
		await page.goto('/');

		await page.getByRole('button', { name: 'Settings' }).click();
		await page.getByRole('button', { name: 'Left sidebar' }).click();
		await page.getByRole('button', { name: 'Close' }).click();

		await expect(page.locator('.content-shell.sidebar')).toBeVisible();
		await expect(page.locator('.tab-bar.vertical')).toBeVisible();

		await page.reload();
		await expect(page.locator('.content-shell.sidebar')).toBeVisible();
		await expect(page.locator('.tab-bar.vertical')).toBeVisible();
	});

	test('remains responsive after repeated tab switches', async ({ page }) => {
		await page.goto('/');

		const tabs = page.locator('button.tab');
		await expect(tabs).toHaveCount(6);

		for (let iteration = 0; iteration < 6; iteration++) {
			for (let index = 0; index < 6; index++) {
				await tabs.nth(index).click();
				await expect(tabs.nth(index)).toHaveClass(/active/);
				await expect(page.locator('button.tab.active')).toHaveCount(1);
			}
		}
	});
});
