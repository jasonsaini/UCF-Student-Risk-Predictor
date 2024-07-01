function injectSidebar() {
  const canvasApp = document.getElementById('application');
  if (canvasApp && canvasApp.classList.contains('ic-app')) {
    console.log('Canvas app found. Injecting sidebar...');

    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'custom-sidebar-container';

    const sidebarIframe = document.createElement('iframe');
    const sidebarURL = chrome.runtime.getURL('sidebar.html');
    console.log('Sidebar URL:', sidebarURL);

    sidebarIframe.src = sidebarURL;
    sidebarIframe.style.width = '100%';
    sidebarIframe.style.height = '100%';
    sidebarIframe.style.border = 'none'; // Fixed the border style

    sidebarContainer.appendChild(sidebarIframe);
    document.body.appendChild(sidebarContainer);

    console.log('Sidebar injected successfully');
  } else {
    console.log('Canvas app not found or not loaded yet.');
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
