import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const RecipeDetail = () => {
    const breadcrumbItems = [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Mis Recetas', path: '/mis-recetas' },
        { label: 'Detalle de Receta', path: '/receta' }
    ];
    const navigate = useNavigate();
    
    // Array de recetas de ejemplo
    const recipes = [
        {
            id: 1,
            title: 'Ensalada de tallarines y quinoa al pesto griego',
            author: 'elChefSueco_78',
            difficulty: 'Fácil',
            prepTime: '20 min',
            servings: 4,
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop',
            description: 'Una ensalada fresca y nutritiva con tallarines integrales, quinoa y un delicioso pesto griego hecho con hierbas aromáticas.',
            ingredients: [
                '200g de tallarines integrales',
                '150g de quinoa cocida',
                '2 tomates medianos',
                '1 pepino',
                '100g de queso feta',
                '50g de aceitunas negras',
                '3 dientes de ajo',
                '100ml de aceite de oliva',
                'Hierbas frescas (albahaca, orégano, perejil)',
                'Sal y pimienta al gusto'
            ],
            instructions: [
                'Cocina los tallarines según las instrucciones del paquete. Escurre y reserva.',
                'Prepara el pesto triturando las hierbas frescas con ajo, queso feta y aceite de oliva.',
                'Pica los tomates y el pepino en cubos pequeños.',
                'En un recipiente grande, mezcla los tallarines, quinoa, tomates, pepino y aceitunas.',
                'Agrega el pesto y mezcla bien hasta que todo quede bien combinado.',
                'Ajusta la sazón con sal y pimienta al gusto.',
                'Sirve fría o a temperatura ambiente.'
            ],
            nutrients: {
                calories: 380,
                protein: '12g',
                carbs: '45g',
                fat: '18g'
            }
        },
        {
            id: 2,
            title: 'Dados de pollo con salsa cremosa de puerro',
            author: 'sonja_76685',
            difficulty: 'Medio',
            prepTime: '30 min',
            servings: 4,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600&h=400&fit=crop',
            description: 'Pollo tierno cortado en dados y preparado con una salsa cremosa de puerro que le da un sabor exquisito.',
            ingredients: [
                '500g de pechuga de pollo',
                '3 puerros medianos',
                '200ml de crema de leche',
                '100ml de caldo de pollo',
                '2 cucharadas de mantequilla',
                '1 cebolla pequeña',
                '2 dientes de ajo',
                'Sal, pimienta y nuez moscada',
                'Perejil fresco para decorar'
            ],
            instructions: [
                'Corta el pollo en cubos medianos y sazónalos con sal y pimienta.',
                'Calienta la mantequilla en una sartén grande a fuego medio-alto.',
                'Dora los dados de pollo hasta que estén cocidos por fuera. Reserva.',
                'En la misma sartén, sofríe la cebolla y ajo picados.',
                'Añade los puerros limpios y cortados en rodajas.',
                'Cocina hasta que los puerros estén tiernos (unos 8 minutos).',
                'Vierte el caldo de pollo y la crema de leche.',
                'Vuelve a agregar el pollo y simmer por 15 minutos.',
                'Ajusta la sazón y decora con perejil fresco.'
            ],
            nutrients: {
                calories: 420,
                protein: '35g',
                carbs: '15g',
                fat: '22g'
            }
        },
        {
            id: 3,
            title: 'Pollo en salsa dulce de ciruela con berenjena',
            author: 'elChocopixta35',
            difficulty: 'Medio',
            prepTime: '35 min',
            servings: 4,
            rating: 4,
            image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop',
            description: 'Una combinación exótica de pollo jugoso con una salsa dulce de ciruela y berenjena tierna.',
            ingredients: [
                '600g de pollo deshuesado',
                '2 berenjenas',
                '150g de ciruelas pasas',
                '200ml de caldo de pollo',
                '50ml de vinagre balsámico',
                '2 cucharadas de miel',
                '3 dientes de ajo',
                '1 cebolla morada',
                'Aceite de oliva',
                'Sal y pimienta'
            ],
            instructions: [
                'Corta el pollo en filetes y sazónalos.',
                'Corta la berenjena en cubos pequeños.',
                'En una sartén, dora el pollo en aceite de oliva. Reserva.',
                'Sofríe la cebolla y ajo hasta que desprendan aroma.',
                'Agrega la berenjena y cocina 5 minutos.',
                'Vuelve a incorporar el pollo.',
                'Añade las ciruelas pasas, caldo, vinagre y miel.',
                'Cocina a fuego lento durante 20 minutos.',
                'Verifica que el pollo esté cocido y sirve caliente.'
            ],
            nutrients: {
                calories: 390,
                protein: '32g',
                carbs: '35g',
                fat: '12g'
            }
        },
        {
            id: 4,
            title: 'Lomo de cerdo adobado con puré de patata',
            author: 'victor_9684',
            difficulty: 'Medio',
            prepTime: '40 min',
            servings: 4,
            rating: 5,
            image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop',
            description: 'Lomo de cerdo marinado en especias aromáticas, acompañado de un suave puré de patata casero.',
            ingredients: [
                '700g de lomo de cerdo',
                '1kg de patatas',
                '100ml de leche',
                '50g de mantequilla',
                '4 dientes de ajo',
                '2 cucharaditas de comino',
                '1 cucharadita de pimentón',
                '50ml de aceite de oliva',
                'Sal y pimienta',
                'Hierbas frescas'
            ],
            instructions: [
                'Mezcla ajo picado, comino, pimentón, sal, pimienta y aceite para hacer el adobo.',
                'Unta el lomo con el adobo y deja reposar 30 minutos.',
                'Mientras reposa el lomo, pela y corta las patatas en cubos.',
                'Hierve las patatas en agua con sal hasta que estén tiernas.',
                'Escurre las patatas y machácalas con mantequilla y leche.',
                'Sazóna el puré al gusto.',
                'En una sartén caliente, dora el lomo adobado por todos lados.',
                'Cocina en el horno a 180°C durante 20-25 minutos.',
                'Deja reposar 5 minutos antes de cortar y servir con el puré.'
            ],
            nutrients: {
                calories: 520,
                protein: '40g',
                carbs: '38g',
                fat: '20g'
            }
        }
    ];

    // Selecciona una receta random
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalf = rating % 1 !== 0;
        return '⭐'.repeat(fullStars) + (hasHalf ? '✨' : '');
    };

    return (
        <div className="recipe-detail-page">
            <Breadcrumbs items={breadcrumbItems} />
            <button className="back-button" onClick={() => navigate(-1)}>
                ← Volver
            </button>

            <div className="recipe-detail-container">
                <div className="recipe-image-section">
                    <img 
                        src={randomRecipe.image} 
                        alt={randomRecipe.title}
                        className="recipe-image-large"
                    />
                </div>

                <div className="recipe-details-section">
                    <h1 className="recipe-title">{randomRecipe.title}</h1>
                    
                    <div className="recipe-meta">
                        <p className="author"><strong>Autor:</strong> {randomRecipe.author}</p>
                        <p className="rating">{renderStars(randomRecipe.rating)} ({randomRecipe.rating}/5)</p>
                    </div>

                    <div className="recipe-info-grid">
                        <div className="info-box">
                            <span className="info-label">Dificultad</span>
                            <span className="info-value">{randomRecipe.difficulty}</span>
                        </div>
                        <div className="info-box">
                            <span className="info-label">Tiempo</span>
                            <span className="info-value">{randomRecipe.prepTime}</span>
                        </div>
                        <div className="info-box">
                            <span className="info-label">Porciones</span>
                            <span className="info-value">{randomRecipe.servings}</span>
                        </div>
                    </div>

                    <div className="recipe-description">
                        <p>{randomRecipe.description}</p>
                    </div>

                    <div className="nutrients-info">
                        <h3>Información nutricional (por porción)</h3>
                        <div className="nutrients-grid">
                            <div className="nutrient">
                                <span className="nutrient-label">Calorías</span>
                                <span className="nutrient-value">{randomRecipe.nutrients.calories}</span>
                            </div>
                            <div className="nutrient">
                                <span className="nutrient-label">Proteína</span>
                                <span className="nutrient-value">{randomRecipe.nutrients.protein}</span>
                            </div>
                            <div className="nutrient">
                                <span className="nutrient-label">Carbohidratos</span>
                                <span className="nutrient-value">{randomRecipe.nutrients.carbs}</span>
                            </div>
                            <div className="nutrient">
                                <span className="nutrient-label">Grasas</span>
                                <span className="nutrient-value">{randomRecipe.nutrients.fat}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="recipe-content">
                <div className="ingredients-section">
                    <h2>Ingredientes</h2>
                    <ul className="ingredients-list">
                        {randomRecipe.ingredients.map((ingredient, idx) => (
                            <li key={idx}>{ingredient}</li>
                        ))}
                    </ul>
                </div>

                <div className="instructions-section">
                    <h2>Instrucciones</h2>
                    <ol className="instructions-list">
                        {randomRecipe.instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;
