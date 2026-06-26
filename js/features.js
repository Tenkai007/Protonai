/* ============================================
   NexusAI — Bento to Accordion Logic
   ============================================ */

export function initFeatures() {
  const cards = document.querySelectorAll('.feature-card');
  let activeIndex = 0; // default active card index
  let isMobile = window.innerWidth <= 768;

  // Initialize accessibility and attributes
  cards.forEach((card, idx) => {
    card.setAttribute('data-index', idx);
    const trigger = card.querySelector('.feature-card__trigger');
    const content = card.querySelector('.feature-card__content');
    
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        if (window.innerWidth > 768) return; // ignore clicks on desktop
        e.preventDefault();
        
        // Toggle this card
        if (activeIndex === idx) {
          activeIndex = -1; // collapse all
        } else {
          activeIndex = idx;
        }
        updateLayout();
      });
    }

    // Desktop hover behavior
    card.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        activeIndex = idx;
        updateLayout();
      }
    });
  });

  // Track window resizing to seamlessly transfer index context
  window.addEventListener('resize', () => {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
      isMobile = newIsMobile;
      updateLayout();
    }
  });

  // Initial layout update
  updateLayout();

  function updateLayout() {
    cards.forEach((card, idx) => {
      const trigger = card.querySelector('.feature-card__trigger');
      const content = card.querySelector('.feature-card__content');
      const desc = card.querySelector('.feature-card__desc');

      if (window.innerWidth <= 768) {
        // Mobile view - Accordion behavior
        card.classList.remove('feature-card--hover');
        if (trigger) {
          trigger.setAttribute('aria-expanded', activeIndex === idx ? 'true' : 'false');
          trigger.style.pointerEvents = 'auto';
        }

        if (activeIndex === idx) {
          card.classList.add('active');
          if (content && desc) {
            content.style.maxHeight = desc.offsetHeight + 'px';
            content.style.opacity = '1';
            content.style.paddingTop = '12px';
          }
        } else {
          card.classList.remove('active');
          if (content) {
            content.style.maxHeight = '0px';
            content.style.opacity = '0';
            content.style.paddingTop = '0px';
          }
        }
      } else {
        // Desktop view - Bento behavior (always fully expanded)
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'true');
          trigger.style.pointerEvents = 'none'; // disable button click on desktop
        }
        if (content) {
          content.style.maxHeight = 'none';
          content.style.opacity = '1';
          content.style.paddingTop = '0px';
        }

        if (activeIndex === idx) {
          card.classList.add('feature-card--hover');
        } else {
          card.classList.remove('feature-card--hover');
        }
      }
    });
  }
}
