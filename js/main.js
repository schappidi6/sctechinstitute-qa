/**
 * SC Technological Institute - Main JavaScript
 * Vanilla JS, no dependencies
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // 1. COMING SOON OVERLAY
  //    Check ?preview=true or sessionStorage to show/hide overlay.
  //    Clicking "Preview Site" button also hides it.
  // ============================================================
  const initComingSoon = () => {
    const overlay = document.querySelector('.coming-soon-overlay');
    if (!overlay) return;

    const params = new URLSearchParams(window.location.search);
    const isPreview = params.get('preview') === 'true';
    const storedPreview = sessionStorage.getItem('scti_preview') === 'true';

    const hideOverlay = () => {
      overlay.style.display = 'none';
      document.body.classList.remove('coming-soon-active');
      sessionStorage.setItem('scti_preview', 'true');
    };

    if (isPreview || storedPreview) {
      hideOverlay();
    } else {
      overlay.style.display = '';
      document.body.classList.add('coming-soon-active');
    }

    // "Preview Site" button inside the overlay
    const previewBtn = overlay.querySelector('.preview-btn, [data-preview]');
    if (previewBtn) {
      previewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        hideOverlay();
      });
    }
  };

  initComingSoon();

  // ============================================================
  // 2. NAVIGATION SCROLL EFFECT
  //    Add 'scrolled' class to .navbar when scrollY > 50
  // ============================================================
  const initNavScroll = () => {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  initNavScroll();

  // ============================================================
  // 3. MOBILE HAMBURGER MENU
  //    Toggle .nav-menu visibility. Close on outside click or
  //    when a nav link is clicked.
  // ============================================================
  const initMobileMenu = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    const closeMenu = () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    };

    const openMenu = () => {
      hamburger.classList.add('active');
      navMenu.classList.add('active');
      document.body.classList.add('menu-open');
    };

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close when a link inside the menu is clicked
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });
  };

  initMobileMenu();

  // ============================================================
  // 4. SMOOTH SCROLL
  //    All anchor links scroll smoothly to their target section
  // ============================================================
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#' || targetId === '') return;

        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  };

  initSmoothScroll();

  // ============================================================
  // 5. SCROLL FADE-IN ANIMATIONS (IntersectionObserver)
  //    Elements with class 'fade-in' get 'animate-in' when they
  //    enter the viewport.
  // ============================================================
  const initScrollAnimations = () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    fadeElements.forEach((el) => observer.observe(el));
  };

  initScrollAnimations();

  // ============================================================
  // 6. STATISTICS COUNTER
  //    Animate numbers from 0 to data-target over 2 seconds
  //    with ease-out cubic easing.
  // ============================================================
  const initStatsCounter = () => {
    const statElements = document.querySelectorAll('[data-target]');
    if (statElements.length === 0) return;

    let hasAnimated = false;

    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const animateCounter = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 2000;
      const startTime = performance.now();
      const suffix = el.getAttribute('data-suffix') || '';

      const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutCubic(progress);
        const currentValue = Math.round(easedProgress * target);

        el.textContent = currentValue.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            statElements.forEach(animateCounter);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.querySelector('.stats, .statistics, #stats');
    if (statsSection) {
      observer.observe(statsSection);
    } else {
      statElements.forEach((el) => observer.observe(el));
    }
  };

  initStatsCounter();

  // ============================================================
  // 7. ACTIVE NAV HIGHLIGHTING
  //    Highlight the nav link matching window.location.pathname
  // ============================================================
  const initActiveNav = () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar a, .nav-menu a');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;

      // Normalize paths for comparison
      const linkPath = href.startsWith('/') ? href : `/${href}`;

      // Check for exact match, index.html variants, and trailing slash
      const isActive =
        linkPath === currentPath ||
        (currentPath.endsWith('/') && linkPath === `${currentPath}index.html`) ||
        (currentPath.endsWith('index.html') && linkPath === currentPath.replace('index.html', '')) ||
        (href === currentPath.split('/').pop());

      if (isActive) {
        link.classList.add('active');
      }
    });
  };

  initActiveNav();

  // ============================================================
  // 8. FAQ ACCORDION
  //    details/summary elements - close others when one opens
  // ============================================================
  const initFaqAccordion = () => {
    const detailsElements = document.querySelectorAll('.faq details, .accordion details, .faq-section details');
    if (detailsElements.length === 0) return;

    detailsElements.forEach((detail) => {
      detail.addEventListener('toggle', () => {
        if (detail.open) {
          detailsElements.forEach((other) => {
            if (other !== detail && other.open) {
              other.open = false;
            }
          });
        }
      });
    });
  };

  initFaqAccordion();

  // ============================================================
  // 9. FORM VALIDATION
  //    Basic client-side validation for contact/inquiry forms
  // ============================================================
  const initFormValidation = () => {
    const forms = document.querySelectorAll(
      '.contact-form, .inquiry-form, .application-form, form[data-validate]'
    );
    if (forms.length === 0) return;

    const showError = (field, message) => {
      clearError(field);
      field.classList.add('error');
      const errorEl = document.createElement('span');
      errorEl.className = 'error-message';
      errorEl.textContent = message;
      field.parentNode.appendChild(errorEl);
    };

    const clearError = (field) => {
      field.classList.remove('error');
      const existing = field.parentNode?.querySelector('.error-message');
      if (existing) existing.remove();
    };

    const validateField = (field) => {
      const value = field.value.trim();
      const type = field.type;
      const name = field.name || field.id || '';

      // Required check
      if (field.required && !value) {
        showError(field, 'This field is required.');
        return false;
      }

      // Email format
      if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          showError(field, 'Please enter a valid email address.');
          return false;
        }
      }

      // Phone format
      if ((type === 'tel' || name.includes('phone')) && value) {
        const phoneRegex = /^[\d\s\-()+]{7,20}$/;
        if (!phoneRegex.test(value)) {
          showError(field, 'Please enter a valid phone number.');
          return false;
        }
      }

      // Min length
      if (field.minLength > 0 && value.length < field.minLength) {
        showError(field, `Must be at least ${field.minLength} characters.`);
        return false;
      }

      clearError(field);
      return true;
    };

    forms.forEach((form) => {
      const fields = form.querySelectorAll('input, textarea, select');

      // Validate on blur
      fields.forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
          if (field.classList.contains('error')) {
            validateField(field);
          }
        });
      });

      // Validate entire form on submit
      form.addEventListener('submit', (e) => {
        let isValid = true;
        fields.forEach((field) => {
          if (!validateField(field)) {
            isValid = false;
          }
        });

        if (!isValid) {
          e.preventDefault();
          const firstError = form.querySelector('.error');
          firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  };

  initFormValidation();

  // ============================================================
  // 10. BACK TO TOP BUTTON
  //     Show when scrolled > 300px, smooth scroll to top on click
  // ============================================================
  const initBackToTop = () => {
    let btn = document.querySelector('.back-to-top');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'back-to-top';
      btn.setAttribute('aria-label', 'Back to top');
      btn.innerHTML = '&uarr;';
      document.body.appendChild(btn);
    }

    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    toggleVisibility();

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  initBackToTop();

  // ============================================================
  // 11. LOGO LOADER
  //     Set logo img src to images/logo.png with fallback to
  //     showing "SC Technological Institute" text if image fails.
  // ============================================================
  const initLogo = () => {
    const logoImg = document.querySelector('.logo img, .navbar-brand img, .site-logo img');
    if (!logoImg) return;

    logoImg.src = 'images/logo.png';

    logoImg.addEventListener('error', () => {
      // Image failed to load - replace with text fallback
      const textEl = document.createElement('span');
      textEl.className = 'logo-text';
      textEl.textContent = 'SC Technological Institute';
      logoImg.parentNode.replaceChild(textEl, logoImg);
    });
  };

  initLogo();

});
