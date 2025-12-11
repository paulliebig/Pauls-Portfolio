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
    const scrollThreshold = window.innerHeight * 0.3;

    if (isMobile) {
        aboutSection.classList.add('visible');
        navbar.classList.remove('visible');
    } else {
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
let isCarouselMode = false;
let carouselLockPosition = 0;
let wheelDelta = 0;
let isAnimating = false;

function updateCarousel() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        items.forEach(item => item.classList.remove('active'));
        carouselTitle.textContent = 'About me';
        track.style.transform = 'translateX(0)';
        return;
    }

    items.forEach(item => item.classList.remove('active'));
    items[currentIndex].classList.add('active');

    const currentTitle = items[currentIndex].getAttribute('data-title');
    carouselTitle.style.animation = 'none';
    void carouselTitle.offsetWidth;
    carouselTitle.textContent = currentTitle;
    carouselTitle.style.animation = 'fadeInScale 0.4s ease';

    const itemWidth = 500;
    const activeWidth = 600;
    const gap = 32;

    let offset = 0;
    if (currentIndex === 0) {
        offset = (window.innerWidth / 2) - (activeWidth / 2);
    } else {
        offset = (window.innerWidth / 2) - (activeWidth / 2) - (currentIndex * (itemWidth + gap));
    }

    track.style.transform = `translateX(${offset}px)`;
}

// =======================
// CAROUSEL SCROLL HIJACKING (robust)
// =======================
function aboutFullyVisible() {
    const rect = aboutSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= window.innerHeight;
}

window.addEventListener('wheel', (e) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const threshold = 150;
    const fullyVisible = aboutFullyVisible();

    // Enter carousel mode when the about-section is fully visible and user scrolls down into it
    if (fullyVisible && !isCarouselMode && e.deltaY > 0) {
        isCarouselMode = true;
        carouselLockPosition = window.scrollY;
        wheelDelta = 0;
        // lock scroll immediately
        window.scrollTo(0, carouselLockPosition);
        e.preventDefault();
        return;
    }

    // If we're not in carousel mode, do nothing special (let the page scroll)
    if (!isCarouselMode) return;

    // If carousel mode is active, always prevent default wheel (we control movement)
    e.preventDefault();

    // Keep the page locked while we navigate items (unless we decide to exit)
    if (carouselLockPosition > 0) {
        window.scrollTo(0, carouselLockPosition);
    }

    // accumulate wheel
    wheelDelta += e.deltaY;

    if (Math.abs(wheelDelta) < threshold) {
        // not enough movement yet to change item
        return;
    }

    // DOWNWARDS: move forward in carousel or exit to page scroll if at last item
    if (wheelDelta > 0) {
        if (currentIndex < items.length - 1 && !isAnimating) {
            isAnimating = true;
            currentIndex++;
            updateCarousel();
            wheelDelta = 0;
            setTimeout(() => isAnimating = false, 600);
            return;
        } else if (currentIndex === items.length - 1) {
            // we're at the end -> exit carousel and allow normal page scrolling downwards
            isCarouselMode = false;
            wheelDelta = 0;
            // let the browser handle the scroll by re-dispatching the delta
            window.scrollBy(0, e.deltaY);
            return;
        } else {
            wheelDelta = 0;
            return;
        }
    }

    // UPWARDS: move backward in carousel or exit to page scroll if at first item
    if (wheelDelta < 0) {
        if (currentIndex > 0 && !isAnimating) {
            isAnimating = true;
            currentIndex--;
            updateCarousel();
            wheelDelta = 0;
            setTimeout(() => isAnimating = false, 600);
            return;
        } else if (currentIndex === 0) {
            // at first item -> exit carousel and allow normal page scrolling upwards
            isCarouselMode = false;
            wheelDelta = 0;
            window.scrollBy(0, e.deltaY);
            return;
        } else {
            wheelDelta = 0;
            return;
        }
    }
}, { passive: false });

// Keep scroll locked during carousel (in case other scroll events try to change it)
window.addEventListener('scroll', () => {
    if (isCarouselMode && carouselLockPosition > 0 && currentIndex > 0) {
        window.scrollTo(0, carouselLockPosition);
    }
});

// Arrow buttons
prevBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
        wheelDelta = 0;

        setTimeout(() => isAnimating = false, 600);
    }
});

nextBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.min(items.length - 1, currentIndex + 1);
        updateCarousel();
        wheelDelta = 0;

        setTimeout(() => isAnimating = false, 600);
    }
});

// INIT
updateCarousel();
updateParallax();
updateVisibility();

window.addEventListener('resize', () => {
    updateCarousel();
    isCarouselMode = false;
    carouselLockPosition = 0;
    currentIndex = 0;
    wheelDelta = 0;
});

// =======================
// BURGER MENU
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
