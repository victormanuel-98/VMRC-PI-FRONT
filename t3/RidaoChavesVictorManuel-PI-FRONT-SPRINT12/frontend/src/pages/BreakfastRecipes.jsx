import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { obtenerRecetas } from '../services/api';
import { useUiPreferences } from '../context/UiPreferencesContext';

const BreakfastRecipes = ({ categoria = 'desayuno', titulo = 'Desayunos', descripcion = 'Recetas saludables para comenzar tu día' }) => {
    const { t, preferences } = useUiPreferences();
    const categoryText = {
        desayuno: {
            title: preferences.language === 'en' ? 'Breakfasts' : 'Desayunos',
            description: preferences.language === 'en' ? 'Healthy recipes to start your day' : 'Recetas saludables para comenzar tu día'
        },
        almuerzo: {
            title: preferences.language === 'en' ? 'Lunches' : 'Almuerzos',
            description: preferences.language === 'en' ? 'Balanced recipes for your main meal' : 'Recetas equilibradas para la comida principal'
        },
        cena: {
            title: preferences.language === 'en' ? 'Dinners' : 'Cenas',
            description: preferences.language === 'en' ? 'Light and complete recipes for the evening' : 'Recetas ligeras y completas para la noche'
        },
        otros: {
            title: preferences.language === 'en' ? 'Other dishes' : 'Otros platos',
            description: preferences.language === 'en' ? 'Discover snacks, desserts, drinks, and more' : 'Descubre snacks, postres, bebidas y más'
        }
    };
    const displayTitle = categoryText[categoria]?.title || titulo;
    const displayDescription = categoryText[categoria]?.description || descripcion;
    const categoriaLabel = {
        desayuno: preferences.language === 'en' ? 'breakfast' : 'desayuno',
        almuerzo: preferences.language === 'en' ? 'lunch' : 'almuerzo',
        cena: preferences.language === 'en' ? 'dinner' : 'cena',
        otros: preferences.language === 'en' ? 'other' : 'otros'
    }[categoria] || (preferences.language === 'en' ? 'dish' : 'plato');
    const breadcrumbItems = [
        { label: t('nav.home', 'Inicio'), path: '/inicio' },
        { label: t('breakfast.breadcrumb1', 'Platos'), path: '/inicio' },
        { label: displayTitle, path: `/platos/${categoria}` }
    ];
    const navigate = useNavigate();
    const location = useLocation();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const quickCategories = [
        { label: t('breakfast.quickExplore', 'Explorar'), path: '/platos/explorar' },
        { label: t('breakfast.quickBreakfast', 'Desayuno'), path: '/platos/desayuno' },
        { label: t('breakfast.quickLunch', 'Almuerzo'), path: '/platos/almuerzo' },
        { label: t('breakfast.quickDinner', 'Cena'), path: '/platos/cena' },
        { label: t('breakfast.quickOther', 'Otros'), path: '/platos/otros' }
    ];

    useEffect(() => {
        cargarRecetasDesayuno();
    }, [categoria, location.search]);

    const cargarRecetasDesayuno = async () => {
        try {
            setLoading(true);
            setError(false);
            const params = new URLSearchParams(location.search);
            const busqueda = params.get('busqueda')?.trim() || '';
            const filtroCategoria = categoria === 'otros' ? {} : { categoria };
            if (busqueda) {
                filtroCategoria.q = busqueda;
            }
            const respuesta = await obtenerRecetas(filtroCategoria);
            
            if (respuesta.recetas) {
                setRecipes(respuesta.recetas);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error al cargar recetas de desayuno:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleVerReceta = (recetaId) => {
        navigate(`/receta/${recetaId}`);
    };

    if (loading) {
        return (
            <div className="breakfast-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="breakfast-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>{t('breakfast.loading', 'Cargando recetas...')}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="breakfast-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="breakfast-container">
                    <div className="error-state">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#d32f2f" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h2>{t('breakfast.errorTitle', 'Error al cargar las recetas')}</h2>
                        <p>{t('breakfast.errorBody', 'No se pudieron cargar las recetas. Por favor, intenta de nuevo.')}</p>
                        <button onClick={cargarRecetasDesayuno} className="retry-button">
                            {t('breakfast.retry', 'Reintentar')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="breakfast-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="breakfast-container">
                    <div className="empty-state">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                            <path d="M19 11H5M19 11a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="#6b95a5" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h2>{t('breakfast.emptyTitle', 'No hay recetas disponibles')}</h2>
                        <p>{t('breakfast.emptyBody', 'Aún no hay recetas de esta categoría disponibles. ¡Sé el primero en crear una!')}</p>
                        <button onClick={() => navigate('/recetas/crear')} className="create-first-button">
                            {t('breakfast.createFirst', 'Crear receta de {category}').replace('{category}', categoriaLabel.toLowerCase())}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="breakfast-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="breakfast-container">
                <h1 className="breakfast-title">{displayTitle}</h1>
                <p className="breakfast-subtitle">{displayDescription}</p>

                <section className="plates-quick-nav">
                    {quickCategories.map((item) => (
                        <button
                            key={item.path}
                            className={`plates-chip ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            {item.label}
                        </button>
                    ))}
                </section>

                {recipes[0] && (
                    <section className="plates-highlight-card">
                        <img src={recipes[0].imagen || '/platos/receta-bol.png'} alt={recipes[0].nombre} />
                        <div>
                            <span className="plates-highlight-kicker">{t('breakfast.recommendation', 'Recomendación de hoy')}</span>
                            <h2>{recipes[0].nombre}</h2>
                            <p>{recipes[0].descripcionCorta || t('breakfast.noDescription', 'Una receta ideal para mantener tu rutina saludable con buen sabor.')}</p>
                            <button className="recipe-button" onClick={() => handleVerReceta(recipes[0]._id)}>
                                {t('breakfast.viewRecommendation', 'Ver recomendación')}
                            </button>
                        </div>
                    </section>
                )}
                
                <div className="breakfast-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card-breakfast">
                            <div className="recipe-image-breakfast">
                                <img 
                                    src={recipe.imagen || `data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16"%3E${encodeURIComponent(t('breakfast.noImage', 'Sin imagen'))}%3C/text%3E%3C/svg%3E`} 
                                    alt={recipe.nombre}
                                    onError={(e) => {
                                        e.target.src = `data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16"%3E${encodeURIComponent(t('breakfast.noImage', 'Sin imagen'))}%3C/text%3E%3C/svg%3E`;
                                    }}
                                />
                            </div>
                            <div className="recipe-content-breakfast">
                                <h3 className="recipe-name-breakfast">{recipe.nombre}</h3>
                                <p className="recipe-description-breakfast">
                                    {recipe.descripcionCorta || recipe.descripcion?.substring(0, 80) + '...' || t('breakfast.noShortDescription', 'Sin descripción')}
                                </p>
                                <div className="recipe-stats-breakfast">
                                    <span className="recipe-calories">
                                        {recipe.calorias ? `${recipe.calorias.toFixed(0)} kcal` : 'N/A'}
                                    </span>
                                    <span className="recipe-difficulty">
                                        {recipe.dificultad || t('breakfast.medium', 'Media')}
                                    </span>
                                </div>
                                <p className="recipe-date-breakfast">
                                    {new Date(recipe.createdAt).toLocaleDateString(preferences.language === 'en' ? 'en-US' : 'es-ES')}
                                </p>
                                <button 
                                    className="recipe-button-breakfast" 
                                    onClick={() => handleVerReceta(recipe._id)}
                                >
                                    {t('breakfast.viewRecipe', 'Ver receta')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BreakfastRecipes;
