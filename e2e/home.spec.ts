import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test('should have the correct title and content', async ({ page }) => {
    // Navigate to the home page
    await page.goto('http://localhost:8000');

    // Wait for the page to load
    await page.waitForSelector('.ant-card-head-title');

    // Check if the page has the correct title
    const title = await page.title();
    expect(title).toContain('翻唱编曲大师');

    // Check if the main content is displayed
    const mainCardTitle = await page.textContent('.ant-card-head-title');
    expect(mainCardTitle).toBe('翻唱设置');

    // Check if the generate button is present
    const generateButton = await page.$('button:has-text("生成提示词")');
    expect(generateButton).toBeTruthy();

    // Check if the mock button is present
    const mockButton = await page.$('button:has-text("模拟提示词")');
    expect(mockButton).toBeTruthy();

    // Check if the Styles and Lyrics cards are present
    const stylesCard = await page.$(
      '.ant-card:has-text("Styles（可直接复制投喂Suno）")',
    );
    expect(stylesCard).toBeTruthy();

    const lyricsCard = await page.$(
      '.ant-card:has-text("Lyrics（可直接复制投喂Suno）")',
    );
    expect(lyricsCard).toBeTruthy();
  });
});
