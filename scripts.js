let isScrolling = false;
let lastScrollTime = 0;

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

// Discrete scroll handler
function handleScroll(e) {
    const now = Date.now();
    if (isScrolling || (now - lastScrollTime < 800)) return;
    
    isScrolling = true;
    lastScrollTime = now;
    
    const delta = Math.sign(e.deltaY || (e.touches ? e.touches[0].clientY : 0));
    const sections = Array.from(document.querySelectorAll('.card'));
    const currentIndex = sections.findIndex(section => 
        section.getBoundingClientRect().top <= window.innerHeight/2
    );

    let targetIndex = currentIndex + delta;
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));
    
    sections[targetIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    setTimeout(() => {
        isScrolling = false;
    }, 1000);
}

// Event listeners
window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('touchmove', handleScroll, { passive: false });

// Active section detection
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const id = entry.target.id;
        const link = document.querySelector(`a[href="#${id}"]`);
        if(entry.isIntersecting) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}, { 
    threshold: 0.5,
    rootMargin: '0px 0px -50% 0px'
});

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Initialize
window.addEventListener('load', () => {
    document.querySelector('.main-nav a[href="#profile"]').classList.add('active');
});