/**
 * Swamini Photography - Portfolio Gallery & Lightbox Controller
 * Supports upgraded Bento Grid (.work-bento-card) and original gallery cards
 */

document.addEventListener('DOMContentLoaded', () => {
  // Select filter buttons from both new & standard classes
  const filterBtns = document.querySelectorAll('.work-filter-pill, .portfolio-filter-pill, .filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.work-bento-card, .portfolio-thumb-card, .gallery-item'));
  const lightbox = document.getElementById('galleryLightbox');
  
  if (!galleryItems.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxPrev = lightbox.querySelector('.lightbox-prev');
  const lightboxNext = lightbox.querySelector('.lightbox-next');
  const lightboxBookBtn = lightbox.querySelector('.lightbox-book-btn');

  let currentCategory = 'all';
  let activeFilteredItems = [...galleryItems];
  let currentIndex = 0;

  const galleryGrid = galleryItems[0].parentElement;

  // 1. Category Filtering
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      currentCategory = (btn.dataset.filter || 'all').toLowerCase();

      // Exact match: "wedding" must not also pull in "pre-wedding"
      activeFilteredItems = [];
      galleryItems.forEach((item) => {
        const itemCat = (item.dataset.category || '').toLowerCase();
        const matches = currentCategory === 'all' || itemCat === currentCategory;
        item.style.display = matches ? '' : 'none';
        item.classList.remove('is-entering');
        if (matches) activeFilteredItems.push(item);
      });

      // "All" keeps the bento collage; a single category re-flows into a centred row
      galleryGrid.classList.toggle('is-filtered', currentCategory !== 'all');

      // Restart the fade-in on the cards now showing
      void galleryGrid.offsetWidth;
      activeFilteredItems.forEach((item) => item.classList.add('is-entering'));

      // The grid's height changed, so scroll-triggered animations further down must re-measure
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  // 2. Open Lightbox
  function openLightbox(item) {
    currentIndex = activeFilteredItems.indexOf(item);
    if (currentIndex === -1) currentIndex = 0;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const currentItem = activeFilteredItems[currentIndex];
    if (!currentItem) return;

    const img = currentItem.querySelector('img');
    const title = currentItem.dataset.title || currentItem.querySelector('.work-bento-title')?.textContent || img.alt || 'Swamini Photography';
    const serviceKey = currentItem.dataset.service || 'wedding';

    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    lightboxCaption.textContent = title;

    if (lightboxBookBtn) {
      lightboxBookBtn.dataset.service = serviceKey;
      lightboxBookBtn.textContent = `Enquire for ${title}`;
    }
  }

  function showNext() {
    if (!activeFilteredItems.length) return;
    currentIndex = (currentIndex + 1) % activeFilteredItems.length;
    updateLightbox();
  }

  function showPrev() {
    if (!activeFilteredItems.length) return;
    currentIndex = (currentIndex - 1 + activeFilteredItems.length) % activeFilteredItems.length;
    updateLightbox();
  }

  // Click on gallery item
  galleryItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(item);
    });
  });

  // Lightbox navigation events
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Close on clicking backdrop
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Lightbox Book Button click
  if (lightboxBookBtn) {
    lightboxBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = lightboxBookBtn.dataset.service;
      closeLightbox();
      
      const serviceSelect = document.getElementById('serviceSelect');
      if (serviceSelect && service) {
        serviceSelect.value = service;
      }

      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Touch Swipe Handling
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext(); // Swiped left
    } else if (touchEndX > touchStartX + swipeThreshold) {
      showPrev(); // Swiped right
    }
  }
});
