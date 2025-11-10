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
// CAROUSEL VFX
// =======================
const track = document.querySelector('.carousel-track-vfx');
const cards = document.querySelectorAll('.carousel-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentIndex = 1; // Start bei Index 1 (mittleres Element)
const totalCards = cards.length;

function updateCarousel() {
    // Entferne active von allen Cards
    cards.forEach(card => card.classList.remove('active'));
    
    // Füge active zur aktuellen Card hinzu
    cards[currentIndex].classList.add('active');

    // Berechne Offset für Zentrierung
    const cardWidth = 350;
    const gap = 32; // 2rem
    const activeCardWidth = 450;
    
    // Zentriere die aktive Card
    let offset = 0;
    
    if (currentIndex === 0) {
        // offset = (window.innerWidth / 2) - (activeCardWidth / 2);
        offset = (window.innerWidth / 2) - (activeCardWidth / 2);
    } else {
        // Berechne Position basierend auf allen vorherigen Cards
        offset = (window.innerWidth / 2) - (activeCardWidth / 2);
        
        for (let i = 0; i < currentIndex; i++) {
            if (i === currentIndex - 1) {
                offset -= (cardWidth + gap);
            } else {
                offset -= (cardWidth + gap);
            }
        }
        
    }

    track.style.transform = `translateX(${offset}px)`;
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
});

// Auto-play carousel
let autoplayInterval = setInterval(() => {
    // currentIndex = (currentIndex + 1) % totalCards;
    // updateCarousel();
}, 4000);

// Pause autoplay on hover
const carouselWrapper = document.querySelector('.carousel-wrapper');
carouselWrapper.addEventListener('mouseenter', () => {
    // clearInterval(autoplayInterval);
});

carouselWrapper.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
        // currentIndex = (currentIndex + 1) % totalCards;
        // updateCarousel();
    }, 4000);
});

// =======================
// ACTIVE NAV LINK
// =======================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    } else {
        link.classList.remove('active');
    }
});

// =======================
// SMOOTH SCROLL
// =======================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// =======================
// PARALLAX EFFECT ON IMAGES
// =======================
const images = document.querySelectorAll('.image-box img, .single-image img, .branded-image img');

window.addEventListener('scroll', () => {
    images.forEach(img => {
        const rect = img.getBoundingClientRect();
        const scrolled = window.scrollY;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            const yPos = (rect.top - window.innerHeight) * 0.1;
            img.style.transform = `translateY(${yPos}px)`;
        }
    });
});

// =======================
// INITIALIZE
// =======================
updateCarousel();

// Add stagger effect to animated boxes
animatedBoxes.forEach((box, index) => {
    box.style.transitionDelay = `${index * 0.1}s`;
});