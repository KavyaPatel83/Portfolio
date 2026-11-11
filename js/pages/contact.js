/* ============================================================
   CONTACT.JS — Instant Direct Actions, Toast Alerts & Form Handling
   ============================================================ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Toast Notification Helper ───────────────────────────── 
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  function showToast(text, iconSvg) {
    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      ${iconSvg || '<svg class="icon-svg-sm" viewBox="0 0 24 24" fill="none" stroke="#34d399"><polyline points="20 6 9 17 4 12"></polyline></svg>'}
      <span>${text}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px) scale(0.95)';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // ── Copy to Clipboard with Feedback & Toast ─────────────── 
  document.querySelectorAll('.contact-info-card[data-copy]').forEach(card => {
    card.addEventListener('click', async () => {
      const text = card.dataset.copy;
      const type = text.includes('@') ? 'Email' : 'Phone number';

      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      card.classList.add('copied');
      const hint = card.querySelector('.copy-success');
      if (hint) hint.textContent = 'Copied! ✓';
      setTimeout(() => card.classList.remove('copied'), 2000);

      showToast(`${type} copied to clipboard: ${text}`);
    });
  });

  // ── Contact Form: Instant Mail Client Opener ────────────── 
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.querySelector('#name')?.value.trim();
      const email   = form.querySelector('#email')?.value.trim();
      const role    = form.querySelector('#role')?.value || 'General Inquiry';
      const subject = form.querySelector('#subject')?.value.trim();
      const message = form.querySelector('#message')?.value.trim();

      if (!name || !email || !message) {
        showFormMsg('Please fill in all required fields (Name, Email, Message).', 'error');
        return;
      }

      // Build structured email
      const roleTextMap = {
        job: 'Job / Internship Opportunity',
        collab: 'Collaboration / Research',
        freelance: 'Freelance / Project',
        general: 'General Enquiry',
        other: 'Inquiry'
      };
      const formattedRole = roleTextMap[role] || role;

      const mailSubject = subject || `[Portfolio Inquiry] ${formattedRole} from ${name}`;
      const mailBody = 
`Hi Kavya,

My name is ${name} (${email}).
Enquiry Type: ${formattedRole}

Message:
${message}

---
Sent via portfolio contact form.`;

      const mailto = `mailto:patelkavya8306@gmail.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

      showFormMsg('Opening your email client with pre-filled message… 🚀', 'success');
      showToast('Opening default email client…');

      setTimeout(() => {
        window.location.href = mailto;
      }, 350);
    });

    // WhatsApp Direct Send Button
    const waBtn = document.getElementById('btn-whatsapp-send');
    if (waBtn) {
      waBtn.addEventListener('click', () => {
        const name    = form.querySelector('#name')?.value.trim();
        const email   = form.querySelector('#email')?.value.trim();
        const role    = form.querySelector('#role')?.value || 'Inquiry';
        const subject = form.querySelector('#subject')?.value.trim();
        const message = form.querySelector('#message')?.value.trim();

        if (!name || !message) {
          showFormMsg('Please provide at least your Name and Message to send via WhatsApp.', 'error');
          return;
        }

        const roleTextMap = {
          job: 'Job / Internship Opportunity',
          collab: 'Collaboration / Research',
          freelance: 'Freelance / Consulting',
          general: 'General Discussion',
          other: 'Inquiry'
        };
        const formattedRole = roleTextMap[role] || role;

        const waText = `Hi Kavya, I am ${name} (${email || 'No email provided'}).\n\n*Topic:* ${subject || formattedRole}\n*Message:* ${message}`;
        const waUrl = `https://wa.me/919104153824?text=${encodeURIComponent(waText)}`;

        showFormMsg('Launching WhatsApp chat… 💬', 'success');
        showToast('Redirecting to WhatsApp chat…');
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 300);
      });
    }
  }

  function showFormMsg(text, type) {
    let msg = document.getElementById('form-message');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'form-message';
      msg.style.cssText = `
        margin-top: 1.25rem;
        padding: 0.85rem 1.2rem;
        border-radius: 10px;
        font-size: 0.88rem;
        font-weight: 500;
        text-align: center;
        transition: opacity 0.3s ease;
      `;
      document.getElementById('contact-form')?.appendChild(msg);
    }
    msg.textContent = text;
    msg.style.background = type === 'success'
      ? 'rgba(16, 185, 129, 0.15)'
      : 'rgba(239, 68, 68, 0.15)';
    msg.style.color = type === 'success' ? '#34d399' : '#f87171';
    msg.style.border = `1px solid ${type === 'success' ? 'rgba(16,185,129,0.35)' : 'rgba(239,68,68,0.35)'}`;
    msg.style.opacity = '1';
    setTimeout(() => { msg.style.opacity = '0'; }, 6000);
  }

});
