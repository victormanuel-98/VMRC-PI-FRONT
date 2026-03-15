import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [userAvatar, setUserAvatar] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

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

    return (
        <header className="header">
            <div className="header-content">
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Buscar super foods..."
                        className="search-input"
                    />
                </div>

                <div className="logo-container">
                    <img src="/logoFitFood.png" alt="FitFood" className="logo" />
                </div>

                <div className="header-icons">
                    <div className="user-dropdown-container" onMouseEnter={() => setUserDropdownOpen(true)} onMouseLeave={() => setUserDropdownOpen(false)}>
                        <button className="icon-button user-icon">
                            {userAvatar ? (
                                <img src={userAvatar} alt="Perfil" className="user-avatar" />
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" fill="white" />
                                    <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" fill="none" />
                                </svg>
                            )}
                        </button>
                        <div className={`user-dropdown ${userDropdownOpen ? 'show' : ''}`}>
                            <button className="dropdown-item" onClick={() => {
                                navigate('/perfil');
                                setUserDropdownOpen(false);
                            }}>
                                Mi perfil
                            </button>
                            <button className="dropdown-item logout-item" onClick={() => setShowLogoutConfirm(true)}>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                    <button className="icon-button menu-icon" onClick={() => navigate('/ajustes')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="5" width="24" height="2" fill="white" />
                            <rect y="11" width="24" height="2" fill="white" />
                            <rect y="17" width="24" height="2" fill="white" />
                        </svg>
                    </button>
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
