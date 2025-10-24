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
                                <p class="card-excerpt">${item.excerpt}</p>
                            </div>
                            <div class="card-footer">
                                <div class="card-background" style="background-image: url('${Array.isArray(item.imageUrls) ? item.imageUrls[0] : item.imageUrls}')"></div>
                                <div class="card-actions">
                                    <a href="article.html?id=${item.id}" class="btn btn-secondary">Lire la suite</a>
                                </div>
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
            const photos = config.media.photos || [];
            const videos = config.media.videos || [];
            const audio = config.media.audio || [];
            const documents = config.media.documents || [];

            const photosHTML = photos.map(photo => `
                <div class="card">
                    <div class="card-content media-card-content">
                        <h3>${photo.title}</h3>
                    </div>
                    <img src="${photo.url}" alt="${photo.title}" style="width:100%; height:auto;">
                </div>
            `).join('');

            const videosHTML = videos.map(video => `
                <div class="card">
                    <div class="card-content media-card-content">
                        <h3>${video.title}</h3>
                    </div>
                    <div class="video-container">
                        <iframe src="${video.embedUrl}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                </div>
            `).join('');

            const audioHTML = audio.map(item => `
                <div class="card">
                    <div class="card-content media-card-content">
                        <h3>${item.title}</h3>
                    </div>
                    <div class="video-container">
                        <iframe src="${item.playerUrl}" allow="autoplay" style="width:100%; height:100px;"></iframe>
                    </div>
                </div>
            `).join('');

            const documentsHTML = documents.map(doc => `
                <div class="card">
                    <div class="card-content">
                        <h3>${doc.title}</h3>
                        <p>Cliquez pour voir le document.</p>
                    </div>
                    <div class="card-actions">
                        <a href="${doc.documentUrl}" target="_blank" rel="noopener" class="btn btn-secondary">Ouvrir le document</a>
                    </div>
                </div>
            `).join('');

            const combinedHTML = photosHTML + videosHTML + audioHTML + documentsHTML;

            if (combinedHTML) {
                container.innerHTML = combinedHTML;
            } else {
                container.innerHTML = "<p>Aucun média disponible pour le moment.</p>";
            }

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

    function setupCarousel(containerSelector, leftBtnSelector, rightBtnSelector) {
        const container = document.querySelector(containerSelector);
        const leftBtn = document.querySelector(leftBtnSelector);
        const rightBtn = document.querySelector(rightBtnSelector);

        if (!container || !leftBtn || !rightBtn) return;

        const scrollToNextItem = (direction) => {
            // Scroll by half the container's visible width
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

    setupCarousel('#news-list', '.news-scroll-btn.left', '.news-scroll-btn.right');
    setupCarousel('#media-gallery', '.media-scroll-btn.left', '.media-scroll-btn.right');
});
