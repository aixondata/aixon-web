// forms.js — Modal, formulario Formspree y botones de planes

(function () {
  'use strict';

  // ── Modal ──────────────────────────────────────────────────────────────────
  window.abrirModal = function (plan) {
    var modal = document.getElementById('modal-sesion');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Si se abrió desde un plan, preseleccionar servicio
    if (plan) {
      var sel = document.querySelector('[name="servicio"]');
      if (sel) {
        for (var i = 0; i < sel.options.length; i++) {
          if (sel.options[i].text.toLowerCase().indexOf(plan.toLowerCase()) !== -1) {
            sel.selectedIndex = i;
            break;
          }
        }
        var msg = document.querySelector('[name="mensaje"]');
        if (msg && !msg.value) msg.value = 'Estoy interesado en el plan ' + plan + '.';
      }
    }
    // Reset estado
    document.getElementById('form-success').style.display = 'none';
    document.getElementById('form-sesion').style.display = 'block';
  };

  window.cerrarModal = function () {
    var modal = document.getElementById('modal-sesion');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  // Cerrar con Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.cerrarModal();
  });

  // Cerrar al hacer clic fuera del card
  document.addEventListener('click', function (e) {
    var modal = document.getElementById('modal-sesion');
    if (e.target === modal) window.cerrarModal();
  });

  document.addEventListener('DOMContentLoaded', function () {

    // ── Envío AJAX a Formspree ─────────────────────────────────────────────
    var form = document.getElementById('form-sesion');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = document.getElementById('btn-enviar');
        btn.textContent = 'Enviando…';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        var data = new FormData(form);

        fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              document.getElementById('form-sesion').style.display = 'none';
              document.getElementById('form-success').style.display = 'block';
            } else {
              return res.json().then(function (json) { throw json; });
            }
          })
          .catch(function () {
            btn.textContent = 'Error al enviar. Intenta de nuevo';
            btn.disabled = false;
            btn.style.opacity = '1';
          });
      });
    }

    // ── Botones de planes ──────────────────────────────────────────────────
    document.querySelectorAll('.plan-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var plan = btn.closest('.plan').querySelector('.plan-tier').textContent.trim();
        window.abrirModal(plan);
      });
    });

    // ── Ripple en botones ──────────────────────────────────────────────────
    document.querySelectorAll('.btn-main, .btn-ghost').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.style.cssText = 'position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);transform:scale(0);animation:ripple .6s linear;pointer-events:none;width:100px;height:100px;left:' + (e.clientX - rect.left - 50) + 'px;top:' + (e.clientY - rect.top - 50) + 'px';
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 700);
      });
    });
  });

  // Keyframe ripple
  var style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(style);
})();
