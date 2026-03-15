import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUiPreferences } from '../context/UiPreferencesContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useUiPreferences();
  const [openDropdown, setOpenDropdown] = useState(null);

  const isPathActive = (path) => {
    if (!path) return false;
    if (path === '/inicio') return location.pathname === '/inicio';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    {
      label: t('nav.myRecipes', 'Mis recetas'),
      path: null,
      submenu: [
        { label: t('nav.recipesPersonal', 'Recetas personales'), path: '/recetas' },
        { label: t('nav.createRecipe', 'Crear nueva receta'), path: '/recetas/crear' },
        { label: t('nav.collections', 'Colecciones'), path: '/recetas/colecciones' },
        { label: t('nav.weekPlan', 'Plan semanal'), path: '/recetas/plan' }
      ]
    },
    {
      label: t('nav.plates', 'Platos'),
      path: null,
      submenu: [
        { label: t('nav.explore', 'Explorar platos'), path: '/platos/explorar' },
        { label: t('nav.breakfast', 'Desayuno'), path: '/platos/desayuno' },
        { label: t('nav.lunch', 'Almuerzo'), path: '/platos/almuerzo' },
        { label: t('nav.dinner', 'Cena'), path: '/platos/cena' },
        { label: t('nav.other', 'Otros'), path: '/platos/otros' }
      ]
    },
    { label: t('nav.contact', 'Contacto'), path: '/contacto' },
    { label: t('nav.settings', 'Ajustes'), path: '/ajustes' },
    { label: t('nav.profile', 'Mi perfil'), path: '/perfil' }
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
                <button
                  className={`nav-button ${isPathActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                  aria-current={isPathActive(item.path) ? 'page' : undefined}
                >
                  {item.label}
                </button>
              </div>
            );
          }

          const hasActiveChild = item.submenu.some((sub) => isPathActive(sub.path));

          return (
            <div
              key={index}
              className="nav-item nav-item-dropdown"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button
                className={`nav-button ${hasActiveChild ? 'active' : ''}`}
                onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                aria-expanded={isOpen}
                aria-haspopup="menu"
              >
                {item.label}
                <span className="nav-chevron">▾</span>
              </button>
              <div className={`nav-dropdown ${isOpen ? 'show' : ''}`}>
                {item.submenu.map((sub, subIdx) => (
                  <button
                    key={subIdx}
                    className={`dropdown-item ${isPathActive(sub.path) ? 'active' : ''}`}
                    onClick={() => {
                      setOpenDropdown(null);
                      navigate(sub.path);
                    }}
                    aria-current={isPathActive(sub.path) ? 'page' : undefined}
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
