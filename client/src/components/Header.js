// client/src/components/Header.js
import React from 'react';
import './Header.css';

const Header = ({ currentPage }) => {
  const pageTitles = {
    instruccion: '📚 Página de Instrucción',
    galeria: '🖼️ Galería de Imágenes',
    interactiva: '🎮 Sección Interactiva',
    resumen: '📊 Resumen General'
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{pageTitles[currentPage]}</h1>
        <p className="header-subtitle">
          Explora las diferentes secciones de nuestra aplicación
        </p>
      </div>
    </header>
  );
};

export default Header;