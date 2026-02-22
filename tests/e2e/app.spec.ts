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
		await expect(page.locator('text=Regional')).toBeVisible();
		await expect(page.locator('text=Economy')).toBeVisible();

		// Toggle to Portuguese
		await page.getByRole('button', { name: 'EN' }).click();
		await expect(page.locator('text=Economia')).toBeVisible();
		await expect(page.locator('text=Tendências e análise')).toBeVisible();
	});

	test('remains responsive after repeated tab switches', async ({ page }) => {
		await page.goto('/');

		const tabs = page.locator('.tab');
		await expect(tabs).toHaveCount(5);

		for (let iteration = 0; iteration < 6; iteration++) {
			for (let index = 0; index < 5; index++) {
				await tabs.nth(index).click();
				await expect(tabs.nth(index)).toHaveClass(/active/);
				await expect(page.locator('.tab.active')).toHaveCount(1);
			}
		}
	});
});
