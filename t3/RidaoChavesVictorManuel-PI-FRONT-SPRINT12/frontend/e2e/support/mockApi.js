const defaultUser = {
  id: 'user-qa-1',
  usuario: 'qa_user1',
  nombre: 'QA',
  rol: 'usuario',
  email: 'qa1@fitfood.test',
  visibilidad: 'publica'
};

const defaultRecipes = [
  {
    _id: 'receta-1',
    nombre: 'Bowl de avena',
    descripcionCorta: 'Desayuno completo',
    categoria: 'desayuno',
    dificultad: 'facil',
    calorias: 360,
    createdAt: '2026-04-20T10:00:00.000Z',
    imagen: '/platos/receta-gachas.png'
  },
  {
    _id: 'receta-2',
    nombre: 'Wrap de pollo',
    descripcionCorta: 'Almuerzo alto en proteina',
    categoria: 'almuerzo',
    dificultad: 'medio',
    calorias: 520,
    createdAt: '2026-04-19T12:00:00.000Z',
    imagen: '/platos/receta-tacos.png'
  }
];

const jsonResponse = (route, status, body) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  });

export const mockFitFoodApi = async (
  page,
  {
    token = 'fake-jwt-token',
    user = defaultUser,
    recipes = defaultRecipes
  } = {}
) => {
  let profile = { ...user };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const path = url.pathname.replace(/^\/api/, '');
    const method = request.method();
    const authHeader = await request.headerValue('authorization');
    const isAuthOk = authHeader === `Bearer ${token}`;

    if (path === '/auth/login' && method === 'POST') {
      const body = request.postDataJSON();
      if (!body?.usuario || !body?.contrasena) {
        return jsonResponse(route, 400, { mensaje: 'Credenciales incompletas' });
      }
      return jsonResponse(route, 200, { token, usuario: profile });
    }

    if (path === '/auth/registro' && method === 'POST') {
      const body = request.postDataJSON();
      if (!body?.email || !body?.usuario || !body?.contrasena) {
        return jsonResponse(route, 400, { mensaje: 'Datos de registro incompletos' });
      }
      profile = {
        ...profile,
        usuario: body.usuario,
        nombre: body.nombre || profile.nombre,
        email: body.email
      };
      return jsonResponse(route, 201, { token, usuario: profile });
    }

    if (path === '/auth/verificar' && method === 'GET') {
      if (!isAuthOk) {
        return jsonResponse(route, 401, { mensaje: 'Token invalido' });
      }
      return jsonResponse(route, 200, { usuario: profile });
    }

    if (path === '/recetas' && method === 'GET') {
      return jsonResponse(route, 200, { recetas: recipes });
    }

    if (path.startsWith('/recetas/usuario/') && method === 'GET') {
      if (!isAuthOk) {
        return jsonResponse(route, 401, { mensaje: 'No autorizado' });
      }
      return jsonResponse(route, 200, { recetas: recipes });
    }

    if (path.startsWith('/usuarios/') && method === 'GET') {
      if (!isAuthOk) {
        return jsonResponse(route, 401, { mensaje: 'No autorizado' });
      }
      return jsonResponse(route, 200, { usuario: profile });
    }

    if (path.startsWith('/usuarios/') && method === 'PUT') {
      if (!isAuthOk) {
        return jsonResponse(route, 401, { mensaje: 'No autorizado' });
      }
      const body = request.postDataJSON();
      profile = {
        ...profile,
        visibilidad: body?.visibilidad || profile.visibilidad
      };
      return jsonResponse(route, 200, { usuario: profile });
    }

    if (path === '/mensajes' && method === 'POST') {
      if (!isAuthOk) {
        return jsonResponse(route, 401, { mensaje: 'No autorizado' });
      }
      return jsonResponse(route, 201, { id: 'mensaje-1' });
    }

    return jsonResponse(route, 404, { mensaje: `Ruta mock no implementada: ${method} ${path}` });
  });
};

export const setAuthenticatedSession = async (page, token = 'fake-jwt-token') => {
  await page.addInitScript((value) => {
    window.localStorage.setItem('token', value);
  }, token);
};
