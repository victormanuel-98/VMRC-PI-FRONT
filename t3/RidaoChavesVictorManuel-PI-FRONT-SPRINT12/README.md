# FitFood - Tu Web de Recetas Saludables

---

## DescripciÃ³n del Proyecto

FitFood es una aplicaciÃ³n web fullstack para crear, gestionar y descubrir recetas saludables. Permite a los usuarios crear recetas con informaciÃ³n nutricional detallada, gestionar su perfil, y explorar recetas por categorÃ­as.

---

## Novedades UI (Sprint 10)

- Modo oscuro refinado con paleta azul suave y mejor contraste.
- TraducciÃ³n ampliada para modo inglÃ©s en cabecera, autenticaciÃ³n, ajustes, contacto, colecciones y exploraciÃ³n de platos.
- Ajustes generales renovados: selecciÃ³n por chips (sin radios con puntos).
- SecciÃ³n "Recetas creadas recientemente" adaptada para dark mode.
- Asistente personal actualizado con icono/logo visible en botÃ³n flotante y cabecera del panel.

---

## Recursos Visuales

---

#### Home

![Home](frontend/public/imagesReadme/home.png)

---

![Home cards](frontend/public/imagesReadme/homeCards.png)

---

#### Login

---

![Login](frontend/public/imagesReadme/login.png)

---

#### Crear receta

---

![Create recipe](frontend/public/imagesReadme/createRecipe.png)

---

### PrÃ³ximas implementaciones

- Cambio y mejora general del frontend (posible cambio de paleta de colores para modo claro y oscuro) asÃ­ como interfaz.
- AÃ±adir asistente de IA en mÃ¡s flujos de la aplicaciÃ³n (posiblemente).
- VerificaciÃ³n de sesiÃ³n por correo electrÃ³nico (mediante WebSockets).
- VerificaciÃ³n de sesiÃ³n por SMS si el usuario aÃ±ade nÃºmero de telÃ©fono (aÃºn no implementado a la hora de crear el usuario).

### Recorrido completo (GIF)

![Recorrido FitFood](frontend/public/imagesReadme/recorrdioFitFood.gif)

---

## CaracterÃ­sticas Implementadas

### IntegraciÃ³n Backend y Funcionalidades Avanzadas

#### Sistema de AutenticaciÃ³n
- Registro e inicio de sesiÃ³n con JWT
- Persistencia de sesiÃ³n en localStorage
- Rutas protegidas con middleware de autenticaciÃ³n
- Contexto global de autenticaciÃ³n (AuthContext)

#### GestiÃ³n de Recetas
- **Crear Recetas**: Formulario completo con bÃºsqueda inteligente de ingredientes
  - Autocompletado de ingredientes (70+ ingredientes en base de datos)
  - ValidaciÃ³n de ingredientes (requiere selecciÃ³n de ID)
  - CÃ¡lculo automÃ¡tico de calorÃ­as
  - Subida de imÃ¡genes a Cloudinary
  - CategorÃ­as: desayuno, almuerzo, cena, merienda
  
- **Ver Recetas**: Vista detallada con informaciÃ³n completa
  - Carga dinÃ¡mica desde API con parÃ¡metro ID
  - Tabla nutricional detallada
  - Sistema de valoraciones (estrellas 1-5)
  - Funcionalidad de favoritos
  - Ingredientes con cantidades en gramos

- **Mis Recetas**: Listado personal de recetas creadas
  - Carga automÃ¡tica de recetas del usuario
  - Vista en tarjetas con informaciÃ³n resumida
  - Botones de ver detalle y eliminar
  - Estados de carga, error y vacÃ­o

- **Recetas por CategorÃ­a**: ExploraciÃ³n de recetas filtradas
  - BreakfastRecipes: Filtrado automÃ¡tico por categorÃ­a "desayuno"
  - Estados de carga, error y vacÃ­o
  - Badges de calorÃ­as y dificultad
  - NavegaciÃ³n dinÃ¡mica a detalle

#### GestiÃ³n de Perfil de Usuario
- **Obtener Perfil**: Carga automÃ¡tica de datos del usuario
- **Actualizar Perfil**: EdiciÃ³n completa de informaciÃ³n personal
  - Campos: nombre, apellidos, usuario, email, telÃ©fono, notificaciones
  - Cambio de contraseÃ±a con verificaciÃ³n de contraseÃ±a actual
  - ValidaciÃ³n de contraseÃ±a fuerte (8+ caracteres, mayÃºsculas, nÃºmeros, sÃ­mbolos)
  - Subida de foto de perfil a Cloudinary
  - ValidaciÃ³n de unicidad de email
  - AutorizaciÃ³n: usuario solo puede editar su propio perfil (excepto admin)

#### Backend - API REST
- **Node.js + Express**: Servidor HTTP con rutas RESTful
- **MongoDB + Mongoose**: Base de datos NoSQL con modelos definidos
- **Cloudinary**: Almacenamiento de imÃ¡genes
- **JWT**: AutenticaciÃ³n basada en tokens
- **Bcrypt**: EncriptaciÃ³n de contraseÃ±as
- **CORS**: Configurado para desarrollo local

**Endpoints implementados:**

```
POST   /api/auth/registro          - Registro de usuario
POST   /api/auth/login             - Inicio de sesiÃ³n
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

POST   /api/valoraciones           - Crear valoraciÃ³n
GET    /api/valoraciones/:id       - Obtener valoraciones de receta

POST   /api/upload/receta          - Subir imagen de receta
POST   /api/upload/perfil          - Subir imagen de perfil
```
---

## Arquitectura de NavegaciÃ³n

### Layouts Implementados

#### **PublicLayout**
- **PropÃ³sito**: Layout minimalista para pÃ¡ginas de autenticaciÃ³n
- **CaracterÃ­sticas**: Sin Header, Navigation ni Footer
- **Rutas asociadas**: Login, Registro, 404, 403

#### **PrivateLayout**
- **PropÃ³sito**: Layout completo para usuarios autenticados
- **CaracterÃ­sticas**: Incluye Header, Navigation y Footer
- **Rutas asociadas**: Todas las rutas protegidas (Inicio, Perfil, Recetas, etc.)

### Sistema de AutenticaciÃ³n

**AuthContext** - Contexto global de autenticaciÃ³n
- GestiÃ³n de sesiÃ³n con `useState` y `useEffect`
- Persistencia en `localStorage`
- MÃ©todos: `login()`, `logout()`, `isAuthenticated`, `user`, `loading`

**ProtectedRoute** - Componente de protecciÃ³n de rutas
- Verifica autenticaciÃ³n antes de renderizar
- Muestra pantalla de carga mientras verifica sesiÃ³n
- Redirige a `/login` si no hay sesiÃ³n activa

---

## Backend

El backend estÃ¡ desarrollado en Node.js con Express, MongoDB Atlas y Cloudinary. Proporciona una API REST para gestiÃ³n de recetas, usuarios, favoritos, historial, ingredientes y ratings. Incluye autenticaciÃ³n JWT, Websockets, Swagger, SonarQube, ESLint y tests con Jest.

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
  API -->|JWT| Auth[AutenticaciÃ³n]
```

### InstalaciÃ³n y configuraciÃ³n

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

- DocumentaciÃ³n Swagger disponible en `/api-docs`.
- Endpoints principales:
  - `/api/auth` (registro, login)
  - `/api/recipes` (CRUD recetas)
  - `/api/ingredients` (CRUD ingredientes)
  - `/api/favorites` (gestiÃ³n favoritos)
  - `/api/history` (historial)
  - `/api/rating` (valoraciones)
  - `/api/contact` (contacto)
  - `/api/upload` (subida imÃ¡genes)
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
2. Usa la raÃ­z del backend como directorio de despliegue.
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
3. Para el proyecto completo, usa `docker-compose.yml` en la raÃ­z:
   ```bash
   docker-compose up --build
   ```

### Herramientas integradas

```
- ESLint (estilo y calidad)
- SonarQube (anÃ¡lisis estÃ¡tico)
- Swagger (documentaciÃ³n API)
- Jest & Supertest (testing)
- Socket.io (Websockets)
â”‚   â”‚   â”‚   â””â”€â”€ uploadController.js
â”‚   â”‚   â”œâ”€â”€ routes/
â”‚   â”‚   â”‚   â”œâ”€â”€ authRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ userRoutes.js              
â”‚   â”‚   â”‚   â”œâ”€â”€ recipeRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ ingredientRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ favoriteRoutes.js
â”‚   â”‚   â”‚   â”œâ”€â”€ ratingRoutes.js
â”‚   â”‚   â”‚   â””â”€â”€ uploadRoutes.js
â”‚   â”‚   â”œâ”€â”€ models/
â”‚   â”‚   â”‚   â”œâ”€â”€ User.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Recipe.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Ingredient.js
â”‚   â”‚   â”‚   â”œâ”€â”€ Favorite.js
â”‚   â”‚   â”‚   â””â”€â”€ Rating.js
â”‚   â”‚   â”œâ”€â”€ middleware/
â”‚   â”‚   â”‚   â””â”€â”€ auth.js
â”‚   â”‚   â”œâ”€â”€ config/
â”‚   â”‚   â”‚   â”œâ”€â”€ db.js
â”‚   â”‚   â”‚   â””â”€â”€ cloudinary.js
â”‚   â”‚   â”œâ”€â”€ utils/
â”‚   â”‚   â”‚   â””â”€â”€ seedIngredients.js
â”‚   â”‚   â”œâ”€â”€ app.js
â”‚   â”‚   â””â”€â”€ server.js
â”‚   â”œâ”€â”€ .env
â”‚   â”œâ”€â”€ .gitignore
â”‚   â””â”€â”€ package.json
â”‚
â”œâ”€â”€ frontend/ (carpeta aÃ±adida)
â”‚
â”œâ”€â”€ .gitignore
â””â”€â”€ README.md
```

### 1. **SeparaciÃ³n de Layouts**
**DecisiÃ³n**: Crear dos layouts diferenciados (Public/Private)

**JustificaciÃ³n**:
- Mejora la experiencia de usuario al no mostrar navegaciÃ³n innecesaria en login/registro
- Cumple con el patrÃ³n UX de separar flujos pÃºblicos y privados
- Facilita mantenimiento al centralizar cambios de UI por tipo de ruta
- Optimiza rendimiento al no cargar componentes innecesarios

### 2. **Context API para AutenticaciÃ³n**
**DecisiÃ³n**: Usar React Context en lugar de prop drilling

**JustificaciÃ³n**:
- Estado global accesible desde cualquier componente
- Evita pasar props por mÃºltiples niveles
- Facilita escalabilidad (preparado para agregar Redux si es necesario)
- Persistencia con localStorage para mantener sesiÃ³n

### 3. **ProtectedRoute como Componente Wrapper**
**DecisiÃ³n**: Componente reutilizable que envuelve rutas privadas

**JustificaciÃ³n**:
- DRY (Don't Repeat Yourself) - evita duplicar lÃ³gica de protecciÃ³n
- Centraliza lÃ³gica de redirecciÃ³n
- FÃ¡cil de mantener y testear
- Muestra estado de carga mientras verifica autenticaciÃ³n

### 4. **Estados de Pantalla (Loading/Empty/Error)**
**DecisiÃ³n**: Implementar estados explÃ­citos en componentes clave

**JustificaciÃ³n**:
- Mejora UX al informar al usuario del estado de la aplicaciÃ³n
- Cumple con requisitos del Sprint 8
- Prepara la app para integraciÃ³n con API real
- Reduce frustraciÃ³n del usuario con feedback visual

### 5. **Estructura de Carpetas**

```
src/
â”œâ”€â”€ components/        # Componentes reutilizables
â”‚   â”œâ”€â”€ Header.jsx
â”‚   â”œâ”€â”€ Navigation.jsx
â”‚   â”œâ”€â”€ Footer.jsx
â”‚   â””â”€â”€ ProtectedRoute.jsx
â”œâ”€â”€ context/          # Contextos de React
â”‚   â””â”€â”€ AuthContext.jsx
â”œâ”€â”€ layouts/          # Layouts de pÃ¡gina
â”‚   â”œâ”€â”€ PublicLayout.jsx
â”‚   â””â”€â”€ PrivateLayout.jsx
â”œâ”€â”€ pages/            # PÃ¡ginas/Vistas
â”‚   â”œâ”€â”€ Login.jsx
â”‚   â”œâ”€â”€ Register.jsx
â”‚   â”œâ”€â”€ Home.jsx
â”‚   â”œâ”€â”€ Profile.jsx
â”‚   â”œâ”€â”€ MyRecipes.jsx
â”‚   â”œâ”€â”€ RecipeDetail.jsx
â”‚   â”œâ”€â”€ CreateRecipe.jsx
â”‚   â”œâ”€â”€ Contact.jsx
â”‚   â”œâ”€â”€ Settings.jsx
â”‚   â”œâ”€â”€ BreakfastRecipes.jsx
â”‚   â”œâ”€â”€ NotFound.jsx
â”‚   â””â”€â”€ Forbidden.jsx
â””â”€â”€ App.jsx           # Router principal
```

---

## Decisiones TÃ©cnicas
### 6. **BÃºsqueda Inteligente de Ingredientes**
**DecisiÃ³n**: Implementar autocompletado con bÃºsqueda en tiempo real

**JustificaciÃ³n**:
- UX mejorada: usuario no necesita recordar nombres exactos
- PrevenciÃ³n de errores: solo se pueden seleccionar ingredientes vÃ¡lidos
- IntegraciÃ³n con DB: 70+ ingredientes precargados con datos nutricionales
- ValidaciÃ³n en frontend: verifica que se haya seleccionado un ID vÃ¡lido

### 7. **Rutas DinÃ¡micas con ParÃ¡metros**
**DecisiÃ³n**: Usar `/receta/:id` en lugar de `/receta` estÃ¡tico

**JustificaciÃ³n**:
- Permite compartir enlaces directos a recetas especÃ­ficas
- Facilita navegaciÃ³n desde listados
- Preparado para SEO en producciÃ³n
- useParams() hook de React Router simplifica la extracciÃ³n del ID

### 8. **GestiÃ³n de ImÃ¡genes con Cloudinary**
**DecisiÃ³n**: Usar servicio externo en lugar de almacenamiento local

**JustificaciÃ³n**:
- Escalabilidad: no satura el servidor con archivos
- CDN global: tiempos de carga optimizados
- Transformaciones automÃ¡ticas: resize, optimizaciÃ³n, formatos modernos
- Backup automÃ¡tico y alta disponibilidad

### 9. **Validaciones en MÃºltiples Capas**
**DecisiÃ³n**: Validar tanto en frontend como en backend

**JustificaciÃ³n**:
- Frontend: feedback inmediato al usuario (UX)
- Backend: seguridad y consistencia de datos
- Doble validaciÃ³n de contraseÃ±as: actual + nueva
- ValidaciÃ³n de unicidad de email en base de datos

---

## Instrucciones de EjecuciÃ³n

### Prerrequisitos
- Node.js v18 o superior
- MongoDB Atlas (cuenta gratuita)
- Cloudinary (cuenta gratuita)

### ConfiguraciÃ³n del Backend

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
El servidor estarÃ¡ en [http://localhost:5000](http://localhost:5000)

### ConfiguraciÃ³n del Frontend

1. **Instalar dependencias**:

```
cd frontend
npm install
```

2. **Configurar variable de entorno** (opcional, por defecto usa `http://localhost:5000/api`):

Crear archivo `.env` en `/frontend`:

```
VITE_API_URL=http://localhost:5000/api
```

3. **Iniciar frontend**:

```
npm run dev
```

La aplicaciÃ³n estarÃ¡ disponible en [http://localhost:5173](http://localhost:5173)

### Build para ProducciÃ³n

```
cd backend
npm start
```

## Tests

```
cd backend
npm test -- --coverage
```

### Sprint 12 - Pruebas AutomÃ¡ticas (Unitarias + Sistema E2E)

#### Pruebas realizadas y verificaciÃ³n

Fecha de verificaciÃ³n: **21 de abril de 2026**

- **Backend (Jest + Supertest)**: `28/28` suites en verde y `88/88` tests en verde.
- **Frontend E2E (Playwright)**: `4/4` pruebas en verde.
- **VerificaciÃ³n aplicada**: ejecuciÃ³n completa sin errores y generaciÃ³n de reportes en `junit`, `json` y `html`.

#### Tipos de prueba (explicado de forma simple)

- **Prueba unitaria**: revisa una parte pequeÃ±a del cÃ³digo de forma aislada.
- **Prueba de integraciÃ³n**: revisa que varias partes trabajen bien juntas (API + lÃ³gica + datos).
- **Prueba de sistema E2E**: simula el uso real de una persona en la aplicaciÃ³n, de principio a fin.

#### Pruebas E2E implementadas en Sprint 12

1. **Ruta protegida sin sesiÃ³n**  
Verifica que, sin token, al entrar a una ruta privada se redirige a `/login`.
2. **Registro + login + acceso a inicio**  
Verifica el flujo completo de crear cuenta, iniciar sesiÃ³n y entrar a la home.
3. **Ajustes de idioma y tema**  
Verifica que se puedan guardar cambios y que queden persistidos en `localStorage`.
4. **Formulario de contacto**  
Verifica que un usuario autenticado pueda enviar un mensaje y ver confirmaciÃ³n de envÃ­o.


1. Backend (unitarias/integraciÃ³n + reportes):
```
cd backend
npm run test:ci
```
Artefactos generados:
- `backend/reports/backend/junit.xml`
- `backend/reports/backend/results.json`
- `backend/coverage/lcov-report/index.html`

2. Frontend E2E (sistema) con Playwright:
```
cd frontend
npm run test:e2e:install
npm run test:e2e
```
Artefactos generados:
- `frontend/reports/e2e/html/index.html`
- `frontend/reports/e2e/junit.xml`
- `frontend/reports/e2e/results.json`

3. EjecuciÃ³n completa Sprint 12 (PowerShell, raÃ­z del repo):
```
.\run-sprint12-tests.ps1
```

---

## Credenciales de Prueba

**OpciÃ³n 1 - Crear cuenta nueva**:
- Ir a `/registro` y completar el formulario

**OpciÃ³n 2 - Usar cuenta de prueba** (si existe en tu DB):
- Usuario: `victor_98`
- ContraseÃ±a: `Admin123!`

---

## Modelos de Datos

### User (Usuario)

```
{
  usuario: String (Ãºnico, requerido),
  email: String (Ãºnico, requerido),
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
  nombre: String (Ãºnico, requerido),
  categoria: String,
  calorias: Number (por 100g),
  proteinas: Number,
  carbohidratos: Number,
  grasas: Number
}
```

---

## PrÃ³ximos Pasos (Pendientes)

- [ ] Implementar categorÃ­as adicionales (Almuerzo, Cena, Merienda)
- [ ] Sistema de historial de consumo diario
- [ ] Dashboard con estadÃ­sticas nutricionales
- [ ] BÃºsqueda avanzada de recetas por ingredientes
- [ ] Sistema de comentarios en recetas
- [ ] Compartir recetas en redes sociales
- [ ] Modo oscuro
- [ ] Notificaciones push
- [ ] PWA (Progressive Web App)
- [ ] InternacionalizaciÃ³n (i18n)
