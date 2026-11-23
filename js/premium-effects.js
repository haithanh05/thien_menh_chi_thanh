(function () {
  'use strict';

  const MAX_TRAIL_PARTICLES = 28;
  const TRANSITION_MS = 220;
  const pageFiles = new Set(['index.html', 'gallery.html', 'tongmon.html', 'admin.html']);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initCursorTrail() {
    if (reducedMotion) return;
    const layer = document.createElement('div');
    layer.className = 'qi-cursor-layer';
    layer.setAttribute('aria-hidden', 'true');
    const particles = [];
    for (let index = 0; index < MAX_TRAIL_PARTICLES; index += 1) {
      const particle = document.createElement('span');
      particle.className = `qi-cursor-particle${index % 3 === 0 ? ' is-gold' : ''}`;
      layer.appendChild(particle);
      particles.push(particle);
    }
    document.body.appendChild(layer);

    let cursor = 0;
    let touchPointerId = null;
    let lastX = 0;
    let lastY = 0;
    let hidden = document.hidden;
    const emit = (x, y) => {
      if (hidden) return;
      const particle = particles[cursor];
      cursor = (cursor + 1) % particles.length;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.transform = 'translate3d(-50%, -50%, 0) scale(1)';
      particle.style.opacity = '0.86';
      window.setTimeout(() => {
        particle.style.opacity = '0';
        particle.style.transform = 'translate3d(-50%, -50%, 0) scale(0.12)';
      }, 24);
    };

    window.addEventListener('pointerdown', event => {
      if (event.pointerType === 'touch') touchPointerId = event.pointerId;
      lastX = event.clientX;
      lastY = event.clientY;
      emit(lastX, lastY);
    }, { passive: true });
    window.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' && event.pointerId !== touchPointerId) return;
      const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
      if (distance < 7) return;
      lastX = event.clientX;
      lastY = event.clientY;
      emit(lastX, lastY);
    }, { passive: true });
    window.addEventListener('pointerup', event => {
      if (event.pointerId === touchPointerId) touchPointerId = null;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      hidden = document.hidden;
      layer.classList.toggle('is-suspended', hidden);
    });
  }

  function initPageTransitions() {
    const veil = document.createElement('div');
    veil.className = 'world-transition-veil';
    veil.setAttribute('aria-hidden', 'true');
    document.body.appendChild(veil);
    document.addEventListener('click', event => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!link || event.defaultPrevented || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
          link.target && link.target !== '_self' || link.hasAttribute('download')) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin ||
          !pageFiles.has(destination.pathname.split('/').pop()) ||
          destination.pathname === window.location.pathname) return;
      event.preventDefault();
      veil.classList.add('is-leaving');
      window.setTimeout(() => window.location.assign(destination.href), TRANSITION_MS);
    });
  }

  function initScrollReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const cards = document.querySelectorAll(
      '.stage-section, .rpg-card, .public-leaderboard-card, .genesis-card-wrapper, .ticket-form-card, .souvenir-ticket'
    );
    if (!cards.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const card = entry.target;
        if (entry.isIntersecting) {
          card.classList.add('qi-revealed');
          card.querySelector('.qi-sheen')?.style.setProperty('animation-play-state', 'running');
        } else {
          card.querySelector('.qi-sheen')?.style.setProperty('animation-play-state', 'paused');
        }
      });
    }, { threshold: 0.08, rootMargin: '80px 0px' });
    cards.forEach(card => {
      card.classList.add('qi-reveal');
      if (!card.querySelector('.qi-sheen')) {
        const sheen = document.createElement('span');
        sheen.className = 'qi-sheen';
        sheen.setAttribute('aria-hidden', 'true');
        card.appendChild(sheen);
      }
      observer.observe(card);
    });
  }

  function initTilt() {
    const heroCard = document.getElementById('genesis-card');
    if (heroCard && !reducedMotion) {
      const setTilt = (x, y) => {
        const rotateY = Math.max(-6, Math.min(6, (x / Math.max(1, window.innerWidth) - 0.5) * 12));
        const rotateX = Math.max(-5, Math.min(5, (0.5 - y / Math.max(1, window.innerHeight)) * 10));
        heroCard.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        heroCard.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        heroCard.style.setProperty('--glint-x', `${Math.round(x / Math.max(1, window.innerWidth) * 100)}%`);
        heroCard.style.setProperty('--glint-y', `${Math.round(y / Math.max(1, window.innerHeight) * 100)}%`);
      };
      heroCard.addEventListener('pointermove', event => {
        if (event.pointerType !== 'touch') setTilt(event.clientX, event.clientY);
      }, { passive: true });
      heroCard.addEventListener('pointerleave', () => {
        heroCard.style.setProperty('--tilt-x', '0deg');
        heroCard.style.setProperty('--tilt-y', '0deg');
      }, { passive: true });
      window.addEventListener('deviceorientation', event => {
        if (event.gamma == null || event.beta == null) return;
        const x = window.innerWidth * (0.5 + Math.max(-25, Math.min(25, event.gamma)) / 50);
        const y = window.innerHeight * (0.5 + Math.max(-25, Math.min(25, event.beta - 35)) / 50);
        setTilt(x, y);
      }, { passive: true });
    }

    const ticket = document.getElementById('souvenir-ticket');
    if (ticket && !reducedMotion) {
      ticket.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch') return;
        const rotateY = Math.max(-5, Math.min(5, (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 10));
        const rotateX = Math.max(-4, Math.min(4, (0.5 - event.clientY / Math.max(1, window.innerHeight)) * 8));
        ticket.style.setProperty('--holo-x', `${rotateX.toFixed(2)}deg`);
        ticket.style.setProperty('--holo-y', `${rotateY.toFixed(2)}deg`);
        ticket.style.setProperty('--holo-opacity', '0.72');
      }, { passive: true });
      ticket.addEventListener('pointerleave', () => {
        ticket.style.setProperty('--holo-x', '0deg');
        ticket.style.setProperty('--holo-y', '0deg');
        ticket.style.setProperty('--holo-opacity', '0');
      }, { passive: true });
    }
  }

  function start() {
    initCursorTrail();
    initPageTransitions();
    initScrollReveal();
    initTilt();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
