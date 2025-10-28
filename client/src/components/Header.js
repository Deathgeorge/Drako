import React from 'react';
import './Header.css';

const Header = ({ currentPage }) => {
  const pageTitles = {
    instruccion: '🐶 La vida de un Border Collie',
    galeria: '🖼️ Pics',
    interactiva: '🎮 Sección Interactiva'
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">{pageTitles[currentPage]}</h1>
        <p className="header-subtitle">
          La vida con un border Collie Loco
        </p>
      </div>
    </header>
  );
};

export default Header;