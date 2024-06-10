function injectSidebar() {
  const canvasApp = document.getElementById('application');
  if (canvasApp && canvasApp.classList.contains('ic-app')) {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'custom-sidebar-container';

    const sidebarIframe = document.createElement('iframe');
    sidebarIframe.src = chrome.runtime.getURL(
      'frontend/src/pages/Content/sidebar.html'
    );
    sidebarIframe.style.width = '100%';
    sidebarIframe.style.height = '100%';
    sidebarIframe.style.border = '100%';

    sidebarContainer.appendChild(sidebarIframe);
    document.body.appendChild(sidebarContainer);
  }
}

// Check if the page is a Canvas page
const isCanvas = document
  .getElementById('application')
  ?.classList.contains('ic-app');

if (isCanvas) {
  // Inject the sidebar immediately
  injectSidebar();
} else {
  // Observe for changes to the DOM in case the Canvas page loads dynamically
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const canvasApp = document.getElementById('application');
        if (canvasApp && canvasApp.classList.contains('ic-app')) {
          injectSidebar();
          observer.disconnect(); // Stop observing after injecting the sidebar
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
