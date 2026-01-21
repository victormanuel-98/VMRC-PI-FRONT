import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';

const MyRecipes = () => {
    const breadcrumbItems = [
        { label: 'Inicio', path: '/inicio' },
        { label: 'Mis Recetas', path: '/mis-recetas' }
    ];
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [recipes] = useState([
        {
            id: 1,
            nombre: 'pizza básica',
            descripcion: 'pizza con tomate, queso y orégano',
            fecha: '23/03/2025',
            imagen: './platos/receta-pizza.png'
        },
        {
            id: 2,
            nombre: 'albóndigas en salsa',
            descripcion: 'albóndigas de cordero en salsa',
            fecha: '14/11/2024',
            imagen: './platos/receta-albondigas.png'
        },
        {
            id: 3,
            nombre: 'batido de plátano y kiwi',
            descripcion: 'batido natural con 2 plátanos y 1 kiwi',
            fecha: '7/04/2024',
            imagen: './platos/receta-batido.png'
        },
        {
            id: 4,
            nombre: 'bol de avena',
            descripcion: 'bol de avena, arándanos y canela',
            fecha: '12/12/2025',
            imagen: './platos/receta-bol.png'
        },
        {
            id: 5,
            nombre: 'sopa con fideos',
            descripcion: 'sopa de fideos en caldo de pollo',
            fecha: '02/06/2022',
            imagen: './platos/receta-sopa.png'
        },
        {
            id: 6,
            nombre: 'ensalada griega',
            descripcion: 'ensalada fresca con tomate, pepino y queso',
            fecha: '15/01/2026',
            imagen: './platos/receta-ensalada.png'
        },
        {
            id: 7,
            nombre: 'pasta carbonara',
            descripcion: 'pasta con salsa cremosa de huevo y jamón',
            fecha: '10/01/2026',
            imagen: './platos/receta-pasta.png'
        },
        {
            id: 8,
            nombre: 'salmon a la mantequilla',
            descripcion: 'salmon fresco con salsa de mantequilla y limón',
            fecha: '05/01/2026',
            imagen: './platos/receta-salmon.png'
        },
        {
            id: 9,
            nombre: 'tacos al pastor',
            descripcion: 'tacos con pollo marinado y piña',
            fecha: '01/01/2026',
            imagen: './platos/receta-tacos.png'
        },
        {
            id: 10,
            nombre: 'risotto de champiñones',
            descripcion: 'arroz cremoso con champiñones y queso parmesano',
            fecha: '28/12/2025',
            imagen: './platos/receta-risotto.png'
        },
        {
            id: 11,
            nombre: 'pollo al curry',
            descripcion: 'pollo tierno en salsa de curry y coco',
            fecha: '25/12/2025',
            imagen: './platos/receta-curry.png'
        },
        {
            id: 12,
            nombre: 'brownies de chocolate',
            descripcion: 'brownie casero con chocolate belga',
            fecha: '20/12/2025',
            imagen: './platos/receta-brownie.png'
        },
        {
            id: 13,
            nombre: 'ceviche peruano',
            descripcion: 'ceviche fresco de pescado con limón y cilantro',
            fecha: '15/12/2025',
            imagen: './platos/receta-ceviche.png'
        },
        {
            id: 14,
            nombre: 'pad thai',
            descripcion: 'fideos de arroz salteados con camarones y cacahuete',
            fecha: '10/12/2025',
            imagen: './platos/receta-padthai.png'
        },
        {
            id: 15,
            nombre: 'tarta de fresas',
            descripcion: 'tarta casera con nata y fresas frescas',
            fecha: '05/12/2025',
            imagen: './platos/receta-tarta.png'
        }
    ]).slice(0, 15);

    useEffect(() => {
        // Simular carga de datos
        const timer = setTimeout(() => {
            setLoading(false);
            // Descomentar para probar estado de error: setError(true);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleVerReceta = (recetaId) => {
        navigate('/receta');
    };

    // Estado de carga
    if (loading) {
        return (
            <div className="my-recipes-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="my-recipes-container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando tus recetas...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Estado de error
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
                        <h2>Error al cargar las recetas</h2>
                        <p>No se pudieron cargar tus recetas. Por favor, intenta de nuevo.</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Estado vacío
    if (recipes.length === 0) {
        return (
            <div className="my-recipes-page">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="my-recipes-container">
                    <div className="empty-state">
                        <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                            <path d="M19 11H5M19 11a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2M19 11V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" stroke="#6b95a5" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <h2>No tienes recetas aún</h2>
                        <p>Empieza creando tu primera receta saludable</p>
                        <button onClick={() => navigate('/recetas/crear')} className="create-first-button">
                            Crear mi primera receta
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
                    <h1 className="recipes-title">MIS RECETAS</h1>
                    <p className="recipes-subtitle">Aquí puedes ver tus recetas creadas</p>
                </div>

                <div className="recipes-list">
                    {recipes.map((receta) => (
                        <div key={receta.id} className="recipe-card">
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
                            
                            <button 
                                className="recipe-button"
                                onClick={() => handleVerReceta(receta.id)}
                            >
                                Receta
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyRecipes;
