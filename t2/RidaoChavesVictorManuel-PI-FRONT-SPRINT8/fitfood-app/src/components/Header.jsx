import React from 'react';
import './Header.css';

const Header = () => {
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
                    <img src="/logo.png" alt="FitFood" className="logo" />
                </div>

                <div className="header-icons">
                    <button className="icon-button user-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="8" r="4" fill="white" />
                            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                    <button className="icon-button menu-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect y="5" width="24" height="2" fill="white" />
                            <rect y="11" width="24" height="2" fill="white" />
                            <rect y="17" width="24" height="2" fill="white" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
