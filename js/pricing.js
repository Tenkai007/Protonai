/* ============================================
   NexusAI — Pricing Logic
   ============================================ */

export function initPricing() {
  const toggle = document.getElementById('pricing-toggle');
  const monthlyLabel = document.getElementById('pricing-monthly-label');
  const annualLabel = document.getElementById('pricing-annual-label');
  const currencyBtns = document.querySelectorAll('.pricing__currency-btn');

  // Dynamic Multi-dimensional Matrix for rates, regional tariffs, and billing multipliers
  const pricingMatrix = {
    baseRates: {
      Starter: 29,
      Professional: 79,
      Enterprise: 199
    },
    regionalTariffs: {
      USD: { symbol: '$', multiplier: 1.0 },
      EUR: { symbol: '€', multiplier: 0.92 },
      INR: { symbol: '₹', multiplier: 82.5 }
    },
    billingMultipliers: {
      monthly: 1.0,
      annual: 0.8 // 20% discount
    }
  };

  let isAnnual = false;
  let currentCurrency = 'USD';

  if (toggle) {
    toggle.addEventListener('click', () => {
      isAnnual = !isAnnual;
      toggle.classList.toggle('active', isAnnual);
      if (monthlyLabel) monthlyLabel.classList.toggle('active', !isAnnual);
      if (annualLabel) annualLabel.classList.toggle('active', isAnnual);
      updatePrices();
    });
  }

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.getAttribute('data-currency');
      updatePrices();
    });
  });

  function updatePrices() {
    const tariff = pricingMatrix.regionalTariffs[currentCurrency];
    const billingMultiplier = isAnnual ? pricingMatrix.billingMultipliers.annual : pricingMatrix.billingMultipliers.monthly;

    document.querySelectorAll('.pricing-card').forEach(card => {
      const tier = card.getAttribute('data-tier');
      if (!tier) return;

      const baseRate = pricingMatrix.baseRates[tier];
      if (baseRate === undefined) return;

      // Dynamically calculate the localized price
      const finalPrice = Math.round(baseRate * tariff.multiplier * billingMultiplier);

      const currencyEl = card.querySelector('.pricing-card__currency');
      const amountEl = card.querySelector('.pricing-card__amount');
      const periodEl = card.querySelector('.pricing-card__period');

      // Zero-dependency, performance-isolated text node updates (no parent re-renders/layout thrashing)
      if (currencyEl && currencyEl.firstChild) {
        currencyEl.firstChild.nodeValue = tariff.symbol;
      }
      if (amountEl && amountEl.firstChild) {
        amountEl.firstChild.nodeValue = finalPrice;
      }
      if (periodEl && periodEl.firstChild) {
        periodEl.firstChild.nodeValue = '/mo';
      }
    });
  }
}
