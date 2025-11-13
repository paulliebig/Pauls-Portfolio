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

    // Layer 2 - Video
    layer2.style.transform = `
        translate(-50%, -50%)
        translateY(${-scrollFactor * 0.6}px)
        translateX(${mouseX * mouseFactor}px)
        translateY(${mouseY * mouseFactor}px)
    `;
}

// =======================
// PROJECT DATA
// =======================
const projects = [
    {
        category: "VFX",
        title: "Project Alpha",
        description: "Visual effects for a commercial campaign featuring particle simulations.",
        image: "./Media/projects/project1.jpg"
    },
    {
        category: "3D Animation",
        title: "Character Design",
        description: "Fully rigged 3D character with realistic textures and animations.",
        image: "./Media/projects/project2.jpg"
    },
    {
        category: "Motion Design",
        title: "Brand Identity",
        description: "Animated logo and brand elements for a tech startup.",
        image: "./Media/projects/project3.jpg"
    },
    {
        category: "3D Visualization",
        title: "Architectural Render",
        description: "Photorealistic architectural visualization for real estate.",
        image: "./Media/projects/project4.jpg"
    },
    {
        category: "VFX",
        title: "Explosion Simulation",
        description: "High-quality explosion effects with dynamic lighting.",
        image: "./Media/projects/project5.jpg"
    },
    {
        category: "Motion Design",
        title: "Music Video",
        description: "Abstract motion graphics synchronized with music.",
        image: "./Media/projects/project6.jpg"
    }
];

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

// Am Ende von gallery.js hinzufügen:

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