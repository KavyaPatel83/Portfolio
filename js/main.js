/* ============================================================
   MAIN.JS — Shared: cursor, navbar, scroll-top, page transition
   ============================================================ */
'use strict';

// ── Custom Cursor ──────────────────────────────────────────
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let animId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    animId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Interactive elements enlarge ring
  document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, .card, .project-card, [role="button"]')) {
      dot.style.transform  = 'translate(-50%, -50%) scale(2)';
      dot.style.background = 'var(--pink)';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, .card, .project-card, [role="button"]')) {
      dot.style.transform  = 'translate(-50%, -50%) scale(1)';
      dot.style.background = 'var(--cyan)';
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

// ── Navbar ─────────────────────────────────────────────────
(function initNavbar() {
  const navbar   = document.querySelector('.navbar');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');

  if (!navbar) return;

  // Scroll class
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active link highlight
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on backdrop click
    mobileNav.addEventListener('click', e => {
      if (e.target === mobileNav) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
})();

// ── Scroll to Top ──────────────────────────────────────────
(function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ── Page Transition ────────────────────────────────────────
(function initPageTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  // Fade in on load
  window.addEventListener('load', () => {
    overlay.classList.remove('active');
  });

  // Fade out on internal link click
  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    e.preventDefault();
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = href; }, 320);
  });
})();

// ── Smooth Anchor Scroll ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
