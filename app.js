document.addEventListener('DOMContentLoaded', () => {
    // --- B. Logique applicative ---

    const mainNav = document.getElementById('main-nav');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    if (mainNav && mobileMenuBtn) {
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
    }

    // --- Fonctions de rendu des données ---
    async function loadNews() {
        const container = document.getElementById('news-list');
        if (!container) return;

        try {
            const response = await fetch('data/articles.json');
            const newsData = await response.json();

            const sortedNews = [...newsData].sort((a, b) => new Date(b.date) - new Date(a.date));

            const facebookCardHTML = `
                <article class="card card-facebook">
                    <div class="card-background" style="background-image: url('https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')"></div>
                    <div class="card-content">
                        <div class="card-header">
                            <svg class="facebook-logo" width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.35C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.732 0 1.325-.593 1.325-1.325V1.325C24 .593 23.407 0 22.675 0z"/></svg>
                            <h3>Suivez-nous !</h3>
                        </div>
                        <p>Pour ne rien manquer de nos dernières actualités, concerts et répétitions, rejoignez-nous sur notre page.</p>
                    </div>
                    <div class="card-actions">
                        <a href="https://www.facebook.com/share/17KzQFFdR2/" target="_blank" rel="noopener" class="btn btn-primary">
                            Rejoindre
                        </a>
                    </div>
                </article>
            `;

            if (sortedNews.length === 0) {
                container.innerHTML = facebookCardHTML;
                return;
            }

            const newsHTML = sortedNews.map(item => {
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

            container.innerHTML = facebookCardHTML + newsHTML;
        } catch (error) {
            console.error('Failed to load news data:', error);
            container.innerHTML = "<p>Erreur lors du chargement des actualités.</p>";
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
    setupContactLink();
    loadSupporters();
    loadBackgroundImages();
    loadRadioPlayer();
    setupMembershipLinks();

    async function setupMembershipLinks() {
        const memberLink = document.getElementById('member-link');
        const choristerLink = document.getElementById('chorister-link');
        if (!memberLink || !choristerLink) return;
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const membership = config.membership;
            memberLink.href = membership.member;
            choristerLink.href = membership.chorister;
        } catch (error) {
            console.error('Failed to setup membership links:', error);
            memberLink.href = "#";
            choristerLink.href = "#";
        }
    }

    async function loadRadioPlayer() {
        const radioPlayer = document.getElementById('radio-player');
        if (!radioPlayer) return;
        try {
            const response = await fetch('config.json');
            const config = await response.json();
            const radio = config.media.audio[0];
            if(radio) {
                radioPlayer.src = radio.playerUrl;
            } else {
                document.getElementById('radio-card').style.display = 'none';
            }
        } catch (error) {
            console.error('Failed to load radio player:', error);
            document.getElementById('radio-card').style.display = 'none';
        }
    }

    function setupCarousel(containerSelector, leftBtnSelector, rightBtnSelector) {
        const container = document.querySelector(containerSelector);
        const leftBtn = document.querySelector(leftBtnSelector);
        const rightBtn = document.querySelector(rightBtnSelector);

        if (!container || !leftBtn || !rightBtn) return;

        const scrollToNextItem = (direction) => {
            // Scroll by half the container's visible width
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

    setupCarousel('#news-list', '.news-scroll-btn.left', '.news-scroll-btn.right');
});
