import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';

const rootElem = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElem);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
