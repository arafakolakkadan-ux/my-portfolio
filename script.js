document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================
     MOBILE NAVIGATION MENU (UNDER 760PX)
     ========================================== */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  
  if (navToggle && navMenu) {
    const toggleMenu = () => {
      navToggle.classList.toggle('open');
      navMenu.classList.toggle('active');
      
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };
    
    navToggle.addEventListener('click', toggleMenu);
    
    // Close mobile nav when clicking an anchor link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  /* ==========================================
     INTERSECTION OBSERVER SCROLL-SPY
     ========================================== */
  const sections = document.querySelectorAll('section[id]');
  
  if (sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px', // Trigger near middle viewport
      threshold: 0
    };
    
    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);
    
    sections.forEach(section => scrollSpyObserver.observe(section));
  }

  /* ==========================================
     INTERSECTION OBSERVER SCROLL-REVEALS
     ========================================== */
  const revealElements = document.querySelectorAll('.reveal');
  
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target); // Stop tracking once animated
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================
     TYPEWRITER EFFECT (HERO)
     ========================================== */
  const typewriterText = document.getElementById('typewriter-text');
  if (typewriterText) {
    const roles = ["AI Content Creator", "Website Creator", "Digital Marketer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    const type = () => {
      const currentRole = roles[roleIndex];
      
      if (isDeleting) {
        typewriterText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }
      
      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }
      
      setTimeout(type, typingSpeed);
    };
    
    setTimeout(type, 1000);
  }

  /* ==========================================
     VIDEO CONTROLS
     ========================================== */
  const heroVideo = document.querySelector('.hero-video');
  const muteBtn = document.getElementById('mute-btn');
  const muteIcon = document.getElementById('mute-icon');
  
  if (heroVideo && muteBtn) {
    heroVideo.muted = true;
    
    muteBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (heroVideo.muted) {
        heroVideo.muted = false;
        muteIcon.className = 'fa-solid fa-volume-high';
        muteBtn.setAttribute('aria-label', 'Mute Video');
      } else {
        heroVideo.muted = true;
        muteIcon.className = 'fa-solid fa-volume-xmark';
        muteBtn.setAttribute('aria-label', 'Unmute Video');
      }
    });
  }



  /* ==========================================
     HEADER SCROLL BAR CLASS
     ========================================== */
  const header = document.getElementById('header');
  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleHeaderScroll);
  handleHeaderScroll();

  /* ==========================================
     CUSTOM CURSOR (DESKTOP DUAL-ELEMENT WITH MAGNETICS)
     ========================================== */
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorOutline = document.getElementById('custom-cursor-outline');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (cursorDot && cursorOutline && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let targetX = 0;
    let targetY = 0;
    
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;
    
    let magnetX = 0;
    let magnetY = 0;
    
    let hoveredElement = null;
    let isMouseActive = false;

    // Track mouse coordinates
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      
      if (!isMouseActive) {
        isMouseActive = true;
        cursorDot.style.opacity = '1';
        cursorOutline.style.opacity = '1';
        dotX = targetX;
        dotY = targetY;
        outlineX = targetX;
        outlineY = targetY;
      }

      // Calculate magnetic pull offsets if inside bounds
      if (hoveredElement) {
        const rect = hoveredElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const diffX = centerX - targetX;
        const diffY = centerY - targetY;
        
        const factor = 0.25; // snap factor
        const maxCap = 8; // maximum 8px pull
        
        let px = diffX * factor;
        let py = diffY * factor;
        const pullMag = Math.hypot(px, py);
        if (pullMag > maxCap) {
          px = (px / pullMag) * maxCap;
          py = (py / pullMag) * maxCap;
        }
        magnetX = px;
        magnetY = py;
      } else {
        magnetX = 0;
        magnetY = 0;
      }

      // If prefers-reduced-motion is active, snap positions 1:1 instantly
      if (prefersReducedMotion.matches) {
        cursorDot.style.left = `${targetX}px`;
        cursorDot.style.top = `${targetY}px`;
        cursorOutline.style.left = `${targetX}px`;
        cursorOutline.style.top = `${targetY}px`;
      }
    });

    // Lerp rendering loop (skipped if prefers-reduced-motion is enabled)
    const renderCursor = () => {
      if (isMouseActive && !prefersReducedMotion.matches) {
        // Dot tracking (faster response)
        const dotEase = 0.20;
        dotX += (targetX + magnetX - dotX) * dotEase;
        dotY += (targetY + magnetY - dotY) * dotEase;

        // Outline tracking (slower trailing lag response)
        const outlineEase = 0.08;
        outlineX += (targetX + magnetX - outlineX) * outlineEase;
        outlineY += (targetY + magnetY - outlineY) * outlineEase;

        cursorDot.style.left = `${dotX.toFixed(2)}px`;
        cursorDot.style.top = `${dotY.toFixed(2)}px`;
        cursorOutline.style.left = `${outlineX.toFixed(2)}px`;
        cursorOutline.style.top = `${outlineY.toFixed(2)}px`;
      }
      requestAnimationFrame(renderCursor);
    };
    
    renderCursor();

    // Hide/show custom cursor elements on document boundaries
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    // Configure magnetic snap listeners on interactive items
    const setupInteractiveListeners = () => {
      const selectors = 'a, button, .social-chip, .btn, .nav-toggle, [role="button"], .service-card-new, .process-card';
      const interactiveElements = document.querySelectorAll(selectors);

      interactiveElements.forEach(el => {
        if (el.dataset.cursorBound) return;
        el.dataset.cursorBound = 'true';

        el.addEventListener('mouseenter', () => {
          hoveredElement = el;
          cursorDot.classList.add('hovered');
          cursorOutline.classList.add('hovered');
        });

        el.addEventListener('mouseleave', () => {
          hoveredElement = null;
          magnetX = 0;
          magnetY = 0;
          cursorDot.classList.remove('hovered');
          cursorOutline.classList.remove('hovered');
        });
      });
    };

    setupInteractiveListeners();

    // Re-run bindings on dynamic DOM insertions
    const observer = new MutationObserver(setupInteractiveListeners);
    observer.observe(document.body, { childList: true, subtree: true });
  }

});
