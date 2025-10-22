from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:8080")

        # Attendre que la section des actualités soit visible
        news_section = page.locator("#news")
        news_section.wait_for(state="visible")

        # Attendre que les cartes d'actualités soient chargées
        # On peut attendre qu'au moins une carte soit présente
        page.wait_for_selector("#news-list .card")

        # Prendre une capture d'écran de la section des actualités
        news_section.screenshot(path="jules-scratch/verification/verification.png")

        browser.close()

if __name__ == "__main__":
    run()
