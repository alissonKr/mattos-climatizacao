// main.js — Mattos Climatização

const HEADER_HEIGHT = 70;

// ============================================================
// 1. HEADER SCROLL — adiciona classe "scrolled" ao rolar
// ============================================================
const header = document.getElementById('header');

function atualizarHeader() {
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', atualizarHeader, { passive: true });
atualizarHeader();

// ============================================================
// 2. MENU MOBILE — hamburguer abre/fecha nav
// ============================================================
const hamburger = document.querySelector('.header__hamburger');
const navLista  = document.getElementById('header-nav-lista');

hamburger.addEventListener('click', () => {
  const aberto = navLista.classList.toggle('aberto');
  hamburger.classList.toggle('ativo', aberto);
  hamburger.setAttribute('aria-expanded', String(aberto));
});

// Fecha o menu ao clicar em qualquer link
navLista.querySelectorAll('.header__nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLista.classList.remove('aberto');
    hamburger.classList.remove('ativo');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// 3. SCROLL SUAVE COM OFFSET do header fixo
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(ancora => {
  ancora.addEventListener('click', evento => {
    const alvo = document.querySelector(ancora.getAttribute('href'));
    if (!alvo) return;
    evento.preventDefault();
    const topo = alvo.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;
    window.scrollTo({ top: topo, behavior: 'smooth' });
  });
});

// ============================================================
// 4. ANIMAÇÃO DE ENTRADA — IntersectionObserver
// ============================================================
const elementosAnimados = document.querySelectorAll(
  '.servico-card, .sobre__container, .atendimento__container, .contato__container'
);

const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visivel');
        observador.unobserve(entrada.target);
      }
    });
  },
  { threshold: 0.15 }
);

elementosAnimados.forEach(el => observador.observe(el));

// ============================================================
// 5. BOTÃO WHATSAPP FLUTUANTE — aparece após 300px de scroll
// ============================================================
const btnFlutuante = document.querySelector('.whatsapp-flutuante');

function atualizarBtnFlutuante() {
  if (window.scrollY > 300) {
    btnFlutuante.classList.add('visivel');
  } else {
    btnFlutuante.classList.remove('visivel');
  }
}

window.addEventListener('scroll', atualizarBtnFlutuante, { passive: true });
atualizarBtnFlutuante();

// ============================================================
// 6. COVERFLOW 3D
// ============================================================
(function () {
  const track = document.querySelector('.coverflow-track');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.cf-slide'));
  const total  = slides.length;
  let currentIndex = 0;
  let dragStartX = null;

  function updateCoverflow() {
    slides.forEach((slide, i) => {
      slide.classList.remove('ativo', 'lado-1-esq', 'lado-1-dir', 'lado-2-esq', 'lado-2-dir', 'oculto');
      const diff = i - currentIndex;
      if (diff === 0)       slide.classList.add('ativo');
      else if (diff === -1) slide.classList.add('lado-1-esq');
      else if (diff === 1)  slide.classList.add('lado-1-dir');
      else if (diff === -2) slide.classList.add('lado-2-esq');
      else if (diff === 2)  slide.classList.add('lado-2-dir');
      else                  slide.classList.add('oculto');
    });
  }

  slides.forEach((slide, i) => {
    slide.addEventListener('click', () => {
      if (i !== currentIndex) {
        currentIndex = i;
        updateCoverflow();
      }
    });
  });

  track.addEventListener('mousedown', e => { dragStartX = e.clientX; });
  track.addEventListener('mousemove', e => { if (dragStartX !== null) e.preventDefault(); });
  track.addEventListener('mouseup', e => {
    if (dragStartX === null) return;
    const delta = e.clientX - dragStartX;
    dragStartX = null;
    if (delta > 80 && currentIndex > 0)             { currentIndex--; updateCoverflow(); }
    else if (delta < -80 && currentIndex < total - 1) { currentIndex++; updateCoverflow(); }
  });
  track.addEventListener('mouseleave', () => { dragStartX = null; });

  track.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchmove',  e => { e.preventDefault(); }, { passive: false });
  track.addEventListener('touchend',   e => {
    if (dragStartX === null) return;
    const delta = e.changedTouches[0].clientX - dragStartX;
    dragStartX = null;
    if (delta > 80 && currentIndex > 0)             { currentIndex--; updateCoverflow(); }
    else if (delta < -80 && currentIndex < total - 1) { currentIndex++; updateCoverflow(); }
  });

  updateCoverflow();
})();
