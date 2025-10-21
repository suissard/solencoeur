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
            const response = await fetch('data/articles.json');
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
                <img src="${article.imageUrl}" alt="Image pour ${article.title}" class="article-image">
                <div class="article-body">
                    ${article.content}
                </div>
                <div class="back-link">
                    <a href="index.html#news" class="btn btn-primary">Retour aux actualités</a>
                </div>
            `;

        } catch (error) {
            console.error('Erreur lors du chargement de l\'article:', error);
            articleContainer.innerHTML = '<p>Une erreur est survenue lors du chargement de l\'article.</p>';
        }
    }

    loadArticle();
});
