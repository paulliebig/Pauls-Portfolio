// =======================
// PARALLAX EFFECT
// =======================
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');
const layer3 = document.getElementById('layer3');
const aboutSection = document.querySelector('.about-section');
const navbar = document.querySelector('.navbar');

// Mouse Movement Parallax
document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    updateParallax();
});

// Scroll Parallax
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    updateParallax();
    updateVisibility();
});

function updateParallax() {
    const scrollFactor = scrollY * 0.1;
    const mouseFactor = 20;

    layer1.style.transform = `
        translate(-50%, -50%)
        translateY(${-scrollFactor * 0.3}px)
        translateX(${mouseX * mouseFactor * 0.5}px)
        translateY(${mouseY * mouseFactor * 0.5}px)
    `;

    layer2.style.transform = `
        translate(-50%, -50%)
        translateY(${-scrollFactor * 0.6}px)
        translateX(${mouseX * mouseFactor}px)
        translateY(${mouseY * mouseFactor}px)
    `;

    // Layer 3 bewegt sich langsamer nach oben, um unteren Rand zu verbergen
    layer3.style.transform = `
        translate(-50%, -50%)
        translateY(${-scrollFactor * 0.5}px)
        translateX(${mouseX * mouseFactor * 1.5}px)
        translateY(${mouseY * mouseFactor * 0.8}px)
    `;
}

// =======================
// INDEX SPECIFIC: About Section & Navbar Fade In
// =======================
function updateVisibility() {
    const isMobile = window.innerWidth <= 768;
    const scrollThreshold = window.innerHeight * 0.7;

    if (isMobile) {
        // Auf Mobile: Scroll-Effekt wird deaktiviert, Navbar bleibt unsichtbar
        aboutSection.classList.add('visible'); // About-Content darf trotzdem erscheinen
        navbar.classList.remove('visible');    // Kein automatisches Einblenden
    } else {
        // Auf Desktop: klassischer Scroll-Fade-In
        if (scrollY >= scrollThreshold) {
            aboutSection.classList.add('visible');
            navbar.classList.add('visible');
        } else {
            aboutSection.classList.remove('visible');
            navbar.classList.remove('visible');
        }
    }
}



// =======================
// CAROUSEL LOGIC
// =======================
const track = document.getElementById('carouselTrack');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const carouselTitle = document.getElementById('carouselTitle');

let currentIndex = 0;

function updateCarousel() {
    // Entferne active von allen Items
    items.forEach(item => item.classList.remove('active'));
    
    // Füge active zum aktuellen Item hinzu
    items[currentIndex].classList.add('active');

    // Update Title mit Animation
    const currentTitle = items[currentIndex].getAttribute('data-title');
    
    // Trigger Animation durch Entfernen und Hinzufügen
    carouselTitle.style.animation = 'none';
    
    // Force reflow
    void carouselTitle.offsetWidth;
    
    // Setze neue Werte
    carouselTitle.textContent = currentTitle;
    
    // Starte Animation
    carouselTitle.style.animation = 'fadeInScale 0.4s ease';

    // Berechne Offset für Zentrierung - responsive
    const isMobile = window.innerWidth <= 768;
    const itemWidth = isMobile ? 280 : 500;
    const activeWidth = isMobile ? 320 : 600;
    const gap = isMobile ? 16 : 32;
    
    let offset = 0;
    if (currentIndex === 0) {
        offset = (window.innerWidth / 2) - (activeWidth / 2);
    } else {
        offset = (window.innerWidth / 2) - (activeWidth / 2) - (currentIndex * (itemWidth + gap));
    }

    track.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
});

// =======================
// INITIALIZE
// =======================
updateCarousel();
updateParallax();
updateVisibility();

// Resize Handler
window.addEventListener('resize', updateCarousel);

// =======================
// BURGER MENU (GALLERY SPECIFIC)
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navbar = document.querySelector('.navbar');

    if (burger && navbar) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }
});