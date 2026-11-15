'use strict';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const layers = [...document.querySelectorAll('[data-depth]')];
const motionButton = document.querySelector('.motion');
const languageButtons = [...document.querySelectorAll('[data-lang]')];
let language = 'es';
let motionEnabled = !reducedMotion.matches;
let frame = 0;
let currentX = 0, currentY = 0, targetX = 0, targetY = 0;
function updateMotionLabel() {
 motionButton.setAttribute('aria-pressed', String(motionEnabled));
 document.querySelector('#motion-label').textContent = language === 'es' ? `Movimiento ${motionEnabled ? 'sí' : 'no'}` : `Motion ${motionEnabled ? 'on' : 'off'}`;
}
function resetMotion() {
 cancelAnimationFrame(frame); frame = 0;
 targetX = targetY = currentX = currentY = 0;
 layers.forEach(layer => { layer.style.transform = ''; });
}
function animate() {
 currentX += (targetX - currentX) * .055;
 currentY += (targetY - currentY) * .055;
 layers.forEach(layer => {
  const depth = Number(layer.dataset.depth);
  layer.style.transform = `translate3d(${currentX * depth}px,${currentY * depth}px,0)`;
 });
 if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .001) frame = requestAnimationFrame(animate);
 else frame = 0;
}
function schedule() { if (!frame) frame = requestAnimationFrame(animate); }
window.addEventListener('pointermove', event => {
 if (!motionEnabled || !finePointer.matches || event.pointerType === 'touch') return;
 targetX = (event.clientX / innerWidth - .5) * 2;
 targetY = (event.clientY / innerHeight - .5) * 2;
 schedule();
}, { passive: true });
document.documentElement.addEventListener('pointerleave', () => { if (motionEnabled) { targetX = targetY = 0; schedule(); } });
document.addEventListener('visibilitychange', () => { if (document.hidden) resetMotion(); });
motionButton.addEventListener('click', () => { motionEnabled = !motionEnabled; resetMotion(); updateMotionLabel(); });
reducedMotion.addEventListener('change', () => { motionEnabled = !reducedMotion.matches; resetMotion(); updateMotionLabel(); });
finePointer.addEventListener('change', resetMotion);
languageButtons.forEach(button => button.addEventListener('click', () => {
 language = button.dataset.lang;
 document.documentElement.lang = language;
 document.querySelectorAll('[data-es][data-en]').forEach(element => { element.textContent = element.dataset[language].replaceAll('\\n', '\n'); });
 languageButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
 document.title = language === 'es' ? 'BROLES atelier | Estudio de videojuegos' : 'BROLES atelier | Independent game studio';
 document.querySelector('.destinations').setAttribute('aria-label', language === 'es' ? 'Plataformas' : 'Platforms');
 document.querySelector('.about').setAttribute('aria-label', language === 'es' ? 'El estudio' : 'The studio');
 updateMotionLabel();
}));
document.querySelector('#year').textContent = String(new Date().getFullYear());
updateMotionLabel();
