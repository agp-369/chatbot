import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to the local index.html file
        import os
        file_path = f"file://{os.getcwd()}/index.html"
        await page.goto(file_path)

        # --- Test Productivity and Creativity Features ---
        await page.set_viewport_size({"width": 1280, "height": 800})

        # 1. To-Do List
        await page.fill("#input", "add to-do 'Buy groceries'")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        await page.fill("#input", "add to-do 'Walk the dog'")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        await page.fill("#input", "show to-do list")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        await page.fill("#input", "delete to-do 1")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        # 2. Note-Taking
        await page.fill("#input", "add note 'Remember to call mom'")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        await page.fill("#input", "show notes")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=5000)

        # 3. Idea Generation
        await page.fill("#input", "give me an idea")
        await page.press("#input", "Enter")
        await expect(page.locator("#typing-indicator")).to_be_hidden(timeout=10000)

        # 4. Take a screenshot
        await page.screenshot(path="jules-scratch/verification/features_verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())