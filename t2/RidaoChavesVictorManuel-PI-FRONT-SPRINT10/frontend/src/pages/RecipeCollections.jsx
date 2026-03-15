import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const collectionCards = [
  {
    title: 'Desayunos express',
    description: 'Recetas rápidas para empezar el día sin complicaciones.',
    image: '/platos/receta-tostadas.png',
    actionLabel: 'Ver desayunos',
    path: '/platos/desayuno'
  },
  {
    title: 'Batch cooking semanal',
    description: 'Platos para cocinar una vez y organizar toda la semana.',
    image: '/platos/receta-bol.png',
    actionLabel: 'Planificar menú',
    path: '/recetas/plan'
  },
  {
    title: 'Comidas altas en proteína',
    description: 'Opciones completas para entrenar y recuperar mejor.',
    image: '/platos/receta-salmon.png',
    actionLabel: 'Explorar platos',
    path: '/platos/almuerzo'
  },
  {
    title: 'Postres saludables',
    description: 'Dulces ligeros con gran sabor para cualquier momento.',
    image: '/platos/receta-brownie.png',
    actionLabel: 'Ver otros platos',
    path: '/platos/otros'
  }
];

const RecipeCollections = () => {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Inicio', path: '/inicio' },
    { label: 'Mis Recetas', path: '/recetas' },
    { label: 'Colecciones', path: '/recetas/colecciones' }
  ];

  return (
    <div className="collections-page">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="collections-hero">
        <span className="collections-kicker">Nuevas secciones</span>
        <h1>Colecciones FitFood</h1>
        <p>Descubre agrupaciones de recetas pensadas para objetivos reales de tu rutina.</p>
      </section>

      <section className="collections-grid">
        {collectionCards.map((card) => (
          <article key={card.title} className="collection-card">
            <div className="collection-image-wrap">
              <img src={card.image} alt={card.title} />
            </div>
            <div className="collection-content">
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button className="recipe-button" onClick={() => navigate(card.path)}>
                {card.actionLabel}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default RecipeCollections;
