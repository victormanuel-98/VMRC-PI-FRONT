import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';
import { login as apiLogin } from '../services/api';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();
    const { preferences, toggleTheme, toggleLanguage, t } = useUiPreferences();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const respuesta = await apiLogin(usuario, contrasena);
            
            if (respuesta.token) {
                localStorage.setItem('token', respuesta.token);
                login({
                    id: respuesta.usuario.id,
                    usuario: respuesta.usuario.usuario,
                    nombre: respuesta.usuario.nombre,
                    rol: respuesta.usuario.rol,
                    email: respuesta.usuario.email,
                });
                
                navigate('/inicio');
            } else {
                setError(respuesta.mensaje || t('login.errorAuth', 'Error al iniciar sesión'));
            }
        } catch (err) {
            setError(err?.message || t('login.errorConnection', 'Error de conexión. Verifica que el servidor esté activo.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page auth-page">
            <div className="auth-quick-controls">
                <button type="button" onClick={toggleTheme} className="auth-quick-btn">
                    {preferences.theme === 'dark' ? t('auth.themeLight', 'Modo claro') : t('auth.themeDark', 'Modo oscuro')}
                </button>
                <button type="button" onClick={toggleLanguage} className="auth-quick-btn">
                    {preferences.language === 'en' ? t('auth.spanish', 'Español') : t('auth.english', 'English')}
                </button>
            </div>
            <div className="auth-shell">
                <div className="login-card auth-panel">
                    <div className="welcome-section auth-heading">
                        <span className="auth-badge">FitFood</span>
                        <h1 className="welcome-title">{t('login.welcomeTitle', 'Bienvenidos a FitFood')}</h1>
                        <p className="welcome-subtitle">{t('login.welcomeSubtitle', 'Tu aliado diario para una alimentación más saludable.')}</p>
                    </div>

                    <h2 className="login-title">{t('login.title', 'Iniciar sesión')}</h2>

                    <form onSubmit={handleSubmit} className="login-form">
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="form-group">
                            <label htmlFor="usuario">{t('login.user', 'Usuario')}</label>
                            <input
                                type="text"
                                id="usuario"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="contrasena">{t('login.password', 'Contraseña')}</label>
                            <input
                                type="password"
                                id="contrasena"
                                value={contrasena}
                                onChange={(e) => setContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? t('login.submitLoading', 'Iniciando sesión...') : t('login.submit', 'Acceder')}
                        </button>

                        <div className="register-section">
                            <p>{t('login.noAccount', '¿Aún no estás registrado?')}</p>
                            <button type="button" className="register-link" onClick={() => navigate('/registro')}>
                                {t('login.createAccount', 'Crear cuenta')}
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="auth-visual">
                    <img src="/images/650_1200.jpg" alt={t('login.welcomeSubtitle', 'Tu aliado diario para una alimentación más saludable.')} className="auth-visual-image" />
                    <div className="auth-visual-content">
                        <h3>{t('login.visualTitle', 'Pequeños hábitos, grandes cambios')}</h3>
                        <p>{t('login.visualText', 'Cada plato consciente es un paso hacia tu mejor versión. Empieza hoy con FitFood.')}</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Login;
