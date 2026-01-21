import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  
  const navItems = [
    { label: 'INICIO', path: '/inicio' },
    { label: 'MIS RECETAS', path: null, submenu: [
      { label: 'Recetas personales', path: '/recetas' },
      { label: 'Crear nueva receta', path: '/recetas/crear' }
    ] },
    { label: 'PLATOS', path: null, submenu: [
      { label: 'Desayuno', path: '/platos/desayuno' },
      { label: 'Almuerzo', path: '/platos/almuerzo' },
      { label: 'Cena', path: '/platos/cena' },
      { label: 'Otros', path: '/platos/otros' }
    ] },
    { label: 'CONTACTO', path: '/contacto' },
    { label: 'MI PERFIL', path: '/perfil' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {navItems.map((item, index) => {
          const hasSubmenu = Array.isArray(item.submenu);
          const isOpen = openDropdown === item.label;

          if (!hasSubmenu) {
            return (
              <div key={index} className="nav-item">
                <button className="nav-button" onClick={() => navigate(item.path)}>
                  {item.label}
                </button>
              </div>
            );
          }

          return (
            <div
              key={index}
              className="nav-item nav-item-dropdown"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className="nav-button"
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
              >
                {item.label}
              </button>
              <div className={`nav-dropdown ${isOpen ? 'show' : ''}`}>
                {item.submenu.map((sub, subIdx) => (
                  <button
                    key={subIdx}
                    className="dropdown-item"
                    onClick={() => {
                      setOpenDropdown(null);
                      navigate(sub.path);
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
