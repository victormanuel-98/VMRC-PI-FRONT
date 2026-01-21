# 📁 Estructura del Proyecto FitFood - Sprint 8

## 🗂️ Organización de Carpetas

```
fitfood-app/
├── public/                           # Archivos estáticos públicos
│   ├── logoFitFood.png              # Logo principal
│   └── platos/                      # Imágenes de recetas
│       ├── receta-pizza.png
│       ├── receta-batido.png
│       └── ... (más imágenes)
│
├── src/                             # Código fuente de la aplicación
│   ├── components/                  # Componentes reutilizables
│   │   ├── Header.jsx              # Header con búsqueda, logo y usuario
│   │   ├── Navigation.jsx          # Barra de navegación principal
│   │   ├── Footer.jsx              # Footer con enlaces y redes sociales
│   │   └── ProtectedRoute.jsx      # HOC para proteger rutas privadas
│   │
│   ├── context/                     # Contextos de React
│   │   └── AuthContext.jsx         # Contexto de autenticación global
│   │
│   ├── layouts/                     # Layouts de página
│   │   ├── PublicLayout.jsx        # Layout para rutas públicas (sin nav)
│   │   └── PrivateLayout.jsx       # Layout para rutas privadas (con nav)
│   │
│   ├── pages/                       # Páginas/Vistas de la aplicación
│   │   ├── Login.jsx               # Página de inicio de sesión
│   │   ├── Register.jsx            # Página de registro de usuario
│   │   ├── Home.jsx                # Página principal (hero + carrusel)
│   │   ├── Profile.jsx             # Perfil de usuario
│   │   ├── MyRecipes.jsx           # Listado de recetas personales
│   │   ├── RecipeDetail.jsx        # Vista detallada de receta
│   │   ├── CreateRecipe.jsx        # Formulario crear receta
│   │   ├── Contact.jsx             # Página de contacto
│   │   ├── Settings.jsx            # Configuración de la app
│   │   ├── BreakfastRecipes.jsx    # Recetas de desayuno
│   │   ├── NotFound.jsx            # Página 404
│   │   └── Forbidden.jsx           # Página 403
│   │
│   ├── styles/                      # Estilos consolidados
│   │   └── styles.css              # ✨ ARCHIVO CSS ÚNICO (consolidado)
│   │
│   ├── App.jsx                      # Componente raíz con router
│   └── main.jsx                     # Punto de entrada de la aplicación
│
├── docs/                            # Documentación del proyecto
│   ├── figma/                       # Capturas de diseño Figma
│   ├── screenshots/                 # Capturas implementación final
│   └── demo/                        # GIFs de demostración
│
├── README.md                        # Documentación principal Sprint 8
├── package.json                     # Dependencias del proyecto
└── vite.config.js                   # Configuración de Vite

```

---

## 📦 Componentes por Categoría

### 🔓 Componentes Públicos (Sin autenticación)
- **Login.jsx** - Formulario de inicio de sesión
- **Register.jsx** - Formulario de registro de usuario
- **NotFound.jsx** - Página 404 (ruta no encontrada)
- **Forbidden.jsx** - Página 403 (sin permisos)

### 🔐 Componentes Privados (Requieren autenticación)
- **Home.jsx** - Página principal con hero y carrusel de recetas
- **Profile.jsx** - Edición de perfil de usuario
- **MyRecipes.jsx** - Grid de recetas personales (con estados Loading/Empty/Error)
- **RecipeDetail.jsx** - Vista detallada de una receta
- **CreateRecipe.jsx** - Formulario para crear nueva receta
- **Contact.jsx** - Formulario de contacto con información
- **Settings.jsx** - Configuración de la aplicación
- **BreakfastRecipes.jsx** - Listado de recetas de desayuno

### 🧩 Componentes Compartidos
- **Header.jsx** - Header global (search, logo, dropdown usuario)
- **Navigation.jsx** - Navegación con dropdowns (MIS RECETAS, PLATOS)
- **Footer.jsx** - Footer con enlaces y redes sociales
- **ProtectedRoute.jsx** - Higher Order Component para proteger rutas

### 🎨 Layouts
- **PublicLayout.jsx** - Layout minimalista (solo contenido, sin header/nav/footer)
- **PrivateLayout.jsx** - Layout completo (incluye header, navigation, footer)

### 🌐 Context API
- **AuthContext.jsx** - Gestión global de autenticación
  - Estado: `isAuthenticated`, `user`, `loading`
  - Métodos: `login()`, `logout()`
  - Persistencia en localStorage

---

## 🎨 Consolidación de CSS

### ✨ Archivo Único: `src/styles/styles.css`

**Estructura del archivo consolidado:**

```css
/* ========== ESTILOS GLOBALES - FITFOOD ========== */
- Reset CSS
- Variables globales (:root)
- Estilos de body, html
- Tipografía (Italianno font)
- Enlaces y botones globales
- Animaciones globales (fadeIn, slideDown, slideUp, spin)

/* ========== APP ========== */
- Contenedor principal .App
- Estilos base de la aplicación

/* ========== COMPONENTES ========== */
- Header (search, logo, user dropdown, logout modal)
- Navigation (nav bar, dropdowns)
- Footer (logo, columns, social icons)

/* ========== PÁGINAS ========== */
- Login (welcome section, login card, form)
- Register (form, photo upload, validation)
- Home (hero, carousel, navigation buttons)
- Profile (form, avatar, success message)
- MyRecipes (grid, cards, estados: loading/empty/error)
- RecipeDetail (detail view, ingredients)
- CreateRecipe (form, ingredient inputs, description)
- Contact (form, info cards)
- Settings (configuration sections, save button)
- BreakfastRecipes (grid de recetas de desayuno)
- NotFound (404 page design)
- Forbidden (403 page design)
```

### 📊 Estadísticas de Consolidación

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Archivos CSS | 17 archivos | 1 archivo | -94% |
| Importaciones | 17 imports | 1 import | -94% |
| Duplicados | Múltiples resets | 1 reset global | 100% |
| Animaciones | 4 duplicadas | Globales | 75% |
| Mantenibilidad | Baja (disperso) | Alta (centralizado) | ↑ |

---

## 🔄 Cambios Realizados

### ✅ Consolidación CSS
1. ✨ Creado `src/styles/styles.css` con TODO el CSS
2. 🗑️ Eliminados 17 archivos CSS individuales
3. 🔗 Actualizada única importación en `App.jsx`
4. 🧹 Eliminadas importaciones CSS en todos los componentes/páginas

### ✅ Optimizaciones
- ✂️ Eliminados estilos duplicados (reset, animations)
- 📏 Unificadas clases compartidas (buttons, forms, cards)
- 🎯 Mantenida toda la funcionalidad original
- 📱 Conservados todos los responsive breakpoints

### ✅ Estructura de Carpetas
- 📁 Creada carpeta `src/styles/` para estilos
- 📁 Ya existían `components/`, `pages/`, `layouts/`, `context/`
- 📄 README.md con documentación completa del Sprint 8

---

## 🚀 Ventajas de la Nueva Estructura

### 1. **Mantenibilidad**
- ✅ Todo el CSS en un solo lugar
- ✅ Fácil búsqueda y modificación
- ✅ No hay estilos duplicados

### 2. **Rendimiento**
- ✅ Una sola carga de CSS
- ✅ Menos HTTP requests
- ✅ Bundle más pequeño

### 3. **Organización**
- ✅ Secciones claramente delimitadas con comentarios
- ✅ Orden lógico: Global → Componentes → Páginas
- ✅ Fácil navegación con Ctrl+F

### 4. **Escalabilidad**
- ✅ Fácil añadir nuevos estilos en la sección correspondiente
- ✅ Estructura clara y predecible
- ✅ Preparado para migrar a CSS Modules o Styled Components si es necesario

---

## 📝 Guía de Uso

### Añadir estilos nuevos

```css
/* En src/styles/styles.css */

/* ========== PÁGINAS ========== */
/* ... estilos existentes ... */

/* Nueva Página - Ejemplo */
.nueva-pagina {
    background: #d4a88a;
    padding: 2rem;
}

.nueva-pagina-titulo {
    font-size: 2rem;
    color: white;
}
```

### Importar estilos en nuevos componentes

```jsx
// ❌ NO HACER (antes)
import './MiComponente.css';

// ✅ HACER (ahora) - NO importar nada
// Los estilos ya están cargados globalmente desde App.jsx
```

### Buscar estilos específicos

```bash
# En VSCode: Ctrl+F en styles.css
# Buscar por sección: "/* ========== COMPONENTES =========="
# Buscar por clase: ".header", ".login-card", etc.
```

---

## 🎯 Checklist de Limpieza Completado

- [x] Consolidar todos los CSS en `styles/styles.css`
- [x] Eliminar archivos CSS individuales
- [x] Actualizar importaciones en App.jsx
- [x] Eliminar imports CSS de componentes
- [x] Eliminar imports CSS de páginas
- [x] Verificar no hay código CSS duplicado
- [x] Mantener toda la funcionalidad visual
- [x] Documentar nueva estructura
- [x] Crear README de estructura de proyecto

---

## 📚 Próximos Pasos Recomendados

### Opcional - Mejoras Futuras

1. **CSS Modules** (si el proyecto crece mucho)
   ```jsx
   import styles from './Component.module.css';
   <div className={styles.container}>
   ```

2. **Styled Components** (para componentes muy dinámicos)
   ```jsx
   const Button = styled.button`
     background: ${props => props.primary ? 'blue' : 'gray'};
   `;
   ```

3. **Sass/SCSS** (para variables y mixins)
   ```scss
   $primary-color: #5a8090;
   @mixin flex-center { display: flex; justify-content: center; }
   ```

4. **Tailwind CSS** (utility-first approach)
   ```jsx
   <div className="flex items-center justify-center p-4 bg-blue-500">
   ```

**Nota**: Por ahora, el CSS consolidado es la mejor opción para este proyecto, ya que mantiene simplicidad y no requiere configuraciones adicionales.

---

## 👨‍💻 Autor

**Victor Manuel Ridao Chaves**

Proyecto Intermodular - Sprint 8  
Fecha: Enero 2026

---

**Fin de la documentación de estructura**
