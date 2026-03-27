import React from 'react';

import { enableMapSet } from 'immer';
import ReactDOM from 'react-dom/client';

import './index.css';
import App from './app/App';
import { ErrorBoundary } from './app/ErrorBoundary';
import { initAnalytics } from './lib/analytics-actor';

import './lib/array/array.extensions';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

enableMapSet();
initAnalytics();
