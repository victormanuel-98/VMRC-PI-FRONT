import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import { obtenerRecetasUsuario, eliminarReceta } from '../services/api';

const MyRecipes = () => {
    const { preferences, t } = useUiPreferences();
    const breadcrumbItems = [
        { label: t('nav.home', 'Inicio'), path: '/inicio' },
        { label: t('nav.myRecipes', 'Mis Recetas'), path: '/recetas' }
    ];
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const dateLocale = preferences.language === 'en' ? 'en-US' : 'es-ES';

    const recipeSummary = useMemo(() => {
        const total = recipes.length;
        const avgCalories = total
            ? Math.round(recipes.reduce((sum, receta) => sum + (receta.calorias || 0), 0) / total)
            : 0;
        let latestDate = '-';
        if (total) {
            const latestTimestamp = Math.max(...recipes.map((receta) => new Date(receta.createdAt).getTime()));
            latestDate = new Date(latestTimestamp).toLocaleDateString(dateLocale);
        }

        return {
            total,
            avgCalories,
            latestDate
        };
    }, [recipes, dateLocale]);

    useEffect(() => {
        cargarRecetas();
    }, [user?.id]);

    const cargarRecetas = async () => {
        try {
            setLoading(true);
            setError(false);
            const token = localStorage.getItem('token');
            
            if (!token) {
                navigate('/login');
                return;
            }

            if (!user?.id) {
                setError(true);
                return;
            }

            const respuesta = await obtenerRecetasUsuario(user.id);
            
            if (respuesta.recetas) {
                setRecipes(respuesta.recetas);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error('Error al cargar recetas:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleVerReceta = (recetaId) => {
        navigate(`/receta/${recetaId}`);
    };

    const handleEliminarReceta = async (recetaId) => {
        if (!globalThis.confirm(t('myRecipes.confirmDelete', '¿Estás seguro de que quieres eliminar esta receta?'))) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const respuesta = await eliminarReceta(recetaId, token);
            
            if (respuesta.mensaje) {
                cargarRecetas();
            } else {
                alert(t('myRecipes.deleteError', 'Error al eliminar la receta'));
            }
        } catch (err) {
            console.error('Error deleting recipe:', err);
            alert(t('myRecipes.deleteError', 'Error al eliminar la receta'));
        }
    };

    if (loading) {
        return (
            <div className="my-recipes-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="my-recipes-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>{t('myRecipes.loading', 'Cargando tus recetas...')}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-recipes-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="my-recipes-container">
                    <div className="error-state">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="#d32f2f" strokeWidth="2"/>
                            <path d="M12 8v4M12 16h.01" stroke="#d32f2f" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h2>{t('myRecipes.errorTitle', 'Error al cargar las recetas')}</h2>
                        <p>{t('myRecipes.errorBody', 'No se pudieron cargar tus recetas. Por favor, intenta de nuevo.')}</p>
                        <button onClick={cargarRecetas} className="retry-button">
                            {t('myRecipes.retry', 'Reintentar')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="my-recipes-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="my-recipes-container">
                    <div className="empty-state">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                            <path d="M19 11H5M19 11a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="#6b95a5" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h2>{t('myRecipes.emptyTitle', 'No tienes recetas aún')}</h2>
                        <p>{t('myRecipes.emptyBody', 'Empieza creando tu primera receta saludable')}</p>
                        <button onClick={() => navigate('/recetas/crear')} className="create-first-button">
                            {t('myRecipes.createFirst', 'Crear mi primera receta')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-recipes-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="my-recipes-container">
                <div className="my-recipes-header">
                    <h1 className="recipes-title">{t('myRecipes.title', 'MIS RECETAS')}</h1>
                    <p className="recipes-subtitle">{t('myRecipes.subtitle', 'Aquí puedes ver tus recetas creadas')}</p>
                </div>

                <section className="my-recipes-summary-grid">
                    <article className="my-recipes-summary-card">
                        <span>{t('myRecipes.summaryTotal', 'Total de recetas')}</span>
                        <strong>{recipeSummary.total}</strong>
                    </article>
                    <article className="my-recipes-summary-card">
                        <span>{t('myRecipes.summaryCalories', 'Calorías medias')}</span>
                        <strong>{recipeSummary.avgCalories} kcal</strong>
                    </article>
                    <article className="my-recipes-summary-card">
                        <span>{t('myRecipes.summaryLatest', 'Última creación')}</span>
                        <strong>{recipeSummary.latestDate}</strong>
                    </article>
                </section>

                <section className="my-recipes-actions">
                    <button className="recipe-button" onClick={() => navigate('/recetas/colecciones')}>
                        {t('collections.breadcrumb2', 'Ver colecciones')}
                    </button>
                    <button className="recipe-button" onClick={() => navigate('/recetas/plan')}>
                        {t('nav.weekPlan', 'Plan semanal')}
                    </button>
                    <button className="recipe-button" onClick={() => navigate('/platos/explorar')}>
                        {t('nav.explore', 'Explorar platos')}
                    </button>
                </section>

                <div className="recipes-list">
                    {recipes.map((receta) => (
                        <div key={receta._id} className="recipe-card">
                            <div className="recipe-image-container">
                                <img 
                                    src={receta.imagen || 'data:image/svg+xml,%3Csvg width="180" height="150" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="180" height="150" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EImagen%3C/text%3E%3C/svg%3E'} 
                                    alt={receta.nombre}
                                    className="recipe-image"
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg width="180" height="150" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="180" height="150" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="12"%3EImagen%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                            
                            <div className="recipe-info-container">
                                <p className="recipe-field">
                                    <span className="field-label">{t('home.recent.name', 'Nombre')}:</span>
                                    <span className="field-value">{receta.nombre}</span>
                                </p>
                                <p className="recipe-field">
                                    <span className="field-label">{t('home.recent.description', 'Descripción')}:</span>
                                    <span className="field-value">{receta.descripcionCorta || t('breakfast.noShortDescription', 'Sin descripción')}</span>
                                </p>
                                <p className="recipe-field">
                                    <span className="field-label">{t('home.recent.calories', 'Calorías')}:</span>
                                    <span className="field-value">{receta.calorias?.toFixed(0) || 0} kcal</span>
                                </p>
                                <p className="recipe-field">
                                    <span className="field-label">{t('home.recent.difficulty', 'Dificultad')}:</span>
                                    <span className="field-value">{receta.dificultad || t('breakfast.medium', 'Media')}</span>
                                </p>
                                <p className="recipe-field">
                                    <span className="field-label">{t('home.recent.date', 'Fecha de creación')}:</span>
                                    <span className="field-value">{new Date(receta.createdAt).toLocaleDateString(dateLocale)}</span>
                                </p>
                            </div>
                            
                            <div className="recipe-actions">
                                <button 
                                    className="recipe-button"
                                    onClick={() => handleVerReceta(receta._id)}
                                >
                                    {t('breakfast.viewRecipe', 'Ver receta')}
                                </button>
                                <button 
                                    className="recipe-button delete-button"
                                    onClick={() => handleEliminarReceta(receta._id)}
                                >
                                    {t('common.delete', 'Eliminar')}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyRecipes;
