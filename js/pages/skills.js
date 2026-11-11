/* ============================================================
   SKILLS.JS — Tabs, animated bars and radial charts
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Skill tabs ─────────────────────────────────────────── 
  const tabs   = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const target = document.getElementById('panel-' + tab.dataset.tab);
      if (target) {
        target.classList.add('active');
        // Re-trigger animations for newly shown panel
        triggerBarsInPanel(target);
        triggerRadialsInPanel(target);
      }
    });
  });

  // ── Animated progress bars ─────────────────────────────── 
  function triggerBarsInPanel(panel) {
    panel.querySelectorAll('.skill-bar-fill').forEach(fill => {
      fill.style.width = '0';
      void fill.offsetWidth;
      const pct = fill.dataset.width || '0%';
      setTimeout(() => { fill.style.width = pct; }, 100);
    });
  }

  // ── Radial charts ──────────────────────────────────────── 
  function triggerRadialsInPanel(panel) {
    panel.querySelectorAll('.radial-fill').forEach(circle => {
      circle.style.strokeDashoffset = '283';
      void circle.offsetWidth;
      const pct = parseFloat(circle.dataset.pct || 0);
      const offset = 283 - (pct / 100) * 283;
      setTimeout(() => { circle.style.strokeDashoffset = offset; }, 100);
    });
  }

  // Trigger active panel on load
  const activePanel = document.querySelector('.skills-panel.active');
  if (activePanel) {
    setTimeout(() => {
      triggerBarsInPanel(activePanel);
      triggerRadialsInPanel(activePanel);
    }, 400);
  }

  // Also trigger on scroll into view
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.classList.contains('active')) {
        triggerBarsInPanel(entry.target);
        triggerRadialsInPanel(entry.target);
      }
    });
  }, { threshold: 0.2 });

  panels.forEach(p => panelObserver.observe(p));

});
