// =======================
// PARALLAX EFFECT
// =======================
let mouseX = 0;
let mouseY = 0;
let scrollY = 0;

const layer1 = document.getElementById('layer1');
const layer2 = document.getElementById('layer2');

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
});

function updateParallax() {
    const scrollFactor = scrollY * 0.1;
    const mouseFactor = 20;

    // Layer 1 - Background
    layer1.style.transform = `
        translate(-50%, -50%)
        translateY(${-scrollFactor * 0.3}px)
        translateX(${mouseX * mouseFactor * 0.5}px)
        translateY(${mouseY * mouseFactor * 0.5}px)
    `;

   
}

// =======================
// PROJECT DATA
// =======================
const projects = [
    {
        category: "3D Animation",
        title: "The Crown's Escape",
        description: "Ein 3D-animierter Kurzfilm über ein kleines Skelett, dass versucht die Krone des bösen Königs zu stehlen. Der Film kombiniert humorvolle Elemente mit spannender Action. Er enstand zu Beginn meines Studiums und zeigt meine frühen Fähigkeiten in 3D-Modellierung, Animation und Storytelling.",
        image: "./Media/gallery thumbnails/crwons_escape_tn.jpg",
        videoId: "yeLx_LZbCbM" // Ersetze mit deiner YouTube Video ID
    },
    {
        category: "Platzhalter",
        title: "Projekt 2",
        description: "Platz für Zukunftige Projekte.",
        image: "./Media/projects/project2.jpg",
        videoId: "dQw4w9WgXcQ" // Ersetze mit deiner YouTube Video ID
    },
    {
        category: "Platzhalter",
        title: "Projekt 3",
        description: "Platz für Zukunftige Projekte.",
        image: "./Media/projects/project3.jpg",
        videoId: "dQw4w9WgXcQ" // Ersetze mit deiner YouTube Video ID
    },
    {
        category: "Platzhalter",
        title: "Projekt 4",
        description: "Platz für Zukunftige Projekte.",
        image: "./Media/projects/project4.jpg",
        videoId: "dQw4w9WgXcQ" // Ersetze mit deiner YouTube Video ID
    },
    {
        category: "Platzhalter",
        title: "Projekt 5",
        description: "Platz für Zukunftige Projekte.",
        image: "./Media/projects/project5.jpg",
        videoId: "dQw4w9WgXcQ" // Ersetze mit deiner YouTube Video ID
    },
    {
        category: "Platzhalter",
        title: "Projekt 6",
        description: "Platz für Zukunftige Projekte.",
        image: "./Media/projects/project6.jpg",
        videoId: "dQw4w9WgXcQ" // Ersetze mit deiner YouTube Video ID
    }
];

// =======================
// LIGHTBOX
// =======================
let currentLightbox = null;

function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Schließen"></button>
            <div class="lightbox-video">
                <iframe src="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="lightbox-text">
                <div class="lightbox-category"></div>
                <h2 class="lightbox-title"></h2>
                <p class="lightbox-description"></p>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);
    return lightbox;
}

function openLightbox(project) {
    if (!currentLightbox) {
        currentLightbox = createLightbox();
        
        // Close button
        const closeBtn = currentLightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', closeLightbox);
        
        // Close on background click
        currentLightbox.addEventListener('click', (e) => {
            if (e.target === currentLightbox) {
                closeLightbox();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && currentLightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    }
    
    // Update content
    const iframe = currentLightbox.querySelector('iframe');
    const category = currentLightbox.querySelector('.lightbox-category');
    const title = currentLightbox.querySelector('.lightbox-title');
    const description = currentLightbox.querySelector('.lightbox-description');
    
    iframe.src = `https://www.youtube.com/embed/${project.videoId}?autoplay=1`;
    category.textContent = project.category;
    title.textContent = project.title;
    description.textContent = project.description;
    
    // Show lightbox
    setTimeout(() => {
        currentLightbox.classList.add('active');
    }, 10);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    if (!currentLightbox) return;
    
    currentLightbox.classList.remove('active');
    
    // Stop video
    const iframe = currentLightbox.querySelector('iframe');
    iframe.src = '';
    
    // Re-enable body scroll
    document.body.style.overflow = '';
}

// =======================
// RENDER PROJECTS
// =======================
const workGrid = document.querySelector('.work-grid');

function renderProjects() {
    workGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22225%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22225%22/%3E%3Ctext fill=%22%23999%22 font-family=%22Arial%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EProject Image%3C/text%3E%3C/svg%3E'">
            </div>
            <div class="project-info">
                <div class="project-category">${project.category}</div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
            </div>
        `;
        
        // Add click event
        card.addEventListener('click', () => {
            openLightbox(project);
        });
        
        workGrid.appendChild(card);
    });
}

// =======================
// INITIALIZE
// =======================
updateParallax();
renderProjects();

// Resize Handler
window.addEventListener('resize', updateParallax);

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