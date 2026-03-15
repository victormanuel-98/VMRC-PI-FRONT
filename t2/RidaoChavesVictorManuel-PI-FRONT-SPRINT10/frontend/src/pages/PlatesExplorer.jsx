import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const plateCategories = [
  {
    title: 'Desayuno',
    subtitle: 'Comienza el día con energía',
    image: '/platos/receta-panqueques.png',
    path: '/platos/desayuno'
  },
  {
    title: 'Almuerzo',
    subtitle: 'Platos completos y equilibrados',
    image: '/platos/receta-salmon.png',
    path: '/platos/almuerzo'
  },
  {
    title: 'Cena',
    subtitle: 'Opciones ligeras y sabrosas',
    image: '/platos/receta-risotto.png',
    path: '/platos/cena'
  },
  {
    title: 'Otros',
    subtitle: 'Snacks, postres y más ideas',
    image: '/platos/receta-brownie.png',
    path: '/platos/otros'
  }
];

const PlatesExplorer = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Platos', path: '/platos/explorar' },
    { label: 'Explorar', path: '/platos/explorar' }
  ];

  return (
    <div className="plates-explorer-page">
      <Breadcrumbs items={breadcrumbItems} />

      <section className="plates-explorer-hero">
        <h1>Explorar platos</h1>
        <p>Elige una categoría y descubre recetas para cada momento del día.</p>
      </section>

      <section className="plates-explorer-grid">
        {plateCategories.map((category) => (
          <article key={category.title} className="plates-category-card">
            <img src={category.image} alt={category.title} />
            <div className="plates-category-content">
              <h3>{category.title}</h3>
              <p>{category.subtitle}</p>
              <button className="recipe-button" onClick={() => navigate(category.path)}>
                Abrir categoría
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default PlatesExplorer;
