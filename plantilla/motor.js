/* Arma la maqueta con window.MAQUETA (config.js de cada prospecto) + window.RUBROS. */
(function () {
  const C = window.MAQUETA || {};
  const R = Object.assign({}, window.RUBROS[C.rubro] || window.RUBROS.profesional, C.textos || {});
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const t = (s) => String(s || '').replace(/\{nombre\}/g, C.nombre || '').replace(/\{zona\}/g, C.zona || '');

  // Colores y fuentes
  const [c1, c2, suave] = C.colores || R.colores;
  const root = document.documentElement.style;
  root.setProperty('--c1', c1); root.setProperty('--c2', c2); root.setProperty('--suave', suave);
  const [ft, fc] = C.fuentes || R.fuentes;
  $('fuentes').href = 'https://fonts.googleapis.com/css2?family=' + ft.replace(/ /g, '+') + ':wght@600;700&family=' + fc.replace(/ /g, '+') + ':wght@400;700&display=swap';
  root.setProperty('--tit', `'${ft}', serif`); root.setProperty('--cuerpo', `'${fc}', system-ui, sans-serif`);

  document.title = (C.nombre || 'Maqueta') + ' · ' + t(R.etiqueta);

  // WhatsApp
  const num = String(C.whatsapp || '').replace(/\D/g, '');
  const wa = 'https://wa.me/' + num + '?text=' + encodeURIComponent(t(R.mensaje));
  ['ctaTop', 'ctaHero', 'ctaContacto', 'waFlotante'].forEach(id => { $(id).href = wa; });
  $('ctaHero').textContent = R.cta; $('ctaContacto').textContent = R.cta;

  // Fotos
  const F = C.fotos || {};
  const foto = (src, alt) => src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy">` : `<div class="sin-foto">${esc((C.nombre || '?')[0])}</div>`;
  $('logoLetra').innerHTML = F.logo ? `<img src="${esc(F.logo)}" alt="">` : esc((C.nombre || '?')[0]);
  $('heroFoto').innerHTML = foto(F.hero, C.nombre);
  $('nosFoto').innerHTML = foto(F.nosotros || F.hero, C.nombre);

  // Textos
  $('marcaNombre').textContent = C.nombre;
  $('heroEtiqueta').textContent = t(R.etiqueta);
  $('heroTitulo').textContent = t(R.titulo);
  $('heroBajada').textContent = t(R.bajada);
  $('sellos').innerHTML = R.sellos.map(s => `<li>✓ ${esc(t(s))}</li>`).join('');
  $('serviciosTitulo').textContent = t(R.serviciosTitulo);
  $('servicios-lista').innerHTML = R.servicios.map(([ico, tit, txt, precio]) =>
    `<div class="servicio aparecer"><div class="ico">${ico}</div><h3>${esc(t(tit))}</h3><p>${esc(t(txt))}</p>${precio ? `<span class="precio">${esc(precio)}</span>` : ''}</div>`).join('');
  $('nosTitulo').textContent = t(R.nosTitulo);
  $('nosTexto').textContent = t(R.nosTexto);
  $('pasos').innerHTML = R.pasos.map((p, i) => `<li><b class="n">${i + 1}</b><span>${esc(t(p))}</span></li>`).join('');

  const gal = F.galeria || [];
  if (gal.length) $('galeria-lista').innerHTML = gal.slice(0, 9).map(g => `<div class="aparecer"><img src="${esc(g)}" alt="" loading="lazy"></div>`).join('');
  else $('galeria').style.display = 'none';
  if (C.instagram) { const u = C.instagram.replace(/^@/, ''); $('linkIg').href = 'https://instagram.com/' + u; $('linkIg').textContent = 'Seguinos en Instagram @' + u + ' →'; }

  $('opiniones-lista').innerHTML = R.opiniones.map(([txt, quien]) => `<div class="opinion aparecer"><div class="estrellas">★★★★★</div><p>“${esc(t(txt))}”</p><b>${esc(quien)}</b></div>`).join('');

  $('contactoTitulo').textContent = t(R.contactoTitulo);
  const datos = [];
  if (C.direccion) datos.push(['📍', C.direccion]); else if (C.zona) datos.push(['📍', C.zona]);
  if (C.horarios) datos.push(['🕒', C.horarios]);
  if (num) datos.push(['💬', 'WhatsApp ' + (C.whatsappVisible || '+' + num)]);
  if (C.instagram) datos.push(['📸', '@' + C.instagram.replace(/^@/, '')]);
  $('datos').innerHTML = datos.map(([i, d]) => `<li><span>${i}</span>${esc(d)}</li>`).join('');
  $('mapa').src = 'https://maps.google.com/maps?q=' + encodeURIComponent(C.direccion || C.zona || 'Buenos Aires') + '&z=14&output=embed';

  $('pieNombre').textContent = C.nombre; $('pieZona').textContent = C.zona;

  // Animación al hacer scroll
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } }), { threshold: .12 }) : null;
  document.querySelectorAll('.aparecer').forEach(el => io ? io.observe(el) : el.classList.add('visto'));
})();
