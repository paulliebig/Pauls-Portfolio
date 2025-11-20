// =======================
// PARALLAX EFFECT (Optional - auskommentiert)
// =======================
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');

// Mouse Movement Parallax (auskommentiert)
/*document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    updateParallax();
});*/

// Scroll Parallax (auskommentiert)
/*window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    updateParallax();
});

function updateParallax() {
    // Layer 2 scrollt direkt mit - ist der Haupthintergrund
    const scrollFactor = scrollY * 0.8; // Scrollt fast 1:1 mit
    
    layer2.style.transform = `translateY(${-scrollFactor}px)`;}*/
    
    // Layer 1 bleibt statisch und füllt Lücken
    // Optional: Leichte Mausbewegung für Layer 1
    const mouseFactor = 15;
    layer1.style.transform = `
        translateX(${mouseX * mouseFactor * 0.3}px)
        translateY(${mouseY * mouseFactor * 0.3}px)
    `;


// =======================
// INTERSECTION OBSERVER FOR PROJECT BOXES
// =======================
const projectBoxes = document.querySelectorAll('.project-info');
console.log(projectBoxes);

// Verschiedene Options für Desktop und Mobile
const isMobile = window.innerWidth <= 768;

const options = {
    rootMargin: isMobile ? "-50px 0px -50px 0px" : "-200px 0px -200px 0px",
    threshold: isMobile ? 0.3 : 0.5,
};

function callback(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('invisible');
        } else { 
            entry.target.classList.add('invisible');
        }
    });
}

const observer = new IntersectionObserver(callback, options);

document.addEventListener('DOMContentLoaded', () => {
    projectBoxes.forEach((box) => observer.observe(box));
    
    // Höhe des Main-Containers an Bildhöhe anpassen (Mobile)
    if (isMobile) {
        adjustMainHeight();
    }
});

// Funktion um Main-Container-Höhe anzupassen
function adjustMainHeight() {
    const mobileImage = document.querySelector('.mobile-image');
    
    if (mobileImage) {
        // Warte bis Bild geladen ist
        if (mobileImage.complete) {
            setMainHeight(mobileImage);
        } else {
            mobileImage.addEventListener('load', () => {
                setMainHeight(mobileImage);
            });
        }
    }
}

function setMainHeight(img) {
    const main = document.querySelector('main');
    const boxes = document.querySelector('.boxes');
    
    // Setze Höhe basierend auf Bild
    const imgHeight = img.naturalHeight;
    const imgWidth = img.naturalWidth;
    const windowWidth = window.innerWidth;
    
    // Berechne tatsächliche Höhe basierend auf Bildverhältnis
    const actualHeight = (windowWidth / imgWidth) * imgHeight;
    
    main.style.minHeight = `${actualHeight}px`;
    boxes.style.height = `${actualHeight}px`;
}

// Bei Resize neu berechnen
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        adjustMainHeight();
    }
});

// =======================
// INITIALIZE
// =======================
// updateParallax();

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

        // Schließe Menü beim Klick auf Links
        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    }
});