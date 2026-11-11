/* ============================================================
   HOME.JS — Typewriter, hero stats counter
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Typewriter Effect ──────────────────────────────────── 
  const el = document.getElementById('typewriter');
  if (el) {
    const roles = [
      'AI/ML Engineer',
      'Multimodal Deep Learning Researcher',
      'Data Scientist',
      'Cybersecurity & IDS Developer',
      'Full-Stack Systems Engineer',
      'Computer Vision Specialist',
      'Agentic AI & LangGraph Architect',
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let pauseMs  = 0;

    function type() {
      const role = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = role.slice(0, charIndex);
        if (charIndex === role.length) {
          deleting = true;
          pauseMs  = 2000;
        }
      } else {
        charIndex--;
        el.textContent = role.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          pauseMs  = 400;
        }
      }

      const speed = deleting
        ? 50
        : (pauseMs > 0 ? pauseMs : 85);

      if (pauseMs > 0) {
        const delay = pauseMs;
        pauseMs = 0;
        setTimeout(type, delay);
      } else {
        setTimeout(type, speed);
      }
    }

    setTimeout(type, 800);
  }

  // ── Stat counters ──────────────────────────────────────── 
  document.querySelectorAll('[data-counter]').forEach(el => {
    // Handled by animations.js observer
  });

});
