//import { BrowserRouter } from 'react-router-dom';
//import App from './App';

// ReactDOM.createRoot(document.getElementById('app')).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home/Home.jsx';
import Details from './pages/Details/details.jsx';
import './index.css';

const path = window.location.pathname;
const match = path.match(/^\/details\/(\d+)$/);

const root = ReactDOM.createRoot(document.getElementById('app'));

if (match) {
  const movieId = match[1];
  root.render(<Details movieId={movieId} />);
} else {
  root.render(<Home />);
}
