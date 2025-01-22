let isScrolling = false;
let touchStartY = 0;

function getCurrentSection() {
    const sections = Array.from(document.querySelectorAll('.card'));
    let closestSection = null;
    let closestDistance = Infinity;
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        
        if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
        }
    });
    
    return closestSection;
}

function scrollToSection(direction) {
    if (isScrolling) return;
    isScrolling = true;
    
    const sections = Array.from(document.querySelectorAll('.card'));
    const currentSection = getCurrentSection();
    const currentIndex = sections.indexOf(currentSection);
    
    let targetIndex = currentIndex + direction;
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    sections[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Reset scroll lock after animation completes
    setTimeout(() => {
        isScrolling = false;
    }, 800);
}

// Mouse wheel handler
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const direction = Math.sign(e.deltaY);
    scrollToSection(direction);
}, { passive: false });

// Touch handlers
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchEndY = e.touches[0].clientY;
    const direction = Math.sign(touchStartY - touchEndY);
    scrollToSection(direction);
    touchStartY = touchEndY;
}, { passive: false });

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

// Active section detection
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`a[href="#${id}"]`);
        entry.isIntersecting 
            ? link.classList.add('active') 
            : link.classList.remove('active');
    });
}, { 
    threshold: 0.7,
    rootMargin: '-70px 0px -25% 0px'
});

document.querySelectorAll('.card').forEach(card => observer.observe(card));