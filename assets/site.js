// Mariecure · shared site JS
// 1) mobile nav toggle  2) scroll-reveal  3) galerij uit gallery.json + lightbox  4) back-to-top  5) contactformulier (Formspree AJAX)

(function () {
  // Mark current nav link (works for both /behandelingen and /behandelingen.html)
  const normalize = (p) => {
    const last = (p.split('/').pop() || '').replace(/\.html$/, '');
    return last === '' ? 'index' : last;
  };
  const currentRoute = normalize(location.pathname);
  document.querySelectorAll('.topnav nav a[data-route]').forEach((a) => {
    if (normalize(a.dataset.route) === currentRoute) a.setAttribute('aria-current', 'page');
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

  // Galerij (foto's): tegels worden uit gallery.json geladen zodat de foto's
  // beheerd kunnen worden via de CMS (/admin) zonder de HTML te bewerken.
  const galleryEl = document.querySelector('.gallery[data-gallery]');
  if (galleryEl) {
    const escAttr = (s) =>
      String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    fetch('/assets/data/gallery.json', { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('gallery.json niet gevonden'))))
      .then((data) => {
        const photos = Array.isArray(data && data.photos) ? data.photos : [];
        galleryEl.innerHTML = photos
          .filter((p) => p && p.image)
          .map(
            (p) =>
              `<button class="tile" type="button" aria-label="Bekijk foto vergroot"><img src="${escAttr(p.image)}" alt="${escAttr(p.alt || '')}" loading="lazy" decoding="async" /></button>`
          )
          .join('');
      })
      .catch(() => {});
  }

  // Lightbox (foto's pagina). Gebruikt event-delegation zodat ook tegels werken
  // die pas later uit gallery.json zijn toegevoegd.
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
    document.addEventListener('click', (e) => {
      const tile = e.target.closest('.gallery .tile');
      if (!tile) return;
      const img = tile.querySelector('img');
      if (img && img.src) open(img.src, img.alt);
    });
    closeBtn?.addEventListener('click', close);
    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // Back-to-top: verschijnt na wat scrollen, brengt je terug naar boven
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onScroll = () => {
      toTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // Contactformulier via Formspree (AJAX): bericht blijft op de pagina,
  // met inline succes-/foutmelding. Browser-validatie blijft actief.
  const form = document.querySelector('form[data-formspree]');
  if (form) {
    const status = form.querySelector('.form-status');
    const setStatus = (msg, state) => {
      if (!status) return;
      status.textContent = msg;
      if (state) status.setAttribute('data-state', state);
      else status.removeAttribute('data-state');
    };
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : '';
      setStatus('', null);
      if (btn) { btn.disabled = true; btn.textContent = 'Versturen…'; }
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          form.reset();
          setStatus('Bedankt! Je bericht is verzonden. Ik neem snel contact met je op.', 'success');
        } else {
          const data = await res.json().catch(() => null);
          const msg = data && Array.isArray(data.errors)
            ? data.errors.map((e) => e.message).join(', ')
            : '';
          setStatus(msg || 'Er ging iets mis bij het verzenden. Probeer het later opnieuw of mail rechtstreeks.', 'error');
        }
      } catch (_err) {
        setStatus('Er ging iets mis. Controleer je internetverbinding en probeer opnieuw.', 'error');
      } finally {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      }
    });
  }
})();
