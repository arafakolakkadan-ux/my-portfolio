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
     MOBILE VIDEO BANDWIDTH FALLBACK
     ========================================== */
  const handleMediaFallback = () => {
    if (window.innerWidth <= 760) {
      // Hero video
      const hVideo = document.getElementById('hero-video-play');
      if (hVideo) {
        const poster = hVideo.getAttribute('poster');
        const parent = hVideo.parentElement;
        if (poster && parent) {
          parent.innerHTML = `<img src="${poster}" alt="Arafa video snapshot fallback" class="hero-poster-fallback" style="width:100%;height:100%;object-fit:cover;display:block;" />`;
        }
      }
    }
  };

  handleMediaFallback();


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
     CUSTOM CURSOR (DESKTOP)
     ========================================== */
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorOutline = document.getElementById('custom-cursor-outline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Position the dot instantly
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Animate the outline with a slight delay
      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 150, fill: "forwards" });
    });

    // Hide custom cursor elements when cursor leaves the window bounds
    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorOutline.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
      cursorDot.style.opacity = '1';
      cursorOutline.style.opacity = '1';
    });

    // Hover effect on interactive elements
    const updateHoverState = () => {
      const interactiveElements = document.querySelectorAll('a, button, .social-chip, .btn, .nav-toggle, [role="button"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorDot.classList.add('hovered');
          cursorOutline.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
          cursorDot.classList.remove('hovered');
          cursorOutline.classList.remove('hovered');
        });
      });
    };
    
    updateHoverState();
    
    // Re-run hook when DOM is updated dynamically (just in case)
    const observer = new MutationObserver(updateHoverState);
    observer.observe(document.body, { childList: true, subtree: true });
  }

});
