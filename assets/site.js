// Mariecure · shared site JS
// 1) mobile nav toggle  2) scroll-reveal  3) lightbox (foto's page)

(function () {
  // Mark current nav link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.topnav nav a[data-route]').forEach((a) => {
    if (a.dataset.route === path) a.setAttribute('aria-current', 'page');
  });

  // Mobile menu
  const nav = document.querySelector('.topnav');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', String(!open));
      toggle.setAttribute('aria-expanded', String(!open));
    });
    nav.querySelectorAll('nav a').forEach((a) =>
      a.addEventListener('click', () => nav.setAttribute('data-open', 'false'))
    );
  }

  // Footer year
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Scroll reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // Lightbox (foto's pagina)
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const lbImg = lb.querySelector('img');
    const closeBtn = lb.querySelector('.close');
    const open = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt || '';
      lb.setAttribute('data-open', 'true');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lb.setAttribute('data-open', 'false');
      lbImg.src = '';
      document.body.style.overflow = '';
    };
    document.querySelectorAll('.gallery .tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        const img = tile.querySelector('img');
        if (img && img.src) open(img.src, img.alt);
      });
    });
    closeBtn?.addEventListener('click', close);
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }
})();
