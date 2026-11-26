/* Confirmação de idade na primeira visita. A resposta "sim" fica guardada no navegador. */
const CHAVE = 'locomotiva-18';

export function iniciarIdade() {
  const janela = document.getElementById('idade');
  if (!janela || typeof janela.showModal !== 'function') return;
  let confirmado = false;
  try { confirmado = localStorage.getItem(CHAVE) === 'sim'; } catch (e) { /* sem armazenamento */ }
  if (confirmado) return;

  janela.addEventListener('cancel', (e) => e.preventDefault());
  janela.addEventListener('click', (e) => {
    const botao = e.target.closest('[data-idade]');
    if (!botao) return;
    if (botao.dataset.idade === 'sim') {
      try { localStorage.setItem(CHAVE, 'sim'); } catch (err) { /* segue sem guardar */ }
      janela.close();
    } else {
      janela.querySelector('.idade__nota').hidden = false;
      janela.querySelector('.idade__acoes').hidden = true;
    }
  });
  janela.showModal();
}
