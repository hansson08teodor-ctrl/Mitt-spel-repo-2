(function () {
  const status = document.getElementById('offline-status');
  let registration;
  let updating = false;
  function check() { navigator.serviceWorker.controller?.postMessage('CHECK_OFFLINE'); }
  window.offerDraftUpdate = () => {
    if (!registration?.waiting || (typeof phase !== 'undefined' && phase === 'game') || document.getElementById('update-app')) return;
    const button = document.createElement('button');
    button.id = 'update-app'; button.className = 'update'; button.textContent = 'Update available · Tap to reload';
    button.onclick = () => {
      // Recheck at click time: a match may have started since the prompt appeared.
      if (typeof phase !== 'undefined' && phase === 'game') return;
      updating = true; registration.waiting?.postMessage('SKIP_WAITING');
    };
    document.querySelector('.top').after(button);
  };
  document.addEventListener('click', () => {
    if (typeof phase !== 'undefined' && phase === 'game') document.getElementById('update-app')?.remove();
  });
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) {
    status.textContent = 'ONLINE ONLY'; return;
  }
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type === 'OFFLINE_STATUS') status.textContent = event.data.complete ? '● OFFLINE READY' : 'OFFLINE CACHE INCOMPLETE';
  });
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (updating) location.reload(); else check(); });
  navigator.serviceWorker.register('./sw.js').then(reg => {
    registration = reg;
    window.offerDraftUpdate();
    reg.addEventListener('updatefound', () => {
      const worker = reg.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed') { check(); window.offerDraftUpdate(); }
      });
    });
    return navigator.serviceWorker.ready;
  }).then(check).catch(() => { status.textContent = 'OFFLINE UNAVAILABLE'; });
})();
