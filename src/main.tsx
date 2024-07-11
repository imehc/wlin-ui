import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import 'virtual:uno.css';
import '@unocss/reset/normalize.css';
import './index.css';
import Main from '.';

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Main />
    </StrictMode>
  );
}
