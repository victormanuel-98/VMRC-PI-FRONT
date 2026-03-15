# FitFood - Aplicación de Recetas Saludables

## Descripción del Proyecto

FitFood es una aplicación web fullstack para crear, gestionar y descubrir recetas saludables. Permite a los usuarios crear recetas con información nutricional detallada, gestionar su perfil, y explorar recetas por categorías.

---

## Características Implementadas

### Integración Backend y Funcionalidades Avanzadas

#### Sistema de Autenticación
- Registro e inicio de sesión con JWT
- Persistencia de sesión en localStorage
- Rutas protegidas con middleware de autenticación
- Contexto global de autenticación (AuthContext)

#### Gestión de Recetas
- **Crear Recetas**: Formulario completo con búsqueda inteligente de ingredientes
  - Autocompletado de ingredientes (70+ ingredientes en base de datos)
  - Validación de ingredientes (requiere selección de ID)
  - Cálculo automático de calorías
  - Subida de imágenes a Cloudinary
  - Categorías: desayuno, almuerzo, cena, merienda
  
- **Ver Recetas**: Vista detallada con información completa
  - Carga dinámica desde API con parámetro ID
  - Tabla nutricional detallada
  - Sistema de valoraciones (estrellas 1-5)
  - Funcionalidad de favoritos
  - Ingredientes con cantidades en gramos

- **Mis Recetas**: Listado personal de recetas creadas
  - Carga automática de recetas del usuario
  - Vista en tarjetas con información resumida
  - Botones de ver detalle y eliminar
  - Estados de carga, error y vacío

- **Recetas por Categoría**: Exploración de recetas filtradas
  - BreakfastRecipes: Filtrado automático por categoría "desayuno"
  - Estados de carga, error y vacío
  - Badges de calorías y dificultad
  - Navegación dinámica a detalle

#### Gestión de Perfil de Usuario
- **Obtener Perfil**: Carga automática de datos del usuario
- **Actualizar Perfil**: Edición completa de información personal
  - Campos: nombre, apellidos, usuario, email, teléfono, notificaciones
  - Cambio de contraseña con verificación de contraseña actual
  - Validación de contraseña fuerte (8+ caracteres, mayúsculas, números, símbolos)
  - Subida de foto de perfil a Cloudinary
  - Validación de unicidad de email
  - Autorización: usuario solo puede editar su propio perfil (excepto admin)

#### Backend - API REST
- **Node.js + Express**: Servidor HTTP con rutas RESTful
- **MongoDB + Mongoose**: Base de datos NoSQL con modelos definidos
- **Cloudinary**: Almacenamiento de imágenes
- **JWT**: Autenticación basada en tokens
- **Bcrypt**: Encriptación de contraseñas
- **CORS**: Configurado para desarrollo local

**Endpoints implementados:**

```
POST   /api/auth/registro          - Registro de usuario
POST   /api/auth/login             - Inicio de sesión
GET    /api/auth/verificar         - Verificar token

GET    /api/usuarios/:id           - Obtener perfil
PUT    /api/usuarios/:id           - Actualizar perfil

GET    /api/recetas                - Listar recetas (filtros: categoria, dificultad)
GET    /api/recetas/:id            - Obtener receta por ID
POST   /api/recetas                - Crear receta
PUT    /api/recetas/:id            - Actualizar receta
DELETE /api/recetas/:id            - Eliminar receta

GET    /api/ingredientes           - Buscar ingredientes

POST   /api/favoritos              - Agregar favorito
GET    /api/favoritos              - Listar favoritos
DELETE /api/favoritos/:id          - Eliminar favorito

POST   /api/valoraciones           - Crear valoración
GET    /api/valoraciones/:id       - Obtener valoraciones de receta

POST   /api/upload/receta          - Subir imagen de receta
POST   /api/upload/perfil          - Subir imagen de perfil
```
---

## Arquitectura de Navegación

### Layouts Implementados

#### **PublicLayout**
- **Propósito**: Layout minimalista para páginas de autenticación
- **Características**: Sin Header, Navigation ni Footer
- **Rutas asociadas**: Login, Registro, 404, 403

#### **PrivateLayout**
- **Propósito**: Layout completo para usuarios autenticados
- **Características**: Incluye Header, Navigation y Footer
- **Rutas asociadas**: Todas las rutas protegidas (Inicio, Perfil, Recetas, etc.)

### Sistema de Autenticación

**AuthContext** - Contexto global de autenticación
- Gestión de sesión con `useState` y `useEffect`
- Persistencia en `localStorage`
- Métodos: `login()`, `logout()`, `isAuthenticated`, `user`, `loading`

**ProtectedRoute** - Componente de protección de rutas
- Verifica autenticación antes de renderizar
- Muestra pantalla de carga mientras verifica sesión
- Redirige a `/login` si no hay sesión activa

---

## Backend

El backend está desarrollado en Node.js con Express, MongoDB Atlas y Cloudinary. Proporciona una API REST para gestión de recetas, usuarios, favoritos, historial, ingredientes y ratings. Incluye autenticación JWT, Websockets, Swagger, SonarQube, ESLint y tests con Jest.

### Estructura

```
backend/
  src/
    app.js
    server.js
    config/
      db.js
    controllers/
      ...
    middlewares/
      ...
    models/
      ...
    routes/
      ...
    seed/
      ...
    utils/
      ...
    tests/
      ...
```

### Diagrama de arquitectura

```
flowchart TD
  Client[Cliente (Frontend)] -->|HTTP| API[Express API]
  API -->|Swagger| Docs[Swagger UI]
  API -->|Websockets| Socket[Socket.io]
  API -->|MongoDB| DB[(MongoDB Atlas)]
  API -->|Cloudinary| Cloud[Cloudinary]
  API -->|JWT| Auth[Autenticación]
```

### Instalación y configuración

1. Instala dependencias:
   ```
   cd backend
   npm install
   ```
2. Crea un archivo `.env` con las variables necesarias:
   ```
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_jwt
   CLOUDINARY_CLOUD_NAME=tu_cloud_name
   CLOUDINARY_API_KEY=tu_api_key
   CLOUDINARY_API_SECRET=tu_api_secret
   ```
3. Ejecuta el servidor:
   ```
   npm start
   ```

### Uso y endpoints

- Documentación Swagger disponible en `/api-docs`.
- Endpoints principales:
  - `/api/auth` (registro, login)
  - `/api/recipes` (CRUD recetas)
  - `/api/ingredients` (CRUD ingredientes)
  - `/api/favorites` (gestión favoritos)
  - `/api/history` (historial)
  - `/api/rating` (valoraciones)
  - `/api/contact` (contacto)
  - `/api/upload` (subida imágenes)
  - `/api/ai` (asistente IA)

### Testing y cobertura

- Ejecuta tests:
  ```
  npm test
  ```
- Cobertura >90% con Jest y Supertest.

### Despliegue

#### Render

1. Configura variables de entorno en Render.
2. Usa la raíz del backend como directorio de despliegue.
3. MongoDB debe ser accesible desde Render.

#### Docker

1. Construye la imagen:
   ```bash
   docker build -t fitfood-backend .
   ```
2. Ejecuta el contenedor:
   ```bash
   docker run -p 3000:3000 --env-file .env fitfood-backend
   ```
3. Para el proyecto completo, usa `docker-compose.yml` en la raíz:
   ```bash
   docker-compose up --build
   ```

### Herramientas integradas

```
- ESLint (estilo y calidad)
- SonarQube (análisis estático)
- Swagger (documentación API)
- Jest & Supertest (testing)
- Socket.io (Websockets)
│   │   │   └── uploadController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js              
│   │   │   ├── recipeRoutes.js
│   │   │   ├── ingredientRoutes.js
│   │   │   ├── favoriteRoutes.js
│   │   │   ├── ratingRoutes.js
│   │   │   └── uploadRoutes.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Recipe.js
│   │   │   ├── Ingredient.js
│   │   │   ├── Favorite.js
│   │   │   └── Rating.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── cloudinary.js
│   │   ├── utils/
│   │   │   └── seedIngredients.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── frontend/ (carpeta añadida)
│
├── .gitignore
└── README.md
```

### 1. **Separación de Layouts**
**Decisión**: Crear dos layouts diferenciados (Public/Private)

**Justificación**:
- Mejora la experiencia de usuario al no mostrar navegación innecesaria en login/registro
- Cumple con el patrón UX de separar flujos públicos y privados
- Facilita mantenimiento al centralizar cambios de UI por tipo de ruta
- Optimiza rendimiento al no cargar componentes innecesarios

### 2. **Context API para Autenticación**
**Decisión**: Usar React Context en lugar de prop drilling

**Justificación**:
- Estado global accesible desde cualquier componente
- Evita pasar props por múltiples niveles
- Facilita escalabilidad (preparado para agregar Redux si es necesario)
- Persistencia con localStorage para mantener sesión

### 3. **ProtectedRoute como Componente Wrapper**
**Decisión**: Componente reutilizable que envuelve rutas privadas

**Justificación**:
- DRY (Don't Repeat Yourself) - evita duplicar lógica de protección
- Centraliza lógica de redirección
- Fácil de mantener y testear
- Muestra estado de carga mientras verifica autenticación

### 4. **Estados de Pantalla (Loading/Empty/Error)**
**Decisión**: Implementar estados explícitos en componentes clave

**Justificación**:
- Mejora UX al informar al usuario del estado de la aplicación
- Cumple con requisitos del Sprint 8
- Prepara la app para integración con API real
- Reduce frustración del usuario con feedback visual

### 5. **Estructura de Carpetas**
```
src/
├── components/        # Componentes reutilizables
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── Footer.jsx
│   └── ProtectedRoute.jsx
├── context/          # Contextos de React
│   └── AuthContext.jsx
├── layouts/          # Layouts de página
│   ├── PublicLayout.jsx
│   └── PrivateLayout.jsx
├── pages/            # Páginas/Vistas
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Home.jsx
│   ├── Profile.jsx
│   ├── MyRecipes.jsx
│   ├── RecipeDetail.jsx
│   ├── CreateRecipe.jsx
│   ├── Contact.jsx
│   ├── Settings.jsx
│   ├── BreakfastRecipes.jsx
│   ├── NotFound.jsx
│   └── Forbidden.jsx
└── App.jsx           # Router principal
```

---

## Decisiones Técnicas
### 6. **Búsqueda Inteligente de Ingredientes**
**Decisión**: Implementar autocompletado con búsqueda en tiempo real

**Justificación**:
- UX mejorada: usuario no necesita recordar nombres exactos
- Prevención de errores: solo se pueden seleccionar ingredientes válidos
- Integración con DB: 70+ ingredientes precargados con datos nutricionales
- Validación en frontend: verifica que se haya seleccionado un ID válido

### 7. **Rutas Dinámicas con Parámetros**
**Decisión**: Usar `/receta/:id` en lugar de `/receta` estático

**Justificación**:
- Permite compartir enlaces directos a recetas específicas
- Facilita navegación desde listados
- Preparado para SEO en producción
- useParams() hook de React Router simplifica la extracción del ID

### 8. **Gestión de Imágenes con Cloudinary**
**Decisión**: Usar servicio externo en lugar de almacenamiento local

**Justificación**:
- Escalabilidad: no satura el servidor con archivos
- CDN global: tiempos de carga optimizados
- Transformaciones automáticas: resize, optimización, formatos modernos
- Backup automático y alta disponibilidad

### 9. **Validaciones en Múltiples Capas**
**Decisión**: Validar tanto en frontend como en backend

**Justificación**:
- Frontend: feedback inmediato al usuario (UX)
- Backend: seguridad y consistencia de datos
- Doble validación de contraseñas: actual + nueva
- Validación de unicidad de email en base de datos

---

## Instrucciones de Ejecución

### Prerrequisitos
- Node.js v18 o superior
- MongoDB Atlas (cuenta gratuita)
- Cloudinary (cuenta gratuita)

### Configuración del Backend

1. **Instalar dependencias**:

```
cd backend
npm install
```

2. **Configurar variables de entorno**:

Crear archivo `.env` en `/backend`:

```
PORT=5000
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/fitfood
JWT_SECRET=tu-clave-secreta-super-segura
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=tu-api-key
CLOUDINARY_API_SECRET=tu-api-secret
CORS_ORIGIN=http://localhost:5173
LMSTUDIO_BASE_URL=http://localhost:1234/v1
LMSTUDIO_MODEL=qwen3
LMSTUDIO_TIMEOUT_MS=20000
```

3. **Iniciar servidor**:

```
npm run dev
```
El servidor estará en [http://localhost:5000](http://localhost:5000)

### Build para Producción

```
cd backend
npm start
```

## Tests

```
cd backend
npm test -- --coverage
```

---

## Credenciales de Prueba

**Opción 1 - Crear cuenta nueva**:
- Ir a `/registro` y completar el formulario

**Opción 2 - Usar cuenta de prueba** (si existe en tu DB):
- Usuario: `victor_98`
- Contraseña: `Admin123!`

---

## Modelos de Datos

### User (Usuario)

```
{
  usuario: String (único, requerido),
  email: String (único, requerido),
  contrasena: String (hasheada, requerida),
  nombre: String,
  apellidos: String,
  telefono: String,
  foto: String (URL Cloudinary),
  rol: String (default: 'usuario'),
  notificaciones: Boolean (default: true),
  visibilidad: String (default: 'publica')
}
```

### Recipe (Receta)

```
{
  nombre: String (requerido),
  descripcionCorta: String (requerido),
  descripcionLarga: String,
  imagen: String (URL Cloudinary, requerida),
  categoria: String (requerido),
  dificultad: String (requerido),
  tiempoPreparacion: Number (minutos),
  ingredientes: [{
    ingrediente: ObjectId (ref: Ingredient),
    cantidad: Number (gramos)
  }],
  calorias: Number (calculadas),
  proteinas: Number,
  carbohidratos: Number,
  grasas: Number,
  usuario: ObjectId (ref: User),
  valoracionPromedio: Number (default: 0)
}
```

### Ingredient (Ingrediente)

```
{
  nombre: String (único, requerido),
  categoria: String,
  calorias: Number (por 100g),
  proteinas: Number,
  carbohidratos: Number,
  grasas: Number
}
```

---

## Próximos Pasos (Pendientes)

- [ ] Implementar categorías adicionales (Almuerzo, Cena, Merienda)
- [ ] Sistema de historial de consumo diario
- [ ] Dashboard con estadísticas nutricionales
- [ ] Búsqueda avanzada de recetas por ingredientes
- [ ] Sistema de comentarios en recetas
- [ ] Compartir recetas en redes sociales
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)

---

## Capturas de Pantalla

### Login
![Login](./frontend/public/images/login.png)

### Home
![Home](./frontend/public/images/home.png)

### Perfil de Usuario
![Profile](./frontend/public/images/profile.png)

---

## Notas de Desarrollo

### Sprint 9 - Cambios Principales

1. **CreateRecipe.jsx**: Reescrito completamente con búsqueda de ingredientes
2. **RecipeDetail.jsx**: Integración completa con API usando `useParams()`
3. **Profile.jsx**: Sistema completo de edición de perfil con cambio de contraseña
4. **BreakfastRecipes.jsx**: Migrado de datos estáticos a API con filtros
5. **App.jsx**: Ruta actualizada de `/receta` a `/receta/:id`
6. **api.js**: Agregadas funciones `obtenerPerfilUsuario` y `actualizarPerfilUsuario`
7. **userController.js**: Nuevos endpoints `obtenerPerfil` y `actualizarPerfil`
8. **userRoutes.js**: Nuevo archivo de rutas para usuarios
9. **styles.css**: Agregados estilos para mensajes de error/éxito y badges nutricionales

### Mejoras de UX Implementadas
- Loading states en todas las páginas con datos dinámicos
- Error states con botón de reintentar
- Empty states con call-to-action
- Mensajes de feedback para operaciones CRUD
- Validaciones en tiempo real
- Imágenes con fallback SVG
