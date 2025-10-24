from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # Verify index.html
    page.goto("http://localhost:8080/index.html")
    page.wait_for_selector("#news-list .card")
    page.screenshot(path="jules-scratch/verification/index.png")

    articles = [
        "concert-maison-retraite-tarbes",
        "reprise-repetitions-septembre-2025",
        "pique-nique-adour",
        "vacances-pique-nique"
    ]

    for article_id in articles:
        page.goto(f"http://localhost:8080/article.html?id={article_id}")
        page.wait_for_selector("#article-content img")
        page.screenshot(path=f"jules-scratch/verification/{article_id}.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
