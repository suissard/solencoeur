document.addEventListener('DOMContentLoaded', () => {
    const articleContainer = document.getElementById('article-container');

    function setupCarousel(containerSelector, leftBtnSelector, rightBtnSelector) {
        const container = document.querySelector(containerSelector);
        const leftBtn = document.querySelector(leftBtnSelector);
        const rightBtn = document.querySelector(rightBtnSelector);

        if (!container || !leftBtn || !rightBtn) return;

        const scrollToNextItem = (direction) => {
            const scrollAmount = container.clientWidth / 2;
            if (direction === 'right') {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            }
        };

        leftBtn.addEventListener('click', () => scrollToNextItem('left'));
        rightBtn.addEventListener('click', () => scrollToNextItem('right'));
    }

    async function loadArticle() {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');

        if (!articleId) {
            articleContainer.innerHTML = '<p>Aucun article spécifié. Veuillez retourner à la page d\'accueil.</p>';
            return;
        }

        try {
            const response = await fetch('data/articles.json');
            const articles = await response.json();
            const article = articles.find(a => a.id === articleId);

            if (!article) {
                articleContainer.innerHTML = '<p>Article non trouvé.</p>';
                return;
            }

            document.title = `${article.title} - Solencoeur`;

            // Déterminer le contenu de la galerie d'images
            let imageGalleryHTML = '';
            if (article.imageUrls && article.imageUrls.length > 1) {
                // Créer un carrousel s'il y a plus d'une image
                imageGalleryHTML = `
                    <div class="container-full-width">
                        <div class="scroll-container">
                            <button class="scroll-btn left article-scroll-btn">&lt;</button>
                            <div id="article-image-gallery" class="image-gallery-scroll">
                                ${article.imageUrls.map(url => `<img src="${url}" alt="Image pour ${article.title}" class="article-image">`).join('')}
                            </div>
                            <button class="scroll-btn right article-scroll-btn">&gt;</button>
                        </div>
                    </div>
                `;
            } else if (article.imageUrls && article.imageUrls.length === 1) {
                // Afficher une seule image si une seule URL est fournie
                imageGalleryHTML = `<img src="${article.imageUrls[0]}" alt="Image pour ${article.title}" class="article-image-single">`;
            }


            articleContainer.innerHTML = `
                <div class="article-header">
                    <h1>${article.title}</h1>
                    <p class="article-meta">
                        Publié le ${new Date(article.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        par <strong>${article.author}</strong>
                    </p>
                </div>
                ${imageGalleryHTML}
                <div class="article-body">
                    ${article.content}
                </div>
                <div class="back-link">
                    <a href="index.html#news" class="btn btn-primary">Retour aux actualités</a>
                </div>
            `;

            if (article.imageUrls && article.imageUrls.length > 1) {
                setupCarousel('#article-image-gallery', '.article-scroll-btn.left', '.article-scroll-btn.right');
            }

        } catch (error) {
            console.error('Erreur lors du chargement de l\'article:', error);
            articleContainer.innerHTML = '<p>Une erreur est survenue lors du chargement de l\'article.</p>';
        }
    }

    loadArticle();
});
