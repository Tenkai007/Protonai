/* ============================================
   Proton — Main Entry Point
   ============================================ */

import { initNav } from './nav.js';
import { initHero } from './hero.js';
import { initStats } from './stats.js';
import { initFeatures } from './features.js';
import { initPricing } from './pricing.js';
import { initFAQ } from './faq.js';
import { initScrollReveal } from './scroll.js';
import { initCosmicBG } from './cosmic-bg.js';

document.addEventListener('DOMContentLoaded', () => {
  initCosmicBG();
  initNav();
  initHero();
  initStats();
  initFeatures();
  initPricing();
  initFAQ();
  initScrollReveal();
});
