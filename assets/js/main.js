// Toggle del menú móvil. Sin dependencias.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Cierra el menú al elegir un enlace (útil en móvil).
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
});

// Visor de imágenes (modal) para las páginas de galería.
document.addEventListener('DOMContentLoaded', function () {
  var dialog = document.getElementById('lightbox');
  if (!dialog) return;

  var pins = Array.prototype.slice.call(document.querySelectorAll('.pin'));
  var img = document.getElementById('lightboxImg');
  var count = document.getElementById('lightboxCount');
  var current = 0;

  function preload(i) {
    var pin = pins[(i + pins.length) % pins.length];
    if (pin) new Image().src = pin.href;
  }

  function show(i) {
    current = (i + pins.length) % pins.length;
    var pin = pins[current];
    img.src = pin.href;
    img.alt = pin.querySelector('img').alt;
    count.textContent = (current + 1) + ' / ' + pins.length;
    preload(current + 1);
    preload(current - 1);
  }

  pins.forEach(function (pin, i) {
    pin.addEventListener('click', function (e) {
      e.preventDefault();
      show(i);
      dialog.showModal();
    });
  });

  document.getElementById('lightboxClose').addEventListener('click', function () { dialog.close(); });
  document.getElementById('lightboxPrev').addEventListener('click', function () { show(current - 1); });
  document.getElementById('lightboxNext').addEventListener('click', function () { show(current + 1); });

  // Clic fuera de la foto cierra el visor.
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target.tagName === 'FIGURE') dialog.close();
  });

  // Flechas del teclado (Esc ya lo maneja <dialog>).
  dialog.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // Deslizar en móvil.
  var startX = null;
  dialog.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
  dialog.addEventListener('touchend', function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  // Al cerrar, regresa el foco a la foto que se abrió.
  dialog.addEventListener('close', function () { pins[current].focus(); });
});
