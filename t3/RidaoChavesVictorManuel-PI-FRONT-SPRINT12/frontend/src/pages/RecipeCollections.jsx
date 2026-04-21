import React from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { useUiPreferences } from '../context/UiPreferencesContext';

const RecipeCollections = () => {
  const navigate = useNavigate();
  const { t } = useUiPreferences();

  const collectionCards = [
    {
      title: t('collections.card1.title', 'Desayunos express'),
      description: t('collections.card1.desc', 'Recetas rápidas para empezar el día sin complicaciones.'),
      image: '/platos/receta-tostadas.png',
      actionLabel: t('collections.card1.action', 'Ver desayunos'),
      path: '/platos/desayuno'
    },
    {
      title: t('collections.card2.title', 'Batch cooking semanal'),
      description: t('collections.card2.desc', 'Platos para cocinar una vez y organizar toda la semana.'),
      image: '/platos/receta-bol.png',
      actionLabel: t('collections.card2.action', 'Planificar menú'),
      path: '/recetas/plan'
    },
    {
      title: t('collections.card3.title', 'Comidas altas en proteína'),
      description: t('collections.card3.desc', 'Opciones completas para entrenar y recuperar mejor.'),
      image: '/platos/receta-salmon.png',
      actionLabel: t('collections.card3.action', 'Explorar platos'),
      path: '/platos/almuerzo'
    },
    {
      title: t('collections.card4.title', 'Postres saludables'),
      description: t('collections.card4.desc', 'Dulces ligeros con gran sabor para cualquier momento.'),
      image: '/platos/receta-brownie.png',
      actionLabel: t('collections.card4.action', 'Ver otros platos'),
      path: '/platos/otros'
    }
  ];

  const breadcrumbItems = [
    { label: t('nav.home', 'Inicio'), path: '/inicio' },
    { label: t('collections.breadcrumb1', 'Mis Recetas'), path: '/recetas' },
    { label: t('collections.breadcrumb2', 'Colecciones'), path: '/recetas/colecciones' }
  ];

  return (
    <div className="collections-page">
      <Breadcrumbs items={breadcrumbItems} />
      <section className="collections-hero">
        <span className="collections-kicker">{t('collections.kicker', 'Nuevas secciones')}</span>
        <h1>{t('collections.title', 'Colecciones FitFood')}</h1>
        <p>{t('collections.subtitle', 'Descubre agrupaciones de recetas pensadas para objetivos reales de tu rutina.')}</p>
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
