const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiRequest = async (path, options = {}) => {
    const res = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.mensaje || 'Error en la petición al servidor');
    }

    return data;
};

const authHeaders = (token, includeJson = false) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (includeJson) headers['Content-Type'] = 'application/json';
    return headers;
};

export const login = async (usuario, contrasena) => {
    return apiRequest('/auth/login', {
        method: 'POST',
        headers: authHeaders(null, true),
        body: JSON.stringify({ usuario, contrasena }),
    });
};

export const registro = async (datos) => {
    return apiRequest('/auth/registro', {
        method: 'POST',
        headers: authHeaders(null, true),
        body: JSON.stringify(datos),
    });
};

export const verificarToken = async (token) => {
    return apiRequest('/auth/verificar', {
        headers: authHeaders(token),
    });
};

export const obtenerPerfilUsuario = async (id, token) => {
    return apiRequest(`/usuarios/${id}`, {
        headers: authHeaders(token),
    });
};

export const actualizarPerfilUsuario = async (id, datos, token) => {
    return apiRequest(`/usuarios/${id}`, {
        method: 'PUT',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const subirImagenReceta = async (base64, token) => {
    return apiRequest('/upload/receta', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ imagen: base64 }),
    });
};

export const subirImagenPerfil = async (base64, token) => {
    return apiRequest('/upload/perfil', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ imagen: base64 }),
    });
};

export const crearReceta = async (datos, token) => {
    return apiRequest('/recetas', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const obtenerRecetas = async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const query = params.toString() ? `?${params}` : '';
    return apiRequest(`/recetas${query}`);
};

export const obtenerReceta = async (id) => {
    const data = await apiRequest(`/recetas/${id}`);
    return data?.receta ? data : { receta: data };
};

export const obtenerRecetasUsuario = async (usuarioId) => {
    const data = await apiRequest(`/recetas/usuario/${usuarioId}`);
    return Array.isArray(data) ? { recetas: data } : data;
};

export const actualizarReceta = async (id, datos, token) => {
    return apiRequest(`/recetas/${id}`, {
        method: 'PUT',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const eliminarReceta = async (id, token) => {
    return apiRequest(`/recetas/${id}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
};

export const obtenerIngredientes = async (busqueda = '') => {
    const params = new URLSearchParams({ q: busqueda });
    return apiRequest(`/ingredientes?${params}`);
};

export const agregarFavorito = async (recetaId, token) => {
    return apiRequest('/favoritos', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ recetaId }),
    });
};

export const obtenerFavoritos = async (token) => {
    return apiRequest('/favoritos', { headers: authHeaders(token) });
};

export const eliminarFavorito = async (recetaId, token) => {
    return apiRequest(`/favoritos/${recetaId}`, {
        method: 'DELETE',
        headers: authHeaders(token),
    });
};

export const crearValoracion = async (datos, token) => {
    return apiRequest('/valoraciones', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const obtenerValoraciones = async (recetaId) => {
    return apiRequest(`/valoraciones/${recetaId}`);
};

export const crearHistorial = async (datos, token) => {
    return apiRequest('/historial', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const obtenerHistorial = async (fecha, token) => {
    return apiRequest(`/historial?fecha=${fecha}`, {
        headers: authHeaders(token),
    });
};

export const enviarMensaje = async (datos, token) => {
    return apiRequest('/mensajes', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify(datos),
    });
};

export const obtenerMensajes = async (token, tipo = 'recibidos') => {
    return apiRequest(`/mensajes?tipo=${tipo}`, {
        headers: authHeaders(token),
    });
};

export const enviarConsultaIA = async (mensajes, token) => {
    return apiRequest('/ai/chat', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ mensajes }),
    });
};
