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
});
