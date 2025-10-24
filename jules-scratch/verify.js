const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Écouter les messages de la console de la page
  page.on('console', msg => console.log('LOG PAGE:', msg.text()));
  // Écouter les requêtes échouées
  page.on('requestfailed', request => {
    console.log(`ÉCHEC REQUÊTE: ${request.url()} ${request.failure().errorText}`);
  });

  try {
    // Vérifier la page d'accueil
    console.log("Navigation vers index.html...");
    await page.goto('http://localhost:8080', { waitUntil: 'domcontentloaded' });
    console.log("Navigation terminée. Attente du sélecteur '.news-card'...");
    await page.waitForSelector('.news-card');
    console.log("Sélecteur trouvé. Capture d'écran de la page d'accueil...");
    await page.screenshot({ path: 'jules-scratch/verification/index.png', fullPage: true });
    console.log("Capture d'écran de la page d'accueil réussie.");

  } catch (e) {
    console.error("Erreur lors de la vérification de la page d'accueil:", e.message);
    await page.screenshot({ path: 'jules-scratch/verification/index-error.png', fullPage: true });
    console.log("Capture d'écran d'erreur de la page d'accueil prise.");
  }

  try {
    // Vérifier la première page d'article
    console.log("Navigation vers article.html?id=1...");
    await page.goto('http://localhost:8080/article.html?id=concert-maison-retraite-tarbes', { waitUntil: 'domcontentloaded' });
    console.log("Navigation terminée. Attente du contenu de l'article...");
    await page.waitForSelector('#article-container h1, #article-container p');
    console.log("Contenu de l'article trouvé. Capture d'écran de l'article 1...");
    await page.screenshot({ path: 'jules-scratch/verification/article-1.png', fullPage: true });
    console.log("Capture d'écran de l'article 1 réussie.");

  } catch(e) {
    console.error("Erreur lors de la vérification de l'article 1:", e.message);
    await page.screenshot({ path: 'jules-scratch/verification/article-1-error.png', fullPage: true });
    console.log("Capture d'écran d'erreur de l'article 1 prise.");
  }

  await browser.close();
  console.log("Navigateur fermé.");
})();
