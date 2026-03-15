import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import { obtenerRecetas } from '../services/api';

const BreakfastRecipes = () => {
    const breadcrumbItems = [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Platos', path: '/inicio' },
        { label: 'Desayuno', path: '/platos/desayuno' }
    ];
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        cargarRecetasDesayuno();
    }, []);

    const cargarRecetasDesayuno = async () => {
        try {
            setLoading(true);
            setError(false);
            const respuesta = await obtenerRecetas({ categoria: 'desayuno' });
            
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
                        <p>Cargando recetas de desayuno...</p>
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
                        <h2>Error al cargar las recetas</h2>
                        <p>No se pudieron cargar las recetas de desayuno. Por favor, intenta de nuevo.</p>
                        <button onClick={cargarRecetasDesayuno} className="retry-button">
                            Reintentar
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
                        <h2>No hay recetas de desayuno</h2>
                        <p>Aún no hay recetas de desayuno disponibles. ¡Sé el primero en crear una!</p>
                        <button onClick={() => navigate('/recetas/crear')} className="create-first-button">
                            Crear receta de desayuno
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
                <h1 className="breakfast-title">Desayunos</h1>
                <p className="breakfast-subtitle">Recetas saludables para comenzar tu día</p>
                
                <div className="breakfast-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="recipe-card-breakfast">
                            <div className="recipe-image-breakfast">
                                <img 
                                    src={recipe.imagen || 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16"%3ESin imagen%3C/text%3E%3C/svg%3E'} 
                                    alt={recipe.nombre}
                                    onError={(e) => {
                                        e.target.src = 'data:image/svg+xml,%3Csvg width="300" height="200" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="300" height="200" fill="%23e0e0e0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999" font-size="16"%3ESin imagen%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                            <div className="recipe-content-breakfast">
                                <h3 className="recipe-name-breakfast">{recipe.nombre}</h3>
                                <p className="recipe-description-breakfast">
                                    {recipe.descripcionCorta || recipe.descripcion?.substring(0, 80) + '...' || 'Sin descripción'}
                                </p>
                                <div className="recipe-stats-breakfast">
                                    <span className="recipe-calories">
                                        {recipe.calorias ? `${recipe.calorias.toFixed(0)} kcal` : 'N/A'}
                                    </span>
                                    <span className="recipe-difficulty">
                                        {recipe.dificultad || 'Media'}
                                    </span>
                                </div>
                                <p className="recipe-date-breakfast">
                                    {new Date(recipe.createdAt).toLocaleDateString('es-ES')}
                                </p>
                                <button 
                                    className="recipe-button-breakfast" 
                                    onClick={() => handleVerReceta(recipe._id)}
                                >
                                    Ver receta
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
