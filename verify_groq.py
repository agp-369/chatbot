import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # Listen for console messages
        page.on("console", lambda msg: print(f"Browser Console: {msg.text()}"))

        # Navigate to the local test file
        import os
        file_path = f"file://{os.getcwd()}/groq_test.html"
        await page.goto(file_path)

        # Wait for the API call to complete
        await page.wait_for_timeout(10000)

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())