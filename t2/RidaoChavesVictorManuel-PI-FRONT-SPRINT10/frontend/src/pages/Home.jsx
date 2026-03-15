import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerRecetas } from '../services/api';
import { useUiPreferences } from '../context/UiPreferencesContext';

const carouselImages = [
  '/platos/receta-tostadas.png',
  '/platos/receta-panqueques.png',
  '/platos/receta-salmon.png',
  '/platos/receta-risotto.png',
  '/platos/receta-padthai.png',
  '/platos/receta-brownie.png',
  '/platos/receta-sopa.png',
  '/platos/receta-tacos.png'
];

const fallbackSlides = [
  {
    id: 'fallback-1',
    title: 'Desayunos que apetece repetir',
    description: 'Ideas rápidas, sabrosas y equilibradas para empezar el día con energía.',
    image: '/platos/receta-tostadas.png',
    tag: 'Selección FitFood',
    meta: ['Desayuno', '10 min'],
    buttonLabel: 'Ver desayunos',
    path: '/platos/desayuno'
  },
  {
    id: 'fallback-2',
    title: 'Bowls y brunch saludables',
    description: 'Recetas coloridas con fruta, avena y toppings para una mañana completa.',
    image: '/platos/receta-panqueques.png',
    tag: 'Brunch saludable',
    meta: ['Trending', 'Dulce fit'],
    buttonLabel: 'Descubrir ideas',
    path: '/platos/otros'
  },
  {
    id: 'fallback-3',
    title: 'Platos principales con proteína',
    description: 'Opciones equilibradas para comidas y cenas con mucho sabor.',
    image: '/platos/receta-salmon.png',
    tag: 'Comidas top',
    meta: ['Almuerzo', 'Alta proteína'],
    buttonLabel: 'Ver comidas',
    path: '/platos/almuerzo'
  },
  {
    id: 'fallback-4',
    title: 'Recetas para impresionar en casa',
    description: 'Sabores reconfortantes con una presentación cuidada y fácil de seguir.',
    image: '/platos/receta-risotto.png',
    tag: 'Favoritas',
    meta: ['Cena', 'Gourmet'],
    buttonLabel: 'Explorar cenas',
    path: '/platos/cena'
  },
  {
    id: 'fallback-5',
    title: 'Toque internacional sin complicarte',
    description: 'Propuestas inspiradas en otras cocinas para variar el menú semanal.',
    image: '/platos/receta-padthai.png',
    tag: 'Mundo FitFood',
    meta: ['Fácil', 'Exótico'],
    buttonLabel: 'Ver más recetas',
    path: '/platos/otros'
  }
];

const fallbackCreatedRecipes = [
  {
    _id: 'created-fallback-1',
    nombre: 'Tostadas con yogur y frutas',
    descripcionCorta: 'Desayuno equilibrado con proteína, fibra y fruta fresca.',
    imagen: '/platos/receta-tostadas.png',
    calorias: 390,
    dificultad: 'Fácil',
    createdAt: new Date().toISOString(),
    isFallback: true,
    path: '/platos/desayuno'
  },
  {
    _id: 'created-fallback-2',
    nombre: 'Bowl de salmón y verduras',
    descripcionCorta: 'Plato completo para comida principal con grasas saludables.',
    imagen: '/platos/receta-salmon.png',
    calorias: 510,
    dificultad: 'Media',
    createdAt: new Date().toISOString(),
    isFallback: true,
    path: '/platos/almuerzo'
  },
  {
    _id: 'created-fallback-3',
    nombre: 'Risotto cremoso de setas',
    descripcionCorta: 'Receta reconfortante ideal para una cena especial.',
    imagen: '/platos/receta-risotto.png',
    calorias: 460,
    dificultad: 'Media',
    createdAt: new Date().toISOString(),
    isFallback: true,
    path: '/platos/cena'
  },
  {
    _id: 'created-fallback-4',
    nombre: 'Brownie fit de cacao',
    descripcionCorta: 'Un postre ligero para completar tu menú semanal.',
    imagen: '/platos/receta-brownie.png',
    calorias: 270,
    dificultad: 'Fácil',
    createdAt: new Date().toISOString(),
    isFallback: true,
    path: '/platos/otros'
  }
];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useUiPreferences();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);

  useEffect(() => {
    const cargarDestacadas = async () => {
      try {
        const respuesta = await obtenerRecetas({ limite: 10 });
        if (respuesta?.recetas) {
          setFeaturedRecipes(respuesta.recetas);
        }
      } catch {
        setFeaturedRecipes([]);
      }
    };

    cargarDestacadas();
  }, []);

  const featuredSlides = useMemo(() => {
    if (featuredRecipes.length === 0) {
      return fallbackSlides;
    }

    return featuredRecipes.slice(0, 8).map((receta, index) => ({
      id: receta._id,
      title: receta.nombre,
      description: receta.descripcionCorta || 'Descubre una receta saludable preparada por la comunidad FitFood.',
      image: receta.imagen || carouselImages[index % carouselImages.length],
      tag: receta.categoria || 'Receta FitFood',
      meta: [
        `${Math.round(receta.calorias || 0)} kcal`,
        receta.dificultad || 'Media',
        new Date(receta.createdAt).toLocaleDateString('es-ES')
      ],
      buttonLabel: 'Ver receta',
      path: `/receta/${receta._id}`
    }));
  }, [featuredRecipes]);

  const createdRecipes = useMemo(() => {
    if (!featuredRecipes.length) {
      return fallbackCreatedRecipes;
    }

    return [...featuredRecipes]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4)
      .map((receta, index) => ({
        ...receta,
        imagen: receta.imagen || carouselImages[index % carouselImages.length],
        path: `/receta/${receta._id}`
      }));
  }, [featuredRecipes]);

  useEffect(() => {
    setCurrentIndex((prev) => {
      if (featuredSlides.length === 0) {
        return 0;
      }
      return prev >= featuredSlides.length ? 0 : prev;
    });
  }, [featuredSlides.length]);

  useEffect(() => {
    if (featuredSlides.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 5500);

    return () => window.clearInterval(interval);
  }, [featuredSlides.length]);

  const activeSlide = featuredSlides[currentIndex] || fallbackSlides[0];

  const previewSlides = Array.from({ length: Math.min(3, Math.max(0, featuredSlides.length - 1)) }, (_, offset) => {
    const index = (currentIndex + offset + 1) % featuredSlides.length;
    return featuredSlides[index];
  });

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
  };

  const handleOpenSlide = (slide) => {
    if (slide?.path) {
      navigate(slide.path);
    }
  };

  const handleOpenCreatedRecipe = (receta) => {
    if (receta?.path) {
      navigate(receta.path);
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-layout">
          <div className="hero-copy">
            <h1 className="hero-title">{t('home.hero.title', 'Bienvenidos a FitFood')}</h1>
            <p className="hero-subtitle">{t('home.hero.subtitle', 'Tu aliado diario para una alimentación más saludable.')}</p>

            <p className="hero-body">{t('home.hero.body1', 'FitFood es una plataforma diseñada para ayudarte a llevar un control claro y sencillo de tu alimentación diaria.')}</p>
            <p className="hero-body">{t('home.hero.body2', 'Registra los alimentos y platos que consumes, calcula automáticamente sus calorías y visualiza tu progreso en tiempo real.')}</p>
            <p className="hero-body">{t('home.hero.body3', 'La aplicación te permite crear planes personalizados y compartir recetas saludables con otros usuarios.')}</p>

            <div className="hero-actions">
              <button className="recipe-button" onClick={() => navigate('/platos/explorar')}>
                Explorar platos
              </button>
              <button className="recipe-button" onClick={() => navigate('/recetas/crear')}>
                Crear receta
              </button>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="/PortadaMainPage.png"
              alt="Portada FitFood"
            />
          </div>
        </div>
      </div>

      <div className="featured-section">
        <div className="featured-header">
          <div>
            <span className="featured-kicker">Inspiración de la semana</span>
            <h2 className="section-title featured-title">Recetas destacadas</h2>
            <p className="featured-description">
              Descubre recetas saludables con un formato visual integrado con el estilo de FitFood.
            </p>
          </div>

          {featuredSlides.length > 1 && (
            <div className="featured-controls">
              <button className="carousel-btn" onClick={handlePrev} aria-label="Anterior">
                <span className="carousel-icon">‹</span>
              </button>
              <button className="carousel-btn" onClick={handleNext} aria-label="Siguiente">
                <span className="carousel-icon">›</span>
              </button>
            </div>
          )}
        </div>

        <div className="showcase-carousel">
          <article
            className="showcase-main"
            style={{ backgroundImage: `linear-gradient(120deg, rgba(25, 25, 25, 0.12), rgba(25, 25, 25, 0.68)), url(${activeSlide.image})` }}
          >
            <div className="showcase-content">
              <span className="showcase-tag">{activeSlide.tag}</span>
              <h3>{activeSlide.title}</h3>
              <p>{activeSlide.description}</p>

              <div className="showcase-meta">
                {activeSlide.meta?.map((item) => (
                  <span key={item} className="showcase-chip">{item}</span>
                ))}
              </div>

              <button className="showcase-button" onClick={() => handleOpenSlide(activeSlide)}>
                {activeSlide.buttonLabel}
              </button>
            </div>
          </article>

          <div className="showcase-sidebar">
            {previewSlides.map((slide) => (
              <button
                key={slide.id}
                type="button"
                className="showcase-preview"
                onClick={() => setCurrentIndex(featuredSlides.findIndex((item) => item.id === slide.id))}
              >
                <img src={slide.image} alt={slide.title} className="showcase-preview-image" />
                <span className="showcase-preview-overlay" />
                <span className="showcase-preview-content">
                  <span className="showcase-preview-tag">{slide.tag}</span>
                  <strong>{slide.title}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>

        {featuredSlides.length > 1 && (
          <div className="showcase-dots" aria-label="Navegación del carrusel">
            {featuredSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`showcase-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir a ${slide.title}`}
              />
            ))}
          </div>
        )}
      </div>

      <section className="home-created-section">
        <div className="home-created-header">
          <h2 className="section-title home-created-title">Recetas creadas recientemente</h2>
          <button className="recipe-button" onClick={() => navigate('/mis-recetas')}>
            Ver mis recetas
          </button>
        </div>

        <div className="recipes-list home-created-list">
          {createdRecipes.map((receta) => (
            <article key={receta._id} className="recipe-card">
              <div className="recipe-image-container">
                <img
                  src={receta.imagen || '/platos/receta-bol.png'}
                  alt={receta.nombre}
                  className="recipe-image"
                  onError={(e) => {
                    e.target.src = '/platos/receta-bol.png';
                  }}
                />
              </div>

              <div className="recipe-info-container">
                <p className="recipe-field">
                  <span className="field-label">Nombre:</span>
                  <span className="field-value">{receta.nombre}</span>
                </p>
                <p className="recipe-field">
                  <span className="field-label">Descripción:</span>
                  <span className="field-value">{receta.descripcionCorta || 'Sin descripción'}</span>
                </p>
                <p className="recipe-field">
                  <span className="field-label">Calorías:</span>
                  <span className="field-value">{Math.round(receta.calorias || 0)} kcal</span>
                </p>
                <p className="recipe-field">
                  <span className="field-label">Dificultad:</span>
                  <span className="field-value">{receta.dificultad || 'Media'}</span>
                </p>
                <p className="recipe-field">
                  <span className="field-label">Fecha de creación:</span>
                  <span className="field-value">{new Date(receta.createdAt).toLocaleDateString('es-ES')}</span>
                </p>
              </div>

              <button className="recipe-button" onClick={() => handleOpenCreatedRecipe(receta)}>
                {receta.isFallback ? 'Ver categoría' : 'Ver receta'}
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
