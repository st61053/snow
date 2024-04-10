import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import Router from './Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
      <App>
        <Router />
      </App>
  </Provider>,
);
