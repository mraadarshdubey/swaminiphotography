/**
 * Swamini Photography - GSAP & Motion Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Ensure GSAP is loaded
  if (typeof gsap === 'undefined') return;

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Only animate selectors that exist, so GSAP never warns about missing targets
  const present = (selectors) => selectors.filter((sel) => document.querySelector(sel));

  // Many cards have `transition: all` in CSS, which fights GSAP's per-frame updates.
  // Pause CSS transitions during the reveal, then hand the element back to CSS.
  const tweenSafely = (targets) => ({
    onStart: () => gsap.utils.toArray(targets).forEach((el) => { el.style.transition = 'none'; }),
    onComplete: () => gsap.utils.toArray(targets).forEach((el) => { el.style.transition = ''; }),
    clearProps: 'transform,opacity'
  });

  // 1. Hero Entrance Sequence
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
  const heroSteps = [
    ['.site-header-upgrade', { y: -50, duration: 0.8 }],
    ['.hero-eyebrow-tag', { y: 20, duration: 0.6 }],
    ['.hero-headline', { y: 30, duration: 0.9 }],
    ['.hero-services-ticker', { y: 20, duration: 0.7 }],
    ['.hero-subtext', { y: 20, duration: 0.7 }],
    ['.hero-actions-row', { y: 20, duration: 0.7 }],
    ['.hero-trust-bar', { y: 20, duration: 0.7 }],
    ['.hero-pagination-cue', { duration: 0.8 }]
  ];

  heroSteps
    .filter(([sel]) => document.querySelector(sel))
    .forEach(([sel, vars], i) => {
      heroTimeline.from(sel, { opacity: 0, clearProps: 'transform,opacity', ...vars }, i === 0 ? 0 : '-=0.45');
    });

  if (typeof ScrollTrigger === 'undefined') return;

  // 2. Section Headings
  present([
    '.services-upgrade-header',
    '.work-upgrade-header',
    '.packages-upgrade-header',
    '.testimonials-header-row',
    '.why-left-content',
    '.about-col-center',
    '.final-cta-right'
  ]).forEach((sel) => {
    gsap.from(sel, {
      scrollTrigger: { trigger: sel, start: 'top 85%', toggleActions: 'play none none none' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      clearProps: 'transform,opacity'
    });
  });

  // 3. Staggered Card Groups: [grid that triggers, cards inside it]
  // Vertical offsets only: a sideways start position would poke past the screen edge on phones
  const cardGroups = [
    ['.about-col-right', '.about-service-card'],
    ['.services-grid-upgrade', '.service-card-lux'],
    ['.work-bento-grid', '.work-bento-card'],
    ['.why-pillars-5-grid', '.why-pillar-card-lux'],
    ['.packages-cards-3-grid', '.package-card-lux'],
    ['.testimonials-grid', '.testimonial-card']
  ];

  cardGroups.forEach(([gridSel, cardSel]) => {
    const grid = document.querySelector(gridSel);
    if (!grid) return;
    const cards = grid.querySelectorAll(cardSel);
    if (!cards.length) return;

    gsap.from(cards, {
      scrollTrigger: { trigger: grid, start: 'top 82%', toggleActions: 'play none none none' },
      y: 40,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      ...tweenSafely(cards)
    });
  });
});
