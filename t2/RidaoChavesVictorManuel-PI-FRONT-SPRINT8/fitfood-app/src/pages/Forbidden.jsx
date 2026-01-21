import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
    const navigate = useNavigate();

    return (
        <div className="forbidden-page">
            <div className="forbidden-container">
                <p className="forbidden-subtitle">Acceso denegado</p>
                <div className="forbidden-code">403</div>
                <h1 className="forbidden-title">No tienes permisos</h1>
                <p className="forbidden-description">
                    No tienes autorización para acceder a esta página
                </p>
                
                <div className="forbidden-buttons">
                    <button className="go-back-button" onClick={() => navigate(-1)}>
                        Volver atrás
                    </button>
                    <button className="go-home-button" onClick={() => navigate('/inicio')}>
                        Ir al inicio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Forbidden;
