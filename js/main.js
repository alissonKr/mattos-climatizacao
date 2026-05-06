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
// 6. CARROSSEL — display block/none, auto-play, dots
// ============================================================
(function () {
  const container = document.querySelector('.carrossel-container');
  if (!container) return;

  const slides  = container.querySelectorAll('.carrossel-slide');
  const btnPrev = container.querySelector('.carrossel-btn.prev');
  const btnNext = container.querySelector('.carrossel-btn.next');
  const dotsWrap = container.querySelector('.carrossel-dots');
  const total   = slides.length;
  let   atual   = 0;
  let   intervalo = null;

  // Cria dots dinamicamente
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i === 0 ? ' ativo' : '');
    dot.addEventListener('click', () => { pausar(); mostrarSlide(i); iniciar(); });
    dotsWrap.appendChild(dot);
  });

  const dots = dotsWrap.querySelectorAll('.dot');

  function mostrarSlide(index) {
    slides.forEach(s => s.classList.remove('ativo'));
    dots.forEach(d => d.classList.remove('ativo'));
    atual = (index + total) % total;
    slides[atual].classList.add('ativo');
    dots[atual].classList.add('ativo');
  }

  function avancar() { mostrarSlide(atual + 1); }
  function voltar()  { mostrarSlide(atual - 1); }

  function iniciar() { intervalo = setInterval(avancar, 6000); }
  function pausar()  { clearInterval(intervalo); }

  btnNext.addEventListener('click', () => { pausar(); avancar(); iniciar(); });
  btnPrev.addEventListener('click', () => { pausar(); voltar();  iniciar(); });

  container.addEventListener('mouseenter', pausar);
  container.addEventListener('mouseleave', iniciar);

  iniciar();
})();
