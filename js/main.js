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
const slides = document.querySelectorAll('.cf-slide');
const cover = document.getElementById('coverflow');
let current = 0;
let dragStartX = null;

function updateCoverflow() {
  slides.forEach((slide, i) => {
    const offset = i - current;
    const absOffset = Math.abs(offset);
    if (absOffset > 3) {
      slide.style.opacity = '0';
      slide.style.zIndex = '0';
      return;
    }
    const translateX = offset * 600;
    const rotateY = offset * -40;
    const scale = absOffset === 0 ? 1 : absOffset === 1 ? 0.78 : 0.58;
    const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.7 : 0.4;
    const zIndex = 10 - absOffset;
    slide.style.transform = `translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`;
    slide.style.opacity = opacity;
    slide.style.zIndex = zIndex;
  });
}

if (cover) {
  cover.addEventListener('mousedown', e => { dragStartX = e.clientX; cover.style.cursor = 'grabbing'; });
  cover.addEventListener('mouseup', e => {
    if (dragStartX === null) return;
    const delta = dragStartX - e.clientX;
    if (delta > 60 && current < slides.length - 1) current++;
    else if (delta < -60 && current > 0) current--;
    dragStartX = null;
    cover.style.cursor = 'grab';
    updateCoverflow();
  });
  cover.addEventListener('mouseleave', () => { dragStartX = null; cover.style.cursor = 'grab'; });
  cover.addEventListener('touchstart', e => { dragStartX = e.touches[0].clientX; }, { passive: true });
  cover.addEventListener('touchend', e => {
    if (dragStartX === null) return;
    const delta = dragStartX - e.changedTouches[0].clientX;
    if (delta > 50 && current < slides.length - 1) current++;
    else if (delta < -50 && current > 0) current--;
    dragStartX = null;
    updateCoverflow();
  });
  updateCoverflow();
}
