// Utility function for debouncing
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

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const navbar = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const skillItems = document.querySelectorAll('.skills li');
    const socialIcons = document.querySelectorAll('.social-icon');
    const nameElement = document.querySelector('.animated-name');

    // Navbar Animation State
    let lastScrollTop = 0;
    let isNavbarVisible = true;

    // Advanced Navbar Scroll Animation
    const handleNavbarScroll = () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // Determine scroll direction
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            // Scrolling down - hide navbar
            if (isNavbarVisible) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
                isNavbarVisible = false;
            }
        } else {
            // Scrolling up - show navbar
            if (!isNavbarVisible) {
                navbar.style.transform = 'translateY(0)';
                navbar.style.opacity = '1';
                isNavbarVisible = true;
            }
        }

        // Update navbar style based on scroll position
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(8, 27, 41, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            navbar.style.height = '60px';
            navbar.style.padding = '10px 50px';
        } else {
            navbar.style.background = 'rgba(8, 27, 41, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            navbar.style.height = '70px';
            navbar.style.padding = '20px 50px';
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    // Enhanced Hamburger Animation
    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('active');
        
        // Animate nav links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    };

    // Navbar Hover Effects
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
            link.style.color = '#f33757';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
            link.style.color = '#ffffff';
        });
    });

    // Active Section Highlight
    const highlightActiveSection = () => {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === currentSection) {
                link.classList.add('active');
            }
        });
    };

    // Enhanced Smooth Scroll
    const smoothScroll = (target, duration) => {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - 70;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        const animation = currentTime => {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        // Easing function
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };

        requestAnimationFrame(animation);
    };

    // Skills Animation
    const animateSkills = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                    }, index * 100);
                });
            }
        });
    };

    // Enhanced Typing Animation
    const startTypingAnimation = () => {
        if (!nameElement) return;
        
        const text = nameElement.textContent;
        nameElement.textContent = '';
        let index = 0;

        const type = () => {
            if (index < text.length) {
                nameElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, Math.random() * 100 + 50); // Random delay for more natural effect
            }
        };

        setTimeout(type, 500);
    };

    // Section Fade Animation
    const fadeInSection = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    };

    // Enhanced Social Icons Animation
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-10px) scale(1.1)';
            icon.querySelector('i').style.transform = 'scale(1.2) rotate(360deg)';
        });

        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.querySelector('i').style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Event Listeners
    hamburger?.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    window.addEventListener('scroll', debounce(highlightActiveSection, 100));

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            smoothScroll(targetSection, 1000);
            if (nav.classList.contains('active')) toggleMenu();
        });
    });

    // Observers
    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    const sectionObserver = new IntersectionObserver(fadeInSection, {
        threshold: 0.1,
        rootMargin: '-50px'
    });

    // Initialize Animations
    skillItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px) scale(0.9)';
        item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        sectionObserver.observe(section);
    });

    if (document.querySelector('#skills')) {
        skillsObserver.observe(document.querySelector('#skills'));
    }

    // Initialize animations
    startTypingAnimation();
    navbar.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
});

// Add required CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .nav {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    nav a.active {
        color: #f33757;
        position: relative;
    }

    nav a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: #f33757;
    }

    .social-icon i {
        transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);