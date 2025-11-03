// === app.js ===

const scriptURL = "https://script.google.com/macros/s/AKfycbx-djrCLF2funuELHhFR9YQgGdkOlQYbcy_hipi1EgUsJ_iYIzHsEqdhuDPAgcp4SxVQA/exec"; // mantenha o mesmo link /exec

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init() {
  // Página inicial: botões de eventos
  const evtBtns = document.querySelectorAll('.evt-btn');
  if (evtBtns.length) {
    evtBtns.forEach(b => {
      b.addEventListener('click', () => {
        const ev = b.dataset.evento;
        location.href = `presenca.html?evento=${encodeURIComponent(ev)}`;
      });
    });
    return;
  }

  // Página de presença
  const params = new URLSearchParams(location.search);
  const evento = params.get('evento') || 'RG';
  const titulo = document.getElementById('titulo');
  const subtitulo = document.getElementById('subtitulo');
  if (titulo) titulo.textContent = `Registrar Presença - ${evento}`;
  if (subtitulo) subtitulo.textContent = evento;

  const btn = document.getElementById('registrar');
  btn.addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem');

    if (!nome) {
      mensagem.className = 'error';
      mensagem.textContent = '⚠️ Selecione seu nome.';
      return;
    }

    const data = new URLSearchParams();
    data.append('nome', nome);
    data.append('evento', evento);

    try {
      const res = await fetch(scriptURL, { method: 'POST', body: data });
      if (!res.ok) throw new Error('Erro HTTP: ' + res.status);
      const text = await res.text();
      mensagem.className = 'success';
      mensagem.textContent = `✅ Presença registrada: ${nome} (${evento})`;

      setTimeout(() => location.href = 'index.html', 1500);
    } catch (err) {
      mensagem.className = 'error';
      mensagem.textContent = '❌ Erro ao registrar presença.';
      console.error(err);
    }
  });
}

// Service Worker opcional
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW falhou', e));
  });
}
