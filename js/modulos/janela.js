/* Janela única para fichas de produto e artigos, abertas por [data-produto] e [data-artigo].
   Links [data-whats] abrem o WhatsApp com a mensagem pronta. */
import { PRODUTOS, ARTIGOS } from './conteudo.js';
import { WHATSAPP_NUMERO } from '../config.js';

export const linkWhats = (msg) => `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(msg)}`;

const seta = '<svg width="14" height="14" aria-hidden="true"><use href="#i-seta"/></svg>';
const whats = '<svg width="18" height="18" aria-hidden="true"><use href="#i-whats"/></svg>';

function ficha(p) {
  const msg = `Olá! Vim pelo site e quero saber mais sobre o ${p.nome}.`;
  return `<article class="ficha">
    <img src="${p.foto}" alt="${p.nome}" width="900" height="1150">
    <div class="ficha__texto">
      <p class="rotulo">${p.linha}</p>
      <h2 class="titulo" id="janela-titulo">${p.nome}</h2>
      <p>${p.texto}</p>
      <dl class="ficha__dados">${p.dados.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
      <ul class="ficha__notas" aria-label="Notas">${p.notas.map((n) => `<li>${n}</li>`).join('')}</ul>
      <p><strong style="color:var(--ouro);font-weight:600">Como servir:</strong> ${p.servir}</p>
      <a class="botao botao--ouro" href="${linkWhats(msg)}" target="_blank" rel="noopener">${whats} Consultar disponibilidade</a>
    </div>
  </article>`;
}

function artigo(a) {
  const extra = a.whats ? `<p style="margin-top:2rem"><a class="botao botao--ouro" href="${linkWhats(a.whats)}" target="_blank" rel="noopener">${whats} Falar no WhatsApp</a></p>` : '';
  return `<article class="artigo"><p class="rotulo">Locomotiva</p><h2 class="titulo titulo--m" id="janela-titulo">${a.titulo}</h2>${a.corpo}${extra}
    <p style="margin-top:2.2rem"><a class="link-ouro" href="#colecao" data-fechar>Ver a coleção ${seta}</a></p></article>`;
}

export function iniciarJanelas() {
  document.querySelectorAll('[data-whats]').forEach((a) => {
    a.href = linkWhats(a.dataset.whats);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  const janela = document.getElementById('janela');
  if (!janela || typeof janela.showModal !== 'function') return;
  const corpo = janela.querySelector('.janela__corpo');
  let origem = null;

  const abrir = (html, botao) => {
    origem = botao;
    corpo.innerHTML = html;
    janela.showModal();
    janela.scrollTop = 0;
  };

  document.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-produto], [data-artigo]');
    if (!botao) return;
    const p = PRODUTOS[botao.dataset.produto];
    const a = ARTIGOS[botao.dataset.artigo];
    if (p) abrir(ficha(p), botao);
    else if (a) abrir(artigo(a), botao);
  });

  janela.querySelector('.janela__fechar').addEventListener('click', () => janela.close());
  janela.addEventListener('click', (e) => {
    if (e.target === janela || e.target.closest('[data-fechar]')) janela.close();
  });
  janela.addEventListener('close', () => { if (origem && document.contains(origem)) origem.focus({ preventScroll: true }); });
}
