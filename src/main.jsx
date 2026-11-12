import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';
import './styles/animations.css';

// 避免長按跳出系統選單、iOS 雙指縮放
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('gesturestart', (e) => e.preventDefault());

async function mount() {
  let Root = App;
  if (import.meta.env.DEV && new URLSearchParams(location.search).has('gallery')) {
    Root = (await import('./components/ArtGallery.jsx')).default;
  }
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  );
}

mount();
