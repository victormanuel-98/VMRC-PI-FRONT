import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiPreferences } from '../context/UiPreferencesContext';

const NotFound = () => {
    const navigate = useNavigate();
    const { t } = useUiPreferences();

    const handleGoBack = () => {
        if (globalThis.history.length > 1) {
            navigate(-1);
            return;
        }
        navigate('/login');
    };

    const handleReport = () => {
        const path = globalThis.location?.pathname || '/';
        const subject = encodeURIComponent('FitFood - Error 404');
        const body = encodeURIComponent(`Hola, he encontrado una pagina que no funciona.\n\nRuta: ${path}\nURL: ${globalThis.location?.href || ''}`);
        globalThis.location.href = `mailto:soporte.fitfood@gmail.com?subject=${subject}&body=${body}`;
    };

    return (
        <div className="not-found-page">
            <div className="not-found-shell">
                <article className="not-found-card">
                    <div className="not-found-icon" aria-hidden="true">⚠️</div>
                    <p className="not-found-subtitle">{t('notFound.subtitle', 'Ups... parece que ha habido un problema')}</p>
                    <div className="error-code">404</div>
                    <h1 className="error-title">{t('notFound.title', 'Página no encontrada')}</h1>
                    <p className="not-found-description">
                        {t('notFound.description', 'La página que intentas abrir no está disponible o se ha movido.')}
                    </p>

                    <div className="not-found-actions">
                        <button className="nf-btn nf-btn-secondary" onClick={handleGoBack}>
                            {t('notFound.back', 'Volver atrás')}
                        </button>
                        <button className="nf-btn nf-btn-primary" onClick={() => navigate('/inicio')}>
                            {t('notFound.backHome', 'Volver al inicio')}
                        </button>
                        <button className="nf-btn nf-btn-ghost" onClick={handleReport}>
                            {t('notFound.report', 'Avisar de que esta página no funciona')}
                        </button>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default NotFound;
