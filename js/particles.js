/* ============================================================
   PARTICLES.JS — Canvas particle system for hero section
   ============================================================ */
'use strict';

(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let particles = [];
  let mouseX = -9999, mouseY = -9999;

  const CONFIG = {
    count:          100,
    maxRadius:      2.5,
    minRadius:      0.5,
    maxSpeed:       0.4,
    connectionDist: 130,
    mouseRadius:    180,
    colors: [
      'rgba(139,92,246,',   // purple
      'rgba(6,182,212,',    // cyan
      'rgba(236,72,153,',   // pink
      'rgba(167,139,250,',  // purple-light
    ]
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      vx:    (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
      vy:    (Math.random() - 0.5) * CONFIG.maxSpeed * 2,
      r:     Math.random() * (CONFIG.maxRadius - CONFIG.minRadius) + CONFIG.minRadius,
      alpha: Math.random() * 0.5 + 0.3,
      color,
      pulsing: Math.random() > 0.7,
      pulsePhase: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: CONFIG.count }, createParticle);
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    particles.forEach((p, i) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONFIG.mouseRadius) {
        const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
        p.x += dx / dist * force * 2.5;
        p.y += dy / dist * force * 2.5;
      }

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Pulse alpha
      let alpha = p.alpha;
      if (p.pulsing) {
        alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulsePhase + frame * 0.02));
      }

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ddx = p.x - q.x;
        const ddy = p.y - q.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < CONFIG.connectionDist) {
          const lineAlpha = (1 - d / CONFIG.connectionDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = p.color + lineAlpha + ')';
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    });

    animId = requestAnimationFrame(draw);
  }

  function handleMouse(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    init();
    draw();
  }, { passive: true });

  window.addEventListener('mousemove', handleMouse, { passive: true });
  window.addEventListener('mouseleave', handleMouseLeave);

  // Touch support
  window.addEventListener('touchmove', e => {
    if (e.touches[0]) {
      mouseX = e.touches[0].clientX;
      mouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  init();
  draw();
})();
