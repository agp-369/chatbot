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

        # --- Test Conversational Features ---

        # 1. Start a conversation
        await page.fill("#input", "hello")
        await page.press("#input", "Enter")
        await expect(page.locator(".bot-response").last).not_to_be_empty(timeout=10000)

        # 2. Ask a question
        await page.fill("#input", "how are you doing?")
        await page.press("#input", "Enter")
        await expect(page.locator(".bot-response").last).not_to_be_empty(timeout=10000)

        # 3. Ask for a recommendation
        await page.fill("#input", "recommend a movie")
        await page.press("#input", "Enter")
        await expect(page.locator(".bot-response").last).not_to_be_empty(timeout=10000)

        # 4. Say thanks and see the follow-up
        await page.fill("#input", "thanks")
        await page.press("#input", "Enter")
        await expect(page.locator(".bot-response").last).not_to_be_empty(timeout=10000)

        # Wait for potential follow-up
        await page.wait_for_timeout(2000)

        # 5. Take a screenshot
        await page.screenshot(path="jules-scratch/verification/conversation_verification.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())