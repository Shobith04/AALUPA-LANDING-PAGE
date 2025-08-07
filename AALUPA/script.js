// AALUPA Consultants - Modern Interactive Script
// ===============================================

// Utility Functions
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLoading();
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormValidation();
    initializeScrollToTop();
    initializeSmoothScrolling();
    initializeParallaxEffects();
    initializeTypewriter();
    initializeCounters();
    initializeIntersectionObserver();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Navigation
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const header = document.querySelector('header');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking on nav links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const scrollHandler = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove shadow and background on scroll
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--white)';
            header.style.backdropFilter = 'none';
        }
        
        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100);
    
    window.addEventListener('scroll', scrollHandler);
}

// Scroll Animations
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered animation for service cards
                if (entry.target.classList.contains('service-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    // Real-time validation
    nameInput.addEventListener('input', () => validateField(nameInput, 'nameError'));
    emailInput.addEventListener('input', () => validateField(emailInput, 'emailError'));
    messageInput.addEventListener('input', () => validateField(messageInput, 'messageError'));
    
    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const isValid = validateForm();
        
        if (isValid) {
            submitForm();
        }
    });
    
    function validateField(field, errorId) {
        const errorElement = document.getElementById(errorId);
        let isValid = true;
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
        } else {
            isValid = field.value.trim().length > 0;
        }
        
        if (isValid) {
            field.style.borderColor = 'var(--accent-green)';
            errorElement.style.display = 'none';
        } else {
            field.style.borderColor = '#ef4444';
            errorElement.style.display = 'block';
        }
        
        return isValid;
    }
    
    function validateForm() {
        const nameValid = validateField(nameInput, 'nameError');
        const emailValid = validateField(emailInput, 'emailError');
        const messageValid = validateField(messageInput, 'messageError');
        
        return nameValid && emailValid && messageValid;
    }
    
    function submitForm() {
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Simulate form submission
        setTimeout(() => {
            // Success state
            submitBtn.style.background = 'var(--accent-green)';
            submitBtn.textContent = 'Message Sent!';
            
            // Show success message
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            
            // Reset form
            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'var(--primary-blue)';
                
                // Reset field borders
                [nameInput, emailInput, messageInput].forEach(field => {
                    field.style.borderColor = '#e2e8f0';
                });
            }, 2000);
        }, 1500);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--accent-green)' : 'var(--primary-blue)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
    
    // Auto close
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
}

function closeNotification(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Top Button
function initializeScrollToTop() {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: var(--shadow);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide on scroll
    window.addEventListener('scroll', throttle(() => {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'scale(1.1)';
        scrollToTopBtn.style.background = 'var(--dark-blue)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'scale(1)';
        scrollToTopBtn.style.background = 'var(--primary-blue)';
    });
}

// Parallax Effects
function initializeParallaxEffects() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        }
    }, 16));
}

// Typewriter Effect
function initializeTypewriter() {
    const typewriterElement = document.querySelector('.hero p');
    const text = typewriterElement.textContent;
    const speed = 50;
    
    typewriterElement.textContent = '';
    
    setTimeout(() => {
        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                typewriterElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
            }
        }, speed);
    }, 1500);
}

// Counters Animation
function initializeCounters() {
    const counters = [
        { element: null, target: 500, suffix: '+', label: 'Clients Served' },
        { element: null, target: 50, suffix: 'K+', label: 'Transactions Processed' },
        { element: null, target: 99, suffix: '%', label: 'Client Satisfaction' }
    ];
    
    // Create counter elements dynamically
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const counterContainer = document.createElement('div');
        counterContainer.className = 'counters-container';
        counterContainer.style.cssText = `
            display: flex;
            justify-content: space-around;
            margin-top: 3rem;
            flex-wrap: wrap;
            gap: 2rem;
        `;
        
        counters.forEach((counter, index) => {
            const counterElement = document.createElement('div');
            counterElement.className = 'counter animate-on-scroll';
            counterElement.style.cssText = `
                text-align: center;
                padding: 1rem;
                background: var(--white);
                border-radius: 15px;
                box-shadow: var(--shadow);
                min-width: 150px;
            `;
            
            counterElement.innerHTML = `
                <div class="counter-number" style="font-size: 2rem; font-weight: 700; color: var(--primary-blue);">0</div>
                <div class="counter-label" style="color: var(--medium-grey); font-size: 0.9rem;">${counter.label}</div>
            `;
            
            counter.element = counterElement.querySelector('.counter-number');
            counterContainer.appendChild(counterElement);
        });
        
        aboutSection.querySelector('.container').appendChild(counterContainer);
        
        // Animate counters when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counterContainer);
    }
    
    function animateCounters() {
        counters.forEach(counter => {
            let current = 0;
            const increment = counter.target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= counter.target) {
                    current = counter.target;
                    clearInterval(timer);
                }
                counter.element.textContent = Math.floor(current) + counter.suffix;
            }, 20);
        });
    }
}

// Intersection Observer for Enhanced Animations
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add specific animations based on element type
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
                
                if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.style.animation = 'fadeInScale 0.8s ease forwards';
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Add custom animations to CSS dynamically
const customAnimations = `
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeInScale {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
    }
    
    .notification-icon {
        font-weight: bold;
        font-size: 16px;
    }
    
    body.menu-open {
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .counters-container {
            flex-direction: column;
            align-items: center;
        }
        
        .scroll-to-top {
            bottom: 20px !important;
            right: 20px !important;
        }
    }
`;

// Add animations to head
const style = document.createElement('style');
style.textContent = customAnimations;
document.head.appendChild(style);

// Performance optimization
window.addEventListener('load', () => {
    // Preload images
    const images = ['hero-bg.jpg', 'about-bg.jpg'];
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        
        if (navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

// Focus management for better accessibility
document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid var(--primary-blue)';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

console.log('🚀 AALUPA Consultants - Modern Interactive Script Loaded Successfully!');