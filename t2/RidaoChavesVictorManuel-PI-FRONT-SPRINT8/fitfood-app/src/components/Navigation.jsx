import React from 'react';
import './Navigation.css';

const Navigation = () => {
  const navItems = [
    { label: 'INICIO', path: '/' },
    { label: 'MIS RECETAS', path: '/recetas' },
    { label: 'PLATOS', path: '/platos' },
    { label: 'CONTACTO', path: '/contacto' },
    { label: 'MI PERFIL', path: '/perfil' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item, index) => (
          <button key={index} className="nav-button">
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
