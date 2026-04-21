import React, { createContext, useState, useContext, useEffect } from 'react';
import { verificarToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restaurarSesion = async () => {
            const token = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const respuesta = await verificarToken(token);
                const usuario = respuesta?.usuario;

                if (usuario) {
                    const normalizado = {
                        id: usuario.id,
                        usuario: usuario.usuario,
                        nombre: usuario.nombre,
                        rol: usuario.rol,
                        email: usuario.email,
                    };

                    setIsAuthenticated(true);
                    setUser(normalizado);
                    localStorage.setItem('isAuthenticated', 'true');
                    localStorage.setItem('user', JSON.stringify(normalizado));
                }
            } catch {
                if (savedUser) {
                    localStorage.removeItem('user');
                }
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        restaurarSesion();
    }, []);

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
