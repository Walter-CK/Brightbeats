/* ============================================================
   Bright Beats — script.js
   Ambient canvas · 3D tilt · nav · reveals · lightbox · form
   ============================================================ */

(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ── Ambient Canvas (gold/orange sparks) ── */
  if (!reducedMotion) {
    const cvs = document.getElementById('ambient-canvas');
    if (cvs) {
      const ctx = cvs.getContext('2d');
      let w = 0, h = 0;

      function resize() {
        w = cvs.width  = window.innerWidth;
        h = cvs.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      const N = Math.min(45, Math.floor(window.innerWidth / 26));
      const colors = [
        'rgba(245,192,39,',
        'rgba(232,96,10,',
        'rgba(245,192,39,',
      ];

      const particles = [];
      for (let i = 0; i < N; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.2 + 0.3,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.4 + 0.08,
          phase: Math.random() * Math.PI * 2,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      let t = 0;
      function draw() {
        ctx.clearRect(0, 0, w, h);
        t += 0.007;
        for (const p of particles) {
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
          const pulse = 0.55 + 0.45 * Math.sin(t + p.phase);
          ctx.fillStyle = p.color + (p.a * pulse) + ')';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 100) {
              ctx.globalAlpha = (1 - d / 100) * 0.06;
              ctx.strokeStyle = 'rgba(245,192,39,0.5)';
              ctx.lineWidth = 0.6;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
      }
      draw();
    }
  }

  /* ── 3D Card Tilt ── */
  if (hasFinePointer && !reducedMotion) {
    function attachTilt(el) {
      if (el.dataset.tilt) return;
      el.dataset.tilt = '1';
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        const mag = el.classList.contains('service-card') ? 6 : 4;
        el.style.transform = `perspective(700px) rotateY(${(x * mag).toFixed(2)}deg) rotateX(${(-y * mag).toFixed(2)}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transform = '';
        setTimeout(() => { if (!el.matches(':hover')) el.style.transition = ''; }, 500);
      });
      el.addEventListener('pointerenter', () => {
        el.style.transition = 'transform 0.1s ease-out';
      });
    }

    function initTilts() {
      document.querySelectorAll('.card, .service-card, .package-card, .stat-card, .brief-card, .team-card').forEach(attachTilt);
    }
    initTilts();
    new MutationObserver(records => {
      records.forEach(r => r.addedNodes.forEach(n => {
        if (n instanceof Element) n.querySelectorAll?.('.card, .service-card, .package-card, .stat-card, .brief-card, .team-card').forEach(attachTilt);
      }));
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ── Scroll Reveals ── */
  if (!reducedMotion) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

    function observeReveals(root = document) {
      root.querySelectorAll('.reveal').forEach(el => io.observe(el));
    }
    observeReveals();
    new MutationObserver(r => r.forEach(rec => rec.addedNodes.forEach(n => {
      if (n instanceof Element) observeReveals(n);
    }))).observe(document.body, { childList: true, subtree: true });
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

  /* ── Nav ── */
  const nav  = document.querySelector('.site-nav');
  const ham  = document.querySelector('.nav-hamburger');
  const navL = document.querySelector('.nav-links');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 24);
    }, { passive: true });
  }

  if (ham && navL) {
    ham.addEventListener('click', () => {
      const open = ham.getAttribute('aria-expanded') === 'true';
      ham.setAttribute('aria-expanded', String(!open));
      navL.classList.toggle('open', !open);
    });
    navL.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      ham.setAttribute('aria-expanded', 'false');
      navL.classList.remove('open');
    }));
  }

  // Active nav link
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').replace(/\/$/, '') || '/';
    if (href === currentPath || (href !== '/' && href !== '' && currentPath.includes(href))) {
      a.classList.add('active');
    }
  });

  /* ── Lightbox ── */
  const lightbox = document.querySelector('.lightbox');
  const lbImg    = lightbox?.querySelector('img');
  const lbClose  = lightbox?.querySelector('.lightbox-close');

  if (lightbox && lbImg) {
    function openLb(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }
    function closeLb() {
      lightbox.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
    }
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => openLb(el.dataset.lightbox, el.dataset.alt));
      el.style.cursor = 'pointer';
    });
    lbClose?.addEventListener('click', closeLb);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lightbox.hidden) closeLb(); });
  }

  /* ── Contact Form -> mailto ── */
  const form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const services = d.getAll('services');
      const none = 'Not specified';
      const lines = [
        `Hi Bright Beats, I'd like to get a quote for an upcoming event.`,
        ``,
        `Name: ${d.get('name') || none}`,
        `Phone: ${d.get('phone') || none}`,
        `Event type: ${d.get('eventType') || none}`,
        `Date: ${d.get('eventDate') || none}`,
        `Location: ${d.get('location') || none}`,
        `Guest count: ${d.get('guests') || none}`,
        `Budget range: ${d.get('budget') || none}`,
        `Services needed: ${services.length ? services.join(', ') : none}`,
        `Best contact method: ${d.get('contactMethod') || none}`,
        ``,
        `Additional notes:`,
        d.get('notes') || none
      ];
      const subject = encodeURIComponent(`Bright Beats Event Quote - ${d.get('eventType') || 'Enquiry'}`);
      const body    = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:thebrightbeats@gmail.com?subject=${subject}&body=${body}`;
    });
  }

})();
