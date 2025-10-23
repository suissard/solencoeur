const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8080');

  // Attendre que le contenu soit chargé
  await page.waitForSelector('#media-gallery .card');
  await page.waitForSelector('#contact .btn');

  // Capturer les sections modifiées
  await page.locator('#media').screenshot({ path: 'media_section.png' });
  await page.locator('#contact').screenshot({ path: 'contact_section.png' });
  await page.locator('header').screenshot({ path: 'header.png' });


  await browser.close();
  console.log('Captures d\'écran enregistrées.');
})();
