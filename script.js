/* ═══════════════════════════════════════════════════
   AAIQO — script.js
   Navbar scroll · Mobile menu · Animated mesh · Reveal
═══════════════════════════════════════════════════ */

// ── Navbar scroll shadow ────────────────────────────
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile hamburger menu ───────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// ── Animated mesh canvas ────────────────────────────
(function initMesh() {
  const canvas = document.getElementById('mesh-canvas');
  if (!canvas) return;
  // Respect user accessibility preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let W, H, dots, raf;

  const COLORS = ['#0ea5e9', '#6366f1', '#10b981', '#8b5cf6'];
  const DOT_COUNT = 55;
  const LINK_DIST = 160;
  const SPEED = 0.3;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createDots() {
    dots = Array.from({ length: DOT_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * SPEED,
      vy: (Math.random() - .5) * SPEED,
      r: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move dots
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > W) d.vx *= -1;
      if (d.y < 0 || d.y > H) d.vy *= -1;
    });

    // Draw links
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          const alpha = (1 - dist / LINK_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.strokeStyle = `rgba(14,165,233,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    // Draw dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = .45;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    createDots();
  }, { passive: true });

  resize();
  createDots();
  draw();
})();

// ── Intersection-observer scroll reveals ───────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.feature-card, .step, .benefit-card, .plan-card, .contact-card'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// ── Smooth anchor scrolling with offset ────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});
