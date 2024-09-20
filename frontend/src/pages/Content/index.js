import React from 'react';
import ReactDOM from 'react-dom';
import Popup from '../Popup/Popup';

function injectSidebar() {
  const canvasApp = document.getElementById('application');
  if (canvasApp && canvasApp.classList.contains('ic-app')) {
    console.log('Canvas app found. Injecting sidebar...');

    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'custom-sidebar-container';

    const root = ReactDOM.createRoot(sidebarContainer);
    root.render(<Popup />);

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
