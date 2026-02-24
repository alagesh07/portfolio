// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ============================================
// THEME TOGGLE (Dark/Light Mode)
// ============================================
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add animation effect
    themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

console.log('🌓 Theme toggle activated!');

// Smooth Scrolling with custom easing
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition - 80; // 80px offset for navbar
            const duration = 1200; // milliseconds
            let start = null;
            
            // Easing function for smooth animation
            function easeInOutCubic(t) {
                return t < 0.5 
                    ? 4 * t * t * t 
                    : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
            function animation(currentTime) {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        }
    });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thanks for reaching out! This is a demo form. Connect it to a backend service to make it functional.');
        contactForm.reset();
    });
}

// Navbar background on scroll (throttled for performance)
const navbar = document.querySelector('.navbar');
let ticking = false;
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.scrollY;
            
            // Add scrolled class for background
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide navbar on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        });
        ticking = true;
    }
});

// ============================================
// SCROLL-BASED REVEAL - Show only when in viewport
// ============================================

// Initialize animation classes on page load
function initializeAnimations() {
    const animationGroups = [
        { selector: '.section-title', animation: 'fade-in' },
        { selector: '.about-text', animation: 'slide-left' },
        { selector: '.info-list', animation: 'slide-up' },
        { selector: '.resume-content', animation: 'fade-zoom' },
        { selector: '.resume-section', animation: 'slide-up' },
        { selector: '.skill-category', animation: 'scale-up' },
        { selector: '.skill-badge', animation: 'fade-in' },
        { selector: '.project-card', animation: 'slide-right' },
        { selector: '.contact-content', animation: 'fade-in' },
        { selector: '.hero-buttons', animation: 'slide-up' },
        { selector: '.hero-social', animation: 'scale-up' },
        { selector: '.hero h1', animation: 'fade-in' },
        { selector: '.hero .subtitle', animation: 'slide-left' },
        { selector: '.hero .description', animation: 'slide-left' },
        { selector: '.profile-section', animation: 'fade-zoom' },
        { selector: 'footer', animation: 'fade-in' }
    ];
    
    animationGroups.forEach(group => {
        const elements = document.querySelectorAll(group.selector);
        elements.forEach(element => {
            element.classList.add(group.animation);
        });
    });
}

function updateElementsVisibility() {
    const windowHeight = window.innerHeight;
    
    // Simplified - only animate main containers, not individual items
    const animationGroups = [
        { selector: '.section-title', stagger: false },
        { selector: '.about-text', stagger: false },
        { selector: '.info-list', stagger: false },
        { selector: '.resume-content', stagger: false },
        { selector: '.resume-section', stagger: true, delay: 0.15 },
        { selector: '.skill-category', stagger: true, delay: 0.2 },
        { selector: '.skill-badge', stagger: true, delay: 0.05 },
        { selector: '.project-card', stagger: true, delay: 0.2 },
        { selector: '.contact-content', stagger: false },
        { selector: '.hero-buttons', stagger: false },
        { selector: '.hero-social', stagger: false },
        { selector: '.hero h1', stagger: false },
        { selector: '.hero .subtitle', stagger: false },
        { selector: '.hero .description', stagger: false },
        { selector: '.profile-section', stagger: false },
        { selector: 'footer', stagger: false }
    ];
    
    animationGroups.forEach(group => {
        const elements = document.querySelectorAll(group.selector);
        
        elements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementBottom = rect.bottom;
            
            // More lenient margins - elements stay visible longer
            const appearMargin = 150; // When to appear
            const disappearMargin = -100; // When to disappear (negative = allow more scroll past)
            
            // Element appears when entering viewport
            const shouldAppear = (elementTop < windowHeight - appearMargin) && (elementBottom > 0);
            
            // Element disappears only when completely out of view
            const shouldDisappear = (elementTop > windowHeight + disappearMargin) || (elementBottom < disappearMargin);
            
            // Only update if state needs to change
            const hasVisible = element.classList.contains('visible');
            
            if (shouldAppear && !hasVisible) {
                // Add stagger delay if specified
                if (group.stagger && group.delay) {
                    element.style.transitionDelay = `${index * group.delay}s`;
                }
                element.classList.add('visible');
            } else if (shouldDisappear && hasVisible) {
                element.classList.remove('visible');
                // Reset delay when hiding
                if (group.stagger) {
                    element.style.transitionDelay = '0s';
                }
            }
        });
    });
}

// ============================================
// HERO SECTION SCROLL PARALLAX EFFECT
// ============================================
function heroScrollEffect() {
    const heroText = document.querySelector('.hero-text');
    const profileSection = document.querySelector('.profile-section');
    const scrolled = window.scrollY;
    
    if (heroText && profileSection && scrolled < window.innerHeight) {
        // Parallax effect - text moves slower than scroll
        heroText.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroText.style.opacity = 1 - (scrolled / 600);
        
        // Image moves in opposite direction
        profileSection.style.transform = `translateY(${scrolled * -0.3}px) scale(${1 - scrolled / 2000})`;
        profileSection.style.opacity = 1 - (scrolled / 600);
    }
}

// Run on scroll with throttling - optimized for performance
let isScrolling = false;
let scrollTimeout;
let lastKnownScrollPosition = 0;
let ticking2 = false;

window.addEventListener('scroll', () => {
    lastKnownScrollPosition = window.scrollY;
    
    if (!ticking2) {
        window.requestAnimationFrame(() => {
            updateElementsVisibility();
            heroScrollEffect();
            ticking2 = false;
        });
        ticking2 = true;
    }
}, { passive: true });

// Run on load and resize
window.addEventListener('load', () => {
    initializeAnimations();
    updateElementsVisibility();
    heroScrollEffect();
});
window.addEventListener('resize', () => {
    updateElementsVisibility();
    heroScrollEffect();
});

// Initial call
setTimeout(() => {
    initializeAnimations();
    updateElementsVisibility();
    heroScrollEffect();
}, 100);

console.log('🎯 Scroll reveal effect activated!');

// ============================================
// ENHANCED SCROLL ANIMATIONS - Removed (using dynamic reveal instead)
// ============================================
// Animation classes are now handled by the scroll reveal function above

// ============================================
// SCROLL PROGRESS INDICATOR (Optimized)
// ============================================
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

let progressTicking = false;

window.addEventListener('scroll', () => {
    if (!progressTicking) {
        window.requestAnimationFrame(() => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = scrolled + '%';
            progressTicking = false;
        });
        progressTicking = true;
    }
});

// ============================================
// SIMPLE HOVER EFFECTS (No heavy animations)
// ============================================
document.querySelectorAll('.skill-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// ============================================
// TYPING EFFECT FOR SUBTITLE (Optional)
// ============================================
const subtitle = document.querySelector('.subtitle');
if (subtitle) {
    const text = subtitle.textContent;
    subtitle.textContent = '';
    let index = 0;
    
    function type() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        }
    }
    
    // Start typing after a delay
    setTimeout(type, 1000);
}

// ============================================
// YEAR UPDATE IN FOOTER
// ============================================
const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

console.log('✨ Portfolio loaded successfully!');

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor = document.createElement('div');
cursor.className = 'cursor';
document.body.appendChild(cursor);

const cursorFollower = document.createElement('div');
cursorFollower.className = 'cursor-follower';
document.body.appendChild(cursorFollower);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Update mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Create cursor trail (throttled)
    if (Math.random() > 0.8) {
        createTrail(e.clientX, e.clientY);
    }
});

// Create cursor trail effect
function createTrail(x, y) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.left = x + 'px';
    trail.style.top = y + 'px';
    document.body.appendChild(trail);
    
    setTimeout(() => {
        trail.remove();
    }, 500);
}

// Animate cursor with smooth following
function animateCursor() {
    // Smooth cursor movement
    cursorX += (mouseX - cursorX) * 0.3;
    cursorY += (mouseY - cursorY) * 0.3;
    
    // Smooth follower movement (slower)
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Expand cursor on hover over interactive elements
const interactiveElements = document.querySelectorAll('a, button, .btn, .social-icon, .skill-card, .project-card, input, textarea, .hamburger, .skill-tag, .skill-badge');

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('expand');
        cursorFollower.classList.add('expand');
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand');
        cursorFollower.classList.remove('expand');
    });
});

// Click effect
document.addEventListener('mousedown', () => {
    cursor.classList.add('click');
    cursorFollower.classList.add('click');
});

document.addEventListener('mouseup', () => {
    cursor.classList.remove('click');
    cursorFollower.classList.remove('click');
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorFollower.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '0.5';
});

console.log('🎯 Custom cursor activated!');
