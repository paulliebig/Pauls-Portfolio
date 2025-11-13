// =======================
// ALLES INNERHALB VON DOMContentLoaded
// =======================
document.addEventListener('DOMContentLoaded', () => {
    
    // =======================
    // ACTIVE NAV LINK
    // =======================
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === currentPage);
    });

    // =======================
    // SMOOTH SCROLL
    // =======================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // =======================
    // BURGER MENU TOGGLE
    // =======================
    const burger = document.querySelector('.burger');
    const navbar = document.querySelector('.navbar');

    console.log('Burger:', burger);
    console.log('Navbar:', navbar);

    if (burger && navbar) {
        burger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Burger clicked!');
            
            burger.classList.toggle('active');
            navbar.classList.toggle('active');
            
            console.log('Burger active:', burger.classList.contains('active'));
            console.log('Navbar active:', navbar.classList.contains('active'));
        });

        // Menü schließt beim Klick auf einen Link
        navbar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navbar.classList.remove('active');
            });
        });
    } else {
        console.error('Burger oder Navbar nicht gefunden!');
    }
});