import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUiPreferences } from '../context/UiPreferencesContext';

const Header = () => {
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    const { preferences, toggleLanguage, toggleTheme, t } = useUiPreferences();
    const [userAvatar, setUserAvatar] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const savedAvatar = localStorage.getItem('userAvatar');
        if (savedAvatar) {
            setUserAvatar(savedAvatar);
        }
    }, []);

    const handleLogout = () => {
        logout();
        setShowLogoutConfirm(false);
        setUserDropdownOpen(false);
        navigate('/login');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = search.trim();
        if (!query) return;

        navigate(`/platos/otros?busqueda=${encodeURIComponent(query)}`);
        setSearch('');
    };

    return (
        <header className="header">
            <div className="header-content">
                <div className="search-container">
                    <form onSubmit={handleSearchSubmit}>
                        <input
                            type="text"
                            placeholder={t('header.searchPlaceholder', 'Buscar recetas...')}
                            className="search-input"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>

                <div className="logo-container">
                    <img src="/logoFitFood.png" alt="FitFood" className="logo" />
                </div>

                <div className="header-icons">
                    <div className="user-dropdown-container" onMouseEnter={() => setSettingsDropdownOpen(true)} onMouseLeave={() => setSettingsDropdownOpen(false)}>
                        <button className="icon-button settings-icon" aria-label={t('header.settings', 'Ajustes rápidos')}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="white" strokeWidth="2"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1V15Z" stroke="white" strokeWidth="1.4"/>
                            </svg>
                        </button>
                        <div className={`user-dropdown settings-dropdown ${settingsDropdownOpen ? 'show' : ''}`}>
                            <button className="dropdown-item" onClick={toggleTheme}>
                                {t('header.darkMode', 'Modo oscuro')}: {preferences.theme === 'dark' ? 'ON' : 'OFF'}
                            </button>
                            <button className="dropdown-item" onClick={toggleLanguage}>
                                {t('header.english', 'Inglés')}: {preferences.language === 'en' ? 'ON' : 'OFF'}
                            </button>
                            <button
                                className="dropdown-item"
                                onClick={() => {
                                    setSettingsDropdownOpen(false);
                                    navigate('/ajustes');
                                }}
                            >
                                {t('header.settingsPage', 'Abrir ajustes')}
                            </button>
                        </div>
                    </div>

                    <div className="user-dropdown-container" onMouseEnter={() => setUserDropdownOpen(true)} onMouseLeave={() => setUserDropdownOpen(false)}>
                        <button className="icon-button user-icon" aria-label={t('header.profile', 'Mi perfil')}>
                            {userAvatar ? (
                                <img src={userAvatar} alt="Perfil" className="user-avatar" />
                            ) : (
                                <img src="/default-avatar.png" alt="Perfil" className="user-avatar" />
                            )}
                            <span className="header-user-name">{user?.nombre || user?.usuario || 'FitFood'}</span>
                        </button>
                        <div className={`user-dropdown ${userDropdownOpen ? 'show' : ''}`}>
                            <button className="dropdown-item" onClick={() => {
                                navigate('/perfil');
                                setUserDropdownOpen(false);
                            }}>
                                {t('header.profile', 'Mi perfil')}
                            </button>
                            <button className="dropdown-item logout-item" onClick={() => setShowLogoutConfirm(true)}>
                                {t('header.logout', 'Cerrar sesión')}
                            </button>
                        </div>
                    </div>
                </div>

                {showLogoutConfirm && (
                    <div className="logout-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
                        <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
                            <h2>Cerrar sesión</h2>
                            <p>¿Estás seguro de que deseas cerrar la sesión?</p>
                            <div className="modal-buttons">
                                <button className="modal-btn cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                                    No
                                </button>
                                <button className="modal-btn confirm-btn" onClick={handleLogout}>
                                    Sí
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
