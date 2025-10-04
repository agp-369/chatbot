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

        await page.set_viewport_size({"width": 1280, "height": 800})

        # Get the initial number of bot messages
        initial_bot_message_count = await page.locator(".bot-response").count()

        # Ask a question to trigger the simulated API response
        await page.fill("#input", "What is the capital of France?")
        await page.press("#input", "Enter")

        # Wait for a new bot message to appear
        await expect(page.locator(".bot-response")).to_have_count(initial_bot_message_count + 1, timeout=5000)

        # Take a final screenshot
        await page.screenshot(path="final_verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())