import React from 'react';

import { enableMapSet } from 'immer';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import './utils/array.extensions';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

enableMapSet();
reportWebVitals();
// REGISTER ERROR OVERLAY

// const showErrorOverlay = (err: string) => {
//   // must be within function call because that's when the element is defined for sure.
//   const ErrorOverlay = customElements.get('vite-error-overlay');
//   // don't open outside vite environment
//   if (!ErrorOverlay) {
//     return;
//   }
//   console.log(err);
//   const overlay = new ErrorOverlay(err);
//   document.body.appendChild(overlay);
// };

// // window.addEventListener('error', showErrorOverlay);
// window.addEventListener('unhandledrejection', ({ reason }) => showErrorOverlay(reason));
