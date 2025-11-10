// =======================
// PARALLAX EFFECT
// =======================
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');

// Mouse Movement Parallax
/*ocument.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    updateParallax();
});*/

// Scroll Parallax
/*window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    updateParallax();
});

function updateParallax() {
    // Layer 2 scrollt direkt mit - ist der Haupthintergrund
    const scrollFactor = scrollY * 0.8; // Scrollt fast 1:1 mit
    
    layer2.style.transform = `translateY(${-scrollFactor}px)`;
    
    // Layer 1 bleibt statisch und füllt Lücken
    // Optional: Leichte Mausbewegung für Layer 1
    const mouseFactor = 15;
    layer1.style.transform = `
        translateX(${mouseX * mouseFactor * 0.3}px)
        translateY(${mouseY * mouseFactor * 0.3}px)
    `;
}*/

// =======================
// ACTIVE NAV LINK
// =======================
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
        link.classList.add('active');
    }
});

// =======================
// INTERSECTION OBSERVER FOR PROJECT BOXES
// =======================
const projectBoxes = document.querySelectorAll('.project-info');
console.log(projectBoxes);

const options = {
    rootMargin: "-200px 0px -200px 0px",
    threshold: 0.5,
};

function callback(entries, observer) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('invisible');
            //entry.target.classList.remove('invisible_left');
            //Bentry.target.classList.remove('invisible_right');
        } else { 
            entry.target.classList.add('invisible');
        }
        });
}

const observer = new IntersectionObserver(callback, options);
document.addEventListener('DOMContentLoaded', () => {
    projectBoxes.forEach((box) => observer.observe(box));
});
// =======================
// INITIALIZE
// =======================
// updateParallax();