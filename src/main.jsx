import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {HashRouter} from 'react-router-dom';
import App from './App';
import {AppProvider} from './context/AppContext';
import './styles/global.css';
createRoot(document.getElementById('root')).render(<StrictMode><HashRouter><AppProvider><App/></AppProvider></HashRouter></StrictMode>);
// Offline shell; failure is harmless.
if(import.meta.env.PROD&&'serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(import.meta.env.BASE_URL+'sw.js').catch(()=>{}));
