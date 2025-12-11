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

// --- New state for fast-sequential wheel processing ---
let wheelBuffer = 0;                // accumulated normalized delta
let lastWheelChange = 0;            // timestamp of last wheel-initiated slide change
let wheelCooldown = 100;            // ms between sequential wheel-driven changes (short for fast feel)
const MAX_WHEEL_DELTA = 200;        // clamp per-event delta (prevents huge spikes)
const WHEEL_STEP_THRESHOLD = 150;   // original threshold idea (use to decide a single "step") - preserved feel

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
// CAROUSEL SCROLL HIJACKING (fast sequential wheel, preserves existing animations)
// =======================
function aboutFullyVisible() {
    const rect = aboutSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom >= window.innerHeight;
}

window.addEventListener('wheel', (e) => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const fullyVisible = aboutFullyVisible();
    const now = Date.now();

    // ENTER: when about fully visible and user scrolls down into it
    if (fullyVisible && !isCarouselMode && e.deltaY > 0) {
        isCarouselMode = true;
        carouselLockPosition = window.scrollY;
        wheelBuffer = 0;
        // lock scroll immediately
        window.scrollTo(0, carouselLockPosition);
        e.preventDefault();
        return;
    }

    // If not in carousel mode, do nothing special (allow page scroll)
    if (!isCarouselMode) return;

    // At this point carousel mode is active -> suppress vertical movement
    e.preventDefault();

    // Keep page locked while we're navigating (unless we explicitly exit)
    if (carouselLockPosition > 0) {
        window.scrollTo(0, carouselLockPosition);
    }

    // Normalize and clamp this event's delta to avoid huge spikes
    const clamped = Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, e.deltaY));

    // Accumulate into the wheel buffer
    wheelBuffer += clamped;

    // Decide how many logical steps are available based on threshold
    // But for Option 2 we want sequential single-step processing:
    // -> compute possibleSteps but only execute at most 1 step per cooldown interval (fast feel)
    const possibleSteps = Math.floor(Math.abs(wheelBuffer) / WHEEL_STEP_THRESHOLD);
    const direction = wheelBuffer > 0 ? 1 : (wheelBuffer < 0 ? -1 : 0);

    // If no full step available yet, wait for more delta
    if (possibleSteps === 0) return;

    // If we are within the short wheel cooldown, ignore further immediate steps
    if (now - lastWheelChange < wheelCooldown) {
        // leave buffer intact for next events to process
        return;
    }

    // Process exactly one step now (sequential), preserve rest of buffer for subsequent wheel events
    lastWheelChange = now;

    // DOWNWARDS: direction === 1
    if (direction === 1) {
        // if not at last slide, advance one
        if (currentIndex < items.length - 1) {
            // For wheel-driven transitions we bypass the long isAnimating lock, but still
            // keep a short local lock by setting lastWheelChange; this allows fast sequential moves.
            currentIndex = Math.min(items.length - 1, currentIndex + 1);
            updateCarousel();
            // subtract one logical step from buffer
            wheelBuffer -= WHEEL_STEP_THRESHOLD;
            // keep small defensive safety: if currentIndex reached last slide, allow exit on further delta
            if (currentIndex === items.length - 1) {
                // if buffer still positive and user continues scrolling down, exit carousel to page
                // but only if buffer exceeds another step threshold
                if (wheelBuffer >= WHEEL_STEP_THRESHOLD) {
                    isCarouselMode = false;
                    wheelBuffer = 0;
                    // let browser handle leftover by scrolling by a fraction of original event (best-effort)
                    window.scrollBy(0, e.deltaY);
                }
            }
            // done
            return;
        } else {
            // at last slide: exit carousel and allow normal page scroll
            isCarouselMode = false;
            wheelBuffer = 0;
            window.scrollBy(0, e.deltaY);
            return;
        }
    }

    // UPWARDS: direction === -1
    if (direction === -1) {
        if (currentIndex > 0) {
            currentIndex = Math.max(0, currentIndex - 1);
            updateCarousel();
            wheelBuffer += WHEEL_STEP_THRESHOLD; // subtract one step (since wheelBuffer negative)
            // If we just reached index 0 and buffer still strongly negative -> exit to page scroll
            if (currentIndex === 0) {
                if (Math.abs(wheelBuffer) >= WHEEL_STEP_THRESHOLD) {
                    isCarouselMode = false;
                    wheelBuffer = 0;
                    window.scrollBy(0, e.deltaY);
                }
            }
            return;
        } else {
            // at first slide and scrolling up -> exit carousel and allow page scroll
            isCarouselMode = false;
            wheelBuffer = 0;
            window.scrollBy(0, e.deltaY);
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

// Arrow buttons - preserved behavior using isAnimating
prevBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
        wheelBuffer = 0;

        setTimeout(() => isAnimating = false, 600);
    }
});

nextBtn.addEventListener('click', () => {
    if (window.innerWidth > 768 && !isAnimating) {
        isAnimating = true;
        currentIndex = Math.min(items.length - 1, currentIndex + 1);
        updateCarousel();
        wheelBuffer = 0;

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
    wheelBuffer = 0;
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
