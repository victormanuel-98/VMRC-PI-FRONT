import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUiPreferences } from '../context/UiPreferencesContext';
import Breadcrumbs from '../components/Breadcrumbs';
import {
    obtenerReceta,
    agregarFavorito,
    eliminarFavorito,
    crearValoracion,
    obtenerFavoritos,
} from '../services/api';

const RecipeDetail = () => {
    const { t } = useUiPreferences();
    const { id } = useParams();
    const navigate = useNavigate();
    const [receta, setReceta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const breadcrumbItems = [
        { label: t('nav.home', 'Inicio'), path: '/inicio' },
        { label: t('nav.myRecipes', 'Mis Recetas'), path: '/recetas' },
        { label: t('recipeDetail.breadcrumb', 'Detalle de Receta'), path: `/receta/${id}` }
    ];

    const cargarReceta = async () => {
        try {
            setLoading(true);
            const respuesta = await obtenerReceta(id);

            if (respuesta.receta) {
                setReceta(respuesta.receta);
                setError('');
            } else {
                setError(t('recipeDetail.notFound', 'Receta no encontrada'));
            }
        } catch {
            setError(t('recipeDetail.loadError', 'Error al cargar la receta'));
        } finally {
            setLoading(false);
        }
    };

    const cargarEstadoFavorito = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const favoritos = await obtenerFavoritos(token);
            if (Array.isArray(favoritos)) {
                setIsFavorite(favoritos.some((fav) => fav?.receta?._id === id));
            }
        } catch {
            setIsFavorite(false);
        }
    };

    useEffect(() => {
        cargarReceta();
        cargarEstadoFavorito();
    }, [id]);

    const handleToggleFavorite = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert(t('createRecipe.errorLogin', 'Debes iniciar sesión'));
            return;
        }

        try {
            if (isFavorite) {
                await eliminarFavorito(id, token);
                setIsFavorite(false);
            } else {
                await agregarFavorito(id, token);
                setIsFavorite(true);
            }
        } catch {
            alert(t('recipeDetail.favoriteError', 'Error al actualizar favorito'));
        }
    };

    const handleSubmitRating = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert(t('createRecipe.errorLogin', 'Debes iniciar sesión'));
            return;
        }

        if (rating === 0) {
            alert(t('recipeDetail.selectRating', 'Selecciona una puntuación'));
            return;
        }

        try {
            await crearValoracion({ recetaId: id, puntuacion: rating, comentario: comment }, token);
            alert(t('recipeDetail.ratingSent', 'Valoración enviada'));
            setRating(0);
            setComment('');
            await cargarReceta();
        } catch {
            alert(t('recipeDetail.ratingError', 'Error al enviar valoración'));
        }
    };

    if (loading) {
        return (
            <div className="recipe-detail-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>{t('recipeDetail.loading', 'Cargando receta...')}</p>
                </div>
            </div>
        );
    }

    if (error || !receta) {
        return (
            <div className="recipe-detail-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="error-state">
                    <h2>{error || t('recipeDetail.notFound', 'Receta no encontrada')}</h2>
                    <button onClick={() => navigate('/recetas')} className="back-button">
                        {t('recipeDetail.backToRecipes', 'Volver a recetas')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recipe-detail-page">
            <Breadcrumbs items={breadcrumbItems} />
            
            <div className="recipe-detail-container">
                <div className="recipe-header">
                    <div className="recipe-image-section">
                        <img 
                            src={receta.imagen || 'https://via.placeholder.com/600x400?text=Sin+imagen'} 
                            alt={receta.nombre}
                            className="recipe-main-image"
                        />
                        <button 
                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={handleToggleFavorite}
                        >
                            {isFavorite ? t('recipeDetail.inFavorites', 'En favoritos') : t('recipeDetail.addFavorite', 'Agregar a favoritos')}
                        </button>
                    </div>

                    <div className="recipe-info-section">
                        <h1 className="recipe-title">{receta.nombre}</h1>
                        
                        <div className="recipe-meta">
                            <span className="meta-item">
                                {receta.autor?.nombre || t('recipeDetail.anonymous', 'Anónimo')}
                            </span>
                            <span className="meta-item">
                                ⏱️ {receta.tiempoPreparacion} min
                            </span>
                            <span className="meta-item difficulty">
                                {receta.dificultad || t('breakfast.medium', 'Media')}
                            </span>
                            <span className="meta-item">
                                {receta.categoria || t('recipeDetail.general', 'General')}
                            </span>
                        </div>

                        <p className="recipe-description">{receta.descripcionCorta}</p>

                        <div className="nutrition-facts">
                            <h3>{t('recipeDetail.nutrition', 'Información Nutricional')}</h3>
                            <div className="nutrition-grid">
                                <div className="nutrition-item">
                                    <span className="nutrition-value">{receta.calorias?.toFixed(0) || 0}</span>
                                    <span className="nutrition-label">{t('home.recent.calories', 'Calorías')}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="nutrition-value">{receta.proteinas?.toFixed(1) || 0}g</span>
                                    <span className="nutrition-label">{t('recipeDetail.proteins', 'Proteínas')}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="nutrition-value">{receta.carbohidratos?.toFixed(1) || 0}g</span>
                                    <span className="nutrition-label">{t('recipeDetail.carbs', 'Carbohidratos')}</span>
                                </div>
                                <div className="nutrition-item">
                                    <span className="nutrition-value">{receta.grasas?.toFixed(1) || 0}g</span>
                                    <span className="nutrition-label">{t('recipeDetail.fats', 'Grasas')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="recipe-content">
                    <section className="ingredients-section">
                        <h2>{t('createRecipe.ingredientsTitle', 'INGREDIENTES')}</h2>
                        <ul className="ingredients-list">
                            {receta.ingredientes && receta.ingredientes.length > 0 ? (
                                receta.ingredientes.map((item, index) => (
                                    <li key={`${item?.ingrediente?._id || 'ingrediente'}-${index}`}>
                                        <span className="ingredient-amount">{item.cantidad}g</span>
                                        <span className="ingredient-name">
                                            {item.ingrediente?.nombre || t('recipeDetail.ingredient', 'Ingrediente')}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <li>{t('recipeDetail.noIngredients', 'No hay ingredientes disponibles')}</li>
                            )}
                        </ul>
                    </section>

                    <section className="instructions-section">
                        <h2>{t('recipeDetail.preparation', 'Preparación')}</h2>
                        <div className="instructions-content">
                            {receta.descripcionLarga ? (
                                <p className="instructions-text">{receta.descripcionLarga}</p>
                            ) : (
                                <p className="instructions-text">{t('recipeDetail.noInstructions', 'No hay instrucciones disponibles')}</p>
                            )}
                        </div>
                    </section>

                    <section className="rating-section">
                        <h2>{t('recipeDetail.rateTitle', 'Valorar esta receta')}</h2>
                        <div className="rating-form">
                            <div className="stars-input">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star-btn ${rating >= star ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ⭐
                                    </button>
                                ))}
                            </div>
                            <textarea
                                placeholder={t('recipeDetail.commentPlaceholder', 'Escribe un comentario (opcional)')}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="comment-input"
                            />
                            <button 
                                onClick={handleSubmitRating}
                                className="submit-rating-btn"
                            >
                                {t('recipeDetail.sendRating', 'Enviar valoración')}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
