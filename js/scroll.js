/* ============================================
   Proton — Scroll Reveal & Cinematic Engine
   ============================================ */

export function initScrollReveal() {
  // 1. Maintain existing reveal animations via Intersection Observer
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (elements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // Workflow line animation
  const workflowSteps = document.querySelector('.workflow__steps');
  if (workflowSteps) {
    const workflowObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          workflowObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    workflowObserver.observe(workflowSteps);
  }

  // 2. Global Scroll Interpolation & Choreography Engine
  const sections = [];
  const sectionElements = document.querySelectorAll('section, footer');
  
  function getAbsoluteOffsetTop(element) {
    let top = 0;
    let curr = element;
    while (curr) {
      top += curr.offsetTop;
      curr = curr.offsetParent;
    }
    return top;
  }

  function cacheSectionDimensions() {
    sections.length = 0;
    sectionElements.forEach(el => {
      sections.push({
        element: el,
        top: getAbsoluteOffsetTop(el),
        height: el.offsetHeight
      });
    });
  }

  // Cache dimensions on load and window resize
  cacheSectionDimensions();
  window.addEventListener('resize', cacheSectionDimensions);
  
  // Track scroll position
  let currentY = window.scrollY;
  let targetY = window.scrollY;
  let velocity = 0;
  
  window.addEventListener('scroll', () => {
    targetY = window.scrollY;
  }, { passive: true });
  
  // Track mouse coordinates for smooth cursor lighting
  let currentMouseX = window.innerWidth / 2;
  let currentMouseY = window.innerHeight / 2;
  let targetMouseX = currentMouseX;
  let targetMouseY = currentMouseY;
  
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }, { passive: true });
  
  // RAF Easing Loop
  function tick() {
    // Scroll Easing
    const diff = targetY - currentY;
    velocity = diff * 0.08;
    currentY += velocity;
    
    // Save smooth scroll value globally for cosmic background
    window.smoothScrollY = currentY;
    
    // Clamp values
    if (Math.abs(diff) < 0.05) {
      currentY = targetY;
      velocity = 0;
    }
    
    // Mouse Glow Easing
    currentMouseX += (targetMouseX - currentMouseX) * 0.08;
    currentMouseY += (targetMouseY - currentMouseY) * 0.08;
    
    // Set global CSS custom properties on html
    const docEl = document.documentElement;
    docEl.style.setProperty('--scroll-velocity', velocity.toFixed(4));
    docEl.style.setProperty('--mouse-x', `${currentMouseX}px`);
    docEl.style.setProperty('--mouse-y', `${currentMouseY}px`);
    
    // Calculate progress for each section
    const winHeight = window.innerHeight;
    sections.forEach(sec => {
      const yStart = sec.top - winHeight;
      const yEnd = sec.top + sec.height;
      const range = yEnd - yStart;
      
      let progress = 1.5;
      if (range > 0) {
        progress = 1 - 2 * (currentY - yStart) / range;
      }
      
      // Clamp progress
      progress = Math.max(-1.5, Math.min(1.5, progress));
      const progressAbs = Math.abs(progress);
      
      sec.element.style.setProperty('--section-progress', progress.toFixed(4));
      sec.element.style.setProperty('--section-progress-abs', progressAbs.toFixed(4));
    });
    
    requestAnimationFrame(tick);
  }
  
  requestAnimationFrame(tick);
}
