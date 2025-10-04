import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        # Launch the Electron app
        app = await p._electron.launch(args=['.'])

        # Get the first window that opens
        page = await app.first_window()
        await page.wait_for_load_state('domcontentloaded')

        # Take a screenshot
        await page.screenshot(path="electron_verification.png")

        # Close the app
        await app.close()

if __name__ == "__main__":
    asyncio.run(main())