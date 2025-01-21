let isScrolling = false;
let touchStartY = 0;
const SCROLL_COOLDOWN = 600;

// Improved scroll handler
function handleScroll(e) {
    if (isScrolling) return;
    isScrolling = true;
    
    // Handle touch events
    if (e.type === 'touchstart') {
        touchStartY = e.touches[0].clientY;
        return;
    }
    
    const delta = e.type === 'wheel' 
        ? Math.sign(e.deltaY)
        : Math.sign(touchStartY - e.touches[0].clientY);

    processScroll(delta);
    setTimeout(() => isScrolling = false, SCROLL_COOLDOWN);
}

// Precise section calculation
function processScroll(delta) {
    const sections = Array.from(document.querySelectorAll('.card'));
    const scrollPos = window.scrollY || window.pageYOffset;
    const currentIndex = Math.round(scrollPos / window.innerHeight);
    
    let targetIndex = currentIndex + delta;
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    sections[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Event listeners
window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('touchstart', (e) => touchStartY = e.touches[0].clientY);
window.addEventListener('touchmove', handleScroll, { passive: false });

// Accurate active section detection
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`a[href="#${id}"]`);
        entry.isIntersecting 
            ? link.classList.add('active') 
            : link.classList.remove('active');
    });
}, { 
    threshold: 0.75,
    rootMargin: '-70px 0px -25% 0px' // Accounts for nav height
});

document.querySelectorAll('.card').forEach(card => observer.observe(card));

// Navigation click handler
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        document.querySelector(target).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});