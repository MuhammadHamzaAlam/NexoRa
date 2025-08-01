
import { db, auth } from './firebase'; // Adjust path as needed
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles.css'; // Custom styles
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
console.log('Firebase initialized:', auth);