document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-container');

    async function loadArticle() {
        // 1. Récupérer l'ID de l'article depuis l'URL (ex: article.html?id=concert-printemps-2025)
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');

        if (!articleId) {
            articleContainer.innerHTML = '<p>Aucun article spécifié. Veuillez retourner à la page d\'accueil.</p>';
            return;
        }

        try {
            // 2. Charger le fichier JSON des articles
            const response = await fetch('data/news.json');
            const articles = await response.json();

            // 3. Trouver le bon article
            const article = articles.find(a => a.id === articleId);

            if (!article) {
                articleContainer.innerHTML = '<p>Article non trouvé.</p>';
                return;
            }

            // 4. Mettre à jour le titre de la page
            document.title = `${article.title} - Solencoeur`;

            // 5. Injecter le contenu de l'article dans le HTML
            articleContainer.innerHTML = `
                <div class="article-header">
                    <h1>${article.title}</h1>
                    <p class="article-meta">
                        Publié le ${new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        par <strong>${article.author}</strong>
                    </p>
                </div>
                <div id="article-media-container">
                    <!-- Le contenu sera injecté ici -->
                </div>
                <div class="article-body">
                    ${article.content}
                </div>
                <div class="back-link">
                    <a href="index.html#news" class="btn btn-primary">Retour aux actualités</a>
                </div>
            `;

            const mediaContainer = document.getElementById('article-media-container');

            if (article.imageUrls && article.imageUrls.length > 1) {
                // S'il y a plusieurs images, créer un carrousel
                mediaContainer.innerHTML = `
                    <div class="article-carousel-container">
                        <button class="scroll-btn left article-scroll-btn">&lt;</button>
                        <div class="article-image-gallery">
                            ${article.imageUrls.map(url => `<img src="${url}" alt="Image pour ${article.title}" class="article-image">`).join('')}
                        </div>
                        <button class="scroll-btn right article-scroll-btn">&gt;</button>
                    </div>
                `;
                setupCarousel('.article-image-gallery', '.article-scroll-btn.left', '.article-scroll-btn.right');
            } else if (article.imageUrls && article.imageUrls.length === 1) {
                // S'il n'y a qu'une seule image
                mediaContainer.innerHTML = `<img src="${article.imageUrls[0]}" alt="Image pour ${article.title}" class="article-image single-image">`;
            }

        } catch (error) {
            console.error('Erreur lors du chargement de l\'article:', error);
            articleContainer.innerHTML = '<p>Une erreur est survenue lors du chargement de l\'article.</p>';
        }
    }

    function setupCarousel(containerSelector, leftBtnSelector, rightBtnSelector) {
        const container = document.querySelector(containerSelector);
        const leftBtn = document.querySelector(leftBtnSelector);
        const rightBtn = document.querySelector(rightBtnSelector);

        if (!container || !leftBtn || !rightBtn) return;

        const scrollToNextItem = (direction) => {
            const scrollAmount = container.clientWidth;
            if (direction === 'right') {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        };

        leftBtn.addEventListener('click', () => scrollToNextItem('left'));
        rightBtn.addEventListener('click', () => scrollToNextItem('right'));
    }

    loadArticle();
});
