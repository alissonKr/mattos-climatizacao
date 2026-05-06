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
// 6. CARROSSEL — auto-play, pausa no hover, loop infinito
// ============================================================
(function () {
  const trilha      = document.getElementById('carrosselTrilha');
  const container   = document.querySelector('.carrossel');
  const btnPrev     = document.querySelector('.carrossel__btn--prev');
  const btnNext     = document.querySelector('.carrossel__btn--next');
  const wrapIndicadores = document.getElementById('carrosselIndicadores');

  if (!trilha) return;

  const slides    = trilha.querySelectorAll('.carrossel__slide');
  const total     = slides.length;
  let   atual     = 0;
  let   intervalo = null;

  // Cria bolinhas
  slides.forEach((_, i) => {
    const bolinha = document.createElement('button');
    bolinha.className = 'carrossel__bolinha' + (i === 0 ? ' ativa' : '');
    bolinha.setAttribute('role', 'tab');
    bolinha.setAttribute('aria-label', `Ir para imagem ${i + 1}`);
    bolinha.addEventListener('click', () => irPara(i));
    wrapIndicadores.appendChild(bolinha);
  });

  const bolinhas = wrapIndicadores.querySelectorAll('.carrossel__bolinha');

  function irPara(indice) {
    atual = (indice + total) % total;
    trilha.style.transform = `translateX(-${atual * 100}%)`;
    bolinhas.forEach((b, i) => b.classList.toggle('ativa', i === atual));
  }

  function avancar() { irPara(atual + 1); }
  function voltar()  { irPara(atual - 1); }

  function iniciarAutoPlay() {
    intervalo = setInterval(avancar, 3000);
  }

  function pausarAutoPlay() {
    clearInterval(intervalo);
  }

  btnNext.addEventListener('click', () => { pausarAutoPlay(); avancar(); iniciarAutoPlay(); });
  btnPrev.addEventListener('click', () => { pausarAutoPlay(); voltar();  iniciarAutoPlay(); });

  container.addEventListener('mouseenter', pausarAutoPlay);
  container.addEventListener('mouseleave', iniciarAutoPlay);

  iniciarAutoPlay();
})();
