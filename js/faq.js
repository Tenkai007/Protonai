/* ============================================
   NexusAI — FAQ Accordion
   ============================================ */

export function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    const content = item.querySelector('.faq-item__content');
    const answer = item.querySelector('.faq-item__answer');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all
      items.forEach(other => {
        other.classList.remove('active');
        const otherContent = other.querySelector('.faq-item__content');
        otherContent.style.maxHeight = '0';
        other.querySelector('.faq-item__trigger').setAttribute('aria-expanded', 'false');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('active');
        content.style.maxHeight = answer.scrollHeight + 24 + 'px';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
    });
  });
}
