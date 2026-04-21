import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUiPreferences } from '../context/UiPreferencesContext';

const PlatesExplorer = () => {
  const navigate = useNavigate();
  const { t } = useUiPreferences();

  const plateCategories = [
    {
      title: t('nav.breakfast', 'Desayuno'),
      subtitle: t('explorer.breakfastSubtitle', 'Comienza el día con energía'),
      image: '/platos/receta-panqueques.png',
      path: '/platos/desayuno'
    },
    {
      title: t('nav.lunch', 'Almuerzo'),
      subtitle: t('explorer.lunchSubtitle', 'Platos completos y equilibrados'),
      image: '/platos/receta-salmon.png',
      path: '/platos/almuerzo'
    },
    {
      title: t('nav.dinner', 'Cena'),
      subtitle: t('explorer.dinnerSubtitle', 'Opciones ligeras y sabrosas'),
      image: '/platos/receta-risotto.png',
      path: '/platos/cena'
    },
    {
      title: t('nav.other', 'Otros'),
      subtitle: t('explorer.otherSubtitle', 'Snacks, postres y más ideas'),
      image: '/platos/receta-brownie.png',
      path: '/platos/otros'
    }
  ];

  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('explorer.breadcrumb1', 'Platos'), path: '/platos/explorar' },
    { label: t('explorer.breadcrumb2', 'Explorar'), path: '/platos/explorar' }
  ];

  return (
    <div className="plates-explorer-page">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="plates-explorer-hero">
        <h1>{t('explorer.title', 'Explorar platos')}</h1>
        <p>{t('explorer.subtitle', 'Elige una categoría y descubre recetas para cada momento del día.')}</p>
      </section>

      <section className="plates-explorer-grid">
        {plateCategories.map((category) => (
          <article key={category.title} className="plates-category-card">
            <img src={category.image} alt={category.title} />
            <div className="plates-category-content">
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
              <button className="recipe-button" onClick={() => navigate(category.path)}>
                {t('explorer.openCategory', 'Abrir categoría')}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default PlatesExplorer;
