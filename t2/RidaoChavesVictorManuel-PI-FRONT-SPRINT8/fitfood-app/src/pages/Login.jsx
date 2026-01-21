import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validar credenciales
        if (usuario === 'victor_98' && contrasena === 'Admin123') {
            // Login exitoso
            login({ usuario, nombre: 'Victor Manuel' });
            navigate('/inicio');
        } else {
            // Mostrar error
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-page">
            <div className="welcome-section">
                <h1 className="welcome-title">Bienvenidos a FitFood</h1>
                <p className="welcome-subtitle">"Tu aliado diario para una alimentación más saludable."</p>
            </div>

            <div className="login-card">
                <h2 className="login-title">Iniciar sesión</h2>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <div className="error-message">{error}</div>}
                    
                    <div className="form-group">
                        <label htmlFor="usuario">
                            Usuario
                            <span className="arrow">▶</span>
                        </label>
                        <input
                            type="text"
                            id="usuario"
                            value={usuario}
                            onChange={(e) => setUsuario(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contrasena">
                            Contraseña
                            <span className="arrow">▶</span>
                        </label>
                        <input
                            type="password"
                            id="contrasena"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">
                        Acceder
                    </button>

                    <div className="register-section">
                        <p>¿Aún no estás registrado?</p>
                        <a href="/registro" className="register-link">Crear cuenta</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
