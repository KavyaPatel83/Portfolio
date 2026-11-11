/* ============================================================
   PROJECTS.JS — Category Filter, Deep Dive, Architecture Toggle, 3D Tilt
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Category Filter ────────────────────────────────────── 
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach((card, i) => {
        const categories = (card.dataset.categories || card.dataset.category || '').split(' ');
        const show = filter === 'all' || categories.includes(filter);

        if (show) {
          card.classList.remove('hidden');
          card.style.animationDelay = (i * 0.06) + 's';
          card.style.animation = 'none';
          void card.offsetWidth; // trigger reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── Deep Dive Toggle (Read More) ───────────────────────── 
  document.querySelectorAll('.read-more-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      const deepdive = card.querySelector('.deepdive-content');
      if (!deepdive) return;

      const isOpen = deepdive.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);
      
      const btnText = btn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = isOpen ? 'Collapse Breakdown' : 'Technical Deep Dive';
      }
    });
  });

  // ── Architecture Diagram Toggle ────────────────────────── 
  document.querySelectorAll('.arch-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      if (!card) return;
      const archWrapper = card.querySelector('.project-arch-wrapper');
      if (!archWrapper) return;

      const isOpen = archWrapper.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', isOpen);

      const btnText = btn.querySelector('.arch-btn-text');
      if (btnText) {
        btnText.textContent = isOpen ? 'Hide Architecture' : 'View Architecture Flow';
      }
    });
  });

  // ── 3D Tilt on Project Cards ───────────────────────────── 
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      // Don't tilt when interacting with open architecture or inputs
      if (card.querySelector('.project-arch-wrapper.open') && e.target.closest('.project-arch-wrapper')) {
        return;
      }
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -4;
      const tiltY = dx *  4;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-5px)`;
      card.style.transition = 'transform 0.08s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // ── Staggered entrance ─────────────────────────────────── 
  const grid = document.querySelector('.projects-grid');
  if (grid) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.project-card:not(.hidden)').forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(25px)';
            setTimeout(() => {
              card.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
              card.style.opacity = '1';
              card.style.transform = '';
            }, i * 80);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(grid);
  }
});
