import React from 'react';
import './Navigation.css';

const Navigation = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'instruccion', label: 'Inicio', icon: '📚' },
    { id: 'galeria', label: 'Galería', icon: '🖼️' },
    { id: 'interactiva', label: 'Habla Conmigo', icon: '🎮' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Mi App React</h2>
      </div>
      <ul className="nav-menu">
        {menuItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;