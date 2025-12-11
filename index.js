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
let isAnimating = false;

// Wheel settings for mouse
let wheelBuffer = 0;
let lastWheelChange = 0;
const wheelCooldown = 100;
const MAX_WHEEL_DELTA = 200;
const WHEEL_STEP_THRESHOLD = 150;

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

    let offset = (window.innerWidth / 2) - (activeWidth / 2) - (currentIndex * (itemWidth + gap));
    track.style.transform = `translateX(${offset}px)`;
}

// =======================
// DETECT DEVICE TYPE
// =======================
function isTouchpadEvent(e) {
    // Pixel-based and small deltas are usually touchpad
    return e.deltaMode === 0 && Math.abs(e.deltaY) < 50;
}

// =======================
// CAROUSEL WHEEL HANDLERS
// =======================
function aboutFullyVisible() {
    const rect = aboutSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= window.innerHeight;
}

// Mouse wheel handler (discrete steps)
function handleMouseWheel(e) {
    e.preventDefault();
    const now = Date.now();
    window.scrollTo(0, carouselLockPosition);

    let delta = Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, e.deltaY));

    // Ignore extra scroll past last slide
    if (currentIndex === items.length - 1 && delta > 0) {
        wheelBuffer = 0;
        return;
    }

    wheelBuffer += delta;
    const stepCount = Math.floor(Math.abs(wheelBuffer) / WHEEL_STEP_THRESHOLD);
    if (stepCount === 0) return;

    if (now - lastWheelChange < wheelCooldown) return;
    lastWheelChange = now;

    const direction = wheelBuffer > 0 ? 1 : -1;

    if (direction === 1) { // scrolling down
        if (currentIndex < items.length - 1) {
            currentIndex++;
            wheelBuffer -= WHEEL_STEP_THRESHOLD;
            updateCarousel();
            if (currentIndex === items.length - 1) {
                carouselLockPosition = window.scrollY;
                wheelBuffer = 0;
            }
        }
    } else { // scrolling up
        if (currentIndex > 0) {
            currentIndex--;
            wheelBuffer += WHEEL_STEP_THRESHOLD;
            updateCarousel();
        } else {
            isCarouselMode = false;
            wheelBuffer = 0;
            return;
        }
    }
    window.scrollTo(0, carouselLockPosition);
}

// Touchpad handler (smooth, no jitter)
let touchpadBuffer = 0;
function handleTouchpadWheel(e) {
    e.preventDefault();
    window.scrollTo(0, carouselLockPosition);

    // Small delta accumulation for smooth slide change
    const delta = e.deltaY;
    touchpadBuffer += delta;

    if (touchpadBuffer > WHEEL_STEP_THRESHOLD) {
        if (currentIndex < items.length - 1) {
            currentIndex++;
            updateCarousel();
        }
        touchpadBuffer = 0;
        if (currentIndex === items.length - 1) carouselLockPosition = window.scrollY;
    } else if (touchpadBuffer < -WHEEL_STEP_THRESHOLD) {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else {
            isCarouselMode = false;
        }
        touchpadBuffer = 0;
    }

    window.scrollTo(0, carouselLockPosition);
}

// Main wheel event
window.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 768) return;

    const fullyVisible = aboutFullyVisible();

    // Enter carousel
    if (fullyVisible && !isCarouselMode && e.deltaY > 0) {
        isCarouselMode = true;
        carouselLockPosition = window.scrollY;
        wheelBuffer = 0;
        touchpadBuffer = 0;
        window.scrollTo(0, carouselLockPosition);
        e.preventDefault();
        return;
    }

    if (!isCarouselMode) return;

    if (isTouchpadEvent(e)) {
        handleTouchpadWheel(e);
    } else {
        handleMouseWheel(e);
    }
});

// Scroll lock listener
window.addEventListener('scroll', () => {
    if (isCarouselMode) {
        window.scrollTo(0, carouselLockPosition);
    }
});

// Arrow buttons
prevBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
        wheelBuffer = 0;
        touchpadBuffer = 0;
        setTimeout(() => isAnimating = false, 600);
    }
});

nextBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.min(items.length - 1, currentIndex + 1);
        updateCarousel();
        wheelBuffer = 0;
        touchpadBuffer = 0;
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
    wheelBuffer = 0;
    touchpadBuffer = 0;
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
