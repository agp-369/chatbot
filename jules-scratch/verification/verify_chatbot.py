import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Navigate to the local index.html file
        import os
        await page.goto(f"file://{os.getcwd()}/index.html")

        # 1. Test the theme switcher
        await page.click("#theme-switcher")
        await page.wait_for_timeout(500) # Wait for theme to apply

        # 2. Test the joke API
        await page.fill("#input", "tell me a joke")
        await page.press("#input", "Enter")

        # Wait for the typing indicator to disappear
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=10000)

        # Wait for the final part of the joke (if it's a two-part joke)
        await page.wait_for_timeout(2500)

        # 3. Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())