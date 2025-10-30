
from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the local server
            page.goto("http://localhost:8080", wait_until="networkidle")

            # Find the Facebook card
            facebook_card = page.locator(".card-facebook")

            # Wait for the card to be visible
            expect(facebook_card).to_be_visible()

            # Take a screenshot
            facebook_card.screenshot(path="jules-scratch/verification/facebook_card_with_abstract_photo.png")

            print("Screenshot captured successfully.")

        except Exception as e:
            print(f"An error occurred: {e}")
            page.screenshot(path="jules-scratch/verification/error.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
