import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const BreakfastRecipes = () => {
    const breadcrumbItems = [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Platos', path: '/inicio' },
        { label: 'Desayuno', path: '/platos/desayuno' }
    ];
    const navigate = useNavigate();
    const [recipes] = useState([
        {
            id: 1,
            nombre: 'batido de plátano y kiwi',
            descripcion: 'batido natural con 2 plátanos y 1 kiwi',
            fecha: '7/04/2024',
            imagen: '/platos/receta-batido.png'
        },
        {
            id: 2,
            nombre: 'bol de avena',
            descripcion: 'bol de avena, arándanos y canela',
            fecha: '12/12/2025',
            imagen: '/platos/receta-bol.png'
        },
        {
            id: 3,
            nombre: 'tostadas con aguacate',
            descripcion: 'pan tostado con aguacate, tomate y huevo',
            fecha: '18/01/2026',
            imagen: '/platos/receta-tostadas.png'
        },
        {
            id: 4,
            nombre: 'yogur con granola',
            descripcion: 'yogur griego con granola casera y miel',
            fecha: '15/01/2026',
            imagen: '/platos/receta-yogur.png'
        },
        {
            id: 5,
            nombre: 'tortilla francesa',
            descripcion: 'tortilla de 3 huevos con queso y jamón',
            fecha: '12/01/2026',
            imagen: '/platos/receta-tortilla.png'
        },
        {
            id: 6,
            nombre: 'gachas de chocolate',
            descripcion: 'gachas caseras de avena y chocolate puro',
            fecha: '10/01/2026',
            imagen: '/platos/receta-gachas.png'
        },
        {
            id: 7,
            nombre: 'smoothie bowl',
            descripcion: 'bowl de smoothie con frutas y coco rallado',
            fecha: '08/01/2026',
            imagen: '/platos/receta-smoothie-bowl.png'
        },
        {
            id: 8,
            nombre: 'panqueques integrales',
            descripcion: 'panqueques de harina integral con sirope de arce',
            fecha: '05/01/2026',
            imagen: '/platos/receta-panqueques.png'
        }
    ]);

    return (
        <div className="breakfast-page">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="breakfast-container">
                <h1 className="breakfast-title">Desayunos</h1>
                <p className="breakfast-subtitle">Recetas saludables para comenzar tu día</p>
                
                <div className="breakfast-grid">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card-breakfast">
                            <div className="recipe-image-breakfast">
                                <img src={recipe.imagen} alt={recipe.nombre} />
                            </div>
                            <div className="recipe-content-breakfast">
                                <h3 className="recipe-name-breakfast">{recipe.nombre}</h3>
                                <p className="recipe-description-breakfast">{recipe.descripcion}</p>
                                <p className="recipe-date-breakfast">{recipe.fecha}</p>
                                <button 
                                    className="recipe-button-breakfast" 
                                    onClick={() => navigate('/receta')}
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
