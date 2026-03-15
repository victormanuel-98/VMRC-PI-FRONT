import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const getLayout = (width) => {
    if (width >= 1200) return { cardWidth: 260, gap: 20, visible: 4 };
    if (width >= 992) return { cardWidth: 240, gap: 18, visible: 3 };
    if (width >= 768) return { cardWidth: 220, gap: 16, visible: 2 };
    return { cardWidth: 200, gap: 14, visible: 1 };
  };

  const initialWidth = typeof window !== 'undefined' ? window.innerWidth : 1280;
  const [layout, setLayout] = useState(getLayout(initialWidth));
  const { cardWidth, gap, visible } = layout;
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredRecipes = [
    {
      id: 1,
      nombre: 'Pizza básica',
      descripcion: 'Pizza con tomate, jamon york, queso y orégano',
      fecha: '23/03/2025',
      imagen: './platos/receta-pizza.png'
    },
    {
      id: 2,
      nombre: 'Albóndigas en salsa',
      descripcion: 'Albóndigas de cordero en salsa con patatas panaderas',
      fecha: '14/11/2024',
      imagen: './platos/receta-albondigas.png'
    },
    {
      id: 3,
      nombre: 'Bol de avena',
      descripcion: 'Avena con arándanos, plátano, miel y canela',
      fecha: '12/12/2025',
      imagen: './platos/receta-bol.png'
    },
    {
      id: 4,
      nombre: 'Pad thai',
      descripcion: 'Fideos de arroz con camarones y cacahuete',
      fecha: '10/12/2025',
      imagen: './platos/receta-padthai.png'
    },
    {
      id: 5,
      nombre: 'Risotto de champiñones',
      descripcion: 'Arroz cremoso con champiñones y parmesano',
      fecha: '28/12/2025',
      imagen: './platos/receta-risotto.png'
    },
    {
      id: 6,
      nombre: 'Ceviche peruano',
      descripcion: 'Pescado marinado con limón y cilantro fresco',
      fecha: '15/12/2025',
      imagen: './platos/receta-ceviche.png'
    },
    {
      id: 7,
      nombre: 'Tarta de fresas',
      descripcion: 'Base crujiente con crema de yogurt, miel y fresas frescas',
      fecha: '05/12/2025',
      imagen: './platos/receta-tarta.png'
    }
  ];

  const maxIndex = Math.max(0, featuredRecipes.length - visible);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth || initialWidth;
      setLayout((prev) => {
        const next = getLayout(width);
        const changed =
          prev.cardWidth !== next.cardWidth ||
          prev.gap !== next.gap ||
          prev.visible !== next.visible;
        return changed ? next : prev;
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, featuredRecipes.length - visible)));
  }, [visible, featuredRecipes.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">Bienvenidos a FitFood</h1>
        <p className="hero-subtitle">"Tu aliado diario para una alimentación más saludable."</p>

        <div className="hero-image">
          <img
            src="/PortadaMainPage.png"
            alt="Portada FitFood"
          />
        </div>

        <div className="description-section">
          <p>
            <strong>FitFood</strong> es una plataforma diseñada para ayudarte a llevar un control claro y sencillo
            de tu alimentación diaria.
          </p>
          <p>
            Registra los alimentos y platos que consumes, <strong>calcula automáticamente</strong> sus calorías
            y <strong>visualiza tu progreso en tiempo real</strong>.
          </p>
          <p>
            La aplicación te permite <strong>crear dietas personalizadas</strong> y adaptarlas a tu estilo de vida.
            Además, <strong>podrás descubrir y compartir recetas</strong> con otros usuarios, fomentando
            hábitos saludables de forma práctica y accesible.
          </p>
        </div>
      </div>

      <div className="featured-section">
        <h2 className="section-title">Recetas destacadas</h2>
        <div className="carousel-container">
          <button className="carousel-btn prev" onClick={handlePrev} aria-label="Anterior">
            <span className="carousel-icon">‹</span>
          </button>

          <div className="carousel-wrapper">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * (cardWidth + gap)}px)`,
                gap: `${gap}px`
              }}
            >
              {featuredRecipes.map((receta) => (
                <div
                  key={receta.id}
                  className="recipe-card"
                  style={{ minWidth: `${cardWidth}px`, maxWidth: `${cardWidth}px` }}
                >
                  <div className="recipe-image-container">
                    <img
                      src={receta.imagen}
                      alt={receta.nombre}
                      className="recipe-image"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg width="180" height="150" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="180" height="150" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EImagen%3C/text%3E%3C/svg%3E';
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
                      <span className="field-value">{receta.descripcion}</span>
                    </p>
                    <p className="recipe-field">
                      <span className="field-label">Fecha de creación:</span>
                      <span className="field-value">{receta.fecha}</span>
                    </p>
                  </div>

                  <button className="recipe-button" onClick={() => navigate('/receta')}>
                    Receta
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="carousel-btn next" onClick={handleNext} aria-label="Siguiente">
            <span className="carousel-icon">›</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
