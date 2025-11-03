// === app.js ===

const scriptURL = "https://script.google.com/macros/s/AKfycbzJPCBQJTW_TaQMpTfonNUdawX730e67y9fgFbHZVlGUVQVI1mV34BDsOnAgy9dY0Yxow/exec"; // seu link /exec

if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init() {
  // Página inicial (index.html): botões de eventos
  const evtBtns = document.querySelectorAll('.evt-btn');
  if (evtBtns.length) {
    evtBtns.forEach(b => {
      b.addEventListener('click', () => {
        const ev = b.dataset.evento;
        // abre a página de presença com o tipo de evento na URL
        location.href = `presenca.html?evento=${encodeURIComponent(ev)}`;
      });
    });
    return;
  }

  // Página de presença (presenca.html)
  const params = new URLSearchParams(location.search);
  const evento = params.get('evento') || 'RG'; // lê o evento da URL
  const titulo = document.getElementById('titulo');
  const subtitulo = document.getElementById('subtitulo');
  if (titulo) titulo.textContent = `Registrar Presença - ${evento}`;
  if (subtitulo) subtitulo.textContent = evento;

  // Botão de envio
  const btn = document.getElementById('registrar');
  btn.addEventListener('click', async () => {
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem');

    if (!nome) {
      mensagem.className = 'error';
      mensagem.textContent = '⚠️ Selecione seu nome.';
      return;
    }

    // Monta o corpo da requisição com nome + evento
    const data = new URLSearchParams();
    data.append('nome', nome);
    data.append('evento', evento);

    try {
      const res = await fetch(scriptURL, { method: 'POST', body: data });
      if (!res.ok) throw new Error('Erro HTTP: ' + res.status);
      const text = await res.text();
      mensagem.className = 'success';
      mensagem.textContent = `✅ Presença registrada: ${nome} (${evento})`;
      console.log(text);

      // Volta para tela inicial após 1.5s
      setTimeout(() => location.href = 'index.html', 1500);
    } catch (err) {
      mensagem.className = 'error';
      mensagem.textContent = '❌ Erro ao registrar presença.';
      console.error(err);
    }
  });
}
