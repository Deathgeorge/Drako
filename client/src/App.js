// client/src/App.js
import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Instruccion from './components/pages/Instruccion';
import Galeria from './components/pages/Galeria';
import Interactiva from './components/pages/Interactiva';
import Resumen from './components/pages/Resumen';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('instruccion');

  const renderPage = () => {
    switch (currentPage) {
      case 'instruccion':
        return <Instruccion />;
      case 'galeria':
        return <Galeria />;
      case 'interactiva':
        return <Interactiva />;
      case 'resumen':
        return <Resumen />;
      default:
        return <Instruccion />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <Header currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;