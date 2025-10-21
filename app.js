document.addEventListener('DOMContentLoaded', () => {
    // --- B. Logique applicative ---

    const mainNav = document.getElementById('main-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = mainNav.querySelectorAll('a');

    // Gestion du Menu Mobile
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        mobileMenuBtn.querySelector('.material-icons').textContent = isOpen ? 'close' : 'menu';
    });

    mainNav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            mainNav.classList.remove('open');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            mobileMenuBtn.querySelector('.material-icons').textContent = 'menu';
        }
    });

    // --- Smooth Scroll ---
    navLinks.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fonctions de rendu des données ---
    async function loadNews() {
        const container = document.getElementById('news-list');
        if (!container) return;

        try {
            const response = await fetch('data/news.json');
            const newsData = await response.json();

            const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));

            if (sortedNews.length === 0) {
                container.innerHTML = "<p>Aucune actualité pour le moment.</p>";
                return;
            }

            container.innerHTML = sortedNews.map(item => {
                if (item.type === 'event') {
                    return `
                        <article class="card">
                            <div class="card-content">
                                <h3>${item.title}</h3>
                                <p><strong>Date :</strong> ${new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p><strong>Lieu :</strong> ${item.location}</p>
                                <p>${item.description}</p>
                            </div>
                            ${item.link ? `<div class="card-actions">
                                <a href="${item.link}" target="_blank" rel="noopener" class="btn btn-secondary">Plus d'infos / Billets</a>
                            </div>` : ''}
                        </article>
                    `;
                } else {
                    return `
                        <article class="card">
                            <div class="card-content">
                                <h3>${item.title}</h3>
                                <p class="text-light"><small>Publié le ${new Date(item.date).toLocaleDateString('fr-FR')}</small></p>
                                <p>${item.excerpt}</p>
                            </div>
                            <div class="card-actions">
                                <a href="#news/${item.id}" class="btn btn-secondary" onclick="event.preventDefault(); alert('Page de détail de l\\'actualité à implémenter');">Lire la suite</a>
                            </div>
                        </article>
                    `;
                }
            }).join('');
        } catch (error) {
            console.error('Failed to load news data:', error);
            container.innerHTML = "<p>Erreur lors du chargement des actualités.</p>";
        }
    }

    async function loadMedia() {
        const container = document.getElementById('media-gallery');
        if (!container) return;
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const videos = config.media.videos;
            container.innerHTML = videos.map(video => `
                <div class="card">
                    <div style="aspect-ratio: 16/9;">
                        <iframe
                            src="https://www.youtube.com/embed/${video.id}"
                            title="${video.title}"
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                            style="width:100%; height:100%;">
                        </iframe>
                    </div>
                    <div class="card-content">
                        <h3>${video.title}</h3>
                    </div>
                </div>
            `).join('');
        }
        catch (error) {
            console.error('Failed to load media data:', error);
            container.innerHTML = "<p>Erreur lors du chargement des médias.</p>";
        }
    }
    async function setupContactLink() {
        const contactLink = document.getElementById('contact-link');
        if (!contactLink) return;
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const contactEmail = config.contactEmail;
            const subject = "Message depuis le site Solencoeur";
            contactLink.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`;
        } catch (error) {
            console.error('Failed to setup contact link:', error);
            contactLink.href = "#";
            contactLink.textContent = "Erreur de configuration";
        }
    }

    async function loadSupporters() {
        const container = document.getElementById('supporters-logos');
        if (!container) return;
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const supporters = config.supporters;
            container.innerHTML = supporters.map(supporter => `
                <img src="${supporter.logoUrl}" alt="${supporter.name}" style="height: 80px; margin: 10px;">
            `).join('');
        } catch (error) {
            console.error('Failed to load supporters data:', error);
            container.innerHTML = "<p>Erreur lors du chargement des soutiens.</p>";
        }
    }

    // --- Chargement initial des données dynamiques ---
    async function loadBackgroundImages() {
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const backgroundImages = config.backgroundImages;

            const sections = document.querySelectorAll('main > section');
            sections.forEach(section => {
                const sectionId = section.id;
                if (backgroundImages[sectionId]) {
                    const imageUrl = backgroundImages[sectionId];
                    const bgElement = section.querySelector('.parallax-bg');
                    if (bgElement) {
                        bgElement.style.backgroundImage = `url(${imageUrl})`;
                        section.style.backgroundColor = 'transparent';
                    }
                }
            });
        } catch (error) {
            console.error('Failed to load background images:', error);
        }
    }

    loadNews();
    loadMedia();
    setupContactLink();
    loadSupporters();
    loadBackgroundImages();

    const newsList = document.getElementById('news-list');
    const leftBtn = document.querySelector('.scroll-btn.left');
    const rightBtn = document.querySelector('.scroll-btn.right');

    if (newsList && leftBtn && rightBtn) {
        const scrollToNextArticle = (direction) => {
            const articles = newsList.querySelectorAll('article.card');
            if (articles.length === 0) return;

            const containerWidth = newsList.offsetWidth;
            const currentScroll = newsList.scrollLeft;

            let targetArticle = null;

            if (direction === 'right') {
                targetArticle = Array.from(articles).find(article => {
                    const articleLeft = article.offsetLeft;
                    return articleLeft > currentScroll + 1; // +1 to avoid floating point issues
                });
            } else { // direction === 'left'
                const visibleArticles = Array.from(articles).filter(article => {
                    const articleLeft = article.offsetLeft;
                    return articleLeft < currentScroll - 1;
                });
                targetArticle = visibleArticles.length > 0 ? visibleArticles[visibleArticles.length - 1] : articles[0];
            }

            if (targetArticle) {
                newsList.scrollTo({
                    left: targetArticle.offsetLeft,
                    behavior: 'smooth'
                });
            }
        };

        leftBtn.addEventListener('click', () => scrollToNextArticle('left'));
        rightBtn.addEventListener('click', () => scrollToNextArticle('right'));
    }
});
