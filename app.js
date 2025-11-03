// app.js - comportamento compartilhado
const scriptURL = "https://script.google.com/macros/s/AKfycbyLquxC7YDiFadMNGNASTadLVp9qqF4_K3V2Zxtfa1NiZi_eA82E0YKCqlHOkVKyWYl/exec"; // <<=============================================================================

/* --- navegação entre index.html e presenca.html --- */
if (document.readyState !== 'loading') init();
else document.addEventListener('DOMContentLoaded', init);

function init(){
  // se estamos na index.html: vincula botões
  const evtBtns = document.querySelectorAll('.evt-btn');
  if(evtBtns && evtBtns.length){
    evtBtns.forEach(b=>{
      b.addEventListener('click', ()=> {
        const ev = b.dataset.evento;
        // abre presenca.html com query string
        location.href = `presenca.html?evento=${encodeURIComponent(ev)}`;
      });
    });
    return;
  }

  // se estamos em presenca.html: prepara formulário
  const params = new URLSearchParams(location.search);
  const evento = params.get('evento') || 'RG';
  const titulo = document.getElementById('titulo');
  const subtitulo = document.getElementById('subtitulo');
  if(titulo) titulo.textContent = `Registrar Presença - ${evento}`;
  if(subtitulo) subtitulo.textContent = evento;

  // enviar presença
  const btn = document.getElementById('registrar');
  btn.addEventListener('click', async ()=>{
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem');

    if(!nome){
      mensagem.className = 'error';
      mensagem.textContent = '⚠️ Selecione seu nome.';
      return;
    }

    // construir formulário para enviar
    const data = new URLSearchParams();
    data.append('nome', nome);
    data.append('evento', evento);
    data.append('timestamp', new Date().toISOString());

    try{
      const res = await fetch(scriptURL, { method: 'POST', body: data });
      if(!res.ok) throw new Error('Resposta do servidor: ' + res.status);
      const text = await res.text();
      mensagem.className = 'success';
      mensagem.textContent = `✅ Presença registrada: ${nome} (${evento})`;
      // limpa seleção por 2s e volta para index depois de 1.5s
      setTimeout(()=> location.href = 'index.html', 1500);
    }catch(err){
      mensagem.className = 'error';
      mensagem.textContent = '❌ Erro ao registrar. Verifique conexão/URL do script.';
      console.error(err);
    }
  });
}

/* --- registro do service worker (opcional) --- */
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('sw.js').catch(e=>console.warn('SW failed', e));
  });
}
