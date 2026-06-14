// ========================================
// NAVIGATION & MENU OVERLAY
// ========================================

const navLinks = [
    { label: 'Home',        href: 'index.html' },
    { label: 'About',       href: 'about.html' },
    { label: 'School',      href: 'school.html' },
    { label: 'Articles',    href: 'articles.html' },
    { label: 'Games',       href: 'games.html' },
    { label: 'Photography', href: 'photography.html' },
    { label: 'Contact',     href: 'contact.html' },
];

const currentPage = window.location.pathname.split('/').pop() || 'index.html';

function buildNav() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    nav.innerHTML = `
        <a href="index.html" class="nav-logo">
            <span class="logo-box">MN</span>
        </a>
        <button class="hamburger" id="hamburger" aria-label="Open menu">
            <span></span><span></span><span></span>
        </button>
    `;
    document.getElementById('hamburger').addEventListener('click', toggleMenu);
}

function buildOverlay() {
    const overlay = document.getElementById('menu-overlay');
    if (!overlay) return;
    overlay.innerHTML = `
    <nav>
        <ul class="overlay-nav">
            ${navLinks.map(link => `
                <li><a href="${link.href}" class="${currentPage === link.href ? 'active' : ''}">${link.label}</a></li>
            `).join('')}
        </ul>
    </nav>
    <p class="overlay-accent">Wits University · Johannesburg · 2026</p>
`;
}

let menuOpen = false;

function toggleMenu() {
    menuOpen = !menuOpen;
    const overlay = document.getElementById('menu-overlay');
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('main-nav');
    overlay.classList.toggle('open', menuOpen);
    hamburger.classList.toggle('open', menuOpen);
    nav.classList.toggle('menu-open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
}

// ========================================
// NAV SCROLL
// ========================================

function handleNavScroll() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    });
}

// ========================================
// FOOTER
// ========================================

function buildFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;
    footer.innerHTML = `
        <span class="footer-logo">Motheo Ngwetjana</span>
        <span class="footer-copy">© 2026 All Rights Reserved</span>
        <ul class="footer-links">
            ${navLinks.map(link => `<li><a href="${link.href}">${link.label}</a></li>`).join('')}
        </ul>
    `;
}

// ========================================
// SCROLL REVEAL
// ========================================

function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    elements.forEach(el => observer.observe(el));
}

// ========================================
// FILTER
// ========================================

function initFilter() {
    const buttons = document.querySelectorAll('.filter-btn');
    if (!buttons.length) return;
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.article-card').forEach(card => {
                card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
            });
            document.querySelectorAll('.game-card').forEach(card => {
                card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
            });
            document.querySelectorAll('.photo-item').forEach(item => {
                item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
            });
        });
    });
}

// ========================================
// LIGHTBOX
// ========================================

function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    let currentIndex = 0;
    let visibleItems = [];

    function openLightbox(index) {
        visibleItems = [...document.querySelectorAll('.photo-item:not(.hidden)')];
        currentIndex = index;
        const item = visibleItems[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.photo-overlay span');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        openLightbox(currentIndex);
    }

    document.querySelectorAll('.photo-item').forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'Escape') closeLightbox();
    });
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const successMsg = document.getElementById('form-success');

    // Real-time validation
    nameInput.addEventListener('input', () => validateName());
    emailInput.addEventListener('input', () => validateEmail());
    messageInput.addEventListener('input', () => validateMessage());

    function validateName() {
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Please enter your name';
            nameInput.classList.add('error');
            return false;
        }
        nameError.textContent = '';
        nameInput.classList.remove('error');
        return true;
    }

    function validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            emailInput.classList.add('error');
            return false;
        }
        emailError.textContent = '';
        emailInput.classList.remove('error');
        return true;
    }

    function validateMessage() {
        if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            messageInput.classList.add('error');
            return false;
        }
        messageError.textContent = '';
        messageInput.classList.remove('error');
        return true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = validateName() & validateEmail() & validateMessage();
        if (valid) {
            form.reset();
            successMsg.classList.add('visible');
            setTimeout(() => successMsg.classList.remove('visible'), 5000);
        }
    });
}

// ========================================
// INIT
// ========================================

buildNav();
buildOverlay();
buildFooter();
handleNavScroll();
initScrollReveal();
initFilter();
initLightbox();
initContactForm();