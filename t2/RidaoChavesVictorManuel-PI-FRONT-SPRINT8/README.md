# FitFood - Documentación Sprint 8

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

## Mapa de Rutas

### Rutas Públicas

| Ruta | Componente | Descripción | Layout | Protegida |
|------|-----------|-------------|---------|-----------|
| `/` | Navigate | Redirección a /login | - | ❌ |
| `/login` | Login | Página de inicio de sesión | Public | ❌ |
| `/registro` | Register | Formulario de registro de usuario | Public | ❌ |
| `/forbidden` | Forbidden | Página 403 - Sin permisos | Public | ❌ |
| `*` | NotFound | Página 404 - No encontrada | Public | ❌ |

### Rutas Privadas (Protegidas)

| Ruta | Componente | Descripción | Layout | Protegida |
|------|-----------|-------------|---------|-----------|
| `/inicio` | Home | Página principal con hero y carrusel | Private | ✅ |
| `/perfil` | Profile | Perfil de usuario (edición) | Private | ✅ |
| `/recetas` | MyRecipes | Listado de recetas personales | Private | ✅ |
| `/receta` | RecipeDetail | Vista detallada de una receta | Private | ✅ |
| `/recetas/crear` | CreateRecipe | Formulario de creación de receta | Private | ✅ |
| `/contacto` | Contact | Formulario de contacto | Private | ✅ |
| `/ajustes` | Settings | Configuración de la aplicación | Private | ✅ |
| `/platos/desayuno` | BreakfastRecipes | Recetas de desayuno | Private | ✅ |
| `/platos/almuerzo` | NotFound | (Por implementar) | Private | ✅ |
| `/platos/cena` | NotFound | (Por implementar) | Private | ✅ |
| `/platos/otros` | NotFound | (Por implementar) | Private | ✅ |

---

## Decisiones Técnicas

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

### 6. **React Router v6**
**Decisión**: Usar React Router v6 con estructura declarativa

**Justificación**:
- Versión más reciente con mejor rendimiento
- API más simple y declarativa
- Soporte nativo para layouts anidados
- useNavigate hook más intuitivo que history.push

---

## Comparativas Figma vs Implementación Final

### Página de Login
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Login](t2/RidaoChavesVictorManuel-PI-FRONT-SPRINT8/public/images/FigmaLogin.png) | ![Imagen Final Login](./public/images/login.png) |

**Diferencias clave**:
- ✅ Mantiene estructura de dos secciones (welcome + formulario)
- ✅ Colores fieles al diseño (#5a8090, #d4a88a)
- ✅ Tipografía Italianno para títulos

---

### Página de Inicio (Home)
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Home](/public/images/FigmaHome.png) | ![Imagen Final Home](/public/images/home.png) |

**Diferencias clave**:
- ✅ Hero section con título e imagen
- ✅ Carrusel de 7 recetas destacadas
- ✅ Botones de navegación laterales (pill-shaped)

---

### Perfil de usuario
| Figma (Diseño) | Implementación Final |
|----------------|---------------------|
| ![Imagen Figma Recetas](/public/images/FigmaUserProfile.png) | ![Imagen Final Recetas](/public/images/profile.png) |

**Diferencias clave**:
- ✅ Grid 4x5 (15 recetas)
- ✅ Tarjetas con imagen, nombre, descripción, fecha
- ✅ Breadcrumbs de navegación

---

## Demostración de Navegación

### GIF de Navegación Completa

![Navegación FitFood](/public/images/recorrido.gif)

---

## Instrucciones de Ejecución

### Instalación
```
npm install
```

### Desarrollo
```
npm run dev
```
Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build
```
npm run build
```

### Credenciales de Prueba
- **Usuario**: `victor_98`
- **Contraseña**: `Admin123`

---

## Tecnologías Utilizadas

- **React 18.x**: Framework principal
- **React Router v6**: Gestión de navegación
- **Vite 7.3.1**: Build tool
- **CSS3**: Estilos (sin frameworks externos)
- **Context API**: Gestión de estado de autenticación
- **localStorage**: Persistencia de sesión y datos de usuario
