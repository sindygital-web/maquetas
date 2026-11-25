/* Gina House of Beauty: animaciones de scroll */
(function () {
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = function () { return innerWidth < 900; };
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1); };

  // barra de progreso + botón flotante (un solo manejador)
  var bar = document.querySelector('.progress'), wa = document.querySelector('.float-wa'), tick = false;
  addEventListener('scroll', function () {
    if (tick) return; tick = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
      if (wa) wa.classList.toggle('show', scrollY > innerHeight * 0.6);
      tick = false;
    });
  }, { passive: true });

  // experiencia: la foto cambia según el paso (sin GSAP, funciona siempre)
  var pasos = [].slice.call(document.querySelectorAll('.paso')), fotos = [].slice.call(document.querySelectorAll('.rf'));
  if ('IntersectionObserver' in window && pasos.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting || isMobile()) return;
        var i = +e.target.dataset.i;
        pasos.forEach(function (p, k) { p.classList.toggle('is-on', k === i); });
        fotos.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    pasos.forEach(function (p) { io.observe(p); });
  }
  // en celu las fotos rotan solas
  if (fotos.length) setInterval(function () {
    if (!isMobile() || document.hidden) return;
    var i = fotos.findIndex(function (f) { return f.classList.contains('is-on'); });
    fotos[i].classList.remove('is-on'); fotos[(i + 1) % fotos.length].classList.add('is-on');
  }, 3200);

  function splitWords(el) {
    var out = [];
    [].slice.call(el.childNodes).forEach(function (c) {
      if (c.nodeType === 3) {
        var f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(function (t) {
          if (!t) return;
          if (/^\s+$/.test(t)) { f.appendChild(document.createTextNode(' ')); return; }
          var o = document.createElement('span'); o.className = 'sw';
          var i = document.createElement('span'); i.textContent = t; o.appendChild(i); f.appendChild(o); out.push(i);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1) out = out.concat(splitWords(c));
    });
    return out;
  }

  function initMotion() {
    if (RM || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis && !isMobile()) {
      var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (ev) { var t = document.querySelector(a.getAttribute('href')); if (t) { ev.preventDefault(); lenis.scrollTo(t, { offset: -70 }); } });
      });
    }
    gsap.to('.hero-bg', { yPercent: isMobile() ? 12 : 6, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-txt', { yPercent: -16, opacity: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    document.querySelectorAll('.h2s').forEach(function (el) {
      gsap.from(splitWords(el), { yPercent: 115, rotate: 4, duration: 1.1, ease: 'expo.out', stagger: 0.045, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });
    document.querySelectorAll('.frase').forEach(function (el) {
      gsap.fromTo(splitWords(el), { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    });
    ScrollTrigger.batch('.rv', { start: 'top 92%', once: true, onEnter: function (b) { gsap.from(b, { autoAlpha: 0, y: 36, duration: 1, ease: 'expo.out', stagger: 0.08 }); } });
    document.querySelectorAll('.foto-rev').forEach(function (f) {
      var img = f.querySelector('img');
      gsap.from(f, { clipPath: 'inset(100% 0% 0% 0% round 28px)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 80%' } });
      gsap.from(img, { scale: 1.15, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 80%' } });
    });
    document.querySelectorAll('.cinta-t').forEach(function (t) {
      var tw = gsap.fromTo(t, { xPercent: 0 }, { xPercent: -50, duration: 26, ease: 'none', repeat: -1 });
      ScrollTrigger.create({ onUpdate: function (s) { var v = Math.min(Math.abs(s.getVelocity()) / 400, 5); gsap.to(tw, { timeScale: 1 + v, duration: 0.2, overwrite: true }); gsap.to(tw, { timeScale: 1, duration: 1.2, delay: 0.2 }); } });
    });
  }

  function initPointer() {
    if (!matchMedia('(hover:hover) and (pointer:fine)').matches || RM || !window.gsap) return;
    document.querySelectorAll('.btn.mag').forEach(function (b) {
      b.addEventListener('mousemove', function (ev) { var r = b.getBoundingClientRect(); gsap.to(b, { x: (ev.clientX - r.left - r.width / 2) * 0.25, y: (ev.clientY - r.top - r.height / 2) * 0.35, duration: 0.4 }); });
      b.addEventListener('mouseleave', function () { gsap.to(b, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }); });
    });
  }

  idle(function () { initMotion(); initPointer(); }, { timeout: 900 });
  addEventListener('load', function () { idle(function () { document.querySelectorAll('img[loading=lazy]').forEach(function (im) { im.loading = 'eager'; }); }, { timeout: 2000 }); });
})();
