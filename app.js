document.addEventListener('DOMContentLoaded', () => {
    // --- B. Logique applicative ---

    const mainContent = document.getElementById('main-content');
    const mainNav = document.getElementById('main-nav');
    const navLinks = mainNav.querySelectorAll('a');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

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

    async function loadContent(pageName) {
        try {
            const response = await fetch(`views/${pageName}.html`);
            if (!response.ok) {
                throw new Error('View not found');
            }
            const viewHtml = await response.text();
            mainContent.innerHTML = viewHtml;

            // Mettre à jour le lien actif
            updateActiveLink(pageName);

            // Exécuter les scripts spécifiques à la page après l'injection du HTML
            if (pageName === 'agenda') await loadAgenda();
            if (pageName === 'blog') await loadBlog();
            if (pageName === 'media') await loadMedia();
            if (pageName === 'contact') await setupContactForm();

            // Accessibilité : focus sur le contenu principal
            mainContent.focus();
            window.scrollTo(0, 0);

        } catch (error) {
            console.error('Failed to load page:', error);
            const response = await fetch(`views/404.html`);
            mainContent.innerHTML = await response.text();
        }
    }


    function navigate() {
        const pageName = window.location.hash.substring(1) || 'accueil';
        loadContent(pageName);
    }

    function updateActiveLink(pageName) {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.hash === `#${pageName}`);
        });
    }

    // Écouteurs pour la navigation
    window.addEventListener('hashchange', navigate);
    document.body.addEventListener('click', e => {
        if (e.target.matches('a[href^="#"]')) {
            // Pour les clics directs sur les liens de navigation
            const pageName = e.target.hash.substring(1);
            // Le hashchange event s'occupera du reste
        }
    });

    // --- Fonctions de rendu des données ---
    async function loadAgenda() {
        const container = document.getElementById('agenda-list');
        if (!container) return;

        try {
            const response = await fetch('data/agenda.json');
            const agendaData = await response.json();

            const sortedEvents = [...agendaData].sort((a, b) => new Date(b.date) - new Date(a.date));

            if (sortedEvents.length === 0) {
                container.innerHTML = "<p>Aucun événement programmé pour le moment.</p>";
                return;
            }

            container.innerHTML = sortedEvents.map(event => `
                <article class="card">
                    <div class="card-content">
                        <h3>${event.title}</h3>
                        <p><strong>Date :</strong> ${new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p><strong>Lieu :</strong> ${event.location}</p>
                        <p>${event.description}</p>
                    </div>
                    ${event.link ? `<div class="card-actions">
                        <a href="${event.link}" target="_blank" rel="noopener" class="btn btn-secondary">Plus d'infos / Billets</a>
                    </div>` : ''}
                </article>
            `).join('');
        } catch (error) {
            console.error('Failed to load agenda data:', error);
            container.innerHTML = "<p>Erreur lors du chargement de l'agenda.</p>";
        }
    }

    async function loadBlog() {
        const container = document.getElementById('blog-list');
        if (!container) return;
        try {
            const response = await fetch('data/blog.json');
            const blogData = await response.json();
            const sortedPosts = [...blogData].sort((a, b) => new Date(b.date) - new Date(a.date));
            container.innerHTML = sortedPosts.map(post => `
                <article class="card">
                    <div class="card-content">
                        <h3>${post.title}</h3>
                        <p class="text-light"><small>Publié le ${new Date(post.date).toLocaleDateString('fr-FR')}</small></p>
                        <p>${post.excerpt}</p>
                    </div>
                    <div class="card-actions">
                        <a href="#blog/${post.id}" class="btn btn-secondary" onclick="event.preventDefault(); alert('Page de détail de l\\'article à implémenter');">Lire la suite</a>
                    </div>
                </article>
            `).join('');
        }
        catch (error) {
            console.error('Failed to load blog data:', error);
            container.innerHTML = "<p>Erreur lors du chargement du blog.</p>";
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
    async function setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const response = await fetch('config.json');
        const config = await response.json();
        const contactEmail = config.contactEmail;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const subject = "Message depuis le site Solencoeur";
            const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
            window.location.href = mailtoLink;
        });
    }

    // Chargement initial
    navigate();


});