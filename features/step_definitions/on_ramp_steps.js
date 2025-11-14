import { Then } from '@cucumber/cucumber';
import { expect } from 'expect-playwright';

// This step assumes that `page` is globally available from a hook,
// similar to our other Playwright-based step definition files.

Then('the On-Ramp widget should be visible', async function () {
  // The Ramp widget is triggered by a button click.
  // For this test, we'll just verify that the button that launches the widget is visible.
  const onRampButton = page.locator('button:has-text("Comprar USDC com Pix")');
  await expect(onRampButton).toBeVisible();
});
