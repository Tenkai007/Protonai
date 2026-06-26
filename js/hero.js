/* ============================================
   NexusAI — Hero Interactions
   ============================================ */

export function initHero() {
  const mouseLight = document.getElementById('hero-mouse-light');
  const hero = document.getElementById('hero');

  if (!mouseLight || !hero) return;

  // Mouse-responsive ambient light
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mouseLight.style.left = `${x - 300}px`;
    mouseLight.style.top = `${y - 300}px`;
  });

  hero.addEventListener('mouseleave', () => {
    mouseLight.style.left = '50%';
    mouseLight.style.top = '50%';
  });

  // Animate dashboard bars on load
  setTimeout(() => {
    const bars = document.querySelectorAll('.dash__bar');
    bars.forEach(bar => {
      const h = bar.getAttribute('data-height');
      if (h) bar.style.height = h;
    });
  }, 800);
}
