import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiPreferences } from '../context/UiPreferencesContext';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useUiPreferences();

    return (
        <div className="not-found-page">
            <div className="not-found-container">
                <p className="not-found-subtitle">{t('notFound.subtitle', 'Ups... parece que ha habido un problema')}</p>
                <div className="error-code">404</div>
                <h1 className="error-title">{t('notFound.title', 'Página no encontrada')}</h1>
                
                <button className="go-back-button" onClick={() => navigate('/inicio')}>
                    {t('notFound.backHome', 'Volver al inicio')}
                </button>
            </div>
        </div>
    );
};

export default NotFound;
