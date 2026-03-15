const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const login = async (usuario, contrasena) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
    });
    return res.json();
};

export const registro = async (datos) => {
    const res = await fetch(`${API_BASE_URL}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const verificarToken = async (token) => {
    const res = await fetch(`${API_BASE_URL}/auth/verificar`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const obtenerPerfilUsuario = async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const actualizarPerfilUsuario = async (id, datos, token) => {
    const res = await fetch(`${API_BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const subirImagenReceta = async (base64, token) => {
    const res = await fetch(`${API_BASE_URL}/upload/receta`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagen: base64 }),
    });
    return res.json();
};

export const subirImagenPerfil = async (base64, token) => {
    const res = await fetch(`${API_BASE_URL}/upload/perfil`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagen: base64 }),
    });
    return res.json();
};

export const crearReceta = async (datos, token) => {
    const res = await fetch(`${API_BASE_URL}/recetas`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const obtenerRecetas = async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const res = await fetch(`${API_BASE_URL}/recetas?${params}`);
    return res.json();
};

export const obtenerReceta = async (id) => {
    const res = await fetch(`${API_BASE_URL}/recetas/${id}`);
    return res.json();
};

export const actualizarReceta = async (id, datos, token) => {
    const res = await fetch(`${API_BASE_URL}/recetas/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const eliminarReceta = async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/recetas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const obtenerIngredientes = async (busqueda = '') => {
    const params = new URLSearchParams({ q: busqueda });
    const res = await fetch(`${API_BASE_URL}/ingredientes?${params}`);
    return res.json();
};

export const agregarFavorito = async (recetaId, token) => {
    const res = await fetch(`${API_BASE_URL}/favoritos`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recetaId }),
    });
    return res.json();
};

export const obtenerFavoritos = async (token) => {
    const res = await fetch(`${API_BASE_URL}/favoritos`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const eliminarFavorito = async (recetaId, token) => {
    const res = await fetch(`${API_BASE_URL}/favoritos/${recetaId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const crearValoracion = async (datos, token) => {
    const res = await fetch(`${API_BASE_URL}/valoraciones`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const obtenerValoraciones = async (recetaId) => {
    const res = await fetch(`${API_BASE_URL}/valoraciones/${recetaId}`);
    return res.json();
};

export const crearHistorial = async (datos, token) => {
    const res = await fetch(`${API_BASE_URL}/historial`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const obtenerHistorial = async (fecha, token) => {
    const res = await fetch(`${API_BASE_URL}/historial?fecha=${fecha}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const enviarMensaje = async (datos, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/mensajes`, {
        method: 'POST',
        headers,
        body: JSON.stringify(datos),
    });
    return res.json();
};

export const obtenerMensajes = async (token, tipo = 'recibidos') => {
    const res = await fetch(`${API_BASE_URL}/mensajes?tipo=${tipo}`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    return res.json();
};

export const enviarConsultaIA = async (mensajes, token) => {
    const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mensajes }),
    });
    return res.json();
};
