import React from 'react';
import ReactDOM from 'react-dom';
import Popup from '../Popup/Popup';

const toggleButtonStyles = `
  #toggle-sidebar-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1001;
    padding: 10px;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
`;

function injectSidebar() {
  const canvasApp = document.getElementById('application');
  if (canvasApp && canvasApp.classList.contains('ic-app')) {
    console.log('Canvas app found. Injecting sidebar...');

    const styleElement = document.createElement('style');
    styleElement.textContent = toggleButtonStyles;
    document.head.appendChild(styleElement);

    const sidebarContainer = document.createElement('div');
    sidebarContainer.id = 'custom-sidebar-container';
    sidebarContainer.style.display = 'none';

    const root = ReactDOM.createRoot(sidebarContainer);
    root.render(<Popup />);

    document.body.appendChild(sidebarContainer);

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-sidebar-button';
    toggleButton.textContent = 'Show Tool';
    toggleButton.onclick = () => {
      if (sidebarContainer.style.display === 'none') {
        sidebarContainer.style.display = 'block';
        toggleButton.textContent = 'Hide Tool';
      } else {
        sidebarContainer.style.display = 'none';
        toggleButton.textContent = 'Show Tool';
      }
    };

    document.body.appendChild(toggleButton);

    console.log('Sidebar and toggle button injected successfully');
  } else {
    console.log('Canvas app not found or not loaded yet.');
  }
}

const isCanvas = document
  .getElementById('application')
  ?.classList.contains('ic-app');

if (isCanvas) {
  injectSidebar();
} else {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const canvasApp = document.getElementById('application');
        if (canvasApp && canvasApp.classList.contains('ic-app')) {
          injectSidebar();
          observer.disconnect();
        }
      }
    });
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
