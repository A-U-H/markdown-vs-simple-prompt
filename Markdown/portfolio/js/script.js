/**
 * Portfolio Website JavaScript
 * Handles navigation, animations, and form validation
 */

// ==================== DOM Elements ====================
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.querySelector('.nav__menu');
const navLinks = document.querySelectorAll('.nav__link');
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// ==================== Mobile Navigation ====================
/**
 * Toggle mobile navigation menu
 */
function toggleMobileMenu() {
    navMenu.classList.toggle('nav__menu--active');
    
    // Animate hamburger icon
    const bars = navToggle.querySelectorAll('.nav__toggle-bar');
    bars.forEach((bar, index) => {
        bar.style.transform = navMenu.classList.contains('nav__menu--active')
            ? index === 0
                ? 'rotate(45deg) translate(5px, 5px)'
                : index === 1
                ? 'opacity: 0'
                : 'rotate(-45deg) translate(7px, -6px)'
            : 'none';
    });
}

/**
 * Close mobile menu when clicking on a link
 */
function closeMobileMenu() {
    navMenu.classList.remove('nav__menu--active');
    const bars = navToggle.querySelectorAll('.nav__toggle-bar');
    bars.forEach(bar => {
        bar.style.transform = 'none';
    });
}

// Event listeners for mobile navigation
navToggle.addEventListener('click', toggleMobileMenu);
navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeMobileMenu();
    }
});

// ==================== Smooth Scrolling ====================
/**
 * Smooth scroll to target section
 * @param {Event} e - Click event
 */
function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        const navHeight = document.querySelector('.nav').offsetHeight;
        const targetPosition = targetSection.offsetTop - navHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Add smooth scroll to all navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', smoothScroll);
});

// ==================== Scroll Animations ====================
/**
 * Create intersection observer for fade-in animations
 */
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            // Optional: Stop observing after animation
            // fadeInObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

/**
 * Apply fade-in class to sections
 */
function initScrollAnimations() {
    // Add fade-in class to sections
    const sections = document.querySelectorAll('.about, .skills, .projects, .contact');
    sections.forEach(section => {
        section.classList.add('fade-in');
        fadeInObserver.observe(section);
    });
    
    // Add fade-in to project cards with stagger
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        fadeInObserver.observe(card);
    });
    
    // Add fade-in to skill categories with stagger
    const skillCategories = document.querySelectorAll('.skills__category');
    skillCategories.forEach((category, index) => {
        category.classList.add('fade-in');
        category.style.transitionDelay = `${index * 0.1}s`;
        fadeInObserver.observe(category);
    });
}

// ==================== Form Validation ====================
/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show error message for a form field
 * @param {string} fieldId - ID of the field
 * @param {string} message - Error message to display
 */
function showError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        inputElement.style.borderColor = '#ef4444';
    }
}

/**
 * Clear error message for a form field
 * @param {string} fieldId - ID of the field
 */
function clearError(fieldId) {
    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = document.getElementById(fieldId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = '';
        inputElement.style.borderColor = '';
    }
}

/**
 * Validate the contact form
 * @returns {boolean} - True if form is valid
 */
function validateForm() {
    let isValid = true;
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Clear previous errors
    clearError('name');
    clearError('email');
    clearError('message');
    
    // Validate name
    if (!name) {
        showError('name', 'Please enter your name');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Validate email
    if (!email) {
        showError('email', 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message
    if (!message) {
        showError('message', 'Please enter your message');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (validateForm()) {
        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            message: document.getElementById('message').value.trim()
        };
        
        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted:', formData);
        
        // Show success message
        successMessage.classList.add('contact__success--active');
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('contact__success--active');
        }, 5000);
    }
}

// Add form submit event listener
if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
}

// Real-time validation on input blur
document.querySelectorAll('.form-group__input, .form-group__textarea').forEach(input => {
    input.addEventListener('blur', function() {
        const fieldId = this.id;
        const value = this.value.trim();
        
        clearError(fieldId);
        
        if (fieldId === 'name' && value && value.length < 2) {
            showError('name', 'Name must be at least 2 characters');
        } else if (fieldId === 'email' && value && !isValidEmail(value)) {
            showError('email', 'Please enter a valid email address');
        } else if (fieldId === 'message' && value && value.length < 10) {
            showError('message', 'Message must be at least 10 characters');
        }
    });
    
    // Clear error on focus
    input.addEventListener('focus', function() {
        clearError(this.id);
    });
});

// ==================== Navbar Scroll Effect ====================
/**
 * Add background to navbar on scroll
 */
function handleNavbarScroll() {
    const nav = document.querySelector('.nav');
    
    if (window.scrollY > 50) {
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.backgroundColor = 'var(--color-white)';
        nav.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
    }
}

window.addEventListener('scroll', handleNavbarScroll);

// ==================== Active Navigation Link ====================
/**
 * Update active navigation link based on scroll position
 */
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navHeight = document.querySelector('.nav').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const targetId = `#${section.id}`;
            
            navLinks.forEach(link => {
                link.classList.remove('nav__link--active');
                if (link.getAttribute('href') === targetId) {
                    link.classList.add('nav__link--active');
                }
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ==================== Typing Effect (Optional) ====================
/**
 * Create a typing effect for the hero subtitle
 */
function initTypingEffect() {
    const subtitle = document.querySelector('.hero__subtitle');
    if (!subtitle) return;
    
    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.opacity = '1';
    
    let index = 0;
    
    function typeChar() {
        if (index < text.length) {
            subtitle.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, 50);
        }
    }
    
    // Start typing after hero animation
    setTimeout(typeChar, 1000);
}

// ==================== Initialize ====================
/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    handleNavbarScroll();
    updateActiveNavLink();
    // Uncomment to enable typing effect
    // initTypingEffect();
});

// ==================== Utility Functions ====================
/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events for better performance
window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
