import './polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import i18next from './i18n';
// disable ServiceWorker
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <I18nextProvider i18n={i18next}>
        <App/>
    </I18nextProvider>,
    document.getElementById('root')
);
// disable ServiceWorker
// registerServiceWorker();