// =======================
// SCROLL ANIMATIONS
// =======================
const animatedBoxes = document.querySelectorAll('.animated-box');
const animatedLines = document.querySelectorAll('.animated-line');

function checkVisibility() {
    const triggerBottom = window.innerHeight * 0.8;

    // Animated Boxes
    animatedBoxes.forEach(box => {
        const boxTop = box.getBoundingClientRect().top;
        
        if (boxTop < triggerBottom) {
            box.classList.add('visible');
        }
    });

    // Animated Lines
    animatedLines.forEach(line => {
        const lineTop = line.getBoundingClientRect().top;
        
        if (lineTop < triggerBottom) {
            line.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', checkVisibility);
checkVisibility(); // Initial check

// =======================
// KEEN SLIDER CAROUSEL
// =======================
let slider = null;

function initKeenSlider() {
    const sliderElement = document.getElementById('keen-slider');
    
    if (!sliderElement) return;

    // Initialize Keen Slider
    slider = new KeenSlider(sliderElement, {
        loop: true,
        mode: "snap",
        slides: {
            origin: "center",
            perView: 2.2, // Shows 1 full slide on each side for symmetry
            spacing: 32,
        },
        initial: 0, // Start with first slide
        created: () => {
            updateActiveSlide();
        },
        slideChanged: () => {
            updateActiveSlide();
        },
        breakpoints: {
            "(max-width: 1024px)": {
                slides: {
                    perView: 2,
                    spacing: 24,
                },
            },
            "(max-width: 768px)": {
                slides: {
                    perView: 1.3,
                    spacing: 16,
                },
            },
        },
    });

    // Navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            slider.prev();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            slider.next();
        });
    }
}

// Update active slide styling
function updateActiveSlide() {
    if (!slider) return;

    const slides = document.querySelectorAll('.carousel-card');
    const currentIdx = slider.track.details.rel;

    slides.forEach((slide, idx) => {
        if (idx === currentIdx) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
}

// =======================
// PARALLAX EFFECT ON IMAGES
// =======================
const images = document.querySelectorAll('.image-box img, .single-image img, .branded-image img');

window.addEventListener('scroll', () => {
    images.forEach(img => {
        const rect = img.getBoundingClientRect();
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = (rect.top - window.innerHeight) * 0.1;
            img.style.transform = `translateY(${yPos}px)`;
        }
    });
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

    // Initialize Keen Slider after DOM is loaded
    initKeenSlider();
    
    // Ensure first card is active on initial load
    setTimeout(() => {
        updateActiveSlide();
    }, 100);

    // Add stagger effect to animated boxes
    animatedBoxes.forEach((box, index) => {
        box.style.transitionDelay = `${index * 0.1}s`;
    });
});