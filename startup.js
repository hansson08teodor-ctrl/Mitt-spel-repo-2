(function () {
  const fail = () => {
    const view = document.getElementById('view');
    if (view && !window.draftClubReady) {
      view.textContent = 'Draft Club could not start. Reconnect and reload. If this continues, clear this site’s website data in Safari settings.';
    }
  };
  window.addEventListener('error', fail);
  setTimeout(fail, 10000);
})();
