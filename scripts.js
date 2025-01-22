let currentPosition = 0;
let isAnimating = false;
let touchStartY = 0;
let lastScrollTime = 0;
const SCROLL_COOLDOWN = 800; // Time between scrolls (in milliseconds)
const sections = Array.from(document.querySelectorAll('.card'));

// Initialize sections position
function initializeSections() {
    sections.forEach((section, index) => {
        section.style.transform = `translateY(${index * 100}%)`;
    });
}

// Smooth scroll animation
function smoothScroll(direction) {
    const now = Date.now();
    if (isAnimating || (now - lastScrollTime < SCROLL_COOLDOWN)) return;
    
    const newPosition = currentPosition + direction;
    if (newPosition < 0 || newPosition >= sections.length) return;
    
    isAnimating = true;
    lastScrollTime = now;
    currentPosition = newPosition;
    
    sections.forEach((section, index) => {
        section.style.transform = `translateY(${(index - currentPosition) * 100}%)`;
    });
    
    // Update active nav after animation
    setTimeout(() => {
        document.querySelectorAll('.main-nav a').forEach(link => 
            link.classList.remove('active')
        );
        document.querySelector(`a[href="#${sections[currentPosition].id}"]`)
            .classList.add('active');
        isAnimating = false;
    }, SCROLL_COOLDOWN);
}

// Debounced wheel handler
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(wheelTimeout);
    wheelTimeout = setTimeout(() => {
        const direction = Math.sign(e.deltaY);
        smoothScroll(direction);
    }, 100); // Debounce time (100ms)
}, { passive: false });

// Touch handlers
window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const touchEndY = e.touches[0].clientY;
    const direction = Math.sign(touchStartY - touchEndY);
    touchStartY = touchEndY;
    smoothScroll(direction);
}, { passive: false });

// Navigation click handler
document.querySelectorAll('.main-nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetIndex = sections.findIndex(
            s => s.id === this.getAttribute('href').slice(1)
        );
        const direction = targetIndex - currentPosition;
        
        if (direction !== 0) {
            currentPosition = targetIndex - 1;
            smoothScroll(1 * Math.sign(direction));
        }
    });
});

// Initialize
initializeSections();
document.querySelector('.main-nav a[href="#profile"]').classList.add('active');