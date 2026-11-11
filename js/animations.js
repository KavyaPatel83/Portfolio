/* ============================================================
   ANIMATIONS.JS — Intersection Observer, scroll reveals
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Intersection Observer for reveal classes ─────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve after reveal
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Staggered children reveal ─────────────────────────── 
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll('[data-stagger]');
        children.forEach((child, i) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, i * 120);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-stagger-container]').forEach(container => {
    // Set initial state on children
    container.querySelectorAll('[data-stagger]').forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(30px)';
      child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    staggerObserver.observe(container);
  });

  // ── Animated counter ──────────────────────────────────── 
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent);
    const isFloat = el.dataset.float === 'true';
    const suffix  = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (eased * target).toFixed(2)
        : Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  // ── Progress bar fill on scroll ───────────────────────── 
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.skill-bar-fill');
        if (fill) {
          const pct = fill.dataset.width || '0%';
          setTimeout(() => { fill.style.width = pct; }, 200);
        }
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-bar-item').forEach(item => {
    barObserver.observe(item);
  });

  // ── Radial chart fill ─────────────────────────────────── 
  const radialObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circle = entry.target.querySelector('.radial-fill');
        if (circle) {
          const pct = parseFloat(circle.dataset.pct || 0);
          const circumference = 283; // 2π × 45
          const offset = circumference - (pct / 100) * circumference;
          setTimeout(() => { circle.style.strokeDashoffset = offset; }, 200);
        }
        radialObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.radial-skill').forEach(item => {
    radialObserver.observe(item);
  });

  // ── 3D tilt effect on project cards ───────────────────── 
  document.querySelectorAll('.project-card[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -6;
      const tiltY  = dx * 6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // ── Underline draw reveal ──────────────────────────────── 
  const underlineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        underlineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.underline-draw').forEach(el => {
    underlineObserver.observe(el);
  });

});
