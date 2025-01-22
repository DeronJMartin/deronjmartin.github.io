let currentPosition = 0;
let isAnimating = false;
let touchStartY = 0;
const sections = Array.from(document.querySelectorAll('.card'));

// Initialize sections position
function initializeSections() {
    sections.forEach((section, index) => {
        section.style.transform = `translateY(${index * 100}%)`;
    });
}

// Smooth scroll animation
function smoothScroll(direction) {
    if (isAnimating) return;
    
    const newPosition = currentPosition + direction;
    if (newPosition < 0 || newPosition >= sections.length) return;
    
    isAnimating = true;
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
    }, 600); // Matches CSS transition duration
}

// Trackpad/wheel handler
let isScrolling = false;
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling) return;
    
    const direction = Math.sign(e.deltaY);
    smoothScroll(direction);
    
    // Lock scroll during animation
    isScrolling = true;
    setTimeout(() => {
        isScrolling = false;
    }, 600); // Matches CSS transition duration
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