let isScrolling = false;
let scrollTimeout;

function scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Navigation click handler
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        scrollToSection(target);
    });
});

// Scroll detection
window.addEventListener('wheel', handleScroll, { passive: false });
window.addEventListener('touchmove', handleScroll, { passive: false });

function handleScroll(e) {
    if (isScrolling) return;
    isScrolling = true;
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        isScrolling = false;
    }, 800);

    const delta = Math.sign(e.deltaY || e.touches?.[0].clientY);
    const sections = Array.from(document.querySelectorAll('.card'));
    const currentIndex = sections.findIndex(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= window.innerHeight/2 && rect.bottom >= window.innerHeight/2;
    });

    let targetIndex = currentIndex + Math.sign(delta);
    targetIndex = Math.max(0, Math.min(targetIndex, sections.length - 1));

    if(targetIndex !== currentIndex) {
        scrollToSection(`#${sections[targetIndex].id}`);
    }
}

// Intersection Observer for active nav
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
}, { threshold: 0.5 });

document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
});

// Initialize first active link
window.addEventListener('load', () => {
    document.querySelector('.main-nav a[href="#profile"]').classList.add('active');
});